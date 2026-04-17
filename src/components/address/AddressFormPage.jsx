import React, { useState } from 'react';
import { HiTag } from 'react-icons/hi';
import { Loader2 } from 'lucide-react'; // Optional: for a nice spinner
import Swal from 'sweetalert2';
import { addAddress, updateAddress } from '../../api/ApiService';

export default function AddressFormPage({ initialData, onCancel, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    phone: initialData?.phone || '',
    street: initialData?.street || '',
    area: initialData?.area || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    pincode: initialData?.pincode || '',
    country: initialData?.country || 'India',
    label: initialData?.label || 'Home'
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let e = {};
    // Trim values to prevent "space-only" entries
    if (!formData.firstName.trim()) e.firstName = "First name required";
    if (!formData.lastName.trim()) e.lastName = "Last name required";
    
    // Improved Phone Regex: strictly 10 digits
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) e.phone = "Invalid 10-digit number";
    
    if (!formData.street.trim()) e.street = "Address required";
    if (!formData.area.trim()) e.area = "Area required";
    if (!formData.city.trim()) e.city = "City required";
    
    // Pincode Regex: strictly 6 digits
    if (!/^\d{6}$/.test(formData.pincode)) e.pincode = "Invalid 6-digit pincode";
    if (!formData.state.trim()) e.state = "State required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || loading) return;

    setLoading(true);
    try {
      const id = initialData?.addressId || initialData?._id;
      // Pass clean data to API
      const payload = { ...formData, phone: formData.phone.replace(/\D/g, '') };
      
      const res = initialData ? await updateAddress(id, payload) : await addAddress(payload);

      if (res.success) {
        await Swal.fire({
          icon: 'success',
          title: 'Address Saved',
          timer: 1500,
          showConfirmButton: false
        });
        onSuccess();
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Failed to save address'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  return (
    <div className="max-w-2xl mx-auto bg-white border border-orange-200 rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 md:p-8 shadow-sm animate-in fade-in zoom-in duration-300">
      <div className="flex items-start sm:items-center gap-3 mb-6 sm:mb-8">
        <div className="p-2.5 sm:p-3 bg-orange-100 rounded-2xl shrink-0">
          <HiTag className="text-[#E68736]" size={22} />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-700">
            {initialData ? 'Edit Address' : 'Delivery Location'}
          </h2>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">
            Fill in delivery details
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input placeholder="First Name" val={formData.firstName} err={errors.firstName} onChange={(v) => handleChange('firstName', v)} disabled={loading} />
          <Input placeholder="Last Name" val={formData.lastName} err={errors.lastName} onChange={(v) => handleChange('lastName', v)} disabled={loading} />
        </div>

        <Input placeholder="Mobile Number" val={formData.phone} err={errors.phone} onChange={(v) => handleChange('phone', v)} disabled={loading} />

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">
            Flat, House no., Building
          </label>
          <Input placeholder="Address Line 1" val={formData.street} err={errors.street} onChange={(v) => handleChange('street', v)} disabled={loading} />
        </div>

        <Input placeholder="Area, Sector, Locality" val={formData.area} err={errors.area} onChange={(v) => handleChange('area', v)} disabled={loading} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input placeholder="City" val={formData.city} err={errors.city} onChange={(v) => handleChange('city', v)} disabled={loading} />
          <Input placeholder="Pincode" val={formData.pincode} err={errors.pincode} onChange={(v) => handleChange('pincode', v)} disabled={loading} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input placeholder="State" val={formData.state} err={errors.state} onChange={(v) => handleChange('state', v)} disabled={loading} />
          <input
            value={formData.country}
            readOnly
            className="w-full border-2 border-gray-50 p-4 rounded-2xl font-bold text-sm bg-gray-50 text-gray-400 outline-none"
          />
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2">
          {['Home', 'Work', 'Other'].map((l) => (
            <button
              key={l}
              type="button"
              disabled={loading}
              onClick={() => setFormData(prev => ({ ...prev, label: l }))}
              className={`py-3 rounded-xl font-bold text-[10px] uppercase border-2 transition-all ${
                formData.label === l
                  ? 'border-[#E68736] bg-orange-50 text-[#E68736]'
                  : 'border-orange-100 text-gray-400'
              } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="w-full py-4 bg-gray-50 text-gray-400 rounded-2xl font-bold uppercase text-[10px] cursor-pointer hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#E68736] text-white rounded-2xl font-bold uppercase text-[10px] border border-[#E68736] hover:bg-white hover:text-[#E68736] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:bg-orange-300 disabled:border-orange-300"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={14} /> Saving...
              </>
            ) : (
              'Save Address'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function Input({ placeholder, val, err, onChange, disabled }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <input
        placeholder={placeholder}
        value={val}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full border-2 p-3.5 sm:p-4 rounded-2xl outline-none font-bold text-sm transition-all ${
          err ? 'border-red-400 bg-red-50' : 'border-orange-100 focus:border-[#E68736]'
        } ${disabled ? 'bg-gray-50 cursor-not-allowed text-gray-400' : ''}`}
      />
      {err && <span className="text-red-400 text-[9px] font-bold uppercase ml-2">{err}</span>}
    </div>
  );
}