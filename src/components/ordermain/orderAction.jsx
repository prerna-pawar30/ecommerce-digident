import React from "react";
import { Download, Loader2, RefreshCcw, RotateCcw } from "lucide-react";
import { HiArrowLeft } from "react-icons/hi";

export default function OrderActionBar({
  order,
  cancelLoading,
  canReturn,
  isRefunded,
  onBack,
  onDownloadInvoice,
  onReturnOrder,
  onCancelOrder,
}) {
  return (
    <div className="container mx-auto px-4 max-w-5xl flex justify-end mb-4 gap-3">
      <button
        onClick={onBack}
        className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-[#E68736] hover:text-[#E68736] transition-all cursor-pointer bg-white shadow-sm"
        title="Go Back"
      >
        <HiArrowLeft size={20} />
      </button>

      {order.orderStatus === "delivered" && (
        <button
          onClick={onDownloadInvoice}
          className="flex items-center gap-2 px-5 py-2 bg-[#E68736] text-white rounded-md font-semibold hover:bg-[#d4762c] transition "
        >
          <Download size={16} /> Download Invoice
        </button>
      )}

      {(() => {
        if (!order?.items) return null;

        const hasReturnable = order.items.some((item) => {
          const returned = item.returnedQuantity || 0;
          return item.quantity - returned > 0;
        });

       

        if (!canReturn || !hasReturnable) return null;

        return (
          <button
            onClick={onReturnOrder}
            disabled={cancelLoading}
            className="flex items-center gap-2 px-5 py-2 bg-white border border-[#E68736] text-[#E68736] rounded-md font-semibold hover:bg-[#fff9f4] transition"
          >
            {cancelLoading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <>
                <RefreshCcw size={16} /> Return Items
              </>
            )}
          </button>
        );
      })()}

      {isRefunded ? (
        <div className="flex items-center gap-2 bg-rose-50 px-4 py-2 rounded-lg border border-rose-100">
          <RotateCcw size={16} className="text-rose-600" />
          <span className="text-rose-600 font-black text-sm uppercase tracking-wider">
            Amount Refunded
          </span>
        </div>
      ) : !["delivered", "cancelled", "returned", "partial_returned"].includes(
          order.orderStatus
        ) ? (
        <button
          onClick={onCancelOrder}
          disabled={cancelLoading}
          className="px-5 py-2 text-sm font-semibold rounded-md border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
        >
          {cancelLoading ? "Processing..." : "Cancel Order"}
        </button>
      ) : (
        order.orderStatus === "cancelled" && (
          <span className="text-red-600 font-bold text-sm bg-red-50 px-4 py-2 rounded-md border border-red-100">
            Order Cancelled
          </span>
        )
      )}
    </div>
  );
}