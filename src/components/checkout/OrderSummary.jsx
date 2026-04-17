import React from "react";
import { X, ShieldCheck, Lock } from "lucide-react";

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
            <span className="flex items-center gap-1">Offer Applied <X size={14} className="cursor-pointer" onClick={onRemoveCoupon} /></span>
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
        className="w-full bg-[#E68736] text-white py-5 rounded-2xl font-black text-lg mt-8 flex items-center justify-center gap-3 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-orange-100 disabled:opacity-50 cursor-pointer"
      >
        {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><ShieldCheck size={24} /> Pay Now</>}
      </button>

      <div className="mt-6 flex flex-col items-center gap-3">
        <div className="flex gap-4 opacity-50 grayscale scale-75">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.svg/1200px-PhonePe_Logo.svg.png" alt="PhonePe" className="h-4" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/1200px-Google_Pay_Logo.svg.png" alt="GPay" className="h-4" />
        </div>
        <div className="flex items-center gap-1 text-gray-400 text-[10px] font-bold uppercase">
          <Lock size={12} /> Razorpay Secure Checkout
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;