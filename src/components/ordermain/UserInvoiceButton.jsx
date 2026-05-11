/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import logoMain from "../../assets/home/digident-logo.png";
// If you have a watermark or QR code image locally, import them here
import logoWatermark from "../../assets/home/digident-png 2.png";
import bankQR from "../../assets/home/QR.png";
import { getInvoice } from "../../api/ApiService"; 
import { Loader2, Download } from "lucide-react";
import toast from "react-hot-toast";

const UserInvoiceButton = ({ invoiceId, className }) => {
  const [isFetching, setIsFetching] = useState(false);

  const handleDownloadInvoice = async () => {
    if (!invoiceId) {
      toast.error("Invoice ID not found");
      return;
    }

    try {
      setIsFetching(true);
      
      // 1. Fetch the specific invoice data
      const response = await getInvoice(invoiceId);
      if (!response.success) throw new Error("Failed to fetch invoice");
      
      const invoiceData = response.data;
      const { default: jsPDF } = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable");

      const doc = new jsPDF({ unit: "mm", format: "a4" });

      // Constants (Your Brand UI)
      const ORANGE = [230, 135, 54];
      const BLACK = [0, 0, 0];
      const WHITE = [255, 255, 255];
      const PW = doc.internal.pageSize.width;
      const PH = doc.internal.pageSize.height;
      const LH = 6; 

      const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-GB") : "-";

      const drawHeader = () => {
        // Top accent bars
        doc.setFillColor(...ORANGE);
        doc.rect(0, 4, 45, 4, "F");
        doc.rect(0, 10, 34, 4, "F");
        
        // Right black triangle header
        doc.setFillColor(...BLACK);
        doc.rect(108, 0, PW - 108, 14, "F");
        doc.triangle(108, 0, 108, 14, 93, 0, "F");
        
        // Title
        doc.setFont("helvetica", "bold").setFontSize(30).setTextColor(0);
        doc.text("INVOICE", 14, 32);

        // Logo
        try {
          doc.addImage(logoMain, "PNG", 148, 16, 47, 18);
        } catch (e) {
          doc.setFontSize(15).setTextColor(...ORANGE);
          doc.text("DIGIDENT", 162, 22);
        }
      };

      const drawFooter = () => {
        // Bottom black area
        doc.setFillColor(...BLACK);
        doc.rect(0, PH - 13, 100, 13, "F");
        doc.triangle(100, PH - 13, 100, PH, 116, PH, "F");
        
        // Bottom orange area
        doc.setFillColor(...ORANGE);
        doc.rect(158, PH - 7, PW - 158, 7, "F");
        doc.triangle(158, PH - 7, 158, PH, 143, PH, "F");
        
        // Company details
        doc.setFont("helvetica", "bold").setFontSize(11.5).setTextColor(...BLACK);
        doc.text("DIGIDENT INDIA PRIVATE LIMITED.", 14, PH - 26);
        doc.setFont("helvetica", "normal").setFontSize(10);
        doc.text(`${invoiceData.seller?.address }`, 14, PH - 20);
        
        doc.setTextColor(...WHITE);
        doc.text(`Email: ${invoiceData.seller?.email || "info@digident.in"} | Contact: ${invoiceData.seller?.contactNumber || ""}`, 14, PH - 6);
      };

      // --- PAGE 1: Details & Table ---
      drawHeader();

      // Meta Information
      doc.setFontSize(11).setFont("helvetica", "normal").setTextColor(0);
      doc.text(`Invoice Number: ${invoiceData.invoiceNumber}`, 14, 45);
      doc.text(`Invoice Date: ${fmtDate(invoiceData.invoiceDate)}`, 14, 51);
      doc.setFont("helvetica", "bold");
      doc.text(`Due Date: ${fmtDate(invoiceData.dueDate)}`, 14, 57);

      // Left Column (Customer)
      let leftY = 75;
      doc.setFont("helvetica", "bold").setFontSize(11);
      doc.text(`CUSTOMER NO : ${invoiceData.customerNo || "-"}`, 14, leftY);
      leftY += LH;
      doc.setFont("helvetica", "normal");
      doc.text(`Payment Terms : ${invoiceData.paymentTerms || "-"}`, 14, leftY);
      leftY += LH;
      doc.setFont("helvetica", "bold");
      doc.text(`Our GSTIN : ${invoiceData.seller?.gstin || "23AAKCD9669F1ZA"}`, 14, leftY);
      leftY += LH + 5;
      doc.setFont("helvetica", "normal");
      doc.text(`Order Number : ${invoiceData.orderNumber || "-"}`, 14, leftY);
      leftY += LH;
      doc.text(`Customer Service Rep : ${invoiceData.customerServiceRep || "Vithalsir (MD)"}`, 14, leftY);

      // Right Column (Bill To)
      const rightColX = 120;
      let rightY = 75;
      doc.setFont("helvetica", "bold").text("BILL TO", rightColX, rightY);
      doc.setFont("helvetica", "normal").setFontSize(10);
      rightY += LH;
      doc.text(invoiceData.billTo?.contactPerson || "N/A", rightColX, rightY);
      rightY += LH;
      doc.text(invoiceData.billTo?.contactNumber || "N/A", rightColX, rightY);
      rightY += LH;
      doc.setFont("helvetica", "bold");
      doc.text(invoiceData.billTo?.companyName || "N/A", rightColX, rightY);
      rightY += 5;
      doc.setFont("helvetica", "normal");
      const addrLines = doc.splitTextToSize(invoiceData.billTo?.address || "", 75);
      doc.text(addrLines, rightColX, rightY);
      rightY += (addrLines.length * LH);
      doc.setFont("helvetica", "bold");
      doc.text(`GSTIN: ${invoiceData.billTo?.gstin || "N/A"}`, rightColX, rightY);
// --- ADDED SECTION START ---
      rightY += 10; // Spacing before the terms section
      doc.setFont("helvetica", "normal").setFontSize(10);
      doc.text(`Terms of Delivery : ${invoiceData.termsOfDelivery || "-"}`, rightColX, rightY);
      
      rightY += LH;
      doc.text(`Shipping Condition : ${invoiceData.shippingCondition || "-"}`, rightColX, rightY);
      
      rightY += LH;
      doc.text(`Order Date : ${fmtDate(invoiceData.orderDate)}`, rightColX, rightY);
      // --- ADDED SECTION END --- 
      // Table
      const tableRows = invoiceData.items.map((item) => [
        item.articleNo || "-",
        item.description,
        item.qty,
        item.price.toFixed(2),
        `${item.discountPercent}%\n(${item.discountValue.toFixed(2)})`,
        item.gstAmount.toFixed(2),
        item.totalNet.toFixed(2),
        `${item.gstType} ${item.gstPercent}%`,
      ]);

      autoTable(doc, {
        startY: 165,
        head: [["ART. NO", "DESCRIPTION", "QTY", "PRICE", "DISC (%)", "GST AMT", "NET", "GST %"]],
        body: tableRows,
        theme: "plain",
        headStyles: { fillColor: ORANGE, textColor: WHITE, halign: 'center' },
        bodyStyles: { fontSize: 8.5, halign: 'center', cellPadding: 3 },
        didDrawCell: (data) => {
          if (data.section === 'body') {
            doc.setDrawColor(...ORANGE).setLineWidth(0.1);
            doc.line(data.cell.x, data.cell.y + data.cell.height, data.cell.x + data.cell.width, data.cell.y + data.cell.height);
          }
        },
        margin: { left: 14, right: 14 }
      });

      drawFooter();

      // --- PAGE 2: Summary & Bank ---
      doc.addPage();
      drawHeader();
      
      doc.setFont("helvetica", "bold").setFontSize(18).setTextColor(...ORANGE);
      doc.text("SUMMARY & TAX DETAILS", 14, 50);

      const s = invoiceData.summary;
      autoTable(doc, {
        startY: 60,
        head: [["DESCRIPTION", "GOODS", "FREIGHT", "TOTAL"]],
        body: [
          ["Net Value", s.totalNet.toFixed(2), s.freightCost.toFixed(2), (s.totalNet + s.freightCost).toFixed(2)],
          ["Total Tax", s.totalTax.toFixed(2), "0.00", s.totalTax.toFixed(2)],
          ["Grand Total", s.totalPayAmount.toFixed(2), s.freightCost.toFixed(2), s.totalPayAmount.toFixed(2)],
        ],
        theme: "grid",
        headStyles: { fillColor: ORANGE }
      });

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        margin: { left: 110 },
        body: [
          ["Total Payable", `INR ${s.totalPayAmount.toLocaleString('en-IN')}`],
          ["Paid Amount", `INR ${s.paidAmount.toLocaleString('en-IN')}`],
          ["Balance Due", `INR ${s.amountToPay.toLocaleString('en-IN')}`],
        ],
        theme: "grid",
        columnStyles: { 0: { fontStyle: 'bold' } }
      });

      // Bank Details Section
// --- BANK DETAILS WITH QR CODE (Refactored) ---
      const bankY = doc.lastAutoTable.finalY + 100; 
      const qrSize = 35; // Size in mm

      // 1. Add the QR Code (Left side)
      try {
        // Parameters: image, format, x, y, width, height
        doc.addImage(bankQR, "PNG", 14, bankY, qrSize, qrSize);
      } catch (e) {
        console.warn("Bank QR failed to load", e);
        doc.setFontSize(8).setTextColor(150);
        doc.text("[QR Code Placeholder]", 14, bankY + 10);
      }

      // 2. Add Bank Details Text (Right side of the QR)
      const textX = 14 + qrSize + 10; // 14 (margin) + 35 (QR width) + 10 (gap)
      let textY = bankY + 5; // Align text vertically with the top of the QR

      doc.setFont("helvetica", "bold").setFontSize(11).setTextColor(0);
      doc.text("Bank Details", textX, textY);

      doc.setFont("helvetica", "normal").setFontSize(10);
      textY += 7;
      doc.text(`Account No : ${invoiceData.bankDetails?.accountNo || "00840510002087"}`, textX, textY);

      textY += 6;
      doc.text(`Account Type : ${invoiceData.bankDetails?.accountType || "Current"}`, textX, textY);

      textY += 6;
      doc.text(`IFSC Code : ${invoiceData.bankDetails?.ifscCode || "UCBA0000084"}`, textX, textY);

      textY += 6;
      doc.text(`Holder Name : ${invoiceData.bankDetails?.holderName || "Digident India Private Limited"}`, textX, textY);
      // --- END BANK DETAILS ---

      drawFooter();
      doc.save(`Digident_Invoice_${invoiceData.invoiceNumber}.pdf`);

    } catch (error) {
      console.error(error);
      toast.error("Error generating invoice");
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <button 
      onClick={handleDownloadInvoice} 
      disabled={isFetching} 
      className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-all shadow-sm ${className}`}
      style={{ 
        cursor: isFetching ? "not-allowed" : "pointer", 
        background: isFetching 
          ? '#9CA3AF' 
          : 'linear-gradient(160deg, #f8c1a1, #eb730b 100%)' 
      }}
    >
      {isFetching ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
      {isFetching ? "Generating..." : "Download Invoice"}
    </button>
  );
};

export default UserInvoiceButton;