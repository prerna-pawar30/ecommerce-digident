import React from "react";

export default function OrderItemsList({
  order,
  isRefunded,
  isReturnApproved,
  totalReturnedAmount,
  navigate,
}) {
  return (
    <>
      <div className="bg-white rounded-xl overflow-hidden border border-orange-200 shadow-sm">
        {order.items?.map((item, index) => {
          return (
            <div
              key={index}
              className="group relative flex flex-col sm:flex-row items-center sm:items-start p-6 sm:p-8 gap-6 sm:gap-8 border-b border-orange-50 last:border-b-0 hover:bg-[#FFFBF7]/40 transition-colors"
            >
              {/* Product Image Wrapper */}
              <div className="w-32 h-32 sm:w-36 sm:h-36 bg-white rounded-xl border border-orange-100 flex items-center justify-center p-2 flex-shrink-0 group-hover:shadow-md transition-shadow">
                <img
                  src={item.image}
                  alt={item.productName}
                  className="max-w-full max-h-full object-contain mix-blend-multiply"
                />
              </div>

              {/* Product Details & Quantities */}
              <div className="flex-1 flex flex-col justify-between w-full h-full min-gap-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="space-y-2 max-w-xl">
                    <h4 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight leading-snug">
                      {item.productName} Compatible {item.categoryName}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 bg-orange-100 text-[#E68736] text-[10px] font-black rounded uppercase tracking-wider">
                        {item.categoryName}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-400 font-medium bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                        Variant: {item.variantName}
                      </span>
                    </div>
                  </div>

                  {/* Pricing block */}
                  <div className="text-left md:text-right min-w-[120px]">
                    <p className="text-xl sm:text-2xl font-black text-[#E68736] tracking-tight">
                      ₹{item.price?.toLocaleString()}
                    </p>
                    <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                      Unit Price (incl. GST)
                    </p>
                  </div>
                </div>

                {/* Badges/Quantities Row */}
                <div className="mt-6 flex flex-wrap gap-3 items-center">
                  <div className="flex items-center h-9 rounded-lg overflow-hidden border border-green-200 shadow-sm shadow-green-50/50">
                    <div className="bg-green-50/80 px-3 h-full flex items-center border-r border-green-200">
                      <span className="text-[9px] font-black text-green-600 uppercase tracking-wider">
                        Total Products
                      </span>
                    </div>
                    <div className="bg-white px-3.5 h-full flex items-center">
                      <span className="text-sm font-bold text-green-700">
                        {item.quantity + item.returnedQuantity}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center h-9 rounded-lg overflow-hidden border border-gray-200">
                    <div className="bg-gray-50 px-3 h-full flex items-center border-r border-gray-200">
                      <span className="text-[9px] font-black text-gray-500 uppercase tracking-wider">
                        Ordered
                      </span>
                    </div>
                    <div className="bg-white px-3.5 h-full flex items-center">
                      <span className="text-sm font-bold text-gray-800">
                        {item.quantity}
                      </span>
                    </div>
                  </div>

                  {item.returnedQuantity > 0 && (
                    <div className="flex items-center h-9 rounded-lg overflow-hidden border border-orange-200 shadow-sm shadow-orange-50/50">
                      <div className="bg-orange-50/80 px-3 h-full flex items-center border-r border-orange-200">
                        <span className="text-[9px] font-black text-orange-500 uppercase tracking-wider">
                          Returned
                        </span>
                      </div>
                      <div className="bg-white px-3.5 h-full flex items-center">
                        <span className="text-sm font-bold text-orange-600">
                          {item.returnedQuantity}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Pricing Summary Card Footer */}
        <div className="bg-[#FFFBF7]/70 p-6 sm:p-8 border-t border-orange-100">
          <div className="max-w-sm ml-auto space-y-3.5 text-right">
            <div className="flex justify-between items-center text-sm sm:text-[15px] font-semibold text-gray-600">
              <span>Subtotal (Items):</span>
              <span className="font-bold text-gray-800">
                ₹
                {(
                  order.grandTotal +
                  (order.coupon?.discountAmount || 0) -
                  (order.gstAmount || 0)
                ).toLocaleString()}
              </span>
            </div>

            {order.gstAmount > 0 && (
              <div className="flex justify-between items-center text-sm sm:text-[15px] font-semibold text-gray-400 tracking-tight">
                <span>GST:</span>
                <span className="font-bold">
                  ₹
                  {order.gstAmount.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            )}

            {order.coupon && (
              <div className="flex justify-between items-center text-sm sm:text-[15px] font-semibold text-green-600">
                <span>Discount ({order.coupon.code}):</span>
                <span className="font-bold">
                  - ₹{order.coupon.discountAmount?.toLocaleString()}
                </span>
              </div>
            )}

            <div className="pt-4 border-t border-orange-200/60 mt-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                {isRefunded ? "Final Settled Amount" : "Net Amount Paid"}
              </p>

              {isReturnApproved && totalReturnedAmount > 0 ? (
                <div className="space-y-1">
                  <p className="text-sm text-gray-400 line-through font-medium">
                    ₹{order.grandTotal?.toLocaleString()}
                  </p>
                  <p className="text-3xl font-black text-green-700 tracking-tight">
                    ₹{(order.grandTotal - totalReturnedAmount).toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600 font-semibold bg-green-50 border border-green-100 rounded-md py-1 px-2.5 inline-block mt-1">
                    ₹{totalReturnedAmount.toLocaleString()} refunded for returned
                    items
                  </p>
                </div>
              ) : (
                <p className="text-3xl font-black text-gray-900 tracking-tight">
                  ₹{order.grandTotal?.toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Outer CTA Section */}
      <div className="p-6 flex justify-end bg-transparent">
        <button
          onClick={() => navigate("/all-products")}
          className="w-full md:w-64 bg-white text-[#E68736] py-3 px-8 font-bold rounded-xl border-2 border-[#E68736] flex items-center justify-center gap-2 hover:bg-orange-50 active:bg-orange-100/50 transition-all cursor-pointer shadow-sm active:scale-[0.99]"
        >
          Continue Shopping
        </button>
      </div>
    </>
  );
}