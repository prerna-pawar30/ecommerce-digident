import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function BrandFilter({ brands, onClose, onSwitchToCategories, onSelect }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "unset");
  }, []);

  const filtered = brands.filter((brand) =>
    brand.brandName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBrandClick = (brand) => {
    const idToUse = brand._id || brand.brandId;
    if (onSelect) onSelect({ id: idToUse, name: brand.brandName });
    navigate(`/all-products?brand=${idToUse}`);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50 transition-opacity" onClick={onClose}></div>
      <div className="fixed inset-0 flex items-center justify-center z-[60] p-4 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 sm:p-10 pointer-events-auto overflow-hidden">
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <i className="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Search brand"
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* New Tab Selection Bar */}
         <div className="flex justify-center gap-8 mb-8 border-b border-gray-100">
            <button
              onClick={onSwitchToCategories}
              className="pb-2 px-2 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
            >
              Category
            </button>
            <button
              className="pb-2 px-2 text-sm font-bold border-b-2 border-orange-500 text-orange-600"
            >
              Brand
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
            {filtered.map((brand) => (
              <button
                key={brand._id || brand.brandId}
                onClick={() => handleBrandClick(brand)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-md text-left text-sm text-gray-700 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50 transition-all truncate bg-white"
              >
                {brand.brandName}
              </button>
            ))}
          </div>
          {filtered.length === 0 && <p className="text-center text-gray-400 py-10">No brands found.</p>}
        </div>
      </div>
    </>
  );
}

export default BrandFilter;