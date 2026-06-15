/* eslint-disable no-unused-vars */
import ProductCard from "../../components/ui/ProductCard";
import ProductSkeleton from "../../components/ui/ProductSkeleton";
import AdSenseAd from "../../components/ui/AdSenseAd";

export default function ProductGrid({ 
  products = [], 
  loading, 
  lastItemRef, 
  hasFetched = false,
  error = null
}) {

  // ❌ Error State
  if (error) {
    return (
      <div className="text-center py-16 text-red-500 font-semibold">
        Failed to load products. Please try again.
      </div>
    );
  }

  // ❌ Empty State
  if (!loading && hasFetched && products.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 font-medium">
        No products found.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">

        {/* PRODUCTS with inline sponsored ad every 8 items */}
        {products.map((product, index) => (
          <>
            <div
              key={product.productId}
              ref={index === products.length - 1 ? lastItemRef : null}
            >
              <ProductCard product={product} />
            </div>

            {(index + 1) % 8 === 0 && index !== products.length - 1 && (
              <div key={`ad-${index}`} className="col-span-2 lg:col-span-4">
                <div className="relative">
                  <span className="absolute top-1 left-2 text-[10px] text-gray-400 uppercase tracking-wide">
                    Sponsored
                  </span>
                  {/* Replace slot value with your real AdSense ad slot ID */}
                  <AdSenseAd slot="1060697153" format="horizontal" className="py-2" />
                </div>
              </div>
            )}
          </>
        ))}

        {/* INITIAL LOADING (SKELETON) */}
        {loading && !hasFetched && (
          [...Array(8)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))
        )}
      </div>

      {/* LOAD MORE LOADER */}
      {loading && hasFetched && (
        <div className="flex flex-col items-center justify-center py-12 w-full gap-3">
          <div className="w-10 h-10 border-4 border-[#E68736] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 text-sm font-medium animate-pulse">
            Loading products...
          </p>
        </div>
      )}
    </>
  );
}