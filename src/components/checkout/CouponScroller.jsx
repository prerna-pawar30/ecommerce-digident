import React, { useState } from "react";
import { Ticket, Info, CheckCircle2, X, Calendar, ShieldCheck, Zap, AlertCircle } from "lucide-react";
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
            
            return (
              <div
                key={coupon.couponId}
                className={`relative min-w-[280px] p-5 rounded-2xl border-2 transition-all cursor-pointer snap-start group ${
                  isSelected ? "border-green-500 bg-green-50" : isLocked ? "border-slate-100 bg-slate-50/50 opacity-80" : "border-dashed border-slate-200 hover:border-orange-300 bg-white"
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-[10px] font-black px-2 py-1 rounded border uppercase tracking-wider ${
                    isLocked ? "bg-slate-100 text-slate-400 border-slate-200" : "bg-orange-50 text-[#E68736] border-orange-100"
                  }`}>
                    {coupon.code}
                  </span>
                  
                  <div className="flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); setViewDetail(coupon); }} className="p-1 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
                      <Info size={16} />
                    </button>
                    {isSelected && <CheckCircle2 size={18} className="text-green-500" />}
                  </div>
                </div>

                <div onClick={() => handleApplyClick(coupon)}>
                  <p className={`mt-4 text-lg font-black ${isLocked ? "text-slate-400" : "text-slate-900"}`}>
                    {coupon.couponType === "PERCENT" ? `${coupon.discountValue}% OFF` : 
                     coupon.couponType === "FIXED" ? `₹${coupon.discountValue} FLAT OFF` : 
                     "B2G1 FREE"}
                  </p>
                  
                  {isLocked && !isSelected ? (
                    <div className="flex items-center gap-1 mt-1 text-red-400 font-bold text-[10px] uppercase">
                       <AlertCircle size={10} /> Add ₹{coupon.minOrderAmount - orderTotal} more
                    </div>
                  ) : (
                    <p className="text-[11px] font-medium text-slate-500 mt-1 line-clamp-1 italic">
                      {coupon.description || `Valid on orders above ₹${coupon.minOrderAmount}`}
                    </p>
                  )}
                  
                  <button className={`mt-4 w-full py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                    isSelected ? "bg-green-500 text-white" : isLocked ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-slate-900 text-white group-hover:bg-[#E68736]"
                  }`}>
                    {isSelected ? "Applied (Click to Remove)" : isLocked ? "Locked" : "Apply Coupon"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {viewDetail && (
        <div className="absolute inset-0 z-20 bg-white/95 backdrop-blur-sm rounded-3xl p-6 border border-orange-200 flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-[#E68736]" />
              <h4 className="font-black text-slate-800 uppercase text-sm tracking-widest">Coupon Details</h4>
            </div>
            <button onClick={() => setViewDetail(null)} className="p-2 hover:bg-slate-100 rounded-full">
              <X size={20} className="text-slate-400" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className={`p-3 rounded-2xl border ${orderTotal < viewDetail.minOrderAmount ? "bg-red-50 border-red-100" : "bg-slate-50 border-slate-100"}`}>
              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Minimum Order</p>
              <p className={`text-sm font-black ${orderTotal < viewDetail.minOrderAmount ? "text-red-600" : "text-slate-700"}`}>₹{viewDetail.minOrderAmount}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Status</p>
              <p className={`text-sm font-black ${viewDetail.isActive ? "text-green-600" : "text-red-600"}`}>{viewDetail.isActive ? "Active" : "Inactive"}</p>
            </div>
          </div>

          <div className="mt-6 border-t pt-4">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Description</p>
            <p className="text-xs text-slate-600 leading-relaxed italic">"{viewDetail.description}"</p>
          </div>

          <button 
            disabled={orderTotal < viewDetail.minOrderAmount}
            onClick={() => { handleApplyClick(viewDetail); setViewDetail(null); }}
            className={`mt-auto w-full py-4 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg transition-all ${
              orderTotal < viewDetail.minOrderAmount ? "bg-slate-300 cursor-not-allowed" : "bg-[#E68736] hover:bg-black"
            }`}
          >
            {orderTotal < viewDetail.minOrderAmount ? "Amount Too Low" : "Apply This Code"}
          </button>
        </div>
      )}
    </div>
  );
};

export default CouponScroller;