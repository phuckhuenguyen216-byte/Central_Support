"use client";

import { useLanguage } from "@/lib/LanguageContext";

export function Logo() {
  const { lang } = useLanguage();

  return (
    <div className="portalLogoWrap" aria-label="POPTech Central Support Portal">
      <svg
        className="portalLogoMark"
        viewBox="0 0 64 64"
        width="40"
        height="40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="portalGrad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#ec1c6b" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        {/* Modern connected node squares representing a unified central hub */}
        <rect x="8" y="8" width="20" height="20" rx="6" fill="url(#portalGrad)" />
        <rect x="36" y="8" width="20" height="20" rx="6" stroke="url(#portalGrad)" strokeWidth="3" />
        <rect x="8" y="36" width="20" height="20" rx="6" stroke="url(#portalGrad)" strokeWidth="3" />
        <rect x="36" y="36" width="20" height="20" rx="6" fill="url(#portalGrad)" />
        
        {/* Connected lines */}
        <line x1="28" y1="18" x2="36" y2="18" stroke="#ec1c6b" strokeWidth="2" />
        <line x1="18" y1="28" x2="18" y2="36" stroke="#8b5cf6" strokeWidth="2" />
      </svg>
      <div className="portalLogoText">
        <strong>POPTech</strong>
        <span>
          {lang === "vi" ? "Trung tâm điều khiển" : "Central Control Portal"}
        </span>
      </div>
    </div>
  );
}
