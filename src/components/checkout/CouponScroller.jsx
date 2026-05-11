import React, { useState } from "react";
import { Ticket, Info, CheckCircle2, X, Zap, AlertCircle, ShoppingBag, ArrowRight } from "lucide-react";
import Swal from "sweetalert2";

const CouponScroller = ({ coupons, selectedCoupon, onApply, orderTotal = 0 }) => {
  const [viewDetail, setViewDetail] = useState(null);

  const handleApplyClick = (coupon) => {
    if (orderTotal < coupon.minOrderAmount && selectedCoupon?.couponId !== coupon.couponId) {
      Swal.fire({
        title: "Ineligible Coupon",
        html: `Order total is <b>₹${orderTotal}</b>. <br/> This coupon requires a minimum of <b>₹${coupon.minOrderAmount}</b>.`,
        icon: "error",
        confirmButtonColor: "#E68736",
      });
      return;
    }

    if (!coupon.isActive) {
      Swal.fire({ title: "Coupon Inactive", text: "This coupon has expired.", icon: "warning", confirmButtonColor: "#E68736" });
      return;
    }

    onApply(coupon);
  };

  return (
    <div className="relative font-sans">
      <div className="bg-white p-6 rounded-3xl border border-orange-200 shadow-sm overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800">
            <Ticket size={20} className="text-[#E68736]" /> Available Coupons
          </h3>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
            Subtotal: ₹{orderTotal}
          </span>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 custom-coupon-scroll snap-x no-scrollbar">
          {coupons.map((coupon) => {
            const isSelected = selectedCoupon?.couponId === coupon.couponId;
            const isLocked = orderTotal < coupon.minOrderAmount;
            const isBOGO = coupon.couponType === "BUY_X_GET_Y_FREE";
            const rule = coupon.buyXGetY;
            
            return (
              <div
                key={coupon.couponId}
                className={`relative min-w-[300px] p-5 rounded-2xl border-2 transition-all cursor-pointer snap-start group shadow-sm ${
                  isSelected 
                    ? "border-green-500 bg-green-50" 
                    : isLocked 
                      ? "border-slate-100 bg-slate-50/50 opacity-80" 
                      : "border-dashed border-slate-200 hover:border-orange-300 bg-white"
                }`}
              >
                {/* Header: Code & Status */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex flex-col gap-1">
                    <span className={`text-[10px] font-black px-2 py-1 rounded border uppercase tracking-wider ${
                      isLocked ? "bg-slate-100 text-slate-400 border-slate-200" : "bg-orange-50 text-[#E68736] border-orange-100"
                    }`}>
                      {coupon.code}
                    </span>
                    {isSelected && (
                      <span className="text-[9px] text-green-600 font-bold flex items-center gap-1">
                        <CheckCircle2 size={10} /> Currently Applied
                      </span>
                    )}
                  </div>
                  
                  <button 
                    onClick={(e) => { e.stopPropagation(); setViewDetail(coupon); }} 
                    className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                  >
                    <Info size={18} />
                  </button>
                </div>

                <div onClick={() => handleApplyClick(coupon)}>
                  {/* Offer Title */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-xl ${isLocked ? 'bg-slate-200' : 'bg-orange-500 text-white'}`}>
                      <Zap size={20} fill={!isLocked ? "white" : "none"} />
                    </div>
                    <div>
                      <p className={`text-lg font-black leading-tight ${isLocked ? "text-slate-400" : "text-slate-900"}`}>
                        {isBOGO ? `Buy ${rule.buyQuantity} Get ${rule.getQuantity} Free` : 
                         coupon.couponType === "PERCENT" ? `${coupon.discountValue}% OFF` : 
                         coupon.couponType === "FIXED" ? `₹${coupon.discountValue} OFF` : "SPECIAL OFFER"}
                      </p>
                      <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">
                        {isBOGO ? "Brand Bundle" : "Instant Savings"}
                      </p>
                    </div>
                  </div>
                  
                  {/* BOGO Specific Rule Helper */}
                  {isBOGO && (
                    <div className="bg-white/60 border border-slate-100 rounded-xl p-2.5 my-3 flex flex-col gap-1 shadow-inner">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-500 italic">Buy {rule.buyQuantity} of</span>
                        <span className="font-bold text-slate-700">{rule.buyBrand?.brandName || rule.buyCategory?.categoryName || "Selected"}</span>
                      </div>
                      <div className="flex justify-center py-0.5 text-slate-300">
                        <ArrowRight size={12} />
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-500 italic">Get {rule.getQuantity} of</span>
                        <span className="font-bold text-green-600 underline decoration-dotted">{rule.getBrand?.brandName || "Selected"}</span>
                      </div>
                    </div>
                  )}

                  {/* Eligibility Warning */}
                  {isLocked && !isSelected ? (
                    <div className="flex items-center gap-1.5 mt-2 p-2 bg-red-50 rounded-lg text-red-500 font-bold text-[10px] uppercase">
                       <AlertCircle size={12} /> Add ₹{coupon.minOrderAmount - orderTotal} more to unlock
                    </div>
                  ) : (
                    <p className="text-[11px] font-medium text-slate-500 mt-2 line-clamp-1 italic">
                      {coupon.description || `Applicable on orders above ₹${coupon.minOrderAmount}`}
                    </p>
                  )}
                  
                  <button className={`mt-4 w-full py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                    isSelected 
                      ? "bg-red-500 text-white shadow-md shadow-red-100" 
                      : isLocked 
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                        : "bg-slate-900 text-white group-hover:bg-[#E68736] group-hover:scale-[1.02]"
                  }`}>
                    {isSelected ? "Remove Coupon" : isLocked ? "Locked" : "Apply Offer"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Details Modal / Overlay */}
      {viewDetail && (
        <div className="absolute inset-0 z-20 bg-white/98 backdrop-blur-md rounded-3xl p-6 border border-orange-200 flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Ticket size={20} className="text-[#E68736]" />
              </div>
              <div>
                <h4 className="font-black text-slate-800 uppercase text-sm tracking-widest">Coupon Details</h4>
                <p className="text-[10px] font-bold text-slate-400">{viewDetail.code}</p>
              </div>
            </div>
            <button onClick={() => setViewDetail(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X size={20} className="text-slate-400" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className={`p-4 rounded-2xl border ${orderTotal < viewDetail.minOrderAmount ? "bg-red-50 border-red-100" : "bg-slate-50 border-slate-100"}`}>
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Min. Order</p>
                <p className={`text-sm font-black ${orderTotal < viewDetail.minOrderAmount ? "text-red-600" : "text-slate-700"}`}>₹{viewDetail.minOrderAmount}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Max Savings</p>
                <p className="text-sm font-black text-slate-700">{viewDetail.maxDiscountAmount > 0 ? `₹${viewDetail.maxDiscountAmount}` : "Unlimited"}</p>
              </div>
            </div>

            {viewDetail.couponType === "BUY_X_GET_Y_FREE" && (
                <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
                   <p className="text-[9px] font-black text-orange-400 uppercase mb-2">Conditions</p>
                   <div className="space-y-2">
                      <div className="flex items-start gap-2">
                         <div className="h-4 w-4 rounded-full bg-orange-200 flex items-center justify-center mt-0.5"><div className="h-1.5 w-1.5 rounded-full bg-orange-600"></div></div>
                         <p className="text-[11px] text-slate-700 font-bold">Must buy {viewDetail.buyXGetY.buyQuantity} items from brand: <span className="text-orange-600 uppercase">{viewDetail.buyXGetY.buyBrand?.brandName}</span></p>
                      </div>
                      <div className="flex items-start gap-2">
                         <div className="h-4 w-4 rounded-full bg-green-200 flex items-center justify-center mt-0.5"><div className="h-1.5 w-1.5 rounded-full bg-green-600"></div></div>
                         <p className="text-[11px] text-slate-700 font-bold">Free item will be from: <span className="text-green-600 uppercase">{viewDetail.buyXGetY.getBrand?.brandName}</span></p>
                      </div>
                   </div>
                </div>
            )}

            <div className="pt-2">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Detailed Terms</p>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl italic">"{viewDetail.description}"</p>
            </div>
          </div>

          <button 
            disabled={orderTotal < viewDetail.minOrderAmount}
            onClick={() => { handleApplyClick(viewDetail); setViewDetail(null); }}
            className={`mt-auto w-full py-4 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg transition-all ${
              orderTotal < viewDetail.minOrderAmount ? "bg-slate-300 cursor-not-allowed" : "bg-slate-900 hover:bg-[#E68736]"
            }`}
          >
            {orderTotal < viewDetail.minOrderAmount ? "Minimum Amount Not Met" : "Apply This Code"}
          </button>
        </div>
      )}
    </div>
  );
};

export default CouponScroller;