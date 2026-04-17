import React, { memo } from "react";

const Categories = memo(
  ({
    categories = [],
    loading,
    onCategoryClick
  }) => {
    const safeCategories = Array.isArray(
      categories
    )
      ? categories
      : [];

    return (
      <section className="py-10 bg-white w-full">
        <div className="px-5 md:px-6 w-full max-w-[1440px] mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl md:text-4xl font-extrabold text-[#072434]">
              Top{" "}
              <span className="text-[#E68736]">
                Categories
              </span>
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 md:gap-10 animate-pulse">
              {[...Array(5)].map((_, i) => (
                <div key={i}>
                  <div className="bg-gray-200 rounded-2xl aspect-[1.5/1]" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mt-4" />
                </div>
              ))}
            </div>
          ) : safeCategories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-10">
              {safeCategories.map(
                (cat, index) => (
                  <div
                    key={
                      cat._id ||
                      cat.categoryId ||
                      index
                    }
                    onClick={() =>
                      onCategoryClick?.(
                        cat._id
                      )
                    }
                    className="flex flex-col cursor-pointer group"
                  >
                    <div className="bg-white rounded-2xl flex items-center justify-center p-4 md:p-6 aspect-[1.5/1] border border-orange-400 hover:border-[#E68736] hover:shadow-xl overflow-hidden transition-all">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="max-h-full w-auto object-contain group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <p className="text-center text-sm md:text-lg font-bold text-[#072434] mt-3">
                      {cat.name}
                    </p>
                  </div>
                )
              )}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-10 italic">
              No categories available.
            </p>
          )}
        </div>
      </section>
    );
  }
);

export default Categories;