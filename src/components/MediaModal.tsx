"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { X, Download, Share2, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { MediaItem } from "@/data/media";

interface MediaModalProps {
  item: MediaItem | null;
  allItems: MediaItem[];
  onClose: () => void;
  onNavigate: (item: MediaItem) => void;
  onShowToast: (msg: string) => void;
  onDeleteMedia?: (id: string) => void;
  isOwner?: boolean;
}

export const MediaModal: React.FC<MediaModalProps> = ({
  item,
  allItems,
  onClose,
  onNavigate,
  onShowToast,
  onDeleteMedia,
  isOwner,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        const currentIndex = allItems.findIndex((i) => i.id === item.id);
        if (currentIndex > 0) {
          onNavigate(allItems[currentIndex - 1]);
        }
      } else if (e.key === "ArrowRight") {
        const currentIndex = allItems.findIndex((i) => i.id === item.id);
        if (currentIndex < allItems.length - 1) {
          onNavigate(allItems[currentIndex + 1]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [item, allItems, onClose, onNavigate]);

  if (!item) return null;

  const currentIndex = allItems.findIndex((i) => i.id === item.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allItems.length - 1;

  const handleShare = () => {
    const shareUrl = `${window.location.origin}?media=${item.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      onShowToast("Link copied to clipboard");
    });
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(item.url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = item.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      onShowToast(`Downloading ${item.filename}`);
    } catch {
      window.open(item.url, "_blank");
    }
  };

  const handleDelete = () => {
    if (onDeleteMedia && item) {
      onDeleteMedia(item.id);
      onClose();
      onShowToast(`Deleted ${item.filename}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-150">
      {/* Click backdrop to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Modal Container */}
      <div className="relative z-10 flex flex-col max-h-[95vh] w-full max-w-5xl overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 shadow-2xl">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 px-4 py-3 bg-zinc-950">
          <span className="truncate font-mono text-xs text-zinc-300">
            {item.filename}
          </span>

          <div className="flex items-center gap-2">
            {/* Delete button for custom user uploaded media */}
            {item.isCustom && onDeleteMedia && (
              <button
                onClick={handleDelete}
                className="inline-flex items-center gap-1 rounded border border-red-900/60 bg-red-950/40 px-2.5 py-1 text-xs text-red-400 hover:bg-red-900/60 hover:text-red-200 transition-colors"
                title="Delete media"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            )}

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 rounded border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
              title="Download file"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
              title="Share link"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors ml-1"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Media Viewer Area */}
        <div className="relative flex min-h-[300px] max-h-[78vh] w-full items-center justify-center bg-black overflow-hidden">
          {item.type === "video" ? (
            <video
              src={item.url}
              poster={item.thumbnailUrl}
              controls
              autoPlay
              className="max-h-[75vh] w-full object-contain"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          ) : (
            <div className="relative h-full min-h-[350px] max-h-[75vh] w-full flex items-center justify-center p-2">
              <Image
                src={item.url}
                alt={item.filename}
                fill
                className="object-contain"
                priority
                unoptimized
              />
            </div>
          )}

          {/* Previous / Next Arrow Controls */}
          {hasPrev && (
            <button
              onClick={() => onNavigate(allItems[currentIndex - 1])}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-zinc-800 bg-zinc-950/80 p-2 text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100 transition-colors backdrop-blur-sm"
              title="Previous (Left Arrow)"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          {hasNext && (
            <button
              onClick={() => onNavigate(allItems[currentIndex + 1])}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-zinc-800 bg-zinc-950/80 p-2 text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100 transition-colors backdrop-blur-sm"
              title="Next (Right Arrow)"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
