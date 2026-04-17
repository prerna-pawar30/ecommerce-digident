import { Link } from "react-router-dom";

export default function ProductCard({ product, isLast, lastItemRef }) {
  // ✅ ID handling
  const pId = product.productId || product._id;

  // ✅ Price handling (Checks variants first, then main price)
  const displayPrice = product.variants?.[0]?.variantPrice ?? product.price ?? 0;

  // ✅ Image handling (Checks variants first, then main images array)
  const displayImage = product.variants?.[0]?.variantImages?.[0] || 
                       (Array.isArray(product.images) ? product.images[0] : product.images) || 
                       null;

  return (
    <div
      ref={isLast ? lastItemRef : null}
      className="bg-white rounded-xl md:rounded-2xl overflow-hidden border border-[#E68736] hover:shadow-xl transition-all duration-300 flex flex-col group h-full"
    >
      {/* IMAGE SECTION */}
      <Link 
        to={`/productpage/${pId}`} 
        className="relative h-32 sm:h-52 w-full block overflow-hidden bg-white"
      >
        {displayImage ? (
          <img
            src={displayImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 p-2"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs italic">
            No image
          </div>
        )}
      </Link>

      {/* CONTENT SECTION */}
      <div className="p-3 md:p-5 flex flex-col flex-grow">
        {/* CATEGORY TAG */}
        <p className="text-[#E68736] text-[10px] md:text-[12px] font-bold uppercase tracking-wider mb-1">
          {product.category?.name}
        </p>

        {/* PRODUCT TITLE */}
        <Link to={`/productpage/${pId}`}>
          <h3 className="text-gray-800 font-bold text-[13px] md:text-[16px] leading-tight line-clamp-2 mb-4 h-[32px] md:h-[40px]">
            {product.name} {product.category?.name ? `Compatible ${product.category.name}` : ''}
          </h3>
        </Link>

        {/* FOOTER (PRICE & BUTTON) */}
        <div className="mt-auto flex items-center justify-between">
          <span className="text-sm md:text-xl font-black text-gray-900">
            ₹{displayPrice}
          </span>
          
          <Link
            to={`/productpage/${pId}`}
            className="px-3 md:px-4 py-1.5 md:py-2 text-[11px] md:text-sm font-bold rounded-lg bg-[#E68736] text-white hover:bg-white hover:text-[#E68736] border border-[#E68736] transition-all"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}