"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";
import { Logo } from "@/components/Logo";
import { portalLinks, PortalLink, PortalTask, PortalAnnouncement, portalTasks, portalAnnouncements, PortalCourse, portalCourses } from "@/lib/portalData";

const AVAILABLE_ROLES = ["all", "Sales", "Marketing", "Developer", "Leader / PM", "Nhân viên mới"];

export default function AdminPage() {
  const { lang, setLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [links, setLinks] = useState<PortalLink[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<PortalLink | null>(null);

  // Tab state
  const [adminTab, setAdminTab] = useState<"links" | "tasks" | "announcements" | "courses">("links");

  // Task, Announcement & Course states
  const [tasks, setTasks] = useState<PortalTask[]>([]);
  const [announcements, setAnnouncements] = useState<PortalAnnouncement[]>([]);
  const [courses, setCourses] = useState<PortalCourse[]>([]);
  const [editingTask, setEditingTask] = useState<PortalTask | null>(null);
  const [editingAnn, setEditingAnn] = useState<PortalAnnouncement | null>(null);
  const [editingCourse, setEditingCourse] = useState<PortalCourse | null>(null);

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

  // Form states for Tasks
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [taskCategory, setTaskCategory] = useState<PortalTask["category"]>("normal");
  const [taskRole, setTaskRole] = useState("Sales");

  // Form states for Announcements
  const [annType, setAnnType] = useState("📣");
  const [annTitle, setAnnTitle] = useState("");
  const [annContent, setAnnContent] = useState("");
  const [annTime, setAnnTime] = useState("");
  const [annRole, setAnnRole] = useState("Tất cả");

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

  // Load links, tasks, announcements and courses from localStorage on mount
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

    const savedTasks = localStorage.getItem("sz_portal_tasks");
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (e) {
        setTasks(portalTasks);
      }
    } else {
      setTasks(portalTasks);
      localStorage.setItem("sz_portal_tasks", JSON.stringify(portalTasks));
    }

    const savedAnn = localStorage.getItem("sz_portal_announcements");
    if (savedAnn) {
      try {
        setAnnouncements(JSON.parse(savedAnn));
      } catch (e) {
        setAnnouncements(portalAnnouncements);
      }
    } else {
      setAnnouncements(portalAnnouncements);
      localStorage.setItem("sz_portal_announcements", JSON.stringify(portalAnnouncements));
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

  // Open modal for adding new link
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
    } else if (adminTab === "tasks") {
      setEditingTask(null);
      setTaskTitle("");
      setTaskDeadline("");
      setTaskCategory("normal");
      setTaskRole("Sales");
    } else if (adminTab === "announcements") {
      setEditingAnn(null);
      setAnnType("📣");
      setAnnTitle("");
      setAnnContent("");
      setAnnTime(lang === "vi" ? "Mới đây" : "Just now");
      setAnnRole("Tất cả");
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
    
    // Determine icon source based on format
    if (link.icon && link.icon.startsWith("data:")) {
      setIconSource("upload");
    } else if (link.icon && (link.icon.startsWith("http://") || link.icon.startsWith("https://"))) {
      setIconSource("url");
    } else {
      setIconSource("preset");
    }
    
    setIsModalOpen(true);
  };

  // Save Tasks database utility
  const saveTasks = (updatedTasks: PortalTask[]) => {
    setTasks(updatedTasks);
    localStorage.setItem("sz_portal_tasks", JSON.stringify(updatedTasks));
  };

  // Save Announcements database utility
  const saveAnnouncements = (updatedAnn: PortalAnnouncement[]) => {
    setAnnouncements(updatedAnn);
    localStorage.setItem("sz_portal_announcements", JSON.stringify(updatedAnn));
  };

  // Save Courses database utility
  const saveCourses = (updatedCourses: PortalCourse[]) => {
    setCourses(updatedCourses);
    localStorage.setItem("sz_portal_courses", JSON.stringify(updatedCourses));
  };

  // Open modal for editing task
  const handleEditTaskClick = (task: PortalTask) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDeadline(task.deadline);
    setTaskCategory(task.category);
    setTaskRole(task.role);
    setIsModalOpen(true);
  };

  // Open modal for editing announcement
  const handleEditAnnClick = (ann: PortalAnnouncement) => {
    setEditingAnn(ann);
    setAnnType(ann.type);
    setAnnTitle(ann.title);
    setAnnContent(ann.content);
    setAnnTime(ann.time);
    setAnnRole(ann.role);
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
    } else if (adminTab === "tasks") {
      if (editingTask) {
        // Edit Mode
        const updated = tasks.map((t) => {
          if (t.id === editingTask.id) {
            return {
              ...t,
              title: taskTitle,
              deadline: taskDeadline,
              category: taskCategory,
              role: taskRole,
            };
          }
          return t;
        });
        saveTasks(updated);
      } else {
        // Add Mode
        const newId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
        const newTask: PortalTask = {
          id: newId,
          title: taskTitle,
          deadline: taskDeadline,
          category: taskCategory,
          isDone: false,
          role: taskRole,
        };
        saveTasks([...tasks, newTask]);
      }
    } else if (adminTab === "announcements") {
      if (editingAnn) {
        // Edit Mode
        const updated = announcements.map((a) => {
          if (a.id === editingAnn.id) {
            return {
              ...a,
              type: annType,
              title: annTitle,
              content: annContent,
              time: annTime,
              role: annRole,
            };
          }
          return a;
        });
        saveAnnouncements(updated);
      } else {
        // Add Mode
        const newId = announcements.length > 0 ? Math.max(...announcements.map((a) => a.id)) + 1 : 1;
        const newAnn: PortalAnnouncement = {
          id: newId,
          type: annType,
          title: annTitle,
          content: annContent,
          time: annTime,
          role: annRole,
        };
        saveAnnouncements([...announcements, newAnn]);
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

  // Toggle complete status of a task
  const handleToggleTaskDone = (id: number) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, isDone: !t.isDone } : t));
    saveTasks(updated);
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

  // Delete a task
  const handleDeleteTask = (id: number) => {
    const confirmMsg =
      lang === "vi"
        ? "Bạn có chắc chắn muốn xóa công việc này?"
        : "Are you sure you want to delete this task?";
    if (confirm(confirmMsg)) {
      const updated = tasks.filter((t) => t.id !== id);
      saveTasks(updated);
    }
  };

  // Delete an announcement
  const handleDeleteAnn = (id: number) => {
    const confirmMsg =
      lang === "vi"
        ? "Bạn có chắc chắn muốn xóa thông báo này?"
        : "Are you sure you want to delete this announcement?";
    if (confirm(confirmMsg)) {
      const updated = announcements.filter((a) => a.id !== id);
      saveAnnouncements(updated);
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

  // Reset to default spreadsheet database
  const handleResetData = () => {
    const confirmMsg =
      lang === "vi"
        ? "Khôi phục lại toàn bộ dữ liệu gốc ban đầu cho liên kết, công việc, thông báo và khóa học?"
        : "Reset all links, tasks, announcements and courses to default?";
    if (confirm(confirmMsg)) {
      saveLinks(portalLinks);
      saveTasks(portalTasks);
      saveAnnouncements(portalAnnouncements);
      saveCourses(portalCourses);
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
              ) : adminTab === "tasks" ? (
                lang === "vi"
                  ? "Quản lý danh sách checklist công việc cá nhân của nhân sự trong công ty."
                  : "Manage the list of task checklists for company employees."
              ) : adminTab === "announcements" ? (
                lang === "vi"
                  ? "Quản lý các bản tin và thông báo nội bộ hiển thị trên bảng tin trang chủ."
                  : "Manage announcements and internal newsletters broadcasted on the home board."
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
                    : adminTab === "tasks" 
                    ? (lang === "vi" ? "Thêm công việc mới" : "Add New Task") 
                    : adminTab === "announcements"
                    ? (lang === "vi" ? "Thêm thông báo mới" : "Add Announcement")
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
            className={`primaryBtn ${adminTab === "tasks" ? "" : "adminResetBtn"}`}
            onClick={() => setAdminTab("tasks")}
            style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            ✓ {lang === "vi" ? "Checklist công việc" : "Task Checklist"} ({tasks.length})
          </button>
          <button
            type="button"
            className={`primaryBtn ${adminTab === "announcements" ? "" : "adminResetBtn"}`}
            onClick={() => setAdminTab("announcements")}
            style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            📣 {lang === "vi" ? "Thông báo nội bộ" : "Internal Announcements"} ({announcements.length})
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
                    <tr key={link.id} className={link.isLocked ? "rowLocked" : ""}>
                      <td><b>{link.id}</b></td>
                      <td>
                        <div className="adminTableNameCell">
                          <span className="adminTableIcon">
                            {link.icon && (link.icon.startsWith("http://") || link.icon.startsWith("https://") || link.icon.startsWith("data:")) ? (
                              <img src={link.icon} alt="" style={{ width: "16px", height: "16px", objectFit: "contain", borderRadius: "2px" }} />
                            ) : (
                              link.icon === "check" ? "✓" : link.icon === "cpu" ? "⚙" : "🌐"
                            )}
                          </span>
                          <div>
                            <strong>{lang === "vi" ? link.name : link.nameEn}</strong>
                            <small>{lang === "vi" ? link.nameEn : link.name}</small>
                            <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
                              {(link.roles || ["all"]).map(r => (
                                <span key={r} style={{ fontSize: '9px', padding: '2px 5px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                                  {r === "all" ? (lang === "vi" ? "Tất cả" : "All") : r}
                                </span>
                              ))}
                            </div>
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
            )}

            {adminTab === "tasks" && (
              <table className="adminTable">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>{lang === "vi" ? "Tiêu đề công việc" : "Task Title"}</th>
                    <th>{lang === "vi" ? "Hạn chót" : "Deadline"}</th>
                    <th>{lang === "vi" ? "Mức ưu tiên" : "Priority"}</th>
                    <th>{lang === "vi" ? "Vai trò" : "Role"}</th>
                    <th>{lang === "vi" ? "Trạng thái" : "Status"}</th>
                    <th style={{ textAlign: "center" }}>{lang === "vi" ? "Hành động" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id} className={task.isDone ? "rowLocked" : ""}>
                      <td><b>{task.id}</b></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button 
                            type="button"
                            onClick={() => handleToggleTaskDone(task.id)}
                            style={{ background: task.isDone ? '#6d4df5' : 'transparent', border: '1px solid #6d4df5', borderRadius: '4px', width: '18px', height: '18px', display: 'grid', placeItems: 'center', cursor: 'pointer', color: '#fff', fontSize: '10px' }}
                          >
                            {task.isDone && "✓"}
                          </button>
                          <span style={{ textDecoration: task.isDone ? 'line-through' : 'none', color: task.isDone ? 'var(--text-muted)' : 'var(--foreground)', fontWeight: 'bold' }}>
                            {task.title}
                          </span>
                        </div>
                      </td>
                      <td>{task.deadline}</td>
                      <td>
                        <span className={`adminCatBadge ${task.category === "high" ? "cat-ops" : task.category === "due" ? "cat-data" : "cat-social"}`}>
                          {task.category === "high" ? (lang === "vi" ? "ƯU TIÊN CAO" : "HIGH") : task.category === "due" ? (lang === "vi" ? "SẮP HẠN" : "DUE") : (lang === "vi" ? "BÌNH THƯỜNG" : "NORMAL")}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '11px', padding: '3px 6px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', fontWeight: 'bold' }}>
                          {task.role}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleToggleTaskDone(task.id)}
                          className={`adminStatusToggleBtn ${task.isDone ? "isLocked" : "isActive"}`}
                        >
                          {task.isDone ? (lang === "vi" ? "Xong" : "Done") : (lang === "vi" ? "Chưa xong" : "Pending")}
                        </button>
                      </td>
                      <td>
                        <div className="adminTableActionsCell">
                          <button
                            type="button"
                            className="adminActionBtn editBtn"
                            onClick={() => handleEditTaskClick(task)}
                          >
                            {lang === "vi" ? "Sửa" : "Edit"}
                          </button>
                          <button
                            type="button"
                            className="adminActionBtn deleteBtn"
                            onClick={() => handleDeleteTask(task.id)}
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

            {adminTab === "announcements" && (
              <table className="adminTable">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>{lang === "vi" ? "Biểu tượng" : "Type"}</th>
                    <th>{lang === "vi" ? "Tiêu đề" : "Title"}</th>
                    <th>{lang === "vi" ? "Nội dung thông báo" : "Announcement Content"}</th>
                    <th>{lang === "vi" ? "Thời gian" : "Time"}</th>
                    <th>{lang === "vi" ? "Vai trò" : "Role"}</th>
                    <th style={{ textAlign: "center" }}>{lang === "vi" ? "Hành động" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody>
                  {announcements.map((ann) => (
                    <tr key={ann.id}>
                      <td><b>{ann.id}</b></td>
                      <td style={{ fontSize: '18px', textAlign: 'center' }}>{ann.type}</td>
                      <td><strong style={{ color: 'var(--foreground)' }}>{ann.title}</strong></td>
                      <td>
                        <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>
                          {ann.content}
                        </div>
                      </td>
                      <td>{ann.time}</td>
                      <td>
                        <span style={{ fontSize: '11px', padding: '3px 6px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', fontWeight: 'bold' }}>
                          {ann.role}
                        </span>
                      </td>
                      <td>
                        <div className="adminTableActionsCell">
                          <button
                            type="button"
                            className="adminActionBtn editBtn"
                            onClick={() => handleEditAnnClick(ann)}
                          >
                            {lang === "vi" ? "Sửa" : "Edit"}
                          </button>
                          <button
                            type="button"
                            className="adminActionBtn deleteBtn"
                            onClick={() => handleDeleteAnn(ann.id)}
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
                ) : adminTab === "tasks" ? (
                  editingTask
                    ? (lang === "vi" ? "Chỉnh sửa công việc" : "Edit Task Details")
                    : (lang === "vi" ? "Thêm công việc mới" : "Add New Task")
                ) : adminTab === "announcements" ? (
                  editingAnn
                    ? (lang === "vi" ? "Chỉnh sửa thông báo" : "Edit Announcement Details")
                    : (lang === "vi" ? "Thêm thông báo mới" : "Add Announcement")
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
                        <option value="ops">Hệ thống & KPI (OPS)</option>
                        <option value="data">Đấu thầu & Dữ liệu (DATA)</option>
                        <option value="social">Mạng xã hội & Cộng đồng (SOCIAL)</option>
                        <option value="storage">Lưu trữ đám mây (STORAGE)</option>
                        <option value="public">Trang thông tin doanh nghiệp (PUBLIC)</option>
                      </select>
                    </label>

                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <span style={{ fontSize: "12px", fontWeight: "800", color: "var(--text-muted)" }}>
                        {lang === "vi" ? "Nguồn biểu tượng (Icon)" : "Icon Source"}
                      </span>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          type="button"
                          className={`primaryBtn ${iconSource === "preset" ? "" : "adminResetBtn"}`}
                          onClick={() => { setIconSource("preset"); setFormIcon("globe"); }}
                          style={{ padding: "8px 10px", fontSize: "11px", borderRadius: "8px", boxShadow: "none", flex: 1, justifyContent: "center" }}
                        >
                          {lang === "vi" ? "Mẫu" : "Preset"}
                        </button>
                        <button
                          type="button"
                          className={`primaryBtn ${iconSource === "url" ? "" : "adminResetBtn"}`}
                          onClick={() => { setIconSource("url"); setFormIcon("https://"); }}
                          style={{ padding: "8px 10px", fontSize: "11px", borderRadius: "8px", boxShadow: "none", flex: 1, justifyContent: "center" }}
                        >
                          URL
                        </button>
                        <button
                          type="button"
                          className={`primaryBtn ${iconSource === "upload" ? "" : "adminResetBtn"}`}
                          onClick={() => { setIconSource("upload"); setFormIcon(""); }}
                          style={{ padding: "8px 10px", fontSize: "11px", borderRadius: "8px", boxShadow: "none", flex: 1, justifyContent: "center" }}
                        >
                          {lang === "vi" ? "Tải lên" : "Upload"}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {iconSource === "preset" && (
                      <label>
                        {lang === "vi" ? "Chọn biểu tượng mẫu" : "Select Preset Icon"}
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

              {adminTab === "tasks" && (
                <>
                  <label>
                    {lang === "vi" ? "Tiêu đề công việc" : "Task Title"}
                    <input
                      type="text"
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      placeholder="Ví dụ: Gọi lại cho khách hàng..."
                      required
                    />
                  </label>

                  <div className="formRowGrid">
                    <label>
                      {lang === "vi" ? "Hạn chót" : "Deadline"}
                      <input
                        type="text"
                        value={taskDeadline}
                        onChange={(e) => setTaskDeadline(e.target.value)}
                        placeholder="Ví dụ: CRM · Hạn 16:30"
                        required
                      />
                    </label>

                    <label>
                      {lang === "vi" ? "Mức ưu tiên" : "Priority"}
                      <select
                        value={taskCategory}
                        onChange={(e) => setTaskCategory(e.target.value as any)}
                      >
                        <option value="high">{lang === "vi" ? "Ưu tiên cao" : "High"}</option>
                        <option value="due">{lang === "vi" ? "Sắp đến hạn" : "Due"}</option>
                        <option value="normal">{lang === "vi" ? "Bình thường" : "Normal"}</option>
                      </select>
                    </label>
                  </div>

                  <label>
                    {lang === "vi" ? "Vai trò được gán" : "Assigned Role"}
                    <select
                      value={taskRole}
                      onChange={(e) => setTaskRole(e.target.value)}
                    >
                      <option value="Tất cả">{lang === "vi" ? "Tất cả" : "All"}</option>
                      <option value="Sales">Sales</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Developer">Developer</option>
                      <option value="Leader / PM">Leader / PM</option>
                      <option value="Nhân viên mới">{lang === "vi" ? "Nhân viên mới" : "New Hire"}</option>
                    </select>
                  </label>
                </>
              )}

              {adminTab === "announcements" && (
                <>
                  <div className="formRowGrid">
                    <label>
                      {lang === "vi" ? "Biểu tượng cảm xúc (Emoji)" : "Emoji Icon"}
                      <select
                        value={annType}
                        onChange={(e) => setAnnType(e.target.value)}
                      >
                        <option value="📣">📣 Loa (Thông báo chung)</option>
                        <option value="🎉">🎉 Pháo hoa (Chào mừng)</option>
                        <option value="📘">📘 Sách (Tài liệu/Sales Kit)</option>
                        <option value="⚙">⚙ Bánh răng (Bảo trì/Cài đặt)</option>
                        <option value="💡">💡 Bóng đèn (Mẹo/Ý tưởng)</option>
                      </select>
                    </label>

                    <label>
                      {lang === "vi" ? "Tiêu đề thông báo" : "Announcement Title"}
                      <input
                        type="text"
                        value={annTitle}
                        onChange={(e) => setAnnTitle(e.target.value)}
                        placeholder="Ví dụ: Town Hall tháng 8"
                        required
                      />
                    </label>
                  </div>

                  <label>
                    {lang === "vi" ? "Nội dung chi tiết" : "Detailed Content"}
                    <textarea
                      value={annContent}
                      onChange={(e) => setAnnContent(e.target.value)}
                      placeholder="Nhập nội dung thông báo ngắn gọn..."
                      rows={3}
                      required
                    />
                  </label>

                  <div className="formRowGrid">
                    <label>
                      {lang === "vi" ? "Thời gian đăng" : "Publish Time"}
                      <input
                        type="text"
                        value={annTime}
                        onChange={(e) => setAnnTime(e.target.value)}
                        placeholder="Ví dụ: 2 giờ trước, Hôm qua..."
                        required
                      />
                    </label>

                    <label>
                      {lang === "vi" ? "Vai trò nhìn thấy" : "Visible to Role"}
                      <select
                        value={annRole}
                        onChange={(e) => setAnnRole(e.target.value)}
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
