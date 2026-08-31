"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { X, Copy } from "lucide-react";

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const DonateModal: React.FC<DonateModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const upiId = "andrewasher@ybl";

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId).then(() => {
      onShowToast("Copied UPI ID to clipboard");
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 p-5 shadow-2xl transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
          <h3 className="text-sm font-medium text-zinc-100 flex items-center gap-1.5">
            Support this site ❤️
          </h3>
          <button
            onClick={onClose}
            className="rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4">
          {/* UPI ID Section */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
              UPI ID
            </span>
            <div className="flex items-center justify-between rounded border border-zinc-800 bg-zinc-900 px-3 py-2">
              <span className="font-mono text-xs text-zinc-200">{upiId}</span>
              <button
                onClick={handleCopyUpi}
                className="inline-flex items-center gap-1 rounded bg-zinc-800 px-2 py-1 text-[11px] text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100 transition-colors"
              >
                <Copy className="h-3 w-3" />
                <span>Copy UPI ID</span>
              </button>
            </div>
          </div>

          {/* Scan & Pay QR Code */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block text-center">
              Scan & Pay
            </span>
            <div className="mx-auto flex h-44 w-44 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900/90 p-2 overflow-hidden">
              <Image
                src="/qr.png"
                alt="Scan & Pay QR Code"
                width={160}
                height={160}
                className="object-contain rounded"
                unoptimized
              />
            </div>
          </div>
        </div>

        {/* Close Footer Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full rounded border border-zinc-800 bg-zinc-900 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
