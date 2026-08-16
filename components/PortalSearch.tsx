"use client";

import { useLanguage } from "@/lib/LanguageContext";

interface PortalSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function PortalSearch({
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryChange,
}: PortalSearchProps) {
  const { lang } = useLanguage();

  const categories = [
    { key: "all", labelVi: "Tất cả", labelEn: "All Links" },
    { key: "ops", labelVi: "Hệ thống & KPI", labelEn: "Operations & KPI" },
    { key: "data", labelVi: "Đấu thầu & Dữ liệu", labelEn: "Bidding & Data" },
    { key: "social", labelVi: "Truyền thông & Forum", labelEn: "Social & Community" },
    { key: "storage", labelVi: "Lưu trữ đám mây", labelEn: "Cloud & Storage" },
    { key: "public", labelVi: "Websites công ty", labelEn: "Public Sites" },
  ];

  return (
    <div className="searchBarContainer">
      {/* Search Input Card */}
      <div className="searchFormWrap">
        <span className="searchIcon">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={
            lang === "vi"
              ? "Tìm kiếm ứng dụng, hệ thống hoặc mục đích sử dụng..."
              : "Search apps, internal systems, or use cases..."
          }
          className="portalSearchInput"
        />
        {searchQuery && (
          <button
            type="button"
            className="clearSearchBtn"
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category Slider Tabs */}
      <div className="categoriesTabsWrapper">
        <div className="categoriesTabs">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                className={`categoryTabBtn ${isActive ? "active" : ""}`}
                onClick={() => onCategoryChange(cat.key)}
              >
                {lang === "vi" ? cat.labelVi : cat.labelEn}
              </button>
            );
          })}
          {/* Animated capsule sliding background */}
          <div
            className="categoryTabHighlight"
            style={{
              width: `${100 / categories.length}%`,
              transform: `translateX(${
                categories.findIndex((c) => c.key === activeCategory) * 100
              }%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
