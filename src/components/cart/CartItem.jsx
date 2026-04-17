import { HiTrash } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import AmazonQtyInput from "./AmazonQtyInput";

export default function CartItem({ item, onRemove, onUpdate }) {
  const navigate = useNavigate();
  const variantId = item.variant?.id || item.variantId;

  return (
    <div
      className="flex flex-col sm:flex-row gap-4 sm:gap-6 border border-orange-200 rounded-2xl p-4 items-center sm:items-center hover:shadow-sm transition-shadow cursor-pointer"
      onClick={() => {
        if (item.product?.id) {
          navigate(`/productpage/${item.product.id}`);
        }
      }}
    >
      {/* IMAGE */}
      <div className="w-full sm:w-28 h-40 sm:h-28 border border-orange-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 bg-white">
        <img
          src={item.image}
          alt={item.product?.name}
          className="w-full h-full object-contain p-2"
        />
      </div>

      {/* INFO */}
      <div className="flex-1 text-center sm:text-left">
        <h2 className="font-bold text-base sm:text-lg text-gray-900 leading-tight">
          <span className="text-gray-900 hover:text-[#E68736] hover:underline cursor-pointer">
            {item.product?.name}
            {" Compatible "}
            {item.category?.name}
          </span>
        </h2>

        <p className="text-[16px] sm:text-[15px] text-gray-500 mt-1">
          Brand: {item.brand?.brandName || "Generic"}
        </p>

        {item.variant?.name && (
          <p className="text-[18px] sm:text-[16px] text-[#E68736] font-bold">
            Variant: {item.variant.name}
          </p>
        )}

        <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1">
          <p className="font-bold text-base sm:text-lg text-gray-900">
            ₹{item.price?.toLocaleString()}
          </p>
          <p className="text-[10px] sm:text-[14px] text-gray-400">
            Total: ₹{(item.price * item.quantity).toLocaleString()}
          </p>
        </div>
      </div>

      {/* ACTIONS */}
      <div
        className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 border-t sm:border-t-0 pt-3 sm:pt-0"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(variantId);
          }}
          className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer p-1"
        >
          <HiTrash size={20} />
        </button>

        <div onClick={(e) => e.stopPropagation()}>
          <AmazonQtyInput item={item} onUpdate={onUpdate} />
        </div>
      </div>
    </div>
  );
}