"use client";

import { useEffect, useState } from "react";
import { Check, ShoppingBag, ArrowLeft, Printer, Home } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface TransactionData {
  orderNumber: string;
  orderDate: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: any[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  transactionStatus?: string;
  voucherCode?: string;
  voucherName?: string;
  voucherDescription?: string;
  voucherDiscount?: number;
}

export default function TransactionSuccessPage() {
  const [transactionData, setTransactionData] =
    useState<TransactionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const orderIdFromUrl = searchParams.get("orderId");

    const loadTransactionData = async () => {
      // First check sessionStorage for newly completed transactions
      const storedData = sessionStorage.getItem("transactionData");

      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);

          // Store in localStorage with the order number as key for persistence
          if (parsedData.orderNumber) {
            localStorage.setItem(
              `transaction_${parsedData.orderNumber}`,
              storedData
            );
          }

          // Ensure all items have image property
          if (parsedData.items) {
            parsedData.items = parsedData.items.map((item: any) => ({
              ...item,
              image: item.image || "/placeholder.svg",
            }));
          }

          setTransactionData(parsedData);
        } catch (error) {
          console.error("Error parsing transaction data from session:", error);
        }
      }
      // If no session data, try localStorage or fetch from backend
      else if (orderIdFromUrl) {
        // Try localStorage first
        const localData = localStorage.getItem(`transaction_${orderIdFromUrl}`);
        if (localData) {
          try {
            const parsedData = JSON.parse(localData);
            parsedData.items = parsedData.items.map((item: any) => ({
              ...item,
              image: item.image || "/placeholder.svg",
            }));
            setTransactionData(parsedData);
          } catch (error) {
            console.error(
              "Error parsing transaction data from localStorage:",
              error
            );
          }
        }
        // If no localStorage data, fetch from backend
        else {
          try {
            const response = await fetch(`/api/orders/${orderIdFromUrl}`);
            if (response.ok) {
              const orderData = await response.json();
              const formattedData: TransactionData = {
                orderNumber: orderData.order.order_number,
                orderDate: orderData.order.order_date,
                customerName: orderData.order.customer_name,
                email: orderData.order.email,
                phone: orderData.order.phone,
                address: orderData.order.address,
                items: orderData.items.map((item: any) => ({
                  ...item,
                  image: item.image || "/placeholder.svg",
                })),
                subtotal: orderData.order.subtotal,
                shipping: orderData.order.shipping_fee,
                total: orderData.order.total,
                paymentMethod: orderData.order.payment_method,
                transactionStatus: orderData.order.status,
                voucherCode: orderData.order.voucher_code,
                voucherName: orderData.order.voucher_name,
                voucherDescription: orderData.order.voucher_description,
                voucherDiscount: orderData.order.voucher_discount,
              };
              // Store in localStorage for future refreshes
              localStorage.setItem(
                `transaction_${orderIdFromUrl}`,
                JSON.stringify(formattedData)
              );
              setTransactionData(formattedData);
            }
          } catch (error) {
            console.error(
              "Error fetching transaction data from backend:",
              error
            );
          }
        }
      }

      setIsLoading(false);
    };

    loadTransactionData();

    const timeoutId = setTimeout(() => {
      sessionStorage.removeItem("transactionData");
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [searchParams]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPaymentMethodName = (method: string) => {
    if (!method || method === "all") return "Midtrans Payment";
    const methods: Record<string, string> = {
      bank_transfer: "Transfer Bank",
      cod: "Bayar di Tempat (COD)",
      ovo: "OVO",
      gopay: "GoPay",
      dana: "DANA",
      credit_card: "Credit Card",
      shopeepay: "ShopeePay",
    };
    return methods[method] || method;
  };

  const getTransactionStatus = (status?: string) => {
    if (!status) return "Pending";
    const statuses: Record<string, string> = {
      success: "Completed",
      pending: "Pending",
      settlement: "Completed",
      capture: "Completed",
      deny: "Failed",
      cancel: "Cancelled",
      expire: "Expired",
    };
    return statuses[status.toLowerCase()] || status;
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!transactionData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">!</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">No Transaction Data Found</h1>
          <p className="text-gray-600 mb-6">
            We couldn't find any transaction data. This might happen if you
            accessed this page directly without completing a transaction.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
          >
            <Home size={18} className="mr-2" />
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden print:shadow-none">
        <div className="bg-green-600 text-white p-6 print:bg-white print:text-black print:border-b print:border-gray-200">
          <div className="flex items-center justify-center mb-4 print:flex print:justify-start">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center print:bg-transparent print:w-auto print:h-auto">
              <Check size={32} className="text-green-600 print:text-black" />
            </div>
            <img
              src="/logo.png"
              alt="Caffeine Logo"
              className="h-8 ml-4 hidden print:block"
            />
          </div>
          <h1 className="text-2xl font-bold text-center print:text-left">
            Transaksi Berhasil!
          </h1>
          <p className="text-center mt-2 text-green-100 dark:text-green-200 print:text-gray-600 print:text-left">
            Pesanan Anda telah berhasil diproses dan sedang disiapkan
          </p>
        </div>

        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4">
            <div>
              <h2 className="text-lg font-semibold dark:text-white">
                Order #{transactionData.orderNumber}
              </h2>
              <p className="text-sm text-gray-500">
                {formatDate(transactionData.orderDate)}
              </p>
              <p className="text-sm text-gray-500">
                Status:{" "}
                {getTransactionStatus(transactionData.transactionStatus)}
              </p>
            </div>
            <div className="mt-2 sm:mt-0 print:hidden">
              <button
                onClick={handlePrint}
                className="inline-flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-200 text-sm"
              >
                <Printer size={16} className="mr-1" />
                Print Receipt
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Shipping Information
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                <p className="text-gray-800 dark:text-gray-200">
                  <span className="font-medium">Name:</span>{" "}
                  {transactionData.customerName || "N/A"}
                </p>
                <p className="text-gray-800 dark:text-gray-200">
                  <span className="font-medium">Email:</span>{" "}
                  {transactionData.email || "N/A"}
                </p>
                <p className="text-gray-800 dark:text-gray-200">
                  <span className="font-medium">Phone:</span>{" "}
                  {transactionData.phone || "N/A"}
                </p>
                <p className="text-gray-800 dark:text-gray-200">
                  <span className="font-medium">Address:</span>{" "}
                  {transactionData.address || "N/A"}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Payment Information
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                <p className="text-gray-800 dark:text-gray-200">
                  <span className="font-medium">Payment Method:</span>{" "}
                  {getPaymentMethodName(transactionData.paymentMethod)}
                </p>
                <p className="text-gray-800 dark:text-gray-200">
                  <span className="font-medium">Subtotal:</span> Rp.{" "}
                  {transactionData.subtotal.toLocaleString()}
                </p>
                <p className="text-gray-800 dark:text-gray-200">
                  <span className="font-medium">Shipping:</span> Rp.{" "}
                  {transactionData.shipping.toLocaleString()}
                </p>
                {transactionData.voucherCode && (
                  <>
                    <p className="text-gray-800 dark:text-gray-200">
                      <span className="font-medium">Voucher:</span>{" "}
                      {transactionData.voucherName} (
                      {transactionData.voucherCode})
                    </p>
                    <p className="text-gray-800 dark:text-gray-200">
                      <span className="font-medium">Voucher Description:</span>{" "}
                      {transactionData.voucherDescription || "N/A"}
                    </p>
                    <p className="text-gray-800 dark:text-gray-200">
                      <span className="font-medium">Voucher Discount:</span>{" "}
                      -Rp.{" "}
                      {transactionData.voucherDiscount?.toLocaleString() || "0"}
                    </p>
                  </>
                )}
                <p className="text-gray-800 dark:text-gray-200 font-bold">
                  <span className="font-medium">Total:</span> Rp.{" "}
                  {transactionData.total.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
            Order Items
          </h3>
          <div className="border rounded-lg overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Product
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Quantity
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {(transactionData.items || []).map((item, index) => (
                    <tr key={`${item.id}-${index}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 relative rounded overflow-hidden">
                            {item.image ? (
                              <img
                                src={item.image}
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
                                <span className="text-[8px] text-gray-500">
                                  No Image
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {item.name || "Unknown Product"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-300">
                        Rp. {item.price ? item.price.toLocaleString() : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-300">
                        {item.quantity || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-white">
                        Rp.{" "}
                        {item.price && item.quantity
                          ? (item.price * item.quantity).toLocaleString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border-t pt-6 flex flex-col sm:flex-row justify-between items-center print:hidden">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-200 mb-4 sm:mb-0"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Home
            </Link>
            <Link
              href="/#menu"
              className="inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded"
            >
              <ShoppingBag size={16} className="mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400 print:hidden">
        <p>© {new Date().getFullYear()} Caffeine - All rights reserved.</p>
      </div>
    </div>
  );
}
