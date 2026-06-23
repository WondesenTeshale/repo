"use client";

import { useState } from "react";
import { X } from "lucide-react";

function isVideo(url: string) {
  const ext = url.split('.').pop()?.split('?')[0]?.toLowerCase();
  return ext ? ["mp4", "webm", "ogg", "mov", "m4v"].includes(ext) : false;
}

export default function ProjectMediaGallery({ media, projectName }: { media: string[], projectName: string }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (media.length === 0) return null;

  return (
    <>
      <div className="card p-6">
        <h3 className="text-sm font-semibold text-[#e8eaf2] mb-4">Project Media</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {media.map((src, i) => {
            const video = isVideo(src);
            return (
              <div 
                key={i} 
                className={`rounded-lg overflow-hidden border border-[#252d3d] flex items-center justify-center bg-[#07090e] ${!video ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
                onClick={() => !video && setLightboxIndex(i)}
              >
                {video ? (
                  <video src={src} controls className="w-full h-auto object-cover max-h-[300px]" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt={`${projectName} media ${i + 1}`} className="w-full h-auto object-cover max-h-[300px]" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-10 cursor-zoom-out"
          onClick={() => setLightboxIndex(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white hover:text-[#4f8ef7] transition-colors p-2 bg-black/50 rounded-full z-[101]"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex(null);
            }}
          >
            <X size={24} />
          </button>
          
          <div 
            className="relative max-w-6xl w-full h-full flex items-center justify-center cursor-default" 
            onClick={e => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={media[lightboxIndex]} 
              alt={`${projectName} zoomed`} 
              className="max-w-full max-h-[90vh] object-contain rounded border border-[#252d3d] shadow-2xl" 
            />
          </div>
        </div>
      )}
    </>
  );
}
