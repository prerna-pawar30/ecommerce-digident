import React from "react";
import { Clock, PackageCheck, Truck, CheckCircle, RotateCcw, XCircle, RefreshCcw } from "lucide-react";

const statusSteps = [
  {
    key: "placed",
    label: "Ordered",
    icon: Clock,
    getDate: order => order.createdAt,
    isActive: () => true,
    isCompleted: order => ["confirmed", "shipped", "delivered", "returning", "returned", "partial_returned", "refunded"].includes(order.orderStatus),
    color: () => "bg-green-500",
  },
  {
    key: "confirmed",
    label: "Confirmed",
    icon: PackageCheck,
    getDate: order => order.paidAt || order.statusUpdatedAt,
    isActive: order => ["confirmed", "shipped", "delivered", "returning", "returned", "partial_returned", "refunded"].includes(order.orderStatus) || order.paymentStatus === "paid",
    isCompleted: order => ["shipped", "delivered", "returning", "returned", "partial_returned", "refunded"].includes(order.orderStatus),
    color: order => (order.paymentStatus === "paid" || order.orderStatus !== "placed") ? "bg-green-500" : "bg-gray-200",
  },
  {
    key: "shipped",
    label: "Shipped",
    icon: Truck,
    getDate: order => order.shippedAt || order.statusUpdatedAt,
    isActive: order => ["shipped", "delivered", "returning", "returned", "partial_returned", "refunded"].includes(order.orderStatus),
    isCompleted: order => ["delivered", "returning", "returned", "partial_returned", "refunded"].includes(order.orderStatus),
    color: order => ["shipped", "delivered", "returning", "returned", "partial_returned", "refunded"].includes(order.orderStatus) ? "bg-green-500" : "bg-gray-200",
  },
  {
    key: "delivered",
    label: "Delivered",
    icon: CheckCircle,
    getDate: order => order.deliveredAt || order.statusUpdatedAt,
    isActive: order => ["delivered", "returning", "returned", "partial_returned", "refunded"].includes(order.orderStatus),
    isCompleted: order => ["returning", "returned", "partial_returned", "refunded"].includes(order.orderStatus),
    color: order => ["delivered", "returning", "returned", "partial_returned", "refunded"].includes(order.orderStatus) ? "bg-green-500" : "bg-gray-200",
  },
  {
    key: "returning",
    label: "Returning",
    icon: RefreshCcw,
    getDate: order => order.returnRequests?.[0]?.requestedAt,
    isActive: order => order.orderStatus === "returning",
    isCompleted: order => ["returned", "partial_returned", "refunded"].includes(order.orderStatus),
    color: order => order.orderStatus === "returning" ? "bg-orange-500" : "bg-gray-200",
  },
  {
    key: "returned",
    label: "Returned",
    icon: RotateCcw,
    getDate: order => order.returnRequests?.[0]?.approvedAt || order.statusUpdatedAt,
    isActive: order => ["returned", "partial_returned", "refunded"].includes(order.orderStatus),
    isCompleted: order => order.orderStatus === "refunded",
    color: order => ["returned", "partial_returned"].includes(order.orderStatus) ? "bg-orange-500" : order.orderStatus === "refunded" ? "bg-green-500" : "bg-gray-200",
  },
  {
    key: "refunded",
    label: "Refunded",
    icon: XCircle,
    getDate: order => order.refundedAt,
    isActive: order => order.paymentStatus === "refunded" || order.orderStatus === "refunded",
    isCompleted: () => false,
    color: order => (order.paymentStatus === "refunded" || order.orderStatus === "refunded") ? "bg-red-500" : "bg-gray-200",
  },
];

const formatDate = (dateString) => {
  if (!dateString) return "--";
  return new Date(dateString).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const OrderProgressTracker = ({ order }) => {
  // 1. Filter visible steps
  const visibleSteps = statusSteps.filter(step => {
    if (step.key === "returning" && order.orderStatus !== "returning") return false;
    if (step.key === "returned" && !["returned", "partial_returned", "refunded"].includes(order.orderStatus)) return false;
    if (step.key === "refunded" && !(order.paymentStatus === "refunded" || order.orderStatus === "refunded")) return false;
    return true;
  });

  // 2. Find current status index
  const lastActiveIdx = visibleSteps.map(s => s.isActive(order)).lastIndexOf(true);

  // 3. Calculate width (Removing unused completedStepsCount)
  const progressWidth = (visibleSteps.length > 1) 
    ? (lastActiveIdx / (visibleSteps.length - 1)) * 100 
    : 0;

  return (
    <div className="bg-white p-6 md:p-10 rounded-xl mb-6 border border-orange-200">
      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between w-full max-w-5xl mx-auto px-4 gap-8 md:gap-0">
        
        {/* Background Track Lines */}
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-8 z-0"></div>
        <div className="md:hidden absolute left-[35px] top-0 w-1 h-full bg-gray-100 z-0"></div>

        {/* Active Green Line */}
        <div
          className={`hidden md:block absolute top-1/2 left-0 h-1 -translate-y-8 z-0 transition-all duration-1000 ease-in-out ${visibleSteps[lastActiveIdx]?.color(order)}`}
          style={{ width: `${progressWidth}%` }}
        ></div>

        {/* Mobile Vertical Line */}
        <div
          className={`md:hidden absolute left-[35px] top-0 w-1 z-0 transition-all duration-1000 ease-in-out ${visibleSteps[lastActiveIdx]?.color(order)}`}
          style={{ height: `${progressWidth}%` }}
        ></div>

        {/* Render visible steps */}
        {visibleSteps.map((step, idx) => {
          const Icon = step.icon;
          const isReached = idx <= lastActiveIdx;
          
          return (
            <div
              key={step.key}
              className={`relative z-10 flex flex-row md:flex-col items-center flex-1 gap-4 md:gap-0 ${!isReached ? "opacity-40" : ""}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm flex-shrink-0 transition-colors duration-500 ${step.color(order)}`}>
                <Icon size={18} className="text-white" />
              </div>

              <div className="md:mt-4 text-left md:text-center">
                <p className={`font-bold text-[10px] md:text-xs uppercase tracking-tight ${isReached ? "text-gray-900" : "text-gray-400"}`}>
                  {step.label}
                </p>
                <p className="text-[9px] text-gray-400 font-medium whitespace-nowrap">
                  {formatDate(step.getDate(order))}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {(order.paymentStatus === "refunded" || order.orderStatus === "refunded") && (
        <div className="mt-8 text-center text-green-700 text-sm font-semibold bg-green-50 border border-green-100 rounded-lg p-3">
          Refund processed. Amount will reflect in your bank account within 5–7 working days.
        </div>
      )}
    </div>
  );
};

export default OrderProgressTracker;