"use client";

import { useState, useEffect } from "react";
import { useProductContext } from "@/context/product-context";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import { Eye, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import ProductDetailModal from "./product-detail-modal";
import type { Product } from "@/types";
import { useInView } from "react-intersection-observer";

const preloadImage = (src: string | undefined) => {
  if (!src) return;
  const img = document.createElement("img");
  img.src = src;
};

export default function Menu() {
  const { products, loading, error, filteredProducts, filterProducts } =
    useProductContext();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [titleRef, titleInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [descRef, descInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [filtersRef, filtersInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (products && products.length > 0) {
      products.forEach((product) => {
        if (product.image) preloadImage(product.image);
      });
    }
  }, [products]);

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    filterProducts(filter);
  };

  const handleProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const handleAddToCart = (product: Product) => {
    const productWithImage = {
      ...product,
      image:
        product.image ||
        `/img/products/${product.id}.jpg` ||
        "/placeholder.svg",
    };
    addToCart(productWithImage, 1);
    toast({
      title: "Ditambahkan ke Keranjang",
      description: `${product.name} telah ditambahkan ke keranjang Anda`,
    });
  };

  if (loading) {
    return (
      <section id="menu" className="py-20 bg-amber-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="menu" className="py-20 bg-amber-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 flex justify-center items-center h-64">
          <div className="text-red-500 text-center">
            <p className="text-xl font-medium">Gagal memuat produk</p>
            <p className="text-sm mt-2">Silakan coba lagi nanti</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="menu" className="py-20 bg-amber-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2
          ref={titleRef}
          className={`text-4xl font-bold text-center mb-6 transition-opacity duration-700 ${
            titleInView ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="text-amber-600 dark:text-amber-500">Menu</span> Kami
        </h2>
        <p
          ref={descRef}
          className={`text-center max-w-3xl mx-auto mb-12 text-gray-700 dark:text-gray-300 font-serif text-base md:text-lg lg:text-xl leading-relaxed tracking-wide animate-[fadeInUp_0.8s_cubic-bezier(0.33,1,0.68,1)_forwards] ${
            descInView ? "opacity-100" : "opacity-0"
          } relative after:content-[''] after:absolute after:bottom-0 after:left-1/4 after:w-1/2 after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-amber-500 after:to-transparent after:opacity-0 after:transition-opacity after:duration-300 hover:after:opacity-100`}
        >
          Nikmati ragam pilihan kopi, non-coffee, dan makanan favorit—dari
          espresso, matcha, sampai indomie rebus dan nasi goreng. Semua siap
          nemenin kamu ngebut project{" "}
          <span className="text-amber-600 dark:text-amber-500 font-semibold">
            Next.js
          </span>
          , debug{" "}
          <span className="text-amber-600 dark:text-amber-500 font-semibold">
            Spring Boot
          </span>
          , atau ngoding full-stack pake{" "}
          <span className="text-amber-600 dark:text-amber-500 font-semibold">
            React
          </span>
          ,{" "}
          <span className="text-amber-600 dark:text-amber-500 font-semibold">
            Laravel
          </span>
          ,{" "}
          <span className="text-amber-600 dark:text-amber-500 font-semibold">
            Express
          </span>
          , hingga{" "}
          <span className="text-amber-600 dark:text-amber-500 font-semibold">
            Go
          </span>{" "}
          dan{" "}
          <span className="text-amber-600 dark:text-amber-500 font-semibold">
            Rust
          </span>
          . Coding nyaman, perut kenyang, fokus pun auto optimal.
        </p>
        <div
          ref={filtersRef}
          className={`flex flex-wrap justify-center gap-3 mb-10 transition-all duration-700 ${
            filtersInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          {[
            "all",
            "coffee",
            "non-coffee",
            "snack",
            "main-course",
            "dessert",
            "indonesian-food",
            "western-food",
            "instant-food",
          ].map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterClick(filter)}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                activeFilter === filter
                  ? "bg-gradient-to-r from-amber-700 to-amber-600 text-white shadow"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-white border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-amber-500"
              }`}
            >
              {filter
                .replace(/-/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())}
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl font-medium text-gray-500 dark:text-gray-400">
              Tidak ada produk dalam kategori ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transform transition duration-300 hover:-translate-y-1"
                style={{
                  animation: `fadeIn 0.4s ease-out forwards ${index * 0.1}s`,
                  opacity: 0,
                }}
              >
                <div className="relative h-60 overflow-hidden rounded-t-xl">
                  <Image
                    src={
                      product.image ||
                      `/img/products/${product.id}.jpg` ||
                      "/placeholder.svg"
                    }
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 truncate">
                    {product.name}
                  </h3>
                  <div className="flex mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className="text-amber-500 fill-current"
                      />
                    ))}
                  </div>
                  <div className="text-amber-600 dark:text-amber-500 font-bold text-xl mb-2">
                    Rp. {product.price.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                    {product.description}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleProductDetail(product)}
                      className="flex-1 px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-gray-700 to-gray-900 text-white hover:from-gray-800 hover:to-black transition"
                    >
                      <Eye size={16} className="inline mr-1" /> Detail
                    </button>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 text-white hover:from-amber-700 hover:to-amber-600 transition"
                    >
                      <ShoppingCart size={16} className="inline mr-1" /> Beli
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
        />
      )}
    </section>
  );
}
