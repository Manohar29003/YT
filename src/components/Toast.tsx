"use client";

import React, { useEffect } from "react";
import { Check } from "lucide-react";

interface ToastProps {
  message: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-md border border-zinc-700/80 bg-zinc-900 px-3.5 py-2 text-xs font-mono text-zinc-200 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200">
      <Check className="h-3.5 w-3.5 text-emerald-400" />
      <span>{message}</span>
    </div>
  );
};
