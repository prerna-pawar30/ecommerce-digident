/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../utils/ApiClient";
import { Loader2 } from "lucide-react";
import OrderProgressTracker from "../components/ui/OrderProgressTracker";
import Breadcrumb from "../components/ui/Breadcrumb";
import logoMain from "../assets/home/digident-logo.png";
import logoWatermark from "../assets/home/digident-png 2.png";
import Swal from "sweetalert2";
import { fetchOrderDetails, cancelOrder, returnOrderItems, updateReturnOrder, completeRefund, updateInvoice } from "../api/ApiService";
import OrderActionBar from "../components/ordermain/orderAction";
import OrderInfoSection from "../components/ordermain/orderInfoSection";
import RefundStatusCard from "../components/ordermain/RefundStatusCard.jsx";
import ReturnStatusCard from "../components/ordermain/ReturnStatusCard.jsx.jsx";
import OrderItemsList from "../components/ordermain/OrderItemsList.jsx";
import InvoiceButton from "../components/ordermain/UserInvoiceButton.jsx";

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);

  // Refs for state locking
  const fetchedRef = useRef(false);
  const invoiceSyncedRef = useRef(false); // New: Prevents multiple invoice updates in one session

  /**
   * SYNC INVOICE LOGIC (Triggers only when approved)
   */
  const syncInvoiceWithApprovedReturns = useCallback(async (latestOrder) => {
    if (!latestOrder.invoiceId || invoiceSyncedRef.current) return;

    const invoicePayload = {
      paymentTerms: "Payable due amount in 10 days",
      termsOfDelivery: "CIP Telangana",
      shippingCondition: "Normal",
      customerServiceRep: "Vithalsir ( MD )",
      billTo: {
        companyName: latestOrder.billingAddress?.fullName || "N/A",
        address: `${latestOrder.billingAddress?.street || ""}, ${latestOrder.billingAddress?.city || ""}, ${latestOrder.billingAddress?.state || ""} ${latestOrder.billingAddress?.pincode || ""}`,
        gstin: latestOrder.gstNumber || "",
        contactPerson: latestOrder.billingAddress?.fullName || "N/A",
        contactNumber: latestOrder.billingAddress?.phone || ""
      },
      items: latestOrder.items.map(item => ({
        description: item.productName,
        qty: item.quantity,
        price: item.price
      })).filter(item => item.qty > 0),
      summary: {
        freightCost: latestOrder.shippingCharge || 0,
        paidAmount: latestOrder.paymentStatus === "paid" ? latestOrder.grandTotal : 0
      },
      status: "issued",

    };

    try {
      await updateInvoice(latestOrder.invoiceId, invoicePayload);
      invoiceSyncedRef.current = true;
      console.log("Invoice synced with approved return quantities.");
    } catch (error) {
      console.error("Invoice sync failed:", error);
    }
  }, []);

  /**
   * DATA FETCHING
   */
  const fetchOrder = useCallback(async () => {
    if (!orderId) return;
    try {
      const res = await fetchOrderDetails(orderId);
      if (res.success) {
        const fetchedOrder = res.data.order;
        const processedOrder = {
          ...fetchedOrder,
          invoiceId: fetchedOrder.invoiceId || fetchedOrder.iId 
        };
        setOrder(processedOrder);
      }
    } catch (error) {
      console.error("Fetch order failed:", error);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  // AUTO-SYNC INVOICE ON APPROVAL
  useEffect(() => {
    const isApproved = order?.returnRequests?.some(r => r.status === "approved");
    if (isApproved && order?.invoiceId) {
      syncInvoiceWithApprovedReturns(order);
    }
  }, [order, syncInvoiceWithApprovedReturns]);


  /* ================= RETURN / UPDATE LOGIC ================= */
  const handleReturnOrder = async () => {
    if (!order || !order.items) return;

    const isUpdating = order.returnRequests?.some(req => req.status === "pending");

   const returnableItems = order.items.map((item) => {
  const remaining = item.quantity; // <-- Removes the subtraction logic
  return { ...item, remainingQty: remaining };
});

    const itemsHtml = returnableItems
      .map((item, index) => {
        const remaining = item.remainingQty;
        const disabled = remaining <= 0;

        return `
        <div class="flex items-center justify-between border-b py-4 last:border-0 ${disabled ? "opacity-40" : ""}">
          <div class="flex items-center gap-4 flex-1">
            <input type="checkbox" id="item-check-${index}" class="w-5 h-5 accent-[#E68736]" ${disabled ? "disabled" : "checked"} />
            <div class="w-16 h-16 border rounded bg-white p-1">
              <img src="${item.image}" class="w-full h-full object-contain"/>
            </div>
            <div class="flex flex-col text-left">
              <p class="text-xs font-bold text-gray-800">${item.productName}</p>
              <p class="text-[11px] text-gray-400">Ordered : ${item.quantity}</p>
              <p class="text-[11px] font-semibold text-[#E68736]">Remaining : ${remaining}</p>
            </div>
          </div>
          <div class="flex flex-col items-end gap-1">
            <label class="text-[10px] text-gray-500 font-bold uppercase">Qty</label>
            <input type="number" id="item-qty-${index}" value="${disabled ? 0 : remaining}" min="1" max="${remaining}" ${disabled ? "disabled" : ""} class="w-16 border rounded px-2 py-1 text-center text-sm font-bold focus:border-[#E68736] outline-none" />
          </div>
        </div>`;
      }).join("");

    const { value: formValues } = await Swal.fire({
      title: `<span class="text-xl font-bold">${isUpdating ? "Update Return Request" : "Return Items"}</span>`,
      html: `
          <div class="text-left mb-3 text-xs text-gray-500 font-medium">Select items to return:</div>
          <div class="max-h-80 overflow-y-auto mb-4 border border-gray-100 rounded-lg px-3 bg-gray-50/50">${itemsHtml}</div>
          <div class="text-left bg-white p-1">
            <label class="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-wider">Reason</label>
            <select id="return-reason" class="swal2-input w-full m-0 text-sm border-gray-300 rounded-md">
              <option value="Damaged product">Defective/Damaged</option>
              <option value="Received wrong item">Wrong item</option>
              <option value="Quality not as expected">Poor quality</option>
              <option value="No longer needed">No longer needed</option>
            </select>
            <textarea id="return-comments" class="swal2-textarea w-full m-0 mt-3 text-sm rounded-md" placeholder="Comments..."></textarea>
          </div>`,
      width: "550px",
      showCancelButton: true,
      confirmButtonText: isUpdating ? "Update Request" : "Confirm Return",
      confirmButtonColor: "#E68736",
      cancelButtonColor: "#94a3b8",
      reverseButtons: true,
      customClass: {
      confirmButton: 'swal-gradient-button'
    },
      preConfirm: () => {
        const selectedItems = [];
        const globalReason = document.getElementById("return-reason").value;

        returnableItems.forEach((item, index) => {
          const checkbox = document.getElementById(`item-check-${index}`);
          const qtyInput = document.getElementById(`item-qty-${index}`);

          if (checkbox && checkbox.checked && !checkbox.disabled) {
            selectedItems.push({
              productId: item.productId,
              variantId: item.variantId,
              quantity: parseInt(qtyInput.value),
              reason: globalReason,
            });
          }
        });

        if (selectedItems.length === 0) {
          Swal.showValidationMessage("Please select at least one item");
          return false;
        }
        return { orderId: order.orderId, returnItems: selectedItems };
      },
    });

    if (formValues) {
      try {
        setCancelLoading(true);
        if (isUpdating) {
          await updateReturnOrder(order.orderId, order.returnRequests[0].requestId, formValues);
        } else {
          await returnOrderItems(formValues);
        }
        Swal.fire("Success", "Return request submitted for approval", "success");
        await fetchOrder(); 
      } catch (error) {
        Swal.fire("Error", error.response?.data?.message || "Something went wrong", "error");
      } finally {
        setCancelLoading(false);
      }
    }
  };

  /* ================= CANCEL & REFUND LOGIC ================= */
  const handleCancelOrder = async () => {
    if (!order?.orderId) return;

    const result = await Swal.fire({
      title: "Cancel Order?",
      text: "Are you sure? Your refund will be initiated automatically.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E68736",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Yes, cancel it!",
      customClass: {
      confirmButton: 'swal-gradient-button' // Apply gradient
    }
    });

    if (!result.isConfirmed) return;

    try {
      setCancelLoading(true);
      await cancelOrder(order.orderId);
      const refundRes = await completeRefund(order.orderId);

      if (refundRes.success) {
        await Swal.fire({ title: "Cancellation Processed", text: "Refund initiated.", icon: "success", customClass: { confirmButton: 'swal-gradient-button' } });
      }
      await fetchOrder();
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Action failed.", "error");
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50/30">
        <Loader2 className="animate-spin text-[#E68736] mb-4" size={48} />
        <p className="text-gray-500 font-medium animate-pulse">Loading order details...</p>
      </div>
    );
  }

  if (!order) return <div className="text-center py-24">Order Not Found</div>;

  // Constants for Sub-components
  const approvedReturnRequest = order.returnRequests?.find(r => r.status === "approved");
  const totalReturnedQty = order.items?.reduce((acc, item) => acc + (item.returnedQuantity || 0), 0) || 0;
  const totalReturnedAmount = order.items?.reduce((acc, item) => acc + (item.returnedQuantity || 0) * (item.price || 0), 0) || 0;
  const isReturnApproved = !!approvedReturnRequest;
  const isRefunded = order.paymentStatus === "refunded";
  const canReturn = order.orderStatus === "delivered" || order.orderStatus === "partial_returned";

  return (
    <div className="py-10 min-h-screen pb-20 font-sans">
      <div className="container mx-auto px-4 max-w-5xl">
        <Breadcrumb />
        {order.orderStatus === "pending" && (
          <div className="my-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg font-semibold text-center">
            Your payment is not successful. Please return to order.
          </div>
        )}

        <OrderActionBar
          order={order}
          cancelLoading={cancelLoading}
          canReturn={canReturn}
          isRefunded={isRefunded}
          onBack={() => navigate(-1)}
          onReturnOrder={handleReturnOrder}
          onCancelOrder={handleCancelOrder}
        />

        <div className="py-6">
          <OrderInfoSection order={order} />
          <RefundStatusCard order={order} />
          <OrderProgressTracker order={order} />
          <ReturnStatusCard
            order={order}
            isReturnApproved={isReturnApproved}
            totalReturnedQty={totalReturnedQty}
            totalReturnedAmount={totalReturnedAmount}
          />
          <OrderItemsList
            order={order}
            isRefunded={isRefunded}
            isReturnApproved={isReturnApproved}
            totalReturnedAmount={totalReturnedAmount}
            navigate={navigate}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;