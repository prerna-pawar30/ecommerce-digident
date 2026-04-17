import React from "react";

export default function OrderInfoSection({ order }) {
  return (
    <div className="bg-white p-6 rounded-xl flex flex-col md:flex-row justify-between gap-6 mb-4 border border-orange-200">
      <div className="flex-1">
        <h3 className="font-bold text-lg mb-3">Delivery Address</h3>
        <p className="font-semibold text-gray-800 text-[16px]">
          {order.shippingAddress?.fullName}
        </p>
        <p className="text-[16px] text-gray-600 mt-1">
          {order.shippingAddress?.street}, {order.shippingAddress?.area}
          <br />
          {order.shippingAddress?.city}, {order.shippingAddress?.state} -{" "}
          {order.shippingAddress?.pincode}
        </p>
        <p className="text-[16px] font-bold mt-2">
          Phone: {order.shippingAddress?.phone}
        </p>
      </div>

      <div className="flex-1 border-t pt-6 md:pt-0 md:border-t-0 md:border-l border-[#E68736] md:pl-6">
        <h3 className="font-bold text-lg mb-3">Billing Address</h3>
        {order.organizationName && (
          <p className="text-[14px] font-bold text-blue-600 mb-1">
            {order.organizationName} (GST: {order.gstNumber})
          </p>
        )}
        <p className="font-semibold text-gray-800 text-[16px]">
          {order.billingAddress?.fullName || order.shippingAddress?.fullName}
        </p>
        <p className="text-[16px] text-gray-600 mt-1">
          {order.billingAddress?.street || order.shippingAddress?.street},{" "}
          {order.billingAddress?.area || order.shippingAddress?.area}
          <br />
          {order.billingAddress?.city || order.shippingAddress?.city} -{" "}
          {order.billingAddress?.pincode || order.shippingAddress?.pincode}
        </p>
      </div>

      <div className="flex-1 border-t pt-6 md:pt-0 md:border-t-0 md:border-l border-[#E68736] md:pl-6">
        <h3 className="font-bold text-lg mb-3">Order Summary</h3>

        <p className="text-[16px] text-gray-600">
          Payment: <span className="font-bold">{order.paymentMode}</span>
        </p>

        <p className="text-[16px] text-gray-600">
          Total Amount:{" "}
          <span className="font-bold">₹{order.grandTotal?.toLocaleString()}</span>
        </p>

        <p className="text-[16px] text-gray-600">
          Order Status:{" "}
          <span
            className={`font-bold capitalize ${order.orderStatus === "cancelled" ? "text-red-600" : ""}`}
          >
            {order.orderStatus}
          </span>
        </p>

        {order.corourseServiceName && (
          <p className="text-sm text-gray-600 mt-1">
            Courier Service:{" "}
            <span className="font-bold text-gray-800">
              {order.corourseServiceName}
            </span>
          </p>
        )}

        {order.DOCNumber && (
          <p className="text-[16px] text-gray-600">
            Tracking ID:{" "}
            <span className="font-bold text-gray-800">{order.DOCNumber}</span>
          </p>
        )}

        {order.coupon && (
          <div className="mt-2 p-2 bg-green-50 rounded border border-green-100">
            <p className="text-[16px] text-green-700 font-bold uppercase">
              Coupon:{" "}
              {typeof order.coupon === "object" ? order.coupon.code : order.coupon}
            </p>
            <p className="text-[14px] text-green-600 font-medium ">
              Saved ₹{order.coupon.discountAmount?.toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}