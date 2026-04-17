/* eslint-disable no-unused-vars */
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiX, HiFilter } from "react-icons/hi";
import CategoryFilter from "../../components/shopSection/CategoryFilter";
import BrandFilter from "../../components/shopSection/BrandFilter";

export default function FilterHeader({ 
  menuData = {}, 
  brandId, 
  categoryId, 
  bannerId, 
  productCount = 0
}) {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("category");

  const clearFilter = () => {
    navigate({
      pathname: "/all-products",
      search: ""
    }, { replace: true });
  };

  const selectedName = useMemo(() => {
    const isValid = (v) => v && v !== "undefined" && v !== "null";

    if (isValid(categoryId)) {
      const cat = menuData?.categories?.find(
        (c) => String(c.categoryId) === String(categoryId)
      );
      return cat?.name || "Category Filter";
    }

    if (isValid(brandId)) {
      const brand = menuData?.brands?.find(
        (b) => String(b.brandId) === String(brandId)
      );
      return brand?.name || "Brand Filter";
    }

    if (isValid(bannerId)) return "Special Collection";

    return null;
  }, [categoryId, brandId, bannerId, menuData]);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        
        {/* TITLE */}
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">
            Our <span className="text-[#E68736]">Products</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            Professional Dental Surgical Solutions
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">

          {/* ITEM COUNT */}
          <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 h-fit flex items-center">
            <span className="font-bold text-[#E68736]">{productCount}</span>
            <span className="text-gray-600 ml-1 text-sm font-medium">Items</span>
          </div>

          {/* ACTIVE FILTER BADGE */}
          <AnimatePresence>
            {selectedName && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, x: 10 }} 
                animate={{ opacity: 1, scale: 1, x: 0 }} 
                exit={{ opacity: 0, scale: 0.9, x: 10 }}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#E68736] text-white rounded-full shadow-sm"
              >
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-wide">
                  {selectedName}
                </span>
                <button 
                  onClick={clearFilter}
                  className="hover:bg-black/10 rounded-full p-0.5 transition-colors"
                >
                  <HiX size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* FILTER BUTTON */}
          <button 
            onClick={() => { setActiveTab("category"); setIsFilterOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-[#E68736] hover:shadow-md transition-all group active:scale-95"
          >
            <HiFilter className="text-[#E68736] group-hover:scale-110 transition-transform" size={20} />
            <span className="text-sm font-bold text-gray-700">Filter</span>
          </button>
        </div>
      </div>

      {/* FILTER MODAL */}
      <AnimatePresence>
        {isFilterOpen && (
          activeTab === "category" ? (
            <CategoryFilter 
              categories={menuData?.categories || []}
              onClose={() => setIsFilterOpen(false)}
              onSwitchToBrands={() => setActiveTab("brand")}
              onSelect={(cat) => {
                navigate({
                  pathname: "/all-products",
                  search: `?category=${cat.categoryId}`
                });
                setIsFilterOpen(false);
              }}
            />
          ) : (
            <BrandFilter 
              brands={menuData?.brands || []}
              onClose={() => setIsFilterOpen(false)}
              onSwitchToCategories={() => setActiveTab("category")}
              onSelect={(brand) => {
                navigate({
                  pathname: "/all-products",
                  search: `?brand=${brand.brandId}`
                });
                setIsFilterOpen(false);
              }}
            />
          )
        )}
      </AnimatePresence>
    </>
  );
}