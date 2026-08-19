export interface PortalLink {
  id: number;
  name: string;
  nameEn: string;
  url: string;
  category: 'ops' | 'data' | 'social' | 'storage' | 'public';
  purpose: string;
  purposeEn: string;
  icon: string;
  isLocked: boolean;
  roles?: string[]; // Allowed roles (e.g., ["Sales", "Marketing", "Developer", "Leader / PM", "Nhân viên mới"])
}

export const portalLinks: PortalLink[] = [
  {
    id: 1,
    name: "Kênh check Task & KPI",
    nameEn: "Task & KPI Checker",
    url: "https://check.securityzone.vn/",
    category: "ops",
    purpose: "Kênh check Task và KPI của team hoạt động hàng ngày.",
    purposeEn: "Daily task check and KPI tracking portal for the execution team.",
    icon: "check",
    isLocked: false
  },
  {
    id: 2,
    name: "Markee AI Tuyển dụng",
    nameEn: "Markee AI Recruitment",
    url: "https://markeeai.com/admin/login",
    category: "public",
    purpose: "Trang đăng nhập quản trị và thông tin tuyển dụng nhân sự.",
    purposeEn: "Admin login portal and public recruitment directory for candidates.",
    icon: "user",
    isLocked: false
  },
  {
    id: 3,
    name: "Diễn đàn SecurityZone",
    nameEn: "SecurityZone Forum",
    url: "https://securityzone.vn/forum/",
    category: "social",
    purpose: "Diễn đàn trao đổi thảo luận công nghệ thông tin và bảo mật.",
    purposeEn: "IT and cybersecurity community message board for collaborative discussions.",
    icon: "message",
    isLocked: false
  },
  {
    id: 4,
    name: "Nền tảng AI Skill",
    nameEn: "AI Skill Platform",
    url: "https://aiskill.markeeai.com/",
    category: "ops",
    purpose: "Nền tảng kiểm định và nâng cao kỹ năng ứng dụng AI chuyên sâu.",
    purposeEn: "Evaluation and enhancement platform for advanced artificial intelligence skills.",
    icon: "cpu",
    isLocked: false
  },
  {
    id: 5,
    name: "Hệ thống BidCheck",
    nameEn: "BidCheck Bidding",
    url: "https://bidcheck.securityzone.vn/",
    category: "data",
    purpose: "Hệ thống kiểm tra, đối chiếu và theo dõi thông tin đấu thầu.",
    purposeEn: "Procurement bid checking, matching, and compliance validation system.",
    icon: "search",
    isLocked: false
  },
  {
    id: 6,
    name: "Background Check",
    nameEn: "Background Check Hub",
    url: "https://bgcheck.securityzone.vn",
    category: "data",
    purpose: "Tra cứu, đối soát thông tin lý lịch nhân sự và đối tác.",
    purposeEn: "Identity resolution and background screening checks database.",
    icon: "shield",
    isLocked: false
  },
  {
    id: 7,
    name: "Tra cứu Mua Sắm Công",
    nameEn: "Public Procurement Search",
    url: "https://msc.securityzone.vn/",
    category: "data",
    purpose: "Tổng hợp và phân tích thông tin các gói thầu mua sắm công.",
    purposeEn: "Aggregator and analytics dashboard for public procurement bidding data.",
    icon: "chart",
    isLocked: false
  },
  {
    id: 8,
    name: "Web quản lý PM",
    nameEn: "PM Management System",
    url: "https://kpi.securityzone.vn",
    category: "ops",
    purpose: "Nền tảng quản lý dự án (Project Manager) và chấm điểm KPI.",
    purposeEn: "Management console for Project Managers and operational KPI ratings.",
    icon: "folder",
    isLocked: false
  },
  {
    id: 9,
    name: "Kênh Youtube SecurityZone",
    nameEn: "SecurityZone YouTube",
    url: "https://www.youtube.com/@securityzone-vn",
    category: "social",
    purpose: "Kênh chia sẻ video kiến thức công nghệ và an ninh mạng.",
    purposeEn: "Official YouTube video channel sharing cybersecurity insights.",
    icon: "play",
    isLocked: false
  },
  {
    id: 10,
    name: "Facebook Fanpage SVUIT",
    nameEn: "SVUIT Facebook Page",
    url: "https://www.facebook.com/svuit",
    category: "social",
    purpose: "Trang fanpage mạng xã hội của cộng đồng bảo mật SVUIT.",
    purposeEn: "Official Facebook page representing the SVUIT security community.",
    icon: "facebook",
    isLocked: false
  },
  {
    id: 11,
    name: "POPTech Nextcloud",
    nameEn: "POPTech Nextcloud Cloud",
    url: "https://nextcloud.securityzone.vn/login",
    category: "storage",
    purpose: "Nền tảng lưu trữ đám mây và cộng tác tài liệu nội bộ.",
    purposeEn: "Private Nextcloud server for team file storage and collaboration.",
    icon: "cloud",
    isLocked: false
  },
  {
    id: 12,
    name: "SecurityZone Solutions",
    nameEn: "SecurityZone Solutions Website",
    url: "https://securityzone.vn/",
    category: "public",
    purpose: "Website chính thức cung cấp giải pháp an ninh mạng toàn diện.",
    purposeEn: "Official company homepage providing advanced cybersecurity packages.",
    icon: "globe",
    isLocked: false
  },
  {
    id: 13,
    name: "Markee Agency",
    nameEn: "Markee Agency Website",
    url: "https://markee.vn/",
    category: "public",
    purpose: "Website giới thiệu các dịch vụ Marketing và thiết kế thương hiệu.",
    purposeEn: "Official site showcasing Markee digital marketing and branding products.",
    icon: "globe",
    isLocked: false
  },
  {
    id: 14,
    name: "Markee AI Chat Console",
    nameEn: "Markee AI Chat Console",
    url: "https://chat.markeeai.com/",
    category: "ops",
    purpose: "Hệ thống hội thoại thông minh hỗ trợ khách hàng bằng trí tuệ nhân tạo.",
    purposeEn: "Conversational AI messaging panel driving automatic customer interactions.",
    icon: "cpu",
    isLocked: false
  },
  {
    id: 15,
    name: "Markee Internal Chat",
    nameEn: "Markee Internal Chat",
    url: "https://chat.markee.vn/",
    category: "ops",
    purpose: "Kênh trao đổi thông tin, chat thảo luận công việc nội bộ của Markee.",
    purposeEn: "Private communication chat channel for internal Markee Agency team members.",
    icon: "message",
    isLocked: false
  },
  {
    id: 16,
    name: "Cổng thông tin GoDaNang",
    nameEn: "GoDaNang Travel Portal",
    url: "https://godanang.net/",
    category: "public",
    purpose: "Cổng thông tin quảng bá du lịch và khám phá thành phố Đà Nẵng.",
    purposeEn: "Tourism guide and travel directory portal for Da Nang city search.",
    icon: "globe",
    isLocked: false
  },
  {
    id: 17,
    name: "Dù lượn Ninh Bình",
    nameEn: "Paragliding Ninh Binh",
    url: "https://paraglidingninhbinh.com/",
    category: "public",
    purpose: "Website giới thiệu dịch vụ và đặt lịch trải nghiệm bay dù lượn Ninh Bình.",
    purposeEn: "Information and booking site for paragliding activities in Ninh Binh.",
    icon: "globe",
    isLocked: false
  },
  {
    id: 18,
    name: "Dù lượn Hạ Long",
    nameEn: "Ha Long Paragliding Website",
    url: "https://halongparagliding.com/",
    category: "public",
    purpose: "Trang đặt lịch bay và ngắm cảnh vịnh Hạ Long bằng dù lượn.",
    purposeEn: "Ha Long Bay paragliding tours and scenic flight packages catalog.",
    icon: "globe",
    isLocked: false
  }
];

export interface PortalTask {
  id: number;
  title: string;
  deadline: string;
  category: 'high' | 'due' | 'normal';
  isDone: boolean;
  role: string; // "Sales" | "Marketing" | "Developer" | "Leader / PM" | "Nhân viên mới" | "Tất cả"
}

export interface PortalAnnouncement {
  id: number;
  type: string; // "📣" | "🎉" | "📘" | "⚙"
  title: string;
  content: string;
  time: string;
  role: string;
}

export const portalTasks: PortalTask[] = [
  { id: 1, title: "Gọi lại khách hàng CÔNG TY AN PHÚC", deadline: "CRM · Hạn 10:30", category: "high", isDone: false, role: "Sales" },
  { id: 2, title: "Hoàn thành khóa Demo Markee App", deadline: "Học viện · Hạn 14:00", category: "due", isDone: false, role: "Sales" },
  { id: 3, title: "Cập nhật pipeline tuần 33", deadline: "Markee CRM · Hạn 16:30", category: "normal", isDone: false, role: "Sales" },
  { id: 4, title: "Thiết kế Banner chiến dịch mới", deadline: "Design kit · Hạn 17:00", category: "high", isDone: false, role: "Marketing" },
  { id: 5, title: "Review Manday & Code Review", deadline: "GitLab · Hạn 15:30", category: "normal", isDone: false, role: "Developer" },
  { id: 6, title: "Gửi báo cáo hiệu suất Leader", deadline: "KPI Center · Hạn 18:00", category: "high", isDone: false, role: "Leader / PM" },
  { id: 7, title: "Kích hoạt tài khoản & Đọc quy chế công ty", deadline: "HRM · Đã hoàn thành", category: "normal", isDone: true, role: "Nhân viên mới" },
  { id: 8, title: "Đăng ký vân tay & Chụp ảnh thẻ", deadline: "Văn phòng · Đã hoàn thành", category: "normal", isDone: true, role: "Nhân viên mới" }
];

export const portalAnnouncements: PortalAnnouncement[] = [
  { id: 1, type: "📣", title: "Town Hall tháng 8", content: "Toàn công ty họp lúc 16:00 thứ Sáu tại phòng All Hands.", time: "2 giờ trước", role: "Tất cả" },
  { id: 2, type: "🎉", title: "Chào mừng thành viên mới", content: "Chào mừng 4 thành viên mới gia nhập team Sales và DEV.", time: "Hôm qua", role: "Tất cả" },
  { id: 3, type: "📘", title: "Cập nhật Sales Kit 2026", content: "Bổ sung bảng so sánh Markee App và đối thủ cạnh tranh.", time: "2 ngày trước", role: "Sales" },
  { id: 4, type: "⚙", title: "Bảo trì Markee CRM", content: "Hệ thống bảo trì từ 22:00–23:00 ngày 14/08.", time: "3 ngày trước", role: "Sales" },
  { id: 5, type: "📘", title: "Cập nhật Branding Guide", content: "Bộ logo và quy chuẩn thiết kế phiên bản 4.1.", time: "4 ngày trước", role: "Marketing" }
];

export interface PortalCourse {
  id: number;
  title: string;
  titleEn: string;
  description: string; // e.g. "Nhân sự mới · 6 bài · 45 phút"
  descriptionEn: string;
  color: 'c1' | 'c2' | 'c3' | 'c4' | 'c5' | 'c6';
  progress: number;
  url: string;
  role: string;
}

export const portalCourses: PortalCourse[] = [
  { id: 1, title: "Tổng quan hệ sinh thái POPTech", titleEn: "POPTech Ecosystem Overview", description: "Nhân sự mới · 6 bài · 45 phút", descriptionEn: "New Hire · 6 units · 45 mins", color: "c1", progress: 68, url: "https://youtube.com", role: "Nhân viên mới" },
  { id: 2, title: "Demo sản phẩm cho khách hàng", titleEn: "Product Demo for Clients", description: "Sales · 5 bài · 38 phút", descriptionEn: "Sales · 5 units · 38 mins", color: "c2", progress: 35, url: "https://youtube.com", role: "Sales" },
  { id: 3, title: "Từ Lead đến Chốt deal với CRM", titleEn: "Lead to Close with CRM", description: "Sales · 8 bài · 1 giờ 10 phút", descriptionEn: "Sales · 8 units · 1h 10m", color: "c5", progress: 20, url: "https://youtube.com", role: "Sales" },
  { id: 4, title: "Bảo mật & quy trình nội bộ", titleEn: "Security & Internal Processes", description: "Bắt buộc · 4 bài · 25 phút", descriptionEn: "Required · 4 units · 25 mins", color: "c4", progress: 100, url: "https://youtube.com", role: "Tất cả" },
  { id: 5, title: "POPTech Seeding thực chiến", titleEn: "POPTech Seeding Hands-on", description: "Sales & Marketing · 7 bài · 55 phút", descriptionEn: "Sales & Marketing · 7 units · 55 mins", color: "c3", progress: 0, url: "https://youtube.com", role: "Marketing" },
  { id: 6, title: "Kỹ năng khai thác nhu cầu SME", titleEn: "SME Needs Discovery Skills", description: "Sales · 6 bài · 42 phút", descriptionEn: "Sales & 6 units · 42 mins", color: "c6", progress: 0, url: "https://youtube.com", role: "Sales" }
];
