import React from "react";

interface LuminaLogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  className?: string;
}

export default function LuminaLogo({
  size = "md",
  showTagline = true,
  className = "",
}: LuminaLogoProps) {
  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
  };

  const titleSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Precision Geometric Aperture / Prism Logo Mark */}
      <div
        className={`${iconSizes[size]} rounded-[10px] bg-[#121212] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105 shrink-0 relative overflow-hidden`}
        aria-hidden="true"
      >
        {/* Optical facet glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#ff3e00]/15 to-[#ffbb26]/20 pointer-events-none" />
        
        {/* Geometric Lens Iris / Aperture SVG */}
        <svg
          className="w-5 h-5 text-white relative z-10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Outer lens circle */}
          <circle cx="12" cy="12" r="9.5" strokeOpacity="0.4" />
          {/* Optical aperture spiral blades */}
          <path d="M12 2.5 L17.5 12" stroke="#ff3e00" strokeWidth="2" />
          <path d="M17.5 12 L12 21.5" />
          <path d="M12 21.5 L6.5 12" />
          <path d="M6.5 12 L12 2.5" />
          {/* Inner core prism */}
          <circle cx="12" cy="12" r="2.5" fill="#ffbb26" stroke="#121212" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Brand Wordmark & Tagline */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-extrabold tracking-tight text-[#121212] ${titleSizes[size]}`}>
            LUMINA
          </span>
          <span className="text-[10px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded-[4px] bg-[#121212] text-[#fbfaf9]">
            4K
          </span>
        </div>
        {showTagline && (
          <span className="text-[11px] text-[#7e7e7d] mt-0.5 font-normal tracking-wide">
            Curated Visual Sanctuary
          </span>
        )}
      </div>
    </div>
  );
}
