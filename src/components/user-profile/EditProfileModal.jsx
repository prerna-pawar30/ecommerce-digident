import { HiUser, HiCamera } from "react-icons/hi";
import { Loader2 } from "lucide-react";
import { useRef } from "react";

const EditProfileModal = ({ 
  isOpen, onClose, formData, setFormData, 
  previewImg, handlePhotoChange, handleUpdateProfile, uploading 
}) => {
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl relative">
        <h2 className="text-2xl font-black mb-6 text-slate-800 text-center">Update Profile</h2>
        
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="w-28 h-28 rounded-3xl border-4 border-orange-200 bg-gray-50 shadow-inner overflow-hidden flex items-center justify-center">
                {previewImg ? (
                  <img src={previewImg} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <HiUser className="text-gray-300 w-16 h-16" />
                )}
              </div>
              <input type="file" ref={fileInputRef} hidden onChange={handlePhotoChange} accept="image/*" />
              <button 
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="absolute -bottom-2 -right-2 bg-[#e67e22] text-white p-2.5 rounded-2xl shadow-lg hover:bg-black transition-all"
              >
                <HiCamera size={18} />
              </button>
            </div>
            <p className="mt-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Change Photo</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input 
              placeholder="First Name"
              className="w-full bg-orange-50 border-none rounded-2xl px-5 py-3 font-bold text-slate-700" 
              value={formData.firstName} 
              onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
            />
            <input 
              placeholder="Last Name"
              className="w-full bg-orange-50 border-none rounded-2xl px-5 py-3 font-bold text-slate-700" 
              value={formData.lastName} 
              onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
            />
          </div>
          
          <input className="w-full bg-gray-100 border-none rounded-2xl px-5 py-3 text-slate-400 cursor-not-allowed" value={formData.email} readOnly />
          
          <input 
            placeholder="Institute Name"
            className="w-full bg-orange-50 border-none rounded-2xl px-5 py-3 font-bold text-slate-700" 
            value={formData.instituteName} 
            onChange={(e) => setFormData({...formData, instituteName: e.target.value})} 
          />
          
          <input 
            placeholder="Phone Number"
            className="w-full bg-orange-50 border-none rounded-2xl px-5 py-3 font-bold text-slate-700" 
            value={formData.phone} 
            onChange={(e) => setFormData({...formData, phone: e.target.value})} 
          />
          
          <button 
            type="submit" 
            disabled={uploading}
            className="w-full bg-[#e67e22] text-white py-4 rounded-2xl font-black shadow-lg mt-4 flex items-center justify-center gap-2"
          >
            {uploading ? <Loader2 className="animate-spin" size={20} /> : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;