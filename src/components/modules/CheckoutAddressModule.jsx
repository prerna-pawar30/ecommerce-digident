/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi';
import Swal from 'sweetalert2';
import Breadcrumb from "../ui/Breadcrumb";
import DynamicProgressStepper from "../ui/steps";
import AddressFormPage from "../address/AddressFormPage";
import { fetchAllAddresses, deleteAddress } from '../../api/ApiService';

export default function CheckoutAddressModule() {
  const location = useLocation();
  const navigate = useNavigate();

  const [view, setView] = useState('list');
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [editingAddress, setEditingAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAddresses = async () => {
    setLoading(true);
    try {
      const response = await fetchAllAddresses();
      if (response.success) {
        const data = response.data || [];
        setAddresses(data);

        if (data.length === 0) {
          setView('form');
        } else {
          setSelectedAddressId(data[0].addressId || data[0]._id);
          setView('list');
        }
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
      text: 'This will be permanently removed.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E68736',
      confirmButtonText: 'Yes, delete it',
    });

    if (result.isConfirmed) {
      try {
        await deleteAddress(id);
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          timer: 1500,
          showConfirmButton: false
        });
        loadAddresses();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to delete'
        });
      }
    }
  };

  const handleFinalCheckout = () => {
    const chosenAddress = addresses.find(
      (a) => (a.addressId || a._id) === selectedAddressId
    );
    navigate('/checkout', { state: { selectedAddress: chosenAddress } });
  };

  if (loading) {
    return (
      <div className="py-20 text-center font-bold text-[#E68736] animate-pulse uppercase tracking-widest text-xs">
        Loading Digident Addresses...
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 md:py-16 min-h-screen font-sans bg-gray-50/30">
      <DynamicProgressStepper />
      <div className="max-w-5xl mx-auto px-4">
        <Breadcrumb />
      </div>

      <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8">
        {view === 'list' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2 space-y-4 order-2 lg:order-1">
              <button
                onClick={() => {
                  setEditingAddress(null);
                  setView('form');
                }}
                className="w-full border-2 border-dashed border-orange-200 rounded-2xl p-5 sm:p-6 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-[#E68736] hover:text-[#E68736] bg-white transition-all cursor-pointer"
              >
                <div className="p-3 bg-orange-50 rounded-full">
                  <HiPlus size={24} className="text-[#E68736]" />
                </div>
                <span className="font-bold text-sm sm:text-base">Add a new address</span>
              </button>

              {addresses.map((addr) => {
                const id = addr.addressId || addr._id;
                const isSelected = selectedAddressId === id;

                return (
                  <div
                    key={id}
                    onClick={() => setSelectedAddressId(id)}
                    className={`cursor-pointer border-2 rounded-2xl p-4 sm:p-5 bg-white transition-all ${
                      isSelected
                        ? 'border-[#E68736] shadow-md shadow-orange-100'
                        : 'border-gray-100'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                      <div className="flex gap-3 sm:gap-4">
                        <div
                          className={`mt-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            isSelected ? 'border-[#E68736]' : 'border-gray-200'
                          }`}
                        >
                          {isSelected && <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#E68736] rounded-full" />}
                        </div>

                        <div className="min-w-0">
                          <p className="font-bold text-gray-800 text-sm sm:text-base break-words">
                            {addr.firstName} {addr.lastName}
                          </p>
                          <p className="text-sm text-gray-600 break-words">
                            {addr.street}, {addr.area}
                          </p>
                          <p className="text-sm text-gray-600 break-words">
                            {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                          <p className="text-sm font-bold mt-2 text-gray-700 break-words">
                            Phone: {addr.phone}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 self-end sm:self-auto">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingAddress(addr);
                            setView('form');
                          }}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg cursor-pointer"
                        >
                          <HiPencil size={20} />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(id);
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                        >
                          <HiTrash size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="lg:col-span-1 order-1 lg:order-2">
              <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 lg:sticky lg:top-24 shadow-sm">
                <h3 className="font-bold text-gray-400 mb-4 uppercase text-[10px] tracking-widest">
                  Order Summary
                </h3>
                <button
                  onClick={handleFinalCheckout}
                  disabled={!selectedAddressId}
                  className="w-full bg-[#E68736] text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:shadow-lg disabled:bg-gray-200 transition-all cursor-pointer border border-[#E68736] hover:bg-white hover:text-[#E68736]"
                >
                  Deliver to this address
                </button>
              </div>
            </div>
          </div>
        ) : (
          <AddressFormPage
            initialData={editingAddress}
            onCancel={() => addresses.length > 0 ? setView('list') : navigate(-1)}
            onSuccess={() => {
              loadAddresses();
              setView('list');
            }}
          />
        )}
      </div>
    </div>
  );
}