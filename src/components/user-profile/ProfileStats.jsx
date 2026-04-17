import { HiShoppingCart, HiArrowSmRight } from "react-icons/hi";

const ProfileStats = ({ ordersCount, cartItemsCount, addressesCount, onCartClick }) => (
  <div className="space-y-4 md:space-y-6">
    {/* Stats Grid - Now with better mobile spacing */}
    <div className="bg-white p-3 md:p-4 rounded-[2rem] border border-orange-100 shadow-sm grid grid-cols-2 gap-3">
      
      {/* Orders Card */}
      <div className="text-center p-3 md:p-4 bg-orange-50/50 rounded-2xl border border-transparent hover:border-orange-200 transition-colors">
        <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-tight">Orders</p>
        <p className="text-xl md:text-2xl font-black text-[#e67e22]">{ordersCount}</p>
      </div>

      {/* Address Card */}
      <div className="text-center p-3 md:p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200 transition-colors">
        <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-tight">Addresses</p>
        <p className="text-xl md:text-2xl font-black text-slate-800">{addressesCount}</p>
      </div>
    </div>

    {/* Shopping Cart Action Button */}
    <button 
      onClick={onCartClick}
      className="w-full bg-slate-900 text-white p-4 md:p-6 rounded-[2rem] flex items-center justify-between group hover:bg-[#e67e22] transition-all shadow-lg active:scale-[0.98]"
    >
      <div className="flex items-center gap-3 md:gap-4">
        <div className="p-2.5 md:p-3 bg-white/10 rounded-xl md:rounded-2xl">
          <HiShoppingCart size={22} className="md:w-6 md:h-6" />
        </div>
        <div className="text-left">
          <p className="text-[10px] md:text-xs font-bold text-white/60 uppercase tracking-wider">Shopping Cart</p>
          <p className="text-base md:text-lg font-black">{cartItemsCount} Items Saved</p>
        </div>
      </div>
      
      <div className="bg-white/10 p-2 rounded-full group-hover:bg-white group-hover:text-[#e67e22] transition-all">
        <HiArrowSmRight size={20} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </button>
  </div>
);

export default ProfileStats;