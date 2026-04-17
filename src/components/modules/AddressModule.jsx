/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiPlus, HiPencil, HiTrash, HiHome, HiOfficeBuilding, HiLocationMarker } from 'react-icons/hi';
import Swal from 'sweetalert2';
import Breadcrumb from "../ui/Breadcrumb";
import AddressFormPage from "../address/AddressFormPage";
import { fetchAllAddresses, deleteAddress } from '../../api/ApiService';

export default function AddressModule() {
  const navigate = useNavigate();
  const [view, setView] = useState('list');
  const [addresses, setAddresses] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null); // Fixed: Added missing state
  const [loading, setLoading] = useState(true);

  const loadAddresses = async () => {
    setLoading(true);
    try {
      const response = await fetchAllAddresses();
      if (response.success) {
        const data = response.data || [];
        setAddresses(data);
        if (data.length === 0) setView('form');
        else setView('list');
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Address?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E68736',
      cancelButtonColor: '#f3f4f6',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await deleteAddress(id);
        Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1500, showConfirmButton: false });
        loadAddresses();
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to delete address.' });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-orange-100 border-t-[#E68736] rounded-full animate-spin mb-4"></div>
        <p className="text-[#E68736] font-bold animate-pulse text-xs uppercase tracking-[0.2em]">Loading Digident...</p>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12 min-h-screen ">
      <div className="max-w-6xl mx-auto px-4">
        <Breadcrumb />
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-8 mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Address Book</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your primary clinic and residential locations.</p>
          </div>
          {view === 'list' && (
            <button
              onClick={() => { setEditingAddress(null); setView('form'); }}
              className="flex items-center justify-center gap-2 bg-[#E68736] hover:bg-[#cf752d] text-white px-6 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-orange-200 active:scale-95"
            >
              <HiPlus size={20} />
              <span className="text-sm uppercase tracking-wide">Add New</span>
            </button>
          )}
        </div>

        {view === 'list' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addresses.map((addr) => {
              const id = addr.addressId || addr._id;
              // Icon logic based on label
              const Icon = addr.label === 'Work' || addr.label === 'Clinic' ? HiOfficeBuilding : 
                           addr.label === 'Home' ? HiHome : HiLocationMarker;

              return (
                <div key={id} className="group bg-white border border-gray-100 rounded-[2rem] p-7 shadow-sm hover:shadow-xl hover:shadow-orange-100/50 hover:border-orange-100 transition-all duration-500 flex flex-col justify-between relative overflow-hidden">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-orange-50 rounded-2xl text-[#E68736]">
                        <Icon size={24} />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setEditingAddress(addr); setView('form'); }}
                          className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        >
                          <HiPencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(id)}
                          className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <HiTrash size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="inline-block px-3 py-1 rounded-full bg-gray-100 text-[10px] font-black uppercase text-gray-500 mb-3 tracking-widest">
                      {addr.label || 'Other'}
                    </div>

                    <h3 className="font-bold text-gray-900 text-xl leading-tight">
                      {addr.firstName} {addr.lastName}
                    </h3>
                    
                    <div className="mt-4 space-y-1.5">
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {addr.street}, {addr.area}
                      </p>
                      <p className="text-gray-900 text-sm font-semibold">
                        {addr.city}, {addr.state} — {addr.pincode}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 pt-5 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Primary Contact</span>
                    <span className="text-sm font-black text-[#E68736]">{addr.phone}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AddressFormPage
                initialData={editingAddress}
                onCancel={() => addresses.length > 0 ? setView('list') : navigate(-1)}
                onSuccess={() => { loadAddresses(); setView('list'); }}
              />
          </div>
        )}
      </div>
    </div>
  );
}