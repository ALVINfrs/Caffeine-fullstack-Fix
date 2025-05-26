"use client";

import type React from "react";
import { useState } from "react";
import { X, ShoppingCart, Plus, Minus } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export default function ProductDetailModal({
  isOpen,
  onClose,
  product,
}: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (product) {
      addToCart(
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image || "/placeholder.svg",
        },
        quantity
      );

      toast({
        title: "Added to cart",
        description: `${quantity} x ${product.name} added to your cart`,
      });

      setQuantity(1);
      onClose();
    }
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    quantity > 1 && setQuantity((prev) => prev - 1);
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen || !product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-3xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden transition-all">
        <button
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
          onClick={onClose}
        >
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="relative h-64 md:h-full w-full bg-neutral-100 dark:bg-neutral-800">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover rounded-l-2xl"
            />
          </div>

          <div className="p-6 md:p-8 space-y-5">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 dark:text-white">
                {product.name}
              </h2>
              <p className="text-xl font-medium text-amber-600 mt-1">
                Rp {product.price.toLocaleString()}
              </p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-neutral-700 dark:text-neutral-200 mb-1">
                Deskripsi
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
                onClick={decrementQuantity}
              >
                <Minus size={16} />
              </button>
              <span className="text-lg font-medium text-neutral-800 dark:text-white">
                {quantity}
              </span>
              <button
                className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
                onClick={incrementQuantity}
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition"
              onClick={handleAddToCart}
            >
              <ShoppingCart size={18} />
              Tambahkan ke Keranjang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
