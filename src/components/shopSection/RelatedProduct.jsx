/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { useQuery } from "@tanstack/react-query";

import { fetchActiveProducts } from "../../api/ApiService";
import ProductCard from "../ui/ProductCard"; 

import "swiper/css";

// --- SKELETON COMPONENT ---
const ProductSkeleton = () => (
  <div className="bg-gray-50 rounded-xl md:rounded-2xl overflow-hidden border border-gray-100 flex flex-col h-[320px] md:h-[400px] animate-pulse">
    <div className="h-40 sm:h-52 w-full bg-gray-200" />
    <div className="p-3 md:p-5 flex flex-col flex-grow space-y-3">
      <div className="h-3 bg-gray-200 rounded w-1/3" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
      </div>
      <div className="mt-auto flex items-center justify-between pt-2">
        <div className="h-6 bg-gray-200 rounded w-1/4" />
        <div className="h-8 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  </div>
);

const RelatedProducts = ({ brandId, currentProductId }) => {
  // ✅ Use useQuery to handle fetching, loading, and deduplication
  const { data: related = [], isLoading } = useQuery({
    // The queryKey ensures that if the product changes, the data refreshes
    queryKey: ["relatedProducts", brandId, currentProductId],
    queryFn: async () => {
      let productsToShow = [];

      // 1. Try fetching by Brand
      if (brandId) {
        const res = await fetchActiveProducts({ brand: brandId });
        const brandProducts = res?.data?.products || [];
        productsToShow = brandProducts.filter(
          (p) => String(p.productId || p._id) !== String(currentProductId)
        );
      }

      // 2. Fallback if no brand products found
      if (productsToShow.length < 2) {
        const fallbackRes = await fetchActiveProducts({ limit: 10 });
        const allProducts = fallbackRes?.data?.products || [];
        productsToShow = allProducts.filter(
          (p) => String(p.productId || p._id) !== String(currentProductId)
        );
      }

      return productsToShow;
    },
    // Only run the query if we actually have IDs to work with
    enabled: !!currentProductId,
    // Prevents re-fetching if the user navigates back and forth quickly
    staleTime: 1000 * 60 * 5, 
  });

  // Determine if we are showing fallback data (optional UI hint)
  // In React Query, you could derive this from the data length
  const isFallback = related.length > 0 && brandId ? false : true;

  if (!isLoading && related.length === 0) return null;

  return (
    <div className="mt-10 border-t border-gray-100 pt-10 px-2 md:px-0 mb-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-orange-500 text-xs font-black uppercase tracking-[0.2em] mb-1">
            Recommendation
          </h2>
          <h3 className="text-2xl font-bold text-gray-900">
            {related.length < 3 ? "Related Product" : "Related Products"}
          </h3>
        </div>
        <Link to="/all-products" className="text-sm font-bold text-orange-500 hover:underline">
          View All
        </Link>
      </div>

      <Swiper
        modules={[Autoplay]}
        spaceBetween={20}
        slidesPerView={1.5}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 2.2 },
          1024: { slidesPerView: 4 },
        }}
        className="pb-10 !px-1"
      >
        {isLoading
          ? [1, 2, 3, 4].map((i) => (
              <SwiperSlide key={`skeleton-${i}`}>
                <ProductSkeleton />
              </SwiperSlide>
            ))
          : related.map((item) => (
              <SwiperSlide key={item.productId || item._id} className="h-full">
                <ProductCard product={item} />
              </SwiperSlide>
            ))}
      </Swiper>
    </div>
  );
};

export default RelatedProducts;