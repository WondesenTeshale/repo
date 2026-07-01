"use client";
import { useState, useEffect, useCallback } from "react";
import { Contract, fetchContracts, apiUpdateContract, apiDeleteContract, ContractMilestone, ContractPaymentSchedule } from "@/lib/db";
import { Trash2, FileSignature, Plus, X, Download, RefreshCw, Upload, Eye, Check } from "lucide-react";
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

const DEFAULT_MILESTONE: ContractMilestone = { milestone: "", description: "", completionDate: "", amount: 0, status: "Pending" };
const DEFAULT_PAYMENT_SCHEDULE: ContractPaymentSchedule = { phase: "", amount: 0, dueDate: "", status: "Pending" };

export default function ContractsTab({ token, onRefresh }: Props) {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [uploadingSig, setUploadingSig] = useState(false);
  const [uploadingStamp, setUploadingStamp] = useState(false);

  // Form states
  const [contractNumber, setContractNumber] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [company, setCompany] = useState("");
  const [project, setProject] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [scopeOfWork, setScopeOfWork] = useState("We will design, develop, test and deploy custom software matching client specifications.");
  const [governingLaw, setGoverningLaw] = useState("United Kingdom");
  const [notes, setNotes] = useState("Both parties agree to standard mutual confidentiality clauses and intellectual property transfer on final payment.");
  
  // Custom URLs
  const [signatureUrl, setSignatureUrl] = useState("");
  const [stampUrl, setStampUrl] = useState("");

  // Lists
  const [milestones, setMilestones] = useState<ContractMilestone[]>([]);
  const [deliverables, setDeliverables] = useState<string[]>(["Source Code", "Documentation", "Deployment Config"]);
  const [paymentSchedule, setPaymentSchedule] = useState<ContractPaymentSchedule[]>([]);

  const resetForm = useCallback(() => {
    const yr = new Date().getFullYear();
    const rand = String(Math.floor(Math.random() * 90000) + 10000);
    setContractNumber(`CTR-${yr}-${rand}`);
    setClientName("");
    setClientEmail("");
    setCompany("");
    setProject("");
    setIssueDate(new Date().toISOString().split("T")[0]);
    setScopeOfWork("We will design, develop, test and deploy custom software matching client specifications.");
    setGoverningLaw("United Kingdom");
    setNotes("Both parties agree to standard mutual confidentiality clauses and intellectual property transfer on final payment.");
    setMilestones([]);
    setPaymentSchedule([]);
    setDeliverables(["Source Code", "Documentation", "Deployment Config"]);
    setSignatureUrl("");
    setStampUrl("");
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await fetchContracts(token);
    setContracts(data);
    setLoading(false);
  }, [token]);

  useEffect(() => {
    load();
    resetForm();
  }, [load, resetForm]);

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
      // Generate unique verification code
      const codeChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const randomCode = "PDFFX-" + Array.from({ length: 10 }, () => codeChars[Math.floor(Math.random() * codeChars.length)]).join("");
      const verificationUrl = `https://www.betterdose.dev/pdffx/${randomCode}`;

      const doc = new jsPDF();
      
      // Brand Accent Colors
      const primaryColor = [30, 64, 175]; // Blue
      const grayColor = [100, 100, 100];
      const darkColor = [30, 41, 59];

      // --- SECTION 1: Header & Company Details ---
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(14, 15, 6, 22, "F");

      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text("BETTERDOSE", 24, 23);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
      doc.text("BetterDose Ltd.", 24, 29);
      doc.text("https://betterdose.dev | contact@betterdose.dev", 24, 34);

      doc.setFontSize(8);
      doc.text("Registered in the United Kingdom", 24, 39);
      doc.text("Operating Team: Addis Ababa, Ethiopia", 24, 44);

      // Large Contract ID
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text("AGREEMENT", 130, 26);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text(`Reference: ${contractNumber}`, 130, 34);
      doc.text(`Date: ${issueDate}`, 130, 40);

      doc.setDrawColor(226, 232, 240);
      doc.line(14, 50, 196, 50);

      // --- SECTION 2: Between Parties ---
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text("PARTIES TO THE AGREEMENT:", 14, 60);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.setFontSize(9);
      doc.text("This Master Service Agreement is entered into by and between:", 14, 66);
      
      // BetterDose Info
      doc.setFont("helvetica", "bold");
      doc.text("BetterDose Ltd.", 14, 73);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
      doc.text("Addis Ababa, Ethiopia / London, UK (hereinafter 'Service Provider')", 14, 78);

      // Client Info
      doc.setFont("helvetica", "bold");
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text(`${clientName} ${company ? `(${company})` : ""}`, 14, 85);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
      doc.text(`${clientEmail} (hereinafter 'Client')`, 14, 90);

      // --- SECTION 3: Scope of Work ---
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text("1. SCOPE OF SERVICES", 14, 105);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.setFontSize(9);
      doc.text(`Project reference: ${project || "General Digital Services"}`, 14, 111);
      doc.text(scopeOfWork, 14, 117, { maxWidth: 180 });

      // --- SECTION 4: Milestones ---
      let currentY = 135;
      if (milestones.length > 0) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text("2. PROJECT MILESTONES & PHASES", 14, currentY);

        const milestoneBody = milestones.map(m => [
          m.milestone,
          m.description || "N/A",
          m.completionDate || "N/A",
          `$${Number(m.amount).toLocaleString()}`,
          m.status
        ]);

        autoTable(doc, {
          startY: currentY + 3,
          head: [['Milestone', 'Description', 'Completion Date', 'Value', 'Status']],
          body: milestoneBody,
          theme: 'grid',
          headStyles: { fillColor: primaryColor as [number, number, number], fontSize: 8 },
          bodyStyles: { fontSize: 8 }
        });
        currentY = (doc as any).lastAutoTable.finalY + 10;
      }

      // --- SECTION 5: Deliverables Checklist ---
      if (deliverables.length > 0 && currentY < 235) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text("3. INCLUDED DELIVERABLES & ARTIFACTS", 14, currentY);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);

        const cols = 2;
        deliverables.forEach((item, idx) => {
          const col = idx % cols;
          const row = Math.floor(idx / cols);
          const x = 14 + col * 90;
          const y = currentY + 5 + row * 5;
          doc.text(`[X]  ${item}`, x, y);
        });

        currentY += Math.ceil(deliverables.length / cols) * 5 + 10;
      }

      if (currentY > 210) {
        doc.addPage();
        currentY = 20;
      }

      // --- SECTION 6: Payment Schedule ---
      if (paymentSchedule.length > 0) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text("4. PAYMENT SCHEDULE", 14, currentY);

        const scheduleBody = paymentSchedule.map(s => [
          s.phase,
          `$${Number(s.amount).toLocaleString()}`,
          s.dueDate || "N/A",
          s.status
        ]);

        autoTable(doc, {
          startY: currentY + 3,
          head: [['Payment Phase', 'Amount Due', 'Target Due Date', 'Status']],
          body: scheduleBody,
          theme: 'striped',
          headStyles: { fillColor: [71, 85, 105], fontSize: 8 },
          bodyStyles: { fontSize: 8 }
        });
        currentY = (doc as any).lastAutoTable.finalY + 10;
      }

      // --- SECTION 7: Governing Law & Terms ---
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text("5. GOVERNING LAW & INTELLECTUAL PROPERTY", 14, currentY);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.setFontSize(8.5);
      doc.text(`This Agreement shall be governed by, and construed in accordance with, the standard laws of the ${governingLaw}.`, 14, currentY + 6);
      doc.text(notes, 14, currentY + 12, { maxWidth: 180 });

      // Ensure space for QR verification and signature block
      if (currentY > 195) {
        doc.addPage();
        currentY = 20;
      }

      // --- SECTION 8: QR Code Verification ---
      const qrY = 240;
      const qrApiUrl = `https://chart.googleapis.com/chart?cht=qr&chs=150x150&chl=${encodeURIComponent(verificationUrl)}`;
      const qrBase64 = await getBase64FromUrl(qrApiUrl);

      if (qrBase64) {
        doc.addImage(qrBase64, "PNG", 14, qrY, 20, 20);
      }
      doc.setFontSize(7);
      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
      doc.setFont("helvetica", "bold");
      doc.text("Verify this contract online", 38, qrY + 4);
      doc.setFont("helvetica", "normal");
      doc.text("Scan the QR code or visit", 38, qrY + 8);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(`betterdose.dev/pdffx/${randomCode}`, 38, qrY + 12);

      // --- SECTION 9: Signatures & Stamp ---
      const sigX = 135;
      const sigY = 240;

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

      if (signatureUrl) {
        const sigBase64 = await getBase64FromUrl(signatureUrl);
        if (sigBase64) {
          doc.addImage(sigBase64, "PNG", sigX + 5, sigY - 10, 45, 18);
        }
      }

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
          client_name: clientName,
          client_email: clientEmail,
          company,
          project,
          status,
          issue_date: issueDate,
          scope_of_work: scopeOfWork,
          milestones,
          deliverables,
          payment_schedule: paymentSchedule,
          governing_law: governingLaw,
          notes,
          file_url: uploadData.url,
          signature_url: signatureUrl,
          stamp_url: stampUrl,
          verification_code: randomCode
        })
      });

      if (!saveRes.ok) throw new Error("Failed to save contract record");

      setShowForm(false);
      resetForm();
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
          <h2 className="text-sm font-semibold text-[#e8eaf2]">Contracts V2</h2>
          <p className="text-[10px] text-[#556080] mt-0.5">Generate customized MSAs, NDAs, and Service Level Agreements</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); resetForm(); }} className="btn btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5">
          {showForm ? <><X size={12} /> Cancel</> : <><Plus size={12} /> New Contract</>}
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-8 border border-[#4f8ef7]/30 bg-[#0f1117]/50 max-h-[85vh] overflow-y-auto">
          <h3 className="text-sm font-bold text-[#e8eaf2] mb-6">Draft Professional Contract V2</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div><label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Contract Number</label><input type="text" className="input w-full" value={contractNumber} onChange={e => setContractNumber(e.target.value)} /></div>
            <div><label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Client Name</label><input type="text" className="input w-full" value={clientName} onChange={e => setClientName(e.target.value)} /></div>
            <div><label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Client Email</label><input type="email" className="input w-full" value={clientEmail} onChange={e => setClientEmail(e.target.value)} /></div>
            <div><label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Company (Optional)</label><input type="text" className="input w-full" value={company} onChange={e => setCompany(e.target.value)} /></div>
            <div><label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Project Reference</label><input type="text" className="input w-full" value={project} onChange={e => setProject(e.target.value)} /></div>
            <div><label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Date of Agreement</label><input type="date" className="input w-full" value={issueDate} onChange={e => setIssueDate(e.target.value)} /></div>
            <div><label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">Governing Law</label><input type="text" className="input w-full" value={governingLaw} onChange={e => setGoverningLaw(e.target.value)} /></div>
          </div>

          <div className="border-t border-[#252d3d] pt-6 mb-6">
            <label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">1. Scope of Services</label>
            <textarea className="input w-full" rows={3} value={scopeOfWork} onChange={e => setScopeOfWork(e.target.value)} />
          </div>

          {/* Milestones Builder */}
          <div className="border-t border-[#252d3d] pt-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xs font-bold text-[#e8eaf2] uppercase tracking-wider">2. Milestones & Phases</h4>
              <button type="button" onClick={() => setMilestones([...milestones, { ...DEFAULT_MILESTONE }])} className="btn btn-secondary text-[10px] py-1 px-2.5 flex items-center gap-1">
                <Plus size={10} /> Add Milestone
              </button>
            </div>
            {milestones.map((m, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3 items-end">
                <div>
                  <label className="text-[9px] text-[#556080] block mb-1">Milestone Name</label>
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
                  <label className="text-[9px] text-[#556080] block mb-1">Completion Date</label>
                  <input type="date" className="input w-full" value={m.completionDate} onChange={e => {
                    const newM = [...milestones];
                    newM[idx].completionDate = e.target.value;
                    setMilestones(newM);
                  }} />
                </div>
                <div className="flex gap-2 items-center">
                  <div className="flex-1">
                    <label className="text-[9px] text-[#556080] block mb-1">Amount ($)</label>
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
            <h4 className="text-xs font-bold text-[#e8eaf2] uppercase tracking-wider mb-3">3. Included Deliverables</h4>
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

          {/* Payment Schedule Builder */}
          <div className="border-t border-[#252d3d] pt-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xs font-bold text-[#e8eaf2] uppercase tracking-wider">4. Payment Schedule</h4>
              <button type="button" onClick={() => setPaymentSchedule([...paymentSchedule, { ...DEFAULT_PAYMENT_SCHEDULE }])} className="btn btn-secondary text-[10px] py-1 px-2.5 flex items-center gap-1">
                <Plus size={10} /> Add Phase
              </button>
            </div>
            {paymentSchedule.map((s, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3 items-end">
                <div className="md:col-span-2">
                  <label className="text-[9px] text-[#556080] block mb-1">Phase Description</label>
                  <input type="text" className="input w-full" placeholder="e.g. 50% Upfront Deposit" value={s.phase} onChange={e => {
                    const newS = [...paymentSchedule];
                    newS[idx].phase = e.target.value;
                    setPaymentSchedule(newS);
                  }} />
                </div>
                <div>
                  <label className="text-[9px] text-[#556080] block mb-1">Amount ($)</label>
                  <input type="number" className="input w-full" value={s.amount} onChange={e => {
                    const newS = [...paymentSchedule];
                    newS[idx].amount = Number(e.target.value);
                    setPaymentSchedule(newS);
                  }} />
                </div>
                <div className="flex gap-2 items-center">
                  <div className="flex-1">
                    <label className="text-[9px] text-[#556080] block mb-1">Due Date</label>
                    <input type="date" className="input w-full" value={s.dueDate} onChange={e => {
                      const newS = [...paymentSchedule];
                      newS[idx].dueDate = e.target.value;
                      setPaymentSchedule(newS);
                    }} />
                  </div>
                  <button type="button" onClick={() => setPaymentSchedule(paymentSchedule.filter((_, i) => i !== idx))} className="btn btn-ghost text-red-400 p-1 mt-5">
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Signatures, Stamps, Terms */}
          <div className="border-t border-[#252d3d] pt-6 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="text-[10px] text-[#556080] uppercase tracking-wider mb-1 block">5. Legal Notes / Additional Terms</label>
              <textarea className="input w-full" rows={2} value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-[#556080] uppercase tracking-wider block">Signature & Seal</label>
              <div className="flex gap-2">
                <label className="btn btn-secondary flex-1 text-xs py-2 px-1 flex items-center justify-center gap-1 cursor-pointer">
                  <Upload size={12} /> {uploadingSig ? "..." : signatureUrl ? "Sig OK" : "Upload Sig"}
                  <input type="file" accept="image/png" className="hidden" onChange={e => handleFileUpload(e, "sig")} />
                </label>
                <label className="btn btn-secondary flex-1 text-xs py-2 px-1 flex items-center justify-center gap-1 cursor-pointer">
                  <Upload size={12} /> {uploadingStamp ? "..." : stampUrl ? "Stamp OK" : "Upload Stamp"}
                  <input type="file" accept="image/png" className="hidden" onChange={e => handleFileUpload(e, "stamp")} />
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="btn btn-secondary px-5 py-2">Close</button>
            <button onClick={generatePDF} disabled={generating || !clientName} className="btn btn-primary px-6 py-2">
              {generating ? "Compiling PDF & Uploading..." : "Generate V2 Contract & Save"}
            </button>
          </div>
        </div>
      )}

      {contracts.length === 0 ? (
        <div className="text-center py-12 text-[#556080]">
          <FileSignature size={32} className="mx-auto mb-3 opacity-30" />
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
                  <td className="py-3 font-mono font-bold text-[#e8eaf2]">
                    {c.contractNumber}
                    <div className="text-[9px] text-[#556080] font-mono">{c.verificationCode}</div>
                  </td>
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
                      <a href={`/pdffx/${c.verificationCode}`} className="btn btn-ghost p-1.5 text-green-400 hover:bg-green-400/10" title="Verify Online">
                        <Eye size={14} />
                      </a>
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
