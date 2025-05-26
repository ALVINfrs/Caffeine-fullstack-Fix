"use client";

import { useState } from "react";
import { Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import CheckoutModal from "./checkout-modal";

interface ShoppingCartPanelProps {
  isOpen: boolean;
}

export default function ShoppingCartPanel({ isOpen }: ShoppingCartPanelProps) {
  const { cart, removeFromCart, updateQuantity, clearCart, calculateTotal } =
    useCart();
  const { toast } = useToast();
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  const handleClearCart = () => {
    if (confirm("Apakah Anda yakin ingin mengosongkan keranjang?")) {
      clearCart();
      toast({
        title: "Keranjang Kosong",
        description: "Keranjang belanja telah dikosongkan",
        variant: "warning",
      });
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Keranjang Kosong",
        description: "Tidak ada produk di keranjang belanja",
        variant: "destructive",
      });
      return;
    }
    console.log("Cart items before checkout:", cart);
    setIsCheckoutModalOpen(true);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <div
        className={`fixed top-[80px] right-4 z-50 w-[95vw] max-w-xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl transition-all duration-300 transform overflow-hidden ${
          isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        } h-[90vh] max-h-screen flex flex-col`}
      >
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">
            Keranjang Belanja
          </h2>
          {totalItems > 0 && (
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              {totalItems} item
            </span>
          )}
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="mx-auto h-10 w-10 text-neutral-400 mb-4" />
              <p className="text-neutral-500 dark:text-neutral-400">
                Keranjang belanja kosong
              </p>
            </div>
          ) : (
            cart.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="flex items-center justify-between gap-4 bg-neutral-100 dark:bg-neutral-800 p-4 rounded-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border border-neutral-300 dark:border-neutral-700">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900 dark:text-white text-sm sm:text-base">
                      {item.name}
                    </h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Rp {item.price.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      className="w-6 h-6 bg-neutral-300 dark:bg-neutral-700 text-sm rounded-full hover:bg-amber-600 hover:text-white"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-neutral-800 dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      className="w-6 h-6 bg-neutral-300 dark:bg-neutral-700 text-sm rounded-full hover:bg-amber-600 hover:text-white"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <div className="text-sm font-semibold text-neutral-900 dark:text-white whitespace-nowrap">
                    Rp {(item.price * item.quantity).toLocaleString()}
                  </div>
                  <button
                    className="text-red-500 hover:text-red-400 self-start sm:self-auto"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <>
            <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-700">
              <p className="text-right text-lg font-semibold text-neutral-900 dark:text-white">
                Total: Rp {calculateTotal().toLocaleString()}
              </p>
            </div>

            <div className="flex justify-between px-6 pb-6 pt-2 gap-4">
              <button
                className="flex-1 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all text-sm shadow-md"
                onClick={handleClearCart}
              >
                Bersihkan
              </button>
              <button
                className="flex-1 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-all text-sm shadow-md"
                onClick={handleCheckout}
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
      />
    </>
  );
}
