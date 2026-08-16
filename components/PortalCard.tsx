"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { PortalLink } from "@/lib/portalData";

// Dynamic SVG Icons selector based on database values
function LinkIcon({ name, color }: { name: string; color: string }) {
  const iconProps = {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: "2",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const
  };

  switch (name) {
    case "check":
      return (
        <svg {...iconProps}>
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      );
    case "user":
      return (
        <svg {...iconProps}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    case "message":
      return (
        <svg {...iconProps}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    case "cpu":
      return (
        <svg {...iconProps}>
          <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
          <rect x="9" y="9" width="6" height="6" />
          <line x1="9" y1="1" x2="9" y2="4" />
          <line x1="15" y1="1" x2="15" y2="4" />
          <line x1="9" y1="20" x2="9" y2="23" />
          <line x1="15" y1="20" x2="15" y2="23" />
          <line x1="20" y1="9" x2="23" y2="9" />
          <line x1="20" y1="15" x2="23" y2="15" />
          <line x1="1" y1="9" x2="4" y2="9" />
          <line x1="1" y1="15" x2="4" y2="15" />
        </svg>
      );
    case "search":
      return (
        <svg {...iconProps}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );
    case "shield":
      return (
        <svg {...iconProps}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case "chart":
      return (
        <svg {...iconProps}>
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      );
    case "folder":
      return (
        <svg {...iconProps}>
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      );
    case "play":
      return (
        <svg {...iconProps}>
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      );
    case "facebook":
      return (
        <svg {...iconProps}>
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      );
    case "cloud":
      return (
        <svg {...iconProps}>
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
        </svg>
      );
    case "globe":
    default:
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
  }
}

export function PortalCard({ link }: { link: PortalLink }) {
  const { lang } = useLanguage();

  // Pick correct language text values
  const title = lang === "vi" ? link.name : link.nameEn;
  const description = lang === "vi" ? link.purpose : link.purposeEn;

  // Use a different color accent for locked states
  const accentColor = link.isLocked ? "rgba(107, 114, 128, 0.4)" : "#ec1c6b";

  return (
    <div
      className={`portalCard ${link.isLocked ? "locked" : ""}`}
      style={{ "--card-accent": accentColor } as React.CSSProperties}
    >
      {/* Dynamic glow effect in background */}
      {!link.isLocked && <div className="cardGlowBack" />}

      <div className="cardTop">
        <div className="cardIcon">
          <LinkIcon name={link.icon} color={link.isLocked ? "#6b7280" : "url(#portalGrad)"} />
        </div>
        
        {/* Status indicator badges */}
        {link.isLocked ? (
          <span className="statusBadge lockedBadge">
            {lang === "vi" ? "ĐANG KHÓA" : "LOCKED"}
          </span>
        ) : (
          <span className="statusBadge activeBadge">
            {lang === "vi" ? "HOẠT ĐỘNG" : "ACTIVE"}
          </span>
        )}
      </div>

      <div className="cardBody">
        <h3>{title}</h3>
        <p>{description || (lang === "vi" ? "Chưa có mô tả mục đích." : "No description provided.")}</p>
      </div>

      <div className="cardAction">
        {link.isLocked ? (
          <button type="button" className="cardLinkBtn disabled" disabled>
            <span>{lang === "vi" ? "Bảo trì" : "Under Maintenance"}</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </button>
        ) : (
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="cardLinkBtn"
          >
            <span>{lang === "vi" ? "Truy cập ngay" : "Access Now"}</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
