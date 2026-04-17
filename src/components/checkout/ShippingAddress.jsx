import React from "react";
import { Truck } from "lucide-react";

const ShippingAddress = ({ address, onNavigate }) => (
  <section className="bg-white rounded-2xl border border-orange-200 p-6 md:p-8">
    <div className="flex items-center gap-4">
      <div className="p-3 rounded-xl bg-orange-100 text-orange-600">
        <Truck size={28} />
      </div>
      <h2 className="text-xl font-black text-gray-800">1. Shipping Address</h2>
    </div>
    {address && (
      <div className="mt-4 flex flex-col md:flex-row gap-4 items-start justify-between bg-orange-50/30 border border-orange-100 p-6 rounded-2xl">
        <div className="flex-1">
          <span className="px-2 py-0.5 bg-[#E68736] text-white text-[10px] font-bold rounded uppercase">
            {address.label}
          </span>
          <p className="font-bold text-gray-900 text-lg mt-1">
            {address.firstName} {address.lastName}
          </p>
          <p className="text-[15px] text-gray-600 leading-relaxed">
            {address.street}, {address.area}, {address.city}, {address.state}, {address.country} - {address.pincode}
          </p>
        </div>
        <button
  onClick={() => onNavigate("/address", { state: { fromCheckout: true } })}
  className="px-4 py-2 bg-white border border-orange-200 rounded-xl text-sm font-bold hover:bg-orange-50 transition-all cursor-pointer"
>
  Change
</button>
      </div>
    )}
  </section>
);

export default ShippingAddress;