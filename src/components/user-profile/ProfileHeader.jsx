import { HiUser, HiBadgeCheck, HiPencil, HiHome } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import profileBg from "../../assets/home/profileimg.webp"; 

const ProfileHeader = ({ user, onEditClick }) => {
  const navigate = useNavigate();

  return (
    <div 
      /* MOBILE: bg-slate-50 (or any solid color)
         DESKTOP: md:bg-cover md:bg-center (shows image)
      */
      className="h-64 md:h-94 w-full relative rounded-b-[2rem] md:rounded-b-3xl md:bg-cover md:bg-center "
      style={{ backgroundImage: window.innerWidth >= 768 ? `url(${profileBg})` : 'none' }}
    >
      {/* MOBILE: Hidden overlay (not needed for solid color)
          DESKTOP: Visible overlay
      */}
      <div className="absolute inset-0 rounded-b-[2rem] md:rounded-b-3xl  hidden md:block" />

      {/* MOBILE: We use -bottom-24 instead of -bottom-52 because 
          without the image, we don't need to push the content as far down.
      */}
      <div className="absolute -bottom-14 md:-bottom-16 left-0 right-0 max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6 relative">
          
          {/* Profile Avatar */}
          <div className="relative">
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl border-4 border-white bg-white shadow-xl flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <HiUser className="text-gray-300 w-16 h-16 md:w-20 md:h-20" />
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="text-center md:text-left flex-1">
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 flex items-center justify-center md:justify-start gap-2">
              {user?.firstName} {user?.lastName}
              <HiBadgeCheck className="text-blue-500 shrink-0" size={24} />
            </h1>
            <p className="text-slate-500 font-medium text-sm md:text-base">{user?.email}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center md:justify-end gap-2 md:gap-3 mt-2 md:mb-2">
            <button 
              onClick={onEditClick}
              className="bg-white text-slate-800 px-5 md:px-6 py-2.5 rounded-xl font-bold shadow-sm border border-orange-200 flex items-center gap-2 hover:bg-gray-50 transition-all active:scale-95 text-sm md:text-base"
            >
              <HiPencil /> 
              <span className="hidden xs:inline sm:inline">Edit Profile</span>
              <span className="xs:hidden sm:hidden">Edit</span>
            </button>

            <button 
              onClick={() => navigate("/")}
              className="bg-[#E68736] text-white p-2.5 md:px-6 md:py-2.5 rounded-xl font-bold shadow-md hover:bg-black transition-all active:scale-95 flex items-center gap-2"
              title="Go to Home"
            >
              <HiHome size={20} />
              <span className="hidden md:block">Home</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;