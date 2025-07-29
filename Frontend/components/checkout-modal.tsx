"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  X,
  MapPin,
  User,
  Mail,
  Phone,
  Tag,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useSnapPayment } from "@/hooks/useSnapPayment";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface VoucherData {
  id: number;
  code: string;
  name: string;
  discountAmount: number;
}

interface VoucherValidationResult {
  success: boolean;
  message: string;
  voucher?: VoucherData;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { cart, calculateTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const { pay, isReady } = useSnapPayment(
    process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "",
    false // ← Langsung false, paling simple
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Voucher state
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<VoucherData | null>(
    null
  );
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [isValidatingVoucher, setIsValidatingVoucher] = useState(false);
  const [voucherError, setVoucherError] = useState("");
  const [availableVouchers, setAvailableVouchers] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSnap, setShowSnap] = useState(false);
  const [snapToken, setSnapToken] = useState<string | null>(null);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [hasTriggeredSnap, setHasTriggeredSnap] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  // Handle animation timing
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Load available vouchers when modal opens
      fetchAvailableVouchers();
    } else {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Pre-fill form with user data
  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: "",
      });
    }
  }, [user, isOpen]);

  // Clean up Snap state
  useEffect(() => {
    return () => {
      setShowSnap(false);
      setSnapToken(null);
      setReceiptData(null);
      setHasTriggeredSnap(false);
      setOrderNumber(null);
      // Reset voucher state
      setVoucherCode("");
      setAppliedVoucher(null);
      setVoucherDiscount(0);
      setVoucherError("");
      if (window.snap) {
        try {
          window.snap.hide();
        } catch (error) {
          console.warn("Failed to hide Snap:", error);
        }
      }
    };
  }, []);

  // Fetch available vouchers
  const fetchAvailableVouchers = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/vouchers/active",
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.success) {
        setAvailableVouchers(data.vouchers);
      }
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate voucher
  const validateVoucher = async (code: string) => {
    if (!code.trim()) {
      setAppliedVoucher(null);
      setVoucherDiscount(0);
      setVoucherError("");
      return;
    }

    setIsValidatingVoucher(true);
    setVoucherError("");

    try {
      const subtotal = calculateTotal();
      const shipping = 15000;
      const total = subtotal + shipping;

      const response = await fetch(
        "http://localhost:3000/api/vouchers/validate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            voucherCode: code.toUpperCase(),
            total: total,
            email: formData.email || user?.email,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setAppliedVoucher(data.voucher);
        setVoucherDiscount(data.voucher.discountAmount);
        setVoucherError("");
        toast({
          title: "Voucher Applied!",
          description: `${
            data.voucher.name
          } - Hemat Rp ${data.voucher.discountAmount.toLocaleString()}`,
        });
      } else {
        setAppliedVoucher(null);
        setVoucherDiscount(0);
        setVoucherError(data.message);
      }
    } catch (error) {
      console.error("Error validating voucher:", error);
      setVoucherError("Gagal memvalidasi voucher. Coba lagi.");
      setAppliedVoucher(null);
      setVoucherDiscount(0);
    } finally {
      setIsValidatingVoucher(false);
    }
  };

  // Handle voucher code input
  const handleVoucherCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setVoucherCode(value);

    // Debounce validation
    const timeoutId = setTimeout(() => {
      validateVoucher(value);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  // Remove applied voucher
  const removeVoucher = () => {
    setVoucherCode("");
    setAppliedVoucher(null);
    setVoucherDiscount(0);
    setVoucherError("");
  };

  // Apply voucher from available list
  const applyVoucherFromList = (code: string) => {
    setVoucherCode(code);
    validateVoucher(code);
  };

  // Update the payment method in database after Midtrans payment
  const updatePaymentMethod = async (paymentData: any) => {
    if (!orderNumber) return;

    try {
      const updateData = {
        paymentMethod: paymentData.payment_type,
        transactionStatus: paymentData.transaction_status,
        transactionId: paymentData.transaction_id,
      };

      console.log("Updating payment method with data:", updateData);

      const response = await fetch(
        `http://localhost:3000/api/orders/${orderNumber}/payment-update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(updateData),
        }
      );

      const result = await response.json();
      console.log("Payment method update result:", result);

      if (!result.success) {
        console.error("Failed to update payment method:", result.error);
      }
    } catch (error) {
      console.error("Error updating payment method:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.address
    ) {
      toast({
        title: "Formulir Belum Lengkap",
        description: "Isi semua kolom dulu ya!",
        variant: "destructive",
      });
      return;
    }

    if (!isReady) {
      toast({
        title: "Error Pembayaran",
        description: "Sistem pembayaran belum siap. Coba lagi nanti.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const subtotal = calculateTotal();
    const shipping = 15000;
    const totalBeforeDiscount = subtotal + shipping;
    const total = totalBeforeDiscount - voucherDiscount;

    console.log("Cart items before creating order:", cart);
    cart.forEach((item, index) => {
      console.log(`Cart item ${index} image:`, item.image);
    });

    const cartItemsWithImages = cart.map((item) => ({
      ...item,
      image: item.image || "/placeholder.svg",
    }));

    const orderData = {
      customerName: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      items: cartItemsWithImages,
      subtotal,
      shipping,
      total,
      paymentMethod: "all", // Initial payment method, will be updated after Midtrans transaction
      voucherCode: appliedVoucher?.code || null,
      voucherDiscount: voucherDiscount,
    };

    console.log("Order data sent to backend:", orderData);

    try {
      const response = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      console.log("Backend response:", data);

      if (data.success) {
        const newReceiptData = {
          ...orderData,
          orderNumber: data.orderNumber,
          orderDate: new Date().toISOString(),
          snapToken: data.snapToken,
          paymentMethod: data.paymentMethod || "all",
          transactionStatus: "pending",
          appliedVoucher: appliedVoucher,
        };

        setOrderNumber(data.orderNumber);
        console.log("Receipt data before storage:", newReceiptData);
        console.log("Receipt items with images:", newReceiptData.items);
        sessionStorage.setItem(
          "transactionData",
          JSON.stringify(newReceiptData)
        );
        setReceiptData(newReceiptData);

        setSnapToken(data.snapToken);
        setShowSnap(true);
        onClose(); // Close modal
      } else {
        throw new Error(data.error || "Gagal membuat pesanan");
      }
    } catch (error) {
      console.error("Order creation error:", error);
      const fallbackReceiptData = {
        ...orderData,
        orderNumber: `ORD-${Date.now().toString().slice(-8)}`,
        orderDate: new Date().toISOString(),
        paymentMethod: "all",
        transactionStatus: "pending",
        appliedVoucher: appliedVoucher,
      };

      console.log(
        "Receipt data before storage (error fallback):",
        fallbackReceiptData
      );
      console.log(
        "Receipt items with images (error fallback):",
        fallbackReceiptData.items
      );

      sessionStorage.setItem(
        "transactionData",
        JSON.stringify(fallbackReceiptData)
      );
      clearCart();
      onClose();
      router.push("/transaction-success");

      toast({
        title: "Pesanan Diproses",
        description: "Pesanan kamu berhasil diproses (mode demo).",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Snap popup
  useEffect(() => {
    if (showSnap && snapToken && isReady && receiptData && !hasTriggeredSnap) {
      console.log("Calling snap.pay with token:", snapToken);
      setHasTriggeredSnap(true); // Set flag to prevent multiple calls
      pay(snapToken, {
        onSuccess: async (result: any) => {
          console.log("Payment success:", result);

          // Update payment method in database
          await updatePaymentMethod(result);

          const updatedReceiptData = {
            ...receiptData,
            paymentMethod: result.payment_type || "all",
            transactionStatus: result.transaction_status || "success",
          };
          sessionStorage.setItem(
            "transactionData",
            JSON.stringify(updatedReceiptData)
          );
          clearCart();
          setShowSnap(false);
          setHasTriggeredSnap(false);
          router.push("/transaction-success");
          toast({
            title: "Pembayaran Berhasil",
            description: "Pesanan kamu sudah diproses.",
          });
        },
        onPending: async (result: any) => {
          console.log("Payment pending:", result);

          // Update payment method in database
          await updatePaymentMethod(result);

          const updatedReceiptData = {
            ...receiptData,
            paymentMethod: result.payment_type || "all",
            transactionStatus: result.transaction_status || "pending",
          };
          sessionStorage.setItem(
            "transactionData",
            JSON.stringify(updatedReceiptData)
          );
          clearCart();
          setShowSnap(false);
          setHasTriggeredSnap(false);
          router.push("/transaction-success");
          toast({
            title: "Pembayaran Pending",
            description: "Pembayaran kamu sedang diproses.",
          });
        },
        onError: (result: any) => {
          console.error("Payment error:", result);
          setShowSnap(false);
          setHasTriggeredSnap(false);
          toast({
            title: "Pembayaran Gagal",
            description: "Ada masalah dengan pembayaran. Coba lagi ya!",
            variant: "destructive",
          });
        },
        onClose: () => {
          console.log("Payment popup closed");
          setShowSnap(false);
          setHasTriggeredSnap(false);
          toast({
            title: "Pembayaran Dibatalkan",
            description:
              "Kamu nutup jendela pembayaran. Selesaikan pembayaran buat lanjut.",
            variant: "destructive",
          });
        },
      });
    }
  }, [
    showSnap,
    snapToken,
    isReady,
    receiptData,
    pay,
    clearCart,
    router,
    toast,
    hasTriggeredSnap,
    orderNumber,
  ]);

  // Handle clicking outside to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen && !isAnimating) return null;

  const subtotal = calculateTotal();
  const shipping = 15000;
  const totalBeforeDiscount = subtotal + shipping;
  const total = totalBeforeDiscount - voucherDiscount;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-start justify-center bg-black transition-opacity duration-300 ${
        isOpen ? "bg-opacity-80" : "bg-opacity-0 pointer-events-none"
      }`}
      onClick={handleBackdropClick}
    >
      <div
        className={`relative bg-white dark:bg-gray-900 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto mt-8 transition-all duration-300 transform ${
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        } shadow-2xl`}
      >
        <div className="sticky top-0 z-10 flex justify-between items-center p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Checkout{" "}
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              ({totalItems} items)
            </span>
          </h2>
          <button
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            onClick={onClose}
            aria-label="Close checkout"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Ringkasan Pesanan
            </h3>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0 last:pb-0"
                  >
                    <div className="w-16 h-16 relative rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error(
                              `Error loading image for ${item.name}:`,
                              item.image
                            );
                            (e.target as HTMLImageElement).src =
                              "/placeholder.svg";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                          <span className="text-xs text-gray-500">
                            No Image
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </h4>
                      <div className="flex justify-between items-center mt-1">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Rp. {item.price.toLocaleString()}
                          </span>
                          <span className="mx-2 text-gray-400">×</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {item.quantity}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          Rp. {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="checkout-form">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Detail Pengiriman
              </h3>

              <form
                id="checkout-form"
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="input-group relative">
                  <User
                    className="absolute left-3 top-3 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    id="checkout-name"
                    name="name"
                    placeholder="Nama Lengkap"
                    required
                    className="w-full p-2 pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500/20 border border-gray-200 dark:border-gray-700 focus:border-amber-500"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-group relative">
                  <Mail
                    className="absolute left-3 top-3 text-gray-400"
                    size={18}
                  />
                  <input
                    type="email"
                    id="checkout-email"
                    name="email"
                    placeholder="Email"
                    required
                    className="w-full p-2 pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500/20 border border-gray-200 dark:border-gray-700 focus:border-amber-500"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-group relative">
                  <Phone
                    className="absolute left-3 top-3 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    id="checkout-phone"
                    name="phone"
                    placeholder="No. Telepon"
                    required
                    className="w-full p-2 pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500/20 border border-gray-200 dark:border-gray-700 focus:border-amber-500"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-group relative">
                  <MapPin
                    className="absolute left-3 top-3 text-gray-400"
                    size={18}
                  />
                  <textarea
                    id="checkout-address"
                    name="address"
                    placeholder="Alamat Lengkap"
                    required
                    className="w-full p-2 pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500/20 border border-gray-200 dark:border-gray-700 focus:border-amber-500 min-h-[80px]"
                    value={formData.address}
                    onChange={handleChange}
                  ></textarea>
                </div>

                {/* Voucher Section */}
                <div className="voucher-section">
                  <h4 className="text-md font-semibold mb-3 text-gray-900 dark:text-white">
                    Kode Voucher
                  </h4>

                  {/* Voucher Input */}
                  <div className="input-group relative mb-3">
                    <Tag
                      className="absolute left-3 top-3 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      placeholder="Masukkan kode voucher"
                      className="w-full p-2 pl-10 pr-12 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500/20 border border-gray-200 dark:border-gray-700 focus:border-amber-500"
                      value={voucherCode}
                      onChange={handleVoucherCodeChange}
                      disabled={isValidatingVoucher}
                    />
                    {isValidatingVoucher && (
                      <div className="absolute right-3 top-3">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-500"></div>
                      </div>
                    )}
                  </div>

                  {/* Voucher Status */}
                  {appliedVoucher && (
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-md mb-3">
                      <div className="flex items-center">
                        <CheckCircle
                          className="text-green-500 mr-2"
                          size={16}
                        />
                        <div>
                          <p className="text-sm font-medium text-green-800 dark:text-green-200">
                            {appliedVoucher.name}
                          </p>
                          <p className="text-xs text-green-600 dark:text-green-300">
                            Hemat Rp{" "}
                            {appliedVoucher.discountAmount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeVoucher}
                        className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  )}

                  {voucherError && (
                    <div className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-md mb-3">
                      <XCircle className="text-red-500 mr-2" size={16} />
                      <p className="text-sm text-red-800 dark:text-red-200">
                        {voucherError}
                      </p>
                    </div>
                  )}

                  {/* Available Vouchers */}
                  {availableVouchers.length > 0 && !appliedVoucher && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Voucher tersedia:
                      </p>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {availableVouchers.slice(0, 3).map((voucher: any) => (
                          <button
                            key={voucher.code}
                            type="button"
                            onClick={() => applyVoucherFromList(voucher.code)}
                            className="w-full text-left p-2 bg-gray-50 dark:bg-gray-800 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {voucher.code}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {voucher.name}
                                </p>
                              </div>
                              <span className="text-xs text-amber-600 dark:text-amber-400">
                                {voucher.discount_type === "percentage"
                                  ? `${voucher.discount_value}%`
                                  : `Rp ${voucher.discount_value.toLocaleString()}`}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>

            <div>
              <div className="checkout-total space-y-2 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between">
                  <p className="text-gray-600 dark:text-gray-400">Subtotal:</p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    Rp.{" "}
                    <span id="checkout-subtotal">
                      {subtotal.toLocaleString()}
                    </span>
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600 dark:text-gray-400">
                    Ongkos Kirim:
                  </p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    Rp.{" "}
                    <span id="checkout-shipping">
                      {shipping.toLocaleString()}
                    </span>
                  </p>
                </div>

                {voucherDiscount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <p>Diskon Voucher:</p>
                    <p className="font-medium">
                      - Rp. {voucherDiscount.toLocaleString()}
                    </p>
                  </div>
                )}

                <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-gray-900 dark:text-white">Total:</p>
                  <p className="text-gray-900 dark:text-white">
                    Rp.{" "}
                    <span id="checkout-total">{total.toLocaleString()}</span>
                  </p>
                </div>

                {voucherDiscount > 0 && (
                  <div className="text-center mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
                    <p className="text-sm text-green-600 dark:text-green-400">
                      🎉 Kamu hemat Rp {voucherDiscount.toLocaleString()} dengan
                      voucher {appliedVoucher?.code}!
                    </p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                form="checkout-form"
                className="w-full py-3 mt-6 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-md transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
                disabled={isSubmitting || !isReady}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Memproses...
                  </span>
                ) : (
                  `Bayar Rp ${total.toLocaleString()}`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
