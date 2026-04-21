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
      <div className="bg-white rounded-xl overflow-hidden border border-orange-200">
        {order.items?.map((item, index) => {
          return (
            <div
              key={index}
              className="group relative flex flex-col md:flex-row items-center md:items-stretch p-8 gap-8 border-b border-orange-50 hover:bg-[#FFFBF7]/40 transition-colors"
            >
              <div className="w-full md:w-38 h-38 bg-white rounded-2xl border border-orange-100  flex items-center justify-center flex-shrink-0  group-hover:shadow-md transition-shadow">
                <img
                  src={item.image}
                  alt={item.productName}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between w-full">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="space-y-1">
                    <h4 className="text-xl font-bold text-gray-900 tracking-tight leading-tight ">
                      {item.productName} Compatible {item.categoryName}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-orange-100 text-[#E68736] text-[10px] font-black rounded uppercase">
                        {item.categoryName}
                      </span>
                      <span className="text-sm text-gray-400 font-medium">
                        Variant: {item.variantName}
                      </span>
                    </div>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-2xl font-black text-[#E68736]">
                      ₹{item.price?.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400 font-medium">
                      Unit Price (incl. GST)
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-4 items-center">
                  <div className="flex items-center h-10 rounded-lg overflow-hidden border border-green-200 shadow-sm shadow-green-50">
                    <div className="bg-green-50 px-3 h-full flex items-center border-r border-green-200">
                      <span className="text-[10px] font-black text-green-600 uppercase tracking-wider">
                        Total Products
                      </span>
                    </div>
                    <div className="bg-white px-4 h-full flex items-center">
                      <span className="font-bold text-green-700">
                        {item.quantity + item.returnedQuantity}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center h-10 rounded-lg overflow-hidden border border-gray-200">
                    <div className="bg-gray-100 px-3 h-full flex items-center border-r border-gray-200">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">
                        Ordered
                      </span>
                    </div>
                    <div className="bg-white px-4 h-full flex items-center">
                      <span className="font-bold text-gray-800">{item.quantity}</span>
                    </div>
                  </div>

                  {item.returnedQuantity > 0 && (
                    <div className="flex items-center h-10 rounded-lg overflow-hidden border border-orange-200 shadow-sm shadow-orange-50">
                      <div className="bg-orange-50 px-3 h-full flex items-center border-r border-orange-200">
                        <span className="text-[10px] font-black text-orange-500 uppercase tracking-wider">
                          Returned
                        </span>
                      </div>
                      <div className="bg-white px-4 h-full flex items-center">
                        <span className="font-bold text-orange-600">
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

        <div className="bg-[#FFFBF7] p-8 border-t border-orange-50">
          <div className="max-w-xs ml-auto space-y-3 text-right">
           <div className="flex justify-between text-[16px] font-bold text-gray-600">
              <span>Subtotal (Items):</span>
              <span>
                ₹
                {(
                  order.grandTotal + 
                  (order.coupon?.discountAmount || 0) - 
                  (order.gstAmount || 0)
                ).toLocaleString()}
              </span>
            </div>
            {order.gstAmount > 0 && (
              <div className="flex justify-between text-[16px] font-bold text-gray-400 uppercase tracking-tight">
                <span>GST:</span>
                <span>
                  ₹
                  {order.gstAmount.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            )}

            {order.coupon && (
              <div className="flex justify-between text-[16px] font-bold text-green-600">
                <span>Discount ({order.coupon.code}):</span>
                <span>- ₹{order.coupon.discountAmount?.toLocaleString()}</span>
              </div>
            )}

            <div className="pt-4 border-t border-orange-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                {isRefunded ? "Final Settled Amount" : "Net Amount Paid"}
              </p>

              {isReturnApproved && totalReturnedAmount > 0 ? (
                <>
                  <p className="text-sm text-gray-500 line-through">
                    ₹{order.grandTotal?.toLocaleString()}
                  </p>
                  <p className="text-3xl font-black text-green-700">
                    ₹{(order.grandTotal - totalReturnedAmount).toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600 font-semibold mt-1">
                    ₹{totalReturnedAmount.toLocaleString()} refunded for returned
                    items
                  </p>
                </>
              ) : (
                <p className="text-3xl font-black text-gray-900">
                  ₹{order.grandTotal?.toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 flex justify-end bg-white border-t border-orange-50">
        <button
          onClick={() => navigate("/all-products")}
          className="w-full md:w-64 bg-white text-[#E68736] py-3 px-8 font-bold rounded-xl border-2 border-[#E68736] flex items-center justify-center gap-2 hover:bg-orange-50 transition-all cursor-pointer shadow-sm active:scale-[0.98]"
        >
          Continue Shopping
        </button>
      </div>
    </>
  );
}