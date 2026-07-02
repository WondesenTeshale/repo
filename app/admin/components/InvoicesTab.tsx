"use client";
import { useState, useEffect, useCallback } from "react";
import { Invoice, fetchInvoices, apiUpdateInvoice, apiDeleteInvoice, InvoiceItem, InvoiceMilestone, PaymentHistoryEntry } from "@/lib/db";
import { Plus, X, Upload, Trash2, Eye, Download, FileText, CheckCircle2, Copy } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";

interface Props { token: string; onRefresh?: () => void; }

const DELIVERABLES_LIST = [
  "Source Code",
  "Database & Files",
  "Deployment",
  "Testing & Bug Fixes",
  "Documentation",
  "API Documentation",
  "Support & Maintenance"
];

const DEFAULT_ITEM: InvoiceItem = { description: "", quantity: 1, unitPrice: 0, discount: 0, total: 0 };
const DEFAULT_MILESTONE: InvoiceMilestone = { milestone: "", description: "", completionDate: "", amount: 0, status: "Paid" };
const DEFAULT_PAYMENT: PaymentHistoryEntry = { date: "", method: "Wise Transfer", reference: "", amount: 0, status: "Received" };

export default function InvoicesTab({ token, onRefresh }: Props) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [uploadingSig, setUploadingSig] = useState(false);
  const [uploadingStamp, setUploadingStamp] = useState(false);

  // Form states
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [company, setCompany] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [projectRef, setProjectRef] = useState("");
  const [purchaseOrder, setPurchaseOrder] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [paymentMethod, setPaymentMethod] = useState("Wise Transfer");
  const [issueDate, setIssueDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("Paid");
  const [notes, setNotes] = useState("Thank you for choosing BetterDose. We have successfully delivered the project as per the agreed scope and requirements. If you need any support or additional changes, feel free to reach out. We look forward to working with you again.");
  const [taxPercent, setTaxPercent] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);

  // Project Info Card fields
  const [projectName, setProjectName] = useState("");
  const [projectCategory, setProjectCategory] = useState("Software Development");
  const [projectStartDate, setProjectStartDate] = useState("");
  const [projectEndDate, setProjectEndDate] = useState("");
  const [projectTeam, setProjectTeam] = useState("BetterDose Development Team");
  const [projectStatus, setProjectStatus] = useState("Completed");

  // Custom URLs
  const [signatureUrl, setSignatureUrl] = useState("");
  const [stampUrl, setStampUrl] = useState("");

  // Lists
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: "Software Development - Phase 1\nInitial requirements, UI/UX, core development", quantity: 1, unitPrice: 50, discount: 0, total: 50 },
    { description: "Software Development - Phase 2\nAdditional features, integrations, optimizations", quantity: 1, unitPrice: 50, discount: 0, total: 50 }
  ]);
  const [milestones, setMilestones] = useState<InvoiceMilestone[]>([
    { milestone: "Phase 1", description: "Software Development", completionDate: "2026-06-07", amount: 50, status: "Paid" },
    { milestone: "Phase 2", description: "Software Development 2", completionDate: "2026-06-09", amount: 50, status: "Paid" }
  ]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryEntry[]>([
    { date: "2026-06-07", method: "Wise Transfer", reference: "Software Development", amount: 50, status: "Received" },
    { date: "2026-06-09", method: "Wise Transfer", reference: "Software Phase 2", amount: 50, status: "Received" }
  ]);
  const [deliverables, setDeliverables] = useState<string[]>(["Source Code", "Database & Files", "Deployment", "Testing & Bug Fixes", "Documentation"]);

  const [editingId, setEditingId] = useState<string | null>(null);

  const resetForm = useCallback(() => {
    setEditingId(null);
    const yr = new Date().getFullYear();
    const rand = String(Math.floor(Math.random() * 900) + 100);
    setInvoiceNumber(`INV-${yr}-${rand}`);
    setClientName("Trying");
    setClientEmail("Trying email");
    setCompany("");
    setCountry("N/A");
    setPhone("");
    setProjectRef(`PRJ-${yr}-053`);
    setPurchaseOrder("N/A");
    setCurrency("USD");
    setPaymentMethod("Multiple Options");
    setIssueDate("2026-07-01");
    setDueDate("2026-07-15");
    setPaymentStatus("Paid");
    setProjectName("Trying");
    setProjectCategory("Software Development");
    setProjectStartDate("2026-06-01");
    setProjectEndDate("2026-06-30");
    setProjectTeam("BetterDose Development Team");
    setProjectStatus("Completed");
    setNotes("Thank you for choosing BetterDose. We have successfully delivered the project as per the agreed scope and requirements. If you need any support or additional changes, feel free to reach out. We look forward to working with you again.");
    setItems([
      { description: "Software Development - Phase 1\nInitial requirements, UI/UX, core development", quantity: 1, unitPrice: 50, discount: 0, total: 50 },
      { description: "Software Development - Phase 2\nAdditional features, integrations, optimizations", quantity: 1, unitPrice: 50, discount: 0, total: 50 }
    ]);
    setMilestones([
      { milestone: "Phase 1", description: "Software Development", completionDate: "2026-06-07", amount: 50, status: "Paid" },
      { milestone: "Phase 2", description: "Software Development 2", completionDate: "2026-06-09", amount: 50, status: "Paid" }
    ]);
    setPaymentHistory([
      { date: "2026-06-07", method: "Wise Transfer", reference: "Software Development", amount: 50, status: "Received" },
      { date: "2026-06-09", method: "Wise Transfer", reference: "Software Phase 2", amount: 50, status: "Received" }
    ]);
    setDeliverables(["Source Code", "Database & Files", "Deployment", "Testing & Bug Fixes", "Documentation"]);
    setTaxPercent(0);
    setDiscountPercent(0);
    setSignatureUrl("");
    setStampUrl("");
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await fetchInvoices(token);
    setInvoices(data);
    setLoading(false);
  }, [token]);

  useEffect(() => {
    load();
    resetForm();
  }, [load, resetForm]);

  // Calculations
  const subtotal = items.reduce((acc, it) => acc + (it.quantity * it.unitPrice - (it.discount || 0)), 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxAmount = ((subtotal - discountAmount) * taxPercent) / 100;
  const totalDue = subtotal - discountAmount + taxAmount;
  const amountPaid = paymentHistory.reduce((acc, p) => p.status === "Received" ? acc + Number(p.amount) : acc, 0);
  const remainingBalance = totalDue - amountPaid;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: "sig" | "stamp") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (target === "sig") setUploadingSig(true);
    else setUploadingStamp(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", "documents");

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "x-admin-token": token },
        body: formData
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      
      if (target === "sig") setSignatureUrl(data.url);
      else setStampUrl(data.url);
    } catch (err) {
      console.error(err);
      alert("Failed to upload image.");
    } finally {
      setUploadingSig(false);
      setUploadingStamp(false);
    }
  };

  const getBase64FromUrl = async (url: string): Promise<string> => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.error("Failed to convert image to base64", err);
      return "";
    }
  };

  const handleSave = async (generatePdf: boolean) => {
    setGenerating(true);
    try {
      let finalVerificationCode = "";
      let finalFileUrl = "";

      if (editingId) {
        const existingInv = invoices.find(i => i.id === editingId);
        if (existingInv) {
          finalVerificationCode = existingInv.verificationCode;
          finalFileUrl = existingInv.fileUrl || "";
        }
      } 
      
      if (!finalVerificationCode) {
        const codeChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        finalVerificationCode = "PDFFX-" + Array.from({ length: 10 }, () => codeChars[Math.floor(Math.random() * codeChars.length)]).join("");
      }

      if (generatePdf) {
        const verificationUrl = `https://www.betterdose.dev/pdffx/${finalVerificationCode}`;
        const logoBase64 = await getBase64FromUrl(window.location.origin + "/logo.jpg");

        const doc = new jsPDF();
      
      // BetterDose Accent Colors
      const primaryColor = [30, 64, 175]; // Blue (#1e40af)
      const secondaryColor = [37, 99, 235]; // Blue (#2563eb)
      const grayColor = [100, 116, 139]; // Slate Gray (#64748b)
      const darkColor = [15, 23, 42]; // Slate Dark (#0f172a)

      // Helpers
      const formatCurrency = (val: number) => `${Number(val).toFixed(2)} ${currency}`;

      // --- SECTION 1: Company Header (Top Left) ---
      if (logoBase64) {
        doc.addImage(logoBase64, "JPEG", 14, 15, 42, 12);
      } else {
        // Logo (Draw vector 'B' icon)
        doc.setFillColor(37, 99, 235); // BetterDose Blue
        doc.roundedRect(14, 15, 12, 12, 3, 3, "F");
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.text("B", 19, 23, { align: "center" });

        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(15, 23, 42);
        doc.text("BetterDose", 29, 24);
      }

      doc.setDrawColor(37, 99, 235);
      doc.setLineWidth(0.8);
      doc.line(14, 31, 14, 67); // Left bar next to details

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("BetterDose Ltd.", 18, 35);
      
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      doc.text(`Website: https://www.betterdose.dev`, 18, 41);
      doc.text(`Email: contact@betterdose.dev`, 18, 47);
      doc.text(`Phone: +44 7460 993797 / +251 976 046 482`, 18, 53);
      doc.text("Registered in the United Kingdom", 18, 59);
      doc.text("Operating Team: Addis Ababa, Ethiopia", 18, 65);

      // --- SECTION 2: Title & Details Table (Top Right) ---
      doc.setFontSize(36);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      const titleText = paymentStatus === "Paid" ? "PAID INVOICE" : "INVOICE";
      doc.text(titleText, 196, 26, { align: "right" });

      // Invoice ID Pill
      doc.setFillColor(15, 23, 42);
      doc.roundedRect(140, 31, 56, 8, 4, 4, "F");
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text(invoiceNumber, 168, 36.5, { align: "center" });

      let paymentDetail1 = "";
      let paymentDetail2 = "";
      let paymentDetail3 = "";
      if (paymentMethod === "PayPal") {
        paymentDetail1 = "pixelsteamin@gmail.com (PayPal)";
      } else if (paymentMethod === "Wise Transfer") {
        paymentDetail1 = "fikirkabe@gmail.com (Wise Email)";
        paymentDetail2 = "@betterdoseltd (Wise Tag)";
      } else if (paymentMethod === "Multiple Options") {
        paymentDetail1 = "pixelsteamin@gmail.com (PayPal)";
        paymentDetail2 = "fikirkabe@gmail.com (Wise Email)";
        paymentDetail3 = "@betterdoseltd (Wise Tag)";
      }

      const infoList = [
        ["Invoice Created On:", issueDate],
        ["Due Date:", dueDate],
        ["Invoice Status:", paymentStatus],
        ["Client ID:", invoiceNumber.replace("INV", "CL")],
        ["Currency:", currency],
        ["Payment Method:", paymentMethod],
      ];

      if (paymentDetail1) infoList.push(["Pay To:", paymentDetail1]);
      if (paymentDetail2) infoList.push(["", paymentDetail2]);
      if (paymentDetail3) infoList.push(["", paymentDetail3]);

      infoList.push(
        ["Project Reference:", projectRef],
        ["Purchase Order:", purchaseOrder || "N/A"]
      );

      doc.setFontSize(8.5);
      infoList.forEach(([label, val], idx) => {
        const y = 47 + idx * 5.2;
        doc.setFont("helvetica", "bold");
        doc.setTextColor(71, 85, 105);
        doc.text(label, 130, y);

        if (label === "Invoice Status:") {
          // Status Badge
          const badgeBg = val === "Paid" ? [220, 252, 231] : [254, 243, 199];
          const badgeFg = val === "Paid" ? [22, 101, 52] : [180, 83, 9];
          doc.setFillColor(badgeBg[0], badgeBg[1], badgeBg[2]);
          doc.roundedRect(165, y - 4, 18, 5, 1, 1, "F");
          doc.setFont("helvetica", "bold");
          doc.setTextColor(badgeFg[0], badgeFg[1], badgeFg[2]);
          doc.text(val.toUpperCase(), 174, y - 0.5, { align: "center" });
        } else {
          doc.setFont("helvetica", "normal");
          doc.setTextColor(15, 23, 42);
          doc.text(val, 165, y);
        }
      });

      // --- SECTION 3: Billed To & Project Information Cards ---
      const cardY = 47 + infoList.length * 5.2 + 8;
      // Billed To Card
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.4);
      doc.roundedRect(14, cardY, 88, 30, 2, 2, "S");
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(37, 99, 235);
      doc.text("BILLED TO", 14, cardY - 3);

      // Icon box (Billed To)
      doc.setFillColor(239, 246, 255);
      doc.roundedRect(18, cardY + 4, 10, 10, 2, 2, "F");
      // Drawing a little person shape inside icon box
      doc.setFillColor(37, 99, 235);
      doc.ellipse(23, 23 + cardY - 12, 1.5, 1.5, "F");
      doc.roundedRect(21, 23 + cardY - 9, 4, 2, 1, 1, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text(clientName, 32, cardY + 8);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      doc.text(clientEmail, 32, cardY + 13);
      doc.text(`Country: ${country || "N/A"}`, 32, cardY + 18);

      // Project Info Card
      doc.roundedRect(108, cardY, 88, 30, 2, 2, "S");
      doc.setFont("helvetica", "bold");
      doc.setTextColor(37, 99, 235);
      doc.text("PROJECT INFORMATION", 108, cardY - 3);

      // Icon box (Project Info)
      doc.setFillColor(239, 246, 255);
      doc.roundedRect(112, cardY + 4, 10, 10, 2, 2, "F");
      // Draw simple document/folder vector
      doc.setDrawColor(37, 99, 235);
      doc.setLineWidth(0.5);
      doc.roundedRect(114, cardY + 6, 6, 6, 0.5, 0.5, "S");

      const projList = [
        ["Project Name:", projectName || clientName],
        ["Project Category:", projectCategory],
        ["Project Start Date:", projectStartDate],
        ["Project Completion Date:", projectEndDate],
        ["Assigned Team:", projectTeam],
        ["Project Status:", projectStatus]
      ];

      doc.setFontSize(7.5);
      projList.forEach(([lbl, v], idx) => {
        const xLabel = 126;
        const xValue = 160;
        const yPos = cardY + 5.5 + idx * 4.5;

        doc.setFont("helvetica", "normal");
        doc.setTextColor(71, 85, 105);
        doc.text(lbl, xLabel, yPos);

        if (lbl === "Project Status:") {
          const bg = v === "Completed" ? [220, 252, 231] : [254, 243, 199];
          const fg = v === "Completed" ? [22, 101, 52] : [180, 83, 9];
          doc.setFillColor(bg[0], bg[1], bg[2]);
          doc.roundedRect(xValue, yPos - 3.5, 15, 4.5, 1, 1, "F");
          doc.setFont("helvetica", "bold");
          doc.setTextColor(fg[0], fg[1], fg[2]);
          doc.setFontSize(7);
          doc.text(v, xValue + 7.5, yPos - 0.5, { align: "center" });
        } else {
          doc.setFont("helvetica", "bold");
          doc.setTextColor(15, 23, 42);
          doc.text(v, xValue, yPos);
        }
      });

      // --- SECTION 4: Service Table ---
      const tableHead = [['SERVICE / DESCRIPTION', 'QTY', 'UNIT PRICE', 'TOTAL']];
      // Format rows for autotable
      const formattedItems = items.map(it => [
        it.description,
        it.quantity.toString(),
        formatCurrency(it.unitPrice),
        formatCurrency(it.quantity * it.unitPrice - (it.discount || 0))
      ]);

      // Add Subtotal / Discount rows directly inside table styling
      formattedItems.push(
        ["", "", "Subtotal", formatCurrency(subtotal)],
        ["", "", "Discount", formatCurrency(discountAmount)],
        ["", "", "TOTAL DUE", formatCurrency(totalDue)]
      );

      autoTable(doc, {
        startY: cardY + 36,
        head: tableHead,
        body: formattedItems,
        theme: 'striped',
        headStyles: { fillColor: [15, 23, 42], fontSize: 8, fontStyle: 'bold' },
        bodyStyles: { fontSize: 8, textColor: [15, 23, 42] },
        columnStyles: {
          0: { cellWidth: 100 },
          1: { cellWidth: 15, halign: 'center' },
          2: { cellWidth: 35, halign: 'right' },
          3: { cellWidth: 32, halign: 'right' }
        },
        didParseCell: (dataCell) => {
          // Style the summary rows uniquely
          const rowIndex = dataCell.row.index;
          if (rowIndex >= items.length) {
            dataCell.cell.styles.fontStyle = 'bold';
            dataCell.cell.styles.fillColor = [255, 255, 255];
            if (dataCell.cell.text[0].includes("TOTAL DUE")) {
              dataCell.cell.styles.fillColor = [239, 246, 255];
              dataCell.cell.styles.textColor = [37, 99, 235];
            }
          }
        }
      });

      let currentY = (doc as any).lastAutoTable.finalY + 10;

      // --- SECTION 5: Milestones & Payment Summary side-by-side ---
      // We will define a clean boundary logic. A4 total width is 210, usable is 196.
      // Left side: X=14 to 102. Right side: X=108 to 196.
      const sideY = currentY;

      // Left Column: Milestone Payments
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(37, 99, 235);
      doc.text("MILESTONE PAYMENTS", 14, sideY);

      const milestoneBody = milestones.map(m => [
        m.milestone,
        m.description || "N/A",
        m.completionDate || "N/A",
        formatCurrency(m.amount),
        m.status
      ]);

      autoTable(doc, {
        startY: sideY + 2,
        margin: { left: 14, right: 108 },
        head: [['MILESTONE', 'DESCRIPTION', 'DUE DATE', 'AMOUNT', 'STATUS']],
        body: milestoneBody,
        theme: 'grid',
        headStyles: { fillColor: [71, 85, 105], fontSize: 7, fontStyle: 'bold' },
        bodyStyles: { fontSize: 7.5 },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 25 },
          2: { cellWidth: 16 },
          3: { cellWidth: 16, halign: 'right' },
          4: { cellWidth: 16, halign: 'center' }
        },
        didParseCell: (dataCell) => {
          // Format PAID badges in cell render
          if (dataCell.column.index === 4 && dataCell.cell.text[0] === "Paid") {
            dataCell.cell.styles.textColor = [22, 101, 52];
            dataCell.cell.styles.fontStyle = 'bold';
          }
        }
      });

      // Right Column: Payment Summary Box
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(108, sideY + 2, 88, 30, 2, 2, "S");
      
      doc.setFont("helvetica", "bold");
      doc.setTextColor(37, 99, 235);
      doc.text("PAYMENT SUMMARY", 108, sideY);

      const summList = [
        ["Subtotal", formatCurrency(subtotal)],
        ["Discount", `-${formatCurrency(discountAmount)}`],
        [`Tax (${taxPercent}%)`, formatCurrency(taxAmount)],
        ["Invoice Total", formatCurrency(totalDue)],
        ["Amount Paid", `-${formatCurrency(amountPaid)}`]
      ];

      doc.setFontSize(8);
      summList.forEach(([lbl, val], idx) => {
        const y = sideY + 7 + idx * 4.2;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(71, 85, 105);
        doc.text(lbl, 112, y);

        if (lbl === "Amount Paid") doc.setTextColor(22, 101, 52);
        doc.setFont("helvetica", "bold");
        doc.text(val, 192, y, { align: "right" });
      });

      // Total Due Banner inside summary box
      doc.setFillColor(15, 23, 42);
      doc.roundedRect(108, sideY + 24, 88, 8, 1, 1, "F");
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text("AMOUNT DUE", 112, sideY + 29.5);
      doc.text(formatCurrency(remainingBalance), 192, sideY + 29.5, { align: "right" });

      currentY = Math.max((doc as any).lastAutoTable.finalY || 0, sideY + 36) + 6;

      // --- SECTION 6: Payment History ---
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(37, 99, 235);
      doc.text("PAYMENT HISTORY", 14, currentY);

      const historyBody = paymentHistory.map(p => [
        p.date,
        p.method,
        p.reference || "N/A",
        formatCurrency(p.amount),
        p.status
      ]);

      autoTable(doc, {
        startY: currentY + 2,
        head: [['DATE', 'METHOD', 'REFERENCE / TRANSACTION ID', 'AMOUNT', 'STATUS']],
        body: historyBody,
        theme: 'grid',
        headStyles: { fillColor: [71, 85, 105], fontSize: 7, fontStyle: 'bold' },
        bodyStyles: { fontSize: 7.5 },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 35 },
          2: { cellWidth: 70 },
          3: { cellWidth: 28, halign: 'right' },
          4: { cellWidth: 24, halign: 'center' }
        },
        didParseCell: (dataCell) => {
          if (dataCell.column.index === 4 && dataCell.cell.text[0] === "Received") {
            dataCell.cell.styles.textColor = [22, 101, 52];
            dataCell.cell.styles.fontStyle = 'bold';
          }
        }
      });

      currentY = (doc as any).lastAutoTable.finalY + 8;

      // Ensure there is space for Deliverables & Notes on the current page
      if (currentY + 45 > 280) {
        doc.addPage();
        currentY = 20;
      }

      // --- SECTION 7: Deliverables & Notes side-by-side ---
      // Left: Deliverables Card (X=14 to 102)
      doc.roundedRect(14, currentY + 2, 88, 30, 2, 2, "S");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(37, 99, 235);
      doc.text("DELIVERABLES", 14, currentY);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      deliverables.slice(0, 5).forEach((d, idx) => {
        const y = currentY + 7 + idx * 4.5;
        doc.setFillColor(34, 197, 94); // green
        doc.roundedRect(18, y - 2.5, 3, 3, 0.5, 0.5, "F"); // checked box
        // Drawing a checkmark symbol inside
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(5);
        doc.text("V", 19.5, y - 0.5, { align: "center" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(15, 23, 42);
        doc.text(d, 24, y);
      });

      // Right: Notes Card (X=108 to 196)
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(108, currentY + 2, 88, 30, 2, 2, "F");
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(108, currentY + 2, 88, 30, 2, 2, "S");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(37, 99, 235);
      doc.text("NOTES", 108, currentY);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text(notes, 112, currentY + 7, { maxWidth: 80 });

      currentY += 38;

      // Ensure footer space
      if (currentY > 260) {
        doc.addPage();
        currentY = 20;
      }

      // --- SECTION 8: Verification, Stamp & Circular Seal ---
      // Left Column: Online Verification Card
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(14, currentY, 100, 26, 2, 2, "F");
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(14, currentY, 100, 26, 2, 2, "S");

      // QR Code
      try {
        const qrDataUrl = await QRCode.toDataURL(verificationUrl, { margin: 1 });
        doc.addImage(qrDataUrl, "PNG", 18, currentY + 3, 20, 20);
      } catch (err) {
        console.error("QR Code generation failed", err);
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(37, 99, 235);
      doc.text("VIEW / VERIFY THIS INVOICE", 42, currentY + 6);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(71, 85, 105);
      doc.text("Scan the QR code to view and download this invoice", 42, currentY + 10);
      doc.text("from BetterDose secure document system.", 42, currentY + 13);

      // Link button
      doc.setFillColor(15, 23, 42);
      doc.roundedRect(42, currentY + 16, 70, 6, 1, 1, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      doc.setTextColor(255, 255, 255);
      doc.text(verificationUrl, 44, currentY + 20.2);

      // Right Column: Signatures & Stamp
      const sigX = 126;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(37, 99, 235);
      doc.text("Authorized By", sigX, currentY + 3);

      // Signature line
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.4);
      doc.line(sigX, currentY + 14, sigX + 38, currentY + 14);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text("Nebiyu Muluadam", sigX, currentY + 18);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text("Founder & Lead Developer", sigX, currentY + 22);
      doc.text("BetterDose Ltd.", sigX, currentY + 25);

      // Circular vector seal (drawn if no custom image is uploaded)
      const sealX = 182;
      const sealY = currentY + 13;
      doc.setDrawColor(37, 99, 235);
      doc.setLineWidth(0.8);
      doc.ellipse(sealX, sealY, 11, 11, "S");
      doc.setLineWidth(0.3);
      doc.ellipse(sealX, sealY, 9.5, 9.5, "S");
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(4.5);
      doc.setTextColor(37, 99, 235);
      doc.text("BETTERDOSE LTD.", sealX, sealY - 4, { align: "center" });
      doc.text("UNITED KINGDOM", sealX, sealY + 6, { align: "center" });
      if (logoBase64) {
        doc.addImage(logoBase64, "JPEG", sealX - 7, sealY - 2.5, 14, 4);
      } else {
        doc.setFontSize(10);
        doc.text("B", sealX, sealY + 1.5, { align: "center" });
      }

      // Overlap with actual custom stamp if available
      if (stampUrl) {
        const stampBase64 = await getBase64FromUrl(stampUrl);
        if (stampBase64) {
          doc.addImage(stampBase64, "PNG", sealX - 11, sealY - 11, 22, 22);
        }
      }

      // Overlap with custom signature if available
      if (signatureUrl) {
        const sigBase64 = await getBase64FromUrl(signatureUrl);
        if (sigBase64) {
          doc.addImage(sigBase64, "PNG", sigX, currentY + 2, 38, 11);
        }
      }

      // --- SECTION 9: Bottom Footer Bar ---
      // Fill full width bottom background
      doc.setFillColor(15, 23, 42); // Navy
      doc.rect(0, 278, 210, 19, "F");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      
      doc.text("BetterDose Ltd.", 14, 285);
      doc.text("Registered in the United Kingdom", 55, 285);
      doc.text("Email: contact@betterdose.dev", 108, 285);
      doc.text("Website: https://www.betterdose.dev", 154, 285);

      doc.setTextColor(100, 116, 139);
      doc.setFontSize(7);
      doc.text("© 2026 BetterDose Ltd. All rights reserved.", 105, 292, { align: "center" });

      // Output Blob
      const pdfBlob = doc.output("blob");

      // 2. Upload to Supabase Storage
      const formData = new FormData();
      formData.append("file", new File([pdfBlob], `${invoiceNumber}.pdf`, { type: "application/pdf" }));
      formData.append("bucket", "documents");
      
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "x-admin-token": token },
        body: formData
      });
      
        if (!uploadRes.ok) throw new Error("Failed to upload PDF");
        const uploadData = await uploadRes.json();
        finalFileUrl = uploadData.url;
      }
      
      // 3. Save to Database
      const payload = {
        invoice_number: invoiceNumber,
        client_name: clientName,
          client_email: clientEmail,
          company,
          country,
          phone,
          project_reference: projectRef,
          purchase_order: purchaseOrder,
          currency,
          payment_method: paymentMethod,
          issue_date: issueDate,
          due_date: dueDate,
          payment_status: paymentStatus,
          items,
          milestones,
          payment_history: paymentHistory,
          deliverables,
          subtotal,
          discount: discountAmount,
          tax: taxAmount,
          amount_paid: amountPaid,
          remaining_balance: remainingBalance,
          total_due: totalDue,
          notes,
          signature_url: signatureUrl,
          stamp_url: stampUrl,
          verification_code: finalVerificationCode,
          file_url: finalFileUrl
      };

      const saveRes = await fetch("/api/invoices", {
        method: editingId ? "PATCH" : "POST",
        headers: { "x-admin-token": token, "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { id: editingId, ...payload } : payload)
      });
      
      if (!saveRes.ok) throw new Error("Failed to save invoice record");
      
      setShowForm(false);
      resetForm();
      load();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      alert("Error generating invoice. Check console.");
    } finally {
      setGenerating(false);
    }
  };

  const editInvoice = (inv: any) => {
    setEditingId(inv.id);
    setInvoiceNumber(inv.invoiceNumber);
    setClientName(inv.clientName);
    setClientEmail(inv.clientEmail || "");
    setCompany(inv.company || "");
    setCountry(inv.country || "");
    setPhone(inv.phone || "");
    setProjectRef(inv.projectReference || "");
    setPurchaseOrder(inv.purchaseOrder || "");
    setCurrency(inv.currency);
    setPaymentMethod(inv.paymentMethod || "Wise Transfer");
    setIssueDate(inv.issueDate.split('T')[0]);
    setDueDate(inv.dueDate.split('T')[0]);
    setPaymentStatus(inv.paymentStatus);
    setNotes(inv.notes || "");
    setSignatureUrl(inv.signatureUrl || "");
    setStampUrl(inv.stampUrl || "");
    
    const parse = (val: any) => typeof val === "string" ? JSON.parse(val) : (val || []);
    setItems(parse(inv.items));
    setMilestones(parse(inv.milestones));
    setPaymentHistory(parse(inv.paymentHistory));
    setDeliverables(parse(inv.deliverables));
    
    const originalSubtotal = inv.subtotal || 0;
    const discountPer = originalSubtotal ? ((inv.discount || 0) / originalSubtotal) * 100 : 0;
    const taxable = originalSubtotal - (inv.discount || 0);
    const taxPer = taxable ? ((inv.tax || 0) / taxable) * 100 : 0;
    
    setDiscountPercent(Math.round(discountPer));
    setTaxPercent(Math.round(taxPer));
    
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateStatus = async (id: string, status: string) => {
    await apiUpdateInvoice(id, { paymentStatus: status }, token);
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, paymentStatus: status } : inv));
  };

  const deleteInvoice = async (id: string) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;
    await apiDeleteInvoice(id, token);
    setInvoices(prev => prev.filter(inv => inv.id !== id));
  };

  if (loading) return <p className="text-sm text-[#556080]">Loading invoices...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-sm font-semibold text-[#e8eaf2]">Invoices V2</h2>
          <p className="text-[10px] text-[#556080] mt-0.5">Stripe-style professional billings with QR online verification</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); resetForm(); }} className="btn btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5">
          {showForm ? <><X size={12} /> Cancel</> : <><Plus size={12} /> New Invoice</>}
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-8 border border-[#4f8ef7]/30 bg-[#0f1117]/50 max-h-[85vh] overflow-y-auto">
          <h3 className="text-sm font-bold text-[#e8eaf2] mb-6">Create Enterprise Invoice V2</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Header meta */}
            <div><label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Invoice Number</label><input type="text" className="input w-full" value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} /></div>
            <div><label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Project Reference</label><input type="text" className="input w-full" value={projectRef} onChange={e => setProjectRef(e.target.value)} /></div>
            <div><label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Purchase Order (Optional)</label><input type="text" className="input w-full" value={purchaseOrder} onChange={e => setPurchaseOrder(e.target.value)} /></div>
            
            {/* Client Card */}
            <div><label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Client Name</label><input type="text" className="input w-full" value={clientName} onChange={e => setClientName(e.target.value)} /></div>
            <div><label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Client Email</label><input type="email" className="input w-full" value={clientEmail} onChange={e => setClientEmail(e.target.value)} /></div>
            <div><label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Company</label><input type="text" className="input w-full" value={company} onChange={e => setCompany(e.target.value)} /></div>
            <div><label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Country</label><input type="text" className="input w-full" value={country} onChange={e => setCountry(e.target.value)} /></div>
            <div><label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Phone (Optional)</label><input type="text" className="input w-full" value={phone} onChange={e => setPhone(e.target.value)} /></div>
            
            {/* Financial Params */}
            <div><label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Currency</label>
              <select className="input w-full" value={currency} onChange={e => setCurrency(e.target.value)}>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
            <div><label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Payment Method</label>
              <select className="input w-full" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                <option value="Multiple Options">Multiple Options (Client Choice)</option>
                <option value="Wise Transfer">Wise Transfer</option>
                <option value="PayPal">PayPal</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
            <div><label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Issue Date</label><input type="date" className="input w-full" value={issueDate} onChange={e => setIssueDate(e.target.value)} /></div>
            <div><label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Due Date</label><input type="date" className="input w-full" value={dueDate} onChange={e => setDueDate(e.target.value)} /></div>
            <div><label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Payment Status</label>
              <select className="input w-full" value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)}>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>

          {/* Project Details */}
          <div className="border-t border-[#252d3d] pt-6 mb-6">
            <h4 className="text-xs font-bold text-[#e8eaf2] uppercase tracking-wider mb-4">Project Information Card</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Project Name</label><input type="text" className="input w-full" value={projectName} onChange={e => setProjectName(e.target.value)} /></div>
              <div><label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Category</label><input type="text" className="input w-full" value={projectCategory} onChange={e => setProjectCategory(e.target.value)} /></div>
              <div><label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Start Date</label><input type="date" className="input w-full" value={projectStartDate} onChange={e => setProjectStartDate(e.target.value)} /></div>
              <div><label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Completion Date</label><input type="date" className="input w-full" value={projectEndDate} onChange={e => setProjectEndDate(e.target.value)} /></div>
              <div><label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Assigned Team</label><input type="text" className="input w-full" value={projectTeam} onChange={e => setProjectTeam(e.target.value)} /></div>
              <div><label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Project Status</label>
                <select className="input w-full" value={projectStatus} onChange={e => setProjectStatus(e.target.value)}>
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Testing">Testing</option>
                </select>
              </div>
            </div>
          </div>

          {/* Line Items Breakdown */}
          <div className="border-t border-[#252d3d] pt-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xs font-bold text-[#e8eaf2] uppercase tracking-wider">Service Breakdown Items</h4>
              <button type="button" onClick={() => setItems([...items, { ...DEFAULT_ITEM }])} className="btn btn-secondary text-[10px] py-1 px-2.5 flex items-center gap-1">
                <Plus size={10} /> Add Item
              </button>
            </div>
            {items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3 items-end">
                <div className="md:col-span-2">
                  <label className="text-[9px] text-[#556080] block mb-1">Description (Supports newlines)</label>
                  <textarea className="input w-full" rows={2} value={item.description} onChange={e => {
                    const newItems = [...items];
                    newItems[idx].description = e.target.value;
                    setItems(newItems);
                  }} />
                </div>
                <div>
                  <label className="text-[9px] text-[#556080] block mb-1">Qty</label>
                  <input type="number" className="input w-full" value={item.quantity} onChange={e => {
                    const newItems = [...items];
                    newItems[idx].quantity = Number(e.target.value);
                    setItems(newItems);
                  }} />
                </div>
                <div>
                  <label className="text-[9px] text-[#556080] block mb-1">Unit Price ({currency})</label>
                  <input type="number" className="input w-full" value={item.unitPrice} onChange={e => {
                    const newItems = [...items];
                    newItems[idx].unitPrice = Number(e.target.value);
                    setItems(newItems);
                  }} />
                </div>
                <div className="flex gap-2 items-center">
                  <div className="flex-1">
                    <label className="text-[9px] text-[#556080] block mb-1">Discount ({currency})</label>
                    <input type="number" className="input w-full" value={item.discount || 0} onChange={e => {
                      const newItems = [...items];
                      newItems[idx].discount = Number(e.target.value);
                      setItems(newItems);
                    }} />
                  </div>
                  {items.length > 1 && (
                    <button type="button" onClick={() => setItems(items.filter((_, i) => i !== idx))} className="btn btn-ghost text-red-400 p-1 mt-5">
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Project Milestones */}
          <div className="border-t border-[#252d3d] pt-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xs font-bold text-[#e8eaf2] uppercase tracking-wider">Project Milestones & Phases</h4>
              <button type="button" onClick={() => setMilestones([...milestones, { ...DEFAULT_MILESTONE }])} className="btn btn-secondary text-[10px] py-1 px-2.5 flex items-center gap-1">
                <Plus size={10} /> Add Milestone
              </button>
            </div>
            {milestones.map((m, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3 items-end">
                <div>
                  <label className="text-[9px] text-[#556080] block mb-1">Milestone</label>
                  <input type="text" className="input w-full" value={m.milestone} onChange={e => {
                    const newM = [...milestones];
                    newM[idx].milestone = e.target.value;
                    setMilestones(newM);
                  }} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[9px] text-[#556080] block mb-1">Description</label>
                  <input type="text" className="input w-full" value={m.description} onChange={e => {
                    const newM = [...milestones];
                    newM[idx].description = e.target.value;
                    setMilestones(newM);
                  }} />
                </div>
                <div>
                  <label className="text-[9px] text-[#556080] block mb-1">Target Date</label>
                  <input type="date" className="input w-full" value={m.completionDate} onChange={e => {
                    const newM = [...milestones];
                    newM[idx].completionDate = e.target.value;
                    setMilestones(newM);
                  }} />
                </div>
                <div className="flex gap-2 items-center">
                  <div className="flex-1">
                    <label className="text-[9px] text-[#556080] block mb-1">Amount</label>
                    <input type="number" className="input w-full" value={m.amount} onChange={e => {
                      const newM = [...milestones];
                      newM[idx].amount = Number(e.target.value);
                      setMilestones(newM);
                    }} />
                  </div>
                  <button type="button" onClick={() => setMilestones(milestones.filter((_, i) => i !== idx))} className="btn btn-ghost text-red-400 p-1 mt-5">
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Deliverables Checklist */}
          <div className="border-t border-[#252d3d] pt-6 mb-6">
            <h4 className="text-xs font-bold text-[#e8eaf2] uppercase tracking-wider mb-3">Included Deliverables</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {DELIVERABLES_LIST.map(d => {
                const checked = deliverables.includes(d);
                return (
                  <label key={d} className="flex items-center gap-2 cursor-pointer text-xs text-[#8b92a9] hover:text-[#e8eaf2] transition-colors">
                    <input type="checkbox" checked={checked} onChange={() => {
                      if (checked) setDeliverables(deliverables.filter(item => item !== d));
                      else setDeliverables([...deliverables, d]);
                    }} className="rounded border-[#252d3d] bg-transparent text-[#4f8ef7] focus:ring-0" />
                    {d}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Payment History */}
          <div className="border-t border-[#252d3d] pt-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xs font-bold text-[#e8eaf2] uppercase tracking-wider">Payment / Receipts History</h4>
              <button type="button" onClick={() => setPaymentHistory([...paymentHistory, { ...DEFAULT_PAYMENT }])} className="btn btn-secondary text-[10px] py-1 px-2.5 flex items-center gap-1">
                <Plus size={10} /> Add Receipt
              </button>
            </div>
            {paymentHistory.map((p, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3 items-end">
                <div>
                  <label className="text-[9px] text-[#556080] block mb-1">Receipt Date</label>
                  <input type="date" className="input w-full" value={p.date} onChange={e => {
                    const newP = [...paymentHistory];
                    newP[idx].date = e.target.value;
                    setPaymentHistory(newP);
                  }} />
                </div>
                <div>
                  <label className="text-[9px] text-[#556080] block mb-1">Method</label>
                  <select className="input w-full" value={p.method} onChange={e => {
                    const newP = [...paymentHistory];
                    newP[idx].method = e.target.value;
                    setPaymentHistory(newP);
                  }}>
                    <option value="Wise Transfer">Wise Transfer</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] text-[#556080] block mb-1">Reference</label>
                  <input type="text" className="input w-full" placeholder="e.g. Phase 1 Deposit" value={p.reference} onChange={e => {
                    const newP = [...paymentHistory];
                    newP[idx].reference = e.target.value;
                    setPaymentHistory(newP);
                  }} />
                </div>
                <div>
                  <label className="text-[9px] text-[#556080] block mb-1">Amount</label>
                  <input type="number" className="input w-full" value={p.amount} onChange={e => {
                    const newP = [...paymentHistory];
                    newP[idx].amount = Number(e.target.value);
                    setPaymentHistory(newP);
                  }} />
                </div>
                <div className="flex gap-2 items-center">
                  <div className="flex-1">
                    <label className="text-[9px] text-[#556080] block mb-1">Status</label>
                    <select className="input w-full" value={p.status} onChange={e => {
                      const newP = [...paymentHistory];
                      newP[idx].status = e.target.value;
                      setPaymentHistory(newP);
                    }}>
                      <option value="Received">Received</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                  <button type="button" onClick={() => setPaymentHistory(paymentHistory.filter((_, i) => i !== idx))} className="btn btn-ghost text-red-400 p-1 mt-5">
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Tax, Discounts & Signatures */}
          <div className="border-t border-[#252d3d] pt-6 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Global Discount (%)</label>
              <input type="number" className="input w-full" value={discountPercent} onChange={e => setDiscountPercent(Number(e.target.value))} />
            </div>
            <div>
              <label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Global Tax / VAT (%)</label>
              <input type="number" className="input w-full" value={taxPercent} onChange={e => setTaxPercent(Number(e.target.value))} />
            </div>
            <div>
              <label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Authorized Signature</label>
              <label className="btn btn-secondary w-full text-xs py-2 px-3 flex items-center justify-center gap-1.5 cursor-pointer">
                <Upload size={12} /> {uploadingSig ? "Uploading..." : signatureUrl ? "Signature Loaded" : "Upload Sig PNG"}
                <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={e => handleFileUpload(e, "sig")} />
              </label>
            </div>
            <div>
              <label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Company Seal Stamp</label>
              <label className="btn btn-secondary w-full text-xs py-2 px-3 flex items-center justify-center gap-1.5 cursor-pointer">
                <Upload size={12} /> {uploadingStamp ? "Uploading..." : stampUrl ? "Stamp Loaded" : "Upload Stamp PNG"}
                <input type="file" accept="image/png" className="hidden" onChange={e => handleFileUpload(e, "stamp")} />
              </label>
            </div>
          </div>

          <div className="border-t border-[#252d3d] pt-6 mb-6">
            <label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Notes / Terms</label>
            <textarea className="input w-full" rows={3} value={notes} onChange={e => setNotes(e.target.value)} />
          </div>

          {/* Calculations Summary Box */}
          <div className="bg-[#161a24] p-4 rounded-lg flex flex-col md:flex-row justify-between gap-4 mb-6 border border-[#252d3d] text-xs">
            <div>
              <p className="text-[#556080]">Subtotal: <span className="text-[#e8eaf2] font-semibold">{subtotal.toLocaleString()} {currency}</span></p>
              <p className="text-[#556080]">Discount: <span className="text-red-400 font-semibold">-{discountAmount.toLocaleString()} {currency} ({discountPercent}%)</span></p>
              <p className="text-[#556080]">Tax Amount: <span className="text-[#e8eaf2] font-semibold">+{taxAmount.toLocaleString()} {currency} ({taxPercent}%)</span></p>
            </div>
            <div className="text-right">
              <p className="text-sm text-[#8b92a9] font-bold">INVOICE TOTAL: <span className="text-green-400">{totalDue.toLocaleString()} {currency}</span></p>
              <p className="text-[#556080] mt-1">Amount Paid: <span className="text-[#e8eaf2] font-semibold">-{amountPaid.toLocaleString()} {currency}</span></p>
              <p className="text-sm text-red-400 font-bold">AMOUNT DUE: {remainingBalance.toLocaleString()} {currency}</p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="btn btn-secondary px-5 py-2">Close</button>
            <button onClick={() => handleSave(false)} disabled={generating || !clientName || items.length === 0} className="btn btn-secondary px-6 py-2 border border-[#3b4256]">
              {generating ? "Saving..." : "Save Invoice Only"}
            </button>
            <button onClick={() => handleSave(true)} disabled={generating || !clientName || items.length === 0} className="btn btn-primary px-6 py-2">
              {generating ? "Generating & Saving..." : "Generate V2 PDF & Save"}
            </button>
          </div>
        </div>
      )}

      {invoices.length === 0 ? (
        <div className="text-center py-12 text-[#556080]">
          <FileText size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No invoices generated yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#252d3d] text-[#8b92a9]">
                <th className="pb-3 font-medium">Invoice</th>
                <th className="pb-3 font-medium">Client</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Remaining</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id} className="border-b border-[#1a2030] hover:bg-[#0f1117] transition-colors">
                  <td className="py-3 font-mono font-bold text-[#e8eaf2]">
                    {inv.invoiceNumber}
                    <div className="text-[9px] text-[#556080] font-mono">{inv.verificationCode}</div>
                  </td>
                  <td className="py-3 text-[#8b92a9]">{inv.clientName} <br/><span className="text-[9px] text-[#556080]">{inv.company}</span></td>
                  <td className="py-3 text-[#e8eaf2] font-semibold">{Number(inv.totalDue).toLocaleString()} {inv.currency}</td>
                  <td className="py-3 text-red-400 font-semibold">{Number(inv.remainingBalance).toLocaleString()} {inv.currency}</td>
                  <td className="py-3 text-[#556080]">{new Date(inv.issueDate).toLocaleDateString()}</td>
                  <td className="py-3">
                    <select 
                      className={`bg-transparent border rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider outline-none ${
                        inv.paymentStatus === 'Paid' ? 'text-green-400 border-green-500/30' : 
                        inv.paymentStatus === 'Overdue' ? 'text-red-400 border-red-500/30' : 
                        'text-yellow-400 border-yellow-500/30'
                      }`}
                      value={inv.paymentStatus}
                      onChange={e => updateStatus(inv.id, e.target.value)}
                    >
                      <option value="Pending" className="bg-[#0f1117] text-[#e8eaf2]">Pending</option>
                      <option value="Paid" className="bg-[#0f1117] text-[#e8eaf2]">Paid</option>
                      <option value="Overdue" className="bg-[#0f1117] text-[#e8eaf2]">Overdue</option>
                      <option value="Cancelled" className="bg-[#0f1117] text-[#e8eaf2]">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <a href={`/pdffx/${inv.verificationCode}`} className="btn btn-ghost p-1.5 text-green-400 hover:bg-green-400/10" title="Verify Online">
                        <Eye size={14} />
                      </a>
                      <a href={inv.fileUrl} target="_blank" rel="noreferrer" className="btn btn-ghost p-1.5 text-[#4f8ef7] hover:bg-[#4f8ef7]/10" title="Download PDF">
                        <Download size={14} />
                      </a>
                      <button onClick={() => editInvoice(inv)} className="btn btn-ghost p-1.5 text-orange-400 hover:bg-orange-400/10" title="Edit">
                        {/* We need to use Edit or Pencil icon. Let's make sure it's imported. If not, use some inline SVG or imported icon. Let's just assume we can import Edit if it's there. Alternatively we can just use text. Wait! There's no Edit icon imported yet. Let's use FileText instead of edit, or add Edit import. */}
                        <FileText size={14} />
                      </button>
                      <button onClick={() => deleteInvoice(inv.id)} className="btn btn-ghost p-1.5 text-red-400 hover:bg-red-400/10" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
