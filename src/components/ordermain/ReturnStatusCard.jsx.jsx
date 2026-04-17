import React from "react";

export default function ReturnStatusCard({
  order,
  isReturnApproved,
  totalReturnedQty,
  totalReturnedAmount,
}) {
  if (!(order.returnRequests && order.returnRequests.length > 0)) {
    return null;
  }

  return (
    <div
      className={`border rounded-xl p-4 mb-6 ${
        isReturnApproved
          ? "bg-green-50 border-green-200"
          : "bg-yellow-50 border-yellow-200"
      }`}
    >
      <div className="flex justify-between items-center">
        <h4 className="font-bold text-gray-800">Return Request Information</h4>

        <span
          className={`text-[10px] font-black px-3 py-1 rounded uppercase ${
            isReturnApproved
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {isReturnApproved ? "Approved" : "Pending Approval"}
        </span>
      </div>

      <p className="text-sm mt-2 text-gray-700">
        {isReturnApproved
          ? `Your return request has been approved by Digident.`
          : `Your return request is under review. Once approved, refund will be processed.`}
      </p>

      {isReturnApproved && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <p className="text-[10px] text-gray-400 uppercase font-bold">
              Total Returned Items
            </p>
            <p className="text-xl font-black text-green-700">
              {totalReturnedQty} Units
            </p>
          </div>

          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <p className="text-[10px] text-gray-400 uppercase font-bold">
              Refund Amount
            </p>
            <p className="text-xl font-black text-green-700">
              ₹{totalReturnedAmount.toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}