import { HiArrowRight } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export default function OrderSummary({ items, subtotal, totalQuantity }) {
  const navigate = useNavigate();

  const totalAmount = subtotal;
  const basePrice = totalAmount / 1.05;
  const gstAmount = totalAmount - basePrice;

  return (
    <div className="w-full mt-6 lg:mt-0">
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-orange-200 lg:sticky lg:top-10 shadow-sm">
        <h2 className="font-bold text-lg sm:text-xl mb-4 text-gray-900 border-b border-orange-100 pb-2">
          Order Summary
        </h2>

        <div className="max-h-[200px] sm:max-h-[250px] overflow-y-auto space-y-3 mb-6 pr-2 custom-scrollbar">
          {items.map((item) => (
            <div
              key={item.variant?.id || item.variantId}
              className="flex justify-between items-start gap-4"
            >
              <div className="flex-1 min-w-0">
                <p className="text-[16px] sm:text-[18px] font-semibold text-gray-800 line-clamp-1">
                  {item.product?.name}
                </p>
                <p className="text-[12px] sm:text-[16px] text-gray-400 uppercase tracking-tighter break-words">
                  {item.variant?.name || "Standard"}
                </p>
              </div>

              <div className="flex items-center gap-1 bg-orange-50 px-2 py-0.5 rounded border border-orange-100 flex-shrink-0">
                <span className="text-[9px] sm:text-[14px] text-gray-500 font-medium">
                  Qty:
                </span>
                <span className="text-[10px] sm:text-[16px] font-bold text-[#E68736]">
                  {item.quantity}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3 sm:space-y-4 pt-4 border-t border-dashed border-orange-200">
          <div className="flex justify-between items-center text-gray-500 text-[14px] sm:text-[16px] gap-3">
            <span>Base Price</span>
            <span className="font-bold text-gray-900 text-right">
              ₹{basePrice.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          <div className="flex justify-between items-center text-gray-500 text-[14px] sm:text-[16px] gap-3">
            <span>GST</span>
            <span className="font-bold text-gray-900 text-right">
              ₹{gstAmount.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          <div className="flex justify-between items-center text-gray-500 text-[14px] sm:text-[16px] gap-3">
            <span>Total Quantity</span>
            <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded border border-orange-100 flex-shrink-0">
              <span className="text-[14px] sm:text-[16px] text-gray-500 font-medium">
                Items:
              </span>
              <span className="text-[14px] sm:text-[16px] font-bold text-[#E68736]">
                {totalQuantity}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-100 gap-3">
            <span className="font-bold text-base sm:text-lg text-gray-800">
              Total Amount
            </span>
            <span className="font-black text-xl sm:text-2xl text-[#E68736] text-right">
              ₹{totalAmount.toLocaleString()}
            </span>
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <button
              onClick={() =>
                navigate("/address", {
                  state: {
                    subtotal: basePrice,
                    gstAmount,
                    totalAmount,
                    cartItems: items,
                    totalQuantity,
                  },
                })
              }
              className="w-full bg-[#E68736] text-white py-3 sm:py-4 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#cf7529] transition-all cursor-pointer shadow-md shadow-orange-100 text-sm sm:text-base"
            >
              Proceed to Checkout <HiArrowRight />
            </button>

            <button
              onClick={() => navigate("/all-products")}
              className="w-full bg-white text-[#E68736] py-2 sm:py-3 font-bold rounded-xl border-2 border-[#E68736] flex items-center justify-center gap-2 hover:bg-orange-50 transition-all cursor-pointer text-sm sm:text-base"
            >
              Continue Shopping
            </button>
          </div>
        </div>

        <p className="text-[9px] sm:text-[10px] text-center text-gray-400 mt-4 uppercase tracking-widest">
          Secure Checkout Powered by Razorpay
        </p>
      </div>
    </div>
  );
}