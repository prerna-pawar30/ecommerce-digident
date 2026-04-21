import { Hash, Package, CreditCard, ChevronRight } from "lucide-react";

const getStatusStyles = (status) => {
  switch (status?.toLowerCase()) {
    case "delivered": return "bg-green-100 text-green-700 border-green-200";
    case "cancelled": return "bg-red-100 text-red-700 border-red-200";
    case "placed": return "bg-blue-100 text-blue-700 border-blue-200";
    case "shipped": return "bg-orange-100 text-orange-700 border-orange-200";
    case "refunded": return "bg-purple-100 text-purple-700 border-purple-200";
    default: return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const OrderCard = ({ order, onClick }) => {
  const firstItem = order.items[0];

  return (
    <div
      onClick={onClick}
      className="group bg-white border border-orange-200 rounded-2xl overflow-hidden hover:border-[#E68736]/50 hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
      <div className=" px-6 py-3 border-b border-orange-200 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Order Date</p>
            <p className="text-sm font-semibold text-gray-700">
              {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Order ID</p>
            <p className="text-sm font-semibold text-gray-700 flex items-center gap-1">
              <Hash size={14} className="text-gray-400" /> {order.orderId}
            </p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full border text-[11px] font-black uppercase tracking-tighter ${getStatusStyles(order.orderStatus)}`}>
          {order.orderStatus}
        </div>
      </div>

      <div className="p-6 flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 bg-white rounded-xl border border-orange-200 p-2 group-hover:scale-105 transition-transform">
          <img src={firstItem?.image} alt="product" className="w-full h-full object-contain" />
        </div>

        <div className="flex-grow text-center md:text-left">
          <h3 className="text-lg font-bold text-gray-800 group-hover:text-[#E68736] transition-colors">
            {firstItem?.productName}
          </h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-1">
            {order.items.length > 1 ? `+ ${order.items.length - 1} other items` : "Single item purchase"}
          </p>
          <div className="flex items-center justify-center md:justify-start gap-4 mt-3">
            <span className="flex items-center gap-1 text-xs text-orange-400 font-medium bg-orange-50 px-2 py-1 rounded">
              <Package size={14} /> {order.totalItems} Items
            </span>
            <span className="flex items-center gap-1 text-xs text-orange-400 font-medium bg-orange-50 px-2 py-1 rounded">
              <CreditCard size={14} /> {order.paymentMode || 'Prepaid'}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-2">
          <p className="text-2xl font-black text-gray-900">₹{order.grandTotal?.toLocaleString()}</p>
          <button className="flex items-center gap-1 text-xs font-bold text-[#E68736] hover:underline underline-offset-4">
            View Details <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;