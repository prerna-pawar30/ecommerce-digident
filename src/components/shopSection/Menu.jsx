/* eslint-disable no-unused-vars */
import React from "react";
import { useNavigate } from "react-router-dom";

function Menu() {
  const navigate = useNavigate();

  return (
    // Added pt-4 (padding-top) and ensure no vertical padding elsewhere
    <section className="bg-white w-full top-0 z-30 pt-12 pb-0 border-b border-gray-200">
      <div className="w-full max-w-[1440px] mx-auto">
        {/* h-12 or h-14 keeps the height consistent without needing bottom padding */}
        <div className="flex flex-row items-center justify-center gap-12 md:gap-32 w-full h-14">
          
          <button 
            onClick={() => navigate("/")} 
            className="flex-shrink-0 text-[16px] md:text-[18px] font-bold text-[#072434] hover:text-[#E68736] transition-colors whitespace-nowrap cursor-pointer"
          >
            Trending
          </button>

          <button 
            onClick={() => navigate("/all-products")} 
            className="flex-shrink-0 text-[16px] md:text-[18px] font-bold text-[#072434] hover:text-[#E68736] transition-colors whitespace-nowrap cursor-pointer"
          >
            All Products
          </button>

        </div>
      </div>
    </section>
  );
}

export default Menu;