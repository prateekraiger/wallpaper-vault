import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="py-24 text-center max-w-md mx-auto space-y-4">
      <div className="w-16 h-16 rounded-[48px] bg-[#ff3e00] border-2 border-[#343433] flex items-center justify-center mx-auto text-white text-2xl font-bold shadow-xs">
        404
      </div>
      <h2 className="text-2xl font-bold text-[#121212] tracking-tight">
        Wallpaper Not Found
      </h2>
      <p className="text-sm text-[#474645] leading-relaxed">
        The wallpaper or category you are looking for has been moved or does not exist on parchment.
      </p>
      <div className="pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[32px] bg-[#121212] hover:bg-[#2c2c2c] text-[#fbfaf9] text-xs font-semibold shadow-sm transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home Vault</span>
        </Link>
      </div>
    </div>
  );
}
