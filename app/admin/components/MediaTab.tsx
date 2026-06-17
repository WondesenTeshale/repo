"use client";
import { useState, useEffect } from "react";
import { Upload, Trash2, FileText, Image, User } from "lucide-react";
import { StorageFile, apiUploadFile, apiListFiles } from "@/lib/db";

interface Props { token: string; }
type Bucket = "portfolio-images" | "documents" | "team-photos";

const BUCKETS: { key: Bucket; label: string; accept: string; icon: React.ReactNode }[] = [
  { key: "portfolio-images", label: "Project Screenshots", accept: "image/*", icon: <Image size={14} /> },
  { key: "documents", label: "Documents & PDFs", accept: ".pdf,.doc,.docx", icon: <FileText size={14} /> },
  { key: "team-photos", label: "Team Photos", accept: "image/*", icon: <User size={14} /> },
];

export default function MediaTab({ token }: Props) {
  const [activeBucket, setActiveBucket] = useState<Bucket>("portfolio-images");
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { loadFiles(activeBucket); }, [activeBucket]);

  const loadFiles = async (bucket: Bucket) => {
    setLoading(true);
    const list = await apiListFiles(bucket);
    setFiles(list);
    setLoading(false);
  };

  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList) return;
    setUploading(true);
    for (const file of Array.from(fileList)) {
      await apiUploadFile(file, activeBucket, token);
    }
    await loadFiles(activeBucket);
    setUploading(false);
  };

  const currentBucket = BUCKETS.find(b => b.key === activeBucket)!;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-semibold text-[#e8eaf2]">Media Library</h2>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {BUCKETS.map(b => (
          <button key={b.key} type="button" onClick={() => setActiveBucket(b.key)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${activeBucket === b.key ? "bg-[#4f8ef7]/10 border-[#4f8ef7]/40 text-[#4f8ef7]" : "border-[#252d3d] text-[#556080] hover:border-[#4f8ef7]/20"}`}>
            {b.icon} {b.label}
          </button>
        ))}
      </div>

      <label className="btn btn-ghost text-xs py-1.5 px-3 cursor-pointer inline-flex items-center gap-1.5 mb-6">
        <Upload size={13} /> {uploading ? "Uploading..." : `Upload to ${currentBucket.label}`}
        <input type="file" multiple accept={currentBucket.accept} className="hidden" onChange={e => handleUpload(e.target.files)} disabled={uploading} />
      </label>

      {loading ? (
        <p className="text-xs text-[#556080]">Loading files...</p>
      ) : files.length === 0 ? (
        <p className="text-xs text-[#556080]">No files in this bucket yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {files.map(f => (
            <div key={f.name} className="card p-3 flex flex-col gap-2">
              {activeBucket !== "documents"
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={f.url} alt={f.name} className="w-full h-28 object-cover rounded" />
                : <div className="w-full h-16 bg-[#0f1117] rounded flex items-center justify-center"><FileText size={24} className="text-[#4f8ef7]" /></div>
              }
              <p className="text-[10px] text-[#8b92a9] truncate">{f.name}</p>
              <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#4f8ef7] hover:underline">View / Copy URL</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
