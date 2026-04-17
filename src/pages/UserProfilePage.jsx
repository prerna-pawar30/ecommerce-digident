/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { 
  HiMail, HiPhone, HiOfficeBuilding, HiLocationMarker, 
  HiChevronRight, HiOutlineShoppingBag,  
} from "react-icons/hi";
import Swal from 'sweetalert2';

import { fetchUserDashboard, updateUserProfile } from "../api/ApiService";

import ProfileHeader from "../components/user-profile/ProfileHeader";
import ProfileStats from "../components/user-profile/ProfileStats";
import EditProfileModal from "../components/user-profile/EditProfileModal";

const ProfileSkeleton = () => (
  <div className="min-h-screen pb-20 font-sans animate-pulse bg-gray-50/30">
    <div className="h-44 md:h-94 w-full bg-gray-200" />
    <main className="max-w-6xl mx-auto px-4 md:px-8 mt-12 md:mt-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="h-40 bg-gray-200 rounded-[2rem]" />
          <div className="h-64 bg-gray-200 rounded-[2rem]" />
        </div>
        <div className="lg:col-span-8 space-y-8">
          <div className="h-96 bg-gray-200 rounded-[2rem]" />
        </div>
      </div>
    </main>
  </div>
);

const UserProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItemsCount = useSelector((state) => state.cart?.items?.length || 0);
  
  const [dashboardData, setDashboardData] = useState({ user: null, addresses: [], orders: [] });
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewImg, setPreviewImg] = useState("");
  const [formData, setFormData] = useState({ 
    firstName: "", lastName: "", email: "", phone: "", instituteName: "", avatar: null 
  });

  const fetchedRef = useRef(false);

  useEffect(() => {
    const getDashboard = async () => {
      try {
        setLoading(true);
        const response = await fetchUserDashboard();
        if (response.success) {
          const userData = response.data; 
          const userAddresses = response.data.address || [];
          const userOrders = response.data.orderHistory || [];
          
          setDashboardData({ 
            user: userData, 
            addresses: userAddresses, 
            orders: userOrders 
          });

          dispatch({ type: "auth/setUser", payload: userData });
          
          setFormData({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: userData.email || "",
            phone: userData.phone || "",
            instituteName: userData.instituteName || "",
            avatar: null
          });
          setPreviewImg(userData.avatar || "");
        }
      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!fetchedRef.current) {
      fetchedRef.current = true;
      getDashboard();
    }
  }, [dispatch]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, avatar: file }));
      setPreviewImg(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const data = new FormData();
      data.append("firstName", (formData.firstName || "").trim());
      data.append("lastName", (formData.lastName || "").trim());
      data.append("phone", (formData.phone || "").trim());
      data.append("instituteName", (formData.instituteName || "").trim());
      
      if (formData.avatar instanceof File) {
        data.append("avatar", formData.avatar); 
      }

      const response = await updateUserProfile(data);
      
      if (response.success) {
        const updatedUser = response.data?.user || response.data;
        setDashboardData(prev => ({ ...prev, user: updatedUser }));
        dispatch({ type: 'auth/setUser', payload: updatedUser }); 
        
        Swal.fire({ icon: 'success', title: 'Profile Updated', timer: 1500, showConfirmButton: false });
        setIsEditModalOpen(false);
      }
    } catch (err) {
      Swal.fire("Error", "Failed to update profile", "error");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <ProfileSkeleton />;

  const { user, addresses, orders } = dashboardData;

  return (
    <div className="min-h-screen pb-20 font-sans ">
      <ProfileHeader user={user} onEditClick={() => setIsEditModalOpen(true)} />

      <main className="max-w-6xl mx-auto px-4 md:px-8 mt-26 md:mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* SIDEBAR */}
          <div className="lg:col-span-4 space-y-6">
            <ProfileStats 
              ordersCount={orders?.length || 0} 
              cartItemsCount={cartItemsCount} 
              addressesCount={addresses?.length || 0} 
              onCartClick={() => navigate('/cart')} 
            />

            <div className="bg-white rounded-[2rem] p-6 border border-orange-100 shadow-sm">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-6 border-b border-orange-50 pb-3">
                User Information
              </h3>
              <div className="space-y-6">
                <InfoItem icon={<HiMail />} label="Email Address" value={user?.email} />
                <InfoItem icon={<HiPhone />} label="Mobile Number" value={user?.phone || "Not provided"} />
                <InfoItem icon={<HiOfficeBuilding />} label="Institute Name" value={user?.instituteName || "Not provided"} />
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="lg:col-span-8 space-y-8">
            {/* Addresses */}
            <div className="bg-white rounded-[2rem] border border-orange-100 shadow-sm overflow-hidden">
              <SectionHeader title="Saved Addresses" btnText="Manage" onBtnClick={() => navigate('/add-address')} />
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses?.length > 0 ? (
                  addresses.map((addr) => (
                    /* FIX 1: Use addressId for unique key */
                    <div key={addr.addressId || addr._id} className="p-5 rounded-2xl bg-slate-50/50 flex gap-4 border border-slate-100 hover:border-orange-200 transition-colors">
                      <HiLocationMarker className="text-[#e67e22] mt-1 shrink-0" size={20} />
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-wider">{addr.label || 'Address'}</p>
                        <p className="text-sm font-bold text-slate-700 leading-relaxed">
                          {addr.street}, <br /> {addr.area} <br /> {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="col-span-2 text-center text-gray-400 py-4 italic">No addresses saved.</p>
                )}
              </div>
            </div>

            {/* Orders */}
            <div className="bg-white rounded-[2rem] border border-orange-100 shadow-sm overflow-hidden">
              <SectionHeader title="Recent Orders" btnText="View All" onBtnClick={() => navigate('/order-history')} />
              <div className="divide-y divide-gray-50">
                {orders?.length > 0 ? (
                  orders.slice(0, 5).map((orderWrapper) => {
                    /* FIX 2: Handle nested orderId object from your JSON */
                    const orderDetail = orderWrapper.orderId;
                    
                    // Safety check if orderDetail is missing
                    if (!orderDetail) return null;

                    return (
                      <div 
                        key={orderDetail._id} 
                        className="p-6 flex items-center justify-between hover:bg-orange-50/30 transition-colors cursor-pointer group" 
                        onClick={() => navigate(`/order/${orderDetail.orderId}`)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 bg-orange-100/50 rounded-xl flex items-center justify-center text-[#e67e22] group-hover:scale-110 transition-transform">
                            <HiOutlineShoppingBag size={22} />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-800">{orderDetail.orderId}</p>
                            <p className="text-xs text-gray-400 font-bold">
                              {orderDetail.createdAt ? new Date(orderDetail.createdAt).toDateString() : "Date N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-slate-800">₹{orderDetail.grandTotal}</p>
                          <span className="text-[10px] font-black uppercase px-2 py-1 rounded-lg bg-orange-50 text-orange-600 border border-orange-100">
                            {orderDetail.orderStatus}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-gray-400 py-10">No order history available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <EditProfileModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        previewImg={previewImg}
        handlePhotoChange={handlePhotoChange}
        handleUpdateProfile={handleUpdateProfile}
        uploading={uploading}
      />
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 group">
    <div className="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:text-[#e67e22] group-hover:bg-orange-50 transition-colors">{icon}</div>
    <div>
      <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">{label}</p>
      <p className="text-sm font-bold text-slate-700">{value || ""}</p>
    </div>
  </div>
);

const SectionHeader = ({ title, btnText, onBtnClick }) => (
  <div className="px-6 py-5 flex justify-between items-center border-b border-gray-50">
    <h3 className="text-lg md:text-xl font-black text-slate-800 tracking-tight">{title}</h3>
    <button onClick={onBtnClick} className="text-xs md:text-sm font-black text-[#e67e22] flex items-center gap-1 hover:gap-2 transition-all">
      {btnText} <HiChevronRight size={18} />
    </button>
  </div>
);

export default UserProfile;