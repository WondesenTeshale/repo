import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, FileText, Calendar, ShieldCheck, DollarSign, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Props {
  params: Promise<{ code: string }>;
}

export default async function VerifyPage({ params }: Props) {
  const { code } = await params;

  // 1. Try to find in invoices
  const { data: invoice } = await supabase
    .from("invoices")
    .select("*")
    .eq("verification_code", code)
    .maybeSingle();

  // 2. Try to find in contracts
  const { data: contract } = await supabase
    .from("contracts")
    .select("*")
    .eq("verification_code", code)
    .maybeSingle();

  const isVerified = !!(invoice || contract);
  const type = invoice ? "Invoice" : contract ? "Contract" : null;
  const data = invoice || contract;

  return (
    <div className="min-h-screen bg-[#07080a] text-[#e8eaf2] flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 py-24 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

        <div className="w-full max-w-lg z-10">
          {isVerified && data ? (
            <div className="card border border-green-500/20 bg-green-500/[0.02] p-8 rounded-2xl backdrop-blur-md shadow-xl text-center">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-green-500/10 text-green-400 mb-4 animate-pulse">
                <CheckCircle2 size={48} />
              </div>
              <h1 className="text-xl font-bold text-green-400 tracking-tight mb-1">
                {type} Verified ✓
              </h1>
              <p className="text-xs text-[#556080] mb-8">
                This document is authentic and registered with BetterDose Ltd.
              </p>

              <div className="space-y-4 text-left border-y border-[#252d3d] py-6 mb-6">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#556080]">Document Type</span>
                  <span className="font-semibold text-[#8b92a9] uppercase">{type}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#556080]">Number</span>
                  <span className="font-mono font-bold text-[#e8eaf2]">
                    {invoice ? invoice.invoice_number : contract.contract_number}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#556080]">Client Name</span>
                  <span className="font-semibold text-[#e8eaf2]">{data.client_name}</span>
                </div>
                {invoice ? (
                  <>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#556080]">Project Ref</span>
                      <span className="font-semibold text-[#8b92a9]">{invoice.project_reference || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#556080]">Amount</span>
                      <span className="font-semibold text-green-400 text-sm">
                        {Number(invoice.total_due).toLocaleString()} {invoice.currency}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#556080]">Project</span>
                    <span className="font-semibold text-[#8b92a9]">{contract.project || "N/A"}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#556080]">Issue Date</span>
                  <span className="font-semibold text-[#8b92a9]">
                    {new Date(data.issue_date).toLocaleDateString(undefined, { dateStyle: "medium" })}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#556080]">Status</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    (invoice ? invoice.payment_status : contract.status) === "Paid" || (invoice ? invoice.payment_status : contract.status) === "Signed"
                      ? "bg-green-500/10 text-green-400 border border-green-500/20"
                      : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                  }`}>
                    {invoice ? invoice.payment_status : contract.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#556080]">Verification Code</span>
                  <span className="font-mono text-[#556080]">{code}</span>
                </div>
              </div>

              {data.file_url && (
                <a
                  href={data.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg"
                >
                  <ExternalLink size={14} /> Download Verified PDF
                </a>
              )}
            </div>
          ) : (
            <div className="card border border-red-500/20 bg-red-500/[0.02] p-8 rounded-2xl backdrop-blur-md shadow-xl text-center">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-red-500/10 text-red-400 mb-4">
                <AlertTriangle size={48} />
              </div>
              <h1 className="text-xl font-bold text-red-400 tracking-tight mb-1">
                Document Not Found
              </h1>
              <p className="text-xs text-[#556080] mb-8">
                This verification code could not be resolved to any active Invoice or Contract.
              </p>

              <div className="text-left text-xs bg-[#0f1117] border border-[#252d3d] p-4 rounded-lg text-[#8b92a9] mb-6 leading-relaxed">
                Please verify that the URL match the QR code exactly, or contact our support team at{" "}
                <a href="mailto:contact@betterdose.dev" className="text-blue-400 hover:underline">
                  contact@betterdose.dev
                </a>{" "}
                if you believe this is an error.
              </div>

              <Link href="/" className="btn btn-secondary w-full py-2.5 text-xs font-semibold rounded-lg">
                Back to BetterDose
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
