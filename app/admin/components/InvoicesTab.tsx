"use client";
import { useState, useEffect, useCallback } from "react";
import { Invoice, fetchInvoices, apiUpdateInvoice, apiDeleteInvoice } from "@/lib/db";
import { Trash2, FileText, Plus, X, Download, CreditCard, RefreshCw } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Props { token: string; onRefresh?: () => void; }

const DEFAULT_INVOICE = {
  clientName: "",
  clientEmail: "",
  company: "",
  project: "",
  service: "",
  amount: 0,
  currency: "USD",
  issueDate: new Date().toISOString().split("T")[0],
  dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  notes: ""
};

export default function InvoicesTab({ token, onRefresh }: Props) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(DEFAULT_INVOICE);
  const [generating, setGenerating] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100).padStart(3, "0")}`);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await fetchInvoices(token);
    setInvoices(data);
    setLoading(false);
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const generateAndUploadPDF = async () => {
    setGenerating(true);
    try {
      // 1. Generate PDF
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(22);
      doc.setTextColor(30, 64, 175);
      doc.text("BETTERDOSE", 14, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("hello@betterdose.dev", 14, 28);
      doc.text("https://www.betterdose.dev", 14, 34);
      
      // INVOICE Title
      doc.setFontSize(26);
      doc.setTextColor(0, 0, 0);
      doc.text("INVOICE", 150, 25);
      
      // Invoice Details
      doc.setFontSize(10);
      doc.text(`Invoice Number:`, 150, 35);
      doc.text(invoiceNumber, 150, 40);
      doc.text(`Issue Date: ${form.issueDate}`, 150, 50);
      doc.text(`Due Date: ${form.dueDate}`, 150, 56);
      
      // Billed To
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("Billed To:", 14, 50);
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      doc.text(form.clientName, 14, 58);
      if (form.company) doc.text(form.company, 14, 64);
      if (form.clientEmail) doc.text(form.clientEmail, 14, form.company ? 70 : 64);
      
      // Table
      autoTable(doc, {
        startY: 85,
        head: [['Service / Description', 'Project', 'Amount']],
        body: [
          [form.service, form.project || "N/A", `${form.amount.toLocaleString()} ${form.currency}`]
        ],
        theme: 'striped',
        headStyles: { fillColor: [30, 64, 175] }
      });
      
      const finalY = (doc as any).lastAutoTable.finalY || 100;
      
      // Total
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(`Total Due: ${form.amount.toLocaleString()} ${form.currency}`, 140, finalY + 15);
      
      // Notes
      if (form.notes) {
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text("Notes:", 14, finalY + 15);
        doc.text(form.notes, 14, finalY + 22, { maxWidth: 100 });
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
          client_name: form.clientName,
          client_email: form.clientEmail,
          company: form.company,
          project: form.project,
          service: form.service,
          amount: Number(form.amount),
          currency: form.currency,
          issue_date: form.issueDate,
          due_date: form.dueDate,
          notes: form.notes,
          file_url: uploadData.url,
          payment_status: "Pending"
        })
      });
      
      if (!saveRes.ok) throw new Error("Failed to save invoice record");
      
      // Success
      setShowForm(false);
      setForm(DEFAULT_INVOICE);
      setInvoiceNumber(`INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100).padStart(3, "0")}`);
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
          <h2 className="text-sm font-semibold text-[#e8eaf2]">Invoices</h2>
          <p className="text-[10px] text-[#556080] mt-0.5">Manage billing and automatically generate PDFs</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5">
          {showForm ? <><X size={12} /> Cancel</> : <><Plus size={12} /> New Invoice</>}
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-8 border border-[#4f8ef7]/30 bg-[#0f1117]/50">
          <h3 className="text-sm font-bold text-[#e8eaf2] mb-4">Create New Invoice</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div><label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Invoice Number</label><input type="text" className="input w-full" value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} /></div>
            <div><label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Client Name</label><input type="text" className="input w-full" value={form.clientName} onChange={e => setForm({...form, clientName: e.target.value})} /></div>
            <div><label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Client Email</label><input type="email" className="input w-full" value={form.clientEmail} onChange={e => setForm({...form, clientEmail: e.target.value})} /></div>
            <div><label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Company (Optional)</label><input type="text" className="input w-full" value={form.company} onChange={e => setForm({...form, company: e.target.value})} /></div>
            <div><label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Project Reference</label><input type="text" className="input w-full" value={form.project} onChange={e => setForm({...form, project: e.target.value})} /></div>
            <div><label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Service Description</label><input type="text" className="input w-full" value={form.service} onChange={e => setForm({...form, service: e.target.value})} /></div>
            <div>
              <label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Amount</label>
              <div className="flex gap-2">
                <input type="number" className="input flex-1" value={form.amount} onChange={e => setForm({...form, amount: Number(e.target.value)})} />
                <select className="input w-24" value={form.currency} onChange={e => setForm({...form, currency: e.target.value})}>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Dates</label>
              <div className="flex gap-2">
                <input type="date" className="input flex-1" value={form.issueDate} onChange={e => setForm({...form, issueDate: e.target.value})} title="Issue Date" />
                <input type="date" className="input flex-1" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} title="Due Date" />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Payment Instructions / Notes</label>
              <textarea className="input w-full" rows={2} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Wire details, thank you note, etc." />
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={generateAndUploadPDF} disabled={generating || !form.clientName || !form.amount} className="btn btn-primary px-6 py-2">
              {generating ? "Generating..." : "Generate PDF & Save"}
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
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id} className="border-b border-[#1a2030] hover:bg-[#0f1117] transition-colors">
                  <td className="py-3 font-mono font-bold text-[#e8eaf2]">{inv.invoiceNumber}</td>
                  <td className="py-3 text-[#8b92a9]">{inv.clientName} <br/><span className="text-[9px] text-[#556080]">{inv.company}</span></td>
                  <td className="py-3 text-[#e8eaf2] font-semibold">{Number(inv.amount).toLocaleString()} {inv.currency}</td>
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
