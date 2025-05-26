// order-history.tsx
"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import ReceiptModal from "./receipt-modal";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/orders/user/orders",
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to load order history",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [toast]);

  const viewOrderReceipt = async (orderId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/orders/${orderId}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch order details");
      }

      const data = await response.json();

      console.log("Order data from API:", data);

      const itemsWithImages = await Promise.all(
        data.items.map(async (item: any) => {
          try {
            const productResponse = await fetch(
              `http://localhost:3000/api/products/${item.product_id}`,
              {
                credentials: "include",
              }
            );

            if (productResponse.ok) {
              const productData = await productResponse.json();
              console.log(`Product data for ${item.product_id}:`, productData);
              return {
                id: item.product_id,
                name: item.product_name,
                price: item.price,
                quantity: item.quantity,
                image:
                  productData.image ||
                  `/img/products/${item.product_id}.jpg` ||
                  "/placeholder.svg",
              };
            }
          } catch (err) {
            console.error(`Error fetching product ${item.product_id}:`, err);
          }

          return {
            id: item.product_id,
            name: item.product_name,
            price: item.price,
            quantity: item.quantity,
            image: `/img/products/${item.product_id}.jpg` || "/placeholder.svg",
          };
        })
      );

      console.log("Items with images:", itemsWithImages);

      // Parse the voucher data properly
      const voucherCode = data.order.voucher_code;
      const voucherName = data.order.voucher_name;
      const voucherDescription = data.order.voucher_description;
      const voucherDiscount = data.order.voucher_discount
        ? parseFloat(data.order.voucher_discount)
        : 0;

      console.log("Voucher data from order:", {
        voucherCode,
        voucherName,
        voucherDescription,
        voucherDiscount,
      });

      // Create appliedVoucher object if voucher exists
      const appliedVoucher = voucherCode
        ? {
            code: voucherCode,
            name: voucherName || voucherCode,
            description: voucherDescription || "",
            discountAmount: voucherDiscount,
          }
        : null;

      const receiptData = {
        orderId: data.order.id,
        orderNumber: data.order.order_number,
        orderDate: data.order.order_date,
        customerName: data.order.customer_name,
        email: data.order.email,
        phone: data.order.phone,
        address: data.order.address,
        items: itemsWithImages,
        subtotal: parseFloat(data.order.subtotal),
        shipping: parseFloat(data.order.shipping_fee),
        total: parseFloat(data.order.total),
        paymentMethod: data.order.payment_method,
        transactionStatus: data.order.status,
        // Add voucher data
        voucherCode: voucherCode,
        voucherName: voucherName,
        voucherDescription: voucherDescription,
        voucherDiscount: voucherDiscount,
        appliedVoucher: appliedVoucher,
      };

      console.log("Complete receipt data with voucher:", receiptData);

      setSelectedOrder(receiptData);
      setIsReceiptModalOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to load order details",
        variant: "destructive",
      });
    }
  };

  const getStatusDisplay = (status: string) => {
    const statusMap: Record<string, { text: string; className: string }> = {
      settlement: { text: "Selesai", className: "bg-green-900 text-green-300" },
      pending: {
        text: "Menunggu Pembayaran",
        className: "bg-yellow-900 text-yellow-300",
      },
      capture: { text: "Selesai", className: "bg-green-900 text-green-300" },
      challenge: {
        text: "Dalam Review",
        className: "bg-blue-900 text-blue-300",
      },
      deny: { text: "Ditolak", className: "bg-red-900 text-red-300" },
      cancel: { text: "Dibatalkan", className: "bg-red-900 text-red-300" },
      expire: { text: "Kadaluwarsa", className: "bg-gray-900 text-gray-300" },
    };
    return (
      statusMap[status.toLowerCase()] || {
        text: status,
        className: "bg-gray-900 text-gray-300",
      }
    );
  };

  if (loading) {
    return (
      <div className="order-history p-4 bg-gray-800 rounded-lg">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-history p-4 bg-gray-800 rounded-lg">
        <div className="text-red-500 text-center py-4">
          <p>Gagal memuat riwayat pesanan</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="order-history p-4 bg-gray-800 rounded-lg">
        <div className="empty-orders text-center py-4">
          <p>Belum ada riwayat pesanan</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="order-history p-4 bg-gray-800 rounded-lg">
        <div className="orders-container space-y-4" id="ordersContainer">
          {orders.map((order: any) => (
            <div
              key={order.id}
              className="order bg-gray-700 rounded-lg overflow-hidden"
            >
              <div className="order-header p-3 bg-gray-900 flex justify-between items-center">
                <h4 className="font-medium">Pesanan #{order.order_number}</h4>
                <p className="order-date text-sm text-gray-400">
                  {new Date(order.order_date).toLocaleDateString()}
                </p>
                <p
                  className={`order-status text-sm px-2 py-1 rounded-full ${
                    getStatusDisplay(order.status).className
                  }`}
                >
                  {getStatusDisplay(order.status).text}
                </p>
              </div>

              <div className="order-summary p-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="order-image w-12 h-12 bg-gray-800 rounded-md flex items-center justify-center">
                    <span className="text-2xl">☕</span>
                  </div>
                  <div>
                    <p>
                      {order.item_count} item(s) - Total: Rp.{" "}
                      {order.total.toLocaleString()}
                    </p>
                    {/* Show voucher info if exists */}
                    {order.voucher_code && (
                      <p className="text-xs text-green-400">
                        🎟️ Voucher: {order.voucher_code} (Hemat Rp{" "}
                        {order.voucher_discount
                          ? parseFloat(order.voucher_discount).toLocaleString()
                          : "0"}
                        )
                      </p>
                    )}
                  </div>
                </div>
                <button
                  className="btn view-receipt px-3 py-1 bg-amber-600 hover:bg-amber-700 rounded-md transition-colors text-sm"
                  onClick={() => viewOrderReceipt(order.id)}
                >
                  Lihat Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedOrder && (
        <ReceiptModal
          isOpen={isReceiptModalOpen}
          onClose={() => setIsReceiptModalOpen(false)}
          receiptData={selectedOrder}
        />
      )}
    </>
  );
}
