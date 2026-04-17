/* eslint-disable no-unused-vars */
import { useLocation } from "react-router-dom";
import { useEffect, useRef, useCallback } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import {
  fetchCategories,
  fetchAllBrands,
  fetchActiveProducts,
  fetchBannerProducts
} from "../api/ApiService";

import Menu from "../components/shopSection/Menu";
import FilterHeader from "../components/all-products/FilterHeader";
import ProductGrid from "../components/all-products/ProductGrid";

const LIMIT = 1000; // 🔥 reduced for performance

function AllProduct() {
  const location = useLocation();
  const observer = useRef();

  const queryParams = new URLSearchParams(location.search);
  const brandId = queryParams.get("brand");
  const categoryId = queryParams.get("category");
  const bannerId = queryParams.get("bannerId");

  // ✅ 1. Fetch Menu (cached)
// ✅ Inside AllProduct.jsx
const { data: menuData = { categories: [], brands: [] } } = useQuery({
  queryKey: ["menuData"],
  queryFn: async () => {
    const [catRes, brandRes] = await Promise.all([
      fetchCategories(),
      fetchAllBrands()
    ]);

    return {
      // DRILL DOWN: Access .categories specifically
      categories: catRes?.data?.categories || catRes?.categories || catRes?.data || [],
      // DRILL DOWN: Access .brands specifically
      brands: brandRes?.data?.brands || brandRes?.brands || []
    };
  },
  staleTime: 1000 * 60 * 10
});

  // ✅ 2. Infinite Products Query
  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage
  } = useInfiniteQuery({
    queryKey: ["products", brandId, categoryId, bannerId],

    queryFn: async ({ pageParam = 1 }) => {
      let res =
        bannerId && bannerId !== "undefined"
          ? await fetchBannerProducts(bannerId)
          : await fetchActiveProducts({
              page: pageParam,
              limit: LIMIT,
              brand: brandId,
              category: categoryId
            });

      const products = res?.data?.products || res?.products || [];
      const currentPage = res?.data?.currentPage || 1;
      const totalPages = res?.data?.totalPages || 1;

      return {
        products,
        nextPage:
          currentPage < totalPages ? currentPage + 1 : undefined
      };
    },

    getNextPageParam: lastPage => lastPage.nextPage,

    staleTime: 1000 * 60 * 5, // 🔥 cache 5 min
    keepPreviousData: true
  });

  // ✅ Flatten products
  const products = data?.pages.flatMap(p => p.products) || [];

  // ✅ Infinite Scroll (optimized)
  const lastItemRef = useCallback(
    node => {
      if (isFetchingNextPage || !hasNextPage) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting) {
            fetchNextPage();
          }
        },
        {
          rootMargin: "200px" // 🔥 preload early
        }
      );

      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage]
  );

  return (
    <div className="min-h-screen bg-gray-50/30">
      <Menu
        categories={menuData.categories}
        brands={menuData.brands}
      />

      <section className="max-w-7xl mx-auto px-4 py-8">
        <FilterHeader
          menuData={menuData}
          brandId={brandId}
          categoryId={categoryId}
          bannerId={bannerId}
          productCount={products.length}
        />

        <ProductGrid
          products={products}
          loading={isLoading || isFetchingNextPage}
          lastItemRef={lastItemRef}
          hasFetched={!isLoading}
        />
      </section>
    </div>
  );
}

export default AllProduct;