import React from "react";
import { Building2 } from "lucide-react";

const InputField = ({ label, value, onChange }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[12px] font-black text-gray-400 uppercase ml-1">{label}</label>
    <input
      type="text"
      value={value || ""}
      onChange={onChange}
      className="border border-gray-100 bg-gray-50/50 rounded-xl px-4 py-3 text-[14px] focus:border-orange-500 focus:bg-white outline-none transition-all"
    />
  </div>
);

const BillingForm = ({ billingAddress, setBillingAddress, sameAsDelivery, setSameAsDelivery }) => {
  const fields = [
    { id: "organizationName", label: "Organization" },
    { id: "gstNumber", label: "GST Number" },
    { id: "fullName", label: "Full Name" },
    { id: "phone", label: "Phone" },
    { id: "street", label: "Street" },
    { id: "area", label: "Area" },
    { id: "city", label: "City" },
    { id: "state", label: "State" },
    { id: "country", label: "Country" },
    { id: "pincode", label: "Pincode" },
  ];

  return (
    <section className="bg-white rounded-3xl border border-orange-200 p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
            <Building2 size={28} />
          </div>
          <h2 className="text-xl font-black text-gray-800">2. Billing Details</h2>
        </div>
        <label className="flex items-center gap-2 cursor-pointer text-[13px] font-bold text-gray-500">
          <input
            type="checkbox"
            checked={sameAsDelivery}
            onChange={(e) => setSameAsDelivery(e.target.checked)}
            className="accent-[#E68736] w-4 h-4"
          />
          Same as Delivery
        </label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((f) => (
          <InputField 
            key={f.id} 
            label={f.label} 
            value={billingAddress[f.id]} 
            onChange={(e) => setBillingAddress({ ...billingAddress, [f.id]: e.target.value })} 
          />
        ))}
      </div>
    </section>
  );
};

export default BillingForm;