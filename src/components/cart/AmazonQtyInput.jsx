/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function AmazonQtyInput({ item, onUpdate }) {
  const [localQty, setLocalQty] = useState(item.quantity);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLocalQty(item.quantity);
  }, [item.quantity]);

  const handleInternalUpdate = async () => {
    if (!localQty || localQty < 1) return;

    try {
      setLoading(true);
      const vId = item.variant?.id || item.variantId;
      await onUpdate(vId, localQty);

      Swal.fire({
        title: "Updated",
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
    } catch (error) {
      Swal.fire({
        title: "Stock Limit",
        text: error?.message || "Requested quantity not available",
        icon: "warning",
        confirmButtonColor: "#E68736",
      });
      setLocalQty(item.quantity);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full sm:w-auto">
      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden h-9 bg-white w-full sm:w-auto">
        <input
          type="number"
          value={localQty}
          onChange={(e) => setLocalQty(parseInt(e.target.value) || "")}
          className="w-full sm:w-12 text-center font-bold text-sm focus:outline-none"
          min="1"
        />
        <button
          onClick={handleInternalUpdate}
          disabled={loading || localQty === item.quantity || !localQty}
          className={`px-3 h-full text-xs font-bold transition-colors flex items-center justify-center gap-1 ${
            loading
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : localQty !== item.quantity && localQty > 0
              ? "bg-white text-black hover:bg-[#E68736] hover:text-white cursor-pointer"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {loading ? "Updating" : "Update"}
        </button>
      </div>
    </div>
  );
}