import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CategoryFilter({ categories, onClose, onSwitchToBrands, onSelect }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Prevent background scrolling when modal is open
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "unset");
  }, []);

  // ✅ FIX: Defensive check to ensure 'categories' is always an array
  // This handles cases where the parent passes the full API response object
  const safeCategories = Array.isArray(categories) 
    ? categories 
    : (categories?.categories || []);

  // Filter based on the safe array
  const filtered = safeCategories.filter((cat) =>
    (cat.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategoryClick = (cat) => {
    const idToUse = cat._id || cat.categoryId;
    if (onSelect) onSelect({ id: idToUse, name: cat.name });
    navigate(`/all-products?category=${idToUse}`);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 z-50 transition-opacity cursor-pointer" 
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center z-[60] p-4 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 sm:p-10 pointer-events-auto overflow-hidden">
          
          {/* Header with Search */}
          <div className="relative mb-4">
            <i className="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Search category"
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>

          {/* Tab Selection Bar */}
          <div className="flex justify-center gap-8 mb-8 border-b border-gray-100">
            <button
              className="pb-2 px-2 text-sm font-bold border-b-2 border-orange-500 text-orange-600"
            >
              Category
            </button>
            <button
              onClick={onSwitchToBrands}
              className="pb-2 px-2 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
            >
              Brand
            </button>
          </div>

          {/* Grid List */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
            {filtered.map((cat, index) => (
              <button
                key={cat._id || cat.categoryId || index}
                onClick={() => handleCategoryClick(cat)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-md text-left text-sm text-gray-700 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50 transition-all truncate bg-white"
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Empty State */}
          {filtered.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-400">No categories found.</p>
            </div>
          )}
          
          {/* Close for Mobile visibility */}
          <button 
            onClick={onClose}
            className="mt-6 w-full py-2 text-gray-400 text-xs sm:hidden hover:text-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}

export default CategoryFilter;