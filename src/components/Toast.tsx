"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, Info, Heart, Download } from "lucide-react";

export interface ToastMessage {
  id: string;
  message: string;
  type?: "success" | "info" | "heart" | "download";
}

export function showToast(message: string, type: "success" | "info" | "heart" | "download" = "success") {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("app-toast", {
        detail: { id: Date.now().toString(), message, type },
      })
    );
  }
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleToast = (e: any) => {
      const newToast: ToastMessage = e.detail;
      setToasts((prev) => [...prev.slice(-3), newToast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 3500);
    };

    window.addEventListener("app-toast", handleToast);
    return () => window.removeEventListener("app-toast", handleToast);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-3 px-4 py-2.5 rounded-[10px] bg-white text-[#121212] border border-[#f2f0ed] shadow-[0_4px_20px_rgba(0,0,0,0.06)] text-xs pointer-events-auto animate-in slide-in-from-bottom-3 duration-200"
          style={{
            boxShadow: "inset 0 0 0 1px #f2f0ed, 0 4px 16px rgba(0, 0, 0, 0.05)",
          }}
        >
          {t.type === "heart" ? (
            <span className="w-6 h-6 rounded-full bg-[#ff58ae]/15 flex items-center justify-center shrink-0">
              <Heart className="w-3.5 h-3.5 text-[#ff2b3a] fill-[#ff2b3a]" />
            </span>
          ) : t.type === "download" ? (
            <span className="w-6 h-6 rounded-full bg-[#00c978]/15 flex items-center justify-center shrink-0">
              <Download className="w-3.5 h-3.5 text-[#00c978]" />
            </span>
          ) : t.type === "info" ? (
            <span className="w-6 h-6 rounded-full bg-[#0086fc]/15 flex items-center justify-center shrink-0">
              <Info className="w-3.5 h-3.5 text-[#0086fc]" />
            </span>
          ) : (
            <span className="w-6 h-6 rounded-full bg-[#00ca48]/15 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00ca48]" />
            </span>
          )}
          <span className="font-medium text-[#343433] pr-1">{t.message}</span>
        </div>
      ))}
    </div>
  );
}
