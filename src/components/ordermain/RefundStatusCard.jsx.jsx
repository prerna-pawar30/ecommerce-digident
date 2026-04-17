import React from "react";
import { RotateCcw } from "lucide-react";

export default function RefundStatusCard({ order }) {
  if (!(order.orderStatus === "cancelled" || order.paymentStatus === "refunded")) {
    return null;
  }

  return (
    <div
      className={`border rounded-xl p-4 mb-6 flex items-start gap-4 shadow-sm ${
        order.paymentStatus === "refund-failed"
          ? "bg-red-50 border-red-200"
          : "bg-rose-50 border-rose-200"
      }`}
    >
      <div
        className={`p-2 rounded-full ${
          order.paymentStatus === "refund-failed" ? "bg-red-100" : "bg-rose-100"
        }`}
      >
        <RotateCcw
          className={
            order.paymentStatus === "refund-failed"
              ? "text-red-600"
              : "text-rose-600"
          }
          size={20}
        />
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-center">
          <h4
            className={`font-bold ${order.paymentStatus === "refund-failed" ? "text-red-800" : "text-rose-800"}`}
          >
            Refund Information
          </h4>
          <span
            className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
              order.paymentStatus === "refunded"
                ? "bg-green-100 text-green-700"
                : order.paymentStatus === "refund_pending"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-red-100 text-red-700"
            }`}
          >
            {order.paymentStatus === "refunded"
              ? "Refunded"
              : order.paymentStatus === "refund_pending"
                ? "Payment In Process"
                : order.paymentStatus === "refund-failed"
                  ? "Failed"
                  : "Pending"}
          </span>
        </div>

        <p
          className={`text-[12px] mt-1 ${order.paymentStatus === "refund-failed" ? "text-red-700" : "text-rose-700"}`}
        >
          {order.paymentStatus === "refunded"
            ? `A refund of ₹${(order.refundAmount || order.grandTotal).toLocaleString()} was processed ${order.refundedAt ? `on ${new Date(order.refundedAt).toLocaleDateString()}` : "successfully"}.`
            : order.paymentStatus === "refund_pending"
              ? "Your refund is currently being processed by the bank. Please wait 5-7 business days."
              : order.paymentStatus === "refund-failed"
                ? "There was an issue processing your refund. Please contact support with your Refund ID."
                : "Your refund has been initiated."}
        </p>

        {order.razorpayRefundId && (
          <p className="text-[10px] text-gray-400 mt-2 font-mono">
            Refund ID: {order.razorpayRefundId}
          </p>
        )}
      </div>
    </div>
  );
}