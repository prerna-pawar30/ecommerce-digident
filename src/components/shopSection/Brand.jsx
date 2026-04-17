import React, { useState, useMemo, memo } from "react";

const Brand = memo(({ brands = [], loading, onBrandClick }) => {
  const [showAll, setShowAll] = useState(false);

  const sortedBrands = useMemo(() => {
    if (!Array.isArray(brands)) return [];

    return [...brands].sort((a, b) =>
      (a.brandName || "").localeCompare(
        b.brandName || ""
      )
    );
  }, [brands]);

  const brandsToShow = useMemo(() => {
    return showAll
      ? sortedBrands
      : sortedBrands.slice(0, 10);
  }, [sortedBrands, showAll]);

  return (
    <section className="py-8 sm:py-16 bg-gray-50/50 w-full">
      <div className="px-4 sm:px-6 w-full max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900">
              Top{" "}
              <span className="text-[#E68736]">
                Brands
              </span>
            </h2>
            <p className="text-gray-500 text-sm sm:text-base mt-2">
              Select a brand to view compatible
              products
            </p>
          </div>

          {!loading &&
            sortedBrands.length > 10 && (
              <button
                className="text-[#E68736] text-sm sm:text-base font-bold hover:underline"
                onClick={() =>
                  setShowAll((prev) => !prev)
                }
              >
                {showAll
                  ? "Show Less"
                  : "View All"}
              </button>
            )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 animate-pulse">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="h-[80px] sm:h-[100px] rounded-xl bg-gray-200"
              />
            ))}
          </div>
        ) : sortedBrands.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <p className="text-gray-400 font-medium">
              No brands found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
            {brandsToShow.map((brand, i) => (
              <div
                key={brand._id || i}
                onClick={() =>
                  onBrandClick?.(brand._id)
                }
                className="bg-white rounded-xl flex items-center justify-center p-2 sm:p-4 h-[80px] sm:h-[100px] text-center text-sm sm:text-lg font-bold border border-orange-400 hover:border-[#E68736] hover:text-[#E68736] hover:shadow-md active:scale-95 cursor-pointer transition-all"
              >
                <span className="line-clamp-2 uppercase tracking-tight">
                  {brand.brandName}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
});

export default Brand;