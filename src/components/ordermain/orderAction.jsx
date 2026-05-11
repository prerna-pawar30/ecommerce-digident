import React from "react";
import { Loader2, RefreshCcw, RotateCcw } from "lucide-react";
import { HiArrowLeft } from "react-icons/hi";
import UserInvoiceButton from "./UserInvoiceButton";

export default function OrderActionBar({
  order,
  cancelLoading,
  canReturn,
  isRefunded,
  onBack,
  onReturnOrder,
  onCancelOrder,
}) {
  const showInvoice = ["delivered", "partial_returned", "returned"].includes(order?.orderStatus?.trim().toLowerCase());
  const currentInvoiceId = order?.invoiceId;

  // Shared Gradient Style
  const gradientStyle = {
    cursor: cancelLoading ? "not-allowed" : "pointer",
    background: cancelLoading 
      ? '#9CA3AF' 
      : 'linear-gradient(160deg, #f8c1a1, #eb730b 100%)',
    border: 'none' // Remove default borders to let gradient shine
  };

  return (
    <div className="container mx-auto px-4 max-w-5xl flex justify-end mb-4 gap-3 items-center">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-[#E68736] hover:text-[#E68736] transition-all cursor-pointer bg-white shadow-sm"
        title="Go Back"
      >
        <HiArrowLeft size={20} />
      </button>

      {/* DOWNLOAD INVOICE BUTTON */}
      {showInvoice && currentInvoiceId && (
        <UserInvoiceButton 
          invoiceId={currentInvoiceId}
          className="font-semibold shadow-sm h-10" 
        />
      )}

      {/* RETURN ITEMS BUTTON */}
      {(() => {
        if (!order?.items) return null;
        const hasReturnable = order.items.some((item) => (item.quantity - (item.returnedQuantity || 0)) > 0);
        
        if (!canReturn || !hasReturnable) return null;

        return (
          <button
            onClick={onReturnOrder}
            disabled={cancelLoading}
            className="flex items-center gap-2 px-5 py-2 h-10 text-white rounded-md font-semibold transition shadow-sm"
            style={gradientStyle}
          >
            {cancelLoading ? <Loader2 className="animate-spin" size={16} /> : (
              <><RefreshCcw size={16} /> Return Items</>
            )}
          </button>
        );
      })()}

      {/* REFUNDED / CANCEL LOGIC */}
      {isRefunded ? (
        <div className="flex items-center gap-2 bg-rose-50 px-4 py-2 rounded-lg border border-rose-100 h-10">
          <RotateCcw size={16} className="text-rose-600" />
          <span className="text-rose-600 font-black text-sm uppercase tracking-wider">
            Amount Refunded
          </span>
        </div>
      ) : !["delivered", "cancelled", "returned", "partial_returned"].includes(order?.orderStatus?.toLowerCase()) ? (
        <button
          onClick={onCancelOrder}
          disabled={cancelLoading}
          className="px-5 py-2 h-10 text-sm font-semibold rounded-md text-white transition shadow-sm"
          style={gradientStyle}
        >
          {cancelLoading ? "Processing..." : "Cancel Order"}
        </button>
      ) : (
        order.orderStatus === "cancelled" && (
          <span className="text-red-600 font-bold text-sm bg-red-50 px-4 py-2 rounded-md border border-red-100 h-10 flex items-center">
            Order Cancelled
          </span>
        )
      )}
    </div>
  );
}