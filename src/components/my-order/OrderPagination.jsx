import { ChevronLeft, ChevronRight } from "lucide-react";

const OrderPagination = ({ currentPage, totalPages, onPageChange, loading }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="py-10 flex items-center justify-center gap-6">
      <button
        disabled={currentPage === 1 || loading}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm"
      >
        <ChevronLeft size={18} /> Previous
      </button>

      <div className="flex items-center gap-2">
        <span className="w-8 h-8 flex items-center justify-center rounded-md bg-[#E68736] text-white text-sm font-bold">
          {currentPage}
        </span>
        <span className="text-gray-400 font-medium text-sm">of</span>
        <span className="text-gray-700 font-bold text-sm">{totalPages}</span>
      </div>

      <button
        disabled={currentPage === totalPages || loading}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm"
      >
        Next <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default OrderPagination;