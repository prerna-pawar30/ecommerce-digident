/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../utils/ApiClient";
import { Loader2 } from "lucide-react";
import OrderProgressTracker from "../components/ui/OrderProgressTracker";
import Breadcrumb from "../components/ui/Breadcrumb";
import logoMain from "../assets/home/digident-logo.png";
import logoWatermark from "../assets/home/digident-png 2.png";
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

/* ================= COMPLETE UPDATED INVOICE GENERATOR ================= */
const handleDownloadInvoice = async () => {
  if (!order || !order.items) return;

  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF({ unit: "mm", format: "a4" });

  // Constants based on Brand Identity
  const ORANGE = [230, 135, 54];
  const BLACK  = [0, 0, 0];
  const WHITE  = [255, 255, 255];
  const PW = doc.internal.pageSize.width;
  const PH = doc.internal.pageSize.height;

  // Data Transformation
  const invoiceNo   = order.invoiceNumber || order.orderId?.substring(4, 12) || "N/A";
  const customerNo  = order.customerNo    || order.orderId?.substring(0, 8)  || "N/A";
  const orderNo     = order.orderNumber   || order.orderId || "N/A";
  const csr         = order.csr           || "Vithalsir ( MD )";
  const payTerms    = order.paymentTerms  || "Payable due amount in 10 days";
  const tod         = order.termsOfDelivery   || "CIP Surat";
  const shipCond    = order.shippingCondition || "Normal";

  const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-GB") : new Date(order.createdAt).toLocaleDateString("en-GB");

  const invoiceDate  = fmtDate(order.invoiceDate  || order.createdAt);
  const dueDate      = fmtDate(order.dueDate);
  const orderDate    = fmtDate(order.orderDate    || order.createdAt);
  const deliveryDate = fmtDate(order.deliveryDate || order.createdAt);

  const addr         = order.billingAddress || {};
  const gstNo        = order.gstNumber || addr.gstin || "-";
  const gstPct       = order.gstPercentage ?? 5;
  const grandTotal   = order.grandTotal       || 0;
  const gstAmount    = order.gstAmount        || 0;
  const freight      = order.shippingCharge   || 0;
  const paidAmount   = order.paidAmount       || 0;
  const taxableVal   = grandTotal - gstAmount - freight;

  const drawHeader = () => {
    // Top Decorative Bars
    doc.setFillColor(...ORANGE);
    doc.rect(0, 4, 45, 4, "F");
    doc.rect(0, 10, 34, 4, "F");

    // Black Angled Header
    doc.setFillColor(...BLACK);
    doc.rect(108, 0, PW - 108, 14, "F");
    doc.triangle(108, 0, 108, 14, 93, 0, "F");

    // Invoice Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(30);
    doc.setTextColor(0);
    doc.text("INVOICE", 14, 32);

    // Logo Placement
    try {
      doc.addImage(logoMain, "WEBP", 148, 16, 47, 18);
    } catch {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(15);
      doc.setTextColor(...ORANGE);
      doc.text("Digident", 162, 9);
    }
  };

  const drawFooter = () => {
    doc.setFillColor(...BLACK);
    doc.rect(0, PH - 13, 100, 13, "F");
    doc.triangle(100, PH - 13, 100, PH, 116, PH, "F");

    doc.setFillColor(...ORANGE);
    doc.rect(158, PH - 7, PW - 158, 7, "F");
    doc.triangle(158, PH - 7, 158, PH, 143, PH, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11.5);
    doc.setTextColor(...BLACK);
    doc.text("DIGIDENT INDIA PRIVATE LIMITED.", 14, PH - 26);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.text("Regd : Digident India Pvt Ltd, 314, Sapna Sangeeta Rd, near Matlani Garden,", 14, PH - 20);
    doc.text("Professor Colony, Indore, Madhya Pradesh 452001", 14, PH - 15);
    doc.setTextColor(...WHITE);
    doc.text("Email: info@digident.in  Contact No: +91 9294503001", 14, PH - 6);
  };

  // --- PAGE 1 START ---
  drawHeader();

  // 1. Invoice Meta (Top Left)
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Invoice Number: #${invoiceNo}`, 14, 45);
  doc.text(`Invoice Date: ${invoiceDate}`, 14, 52);
  doc.setFont("helvetica", "bold");
  doc.text(`Due Date: ${dueDate}`, 14, 59);

  // 2. Customer & Payment Info (Left Middle)
  const midY = 72;
  doc.setFontSize(11);
  doc.text(`CUSTOMER NO : ${customerNo}`, 14, midY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Payment Terms : ${payTerms}`, 14, midY + 7);
  doc.setFont("helvetica", "bold");
  doc.text("Our GSTIN : 23AAKCD9669F1ZA", 14, midY + 14);

  // 3. Billing & Order Details (Fixed Columns & Gaps)
  const leftColX = 14;
  const rightColX = 120; // Increased for proper middle gap
  let leftY = 95;
  let rightY = 85;

  // --- Left Side: Order identifiers ---
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12); // Matches design

  // Split long order numbers to prevent overlapping the right column
  const orderNoLines = doc.splitTextToSize(`Order Number : ${orderNo}`, 80); 
  doc.text(orderNoLines, leftColX, leftY);

  leftY += (orderNoLines.length * 6) + 2; 
  doc.text(`Customer Service Rep : ${csr}`, leftColX, leftY);

  // --- Right Side: BILL TO ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("BILL TO", rightColX, rightY);

  rightY += 6;
  doc.text(addr.fullName || addr.name || "N/A", rightColX, rightY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);

  // Address block with proper leading
  const addrParts = [addr.street || addr.line1, addr.line2].filter(Boolean).join(", ");
  const addrLines = doc.splitTextToSize(addrParts, 85);
  rightY += 6;
  doc.text(addrLines, rightColX, rightY);

  rightY += (addrLines.length * 5.5);
  const cityState = [addr.city, addr.state, addr.pincode].filter(Boolean).join(", ");
  doc.text(cityState, rightColX, rightY);

  rightY += 6;
  doc.setFont("helvetica", "bold");
  doc.text(`GSTIN: ${gstNo}`, rightColX, rightY);

  // Delivery Details Section (Added gap before this block)
  rightY += 10; 
  doc.setFont("helvetica", "normal");
  doc.text(`Terms of Delivery : ${tod}`, rightColX, rightY);
  doc.text(`Shipping Condition : ${shipCond}`, rightColX, rightY + 6);
  doc.text(`Order Date : ${orderDate}`, rightColX, rightY + 12);
  doc.text(`Delivery Date : ${deliveryDate}`, rightColX, rightY + 18);

  // Update currentY for the table to start after the tallest column
  let currentY = Math.max(leftY, rightY + 15);

  // 4. Line Items Table
  const tableStartY = Math.max(currentY + 10, 155);
  const tableRows = order.items.map((item, i) => [
    i + 1,
    `${item.productName || ""}${item.variantName ? "\n" + item.variantName : ""}`,
    item.quantity,
    (item.price || 0).toFixed(2),
    "0%\n0.00",
    "0",
    ((item.price || 0) * (item.quantity || 1)).toFixed(2),
    `IGST${gstPct}%`,
  ]);


autoTable(doc, {
  startY: tableStartY,
  head: [[
    { content: "ARTICLE NO", styles: { halign: "center" } },
    { content: "DESCRIPTION", styles: { halign: "center" } },
    { content: "QTY", styles: { halign: "center" } },
    { content: "PRICE", styles: { halign: "center" } },
    { content: "DISCOUNT\n(VALUE)", styles: { halign: "center" } },
    { content: "DISCOUNT\nTOTAL", styles: { halign: "center" } },
    { content: "TOTAL NET", styles: { halign: "center" } },
    { content: "GST", styles: { halign: "center" } },
  ]],
  body: tableRows,
  theme: "plain",
  headStyles: { 
    fillColor: [230, 135, 54], // ORANGE
    textColor: [255, 255, 255], // WHITE
    fontSize: 8.5, // Slightly smaller font helps stacking
    fontStyle: "bold",
    cellPadding: 1,
    minCellHeight: 12, // Force header to be tall enough for 2 lines
    valign: 'middle' // Centers the stacked text vertically
  },
  bodyStyles: { 
    fontSize: 8.5, 
    textColor: [0, 0, 0], // BLACK
    cellPadding: { top: 6, bottom: 6, left: 3, right: 3 } 
  },
  columnStyles: {
    0: { cellWidth: 16, halign: "center" },
    1: { cellWidth: 50, halign: "center" },
    2: { cellWidth: 15, halign: "center" },
    3: { cellWidth: 20, halign: "center" },
    4: { cellWidth: 24, halign: "center" }, // Widened for stacking
    5: { cellWidth: 22, halign: "center" },
    6: { cellWidth: 22, halign: "center" },
    7: { cellWidth: 16, halign: "center" },
  },
  didDrawCell: (data) => {
    if (data.section === 'body') {
      doc.setDrawColor(230, 135, 54); 
      doc.setLineWidth(0.4);
      doc.line(
        data.cell.x, 
        data.cell.y + data.cell.height, 
        data.cell.x + data.cell.width, 
        data.cell.y + data.cell.height
      );
    }
  },
  margin: { left: 14, right: 14 },
});



  // Always draw the footer at the very bottom of the final page
  drawFooter();
  // --- PAGE 2 START ---
  doc.addPage();
  drawHeader();

  doc.setFont("helvetica", "bold").setFontSize(20).setTextColor(...ORANGE);
  doc.text("TAX & HSN SUMMARY", 14, 50);

  autoTable(doc, {
    startY: 75,
    head: [["GST SUMMARY", "GOODS", "FREIGHT", "TOTAL"]],
    body: [
      ["Net Value", taxableVal.toFixed(2), freight.toFixed(2), (taxableVal + freight).toFixed(2)],
      ["Total Tax", gstAmount.toFixed(2), "0.00", gstAmount.toFixed(2)],
      ["Net incl. Tax", grandTotal.toFixed(2), freight.toFixed(2), grandTotal.toFixed(2)],
    ],
    theme: "grid",
    headStyles: { fillColor: ORANGE, textColor: WHITE, fontSize: 9 },
    columnStyles: { 0: { fontStyle: "bold" }, 1: { halign: "right" }, 2: { halign: "right" }, 3: { halign: "right", fontStyle: "bold" } },
    margin: { left: 14, right: 14 },
  });

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    margin: { left: 108, right: 14 },
    head: [["INVOICE SUMMARY", "AMOUNT"]],
    body: [
      ["Total Gross Value", `${taxableVal.toFixed(2)} INR`],
      ["Freight Cost", `${freight.toFixed(2)} INR`],
      ["Total Tax", `${gstAmount.toFixed(2)} INR`],
      ["Total Pay Amount", `${grandTotal.toFixed(2)} INR`],
      ["Paid Amount", `${paidAmount.toFixed(2)} INR`],
      ["Amount to Pay", `${(grandTotal - paidAmount).toFixed(2)} INR`],
    ],
    theme: "grid",
    headStyles: { fillColor: ORANGE, textColor: WHITE },
    bodyStyles: { halign: "right" },
    columnStyles: { 0: { halign: "left", fontStyle: "bold" } },
  });

  currentY = doc.lastAutoTable.finalY + 72;

// 2. Draw Bank Details (Simple flat text)
doc.setFont("helvetica", "bold").setFontSize(10.5).setTextColor(0);
doc.text("Bank Details", 14, currentY);

doc.setFont("helvetica", "normal").setFontSize(9.5);
doc.text([
  `Account No : 00840510002087`,
  `Account Type : Current`,
  `IFSC Code : UCBA0000084`,
  `Holder Name : Digident India Private Limited`
], 14, currentY + 6, { lineHeightFactor: 1.2 }); // Using an array for cleaner code
  drawFooter();
  doc.save(`Digident_Invoice_${order.orderId}.pdf`);
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

      await cancelOrder(order.orderId);

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