"use client";
import { useState, useEffect, useCallback } from "react";
import { Invoice, fetchInvoices, apiUpdateInvoice, apiDeleteInvoice, InvoiceItem, InvoiceMilestone, PaymentHistoryEntry } from "@/lib/db";
import { Trash2, FileText, Plus, X, Download, RefreshCw, Upload, Eye, Check } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Props { token: string; onRefresh?: () => void; }

const DELIVERABLES_LIST = [
  "Source Code",
  "Documentation",
  "Database Setup",
  "Deployment Config",
  "Bug Fixes",
  "Testing Report",
  "API Documentation",
  "Support Agreement"
];

const DEFAULT_ITEM: InvoiceItem = { description: "", quantity: 1, unitPrice: 0, discount: 0, total: 0 };
const DEFAULT_MILESTONE: InvoiceMilestone = { milestone: "", description: "", completionDate: "", amount: 0, status: "Pending" };
const DEFAULT_PAYMENT: PaymentHistoryEntry = { date: "", method: "Wise", reference: "", amount: 0, status: "Received" };

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
  const [paymentMethod, setPaymentMethod] = useState("Wise");
  const [issueDate, setIssueDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("Pending");
  const [notes, setNotes] = useState("Thank you for choosing BetterDose. This invoice represents completed software development services.");
  const [taxPercent, setTaxPercent] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  
  // Custom URLs
  const [signatureUrl, setSignatureUrl] = useState("");
  const [stampUrl, setStampUrl] = useState("");

  // Lists
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: "UI Development", quantity: 1, unitPrice: 1500, discount: 0, total: 1500 },
    { description: "Backend API Integration", quantity: 1, unitPrice: 2000, discount: 0, total: 2000 }
  ]);
  const [milestones, setMilestones] = useState<InvoiceMilestone[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryEntry[]>([]);
  const [deliverables, setDeliverables] = useState<string[]>(["Source Code", "Documentation", "Deployment Config"]);

  const resetForm = useCallback(() => {
    const yr = new Date().getFullYear();
    const rand = String(Math.floor(Math.random() * 90000) + 10000);
    setInvoiceNumber(`INV-${yr}-${rand}`);
    setClientName("");
    setClientEmail("");
    setCompany("");
    setCountry("");
    setPhone("");
    setProjectRef(`BD-${yr}-${String(Math.floor(Math.random() * 800) + 100)}`);
    setPurchaseOrder("");
    setCurrency("USD");
    setPaymentMethod("Wise");
    setIssueDate(new Date().toISOString().split("T")[0]);
    setDueDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
    setPaymentStatus("Pending");
    setNotes("Thank you for choosing BetterDose. This invoice represents completed software development services. Support requests can be sent to contact@betterdose.dev.");
    setItems([{ description: "Software Development Phase 1", quantity: 1, unitPrice: 3500, discount: 0, total: 3500 }]);
    setMilestones([]);
    setPaymentHistory([]);
    setDeliverables(["Source Code", "Documentation", "Deployment Config"]);
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

  const generatePDF = async () => {
    setGenerating(true);
    try {
      // 1. Generate Verification Code
      const codeChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const randomCode = "PDFFX-" + Array.from({ length: 10 }, () => codeChars[Math.floor(Math.random() * codeChars.length)]).join("");
      const verificationUrl = `https://www.betterdose.dev/pdffx/${randomCode}`;

      const doc = new jsPDF();
      
      // BetterDose Accent Colors
      const primaryColor = [30, 64, 175]; // Blue
      const grayColor = [100, 100, 100];
      const darkColor = [30, 41, 59];

      // --- SECTION 1: Company Header ---
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(14, 15, 6, 22, "F"); // Visual blue accent bar next to logo

      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text("BETTERDOSE", 24, 23);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
      doc.text("BetterDose Ltd.", 24, 29);
      doc.text("https://betterdose.dev | contact@betterdose.dev", 24, 34);

      // Registered in UK
      doc.setFontSize(8);
      doc.text("Registered in the United Kingdom", 24, 39);
      doc.text("Operating Team: Addis Ababa, Ethiopia", 24, 44);

      // LARGE INVOICE TITLE
      doc.setFontSize(28);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text("INVOICE", 140, 26);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text(`Invoice ID: ${invoiceNumber}`, 140, 34);

      // Horizontal Line Divider
      doc.setDrawColor(226, 232, 240);
      doc.line(14, 50, 196, 50);

      // --- SECTION 2: Invoice & Client Info ---
      // Left Column: Billed To
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text("BILLED TO:", 14, 60);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.setFontSize(11);
      doc.text(clientName, 14, 66);
      doc.setFontSize(9);
      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
      if (company) doc.text(company, 14, 71);
      doc.text(clientEmail, 14, company ? 76 : 71);
      if (country || phone) {
        doc.text(`${country || ""} ${phone ? `| ${phone}` : ""}`, 14, company ? 81 : 76);
      }

      // Right Column: Invoice Metadata
      const metaY = 60;
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text("Invoice Date:", 115, metaY);
      doc.setFont("helvetica", "normal");
      doc.text(issueDate, 150, metaY);

      doc.setFont("helvetica", "bold");
      doc.text("Due Date:", 115, metaY + 6);
      doc.setFont("helvetica", "normal");
      doc.text(dueDate, 150, metaY + 6);

      doc.setFont("helvetica", "bold");
      doc.text("Payment Method:", 115, metaY + 12);
      doc.setFont("helvetica", "normal");
      doc.text(paymentMethod, 150, metaY + 12);

      if (projectRef) {
        doc.setFont("helvetica", "bold");
        doc.text("Project Ref:", 115, metaY + 18);
        doc.setFont("helvetica", "normal");
        doc.text(projectRef, 150, metaY + 18);
      }

      if (purchaseOrder) {
        doc.setFont("helvetica", "bold");
        doc.text("Purchase Order:", 115, metaY + 24);
        doc.setFont("helvetica", "normal");
        doc.text(purchaseOrder, 150, metaY + 24);
      }

      // Status Badge
      doc.setFillColor(paymentStatus === "Paid" ? 220 : 254, paymentStatus === "Paid" ? 252 : 243, paymentStatus === "Paid" ? 231 : 199);
      doc.rect(115, metaY + 28, 79, 7, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(paymentStatus === "Paid" ? 22 : 180, paymentStatus === "Paid" ? 101 : 83, paymentStatus === "Paid" ? 52 : 9);
      doc.text(`STATUS: ${paymentStatus.toUpperCase()}`, 120, metaY + 33);

      // --- SECTION 3: Service Breakdown Table ---
      const tableBody = items.map(it => [
        it.description,
        it.quantity.toString(),
        `${it.unitPrice.toLocaleString()} ${currency}`,
        it.discount ? `-${it.discount.toLocaleString()} ${currency}` : "-",
        `${((it.quantity * it.unitPrice) - (it.discount || 0)).toLocaleString()} ${currency}`
      ]);

      autoTable(doc, {
        startY: 105,
        head: [['Line Items / Services', 'Qty', 'Unit Price', 'Discount', 'Total']],
        body: tableBody,
        theme: 'striped',
        headStyles: { fillColor: primaryColor as [number, number, number], fontSize: 9, fontStyle: 'bold' },
        bodyStyles: { fontSize: 8, textColor: darkColor as [number, number, number] },
        columnStyles: {
          0: { cellWidth: 80 },
          1: { cellWidth: 15, halign: 'center' },
          2: { cellWidth: 30, halign: 'right' },
          3: { cellWidth: 25, halign: 'right' },
          4: { cellWidth: 32, halign: 'right' }
        }
      });

      let currentY = (doc as any).lastAutoTable.finalY + 10;

      // --- SECTION 4: Milestones ---
      if (milestones.length > 0) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text("PROJECT MILESTONES & PHASES", 14, currentY);
        
        const milestoneBody = milestones.map(m => [
          m.milestone,
          m.description || "N/A",
          m.completionDate || "N/A",
          `${Number(m.amount).toLocaleString()} ${currency}`,
          m.status
        ]);

        autoTable(doc, {
          startY: currentY + 3,
          head: [['Milestone', 'Description', 'Target Date', 'Amount', 'Status']],
          body: milestoneBody,
          theme: 'grid',
          headStyles: { fillColor: [71, 85, 105], fontSize: 8 },
          bodyStyles: { fontSize: 8 }
        });
        currentY = (doc as any).lastAutoTable.finalY + 10;
      }

      // --- SECTION 5: Deliverables Checklist ---
      if (deliverables.length > 0 && currentY < 230) {
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text("DELIVERABLES INCLUDED", 14, currentY);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);

        const checklistCols = 2;
        deliverables.forEach((item, idx) => {
          const col = idx % checklistCols;
          const row = Math.floor(idx / checklistCols);
          const xPos = 14 + col * 90;
          const yPos = currentY + 5 + row * 5;
          doc.text(`[X]  ${item}`, xPos, yPos);
        });

        currentY += Math.ceil(deliverables.length / checklistCols) * 5 + 10;
      }

      // Ensure space for totals and verification footer
      if (currentY > 210) {
        doc.addPage();
        currentY = 20;
      }

      // --- SECTION 6: Payment Summary & Notes ---
      const summaryY = currentY;
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text("PAYMENT SUMMARY", 120, summaryY);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.setFontSize(8);

      const totals = [
        ["Subtotal:", `${subtotal.toLocaleString()} ${currency}`],
        ["Discount:", `-${discountAmount.toLocaleString()} ${currency}`],
        ["Tax Amount:", `${taxAmount.toLocaleString()} ${currency}`],
        ["Amount Paid:", `-${amountPaid.toLocaleString()} ${currency}`],
        ["TOTAL DUE:", `${totalDue.toLocaleString()} ${currency}`],
        ["REMAINING BALANCE:", `${remainingBalance.toLocaleString()} ${currency}`]
      ];

      totals.forEach((t, i) => {
        const isTotal = t[0].includes("TOTAL") || t[0].includes("BALANCE");
        doc.setFont("helvetica", isTotal ? "bold" : "normal");
        if (isTotal) doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        else doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);

        doc.text(t[0], 120, summaryY + 6 + i * 5);
        doc.text(t[1], 196, summaryY + 6 + i * 5, { align: "right" });
      });

      // Left Column: Notes & Thank you
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text("NOTES & INSTRUCTIONS", 14, summaryY);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
      doc.setFontSize(8);
      doc.text(notes, 14, summaryY + 6, { maxWidth: 95 });

      // --- SECTION 7: QR Code Verification (Bottom Left) ---
      const qrY = 240;
      const qrApiUrl = `https://chart.googleapis.com/chart?cht=qr&chs=150x150&chl=${encodeURIComponent(verificationUrl)}`;
      const qrBase64 = await getBase64FromUrl(qrApiUrl);

      if (qrBase64) {
        doc.addImage(qrBase64, "PNG", 14, qrY, 20, 20);
      }
      doc.setFontSize(7);
      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
      doc.setFont("helvetica", "bold");
      doc.text("Verify this invoice online", 38, qrY + 4);
      doc.setFont("helvetica", "normal");
      doc.text("Scan the QR code or visit", 38, qrY + 8);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(`betterdose.dev/pdffx/${randomCode}`, 38, qrY + 12);

      // --- SECTION 8: Signatures & Stamp (Bottom Right) ---
      const sigX = 135;
      const sigY = 240;
      
      // Line for signature
      doc.setDrawColor(200, 200, 200);
      doc.line(sigX, sigY + 10, sigX + 55, sigY + 10);
      
      doc.setFontSize(8);
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.setFont("helvetica", "bold");
      doc.text("Nebiyu Muluadam", sigX, sigY + 14);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
      doc.text("Founder & Lead Software Engineer", sigX, sigY + 18);
      doc.text("BetterDose Ltd.", sigX, sigY + 21);

      // If user uploaded custom signature image
      if (signatureUrl) {
        const sigBase64 = await getBase64FromUrl(signatureUrl);
        if (sigBase64) {
          doc.addImage(sigBase64, "PNG", sigX + 5, sigY - 10, 45, 18);
        }
      }

      // If user uploaded company stamp
      if (stampUrl) {
        const stampBase64 = await getBase64FromUrl(stampUrl);
        if (stampBase64) {
          doc.addImage(stampBase64, "PNG", sigX - 35, sigY - 12, 28, 28);
        }
      }

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
      
      // 3. Save to Database
      const saveRes = await fetch("/api/invoices", {
        method: "POST",
        headers: { "x-admin-token": token, "Content-Type": "application/json" },
        body: JSON.stringify({
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
          verification_code: randomCode,
          file_url: uploadData.url
        })
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
                <option value="Wise">Wise</option>
                <option value="PayPal">PayPal</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
            <div><label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Issue Date</label><input type="date" className="input w-full" value={issueDate} onChange={e => setIssueDate(e.target.value)} /></div>
            <div><label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Due Date</label><input type="date" className="input w-full" value={dueDate} onChange={e => setDueDate(e.target.value)} /></div>
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
                  <label className="text-[9px] text-[#556080] block mb-1">Description</label>
                  <input type="text" className="input w-full" value={item.description} onChange={e => {
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
                    <option value="Wise">Wise</option>
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
              <p className="text-sm text-[#8b92a9] font-bold">TOTAL DUE: <span className="text-green-400">{totalDue.toLocaleString()} {currency}</span></p>
              <p className="text-[#556080] mt-1">Amount Paid: <span className="text-[#e8eaf2] font-semibold">-{amountPaid.toLocaleString()} {currency}</span></p>
              <p className="text-sm text-red-400 font-bold">REMAINING BALANCE: {remainingBalance.toLocaleString()} {currency}</p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="btn btn-secondary px-5 py-2">Close</button>
            <button onClick={generatePDF} disabled={generating || !clientName || items.length === 0} className="btn btn-primary px-6 py-2">
              {generating ? "Compiling PDF & Uploading..." : "Generate V2 PDF & Save"}
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
