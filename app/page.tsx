"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";
import { portalLinks, PortalLink, PortalCourse, portalCourses } from "@/lib/portalData";
import { Logo } from "@/components/Logo";
import { PortalCard } from "@/components/PortalCard";
import { PortalSearch } from "@/components/PortalSearch";

export default function Home() {
  const { lang, setLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [links, setLinks] = useState<PortalLink[]>([]);
  const [courses, setCourses] = useState<PortalCourse[]>([]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedRole, setSelectedRole] = useState<string>("Tất cả");

  // Load links and courses from localStorage or import database on mount
  useEffect(() => {
    // 1. Links
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

    // 2. Courses
    const savedCourses = localStorage.getItem("sz_portal_courses");
    if (savedCourses) {
      try {
        setCourses(JSON.parse(savedCourses));
      } catch (e) {
        setCourses(portalCourses);
      }
    } else {
      setCourses(portalCourses);
      localStorage.setItem("sz_portal_courses", JSON.stringify(portalCourses));
    }
  }, []);

  // Filter links based on active tab, search query and active role
  const filteredLinks = links.filter((link) => {
    const matchCategory = activeCategory === "all" || link.category === activeCategory;
    
    const query = searchQuery.toLowerCase().trim();
    const title = (lang === "vi" ? link.name : link.nameEn).toLowerCase();
    const desc = (lang === "vi" ? link.purpose : link.purposeEn).toLowerCase();
    const matchSearch = !query || title.includes(query) || desc.includes(query) || link.url.toLowerCase().includes(query);

    // Role filtering (show links for selectedRole, "all", or legacy links with no roles)
    const matchRole =
      selectedRole === "Tất cả" ||
      !link.roles ||
      link.roles.includes("all") ||
      link.roles.includes(selectedRole);

    return matchCategory && matchSearch && matchRole;
  });

  // Filter courses based on active role
  const filteredCourses = courses.filter((course) =>
    selectedRole === "Tất cả" || course.role === "Tất cả" || course.role === selectedRole
  );

  return (
    <div className="portalPageWrapper">
      {/* Background Decorative Tech Grid and Glows */}
      <div className="portalBgGrid" />
      <div className="portalBgGlow pg1" />
      <div className="portalBgGlow pg2" />

      {/* HEADER NAVBAR (SOPHOS STYLE) */}
      <header className="portalHeader">
        <div className="container headerMain">
          <Logo />
          <nav className="headerNav">
            <a href="#products" onClick={(e) => e.preventDefault()}>
              {lang === "vi" ? "Sản phẩm" : "Products"}
            </a>
            <a href="#solutions" onClick={(e) => e.preventDefault()}>
              {lang === "vi" ? "Giải pháp" : "Solutions"}
            </a>
            <a href="#partners" onClick={(e) => e.preventDefault()}>
              {lang === "vi" ? "Đối tác" : "Partners"}
            </a>
            <a href="#company" onClick={(e) => e.preventDefault()}>
              {lang === "vi" ? "Doanh nghiệp" : "Company"}
            </a>
            <a href="#contact" onClick={(e) => e.preventDefault()}>
              {lang === "vi" ? "Liên hệ" : "Contact Us"}
            </a>
          </nav>
        </div>

        {/* Sophos Sub-header bar */}
        <div className="headerSub">
          <div className="container subInner">
            <div className="subLeft" style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <span 
                className={`homeTab ${activeCategory === "all" ? "active" : ""}`}
                onClick={() => { setActiveCategory("all"); setSearchQuery(""); }}
              >
                {lang === "vi" ? "TRANG CHỦ" : "HOME"}
              </span>

              {/* Role Switcher dropdown next to home button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
                  {lang === "vi" ? "VAI TRÒ:" : "ROLE:"}
                </span>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  style={{
                    background: 'var(--admin-reset-btn-bg)',
                    border: '1px solid var(--card-border)',
                    color: 'var(--title-color)',
                    fontSize: '10px',
                    fontWeight: '800',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="Tất cả">{lang === "vi" ? "TẤT CẢ" : "ALL ROLES"}</option>
                  <option value="Sales">SALES</option>
                  <option value="Marketing">MARKETING</option>
                  <option value="Developer">DEVELOPER</option>
                  <option value="Leader / PM">LEADER / PM</option>
                  <option value="Nhân viên mới">{lang === "vi" ? "NHÂN VIÊN MỚI" : "NEW HIRE"}</option>
                </select>
              </div>
            </div>

            <div className="subRight">
              {/* Theme Toggle Button */}
              <button
                type="button"
                className="themeToggleBtn"
                onClick={toggleTheme}
                title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                )}
              </button>

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

              {/* Admin Login Link */}
              <Link href="/admin" className="adminPortalBtn">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>{lang === "vi" ? "ĐĂNG NHẬP" : "LOGIN"}</span>
              </Link>
            </div>
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
          <p style={{ marginBottom: 0 }}>
            {lang === "vi"
              ? "Truy cập nhanh chóng, an toàn các hệ thống, kênh truyền thông và bảng theo dõi chỉ số nội bộ của POPTech."
              : "Quick, secure access to all internal tools, social channels, and project dashboards for POPTech."}
          </p>
        </div>
      </section>

      {/* METRICS GRID SECTION */}
      <section className="container" style={{ marginTop: '24px', marginBottom: '16px' }}>
        <div className="metrics" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div className="metric" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div className="metricIcon purple" style={{ width: '40px', height: '40px', borderRadius: '10px', display: 'grid', placeItems: 'center', fontSize: '18px', background: 'rgba(109, 77, 245, 0.1)', color: '#6d4df5' }}>▦</div>
            <div>
              <b style={{ fontSize: '20px', display: 'block', color: 'var(--title-color)' }}>{filteredLinks.length}</b>
              <small style={{ color: 'var(--text-muted)', fontSize: '10.5px', fontWeight: 'bold' }}>
                {lang === "vi" ? "Trang web được cấp" : "Authorized links"}
              </small>
            </div>
          </div>
          
          <div className="metric" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div className="metricIcon green" style={{ width: '40px', height: '40px', borderRadius: '10px', display: 'grid', placeItems: 'center', fontSize: '18px', background: 'rgba(24, 169, 121, 0.1)', color: '#18a979' }}>✓</div>
            <div>
              <b style={{ fontSize: '20px', display: 'block', color: 'var(--title-color)' }}>{selectedRole === "Nhân viên mới" ? "68%" : "100%"}</b>
              <small style={{ color: 'var(--text-muted)', fontSize: '10.5px', fontWeight: 'bold' }}>
                {lang === "vi" ? "Tiến độ Onboarding" : "Onboarding progress"}
              </small>
            </div>
          </div>

          <div className="metric" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div className="metricIcon blue" style={{ width: '40px', height: '40px', borderRadius: '10px', display: 'grid', placeItems: 'center', fontSize: '18px', background: 'rgba(62, 128, 227, 0.1)', color: '#3e80e3' }}>🎓</div>
            <div>
              <b style={{ fontSize: '20px', display: 'block', color: 'var(--title-color)' }}>{filteredCourses.length}</b>
              <small style={{ color: 'var(--text-muted)', fontSize: '10.5px', fontWeight: 'bold' }}>
                {lang === "vi" ? "Khóa học có sẵn" : "Active courses"}
              </small>
            </div>
          </div>
        </div>
      </section>

      {/* ACADEMY SECTION */}
      <section className="container" style={{ marginTop: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '850', color: 'var(--title-color)', margin: 0 }}>
              {lang === "vi" ? "Học viện POPTech" : "POPTech Academy"}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
              {lang === "vi" ? "Khóa học theo vai trò giúp nhân sự làm việc và tư vấn sản phẩm nhanh hơn." : "Role-based training courses to accelerate execution and customer consultations."}
            </p>
          </div>
          <a 
            href="#courses" 
            onClick={(e) => { e.preventDefault(); alert(lang === "vi" ? "Tính năng đang được phát triển thêm!" : "More courses coming soon!"); }}
            style={{ fontSize: '13px', fontWeight: 'bold', color: '#6d4df5', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
          >
            {lang === "vi" ? "Khám phá tất cả" : "Explore all"} →
          </a>
        </div>

        <div className="coursesGrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {filteredCourses.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', color: 'var(--text-muted)' }}>
              {lang === "vi" ? "Không có khóa học nào cho vai trò này." : "No courses assigned to this role."}
            </div>
          ) : (
            filteredCourses.map((course) => (
              <a 
                key={course.id}
                href={course.url}
                target="_blank"
                rel="noreferrer"
                className="courseCard"
                style={{ 
                  background: 'var(--card-bg)', 
                  border: '1px solid var(--card-border)', 
                  borderRadius: '16px', 
                  overflow: 'hidden', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  textDecoration: 'none',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
              >
                {/* Course Cover Gradient */}
                <div className={`courseCover ${course.color}`} style={{ padding: '20px', position: 'relative', height: '110px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '9px', fontWeight: '900', color: 'rgba(255,255,255,0.7)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    POPTECH ACADEMY
                  </span>
                  <h3 style={{ fontSize: '15.5px', fontWeight: '850', color: '#fff', margin: '8px 0 0', lineHeight: 1.35, paddingRight: '36px', maxWidth: '85%' }}>
                    {lang === "vi" ? course.title : course.titleEn}
                  </h3>
                  
                  {/* Play Button */}
                  <div className="coursePlayBtn" style={{ 
                    position: 'absolute', 
                    right: '16px', 
                    bottom: '16px', 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    background: '#fff', 
                    color: '#000', 
                    display: 'grid', 
                    placeItems: 'center', 
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}>
                    ▶
                  </div>
                </div>

                {/* Course Details Body */}
                <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '20px', flex: 1 }}>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                    {lang === "vi" ? course.description : course.descriptionEn}
                  </span>

                  {/* Progress Bar */}
                  <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${course.progress}%`, height: '100%', background: 'var(--pink)', borderRadius: '3px' }} />
                  </div>

                  {/* Meta Footer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                    <span>
                      {course.progress === 0 
                        ? (lang === "vi" ? "Chưa bắt đầu" : "Not started") 
                        : course.progress === 100 
                        ? (lang === "vi" ? "Đã học 100%" : "Completed 100%") 
                        : (lang === "vi" ? `Đã học ${course.progress}%` : `Learned ${course.progress}%`)}
                    </span>
                    <span style={{ color: '#6d4df5', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      {course.progress === 0 
                        ? (lang === "vi" ? "Bắt đầu" : "Start") 
                        : course.progress === 100 
                        ? (lang === "vi" ? "Hoàn thành" : "Completed") 
                        : (lang === "vi" ? "Tiếp tục" : "Continue")} →
                    </span>
                  </div>
                </div>
              </a>
            ))
          )}
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
      <section className="portalDirectorySection" style={{ marginBottom: '64px' }}>
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
                  ? "Không tìm thấy kết quả phù hợp với từ khóa tìm kiếm của bạn. Hãy thử từ khóa khác hoặc vai trò khác!"
                  : "We couldn't find any links matching your search criteria. Please try another keyword or select another role!"}
              </p>
              {(searchQuery || selectedRole !== "Tất cả") && (
                <button
                  type="button"
                  className="primaryBtn clearBtn"
                  onClick={() => { setSearchQuery(""); setSelectedRole("Tất cả"); }}
                >
                  {lang === "vi" ? "Xóa toàn bộ bộ lọc" : "Clear All Filters"}
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
