"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { Logo } from "@/components/Logo";
import { portalLinks, PortalLink } from "@/lib/portalData";

export default function AdminPage() {
  const { lang, setLang } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [links, setLinks] = useState<PortalLink[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<PortalLink | null>(null);

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

  // Check login session on mount
  useEffect(() => {
    const authSession = sessionStorage.getItem("sz_admin_auth");
    if (authSession === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  // Load links from localStorage on mount
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

  // Open modal for adding new link
  const handleAddClick = () => {
    setEditingLink(null);
    setFormName("");
    setFormNameEn("");
    setFormUrl("https://");
    setFormCategory("ops");
    setFormPurpose("");
    setFormPurposeEn("");
    setFormIcon("globe");
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
    setIsModalOpen(true);
  };

  // Submit form (add or edit)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingLink) {
      // Edit mode
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
          };
        }
        return link;
      });
      saveLinks(updated);
    } else {
      // Add mode
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
      };
      saveLinks([...links, newLink]);
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

  // Reset to default spreadsheet database
  const handleResetData = () => {
    const confirmMsg =
      lang === "vi"
        ? "Khôi phục lại dữ liệu gốc ban đầu từ Google Sheet?"
        : "Reset to default database from Google Sheets?";
    if (confirm(confirmMsg)) {
      saveLinks(portalLinks);
    }
  };

  // 1. RENDER ADMIN LOGIN PAGE (If not authenticated)
  if (!isLoggedIn) {
    return (
      <div className="adminPageWrapper loginScreen">
        <div className="portalBgGrid" />
        <div className="portalBgGlow pg1" />
        <div className="portalBgGlow pg2" />

        <div className="loginCardContainer">
          <div className="loginCard">
            <div className="loginCardHeader">
              <Logo />
              <h2>{lang === "vi" ? "Đăng nhập Quản trị" : "Admin Authentication"}</h2>
              <p>
                {lang === "vi"
                  ? "Nhập tài khoản để truy cập chức năng điều khiển liên kết."
                  : "Please input credentials to manage Central Portal database."}
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="loginForm">
              {loginError && <div className="loginErrorMessage">⚠️ {loginError}</div>}
              
              <label>
                {lang === "vi" ? "Tên tài khoản (Username)" : "Username"}
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="E.g., poptech_admin"
                  required
                />
              </label>

              <label>
                {lang === "vi" ? "Mật khẩu (Password)" : "Password"}
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
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
              {lang === "vi"
                ? "Thêm, chỉnh sửa, xóa và khóa trạng thái liên kết hiển thị trên trang chủ."
                : "Add, edit, remove or toggle display lock for portal shortcuts in real-time."}
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
              ＋ {lang === "vi" ? "Thêm liên kết mới" : "Add New Link"}
            </button>
          </div>
        </div>

        {/* LINKS DIRECTORY TABLE CARD */}
        <div className="adminTableCard">
          <div className="adminTableResponsive">
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
                  <tr key={link.id} className={link.isLocked ? "rowLocked" : ""}>
                    <td><b>{link.id}</b></td>
                    <td>
                      <div className="adminTableNameCell">
                        <span className="adminTableIcon">
                          {link.icon === "check" ? "✓" : link.icon === "cpu" ? "⚙" : "🌐"}
                        </span>
                        <div>
                          <strong>{lang === "vi" ? link.name : link.nameEn}</strong>
                          <small>{lang === "vi" ? link.nameEn : link.name}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <a href={link.url} target="_blank" rel="noreferrer" className="adminTableUrl">
                        {link.url}
                      </a>
                    </td>
                    <td>
                      <span className={`adminCatBadge cat-${link.category}`}>
                        {link.category.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div className="adminTablePurposeCell">
                        <span>{lang === "vi" ? link.purpose : link.purposeEn}</span>
                      </div>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleToggleLock(link.id)}
                        className={`adminStatusToggleBtn ${link.isLocked ? "isLocked" : "isActive"}`}
                      >
                        {link.isLocked ? (
                          <>🔒 {lang === "vi" ? "Đã Khóa" : "Locked"}</>
                        ) : (
                          <>🔓 {lang === "vi" ? "Hoạt động" : "Active"}</>
                        )}
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
          </div>
        </div>
      </main>

      {/* FORM MODAL DIALOG */}
      {isModalOpen && (
        <div className="adminModalOverlay" onClick={() => setIsModalOpen(false)}>
          <div className="adminModalCard" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h2>
                {editingLink
                  ? (lang === "vi" ? "Chỉnh sửa liên kết" : "Edit Link Details")
                  : (lang === "vi" ? "Thêm liên kết mới" : "Add New Link")}
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
                    <option value="ops">Hệ thống & KPI (OPS)</option>
                    <option value="data">Đấu thầu & Dữ liệu (DATA)</option>
                    <option value="social">Mạng xã hội & Cộng đồng (SOCIAL)</option>
                    <option value="storage">Lưu trữ đám mây (STORAGE)</option>
                    <option value="public">Trang thông tin doanh nghiệp (PUBLIC)</option>
                  </select>
                </label>

                <label>
                  Biểu tượng Icon
                  <select value={formIcon} onChange={(e) => setFormIcon(e.target.value)}>
                    <option value="globe">Globe (Mặc định)</option>
                    <option value="check">Checkmark (Kiểm tra task)</option>
                    <option value="user">User (Tài khoản/Tư vấn)</option>
                    <option value="message">Message (Diễn đàn/Chat)</option>
                    <option value="cpu">CPU (Trí tuệ nhân tạo AI)</option>
                    <option value="search">Search (Đấu thầu/Tìm thầu)</option>
                    <option value="shield">Shield (Bảo mật/Xác minh)</option>
                    <option value="chart">Chart (Thống kê/Báo cáo)</option>
                    <option value="folder">Folder (Kế hoạch/PM)</option>
                    <option value="play">Play (Video/Youtube)</option>
                    <option value="facebook">Facebook (Mạng xã hội)</option>
                    <option value="cloud">Cloud (Lưu trữ/Nextcloud)</option>
                  </select>
                </label>
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
