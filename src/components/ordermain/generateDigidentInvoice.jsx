// ============================================================
// Digident India Pvt. Ltd. — Invoice Generator
// Usage: call generateDigidentInvoice(orderData) to download PDF
// Requires: jspdf, jspdf-autotable (npm or CDN)
// ============================================================

export const generateDigidentInvoice = async (order) => {
  if (!order || !order.items || order.items.length === 0) return;

  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF({ unit: "mm", format: "a4" });

  // ── Brand colors ────────────────────────────────────────────
  const ORANGE = [230, 135, 54];   // #E68736
  const BLACK  = [0, 0, 0];
  const WHITE  = [255, 255, 255];
  const GREY   = [120, 120, 120];

  const PW = doc.internal.pageSize.width;   // 210
  const PH = doc.internal.pageSize.height;  // 297

  // ─────────────────────────────────────────────────────────────
  //  HELPER: Draw the header band (used on every page)
  // ─────────────────────────────────────────────────────────────
  const drawHeader = () => {
    // Orange accent strips (top-left)
    doc.setFillColor(...ORANGE);
    doc.rect(0, 4,  45, 4, "F");
    doc.rect(0, 10, 34, 4, "F");

    // Black header band (top-right)
    doc.setFillColor(...BLACK);
    doc.rect(108, 0, PW - 108, 14, "F");
    // Triangle to join the band to the left
    doc.setFillColor(...BLACK);
    doc.triangle(108, 0, 108, 14, 93, 0, "F");

    // "INVOICE" title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(30);
    doc.setTextColor(0);
    doc.text("INVOICE", 14, 32);

    // Logo placeholder — replace with: doc.addImage(logoBase64, "PNG", 148, 17, 47, 18)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(...ORANGE);
    doc.text("Digident", 162, 9);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...WHITE);
    doc.text("Creating a World Of Smiles", 162, 13.5);
  };

  // ─────────────────────────────────────────────────────────────
  //  HELPER: Draw footer band
  // ─────────────────────────────────────────────────────────────
  const drawFooter = () => {
    // Black strip bottom-left
    doc.setFillColor(...BLACK);
    doc.rect(0, PH - 13, 100, 13, "F");
    doc.triangle(100, PH - 13, 100, PH, 116, PH, "F");

    // Orange strip bottom-right
    doc.setFillColor(...ORANGE);
    doc.rect(158, PH - 7, PW - 158, 7, "F");
    doc.triangle(158, PH - 7, 158, PH, 143, PH, "F");

    // Footer text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...WHITE);
    doc.text("DIGIDENT INDIA PRIVATE LIMITED.", 14, PH - 8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text("Regd: 314, Sapna Sangeeta Rd, near Matlani Garden, Professor Colony, Indore, MP 452001", 14, PH - 4);

    doc.setTextColor(...WHITE);
    doc.text("Email: info@digident.in", 148, PH - 8, { align: "right" });
    doc.text("Tel: +91 9294503001", 148, PH - 4, { align: "right" });
  };

  // ─────────────────────────────────────────────────────────────
  //  PAGE 1 — Invoice details + line items
  // ─────────────────────────────────────────────────────────────
  drawHeader();

  // ── Invoice meta (below title) ──────────────────────────────
  const invDate  = new Date(order.invoiceDate  || order.createdAt).toLocaleDateString("en-GB");
  const dueDate  = new Date(order.dueDate      || order.createdAt).toLocaleDateString("en-GB");
  const orderDate = new Date(order.orderDate   || order.createdAt).toLocaleDateString("en-GB");
  const delivDate = new Date(order.deliveryDate|| order.createdAt).toLocaleDateString("en-GB");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(0);
  doc.text(`Invoice Number: #${order.invoiceNumber || order.orderId?.substring(0,8) || "N/A"}`, 14, 38);
  doc.text(`Invoice Date: ${invDate}`, 14, 43);
  doc.setFont("helvetica", "bold");
  doc.text(`Due Date: ${dueDate}`, 14, 48);

  // ── Customer info block (left) ──────────────────────────────
  const LX = 14, MX = 105, Y0 = 56;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(`CUSTOMER NO : ${order.customerNo || "N/A"}`, LX, Y0);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(`Payment Terms : ${order.paymentTerms || "Payable due amount in 10 days"}`, LX, Y0 + 5);
  doc.setFont("helvetica", "bold");
  doc.text(`Our GSTIN : 23AAKCD9669F1ZA`, LX, Y0 + 10);

  doc.setFont("helvetica", "normal");
  doc.text(`Order Number : ${order.orderNumber || order.orderId || "N/A"}`, LX, Y0 + 16);
  doc.text(`Customer Service Rep : ${order.csr || "Vithalsir ( MD )"}`, LX, Y0 + 21);

  // ── Bill To block (right) ───────────────────────────────────
  const addr = order.billingAddress || {};
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("BILL TO", MX, Y0);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text(addr.name || order.customerName || "N/A", MX, Y0 + 5);

  doc.setFont("helvetica", "normal");
  const addrLines = doc.splitTextToSize(
    [addr.line1, addr.line2, addr.city, addr.state, addr.pincode]
      .filter(Boolean).join(", "),
    95
  );
  doc.text(addrLines, MX, Y0 + 10);

  let addrEndY = Y0 + 10 + addrLines.length * 4.5;

  doc.text(`GSTIN: ${addr.gstin || "-"}`, MX, addrEndY + 2);
  if (addr.contactPerson) doc.text(`Contact Person: ${addr.contactPerson}`, MX, addrEndY + 6.5);
  if (addr.contact)       doc.text(`Contact: ${addr.contact}`, MX, addrEndY + 11);

  // Delivery info block
  let delivY = addrEndY + 16;
  doc.setFont("helvetica", "bold");
  doc.text(`Terms of Delivery : ${order.termsOfDelivery || "CIP"}`, MX, delivY);
  doc.setFont("helvetica", "normal");
  doc.text(`Shipping Condition : ${order.shippingCondition || "Normal"}`, MX, delivY + 5);
  doc.text(`Order Date : ${orderDate}`, MX, delivY + 10);
  doc.text(`Delivery Date : ${delivDate}`, MX, delivY + 15);

  // ── Divider ─────────────────────────────────────────────────
  const tableStartY = Math.max(delivY + 22, 110);

  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(14, tableStartY - 3, PW - 14, tableStartY - 3);

  // ── Line items table ─────────────────────────────────────────
  const rows = order.items.map((item, i) => [
    i + 1,
    item.description || item.productName || "",
    item.qty || item.quantity || 1,
    (item.price || 0).toFixed(2),
    item.discountPct ? `${item.discountPct}%\n${(item.discountValue || 0).toFixed(2)}` : "0%\n0.00",
    "0",
    ((item.price || 0) * (item.qty || item.quantity || 1)).toFixed(2),
    item.gst || `IGST${order.gstPercentage || 5}%`,
  ]);

  autoTable(doc, {
    startY: tableStartY,
    head: [[
      { content: "ARTICLE\nNO",   styles: { halign: "center" } },
      { content: "DESCRIPTION",   styles: { halign: "left"   } },
      { content: "QTY",           styles: { halign: "center" } },
      { content: "PRICE",         styles: { halign: "right"  } },
      { content: "DISCOUNT\n(VALUE)",  styles: { halign: "center" } },
      { content: "DISCOUNT\nTOTAL",   styles: { halign: "center" } },
      { content: "TOTAL NET",     styles: { halign: "right"  } },
      { content: "GST",           styles: { halign: "center" } },
    ]],
    body: rows,
    theme: "grid",
    headStyles: {
      fillColor: ORANGE,
      textColor: WHITE,
      fontSize: 8,
      fontStyle: "bold",
      cellPadding: 3,
      lineColor: [200, 170, 130],
      lineWidth: 0.2,
    },
    bodyStyles: {
      fontSize: 9,
      cellPadding: { top: 5, bottom: 5, left: 3, right: 3 },
      textColor: BLACK,
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 14 },
      1: { halign: "left",   cellWidth: 55 },
      2: { halign: "center", cellWidth: 12 },
      3: { halign: "right",  cellWidth: 22 },
      4: { halign: "center", cellWidth: 22 },
      5: { halign: "center", cellWidth: 20 },
      6: { halign: "right",  cellWidth: 22 },
      7: { halign: "center", cellWidth: 18 },
    },
    alternateRowStyles: { fillColor: [253, 248, 242] },
    margin: { left: 14, right: 14 },
  });

  // ── Bank details ─────────────────────────────────────────────
  const afterTableY = doc.lastAutoTable.finalY + 8;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(0);
  doc.text("Bank Details", 22, afterTableY + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  const bY = afterTableY + 11;
  doc.text("Account No : 00840510002087",      22, bY);
  doc.text("Account Type : Current",           22, bY + 4.5);
  doc.text("IFSC Code : UCBA0000084",          22, bY + 9);
  doc.text("Holder Name : Digident India Private Limited", 22, bY + 13.5);

  // QR placeholder box
  doc.setDrawColor(180);
  doc.setLineWidth(0.4);
  doc.rect(14, afterTableY + 2, 16, 16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.5);
  doc.setTextColor(GREY[0]);
  doc.text("QR CODE", 22, afterTableY + 10, { align: "center" });
  doc.setTextColor(0);

  drawFooter();

  // ─────────────────────────────────────────────────────────────
  //  PAGE 2 — GST & Invoice Summary
  // ─────────────────────────────────────────────────────────────
  doc.addPage();
  drawHeader();

  // Page 2 heading
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...ORANGE);
  doc.text("TAX & HSN SUMMARY", 14, 35);

  // ── GST Summary table ────────────────────────────────────────
  const taxableVal = order.grandTotal - (order.gstAmount || 0) - (order.shippingCharge || 0);
  const gstAmt     = order.gstAmount       || 0;
  const freight    = order.shippingCharge  || 0;
  const grandTotal = order.grandTotal      || 0;

  autoTable(doc, {
    startY: 42,
    head: [[
      "GST SUMMARY", "GOODS", "FREIGHT", "TOTAL"
    ]],
    body: [
      ["Net Value",    taxableVal.toFixed(2), freight.toFixed(2), (taxableVal + freight).toFixed(2)],
      ["Total Tax",    gstAmt.toFixed(2),     "0.00",             gstAmt.toFixed(2)],
      ["Net incl. Tax",grandTotal.toFixed(2), freight.toFixed(2), grandTotal.toFixed(2)],
    ],
    theme: "grid",
    headStyles: { fillColor: ORANGE, textColor: WHITE, fontSize: 9, fontStyle: "bold" },
    bodyStyles: { fontSize: 9 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 40 },
      1: { halign: "right" },
      2: { halign: "right" },
      3: { halign: "right", fontStyle: "bold" },
    },
    margin: { left: 14, right: 14 },
  });

  // ── Invoice Summary table ────────────────────────────────────
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 12,
    margin: { left: 108, right: 14 },
    head: [["INVOICE SUMMARY", "AMOUNT"]],
    body: [
      ["Total Gross Value", `${taxableVal.toFixed(2)} INR`],
      ["Total Discount",    `${(order.totalDiscount || 0).toFixed(2)} INR`],
      ["Total Net",         `${taxableVal.toFixed(2)} INR`],
      ["Freight Cost",      `${freight.toFixed(2)} INR`],
      ["Total Tax",         `${gstAmt.toFixed(2)} INR`],
      ["Total Pay Amount",  `${grandTotal.toFixed(2)} INR`],
      ["Paid Amount",       `${(order.paidAmount || 0).toFixed(2)} INR`],
      ["Amount to Pay",     `${(grandTotal - (order.paidAmount || 0)).toFixed(2)} INR`],
    ],
    theme: "grid",
    headStyles: {
      fillColor: ORANGE,
      textColor: WHITE,
      fontSize: 9,
      fontStyle: "bold",
    },
    bodyStyles: { fontSize: 9, halign: "right" },
    columnStyles: {
      0: { fontStyle: "bold", halign: "left", cellWidth: 55 },
      1: { halign: "right", cellWidth: 35 },
    },
    didParseCell: (data) => {
      // Bold highlight on key rows
      const bold = ["Total Gross Value", "Total Net", "Total Pay Amount", "Amount to Pay"];
      if (data.column.index === 0 && bold.includes(data.cell.raw)) {
        data.cell.styles.fontStyle = "bold";
      }
      if (data.column.index === 1 && bold.includes(data.row.cells[0]?.raw)) {
        data.cell.styles.fontStyle = "bold";
      }
    },
  });

  // Company details block (bottom-left of page 2)
  const p2FooterY = doc.lastAutoTable.finalY + 16;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(0);
  doc.text("Digident India Pvt. Ltd.", 14, p2FooterY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Regd: Digident India Pvt Ltd, 314, Sapna Sangeeta Rd,", 14, p2FooterY + 5);
  doc.text("near Matlani Garden, Professor Colony, Indore, Madhya Pradesh 452001", 14, p2FooterY + 10);
  doc.text("Telephone : +91 9294503001 | 02 | 03", PW - 14, p2FooterY + 5, { align: "right" });
  doc.text("Email : info@digident.in",              PW - 14, p2FooterY + 10, { align: "right" });

  drawFooter();

  // ─────────────────────────────────────────────────────────────
  //  Save the PDF
  // ─────────────────────────────────────────────────────────────
  const fileName = `Digident_Invoice_${order.invoiceNumber || order.orderId || "INV"}.pdf`;
  doc.save(fileName);
};


// ─────────────────────────────────────────────────────────────
//  EXAMPLE USAGE
// ─────────────────────────────────────────────────────────────
/*
const exampleOrder = {
  invoiceNumber: "202604",
  invoiceDate:   "2026-04-05",
  dueDate:       "2026-04-15",
  orderDate:     "2026-04-05",
  deliveryDate:  "2026-04-05",
  orderNumber:   "20261104",
  customerNo:    "20260104",
  csr:           "Vithalsir ( MD )",
  paymentTerms:  "Payable due amount in 10 days",
  termsOfDelivery: "CIP Surat",
  shippingCondition: "Normal",
  gstPercentage: 5,

  billingAddress: {
    name:          "Artisan Dental Lab",
    line1:         "Plot no.2/4447, Shivdas Zaveri Street",
    line2:         "Near Udhana Darwaja, Sagrampura",
    city:          "Surat",
    state:         "Gujarat",
    pincode:       "395002",
    gstin:         "-",
    contactPerson: "Manish Dhami",
    contact:       "+91 9722440001",
  },

  items: [
    { description: "Denitum Compatible Lab Analog",  qty: 6, price: 1200, gst: "IGST5%" },
    { description: "Denitum Compatible Scanbody",    qty: 3, price: 3000, gst: "IGST5%" },
  ],

  grandTotal:    16200,
  gstAmount:     771.43,
  shippingCharge: 0,
  totalDiscount:  0,
  paidAmount:     0,
};

generateDigidentInvoice(exampleOrder);
*/