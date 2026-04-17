/* eslint-disable no-unused-vars */
import React from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

const ProductSelectors = ({ 
  product, 
  selectedBrand, 
  setSelectedBrand, 
  currentVariant, 
  variantStartIndex, 
  setVariantStartIndex, 
  variants, 
  selectedVariantIndex, 
  setSelectedVariantIndex 
}) => {
  return (
    <>
      <div className="mb-6">
        <div className="flex flex-row items-center gap-3">
          <span className="font-bold text-gray-900 min-w-[60px] text-[16px] md:text-sm">Brand :</span>
          <div className="flex flex-wrap gap-2 flex-1">
            {product.brand?.map((b, i) => (
              <button 
                key={i} 
                onClick={() => setSelectedBrand(b)} 
                className={`px-4 py-1.5 border rounded-md text-[14px] md:text-[15px] font-bold transition-all whitespace-nowrap 
                  ${b._id === selectedBrand?._id 
                    ? "bg-white text-[#E68736] border-[#E68736]" 
                    : "border-[#d1752b] text-gray-900 md:text-gray-600 hover:bg-orange-50"
                  }`}
              >
                {b.brandName}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6 relative">
        <p className="font-bold text-gray-900 text-[22px] md:text-base mb-3">Variant: {currentVariant?.name}</p>
        <div className="flex items-center gap-2">
          <button onClick={() => setVariantStartIndex(Math.max(0, variantStartIndex - 1))} disabled={variantStartIndex === 0} className={`p-1.5 rounded-full border transition-all z-10 bg-white ${variantStartIndex === 0 ? 'opacity-20 cursor-not-allowed border-orange-200' : 'hover:bg-[#E68736] hover:text-white border-[#E68736] text-[#E68736] shadow-sm'}`}><IoChevronBack size={20} /></button>
          <div className="flex-1 px-1 ">
            <div className="flex justify-center h-26 md:h-20">
              <AnimatePresence mode="wait">
                <motion.div key={variantStartIndex} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} transition={{ duration: 0.3 }} className="flex gap-4 w-full">
                  {variants.slice(variantStartIndex, variantStartIndex + 3).map((v, i) => {
                    const actualIdx = variantStartIndex + i;
                    const isSelected = selectedVariantIndex === actualIdx;
                    return (
                      <button key={v._id || actualIdx} onClick={() => setSelectedVariantIndex(actualIdx)} className={`flex-1 min-w-0 max-w-[150px] border-2 rounded-xl overflow-hidden transition-all duration-300 ${isSelected ? "border-[#E68736] scale-105 shadow-md" : "border-orange-200 hover:border-orange-200"}`}>
                        <div className="h-16 md:h-14 p-2 bg-white flex items-center justify-center"><img src={v.variantImages?.[0] || product.images?.[0]} className="h-full object-contain" alt={v.name} /></div>
                        <div className={`py-1 text-[14px] md:text-[12px] truncate px-1 font-bold text-center ${isSelected ? "bg-[#E68736] text-white" : "bg-orange-100 text-gray-600"}`}>{v.name}</div>
                      </button>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <button onClick={() => setVariantStartIndex(Math.min(variants.length - 3, variantStartIndex + 1))} disabled={variantStartIndex + 3 >= variants.length} className={`p-1.5 rounded-full border transition-all z-10 bg-white ${variantStartIndex + 3 >= variants.length ? 'opacity-20 cursor-not-allowed border-gray-300' : 'hover:bg-[#E68736] hover:text-white border-[#E68736] text-[#E68736] shadow-sm'}`}><IoChevronForward size={20} /></button>
        </div>
      </div>
    </>
  );
};

export default ProductSelectors;


/* eslint-disable no-unused-vars */
// import React from "react";
// import { IoChevronBack, IoChevronForward } from "react-icons/io5";
// import { motion, AnimatePresence } from "framer-motion";

// const ProductSelectors = ({ 
//   product, 
//   selectedBrand, 
//   setSelectedBrand, 
//   currentVariant, 
//   variantStartIndex, 
//   setVariantStartIndex, 
//   variants, 
//   selectedVariantIndex, 
//   setSelectedVariantIndex 
// }) => {
//   return (
//     <>
//       {/* Brand Section */}
//       <div className="mb-6">
//         <div className="flex flex-row items-center gap-3">
//           <span className="font-bold text-gray-900 min-w-[60px] text-[16px] md:text-sm">Brand :</span>
//           <div className="flex flex-wrap gap-2 flex-1">
//             {product.brand?.map((b, i) => (
//               <button 
//                 key={i} 
//                 onClick={() => setSelectedBrand(b)} 
//                 className={`px-4 py-1.5 border rounded-md text-[14px] md:text-[15px] font-bold transition-all whitespace-nowrap 
//                   ${b._id === selectedBrand?._id 
//                     ? "bg-white text-[#E68736] border-[#E68736]" 
//                     : "border-[#d1752b] text-gray-900 md:text-gray-600 hover:bg-orange-50"
//                   }`}
//               >
//                 {b.name}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Variant Carousel Section */}
//       <div className="mb-4 relative">
//         <p className="font-bold text-gray-900 text-[22px] md:text-base mb-3">Select Variant</p>
//         <div className="flex items-center gap-2">
//           <button onClick={() => setVariantStartIndex(Math.max(0, variantStartIndex - 1))} disabled={variantStartIndex === 0} className={`p-1.5 rounded-full border transition-all z-10 bg-white ${variantStartIndex === 0 ? 'opacity-20 cursor-not-allowed border-orange-200' : 'hover:bg-[#E68736] hover:text-white border-[#E68736] text-[#E68736] shadow-sm'}`}><IoChevronBack size={20} /></button>
          
//           <div className="flex-1 px-1">
//             <div className="flex justify-center h-26 md:h-20">
//               <AnimatePresence mode="wait">
//                 <motion.div key={variantStartIndex} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} transition={{ duration: 0.3 }} className="flex gap-4 w-full">
//                   {variants.slice(variantStartIndex, variantStartIndex + 3).map((v, i) => {
//                     const actualIdx = variantStartIndex + i;
//                     const isSelected = selectedVariantIndex === actualIdx;
//                     return (
//                       <button key={v._id || actualIdx} onClick={() => setSelectedVariantIndex(actualIdx)} className={`flex-1 min-w-0 max-w-[150px] border-2 rounded-xl overflow-hidden transition-all duration-300 ${isSelected ? "border-[#E68736] scale-105 shadow-md" : "border-orange-200 hover:border-orange-200"}`}>
//                         <div className="h-16 md:h-14 p-2 bg-white flex items-center justify-center"><img src={v.variantImages?.[0] || product.images?.[0]} className="h-full object-contain" alt={v.name} /></div>
//                         <div className={`py-1 text-[14px] md:text-[12px] truncate px-1 font-bold text-center ${isSelected ? "bg-[#E68736] text-white" : "bg-orange-100 text-gray-600"}`}>{v.name}</div>
//                       </button>
//                     );
//                   })}
//                 </motion.div>
//               </AnimatePresence>
//             </div>
//           </div>

//           <button onClick={() => setVariantStartIndex(Math.min(variants.length - 3, variantStartIndex + 1))} disabled={variantStartIndex + 3 >= variants.length} className={`p-1.5 rounded-full border transition-all z-10 bg-white ${variantStartIndex + 3 >= variants.length ? 'opacity-20 cursor-not-allowed border-gray-300' : 'hover:bg-[#E68736] hover:text-white border-[#E68736] text-[#E68736] shadow-sm'}`}><IoChevronForward size={20} /></button>
//         </div>
//       </div>

//       {/* NEW: Dedicated Attributes Section below the selection */}
//       {currentVariant?.attributes && currentVariant.attributes.length > 0 && (
//         <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-100">
//           <h4 className="text-sm font-bold text-gray-800 mb-2 uppercase tracking-tight">Variant Details:</h4>
//           <div className="flex flex-col gap-2">
//             {currentVariant.attributes.map((attr) => (
//               <div key={attr.attrId} className="flex items-center gap-2 text-[15px] md:text-sm">
//                 <span className="font-semibold text-gray-700 capitalize">{attr.key}:</span>
//                 <div className="flex flex-wrap gap-1">
//                   {Array.isArray(attr.value) ? (
//                     attr.value.map((val, idx) => (
//                       <span key={idx} className="bg-white px-2 py-0.5 border border-orange-200 rounded text-[#E68736] font-medium">
//                         {val}
//                       </span>
//                     ))
//                   ) : (
//                     <span className="text-gray-600">{attr.value}</span>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default ProductSelectors;