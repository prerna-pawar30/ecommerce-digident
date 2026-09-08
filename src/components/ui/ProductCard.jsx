import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";

export default function ProductCard({ product, isLast, lastItemRef, badge }) {
  // ✅ ID handling
  const pId = product.productId || product._id;

  // ✅ Price handling (Checks variants first, then main price)
  const displayPrice = product.variants?.[0]?.variantPrice ?? product.price ?? 0;

  // ✅ Image handling (Checks variants first, then main images array)
  const displayImage =
    product.variants?.[0]?.variantImages?.[0] ||
    (Array.isArray(product.images) ? product.images[0] : product.images) ||
    null;

  const categoryName = product.category?.name;
  const cardBadge = badge || product.badge || product.tag || null;

  return (
    <div
      ref={isLast ? lastItemRef : null}
      className="group flex flex-col h-full border border-[#FDDCB5] rounded-xl overflow-hidden hover:shadow-lg hover:shadow-orange-100 hover:border-[#E68736] transition-shadow duration-300"
    >
      {/* BADGE STRIP (only when a badge is provided) */}
      {cardBadge && (
        <div className="px-3 md:px-4 pt-3 md:pt-4">
          <span className="inline-block text-[10px] md:text-xs font-bold px-2.5 md:px-3 py-1 rounded-full bg-orange-100 text-orange-700">
            {cardBadge}
          </span>
        </div>
      )}

      {/* IMAGE SECTION */}
      <Link
        to={`/productpage/${pId}`}
        className="relative h-40 sm:h-48 w-full block overflow-hidden"
      >
        {displayImage ? (
          <img
            src={displayImage}
            alt={product.name}
            loading="lazy"
            draggable={false}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs italic">
            No image
          </div>
        )}
      </Link>

      {/* CONTENT SECTION */}
      <div className="p-3 md:p-4 flex flex-col flex-grow">
        {/* CATEGORY TAG */}
        {categoryName && (
          <p className="text-[10px] md:text-xs text-orange-600 font-semibold uppercase tracking-wide mb-1">
            {categoryName}
          </p>
        )}

        {/* PRODUCT TITLE */}
        <Link to={`/productpage/${pId}`}>
          <h3 className="text-[#072434] font-bold text-[13px] md:text-base leading-snug line-clamp-2 min-h-[38px] md:min-h-[44px]">
            {product.name}
            {categoryName ? ` compatible ${categoryName}` : ""}
          </h3>
        </Link>

        {/* FOOTER (PRICE & BUTTON) */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <span className="text-[#072434] font-black text-sm md:text-lg whitespace-nowrap">
            ₹{Number(displayPrice).toLocaleString("en-IN")}
          </span>

          <Link
            to={`/productpage/${pId}`}
            className="flex items-center justify-center gap-1.5 text-[11px] md:text-sm font-bold px-3 md:px-4 py-1.5 md:py-2 rounded-lg bg-orange-400 hover:bg-orange-500 active:scale-95 text-white transition-all duration-200"
          >
            <FiShoppingCart size={14} />
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
