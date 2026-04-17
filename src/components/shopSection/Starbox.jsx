import React, { memo } from "react";

const Starbox = memo(
  ({
    brandCount = 0,
    productCount = 0
  }) => {
    return (
      <section className="mx-4 sm:mx-6 bg-[#F7E6DC] border border-[#F0CDBE] shadow-sm rounded-xl py-2 sm:py-4">
        <div className="px-5 sm:px-10">
          <div className="grid grid-cols-2 gap-y-3 sm:flex sm:justify-around">
            <div className="flex items-center gap-2">
              <p className="font-bold text-[#3C4959] text-sm">
                {productCount > 0
                  ? `${productCount}+`
                  : "..."}{" "}
                Products
              </p>
            </div>

            <div className="flex items-center gap-2">
              <p className="font-bold text-[#3C4959] text-sm">
                {brandCount > 0
                  ? `${brandCount}+`
                  : "..."}{" "}
                Brands
              </p>
            </div>

            <div className="font-bold text-sm">
              100% Original
            </div>

            <div className="font-bold text-sm">
              Best Price
            </div>
          </div>
        </div>
      </section>
    );
  }
);

export default Starbox;