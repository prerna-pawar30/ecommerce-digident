import { HiUser, HiBadgeCheck, HiPencil, HiHome } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import profileBg from "../../assets/home/profileimg.webp"; 

const ProfileHeader = ({ user, onEditClick }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="h-38 md:h-94 w-full relative rounded-b-[2rem] md:rounded-b-3xl bg-slate-100 bg-no-repeat bg-center bg-cover"
      style={{ backgroundImage: `url(${profileBg})` }}
    >
      {/* Dark/Gradient overlay over background image for legibility on mobile text layout */}
      <div className="absolute inset-0 bg-black/10 md:bg-transparent rounded-b-[2rem] md:rounded-b-3xl z-0" />

      {/* Floating Meta Profile Info Layer */}
      <div className="absolute -bottom-24 md:-bottom-16 left-0 right-0 max-w-7xl mx-auto px-4 md:px-8 z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-3 md:gap-6 relative">
          
          {/* Profile Avatar Frame container */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-white bg-white shadow-xl flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <HiUser className="text-gray-300 w-12 h-12 md:w-20 md:h-20" />
              )}
            </div>
          </div>

          {/* User Profile Context details metadata blocks */}
          <div className="text-center md:text-left flex-1 min-w-0">
            <h1 className="text-xl md:text-3xl font-black text-slate-800 flex items-center justify-center md:justify-start gap-1.5 break-words">
              <span className="truncate">{user?.firstName || "User"} {user?.lastName || ""}</span>
              <HiBadgeCheck className="text-blue-500 shrink-0" size={22} />
            </h1>
            <p className="text-slate-500 font-medium text-xs md:text-base truncate max-w-xs md:max-w-full">
              {user?.email}
            </p>
          </div>

          {/* Mobile and Desktop Action Triggers layout spacing wrappers */}
          <div className="flex items-center justify-center md:justify-end gap-2 mt-2 md:mt-0 md:mb-2 w-full md:w-auto px-4 md:px-0">
            <button 
              onClick={onEditClick}
              className="flex-1 md:flex-none bg-white text-slate-800 px-4 md:px-6 py-2 rounded-xl font-bold shadow-sm border border-orange-200 flex items-center justify-center gap-2 hover:bg-gray-50 transition-all active:scale-95 text-xs md:text-base"
            >
              <HiPencil className="shrink-0" /> 
              <span>Edit Profile</span>
            </button>

            <button 
              onClick={() => navigate("/")}
              className="flex-1 md:flex-none text-white px-4 py-2 md:px-6 md:py-2.5 rounded-xl font-bold shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 text-xs md:text-base"
              title="Go to Home"
              style={{ 
                cursor: "pointer", 
                background: 'linear-gradient(160deg, #f8c1a1, #eb730b 100%)' 
              }}
            >
              <HiHome size={16} className="md:w-5 md:h-5 shrink-0" />
              <span>Home</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;