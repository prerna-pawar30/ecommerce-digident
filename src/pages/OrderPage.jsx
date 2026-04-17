/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../utils/ApiClient";
import { Loader2 } from "lucide-react";
import OrderProgressTracker from "../components/ui/OrderProgressTracker";
import Breadcrumb from "../components/ui/Breadcrumb";
import logoMain from "../assets/home/digident-logo.webp";
import logoWatermark from "../assets/home/digident-logo2.webp";
import Swal from "sweetalert2";
import { fetchOrderDetails, cancelOrder, returnOrderItems, updateReturnOrder, completeRefund } from "../api/ApiService";
import { useNavigate } from "react-router-dom";
import OrderActionBar from "../components/ordermain/orderAction";
import OrderInfoSection from "../components/ordermain/orderInfoSection";
import RefundStatusCard from "../components/ordermain/RefundStatusCard.jsx";
import ReturnStatusCard from "../components/ordermain/ReturnStatusCard.jsx.jsx";
import OrderItemsList from "../components/ordermain/OrderItemsList.jsx";

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "Pending";
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  /* ================= FETCH ORDER (FIXED MULTIPLE CALLS) ================= */
  const fetchedRef = useRef(false);

  const fetchOrder = useCallback(async () => {
    if (!orderId || fetchedRef.current) return;

    fetchedRef.current = true;

    try {
      const res = await fetchOrderDetails(orderId);
      // ApiService safeRequest already returns res.data
      setOrder(res.data.order);
    } catch (error) {
      console.error("Fetch order failed:", error);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

 
/* ================= RETURN / UPDATE LOGIC ================= */
  const handleReturnOrder = async () => {
    if (!order || !order.items) return;

    const isUpdating = order.returnRequests?.some(req => req.status === "pending");

    const returnableItems = order.items.map((item) => {
      const remaining = item.quantity - (item.returnedQuantity || 0);
      return { ...item, remainingQty: remaining };
    });

    const itemsHtml = returnableItems
      .map((item, index) => {
        const remaining = item.remainingQty;
        const disabled = remaining <= 0;

        return `
      <div class="flex items-center justify-between border-b py-4 last:border-0 ${disabled ? "opacity-40" : ""}">
        <div class="flex items-center gap-4 flex-1">
          <input 
            type="checkbox"
            id="item-check-${index}"
            class="w-5 h-5 accent-[#E68736]"
            ${disabled ? "disabled" : "checked"}
          />
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
          <input
            type="number"
            id="item-qty-${index}"
            value="${disabled ? 0 : remaining}"
            min="1"
            max="${remaining}"
            ${disabled ? "disabled" : ""}
            class="w-16 border rounded px-2 py-1 text-center text-sm font-bold focus:border-[#E68736] outline-none"
          />
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
        let res;
        if (isUpdating) {
          const requestId = order.returnRequests[0].requestId;
          res = await updateReturnOrder(order.orderId, requestId, formValues);
        } else {
          res = await returnOrderItems(formValues);
        }

        if (res.success) {
          Swal.fire("Success", "Return request processed", "success");
          fetchedRef.current = false;
          await fetchOrder();
        }
      } catch (error) {
        Swal.fire("Error", error.response?.data?.message || "Something went wrong", "error");
      } finally {
        setCancelLoading(false);
      }
    }
  };

  /* ================= INVOICE GENERATOR LOGIC (UNTOUCHED) ================= */
  const handleDownloadInvoice = async () => {
    if (!order || !order.items) return;
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");
    const doc = new jsPDF();
    const orange = [230, 135, 54];
    const black = [0, 0, 0];
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    doc.setFillColor(orange[0], orange[1], orange[2]);
    doc.rect(0, 5, 45, 4, "F");
    doc.rect(0, 11, 35, 4, "F");
    doc.setFillColor(black[0], black[1], black[2]);
    doc.rect(110, 0, pageWidth - 110, 13, "F");
    doc.triangle(110, 0, 110, 13, 95, 0, "F");

    doc.setFontSize(32);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("Tax Invoice", 14, 35);

    try {
      doc.addImage(logoMain, "PNG", 150, 20, 45, 18);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.setFont("helvetica", "normal");
      doc.text("Creating a World Of Smiles", 195, 40, { align: "right" });
    } catch (e) {
      console.warn("Logo asset missing");
    }

    doc.setTextColor(0);
    let dataY = 60;
    const col1 = 14;
    const col2 = 78;
    const col3 = 145;

    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.text("Sold By:", col1, dataY);
    doc.setFont(undefined, "normal");
    doc.setFontSize(10);
    doc.text("DIGIDENT INDIA PRIVATE LIMITED", col1, dataY + 6);
    doc.text("314, Sapna Sangeeta Road, Indore", col1, dataY + 11);
    doc.text("Madhya Pradesh - 452001", col1, dataY + 16);
    doc.setFont(undefined, "bold");
    doc.text(`GSTIN: 23AAKCD9669F1ZA`, col1, dataY + 22);

    const addr = order.billingAddress;
    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.text("Billing/Shipping Address:", col2, dataY);
    doc.setFont(undefined, "normal");
    doc.setFontSize(10);
    doc.text(addr?.fullName || "N/A", col2, dataY + 6);
    doc.text(addr?.street || "", col2, dataY + 11, { maxWidth: 65 });
    doc.text(`${addr?.city}, ${addr?.state}`, col2, dataY + 20);
    doc.text(`PIN: ${addr?.pincode}`, col2, dataY + 25);
    doc.setFont(undefined, "bold");
    doc.text(`Customer GSTIN: ${order.gstNumber || "N/A"}`, col2, dataY + 31);

    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.text("Order Details:", col3, dataY);
    doc.setFont(undefined, "normal");
    doc.setFontSize(10);
    doc.text(`Order ID: ${order.orderId?.substring(0, 15)}`, col3, dataY + 6);
    doc.text(
      `Order Date: ${new Date(order.createdAt).toLocaleDateString("en-GB")}`,
      col3,
      dataY + 11
    );
    doc.text(`Invoice No: #${order.orderId?.substring(4, 12)}`, col3, dataY + 16);
    doc.text(
      `Invoice Date: ${new Date(order.createdAt).toLocaleDateString("en-GB")}`,
      col3,
      dataY + 21
    );
    doc.text(`Courier: ${order.corourseServiceName || "N/A"}`, col3, dataY + 26);
    doc.text(`Tracking: ${order.DOCNumber || "N/A"}`, col3, dataY + 31);

    const tableRows =
      order.items?.map((item) => [
        item.sku,
        `${item.productName}\n${item.variantName}`,
        item.quantity,
        item.price.toFixed(2),
        "0.00",
        "0.00",
        (item.price * item.quantity).toFixed(2),
        `${order.gstPercentage}%`,
      ]) || [];

    autoTable(doc, {
      startY: dataY + 50,
      head: [["SKU", "DESCRIPTION", "QTY", "GROSS AMT", "DISC", "DISC TOTAL", "TAXABLE VAL", "GST"]],
      body: tableRows,
      theme: "grid",
      headStyles: {
        fillColor: orange,
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: "bold",
      },
      styles: { fontSize: 12, cellPadding: 3 },
      columnStyles: { 1: { cellWidth: 45 } },
    });

    const footerY = pageHeight - 45;
    doc.saveGraphicsState();
    doc.setGState(new doc.GState({ opacity: 0.05 }));
    try {
      doc.addImage(logoWatermark, "PNG", 40, 100, 130, 100);
    } catch (e) {}
    doc.restoreGraphicsState();

    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.setTextColor(0);
    doc.text("DIGIDENT INDIA PRIVATE LIMITED.", 14, footerY);
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text("Regd: 314, Sapna Sangeeta Rd, near Matlani Garden,", 14, footerY + 6);
    doc.text("Professor Colony, Indore, Madhya Pradesh 452001", 14, footerY + 11);
    doc.text("Email: info@digident.in", 145, footerY + 16);
    doc.text("Telephone: +91 9294503001", 145, footerY + 21);

    doc.setFillColor(black[0], black[1], black[2]);
    doc.rect(0, pageHeight - 12, 100, 12, "F");
    doc.triangle(100, pageHeight - 12, 100, pageHeight, 115, pageHeight, "F");
    doc.setFillColor(orange[0], orange[1], orange[2]);
    doc.rect(160, pageHeight - 6, 50, 6, "F");
    doc.triangle(160, pageHeight - 6, 160, pageHeight, 145, pageHeight, "F");

    doc.addPage();
    doc.setFillColor(orange[0], orange[1], orange[2]);
    doc.rect(0, 5, 45, 4, "F");
    doc.setFillColor(black[0], black[1], black[2]);
    doc.rect(110, 0, pageWidth - 110, 13, "F");

    doc.setFontSize(24);
    doc.setTextColor(orange[0], orange[1], orange[2]);
    doc.setFont(undefined, "bold");
    doc.text("TAX & HSN SUMMARY", 14, 35);

    autoTable(doc, {
      startY: 45,
      head: [["HSN CODE", "SUBTOTAL", "QTY", "GST AMOUNT", "SHIPPING", "GRAND TOTAL"]],
      body: [[
        "902145678",
        (order.grandTotal - order.gstAmount).toFixed(2),
        order.items.length,
        order.gstAmount.toFixed(2),
        order.shippingCharge.toFixed(2),
        `${order.grandTotal.toLocaleString()} INR`,
      ]],
      theme: "grid",
      headStyles: { fillColor: orange, fontSize: 10 },
      styles: { fontSize: 12, cellPadding: 3 },
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 15,
      margin: { left: 110 },
      head: [["INVOICE SUMMARY", "AMOUNT"]],
      body: [
        ["Total Taxable Value", `${(order.grandTotal - order.gstAmount).toFixed(2)} INR`],
        ["Total GST", `${order.gstAmount.toFixed(2)} INR`],
        ["Grand Total", `${order.grandTotal?.toLocaleString()} INR`],
      ],
      theme: "grid",
      headStyles: {
        fillColor: orange,
        textColor: [255, 255, 255],
        fontSize: 11,
      },
      styles: { fontSize: 12, halign: "right", cellPadding: 4 },
      columnStyles: { 0: { fontStyle: "bold", halign: "left" } },
    });

    doc.save(`Official_Invoice_${order.orderId}.pdf`);
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
    });

    if (!result.isConfirmed) return;

    try {
      setCancelLoading(true);

      // Cancel the order
      await cancelOrder(order.orderId);

      // Complete the refund
      const refundRes = await completeRefund(order.orderId);

      if (refundRes.success) {
        const { paymentStatus } = refundRes.data;
        let title = "Cancellation Pending", message = "Refund initiated.", icon = "success";

        if (paymentStatus === "refunded") {
          title = "Refund Successful";
          message = "Refund processed to original payment method.";
        } else if (paymentStatus === "refund_pending") {
          title = "Refund In Progress";
          message = "It may take 5-7 business days to reflect.";
        } else if (paymentStatus === "refund-failed") {
          title = "Refund Failed";
          message = "Order cancelled, but refund failed. Contact support.";
          icon = "error";
        }

        await Swal.fire({ title, text: message, icon, confirmButtonColor: "#E68736" });
      }

      fetchedRef.current = false;
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
        <div className="py-24 flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-[#E68736] mb-4" size={48} />
          <p className="text-gray-500 font-medium animate-pulse">
            Loading your order details...
          </p>
        </div>
      </div>
    );
  }

  const approvedReturnRequest = order.returnRequests?.find(
    (r) => r.status === "approved"
  );

  const totalReturnedQty =
    order.items?.reduce((acc, item) => acc + (item.returnedQuantity || 0), 0) || 0;

  const totalReturnedAmount =
    order.items?.reduce((acc, item) => {
      return acc + (item.returnedQuantity || 0) * (item.price || 0);
    }, 0) || 0;

  const isReturnApproved = approvedReturnRequest?.status === "approved";

  if (!order) {
    return (
      <div className="h-screen flex items-center justify-center px-4">
        <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-gray-200 max-w-md w-full">
          <h3 className="text-lg font-bold text-gray-800">Order Not Found</h3>
          <p className="text-gray-500 max-w-xs mx-auto mt-2">
            We couldn't find the order details you're looking for. It might have
            been removed or the link is incorrect.
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-6 text-[#E68736] font-bold text-sm hover:underline"
          >
            Go Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const isRefunded = order.paymentStatus === "refunded";
  const canReturn =
    order.orderStatus === "delivered" || order.orderStatus === "partial_returned";

  return (
    <div className="py-10 min-h-screen pb-20 font-sans">
      <div className="container mx-auto px-4 max-w-5xl">
        <Breadcrumb />
        {order.orderStatus === "pending" && (
          <div className="my-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg font-semibold text-center">
            Your payment is not successful. Please return to order.
          </div>
        )}
      </div>

      <OrderActionBar
        order={order}
        cancelLoading={cancelLoading}
        canReturn={canReturn}
        isRefunded={isRefunded}
        onBack={() => navigate(-1)}
        onDownloadInvoice={handleDownloadInvoice}
        onReturnOrder={handleReturnOrder}
        onCancelOrder={handleCancelOrder}
      />

      <div className="container mx-auto px-4 py-6 max-w-5xl">
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
  );
};

export default OrderDetailsPage;