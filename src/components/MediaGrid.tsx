"use client";

import React, { useRef } from "react";
import { MediaItem } from "@/data/media";
import { MediaCard } from "./MediaCard";
import { Upload, Sparkles } from "lucide-react";

interface MediaGridProps {
  items: MediaItem[];
  onSelectItem: (item: MediaItem) => void;
  onUploadFiles?: (files: FileList) => void;
  isOwner?: boolean;
}

export const MediaGrid: React.FC<MediaGridProps> = ({ items, onSelectItem, onUploadFiles, isOwner }) => {
  const centerFileInputRef = useRef<HTMLInputElement>(null);

  const handleCenterFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && onUploadFiles) {
      onUploadFiles(e.target.files);
      e.target.value = "";
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-[65vh] flex-col items-center justify-center gap-4 py-20 px-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-800/80 bg-zinc-900/80 text-zinc-500 backdrop-blur-md shadow-inner">
          <Sparkles className="h-5 w-5 text-zinc-600" />
        </div>
        <p className="font-mono text-xs text-zinc-500 tracking-wider uppercase">No media found</p>
        
        {isOwner && onUploadFiles && (
          <>
            <input
              type="file"
              ref={centerFileInputRef}
              onChange={handleCenterFileChange}
              accept="video/*,image/*"
              multiple
              className="hidden"
            />
            <button
              onClick={() => centerFileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-medium text-zinc-100 hover:border-zinc-500 hover:bg-zinc-700 transition-all duration-300 shadow-xl shadow-black/80 hover:shadow-black active:scale-95 mt-1"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Upload Media</span>
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <MediaCard key={item.id} item={item} onClick={onSelectItem} />
        ))}
      </div>
    </div>
  );
};
