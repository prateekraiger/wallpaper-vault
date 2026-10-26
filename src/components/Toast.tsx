"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, Heart, Download } from "lucide-react";

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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl glass-panel shadow-2xl border border-white/15 text-xs text-white pointer-events-auto animate-in slide-in-from-bottom-5 duration-300 backdrop-blur-xl bg-[#0e1628]/90"
        >
          {t.type === "heart" ? (
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400 shrink-0" />
          ) : t.type === "download" ? (
            <Download className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : t.type === "info" ? (
            <Info className="w-4 h-4 text-indigo-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
          )}
          <span className="font-medium pr-1">{t.message}</span>
        </div>
      ))}
    </div>
  );
}
