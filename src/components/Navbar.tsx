"use client";

import React, { useRef } from "react";
import { Coffee, Upload } from "lucide-react";

interface NavbarProps {
  activeFilter: "all" | "video" | "image";
  setActiveFilter: (filter: "all" | "video" | "image") => void;
  onOpenDonate: () => void;
  onUploadFiles: (files: FileList) => void;
  isOwner: boolean;
  videoCount?: number;
  imageCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeFilter,
  setActiveFilter,
  onOpenDonate,
  onUploadFiles,
  isOwner,
  videoCount = 0,
  imageCount = 0,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUploadFiles(e.target.files);
      e.target.value = "";
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl px-4 py-3 sm:px-6 shadow-2xl shadow-black/80 transition-all duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Left: Videos | Images Filter with Media Count Badges */}
        <div className="flex items-center rounded-lg border border-zinc-800/90 bg-zinc-900/90 p-1 text-xs font-medium backdrop-blur-md shadow-inner">
          <button
            onClick={() =>
              setActiveFilter(activeFilter === "video" ? "all" : "video")
            }
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all duration-300 ${
              activeFilter === "video"
                ? "bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/60 font-semibold"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
            }`}
          >
            <span>Videos</span>
            {videoCount > 0 && (
              <span className="rounded-full bg-zinc-700/60 px-1.5 py-0.2 font-mono text-[10px] text-zinc-300">
                {videoCount}
              </span>
            )}
          </button>
          
          <span className="text-zinc-700/80 select-none px-0.5">|</span>
          
          <button
            onClick={() =>
              setActiveFilter(activeFilter === "image" ? "all" : "image")
            }
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all duration-300 ${
              activeFilter === "image"
                ? "bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/60 font-semibold"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
            }`}
          >
            <span>Images</span>
            {imageCount > 0 && (
              <span className="rounded-full bg-zinc-700/60 px-1.5 py-0.2 font-mono text-[10px] text-zinc-300">
                {imageCount}
              </span>
            )}
          </button>
        </div>

        {/* Right side controls: Upload (Owner Only) & Donate */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Upload Button - Visible ONLY to Owner */}
          {isOwner && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="video/*,image/*"
                multiple
                className="hidden"
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3.5 py-1.5 text-xs font-medium text-zinc-100 hover:bg-zinc-700 hover:border-zinc-500 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-black/50 active:scale-95"
                title="Upload Media (Owner Control)"
              >
                <Upload className="h-3.5 w-3.5 text-zinc-200" />
                <span>Upload</span>
              </button>
            </>
          )}

          {/* Donate Button */}
          <button
            onClick={onOpenDonate}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800/90 bg-zinc-900 px-3.5 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800/90 hover:text-zinc-100 hover:border-zinc-700 transition-all duration-300 shadow-sm active:scale-95"
          >
            <Coffee className="h-3.5 w-3.5 text-amber-500" />
            <span>Donate</span>
          </button>
        </div>
      </div>
    </header>
  );
};
