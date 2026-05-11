import React from "react";
import { X, ShieldCheck, Lock, CreditCard, Wallet, Landmark } from "lucide-react";

const OrderSummary = ({ financials, loading, onPlaceOrder, onRemoveCoupon }) => {
  const { total, discountAmount } = financials;
  const basePrice = total / 1.05;
  const gstAmount = total - basePrice;

  return (
    <div className="bg-white rounded-3xl border border-orange-200 p-6 lg:sticky lg:top-24 shadow-sm">
      <h2 className="font-black text-gray-900 mb-6 text-[22px]">Order Summary</h2>
      
      <div className="space-y-4 pb-6 border-b border-gray-100">
        <div className="flex justify-between text-[16px] font-bold text-gray-500">
          <span>Subtotal (Base)</span>
          <span>₹{basePrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between text-[16px] font-bold text-gray-400">
          <span>GST </span>
          <span>₹{gstAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-sm font-bold text-green-600 bg-green-50 p-2 rounded-lg">
            <span className="flex items-center gap-1">
              Offer Applied 
              <X size={14} className="cursor-pointer hover:text-red-500" onClick={onRemoveCoupon} />
            </span>
            <span>-₹{discountAmount.toLocaleString()}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-6">
        <span className="font-black text-lg text-gray-800">Total</span>
        <span className="text-3xl font-black text-[#E68736]">₹{total.toLocaleString()}</span>
      </div>

      <button
        disabled={loading}
        onClick={() => onPlaceOrder({ gstAmount: gstAmount.toFixed(2), gstPercentage: 5 })}
        className={`w-full text-white py-5 rounded-2xl font-black text-lg mt-8 flex items-center justify-center gap-3 transition-all shadow-lg 
          ${loading 
            ? "bg-gray-400 opacity-50 cursor-not-allowed" 
            : "hover:brightness-110 active:scale-95 shadow-orange-100"}`}
        style={{ 
          cursor: loading ? "not-allowed" : "pointer", 
          background: loading 
            ? "" // Falls back to gray background when loading
            : 'linear-gradient(160deg, #f8c1a1, #eb730b 100%)' 
        }}
      >
  {loading ? (
    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
  ) : (
    <>
      <ShieldCheck size={24} /> 
      Pay Now
    </>
  )}
</button>

      {/* REPLACED SECTION: Clean Icons instead of external images */}
      <div className="mt-6 flex flex-col items-center gap-4">
        <div className="flex gap-6 text-gray-300">
          <div className="flex flex-col items-center gap-1">
            <Wallet size={18} />
            <span className="text-[8px] font-bold uppercase tracking-widest">UPI</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <CreditCard size={18} />
            <span className="text-[8px] font-bold uppercase tracking-widest">Cards</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Landmark size={18} />
            <span className="text-[8px] font-bold uppercase tracking-widest">Net Banking</span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
          <Lock size={12} className="text-gray-400" />
          <span className="text-gray-400 text-[10px] font-bold uppercase tracking-tighter">
            Razorpay Secure Checkout
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;