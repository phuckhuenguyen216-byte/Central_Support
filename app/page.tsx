"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { portalLinks, PortalLink } from "@/lib/portalData";
import { Logo } from "@/components/Logo";
import { PortalCard } from "@/components/PortalCard";
import { PortalSearch } from "@/components/PortalSearch";

export default function Home() {
  const { lang, setLang } = useLanguage();
  const [links, setLinks] = useState<PortalLink[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // Load links from localStorage or import database on mount
  useEffect(() => {
    const savedLinks = localStorage.getItem("sz_portal_links");
    if (savedLinks) {
      try {
        setLinks(JSON.parse(savedLinks));
      } catch (e) {
        setLinks(portalLinks);
      }
    } else {
      setLinks(portalLinks);
      localStorage.setItem("sz_portal_links", JSON.stringify(portalLinks));
    }
  }, []);

  // Filter links based on active tab and search query
  const filteredLinks = links.filter((link) => {
    const matchCategory = activeCategory === "all" || link.category === activeCategory;
    
    const query = searchQuery.toLowerCase().trim();
    const title = (lang === "vi" ? link.name : link.nameEn).toLowerCase();
    const desc = (lang === "vi" ? link.purpose : link.purposeEn).toLowerCase();
    const matchSearch = !query || title.includes(query) || desc.includes(query) || link.url.toLowerCase().includes(query);

    return matchCategory && matchSearch;
  });

  return (
    <div className="portalPageWrapper">
      {/* Background Decorative Tech Grid and Glows */}
      <div className="portalBgGrid" />
      <div className="portalBgGlow pg1" />
      <div className="portalBgGlow pg2" />

      {/* HEADER NAVBAR */}
      <header className="portalHeader">
        <div className="container headerInner">
          <Logo />

          <div className="headerActions">
            {/* Language Switch Toggle */}
            <div className="langToggler">
              <button
                type="button"
                className={`langBtn ${lang === "vi" ? "active" : ""}`}
                onClick={() => setLang("vi")}
              >
                VI
              </button>
              <button
                type="button"
                className={`langBtn ${lang === "en" ? "active" : ""}`}
                onClick={() => setLang("en")}
              >
                EN
              </button>
            </div>

            {/* Admin Console Link Button */}
            <Link href="/admin" className="adminPortalBtn">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>{lang === "vi" ? "Quản trị Admin" : "Admin Panel"}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="portalHero">
        <div className="container heroInner">
          <span className="heroKicker">
            {lang === "vi" ? "MỞ CỬA VÀO HỆ SINH THÁI" : "ECOSYSTEM CONTROL CENTER"}
          </span>
          <h1>
            {lang === "vi"
              ? "Cổng điều khiển & Hỗ trợ dự án"
              : "Unified Central Project Console"}
          </h1>
          <p>
            {lang === "vi"
              ? "Truy cập nhanh chóng, an toàn các hệ thống, kênh truyền thông và bảng theo dõi chỉ số nội bộ của POPTech."
              : "Quick, secure access to all internal tools, social channels, and project dashboards for POPTech."}
          </p>
        </div>
      </section>

      {/* SEARCH AND FILTERS SECTION */}
      <section className="portalSearchSection">
        <div className="container">
          <PortalSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>
      </section>

      {/* MAIN CARDS DIRECTORY */}
      <section className="portalDirectorySection">
        <div className="container">
          {filteredLinks.length > 0 ? (
            <div className="portalCardsGrid">
              {filteredLinks.map((link) => (
                <PortalCard key={link.id} link={link} />
              ))}
            </div>
          ) : (
            <div className="emptyResultsState">
              <div className="emptyIcon">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </div>
              <h3>{lang === "vi" ? "Không tìm thấy liên kết" : "No Links Found"}</h3>
              <p>
                {lang === "vi"
                  ? "Không tìm thấy kết quả phù hợp với từ khóa tìm kiếm của bạn. Hãy thử từ khóa khác!"
                  : "We couldn't find any links matching your search criteria. Please try another keyword!"}
              </p>
              {searchQuery && (
                <button
                  type="button"
                  className="primaryBtn clearBtn"
                  onClick={() => setSearchQuery("")}
                >
                  {lang === "vi" ? "Xóa bộ lọc tìm kiếm" : "Clear Search Filter"}
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="portalFooter">
        <div className="container footerInner">
          <p>© 2026 POPTech. All rights reserved. Powered by Next.js & Tailwind-ready aesthetics.</p>
        </div>
      </footer>
    </div>
  );
}
