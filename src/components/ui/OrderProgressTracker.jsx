import React from "react";
import { Clock, PackageCheck, Truck, CheckCircle, XCircle, RotateCcw } from "lucide-react";

const formatDate = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const OrderProgressTracker = ({ order }) => {
  if (!order) return null;

  const isCancelled = order.orderStatus === "cancelled";
  const isReturnedState = 
    order.orderStatus === "returned" || 
    order.paymentStatus === "refunded" || 
    (order.items && order.items.some(item => item.returnedQuantity > 0));

  // 1. Core structural progress array map
  const baseSteps = [
    {
      key: "placed",
      label: "Order Placed",
      icon: Clock,
      getDate: (o) => o.createdAt,
      weight: 1,
    },
    {
      key: "confirmed",
      label: "Confirmed",
      icon: PackageCheck,
      getDate: (o) => ["confirmed", "shipped", "delivered", "returned"].includes(o.orderStatus) ? (o.statusUpdatedAt || o.paidAt) : null,
      weight: 2,
    },
    {
      key: "shipped",
      label: "Shipped",
      icon: Truck,
      getDate: (o) => o.shippedAt,
      weight: 3,
    },
  ];

  // 2. Dynamically add terminating state steps
  let statusSteps = [...baseSteps];

  if (isCancelled) {
    statusSteps.push({
      key: "cancelled",
      label: "Cancelled",
      icon: XCircle,
      getDate: (o) => o.statusUpdatedAt || o.updatedAt,
      weight: 4,
      isDanger: true, // Triggers Red Theme
    });
  } else {
    statusSteps.push({
      key: "delivered",
      label: "Delivered",
      icon: CheckCircle,
      getDate: (o) => o.deliveredAt,
      weight: 4,
    });

    if (isReturnedState) {
      statusSteps.push({
        key: "returned",
        label: "Returned",
        icon: RotateCcw,
        getDate: (o) => o.statusUpdatedAt, 
        weight: 5,
        isDanger: true, // Triggers Red Theme for Returned as requested
      });
    }
  }

  // 3. Status relational weights
  const statusWeights = {
    placed: 1,
    confirmed: 2,
    shipped: 3,
    delivered: 4,
    cancelled: 4, 
    returned: 5,
  };

  const currentWeight = statusWeights[order.orderStatus] || 1;

  return (
    <div className="p-6 bg-white rounded-xl border border-orange-200 mb-6 shadow-sm">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-100 pb-4 mb-6">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tracking ID</p>
          <p className="text-sm font-bold text-gray-800 font-mono mt-0.5">{order.orderId}</p>
        </div>
        <div className="sm:text-right">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Grand Total</p>
          <p className="text-base font-extrabold text-gray-900 mt-0.5">₹{order.grandTotal?.toFixed(2)}</p>
        </div>
      </div>

      {/* Tracker Layout */}
      <div className="relative flex flex-col md:flex-row items-stretch md:items-start justify-between w-full gap-6 md:gap-0 px-2">
        {statusSteps.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = currentWeight > step.weight;
          const isActive = currentWeight === step.weight;
          const isUpcoming = currentWeight < step.weight;
          const stepDate = formatDate(step.getDate(order));

          // Color application state mapping
          let nodeStyles = "";
          let lineBgColor = "bg-gray-100";
          let activeLineStyle = "bg-[#E68736]";

          if (step.isDanger) {
            nodeStyles = isActive 
              ? "bg-white text-rose-600 border-2 border-rose-600 ring-4 ring-rose-50 shadow-md" 
              : "bg-rose-600 text-white shadow-sm ring-4 ring-rose-50";
            activeLineStyle = "bg-rose-500";
          } else {
            nodeStyles = isCompleted 
              ? "bg-[#E68736] text-white shadow-sm ring-4 ring-orange-50" 
              : isActive 
                ? "bg-white text-[#E68736] border-2 border-[#E68736] shadow-md ring-4 ring-orange-50" 
                : "bg-gray-50 text-gray-400 border border-gray-200";
          }

          return (
            <div key={step.key} className="flex flex-row md:flex-col items-center flex-1 relative group min-h-[48px] md:min-h-0">
              
              {/* Connector Line (Desktop) */}
              {idx !== statusSteps.length - 1 && (
                <div className={`hidden md:block absolute top-5 left-[50%] right-[-50%] h-[2px] ${lineBgColor} z-0`}>
                  <div 
                    className={`h-full ${activeLineStyle} transition-all duration-500 ease-in-out`}
                    style={{ width: isCompleted || (isActive && step.isDanger) ? "100%" : "0%" }}
                  />
                </div>
              )}

              {/* Connector Line (Mobile) */}
              {idx !== statusSteps.length - 1 && (
                <div className={`md:hidden absolute left-5 top-10 bottom-[-20px] w-[2px] ${lineBgColor} z-0`}>
                  <div 
                    className={`w-full ${activeLineStyle} transition-all duration-500 ease-in-out`}
                    style={{ height: isCompleted || (isActive && step.isDanger) ? "100%" : "0%" }}
                  />
                </div>
              )}

              {/* Icon Node */}
              <div className="relative z-10 flex-shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${nodeStyles}`}>
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                </div>
              </div>

              {/* Text Meta Content */}
              <div className="ml-4 md:ml-0 md:mt-3 text-left md:text-center max-w-[165px]">
                <h4 className={`text-xs font-bold transition-colors duration-300 
                  ${step.isDanger && isActive ? "text-rose-600 font-black" : ""}
                  ${!step.isDanger && isActive ? "text-[#E68736] font-black" : ""}
                  ${isUpcoming ? "text-gray-400" : ""}
                  ${isCompleted ? "text-gray-800" : ""}
                `}>
                  {step.label}
                </h4>
                
                {stepDate ? (
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5 whitespace-normal sm:whitespace-nowrap">
                    {stepDate}
                  </p>
                ) : isActive ? (
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide mt-0.5 animate-pulse
                    ${step.isDanger ? "bg-rose-50 text-rose-600" : "bg-orange-50 text-[#E68736]"}
                  `}>
                    In Progress
                  </span>
                ) : null}

                {/* Inline cancellation logs tracking context */}
                {step.key === "cancelled" && order.cancellationReason && (
                  <p className="text-[10px] text-rose-500 font-medium mt-1 md:text-center max-w-[140px] break-words">
                    Reason: {order.cancellationReason}
                  </p>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderProgressTracker;