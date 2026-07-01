"use client";
import { useState, useEffect, useCallback } from "react";
import { Contract, fetchContracts, apiUpdateContract, apiDeleteContract } from "@/lib/db";
import { Trash2, FileSignature, Plus, X, Download, ShieldCheck, RefreshCw } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Props { token: string; onRefresh?: () => void; }

const DEFAULT_CONTRACT = {
  clientName: "",
  clientEmail: "",
  company: "",
  project: "",
  issueDate: new Date().toISOString().split("T")[0],
  notes: ""
};

export default function ContractsTab({ token, onRefresh }: Props) {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(DEFAULT_CONTRACT);
  const [generating, setGenerating] = useState(false);
  const [contractNumber, setContractNumber] = useState(`CTR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100).padStart(3, "0")}`);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await fetchContracts(token);
    setContracts(data);
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
      
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.text("(formerly Heducate)", 65, 19);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("hello@betterdose.dev", 14, 28);
      doc.text("https://www.betterdose.dev", 14, 34);
      
      // Title
      doc.setFontSize(22);
      doc.setTextColor(0, 0, 0);
      doc.text("MASTER SERVICE AGREEMENT", 14, 50);
      
      // Document Details
      doc.setFontSize(10);
      doc.text(`Contract Number: ${contractNumber}`, 14, 60);
      doc.text(`Date of Agreement: ${form.issueDate}`, 14, 66);
      
      // Parties
      doc.setFontSize(12);
      doc.text("Between:", 14, 80);
      
      doc.setFontSize(10);
      doc.text("BETTERDOSE (hereinafter referred to as 'Service Provider')", 14, 88);
      doc.text("AND", 14, 96);
      doc.text(`${form.clientName} ${form.company ? `(${form.company})` : ""}`, 14, 104);
      doc.text("(hereinafter referred to as 'Client')", 14, 110);
      
      // Terms Placeholder
      doc.setFontSize(12);
      doc.text("1. Scope of Services", 14, 130);
      doc.setFontSize(10);
      doc.text(`The Service Provider agrees to deliver services related to: ${form.project || "Digital Services"}`, 14, 138, { maxWidth: 180 });
      doc.text(`Additional notes: ${form.notes || "As agreed in the initial proposal."}`, 14, 148, { maxWidth: 180 });
      
      doc.setFontSize(12);
      doc.text("2. Confidentiality", 14, 165);
      doc.setFontSize(10);
      doc.text("Both parties agree to keep all proprietary information confidential and will not disclose it to third parties without prior written consent.", 14, 173, { maxWidth: 180 });

      doc.setFontSize(12);
      doc.text("3. Governing Law", 14, 190);
      doc.setFontSize(10);
      doc.text("This Agreement shall be governed by and construed in accordance with the standard commercial laws applicable to the Service Provider's jurisdiction.", 14, 198, { maxWidth: 180 });

      // Signatures
      doc.setFontSize(12);
      doc.text("Signatures", 14, 230);
      
      doc.setDrawColor(150, 150, 150);
      doc.line(14, 250, 80, 250);
      doc.text("Service Provider", 14, 256);
      
      doc.line(110, 250, 180, 250);
      doc.text("Client", 110, 256);

      // Output Blob
      const pdfBlob = doc.output("blob");

      // 2. Upload to Supabase Storage
      const formData = new FormData();
      formData.append("file", new File([pdfBlob], `${contractNumber}.pdf`, { type: "application/pdf" }));
      formData.append("bucket", "documents");
      
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "x-admin-token": token },
        body: formData
      });
      
      if (!uploadRes.ok) throw new Error("Failed to upload PDF");
      const uploadData = await uploadRes.json();
      
      // 3. Save to Database
      const saveRes = await fetch("/api/contracts", {
        method: "POST",
        headers: { "x-admin-token": token, "Content-Type": "application/json" },
        body: JSON.stringify({
          contract_number: contractNumber,
          client_name: form.clientName,
          client_email: form.clientEmail,
          company: form.company,
          project: form.project,
          issue_date: form.issueDate,
          notes: form.notes,
          file_url: uploadData.url,
          status: "Draft"
        })
      });
      
      if (!saveRes.ok) throw new Error("Failed to save contract record");
      
      // Success
      setShowForm(false);
      setForm(DEFAULT_CONTRACT);
      setContractNumber(`CTR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100).padStart(3, "0")}`);
      load();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      alert("Error generating contract. Check console.");
    } finally {
      setGenerating(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    await apiUpdateContract(id, { status }, token);
    setContracts(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  const deleteContract = async (id: string) => {
    if (!confirm("Are you sure you want to delete this contract?")) return;
    await apiDeleteContract(id, token);
    setContracts(prev => prev.filter(c => c.id !== id));
  };

  if (loading) return <p className="text-sm text-[#556080]">Loading contracts...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-sm font-semibold text-[#e8eaf2]">Contracts</h2>
          <p className="text-[10px] text-[#556080] mt-0.5">Generate and manage MSAs, NDAs, and Service Agreements</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5">
          {showForm ? <><X size={12} /> Cancel</> : <><Plus size={12} /> New Contract</>}
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-8 border border-[#4f8ef7]/30 bg-[#0f1117]/50">
          <h3 className="text-sm font-bold text-[#e8eaf2] mb-4">Draft New Contract</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div><label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Contract Number</label><input type="text" className="input w-full" value={contractNumber} onChange={e => setContractNumber(e.target.value)} /></div>
            <div><label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Client Name</label><input type="text" className="input w-full" value={form.clientName} onChange={e => setForm({...form, clientName: e.target.value})} /></div>
            <div><label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Client Email</label><input type="email" className="input w-full" value={form.clientEmail} onChange={e => setForm({...form, clientEmail: e.target.value})} /></div>
            <div><label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Company (Optional)</label><input type="text" className="input w-full" value={form.company} onChange={e => setForm({...form, company: e.target.value})} /></div>
            <div><label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Project Reference</label><input type="text" className="input w-full" value={form.project} onChange={e => setForm({...form, project: e.target.value})} /></div>
            <div><label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Date of Agreement</label><input type="date" className="input w-full" value={form.issueDate} onChange={e => setForm({...form, issueDate: e.target.value})} /></div>
            <div className="md:col-span-2">
              <label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Custom Clauses / Notes</label>
              <textarea className="input w-full" rows={2} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Specific terms to include in the agreement..." />
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={generateAndUploadPDF} disabled={generating || !form.clientName} className="btn btn-primary px-6 py-2">
              {generating ? "Generating..." : "Generate PDF & Save"}
            </button>
          </div>
        </div>
      )}

      {contracts.length === 0 ? (
        <div className="text-center py-12 text-[#556080]">
          <ShieldCheck size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No contracts drafted yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#252d3d] text-[#8b92a9]">
                <th className="pb-3 font-medium">Contract</th>
                <th className="pb-3 font-medium">Client</th>
                <th className="pb-3 font-medium">Project</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map(c => (
                <tr key={c.id} className="border-b border-[#1a2030] hover:bg-[#0f1117] transition-colors">
                  <td className="py-3 font-mono font-bold text-[#e8eaf2]">{c.contractNumber}</td>
                  <td className="py-3 text-[#8b92a9]">{c.clientName} <br/><span className="text-[9px] text-[#556080]">{c.company}</span></td>
                  <td className="py-3 text-[#e8eaf2] font-semibold">{c.project}</td>
                  <td className="py-3 text-[#556080]">{new Date(c.issueDate).toLocaleDateString()}</td>
                  <td className="py-3">
                    <select 
                      className={`bg-transparent border rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider outline-none ${
                        c.status === 'Signed' ? 'text-green-400 border-green-500/30' : 
                        c.status === 'Sent' ? 'text-blue-400 border-blue-500/30' : 
                        c.status === 'Expired' ? 'text-red-400 border-red-500/30' : 
                        'text-yellow-400 border-yellow-500/30'
                      }`}
                      value={c.status}
                      onChange={e => updateStatus(c.id, e.target.value)}
                    >
                      <option value="Draft" className="bg-[#0f1117] text-[#e8eaf2]">Draft</option>
                      <option value="Sent" className="bg-[#0f1117] text-[#e8eaf2]">Sent</option>
                      <option value="Signed" className="bg-[#0f1117] text-[#e8eaf2]">Signed</option>
                      <option value="Expired" className="bg-[#0f1117] text-[#e8eaf2]">Expired</option>
                    </select>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <a href={c.fileUrl} target="_blank" rel="noreferrer" className="btn btn-ghost p-1.5 text-[#4f8ef7] hover:bg-[#4f8ef7]/10" title="Download PDF">
                        <Download size={14} />
                      </a>
                      <button onClick={() => deleteContract(c.id)} className="btn btn-ghost p-1.5 text-red-400 hover:bg-red-400/10" title="Delete">
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
