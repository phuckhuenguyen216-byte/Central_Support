"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";
import { Logo } from "@/components/Logo";
import { portalLinks, PortalLink, PortalCourse, portalCourses } from "@/lib/portalData";

const AVAILABLE_ROLES = ["all", "Sales", "Marketing", "Developer", "Leader / PM", "Nhân viên mới"];

export default function AdminPage() {
  const { lang, setLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [links, setLinks] = useState<PortalLink[]>([]);
  const [courses, setCourses] = useState<PortalCourse[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<PortalLink | null>(null);
  const [editingCourse, setEditingCourse] = useState<PortalCourse | null>(null);

  // Tab state
  const [adminTab, setAdminTab] = useState<"links" | "courses">("links");

  // Login states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Form states for managing links
  const [formName, setFormName] = useState("");
  const [formNameEn, setFormNameEn] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [formCategory, setFormCategory] = useState<PortalLink["category"]>("ops");
  const [formPurpose, setFormPurpose] = useState("");
  const [formPurposeEn, setFormPurposeEn] = useState("");
  const [formIcon, setFormIcon] = useState("globe");
  const [iconSource, setIconSource] = useState<"preset" | "url" | "upload">("preset");
  const [formRoles, setFormRoles] = useState<string[]>(["all"]);

  // Form states for Courses
  const [courseTitle, setCourseTitle] = useState("");
  const [courseTitleEn, setCourseTitleEn] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [courseDescEn, setCourseDescEn] = useState("");
  const [courseColor, setCourseColor] = useState<PortalCourse["color"]>("c1");
  const [courseProgress, setCourseProgress] = useState(0);
  const [courseUrl, setCourseUrl] = useState("https://");
  const [courseRole, setCourseRole] = useState("Tất cả");

  // Handle uploaded image file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 500KB)
      if (file.size > 512 * 1024) {
        alert(lang === "vi" 
          ? "Kích thước ảnh quá lớn! Vui lòng chọn ảnh nhỏ hơn 500KB để lưu trữ." 
          : "Image size is too large! Please choose an image smaller than 500KB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setFormIcon(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Check login session on mount
  useEffect(() => {
    const authSession = sessionStorage.getItem("sz_admin_auth");
    if (authSession === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  // Load links and courses from localStorage on mount
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
    }

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

  // Handle credentials check submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === "poptech_admin" && password === "poptech@support2026") {
      sessionStorage.setItem("sz_admin_auth", "true");
      setIsLoggedIn(true);
      setLoginError("");
      setUsername("");
      setPassword("");
    } else {
      setLoginError(
        lang === "vi"
          ? "Tên đăng nhập hoặc mật khẩu không chính xác!"
          : "Invalid username or password!"
      );
    }
  };

  // Handle Logout
  const handleLogout = () => {
    sessionStorage.removeItem("sz_admin_auth");
    setIsLoggedIn(false);
  };

  // Save links database utility
  const saveLinks = (updatedLinks: PortalLink[]) => {
    setLinks(updatedLinks);
    localStorage.setItem("sz_portal_links", JSON.stringify(updatedLinks));
  };

  // Save Courses database utility
  const saveCourses = (updatedCourses: PortalCourse[]) => {
    setCourses(updatedCourses);
    localStorage.setItem("sz_portal_courses", JSON.stringify(updatedCourses));
  };

  // Open modal for adding new link or course
  const handleAddClick = () => {
    if (adminTab === "links") {
      setEditingLink(null);
      setFormName("");
      setFormNameEn("");
      setFormUrl("https://");
      setFormCategory("ops");
      setFormPurpose("");
      setFormPurposeEn("");
      setFormIcon("globe");
      setIconSource("preset");
      setFormRoles(["all"]);
    } else if (adminTab === "courses") {
      setEditingCourse(null);
      setCourseTitle("");
      setCourseTitleEn("");
      setCourseDesc("");
      setCourseDescEn("");
      setCourseColor("c1");
      setCourseProgress(0);
      setCourseUrl("https://");
      setCourseRole("Tất cả");
    }
    setIsModalOpen(true);
  };

  // Open modal for editing existing link
  const handleEditClick = (link: PortalLink) => {
    setEditingLink(link);
    setFormName(link.name);
    setFormNameEn(link.nameEn);
    setFormUrl(link.url);
    setFormCategory(link.category);
    setFormPurpose(link.purpose);
    setFormPurposeEn(link.purposeEn);
    setFormIcon(link.icon);
    setFormRoles(link.roles || ["all"]);
    
    if (link.icon && link.icon.startsWith("data:")) {
      setIconSource("upload");
    } else if (link.icon && (link.icon.startsWith("http://") || link.icon.startsWith("https://"))) {
      setIconSource("url");
    } else {
      setIconSource("preset");
    }
    
    setIsModalOpen(true);
  };

  // Open modal for editing course
  const handleEditCourseClick = (course: PortalCourse) => {
    setEditingCourse(course);
    setCourseTitle(course.title);
    setCourseTitleEn(course.titleEn);
    setCourseDesc(course.description);
    setCourseDescEn(course.descriptionEn);
    setCourseColor(course.color);
    setCourseProgress(course.progress);
    setCourseUrl(course.url);
    setCourseRole(course.role);
    setIsModalOpen(true);
  };

  // Submit form (add or edit)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (adminTab === "links") {
      if (editingLink) {
        // Edit Mode
        const updated = links.map((link) => {
          if (link.id === editingLink.id) {
            return {
              ...link,
              name: formName,
              nameEn: formNameEn,
              url: formUrl,
              category: formCategory,
              purpose: formPurpose,
              purposeEn: formPurposeEn,
              icon: formIcon,
              roles: formRoles,
            };
          }
          return link;
        });
        saveLinks(updated);
      } else {
        // Add Mode
        const newId = links.length > 0 ? Math.max(...links.map((l) => l.id)) + 1 : 1;
        const newLink: PortalLink = {
          id: newId,
          name: formName,
          nameEn: formNameEn,
          url: formUrl,
          category: formCategory,
          purpose: formPurpose,
          purposeEn: formPurposeEn,
          icon: formIcon,
          isLocked: false,
          roles: formRoles,
        };
        saveLinks([...links, newLink]);
      }
    } else if (adminTab === "courses") {
      if (editingCourse) {
        // Edit Mode
        const updated = courses.map((c) => {
          if (c.id === editingCourse.id) {
            return {
              ...c,
              title: courseTitle,
              titleEn: courseTitleEn,
              description: courseDesc,
              descriptionEn: courseDescEn,
              color: courseColor,
              progress: courseProgress,
              url: courseUrl,
              role: courseRole,
            };
          }
          return c;
        });
        saveCourses(updated);
      } else {
        // Add Mode
        const newId = courses.length > 0 ? Math.max(...courses.map((c) => c.id)) + 1 : 1;
        const newCourse: PortalCourse = {
          id: newId,
          title: courseTitle,
          titleEn: courseTitleEn,
          description: courseDesc,
          descriptionEn: courseDescEn,
          color: courseColor,
          progress: courseProgress,
          url: courseUrl,
          role: courseRole,
        };
        saveCourses([...courses, newCourse]);
      }
    }

    setIsModalOpen(false);
  };

  // Toggle lock/unlock status of a link
  const handleToggleLock = (id: number) => {
    const updated = links.map((link) => {
      if (link.id === id) {
        return { ...link, isLocked: !link.isLocked };
      }
      return link;
    });
    saveLinks(updated);
  };

  // Delete a link
  const handleDeleteLink = (id: number) => {
    const confirmMsg =
      lang === "vi"
        ? "Bạn có chắc chắn muốn xóa liên kết này?"
        : "Are you sure you want to delete this link?";
    if (confirm(confirmMsg)) {
      const updated = links.filter((link) => link.id !== id);
      saveLinks(updated);
    }
  };

  // Delete a course
  const handleDeleteCourse = (id: number) => {
    const confirmMsg =
      lang === "vi"
        ? "Bạn có chắc chắn muốn xóa khóa học này?"
        : "Are you sure you want to delete this course?";
    if (confirm(confirmMsg)) {
      const updated = courses.filter((c) => c.id !== id);
      saveCourses(updated);
    }
  };

  // Reset to default database configurations
  const handleResetData = () => {
    const confirmMsg =
      lang === "vi"
        ? "Khôi phục lại toàn bộ dữ liệu gốc ban đầu cho liên kết và khóa học?"
        : "Reset all links and courses to default?";
    if (confirm(confirmMsg)) {
      saveLinks(portalLinks);
      saveCourses(portalCourses);
    }
  };

  // 1. RENDER ADMIN LOGIN PAGE (If not authenticated)
  if (!isLoggedIn) {
    return (
      <div className="portalPageWrapper adminLoginPage">
        <div className="portalBgGrid" />
        <div className="portalBgGlow pg1" />

        <div className="loginContainer">
          <div className="loginCard">
            <div className="loginCardHeader">
              <Logo />
              <h2>{lang === "vi" ? "Trang quản trị hệ thống" : "Admin Console"}</h2>
              <p>{lang === "vi" ? "Đăng nhập bằng tài khoản quản trị POPTech" : "Access the centralized system manager"}</p>
            </div>

            {loginError && <div className="loginErrorMessage">{loginError}</div>}

            <form onSubmit={handleLoginSubmit} className="loginForm">
              <label>
                {lang === "vi" ? "Tên tài khoản" : "Username"}
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="E.g., admin_poptech"
                  required
                />
              </label>

              <label>
                {lang === "vi" ? "Mật khẩu" : "Password"}
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </label>

              <button type="submit" className="primaryBtn loginSubmitBtn">
                {lang === "vi" ? "Xác nhận Đăng nhập" : "Sign In Console"}
              </button>
            </form>

            <div className="loginCardFooter">
              <Link href="/">
                ← {lang === "vi" ? "Quay lại trang chính" : "Back to Home Portal"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. RENDER FULL BEAUTIFUL ADMIN CONTROL PANEL (If authenticated)
  return (
    <div className="adminPageWrapper">
      {/* Background grids */}
      <div className="portalBgGrid" />

      {/* ADMIN NAVBAR */}
      <header className="portalHeader adminHeader">
        <div className="container headerInner">
          <Logo />
          <div className="headerActions">
            {/* Theme Toggle Button */}
            <button
              type="button"
              className="themeToggleBtn"
              onClick={toggleTheme}
              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
              aria-label="Toggle theme"
              style={{ marginRight: '4px' }}
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

            {/* Lang switch */}
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
            {/* Logout button */}
            <button onClick={handleLogout} className="adminLogoutBtn">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>{lang === "vi" ? "ĐĂNG XUẤT" : "LOGOUT"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* DASHBOARD CONTAINER */}
      <main className="container adminDashboard">
        <div className="adminDashboardHead">
          <div>
            <h1>{lang === "vi" ? "Trang quản trị Central Control" : "Central Portal Console"}</h1>
            <p>
              {adminTab === "links" ? (
                lang === "vi"
                  ? "Thêm, chỉnh sửa, xóa và khóa trạng thái liên kết hiển thị trên trang chủ."
                  : "Add, edit, remove or toggle display lock for portal shortcuts in real-time."
              ) : (
                lang === "vi"
                  ? "Quản lý các khóa học học tập nội bộ POPTech Academy cho nhân sự."
                  : "Manage internal training courses for POPTech Academy."
              )}
            </p>
          </div>
          <div className="adminDashboardActions">
            <button
              type="button"
              className="primaryBtn adminResetBtn"
              onClick={handleResetData}
            >
              🔄 {lang === "vi" ? "Khôi phục dữ liệu gốc" : "Reset Default Data"}
            </button>
            <button
              type="button"
              className="primaryBtn addLinkBtn"
              onClick={handleAddClick}
            >
              ＋ {adminTab === "links" 
                    ? (lang === "vi" ? "Thêm liên kết mới" : "Add New Link") 
                    : (lang === "vi" ? "Thêm khóa học mới" : "Add New Course")}
            </button>
          </div>
        </div>

        {/* TAB SWITCHER */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--card-border)', paddingBottom: '12px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`primaryBtn ${adminTab === "links" ? "" : "adminResetBtn"}`}
            onClick={() => setAdminTab("links")}
            style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            🔗 {lang === "vi" ? "Liên kết trang web" : "Web Links"} ({links.length})
          </button>
          <button
            type="button"
            className={`primaryBtn ${adminTab === "courses" ? "" : "adminResetBtn"}`}
            onClick={() => setAdminTab("courses")}
            style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            🎓 {lang === "vi" ? "Học viện & Khóa học" : "Ecosystem Academy"} ({courses.length})
          </button>
        </div>

        {/* LINKS DIRECTORY TABLE CARD */}
        <div className="adminTableCard">
          <div className="adminTableResponsive">
            {adminTab === "links" && (
              <table className="adminTable">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>{lang === "vi" ? "Tên hiển thị" : "Display Name"}</th>
                    <th>URL</th>
                    <th>{lang === "vi" ? "Phân nhóm" : "Category"}</th>
                    <th>{lang === "vi" ? "Mục đích sử dụng" : "Purpose of Use"}</th>
                    <th>{lang === "vi" ? "Trạng thái" : "Status"}</th>
                    <th style={{ textAlign: "center" }}>{lang === "vi" ? "Hành động" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody>
                  {links.map((link) => (
                    <tr key={link.id}>
                      <td><b>{link.id}</b></td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          {link.icon && (link.icon.startsWith("data:") || link.icon.startsWith("http://") || link.icon.startsWith("https://")) ? (
                            <img 
                              src={link.icon} 
                              alt={link.name} 
                              style={{ width: "16px", height: "16px", objectFit: "contain", borderRadius: "3px" }} 
                            />
                          ) : (
                            <span style={{ fontSize: "14px" }}>🌐</span>
                          )}
                          <div>
                            <strong style={{ color: "var(--foreground)" }}>
                              {lang === "vi" ? link.name : link.nameEn}
                            </strong>
                            {link.roles && link.roles.length > 0 && (
                              <div style={{ display: "flex", gap: "4px", marginTop: "3px", flexWrap: "wrap" }}>
                                {link.roles.map(role => (
                                  <span key={role} style={{ fontSize: "8px", background: "rgba(255,255,255,0.06)", padding: "1px 4px", borderRadius: "3px", color: "var(--text-muted)", fontWeight: "bold" }}>
                                    {role === "all" ? "ALL" : role.toUpperCase()}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <a href={link.url} target="_blank" rel="noreferrer" className="adminTableUrl">
                          {link.url}
                        </a>
                      </td>
                      <td>
                        <span className={`adminCatBadge ${link.category === "ops" ? "cat-ops" : link.category === "data" ? "cat-data" : link.category === "social" ? "cat-social" : "cat-public"}`}>
                          {link.category === "ops" ? (lang === "vi" ? "VẬN HÀNH" : "OPERATIONS") : link.category === "data" ? (lang === "vi" ? "DỮ LIỆU" : "DATA & REPORT") : link.category === "social" ? (lang === "vi" ? "TRUYỀN THÔNG" : "COMMUNICATION") : (lang === "vi" ? "CÔNG CỘNG" : "PUBLIC SITE")}
                        </span>
                      </td>
                      <td>
                        <div className="adminTablePurpose">
                          {lang === "vi" ? link.purpose : link.purposeEn}
                        </div>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleToggleLock(link.id)}
                          className={`adminStatusToggleBtn ${link.isLocked ? "isLocked" : "isActive"}`}
                        >
                          {link.isLocked ? (lang === "vi" ? "Đã Khóa" : "Locked") : (lang === "vi" ? "Hoạt động" : "Active")}
                        </button>
                      </td>
                      <td>
                        <div className="adminTableActionsCell">
                          <button
                            type="button"
                            className="adminActionBtn editBtn"
                            onClick={() => handleEditClick(link)}
                          >
                            {lang === "vi" ? "Sửa" : "Edit"}
                          </button>
                          <button
                            type="button"
                            className="adminActionBtn deleteBtn"
                            onClick={() => handleDeleteLink(link.id)}
                          >
                            {lang === "vi" ? "Xóa" : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {adminTab === "courses" && (
              <table className="adminTable">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>{lang === "vi" ? "Tên khóa học" : "Course Title"}</th>
                    <th>{lang === "vi" ? "Mô tả khóa học" : "Description"}</th>
                    <th>{lang === "vi" ? "Tiến độ học" : "Progress"}</th>
                    <th>URL</th>
                    <th>{lang === "vi" ? "Vai trò" : "Role"}</th>
                    <th style={{ textAlign: "center" }}>{lang === "vi" ? "Hành động" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id}>
                      <td><b>{course.id}</b></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className={`metricIcon ${course.color}`} style={{ width: '24px', height: '24px', borderRadius: '6px', display: 'grid', placeItems: 'center', fontSize: '11px', color: '#fff', fontWeight: 'bold' }}>
                            🎓
                          </span>
                          <div>
                            <strong style={{ color: 'var(--foreground)' }}>
                              {lang === "vi" ? course.title : course.titleEn}
                            </strong>
                          </div>
                        </div>
                      </td>
                      <td>{lang === "vi" ? course.description : course.descriptionEn}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '60px', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${course.progress}%`, height: '100%', background: 'var(--pink)' }} />
                          </div>
                          <span style={{ fontSize: '11px', fontWeight: 'bold' }}>{course.progress}%</span>
                        </div>
                      </td>
                      <td>
                        <a href={course.url} target="_blank" rel="noreferrer" style={{ color: 'var(--pink)', wordBreak: 'break-all', fontSize: '12px' }}>
                          {course.url}
                        </a>
                      </td>
                      <td>
                        <span style={{ fontSize: '11px', padding: '3px 6px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', fontWeight: 'bold' }}>
                          {course.role}
                        </span>
                      </td>
                      <td>
                        <div className="adminTableActionsCell">
                          <button
                            type="button"
                            className="adminActionBtn editBtn"
                            onClick={() => handleEditCourseClick(course)}
                          >
                            {lang === "vi" ? "Sửa" : "Edit"}
                          </button>
                          <button
                            type="button"
                            className="adminActionBtn deleteBtn"
                            onClick={() => handleDeleteCourse(course.id)}
                          >
                            {lang === "vi" ? "Xóa" : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* FORM MODAL DIALOG */}
      {isModalOpen && (
        <div className="adminModalOverlay" onClick={() => setIsModalOpen(false)}>
          <div className="adminModalCard" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h2>
                {adminTab === "links" ? (
                  editingLink
                    ? (lang === "vi" ? "Chỉnh sửa liên kết" : "Edit Link Details")
                    : (lang === "vi" ? "Thêm liên kết mới" : "Add New Link")
                ) : (
                  editingCourse
                    ? (lang === "vi" ? "Chỉnh sửa khóa học" : "Edit Course Details")
                    : (lang === "vi" ? "Thêm khóa học mới" : "Add New Course")
                )}
              </h2>
              <button
                type="button"
                className="closeModalBtn"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="adminModalForm">
              {adminTab === "links" && (
                <>
                  <div className="formRowGrid">
                    <label>
                      Tên hiển thị (VI)
                      <input
                        type="text"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Ví dụ: Kênh check Task"
                        required
                      />
                    </label>
                    <label>
                      Display Name (EN)
                      <input
                        type="text"
                        value={formNameEn}
                        onChange={(e) => setFormNameEn(e.target.value)}
                        placeholder="E.g., Task Checker"
                        required
                      />
                    </label>
                  </div>

                  <label>
                    Đường dẫn liên kết (URL)
                    <input
                      type="url"
                      value={formUrl}
                      onChange={(e) => setFormUrl(e.target.value)}
                      placeholder="https://example.com"
                      required
                    />
                  </label>

                  <div className="formRowGrid">
                    <label>
                      Phân nhóm danh mục (Category)
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value as PortalLink["category"])}
                      >
                        <option value="ops">{lang === "vi" ? "Vận hành nội bộ (Operations)" : "Operations (Internal)"}</option>
                        <option value="data">{lang === "vi" ? "Dữ liệu & Báo cáo (Data & Report)" : "Data & Reports"}</option>
                        <option value="social">{lang === "vi" ? "Truyền thông & Forum (Communication)" : "Communication & Forums"}</option>
                        <option value="public">{lang === "vi" ? "Website Công cộng (Public Sites)" : "Public Websites"}</option>
                      </select>
                    </label>

                    <label>
                      Nguồn biểu tượng (Icon Source)
                      <select
                        value={iconSource}
                        onChange={(e) => setIconSource(e.target.value as any)}
                      >
                        <option value="preset">{lang === "vi" ? "Chọn từ Icon có sẵn" : "Choose Preset Icon"}</option>
                        <option value="url">{lang === "vi" ? "Đường dẫn liên kết ảnh" : "Image Link URL"}</option>
                        <option value="upload">{lang === "vi" ? "Tải lên từ máy" : "Upload File"}</option>
                      </select>
                    </label>
                  </div>

                  <div className="formRowGrid">
                    {iconSource === "preset" && (
                      <label>
                        Chọn Biểu tượng (Preset Icon)
                        <select
                          value={formIcon.startsWith("data:") || formIcon.startsWith("http") ? "globe" : formIcon}
                          onChange={(e) => setFormIcon(e.target.value)}
                        >
                          <option value="globe">Globe (Mạng lưới/Trang chủ)</option>
                          <option value="lock">Lock (Bảo mật/Hệ thống)</option>
                          <option value="chart">Chart (Báo cáo/Doanh số)</option>
                          <option value="people">People (Cộng đồng/HR)</option>
                          <option value="message">Message (Chat/Truyền thông)</option>
                          <option value="folder">Folder (Kế hoạch/PM)</option>
                          <option value="play">Play (Video/Youtube)</option>
                          <option value="facebook">Facebook (Mạng xã hội)</option>
                          <option value="cloud">Cloud (Lưu trữ/Nextcloud)</option>
                        </select>
                      </label>
                    )}

                    {iconSource === "url" && (
                      <label>
                        {lang === "vi" ? "Đường dẫn ảnh (Image URL)" : "Image URL"}
                        <input
                          type="url"
                          value={formIcon.startsWith("data:") ? "https://" : formIcon}
                          onChange={(e) => setFormIcon(e.target.value)}
                          placeholder="https://example.com/logo.png"
                          required
                        />
                      </label>
                    )}

                    {iconSource === "upload" && (
                      <label>
                        {lang === "vi" ? "Tải ảnh từ máy" : "Upload Image File"}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          required={!formIcon.startsWith("data:")}
                          style={{ background: "rgba(0, 0, 0, 0.2)", border: "1px solid var(--modal-input-border)", padding: "8px 12px" }}
                        />
                        {formIcon.startsWith("data:") && (
                          <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "11px", color: "#10b981", fontWeight: "750" }}>
                              ✓ {lang === "vi" ? "Đã chọn ảnh" : "Image selected"}
                            </span>
                            <img 
                              src={formIcon} 
                              alt="Preview" 
                              style={{ width: "28px", height: "28px", objectFit: "contain", borderRadius: "4px", border: "1px solid rgba(255, 255, 255, 0.1)" }} 
                            />
                          </div>
                        )}
                      </label>
                    )}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <span style={{ fontSize: "12px", fontWeight: "800", color: "var(--text-muted)" }}>
                      {lang === "vi" ? "Vai trò được phép truy cập" : "Allowed Roles"}
                    </span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", background: "rgba(0,0,0,0.15)", padding: "10px 14px", borderRadius: "10px", border: "1px solid var(--modal-input-border)" }}>
                      {AVAILABLE_ROLES.map((role) => {
                        const isChecked = formRoles.includes(role);
                        return (
                          <label key={role} style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "12.5px", color: "var(--foreground)" }}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                if (role === "all") {
                                  setFormRoles(["all"]);
                                } else {
                                  let updated = formRoles.filter(r => r !== "all");
                                  if (isChecked) {
                                    updated = updated.filter(r => r !== role);
                                    if (updated.length === 0) updated = ["all"];
                                  } else {
                                    updated = [...updated, role];
                                  }
                                  setFormRoles(updated);
                                }
                              }}
                              style={{ cursor: "pointer" }}
                            />
                            <span>{role === "all" ? (lang === "vi" ? "Tất cả" : "All") : role}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <label>
                    Mục đích sử dụng (VI)
                    <textarea
                      value={formPurpose}
                      onChange={(e) => setFormPurpose(e.target.value)}
                      placeholder="Mô tả mục đích sử dụng của website..."
                      rows={2}
                      required
                    />
                  </label>

                  <label>
                    Purpose of Use (EN)
                    <textarea
                      value={formPurposeEn}
                      onChange={(e) => setFormPurposeEn(e.target.value)}
                      placeholder="Explain the purpose of this website in English..."
                      rows={2}
                      required
                    />
                  </label>
                </>
              )}

              {adminTab === "courses" && (
                <>
                  <div className="formRowGrid">
                    <label>
                      {lang === "vi" ? "Tên khóa học (VI)" : "Course Title (VI)"}
                      <input
                        type="text"
                        value={courseTitle}
                        onChange={(e) => setCourseTitle(e.target.value)}
                        placeholder="Ví dụ: Tổng quan hệ sinh thái POPTech"
                        required
                      />
                    </label>
                    <label>
                      {lang === "vi" ? "Course Title (EN)" : "Course Title (EN)"}
                      <input
                        type="text"
                        value={courseTitleEn}
                        onChange={(e) => setCourseTitleEn(e.target.value)}
                        placeholder="E.g., POPTech Ecosystem Overview"
                        required
                      />
                    </label>
                  </div>

                  <div className="formRowGrid">
                    <label>
                      {lang === "vi" ? "Mô tả / Số bài học (VI)" : "Description / Units (VI)"}
                      <input
                        type="text"
                        value={courseDesc}
                        onChange={(e) => setCourseDesc(e.target.value)}
                        placeholder="Ví dụ: Nhân sự mới · 6 bài · 45 phút"
                        required
                      />
                    </label>
                    <label>
                      {lang === "vi" ? "Description / Units (EN)" : "Description / Units (EN)"}
                      <input
                        type="text"
                        value={courseDescEn}
                        onChange={(e) => setCourseDescEn(e.target.value)}
                        placeholder="E.g., New Hire · 6 units · 45 mins"
                        required
                      />
                    </label>
                  </div>

                  <div className="formRowGrid">
                    <label>
                      {lang === "vi" ? "Màu sắc bìa gradient" : "Cover Gradient Color"}
                      <select
                        value={courseColor}
                        onChange={(e) => setCourseColor(e.target.value as any)}
                      >
                        <option value="c1">Tím (Purple)</option>
                        <option value="c2">Xanh dương (Blue)</option>
                        <option value="c3">Cam (Orange)</option>
                        <option value="c4">Xanh lá (Green)</option>
                        <option value="c5">Hồng (Pink)</option>
                        <option value="c6">Xanh ngọc (Teal)</option>
                      </select>
                    </label>

                    <label>
                      {lang === "vi" ? "Tiến độ học (%)" : "Progress (%)"}
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={courseProgress}
                        onChange={(e) => setCourseProgress(parseInt(e.target.value) || 0)}
                        required
                      />
                    </label>
                  </div>

                  <div className="formRowGrid">
                    <label>
                      {lang === "vi" ? "Đường dẫn bài học (URL)" : "Lesson Link (URL)"}
                      <input
                        type="url"
                        value={courseUrl}
                        onChange={(e) => setCourseUrl(e.target.value)}
                        placeholder="https://youtube.com/..."
                        required
                      />
                    </label>

                    <label>
                      {lang === "vi" ? "Vai trò được gán" : "Assigned Role"}
                      <select
                        value={courseRole}
                        onChange={(e) => setCourseRole(e.target.value)}
                      >
                        <option value="Tất cả">{lang === "vi" ? "Tất cả" : "All"}</option>
                        <option value="Sales">Sales</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Developer">Developer</option>
                        <option value="Leader / PM">Leader / PM</option>
                        <option value="Nhân viên mới">{lang === "vi" ? "Nhân viên mới" : "New Hire"}</option>
                      </select>
                    </label>
                  </div>
                </>
              )}

              <div className="modalFormActions">
                <button
                  type="button"
                  className="secondaryBtn cancelBtn"
                  onClick={() => setIsModalOpen(false)}
                >
                  {lang === "vi" ? "Hủy" : "Cancel"}
                </button>
                <button type="submit" className="primaryBtn submitBtn">
                  {lang === "vi" ? "Xác nhận & Lưu" : "Confirm & Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
