"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="py-24 text-center max-w-md mx-auto space-y-4">
      <div className="w-16 h-16 rounded-[48px] bg-[#ff2b3a] border-2 border-[#343433] flex items-center justify-center mx-auto text-white text-2xl font-bold shadow-xs">
        !
      </div>
      <h2 className="text-2xl font-bold text-[#121212] tracking-tight">
        Something went wrong
      </h2>
      <p className="text-sm text-[#474645] leading-relaxed">
        An unexpected error occurred while loading this page.
      </p>
      <div className="pt-2 flex items-center justify-center gap-3">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[32px] bg-[#121212] hover:bg-[#2c2c2c] text-[#fbfaf9] text-xs font-semibold shadow-sm transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Try again</span>
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[32px] bg-[#f6f4ef] hover:bg-[#edeae2] text-[#121212] border border-[#e5d5c3] text-xs font-semibold transition-all"
        >
          <span>Home</span>
        </Link>
      </div>
    </div>
  );
}
