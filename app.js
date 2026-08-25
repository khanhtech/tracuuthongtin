/**
 * HỆ THỐNG QUẢN TRỊ & TRA CỨU - XỨ ĐOÀN THIẾU NHI THÁNH THỂ TÂN MỸ
 * Bao gồm:
 * 1. Phân hệ Tra cứu & Thẻ Giáo Lý Viên (GLV)
 * 2. Phân hệ Quản lý & Tra cứu Các Lớp Giáo Lý
 * 3. Thanh Điều Hướng Bên Lề Trái (Sidebar Navigation)
 * 4. Phân quyền Người Dùng (Admin & Khách)
 */

// Đường dẫn ảnh avatar mặc định theo giới tính
const DEFAULT_AVATAR_MALE = 'assets/avatar_male.jpg';
const DEFAULT_AVATAR_FEMALE = 'assets/avatar_female.jpg';

// ==========================================================================
// DỮ LIỆU GIÁO LÝ VIÊN MẪU (DEFAULT GLV DATASET)
// ==========================================================================
const DEFAULT_DATASET = [
  { stt: 1, id: 'GLV01', holyName: 'MARIA', lastName: 'NGUYỄN THỊ VÂN', firstName: 'ANH', gender: 'Nữ', cert: '2', block: 'Khai Tâm', teachingClass: 'Khai Tâm 1', photo: '' },
  { stt: 2, id: 'GLV02', holyName: 'GIUSE', lastName: 'NGUYỄN CÔNG', firstName: 'ANH', gender: 'Nam', cert: '3', block: 'Thêm Sức', teachingClass: 'Thêm Sức 3', photo: '' },
  { stt: 3, id: 'GLV03', holyName: 'VINCENT', lastName: 'VŨ THÀNH', firstName: 'ÂN', gender: 'Nam', cert: '2', block: 'Bao Đồng', teachingClass: 'Bao Đồng 2', photo: '' },
  { stt: 4, id: 'GLV04', holyName: 'INHAXIO', lastName: 'PHAN THIÊN', firstName: 'ÂN', gender: 'Nam', cert: '2', block: 'Thêm Sức', teachingClass: 'Thêm Sức 1', photo: '' },
  { stt: 5, id: 'GLV05', holyName: 'GIUSE', lastName: 'LÊ', firstName: 'DUY', gender: 'Nam', cert: '1', block: 'Khai Tâm', teachingClass: 'Khai Tâm 1', photo: '' },
  { stt: 6, id: 'GLV06', holyName: 'GIUSE', lastName: 'PHẠM ĐĂNG', firstName: 'DUY', gender: 'Nam', cert: '', block: 'Rước Lễ', teachingClass: 'Rước Lễ 1', photo: '' },
  { stt: 7, id: 'GLV07', holyName: 'GIUSE', lastName: 'NGUYỄN THÁI', firstName: 'DƯƠNG', gender: 'Nam', cert: '1', block: 'Rước Lễ', teachingClass: 'Rước Lễ 1', photo: '' },
  { stt: 8, id: 'GLV08', holyName: 'ĐAMINH', lastName: 'LÊ TRÍ', firstName: 'ĐẠO', gender: 'Nam', cert: '2', block: 'Rước Lễ', teachingClass: 'Rước Lễ 3', photo: '' },
  { stt: 9, id: 'GLV09', holyName: 'GIUSE', lastName: 'TRỊNH THANH', firstName: 'HẢI', gender: 'Nam', cert: '1', block: 'Thêm Sức', teachingClass: 'Thêm Sức 2', photo: '' },
  { stt: 10, id: 'GLV10', holyName: 'TERESA', lastName: 'NGUYỄN THỊ NGỌC', firstName: 'HÂN', gender: 'Nữ', cert: '', block: 'Rước Lễ', teachingClass: 'Rước Lễ 3', photo: '' },
  { stt: 11, id: 'GLV11', holyName: 'MARIA', lastName: 'TRẦN THỊ', firstName: 'HIỀN', gender: 'Nữ', cert: '1', block: 'Khai Tâm', teachingClass: 'Khai Tâm 1', photo: '' },
  { stt: 12, id: 'GLV12', holyName: 'GIUSE', lastName: 'PHẠM HOÀNG MINH', firstName: 'HIẾU', gender: 'Nam', cert: '2', block: 'Thêm Sức', teachingClass: 'Thêm Sức 2', photo: '' },
  { stt: 13, id: 'GLV13', holyName: 'ĐAMINH', lastName: 'ĐẶNG TRẦN NHẬT', firstName: 'HOAN', gender: 'Nam', cert: '2', block: 'Bao Đồng', teachingClass: 'Bao Đồng 1', photo: '' },
  { stt: 14, id: 'GLV14', holyName: 'GIOAN BOSCO', lastName: 'ĐỊNH QUANG', firstName: 'HUY', gender: 'Nam', cert: '3', block: 'Bao Đồng', teachingClass: 'Bao Đồng 3', photo: '' },
  { stt: 15, id: 'GLV15', holyName: 'MARIA', lastName: 'BÙI DIỆU', firstName: 'HUYỀN', gender: 'Nữ', cert: '3', block: 'Thêm Sức', teachingClass: 'Thêm Sức 3', photo: '' },
  { stt: 16, id: 'GLV16', holyName: 'ĐAMINH', lastName: 'ĐÀO BẢO', firstName: 'KHANH', gender: 'Nam', cert: '3 - BMVTT', block: 'Vào Đời', teachingClass: 'Vào Đời 1', photo: '' },
  { stt: 17, id: 'GLV17', holyName: 'GIOAN KIM', lastName: 'TRẦN VŨ ĐĂNG', firstName: 'KHOA', gender: 'Nam', cert: '2 - BMVTT', block: 'Vào Đời', teachingClass: 'Vào Đời 1', photo: '' },
  { stt: 18, id: 'GLV18', holyName: 'MARIA', lastName: 'LÂM HOÀI', firstName: 'LIÊN', gender: 'Nữ', cert: '3', block: 'Bao Đồng', teachingClass: 'Bao Đồng 3', photo: '' },
  { stt: 19, id: 'GLV19', holyName: 'GIUSE', lastName: 'LÊ DƯƠNG CÔNG', firstName: 'MINH', gender: 'Nam', cert: '2 - BMVTT', block: 'Vào Đời', teachingClass: 'Vào Đời 2', photo: '' },
  { stt: 20, id: 'GLV20', holyName: 'MARIA', lastName: 'DƯƠNG ĐỖ GIA', firstName: 'NGHI', gender: 'Nữ', cert: '3', block: 'Vào Đời', teachingClass: 'Vào Đời 1', photo: '' },
  { stt: 21, id: 'GLV21', holyName: 'GIOANKIM', lastName: 'NGUYỄN ĐỨC', firstName: 'NHẬT', gender: 'Nam', cert: '1', block: 'Rước Lễ', teachingClass: 'Rước Lễ 2', photo: '' },
  { stt: 22, id: 'GLV22', holyName: 'MARIA', lastName: 'NGUYỄN HÀ UYÊN', firstName: 'NHI', gender: 'Nữ', cert: '2', block: 'Khai Tâm', teachingClass: 'Khai Tâm 2', photo: '' },
  { stt: 23, id: 'GLV23', holyName: 'MARIA', lastName: 'NGUYỄN THỊ DIỆU', firstName: 'NHƯ', gender: 'Nữ', cert: '1', block: 'Thêm Sức', teachingClass: 'Thêm Sức 1', photo: '' },
  { stt: 24, id: 'GLV24', holyName: 'MARIA', lastName: 'TRẦN NHẬT QUỲNH', firstName: 'NHƯ', gender: 'Nữ', cert: '1', block: 'Khai Tâm', teachingClass: 'Khai Tâm 2', photo: '' },
  { stt: 25, id: 'GLV25', holyName: 'ANNA', lastName: 'HOÀNG NHƯ', firstName: 'QUỲNH', gender: 'Nữ', cert: '1', block: 'Rước Lễ', teachingClass: 'Rước Lễ 1', photo: '' },
  { stt: 26, id: 'GLV26', holyName: 'MARIA', lastName: 'PHẠM NGUYỄN HƯƠNG', firstName: 'QUỲNH', gender: 'Nữ', cert: '1', block: 'Bao Đồng', teachingClass: 'Bao Đồng 1', photo: '' },
  { stt: 27, id: 'GLV27', holyName: 'TERESA', lastName: 'KIM NGUYỄN THANH', firstName: 'TÂM', gender: 'Nữ', cert: '2', block: 'Thêm Sức', teachingClass: 'Thêm Sức 2', photo: '' },
  { stt: 28, id: 'GLV28', holyName: 'PHERO', lastName: 'HOÀNG NHẬT', firstName: 'TÂN', gender: 'Nam', cert: '1', block: 'Bao Đồng', teachingClass: 'Bao Đồng 3', photo: '' },
  { stt: 29, id: 'GLV29', holyName: 'MARIA', lastName: 'VÕ NGỌC LAN', firstName: 'THẢO', gender: 'Nữ', cert: '3', block: 'Bao Đồng', teachingClass: 'Bao Đồng 1', photo: '' },
  { stt: 30, id: 'GLV30', holyName: 'TERESA', lastName: 'ĐỊNH THỊ THANH', firstName: 'THẢO', gender: 'Nữ', cert: '3', block: 'Bao Đồng', teachingClass: 'Bao Đồng 2', photo: '' },
  { stt: 31, id: 'GLV31', holyName: 'ANNA', lastName: 'VŨ THỊ', firstName: 'THẢO', gender: 'Nữ', cert: '3', block: 'Rước Lễ', teachingClass: 'Rước Lễ 2', photo: '' },
  { stt: 32, id: 'GLV32', holyName: 'GIUSE', lastName: 'VÕ DUY', firstName: 'THỐNG', gender: 'Nam', cert: '2', block: 'Rước Lễ', teachingClass: 'Rước Lễ 3', photo: '' },
  { stt: 33, id: 'GLV33', holyName: 'MARIA', lastName: 'VŨ NGỌC ANH', firstName: 'THƯ', gender: 'Nữ', cert: '2', block: 'Rước Lễ', teachingClass: 'Rước Lễ 3', photo: '' },
  { stt: 34, id: 'GLV34', holyName: 'MARIA', lastName: 'TRẦN NHẬT ANH', firstName: 'THƯ', gender: 'Nữ', cert: '2', block: 'Thêm Sức', teachingClass: 'Thêm Sức 1', photo: '' },
  { stt: 35, id: 'GLV35', holyName: 'PHERO', lastName: 'NGUYỄN TẤN', firstName: 'TIẾN', gender: 'Nam', cert: '1', block: 'Rước Lễ', teachingClass: 'Rước Lễ 2', photo: '' },
  { stt: 36, id: 'GLV36', holyName: 'MARIA', lastName: 'BẠCH NGUYỄN BẢO', firstName: 'TRÂM', gender: 'Nữ', cert: '1', block: 'Khai Tâm', teachingClass: 'Khai Tâm 2', photo: '' },
  { stt: 37, id: 'GLV37', holyName: 'TERESA', lastName: 'NGUYỄN NHẬT KHÁNH', firstName: 'TRÂN', gender: 'Nữ', cert: '3 - BMVTT', block: 'Vào Đời', teachingClass: 'Vào Đời 2', photo: '' },
  { stt: 38, id: 'GLV38', holyName: 'MARIA', lastName: 'NGUYỄN THANH', firstName: 'TRÚC', gender: 'Nữ', cert: '1', block: 'Khai Tâm', teachingClass: 'Khai Tâm 2', photo: '' },
  { stt: 39, id: 'GLV39', holyName: 'MARIA', lastName: 'ĐOÀN THANH', firstName: 'TRÚC', gender: 'Nữ', cert: '', block: 'Bao Đồng', teachingClass: 'Bao Đồng 2', photo: '' },
  { stt: 40, id: 'GLV40', holyName: 'MARIA', lastName: 'TRẦN NGUYỄN PHƯƠNG', firstName: 'UYÊN', gender: 'Nữ', cert: '1', block: 'Thêm Sức', teachingClass: 'Thêm Sức 3', photo: '' },
  { stt: 41, id: 'GLV41', holyName: 'MARIA', lastName: 'NGUYỄN KHÁNH', firstName: 'VY', gender: 'Nữ', cert: '', block: 'Vào Đời', teachingClass: 'Vào Đời 1', photo: '' }
];

// ==========================================================================
// DỮ LIỆU LỚP HỌC MẪU (DEFAULT CLASSES DATASET)
// ==========================================================================
const DEFAULT_CLASSES_DATASET = [
  {
    id: 'CLASS_DBKT',
    name: 'Dự Bị Khai Tâm',
    block: 'Khai Tâm',
    room: 'Phòng 100 (Dãy A)',
    schedule: 'Chủ Nhật: 07:30 - 09:00',
    studentCount: 24,
    teacherIds: ['GLV05', 'GLV24'],
    note: 'Lớp ấu nhi làm quen môi trường Giáo Lý & Thiếu Nhi Thánh Thể'
  },
  {
    id: 'CLASS_KT1',
    name: 'Khai Tâm 1',
    block: 'Khai Tâm',
    room: 'Phòng 101 (Dãy A)',
    schedule: 'Chủ Nhật: 07:30 - 09:00',
    studentCount: 26,
    teacherIds: ['GLV01', 'GLV11'],
    note: 'Lớp chuẩn bị làm quen Giáo Lý & Sinh hoạt Thiếu nhi Thánh Thể'
  },
  {
    id: 'CLASS_KT2',
    name: 'Khai Tâm 2',
    block: 'Khai Tâm',
    room: 'Phòng 102 (Dãy A)',
    schedule: 'Chủ Nhật: 07:30 - 09:00',
    studentCount: 28,
    teacherIds: ['GLV22', 'GLV38', 'GLV36'],
    note: 'Học kinh căn bản, chuyện Phúc Âm và nhân bản Kitô giáo'
  },
  {
    id: 'CLASS_RL1',
    name: 'Rước Lễ 1',
    block: 'Rước Lễ',
    room: 'Phòng 201 (Dãy B)',
    schedule: 'Chủ Nhật: 07:30 - 09:00',
    studentCount: 30,
    teacherIds: ['GLV25', 'GLV07', 'GLV06'],
    note: 'Học lịch sử Cứu Độ và các Bí Tích Nhập Môn'
  },
  {
    id: 'CLASS_RL2',
    name: 'Rước Lễ 2',
    block: 'Rước Lễ',
    room: 'Phòng 202 (Dãy B)',
    schedule: 'Chủ Nhật: 07:30 - 09:00',
    studentCount: 32,
    teacherIds: ['GLV31', 'GLV35', 'GLV21', 'GLV32'],
    note: 'Bí tích Thánh Thể & Nghi thức Xưng Tội Rước Lễ Lần Đầu'
  },
  {
    id: 'CLASS_TS1',
    name: 'Thêm Sức 1',
    block: 'Thêm Sức',
    room: 'Phòng 301 (Dãy C)',
    schedule: 'Chủ Nhật: 07:30 - 09:00',
    studentCount: 29,
    teacherIds: ['GLV04', 'GLV23', 'GLV34'],
    note: 'Tìm hiểu ơn Chúa Thánh Thần và Đời sống chứng nhân Kitô hữu'
  },
  {
    id: 'CLASS_TS2',
    name: 'Thêm Sức 2',
    block: 'Thêm Sức',
    room: 'Phòng 302 (Dãy C)',
    schedule: 'Chủ Nhật: 07:30 - 09:00',
    studentCount: 31,
    teacherIds: ['GLV12', 'GLV27', 'GLV09', 'GLV02', 'GLV15', 'GLV40'],
    note: 'Chuẩn bị lãnh nhận Bí Tích Thêm Sức từ Đức Giám Mục'
  },
  {
    id: 'CLASS_BD1',
    name: 'Bao Đồng 1',
    block: 'Bao Đồng',
    room: 'Hội Trường A',
    schedule: 'Chủ Nhật: 07:30 - 09:00',
    studentCount: 26,
    teacherIds: ['GLV13', 'GLV29', 'GLV26'],
    note: 'Hiểu biết và dấn thân trong cộng đoàn Giáo Xứ'
  },
  {
    id: 'CLASS_BD2',
    name: 'Bao Đồng 2',
    block: 'Bao Đồng',
    room: 'Hội Trường B',
    schedule: 'Chủ Nhật: 07:30 - 09:00',
    studentCount: 25,
    teacherIds: ['GLV03', 'GLV30', 'GLV39'],
    note: 'Học hỏi Luân lý Công giáo và Phụng vụ Thánh Lễ'
  },
  {
    id: 'CLASS_BD3',
    name: 'Bao Đồng 3',
    block: 'Bao Đồng',
    room: 'Hội Trường C',
    schedule: 'Chủ Nhật: 07:30 - 09:00',
    studentCount: 27,
    teacherIds: ['GLV14', 'GLV18', 'GLV28'],
    note: 'Nghi thức Tuyên Hứa Bao Đồng & Tái tuyên xưng Đức Tin'
  },
  {
    id: 'CLASS_BD4',
    name: 'Bao Đồng 4',
    block: 'Bao Đồng',
    room: 'Hội Trường D',
    schedule: 'Chủ Nhật: 07:30 - 09:00',
    studentCount: 24,
    teacherIds: ['GLV08', 'GLV10', 'GLV33'],
    note: 'Trưởng thành Đức Tin & Dấn thân phục vụ Giáo Hội'
  },
  {
    id: 'CLASS_VD1',
    name: 'Vào Đời 1',
    block: 'Vào Đời',
    room: 'Phòng Đa Năng 1',
    schedule: 'Chủ Nhật: 09:15 - 10:30',
    studentCount: 22,
    teacherIds: ['GLV16', 'GLV17', 'GLV41', 'GLV20'],
    note: 'Đức tin & Định hướng nghề nghiệp Kitô hữu trẻ'
  },
  {
    id: 'CLASS_VD2',
    name: 'Vào Đời 2',
    block: 'Vào Đời',
    room: 'Phòng Đa Năng 2',
    schedule: 'Chủ Nhật: 09:15 - 10:30',
    studentCount: 20,
    teacherIds: ['GLV19', 'GLV37'],
    note: 'Học thuyết Xã hội Công giáo và hôn nhân gia đình'
  }
];

// ==========================================================================
// STORAGE & APP STATE
// ==========================================================================
const STORAGE_KEY = 'glv_custom_database_tanmy_v2';
const CLASS_STORAGE_KEY = 'glv_classes_custom_tanmy_v1';
const AUTH_ROLE_KEY = 'glv_user_role_tanmy_session';
const ACTIVE_TAB_KEY = 'glv_active_tab_tanmy';

let glvDatabase = loadSavedDatabase();
let classDatabase = loadSavedClassesDatabase();
let currentDisplayedGLV = null;
let currentDisplayedClass = null;
let qrcodeInstance = null;
let currentSort = { column: 'stt', order: 'asc' };
let currentBlockFilter = 'all';
let currentTab = localStorage.getItem(ACTIVE_TAB_KEY) || 'glv';
let currentUserRole = sessionStorage.getItem(AUTH_ROLE_KEY) || 'guest';
const ADMIN_PASSWORDS = ['admin', 'admin123', 'tanmy2026', 'tanmy'];

function loadSavedDatabase() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item, idx) => ({
          stt: item.stt || (idx + 1),
          id: item.id || `GLV${String(idx + 1).padStart(2, '0')}`,
          holyName: item.holyName || '',
          lastName: item.lastName || '',
          firstName: item.firstName || '',
          gender: item.gender || 'Nữ',
          cert: item.cert || '',
          block: item.block || '',
          teachingClass: item.teachingClass || '',
          photo: item.photo || ''
        }));
      }
    }
  } catch (e) {
    console.warn('Lỗi đọc dữ liệu GLV từ localStorage:', e);
  }
  return [...DEFAULT_DATASET];
}

function saveDatabase() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(glvDatabase));
  } catch (e) {
    console.warn('Lỗi lưu dữ liệu GLV vào localStorage:', e);
  }
  updateStatsDisplay();
}

function loadSavedClassesDatabase() {
  try {
    const saved = localStorage.getItem(CLASS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const filtered = parsed.filter(item => item.block !== 'Dự Trưởng');
        return sortClassesList(filtered);
      }
    }
  } catch (e) {
    console.warn('Lỗi đọc dữ liệu Lớp học từ localStorage:', e);
  }
  return sortClassesList([...DEFAULT_CLASSES_DATASET]);
}

function saveClassesDatabase() {
  try {
    classDatabase = sortClassesList(classDatabase);
    localStorage.setItem(CLASS_STORAGE_KEY, JSON.stringify(classDatabase));
  } catch (e) {
    console.warn('Lỗi lưu dữ liệu Lớp học vào localStorage:', e);
  }
  renderClassStats();
}

function getGlvAvatar(glv) {
  if (glv && glv.photo && glv.photo.trim()) {
    return glv.photo;
  }
  return (glv && glv.gender === 'Nam') ? DEFAULT_AVATAR_MALE : DEFAULT_AVATAR_FEMALE;
}

// ==========================================================================
// DOM ELEMENTS
// ==========================================================================
// Sidebar & Tab Elements
const appSidebar = document.getElementById('appSidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
const navItemGlv = document.getElementById('navItemGlv');
const navItemClasses = document.getElementById('navItemClasses');
const tabGlvView = document.getElementById('tabGlvView');
const tabClassView = document.getElementById('tabClassView');
const sidebarGlvCount = document.getElementById('sidebarGlvCount');
const sidebarClassCount = document.getElementById('sidebarClassCount');
const sidebarRoleIcon = document.getElementById('sidebarRoleIcon');
const sidebarRoleName = document.getElementById('sidebarRoleName');
const sidebarAuthSwitchBtn = document.getElementById('sidebarAuthSwitchBtn');
const sidebarViewAllGlvBtn = document.getElementById('sidebarViewAllGlvBtn');
const sidebarAddGlvBtn = document.getElementById('sidebarAddGlvBtn');
const sidebarAddClassBtn = document.getElementById('sidebarAddClassBtn');

// GLV Search & Profile Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const suggestionsBox = document.getElementById('suggestionsBox');
const totalGLVCount = document.getElementById('totalGLVCount');

// Auth DOM Elements
const authSwitchBtn = document.getElementById('authSwitchBtn');
const authRoleIcon = document.getElementById('authRoleIcon');
const authRoleText = document.getElementById('authRoleText');
const loginModal = document.getElementById('loginModal');
const closeLoginModalBtn = document.getElementById('closeLoginModalBtn');
const adminPasswordInput = document.getElementById('adminPasswordInput');
const togglePasswordBtn = document.getElementById('togglePasswordBtn');
const togglePasswordIcon = document.getElementById('togglePasswordIcon');
const submitAdminLoginBtn = document.getElementById('submitAdminLoginBtn');
const submitGuestLoginBtn = document.getElementById('submitGuestLoginBtn');
const guestFormAlert = document.getElementById('guestFormAlert');

// GLV View Containers
const welcomeState = document.getElementById('welcomeState');
const loadingState = document.getElementById('loadingState');
const notFoundState = document.getElementById('notFoundState');
const resultCard = document.getElementById('resultCard');
const multipleResultsCard = document.getElementById('multipleResultsCard');
const glvGridList = document.getElementById('glvGridList');
const searchedKeyword = document.getElementById('searchedKeyword');
const matchCount = document.getElementById('matchCount');

// GLV Card Elements
const cardId = document.getElementById('cardId');
const cardStt = document.getElementById('cardStt');
const cardHolyName = document.getElementById('cardHolyName');
const cardFullName = document.getElementById('cardFullName');
const cardCert = document.getElementById('cardCert');
const cardGender = document.getElementById('cardGender');
const cardClass = document.getElementById('cardClass');
const cardBlock = document.getElementById('cardBlock');
const cardAvatarImg = document.getElementById('cardAvatarImg');
const cardGenderIcon = document.getElementById('cardGenderIcon');
const qrcodeContainer = document.getElementById('qrcodeContainer');

// GLV Action Buttons
const printBtn = document.getElementById('printBtn');
const copyBtn = document.getElementById('copyBtn');
const resetBtn = document.getElementById('resetBtn');
const editCurrentGlvBtn = document.getElementById('editCurrentGlvBtn');
const viewAllBtn = document.getElementById('viewAllBtn');
const addNewGlvBtn = document.getElementById('addNewGlvBtn');
const modalAddGlvBtn = document.getElementById('modalAddGlvBtn');
const exportExcelBtn = document.getElementById('exportExcelBtn');
const resetDataBtn = document.getElementById('resetDataBtn');
const toastNotification = document.getElementById('toastNotification');
const toastMessage = document.getElementById('toastMessage');

// Modal Danh Sách Toàn Bộ GLV
const allGlvModal = document.getElementById('allGlvModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalFilterInput = document.getElementById('modalFilterInput');
const allGlvTableBody = document.getElementById('allGlvTableBody');
const filterGender = document.getElementById('filterGender');
const filterBlock = document.getElementById('filterBlock');
const filterCert = document.getElementById('filterCert');
const filterResultCount = document.getElementById('filterResultCount');

// Modal Form Chỉnh Sửa / Thêm Mới GLV
const editGlvModal = document.getElementById('editGlvModal');
const closeEditModalBtn = document.getElementById('closeEditModalBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const glvEditForm = document.getElementById('glvEditForm');
const editModalTitle = document.getElementById('editModalTitle');
const editOriginalId = document.getElementById('editOriginalId');
const formPhotoData = document.getElementById('formPhotoData');
const formId = document.getElementById('formId');
const formGender = document.getElementById('formGender');
const formHolyName = document.getElementById('formHolyName');
const formLastName = document.getElementById('formLastName');
const formFirstName = document.getElementById('formFirstName');
const formCert = document.getElementById('formCert');
const formBlock = document.getElementById('formBlock');
const formClass = document.getElementById('formClass');
const formPhotoInput = document.getElementById('formPhotoInput');
const formPhotoPreview = document.getElementById('formPhotoPreview');
const formPhotoResetBtn = document.getElementById('formPhotoResetBtn');

// Class Section DOM Elements
const classStatTotalClasses = document.getElementById('classStatTotalClasses');
const classStatTotalBlocks = document.getElementById('classStatTotalBlocks');
const classStatTotalStudents = document.getElementById('classStatTotalStudents');
const classStatAssignedTeachers = document.getElementById('classStatAssignedTeachers');
const classSearchInput = document.getElementById('classSearchInput');
const classClearSearchBtn = document.getElementById('classClearSearchBtn');
const blockFilterPills = document.getElementById('blockFilterPills');
const addClassBtn = document.getElementById('addClassBtn');
const classCardsGrid = document.getElementById('classCardsGrid');
const classNotFoundState = document.getElementById('classNotFoundState');
const searchedClassKeyword = document.getElementById('searchedClassKeyword');
const resetClassFilterBtn = document.getElementById('resetClassFilterBtn');

// Class Modals Elements
const classDetailModal = document.getElementById('classDetailModal');
const classDetailModalTitle = document.getElementById('classDetailModalTitle');
const classDetailBody = document.getElementById('classDetailBody');
const closeClassDetailModalBtn = document.getElementById('closeClassDetailModalBtn');
const closeClassDetailFooterBtn = document.getElementById('closeClassDetailFooterBtn');
const btnEditClassFromDetail = document.getElementById('btnEditClassFromDetail');

const editClassModal = document.getElementById('editClassModal');
const editClassModalTitle = document.getElementById('editClassModalTitle');
const closeEditClassModalBtn = document.getElementById('closeEditClassModalBtn');
const cancelEditClassBtn = document.getElementById('cancelEditClassBtn');
const classEditForm = document.getElementById('classEditForm');
const editClassOriginalId = document.getElementById('editClassOriginalId');
const formClassName = document.getElementById('formClassName');
const formClassBlock = document.getElementById('formClassBlock');
const formClassRoom = document.getElementById('formClassRoom');
const formClassSchedule = document.getElementById('formClassSchedule');
const formClassStudents = document.getElementById('formClassStudents');
const formClassNote = document.getElementById('formClassNote');
const teacherSearchFilter = document.getElementById('teacherSearchFilter');
const teacherCheckboxList = document.getElementById('teacherCheckboxList');

// ==========================================================================
// KHỞI ĐỘNG ỨNG DỤNG
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initUserRole();
  updateStatsDisplay();
  initClassModule();
  setupEventListeners();
  switchTab(currentTab);
  tryAutoFetchExcel();
});

// ==========================================================================
// QUẢN LÝ TAB & SIDEBAR NAVIGATION
// ==========================================================================
function switchTab(tabName) {
  currentTab = tabName;
  localStorage.setItem(ACTIVE_TAB_KEY, tabName);

  if (tabName === 'glv') {
    if (navItemGlv) navItemGlv.classList.add('active');
    if (navItemClasses) navItemClasses.classList.remove('active');
    if (tabGlvView) tabGlvView.style.display = 'block';
    if (tabClassView) tabClassView.style.display = 'none';
  } else if (tabName === 'classes') {
    if (navItemGlv) navItemGlv.classList.remove('active');
    if (navItemClasses) navItemClasses.classList.add('active');
    if (tabGlvView) tabGlvView.style.display = 'none';
    if (tabClassView) tabClassView.style.display = 'block';
    renderClassesView();
  }

  // Đóng sidebar trên mobile sau khi chọn tab
  closeMobileSidebar();
}

function openMobileSidebar() {
  if (appSidebar) appSidebar.classList.add('sidebar-open');
  if (sidebarOverlay) sidebarOverlay.classList.add('active');
}

function closeMobileSidebar() {
  if (appSidebar) appSidebar.classList.remove('sidebar-open');
  if (sidebarOverlay) sidebarOverlay.classList.remove('active');
}

// ==========================================================================
// PHÂN QUYỀN NGƯỜI DÙNG (ADMIN VS GUEST)
// ==========================================================================
function initUserRole() {
  updateRoleUI();
}

function setRole(newRole) {
  currentUserRole = newRole;
  try {
    sessionStorage.setItem(AUTH_ROLE_KEY, newRole);
    localStorage.removeItem('glv_user_role_tanmy_v1');
  } catch (e) {
    console.warn('Lỗi lưu vai trò:', e);
  }
  updateRoleUI();
}

function updateRoleUI() {
  const isAdmin = (currentUserRole === 'admin');

  // Top Bar Auth Button
  if (authSwitchBtn) {
    if (isAdmin) {
      authSwitchBtn.className = 'btn-auth-icon-right role-admin';
      authSwitchBtn.title = 'Vai trò: Quản Trị Viên (Admin). Bấm để đổi vai trò';
      if (authRoleIcon) authRoleIcon.className = 'fa-solid fa-shield-halved';
      if (authRoleText) authRoleText.textContent = 'Admin';
    } else {
      authSwitchBtn.className = 'btn-auth-icon-right role-guest';
      authSwitchBtn.title = 'Vai trò: Khách / Huynh Trưởng (Guest). Bấm để đổi vai trò';
      if (authRoleIcon) authRoleIcon.className = 'fa-solid fa-user-tag';
      if (authRoleText) authRoleText.textContent = 'Khách';
    }
  }

  // Sidebar Role Info Card
  if (sidebarRoleName) {
    sidebarRoleName.textContent = isAdmin ? 'Quản Trị Viên (Admin)' : 'Khách / Huynh Trưởng';
  }
  if (sidebarRoleIcon) {
    sidebarRoleIcon.className = isAdmin ? 'role-avatar-icon admin' : 'role-avatar-icon';
    sidebarRoleIcon.innerHTML = isAdmin ? '<i class="fa-solid fa-shield-halved"></i>' : '<i class="fa-solid fa-user-tag"></i>';
  }

  // Phân quyền các nút thao tác
  if (addNewGlvBtn) addNewGlvBtn.style.display = isAdmin ? 'inline-flex' : 'none';
  if (modalAddGlvBtn) modalAddGlvBtn.style.display = isAdmin ? 'inline-flex' : 'none';
  if (sidebarAddGlvBtn) sidebarAddGlvBtn.style.display = isAdmin ? 'flex' : 'none';
  if (resetDataBtn) resetDataBtn.style.display = isAdmin ? 'inline-flex' : 'none';
  if (addClassBtn) addClassBtn.style.display = isAdmin ? 'inline-flex' : 'none';
  if (sidebarAddClassBtn) sidebarAddClassBtn.style.display = isAdmin ? 'flex' : 'none';

  // Làm mới bảng nếu đang mở
  if (allGlvModal && allGlvModal.style.display !== 'none') {
    applyModalFilters();
  }

  // Cập nhật lại Grid Lớp học để ẩn/hiện nút sửa nhanh theo quyền
  if (currentTab === 'classes') {
    renderClassesView();
  }
}

function checkAdminPassword() {
  const enteredPass = (adminPasswordInput.value || '').trim();
  if (ADMIN_PASSWORDS.includes(enteredPass.toLowerCase())) {
    setRole('admin');
    if (loginModal) loginModal.style.display = 'none';
    showToast('Đăng nhập Quản Trị Viên thành công!');
  } else {
    alert('Mật khẩu Quản Trị Viên không đúng! Vui lòng thử lại.');
    if (adminPasswordInput) {
      adminPasswordInput.focus();
      adminPasswordInput.select();
    }
  }
}

// ==========================================================================
// PHÂN HỆ THÔNG TIN GIÁO LÝ VIÊN
// ==========================================================================
function updateStatsDisplay() {
  const count = glvDatabase.length;
  if (totalGLVCount) totalGLVCount.textContent = count;
  if (sidebarGlvCount) sidebarGlvCount.textContent = count;
  if (filterResultCount) filterResultCount.textContent = count;
}

function searchGLV(query) {
  if (!query || query.trim() === '') return [];
  const q = removeVietnameseTones(query.trim().toLowerCase());
  const rawQ = query.trim().toUpperCase();

  return glvDatabase.filter(glv => {
    // Tìm theo ID
    if (glv.id.toUpperCase().includes(rawQ)) return true;
    
    // Tìm theo ID dạng số
    const numPart = glv.id.replace(/\D/g, '');
    if (rawQ === numPart || rawQ === String(parseInt(numPart, 10))) return true;

    // Tìm theo Tên Thánh
    const holyNorm = removeVietnameseTones(glv.holyName || '');
    if (holyNorm.includes(q)) return true;

    // Tìm theo Họ tên
    const fullNameNorm = removeVietnameseTones(`${glv.lastName} ${glv.firstName}`);
    if (fullNameNorm.includes(q)) return true;

    // Tìm theo Tên
    const firstNameNorm = removeVietnameseTones(glv.firstName || '');
    if (firstNameNorm.includes(q)) return true;

    // Tìm theo Khối / Lớp
    const blockNorm = removeVietnameseTones(glv.block || '');
    const classNorm = removeVietnameseTones(glv.teachingClass || '');
    if (blockNorm.includes(q) || classNorm.includes(q)) return true;

    return false;
  });
}

function removeVietnameseTones(str) {
  if (!str) return '';
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '');
  str = str.replace(/\u02C6|\u0306|\u031B/g, '');
  return str.trim();
}

function getSuggestions(query) {
  if (!query || query.trim() === '') return [];
  const results = searchGLV(query);
  return results.slice(0, 6);
}

function renderSuggestions(list) {
  if (!suggestionsBox) return;
  suggestionsBox.innerHTML = '';

  if (list.length === 0) {
    suggestionsBox.style.display = 'none';
    return;
  }

  list.forEach(item => {
    const isMale = (item.gender === 'Nam');
    const div = document.createElement('div');
    div.className = 'suggestion-item';
    div.innerHTML = `
      <div class="sugg-left">
        <img class="sugg-avatar-img" src="${getGlvAvatar(item)}" alt="avatar">
        <span class="sugg-id">${item.id}</span>
        <span class="sugg-name">${item.holyName ? item.holyName + ' ' : ''}${item.lastName} ${item.firstName}</span>
      </div>
      <div class="sugg-right">
        <span class="sugg-cert">${isMale ? '♂ Nam' : '♀ Nữ'}${item.cert ? ' • Cấp ' + item.cert : ''}</span>
      </div>
    `;

    div.addEventListener('click', () => {
      searchInput.value = item.id;
      clearSearchBtn.style.display = 'flex';
      suggestionsBox.style.display = 'none';
      displayProfileCard(item);
    });

    suggestionsBox.appendChild(div);
  });

  suggestionsBox.style.display = 'block';
}

function hideAllStates() {
  welcomeState.style.display = 'none';
  loadingState.style.display = 'none';
  notFoundState.style.display = 'none';
  resultCard.style.display = 'none';
  multipleResultsCard.style.display = 'none';
}

function showWelcomeState() {
  hideAllStates();
  currentDisplayedGLV = null;
  welcomeState.style.display = 'block';
  updateStatsDisplay();
}

function executeSearch(query) {
  if (!query || query.trim() === '') {
    showWelcomeState();
    return;
  }

  hideAllStates();
  loadingState.style.display = 'block';

  setTimeout(() => {
    hideAllStates();
    const results = searchGLV(query);

    if (results.length === 0) {
      searchedKeyword.textContent = query;
      notFoundState.style.display = 'block';
    } else if (results.length === 1) {
      displayProfileCard(results[0]);
    } else {
      displayMultipleResults(results);
    }
  }, 120);
}

function displayProfileCard(glv) {
  currentDisplayedGLV = glv;
  hideAllStates();

  cardId.textContent = glv.id;
  cardStt.textContent = String(glv.stt).padStart(2, '0');
  
  const holy = (glv.holyName || '').trim().toUpperCase();
  cardHolyName.textContent = holy ? holy : 'GIÁO LÝ VIÊN';
  
  const lastName = (glv.lastName || '').trim();
  const firstName = (glv.firstName || '').trim();
  const fullName = `${lastName} ${firstName}`.trim();
  cardFullName.textContent = fullName || 'Chưa cập nhật tên';

  const isMale = (glv.gender === 'Nam');
  if (cardGender) {
    cardGender.innerHTML = isMale 
      ? '<span style="color: #1d4ed8;"><i class="fa-solid fa-mars"></i> Nam</span>'
      : '<span style="color: #be185d;"><i class="fa-solid fa-venus"></i> Nữ</span>';
  }

  if (cardGenderIcon) {
    cardGenderIcon.className = isMale ? 'avatar-badge-icon male' : 'avatar-badge-icon female';
    cardGenderIcon.innerHTML = isMale ? '<i class="fa-solid fa-mars"></i>' : '<i class="fa-solid fa-venus"></i>';
    cardGenderIcon.title = isMale ? 'Giới tính: Nam' : 'Giới tính: Nữ';
  }

  if (cardAvatarImg) {
    cardAvatarImg.src = getGlvAvatar(glv);
  }

  let certRaw = String(glv.cert || '').trim();
  let certText = 'Chưa có chứng chỉ';
  let isGold = false;

  if (certRaw) {
    if (certRaw.startsWith('Cấp') || certRaw.startsWith('cấp')) {
      certText = certRaw;
    } else {
      certText = `Cấp ${certRaw}`;
    }
    if (certRaw.includes('3') || certRaw.toUpperCase().includes('BMVTT')) {
      isGold = true;
    }
  }

  cardCert.textContent = certText;
  cardCert.className = isGold ? 'badge-cert gold' : 'badge-cert';

  cardClass.textContent = glv.teachingClass ? glv.teachingClass : 'Chưa phân công lớp';
  if (cardBlock) {
    cardBlock.textContent = glv.block ? `Khối ${glv.block}` : 'Chưa phân khối';
  }

  generateQRCode(glv);
  resultCard.style.display = 'block';
}

function generateQRCode(glv) {
  if (!qrcodeContainer) return;
  qrcodeContainer.innerHTML = '';

  const qrData = `MÃ GLV: ${glv.id}\nTÊN THÁNH: ${glv.holyName || ''}\nHỌ TÊN: ${glv.lastName} ${glv.firstName}\nGIỚI TÍNH: ${glv.gender || 'Nữ'}\nCHỨNG CHỈ: ${glv.cert || 'Chưa có'}\nLỚP: ${glv.teachingClass || 'Chưa phân'}`;

  if (typeof QRCode !== 'undefined') {
    try {
      qrcodeInstance = new QRCode(qrcodeContainer, {
        text: qrData,
        width: 84,
        height: 84,
        colorDark: '#991b1b',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
      });
    } catch (e) {
      console.warn('Lỗi tạo QR Code:', e);
    }
  }
}

function displayMultipleResults(list) {
  matchCount.textContent = list.length;
  glvGridList.innerHTML = '';

  list.forEach(item => {
    const div = document.createElement('div');
    div.className = 'glv-mini-card';
    div.innerHTML = `
      <div class="mini-card-top">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <img class="table-avatar-img" style="width: 32px; height: 32px;" src="${getGlvAvatar(item)}" alt="avatar">
          <span class="mini-id">${item.id}</span>
        </div>
        <span class="mini-cert">${item.gender === 'Nam' ? '♂ Nam' : '♀ Nữ'}${item.cert ? ' • Cấp ' + item.cert : ''}</span>
      </div>
      <span class="mini-holy">${item.holyName || ''}</span>
      <span class="mini-name">${item.lastName} ${item.firstName}</span>
      <span style="font-size: 0.8rem; color: #64748b;">${item.block ? 'Khối ' + item.block : (item.teachingClass || 'Xứ Đoàn Tân Mỹ')}</span>
    `;

    div.addEventListener('click', () => {
      searchInput.value = item.id;
      clearSearchBtn.style.display = 'block';
      displayProfileCard(item);
    });

    glvGridList.appendChild(div);
  });

  multipleResultsCard.style.display = 'block';
}

// ==========================================================================
// PHÂN HỆ QUẢN LÝ & TRA CỨU LỚP GIÁO LÝ
// ==========================================================================
function initClassModule() {
  renderClassStats();
  renderBlockFilterPillCounts();
}

function renderClassStats() {
  const totalClasses = classDatabase.length;
  const blocks = new Set(classDatabase.map(c => c.block).filter(Boolean));
  const totalStudents = classDatabase.reduce((sum, c) => sum + (parseInt(c.studentCount) || 0), 0);
  
  // Tập hợp các GLV được phân công đứng lớp
  const assignedTeacherIds = new Set();
  classDatabase.forEach(c => {
    (c.teacherIds || []).forEach(tid => assignedTeacherIds.add(tid));
  });

  if (classStatTotalClasses) classStatTotalClasses.textContent = totalClasses;
  if (sidebarClassCount) sidebarClassCount.textContent = totalClasses;
  if (classStatTotalBlocks) classStatTotalBlocks.textContent = blocks.size;
  if (classStatTotalStudents) classStatTotalStudents.textContent = `${totalStudents}+`;
  if (classStatAssignedTeachers) classStatAssignedTeachers.textContent = assignedTeacherIds.size;
}

function renderBlockFilterPillCounts() {
  const counts = {
    all: classDatabase.length,
    KT: classDatabase.filter(c => c.block === 'Khai Tâm').length,
    RL: classDatabase.filter(c => c.block === 'Rước Lễ').length,
    TS: classDatabase.filter(c => c.block === 'Thêm Sức').length,
    BD: classDatabase.filter(c => c.block === 'Bao Đồng').length,
    VD: classDatabase.filter(c => c.block === 'Vào Đời').length
  };

  const elAll = document.getElementById('countBlockAll');
  const elKT = document.getElementById('countBlockKT');
  const elRL = document.getElementById('countBlockRL');
  const elTS = document.getElementById('countBlockTS');
  const elBD = document.getElementById('countBlockBD');
  const elVD = document.getElementById('countBlockVD');

  if (elAll) elAll.textContent = counts.all;
  if (elKT) elKT.textContent = counts.KT;
  if (elRL) elRL.textContent = counts.RL;
  if (elTS) elTS.textContent = counts.TS;
  if (elBD) elBD.textContent = counts.BD;
  if (elVD) elVD.textContent = counts.VD;
}

function getBlockBadgeClass(blockName) {
  const norm = removeVietnameseTones(blockName || '');
  if (norm.includes('khai tam')) return 'badge-block-khaitam';
  if (norm.includes('ruoc le')) return 'badge-block-ruocle';
  if (norm.includes('them suc')) return 'badge-block-themsuc';
  if (norm.includes('bao dong')) return 'badge-block-baodong';
  if (norm.includes('vao doi')) return 'badge-block-vaodoi';
  return 'badge-block-ruocle';
}

function getTeachersByClass(teacherIds) {
  if (!Array.isArray(teacherIds)) return [];
  return teacherIds.map(tid => {
    return glvDatabase.find(g => g.id.toUpperCase() === tid.toUpperCase()) || {
      id: tid,
      holyName: '',
      lastName: '',
      firstName: tid,
      gender: 'Nữ',
      cert: '',
      photo: ''
    };
  });
}

// ==========================================================================
// THỨ TỰ SẮP XẾP CHUẨN CÁC LỚP GIÁO LÝ
// Thứ tự: Dự bị khai tâm -> Khai tâm 1 -> Khai tâm 2 -> Rước lễ 1 -> Rước lễ 2
// -> Thêm sức 1 -> Thêm sức 2 -> Bao đồng 1 -> Bao đồng 2 -> Bao đồng 3 -> Bao đồng 4
// -> Vào đời 1 -> Vào đời 2
// Các lớp trùng tên sắp xếp theo thứ tự chữ cái (ví dụ: Bao đồng 1A -> Bao đồng 1B)
// ==========================================================================
function getBlockSortPriority(blockName) {
  const norm = removeVietnameseTones(blockName || '').toLowerCase().trim();
  if (norm.includes('khai tam') || norm.includes('du bi')) return 1;
  if (norm.includes('ruoc le')) return 2;
  if (norm.includes('them suc')) return 3;
  if (norm.includes('bao dong')) return 4;
  if (norm.includes('vao doi')) return 5;
  return 99;
}

function getClassNameBaseRank(className) {
  const norm = removeVietnameseTones(className || '').toLowerCase().trim();

  // Khối Khai Tâm
  if (norm.includes('du bi')) return 10;
  if (norm.startsWith('khai tam 1')) return 20;
  if (norm.startsWith('khai tam 2')) return 30;
  if (norm.startsWith('khai tam 3')) return 40;
  if (norm.startsWith('khai tam')) return 25;

  // Khối Rước Lễ
  if (norm.startsWith('ruoc le 1')) return 110;
  if (norm.startsWith('ruoc le 2')) return 120;
  if (norm.startsWith('ruoc le 3')) return 130;
  if (norm.startsWith('ruoc le 4')) return 140;
  if (norm.startsWith('ruoc le')) return 115;

  // Khối Thêm Sức
  if (norm.startsWith('them suc 1')) return 210;
  if (norm.startsWith('them suc 2')) return 220;
  if (norm.startsWith('them suc 3')) return 230;
  if (norm.startsWith('them suc 4')) return 240;
  if (norm.startsWith('them suc')) return 215;

  // Khối Bao Đồng
  if (norm.startsWith('bao dong 1')) return 310;
  if (norm.startsWith('bao dong 2')) return 320;
  if (norm.startsWith('bao dong 3')) return 330;
  if (norm.startsWith('bao dong 4')) return 340;
  if (norm.startsWith('bao dong 5')) return 350;
  if (norm.startsWith('bao dong')) return 315;

  // Khối Vào Đời
  if (norm.startsWith('vao doi 1')) return 410;
  if (norm.startsWith('vao doi 2')) return 420;
  if (norm.startsWith('vao doi 3')) return 430;
  if (norm.startsWith('vao doi 4')) return 440;
  if (norm.startsWith('vao doi')) return 415;

  return 999;
}

function sortClassesList(classes) {
  if (!Array.isArray(classes)) return [];
  return [...classes].sort((a, b) => {
    // 1. So sánh theo thứ tự Khối Lớp
    const blockWeightA = getBlockSortPriority(a.block);
    const blockWeightB = getBlockSortPriority(b.block);
    if (blockWeightA !== blockWeightB) {
      return blockWeightA - blockWeightB;
    }

    // 2. So sánh theo cấp độ lớp chuẩn
    const rankA = getClassNameBaseRank(a.name);
    const rankB = getClassNameBaseRank(b.name);
    if (rankA !== rankB) {
      return rankA - rankB;
    }

    // 3. Nếu cùng cấp độ hoặc trùng tên, sắp xếp theo thứ tự bảng chữ cái (A, B, C...)
    const nameA = String(a.name || '').trim();
    const nameB = String(b.name || '').trim();
    return nameA.localeCompare(nameB, 'vi', { numeric: true, sensitivity: 'base' });
  });
}

function renderClassesView() {
  const query = (classSearchInput ? classSearchInput.value.trim() : '');
  const qNorm = removeVietnameseTones(query.toLowerCase());

  let list = [...classDatabase];

  // Lọc theo Khối
  if (currentBlockFilter !== 'all') {
    list = list.filter(c => c.block === currentBlockFilter);
  }

  // Tìm kiếm theo text (tên lớp, phòng, ghi chú, hoặc tên GLV phụ trách)
  if (query) {
    list = list.filter(cls => {
      const nameNorm = removeVietnameseTones(cls.name || '');
      const blockNorm = removeVietnameseTones(cls.block || '');
      const roomNorm = removeVietnameseTones(cls.room || '');
      const noteNorm = removeVietnameseTones(cls.note || '');

      if (nameNorm.includes(qNorm) || blockNorm.includes(qNorm) || roomNorm.includes(qNorm) || noteNorm.includes(qNorm)) {
        return true;
      }

      // Tìm theo GLV trong lớp
      const teachers = getTeachersByClass(cls.teacherIds);
      return teachers.some(t => {
        const tNameNorm = removeVietnameseTones(`${t.holyName} ${t.lastName} ${t.firstName}`);
        return tNameNorm.includes(qNorm) || t.id.toLowerCase().includes(qNorm);
      });
    });
  }

  // Luôn sắp xếp theo thứ tự chuẩn quy định
  list = sortClassesList(list);

  renderClassCards(list, query);
}

function formatScheduleShort(scheduleStr) {
  if (!scheduleStr) return 'CN';
  let s = scheduleStr.trim();
  s = s.replace(/Chủ\s*Nhật\s*:\s*/gi, '').replace(/Chủ\s*Nhật/gi, 'CN');
  s = s.replace(/Thứ\s*Bảy\s*:\s*/gi, '').replace(/Thứ\s*Bảy/gi, 'T7');
  s = s.replace(/Thứ\s*(\d)\s*:\s*/gi, 'T$1 ');
  if (!s.includes('CN') && !s.includes('T7') && !s.includes('T')) {
    s = `${s} CN`;
  }
  return s.trim();
}

function renderClassCards(classesList, searchKeyword) {
  if (!classCardsGrid) return;
  classCardsGrid.innerHTML = '';

  if (classesList.length === 0) {
    if (classNotFoundState) {
      if (searchedClassKeyword) searchedClassKeyword.textContent = searchKeyword || currentBlockFilter;
      classNotFoundState.style.display = 'block';
    }
    return;
  }

  if (classNotFoundState) classNotFoundState.style.display = 'none';

  const isAdmin = (currentUserRole === 'admin');

  classesList.forEach(cls => {
    const teachers = getTeachersByClass(cls.teacherIds);
    const badgeCls = getBlockBadgeClass(cls.block);

    const card = document.createElement('div');
    card.className = 'class-card';
    card.innerHTML = `
      <div class="class-card-header">
        <div class="class-header-title-box">
          <h3 class="class-name">${cls.name}</h3>
          <div style="margin-top: 0.35rem;">
            <span class="class-block-badge ${badgeCls}">
              <i class="fa-solid fa-layer-group"></i> Khối ${cls.block}
            </span>
          </div>
        </div>
      </div>

      <div class="class-card-body">
        <div class="class-meta-row">
          <div class="class-meta-item" title="Phòng học">
            <i class="fa-solid fa-door-open"></i>
            <span>${cls.room || 'Chưa xếp phòng'}</span>
          </div>
          <div class="class-meta-item" title="Giờ học">
            <i class="fa-regular fa-clock"></i>
            <span>${formatScheduleShort(cls.schedule)}</span>
          </div>
        </div>

        <div class="class-teachers-section">
          <div class="teachers-header">
            <span><i class="fa-solid fa-user-graduate"></i> Huynh Trưởng / GLV (${teachers.length})</span>
          </div>
          <div class="teachers-chips-list">
            ${teachers.length > 0 ? teachers.map(t => `
              <div class="teacher-chip" data-glv-id="${t.id}" title="Bấm để xem hồ sơ ${t.id}">
                <img src="${getGlvAvatar(t)}" alt="avatar">
                <span class="chip-name-box">
                  <strong class="chip-holy">${t.holyName || ''}</strong>
                  <span class="chip-name">${t.lastName} ${t.firstName}</span>
                </span>
                <span class="chip-id">${t.id}</span>
              </div>
            `).join('') : '<span style="font-size: 0.78rem; color: #94a3b8; font-style: italic;">Chưa phân công Huynh Trưởng</span>'}
          </div>
        </div>

        <div class="class-student-info">
          <span><i class="fa-solid fa-children"></i> Sĩ số thiếu nhi:</span>
          <strong>${cls.studentCount || 0} Em</strong>
        </div>
      </div>

      <div class="class-card-footer">
        <button class="btn-card-detail" data-class-id="${cls.id}">
          <i class="fa-solid fa-circle-info"></i> Xem Chi Tiết
        </button>
        ${isAdmin ? `
        <button class="btn-card-edit-quick" data-edit-id="${cls.id}" title="Chỉnh sửa thông tin lớp này">
          <i class="fa-solid fa-pen"></i>
        </button>
        ` : ''}
      </div>
    `;

    // Sự kiện bấm xem chi tiết lớp
    card.querySelector('.btn-card-detail').addEventListener('click', () => {
      openClassDetailModal(cls.id);
    });

    // Sự kiện bấm sửa nhanh lớp (Admin)
    const editBtn = card.querySelector('.btn-card-edit-quick');
    if (editBtn) {
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openEditClassModal(cls.id);
      });
    }

    // Sự kiện bấm vào tên GLV trong card -> Chuyển sang xem thẻ GLV
    card.querySelectorAll('.teacher-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        const glvId = chip.getAttribute('data-glv-id');
        const foundGLV = glvDatabase.find(g => g.id.toUpperCase() === glvId.toUpperCase());
        if (foundGLV) {
          switchTab('glv');
          searchInput.value = foundGLV.id;
          clearSearchBtn.style.display = 'flex';
          displayProfileCard(foundGLV);
        }
      });
    });

    classCardsGrid.appendChild(card);
  });
}

function openClassDetailModal(classId) {
  const cls = classDatabase.find(c => c.id === classId);
  if (!cls) return;

  currentDisplayedClass = cls;
  const teachers = getTeachersByClass(cls.teacherIds);
  const badgeCls = getBlockBadgeClass(cls.block);

  if (classDetailModalTitle) {
    classDetailModalTitle.textContent = `Thông Tin Lớp ${cls.name}`;
  }

  if (classDetailBody) {
    classDetailBody.innerHTML = `
      <div class="class-detail-hero">
        <div>
          <h2 class="class-hero-title">${cls.name}</h2>
          <p class="class-hero-subtitle">Xứ Đoàn Thiếu Nhi Thánh Thể Tân Mỹ &bull; Niên Khóa 2026 - 2027</p>
        </div>
        <span class="class-block-badge ${badgeCls}" style="font-size: 0.88rem; padding: 0.4rem 0.95rem;">
          <i class="fa-solid fa-layer-group"></i> Khối ${cls.block}
        </span>
      </div>

      <div class="class-detail-info-grid">
        <div class="detail-info-box">
          <i class="fa-solid fa-door-open"></i>
          <div>
            <span class="info-label">Phòng học</span>
            <span class="info-val">${cls.room || 'Chưa xếp phòng'}</span>
          </div>
        </div>

        <div class="detail-info-box">
          <i class="fa-regular fa-clock"></i>
          <div>
            <span class="info-label">Thời gian học</span>
            <span class="info-val">${cls.schedule || 'Chủ Nhật'}</span>
          </div>
        </div>

        <div class="detail-info-box">
          <i class="fa-solid fa-children"></i>
          <div>
            <span class="info-label">Sĩ số thiếu nhi</span>
            <span class="info-val">${cls.studentCount || 0} Em</span>
          </div>
        </div>

        <div class="detail-info-box">
          <i class="fa-solid fa-note-sticky"></i>
          <div>
            <span class="info-label">Ghi chú ban giáo lý</span>
            <span class="info-val">${cls.note || 'Không có ghi chú'}</span>
          </div>
        </div>
      </div>

      <div class="detail-teachers-container">
        <div class="detail-section-title">
          <i class="fa-solid fa-users-line"></i>
          <span>Danh Sách Giáo Lý Viên / Huynh Trưởng Phụ Trách (${teachers.length})</span>
        </div>

        ${teachers.length > 0 ? teachers.map(t => `
          <div class="teacher-detail-card">
            <img class="teacher-card-avatar" src="${getGlvAvatar(t)}" alt="avatar">
            <div class="teacher-card-info">
              <span class="teacher-card-holy">${t.holyName || ''}</span>
              <span class="teacher-card-name">${t.lastName} ${t.firstName}</span>
              <span class="teacher-card-meta">Mã: <strong>${t.id}</strong> &bull; ${t.gender === 'Nam' ? '♂ Nam' : '♀ Nữ'} &bull; ${t.cert ? 'Chứng chỉ Cấp ' + t.cert : 'Chưa có chứng chỉ'}</span>
            </div>
            <button class="btn-view-teacher-glv" data-glv-id="${t.id}" title="Xem thẻ Giáo Lý Viên">
              <i class="fa-solid fa-id-badge"></i> Xem Thẻ
            </button>
          </div>
        `).join('') : '<p style="color: #64748b; font-style: italic;">Chưa phân công Huynh Trưởng cho lớp học này.</p>'}
      </div>
    `;

    // Sự kiện nút "Xem Thẻ" của từng GLV trong modal chi tiết lớp
    classDetailBody.querySelectorAll('.btn-view-teacher-glv').forEach(btn => {
      btn.addEventListener('click', () => {
        const glvId = btn.getAttribute('data-glv-id');
        const foundGLV = glvDatabase.find(g => g.id.toUpperCase() === glvId.toUpperCase());
        if (foundGLV) {
          classDetailModal.style.display = 'none';
          switchTab('glv');
          searchInput.value = foundGLV.id;
          clearSearchBtn.style.display = 'flex';
          displayProfileCard(foundGLV);
        }
      });
    });
  }

  // Nút Sửa lớp trong chân modal chi tiết
  if (btnEditClassFromDetail) {
    btnEditClassFromDetail.style.display = (currentUserRole === 'admin') ? 'inline-flex' : 'none';
  }

  classDetailModal.style.display = 'flex';
}

function openEditClassModal(classId = null) {
  if (currentUserRole === 'guest') {
    showToast('Chỉ Quản Trị Viên (Admin) mới có quyền thêm/sửa lớp học!');
    return;
  }

  if (classId) {
    // Chế độ Sửa lớp
    const cls = classDatabase.find(c => c.id === classId);
    if (!cls) return;

    editClassOriginalId.value = cls.id;
    editClassModalTitle.textContent = `Chỉnh Sửa Lớp: ${cls.name}`;
    formClassName.value = cls.name;
    formClassBlock.value = cls.block;
    formClassRoom.value = cls.room || '';
    formClassSchedule.value = cls.schedule || '';
    formClassStudents.value = cls.studentCount || '';
    formClassNote.value = cls.note || '';

    renderTeacherCheckboxes(cls.teacherIds || []);
  } else {
    // Chế độ Thêm mới lớp
    editClassOriginalId.value = '';
    editClassModalTitle.textContent = 'Thêm Lớp Giáo Lý Mới';
    formClassName.value = '';
    formClassBlock.value = 'Khai Tâm';
    formClassRoom.value = '';
    formClassSchedule.value = 'Chủ Nhật: 07:30 - 09:00';
    formClassStudents.value = '30';
    formClassNote.value = '';

    renderTeacherCheckboxes([]);
  }

  if (classDetailModal) classDetailModal.style.display = 'none';
  editClassModal.style.display = 'flex';
  formClassName.focus();
}

function renderTeacherCheckboxes(selectedTeacherIds = [], filterQuery = '') {
  if (!teacherCheckboxList) return;
  teacherCheckboxList.innerHTML = '';

  const qNorm = removeVietnameseTones(filterQuery.toLowerCase());

  glvDatabase.forEach(glv => {
    const fullNameNorm = removeVietnameseTones(`${glv.holyName} ${glv.lastName} ${glv.firstName}`);
    const idNorm = glv.id.toLowerCase();

    if (filterQuery && !fullNameNorm.includes(qNorm) && !idNorm.includes(qNorm)) {
      return;
    }

    const isChecked = selectedTeacherIds.includes(glv.id);
    const label = document.createElement('label');
    label.className = 'teacher-checkbox-item';
    label.innerHTML = `
      <input type="checkbox" value="${glv.id}" ${isChecked ? 'checked' : ''}>
      <img src="${getGlvAvatar(glv)}" alt="avatar">
      <span class="teacher-name-label"><strong>${glv.id}</strong>: ${glv.holyName || ''} ${glv.firstName}</span>
    `;

    teacherCheckboxList.appendChild(label);
  });
}

function handleClassFormSubmit(e) {
  e.preventDefault();

  const originalId = editClassOriginalId.value.trim();
  const name = formClassName.value.trim();
  const block = formClassBlock.value;
  const room = formClassRoom.value.trim();
  const schedule = formClassSchedule.value.trim();
  const studentCount = parseInt(formClassStudents.value) || 0;
  const note = formClassNote.value.trim();

  if (!name) {
    alert('Vui lòng nhập Tên Lớp Học!');
    return;
  }

  // Lấy danh sách ID các GLV được chọn
  const selectedTeacherIds = [];
  teacherCheckboxList.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
    selectedTeacherIds.push(cb.value);
  });

  if (originalId) {
    // Cập nhật lớp hiện có
    const index = classDatabase.findIndex(c => c.id === originalId);
    if (index !== -1) {
      classDatabase[index] = {
        ...classDatabase[index],
        name,
        block,
        room,
        schedule,
        studentCount,
        teacherIds: selectedTeacherIds,
        note
      };
      saveClassesDatabase();
      syncClassesWithGlvDatabase();
      showToast(`Đã cập nhật thông tin lớp ${name}!`);
    }
  } else {
    // Thêm mới lớp
    const newId = `CLASS_${Date.now()}`;
    const newClass = {
      id: newId,
      name,
      block,
      room,
      schedule,
      studentCount,
      teacherIds: selectedTeacherIds,
      note
    };
    classDatabase.push(newClass);
    saveClassesDatabase();
    syncClassesWithGlvDatabase();
    showToast(`Đã thêm mới lớp học ${name}!`);
  }

  editClassModal.style.display = 'none';
  renderBlockFilterPillCounts();
  renderClassesView();
}

function syncClassesWithGlvDatabase() {
  // Cập nhật trường teachingClass và block cho các GLV theo danh sách lớp
  classDatabase.forEach(cls => {
    (cls.teacherIds || []).forEach(tid => {
      const glv = glvDatabase.find(g => g.id.toUpperCase() === tid.toUpperCase());
      if (glv) {
        glv.block = cls.block;
        glv.teachingClass = cls.name;
      }
    });
  });
  saveDatabase();
}

// ==========================================================================
// THIẾT LẬP TẤT CẢ SỰ KIỆN (EVENT LISTENERS)
// ==========================================================================
function setupEventListeners() {
  // 1. Sidebar & Menu Tab Navigation
  if (navItemGlv) {
    navItemGlv.addEventListener('click', () => switchTab('glv'));
  }
  if (navItemClasses) {
    navItemClasses.addEventListener('click', () => switchTab('classes'));
  }
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', openMobileSidebar);
  }
  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener('click', closeMobileSidebar);
  }
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeMobileSidebar);
  }

  // Tiện ích nhanh trên sidebar
  if (sidebarViewAllGlvBtn) {
    sidebarViewAllGlvBtn.addEventListener('click', () => {
      closeMobileSidebar();
      switchTab('glv');
      if (viewAllBtn) viewAllBtn.click();
    });
  }
  if (sidebarAddGlvBtn) {
    sidebarAddGlvBtn.addEventListener('click', () => {
      closeMobileSidebar();
      switchTab('glv');
      openAddModal();
    });
  }
  if (sidebarAddClassBtn) {
    sidebarAddClassBtn.addEventListener('click', () => {
      closeMobileSidebar();
      switchTab('classes');
      openEditClassModal();
    });
  }
  if (sidebarAuthSwitchBtn) {
    sidebarAuthSwitchBtn.addEventListener('click', () => {
      closeMobileSidebar();
      if (authSwitchBtn) authSwitchBtn.click();
    });
  }

  // 2. Tìm kiếm GLV realtime
  let debounceTimer;
  searchInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    if (val.length > 0) {
      clearSearchBtn.style.display = 'flex';
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const suggs = getSuggestions(val);
        renderSuggestions(suggs);
      }, 150);
    } else {
      clearSearchBtn.style.display = 'none';
      suggestionsBox.style.display = 'none';
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-card')) {
      suggestionsBox.style.display = 'none';
    }
  });

  searchBtn.addEventListener('click', () => {
    suggestionsBox.style.display = 'none';
    executeSearch(searchInput.value);
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      suggestionsBox.style.display = 'none';
      executeSearch(searchInput.value);
    }
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    suggestionsBox.style.display = 'none';
    searchInput.focus();
    showWelcomeState();
  });

  // 3. Phân quyền Admin / Guest & Login Modal
  if (authSwitchBtn) {
    authSwitchBtn.addEventListener('click', () => {
      if (loginModal) {
        loginModal.style.display = 'flex';
        if (adminPasswordInput) {
          adminPasswordInput.value = '';
          adminPasswordInput.focus();
        }
      }
    });
  }

  if (closeLoginModalBtn) {
    closeLoginModalBtn.addEventListener('click', () => {
      if (loginModal) loginModal.style.display = 'none';
    });
  }

  if (loginModal) {
    loginModal.addEventListener('click', (e) => {
      if (e.target === loginModal) loginModal.style.display = 'none';
    });
  }

  if (submitAdminLoginBtn) {
    submitAdminLoginBtn.addEventListener('click', checkAdminPassword);
  }

  if (adminPasswordInput) {
    adminPasswordInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        checkAdminPassword();
      }
    });
  }

  if (togglePasswordBtn && adminPasswordInput) {
    togglePasswordBtn.addEventListener('click', () => {
      const isPassword = (adminPasswordInput.type === 'password');
      adminPasswordInput.type = isPassword ? 'text' : 'password';
      if (togglePasswordIcon) {
        togglePasswordIcon.className = isPassword ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash';
      }
    });
  }

  if (submitGuestLoginBtn) {
    submitGuestLoginBtn.addEventListener('click', () => {
      setRole('guest');
      if (loginModal) loginModal.style.display = 'none';
      showToast('Đã chuyển sang vai trò Khách (Guest)!');
    });
  }

  // Quick Tags
  document.querySelectorAll('.quick-tag-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.getAttribute('data-query');
      searchInput.value = q;
      clearSearchBtn.style.display = 'flex';
      executeSearch(q);
    });
  });

  // Thao tác trên thẻ GLV
  printBtn.addEventListener('click', () => {
    window.print();
  });

  if (editCurrentGlvBtn) {
    editCurrentGlvBtn.addEventListener('click', () => {
      if (currentDisplayedGLV) {
        openEditModal(currentDisplayedGLV.id);
      }
    });
  }

  copyBtn.addEventListener('click', () => {
    if (!currentDisplayedGLV) return;
    const g = currentDisplayedGLV;
    const textToCopy = `[THÔNG TIN GIÁO LÝ VIÊN]\n- Mã ID: ${g.id}\n- Tên Thánh: ${g.holyName}\n- Họ và Tên: ${g.lastName} ${g.firstName}\n- Giới tính: ${g.gender || 'Nữ'}\n- Chứng chỉ: ${g.cert ? 'Cấp ' + g.cert : 'Chưa có'}\n- Khối Lớp: ${g.block ? 'Khối ' + g.block : 'Chưa phân khối'}\n- Lớp giảng dạy: ${g.teachingClass || 'Chưa phân công'}`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast('Đã sao chép thông tin Giáo Lý Viên!');
    }).catch(() => {
      showToast('Không thể tự động sao chép!');
    });
  });

  resetBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    searchInput.focus();
    showWelcomeState();
  });

  // Modal Danh Sách Toàn Bộ GLV
  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', () => {
      allGlvModal.style.display = 'flex';
      if (modalFilterInput) modalFilterInput.value = '';
      if (filterGender) filterGender.value = 'all';
      if (filterBlock) filterBlock.value = 'all';
      if (filterCert) filterCert.value = 'all';
      currentSort = { column: 'stt', order: 'asc' };
      applyModalFilters();
      if (modalFilterInput) modalFilterInput.focus();
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      allGlvModal.style.display = 'none';
    });
  }

  if (allGlvModal) {
    allGlvModal.addEventListener('click', (e) => {
      if (e.target === allGlvModal) {
        allGlvModal.style.display = 'none';
      }
    });
  }

  if (modalFilterInput) {
    modalFilterInput.addEventListener('input', applyModalFilters);
  }

  if (filterGender) filterGender.addEventListener('change', applyModalFilters);
  if (filterBlock) filterBlock.addEventListener('change', applyModalFilters);
  if (filterCert) filterCert.addEventListener('change', applyModalFilters);

  document.querySelectorAll('.th-sortable').forEach(th => {
    th.addEventListener('click', () => {
      const col = th.getAttribute('data-sort');
      if (currentSort.column === col) {
        currentSort.order = (currentSort.order === 'asc') ? 'desc' : 'asc';
      } else {
        currentSort.column = col;
        currentSort.order = 'asc';
      }
      applyModalFilters();
    });
  });

  // Modal Form Sửa/Thêm GLV
  if (addNewGlvBtn) addNewGlvBtn.addEventListener('click', openAddModal);
  if (modalAddGlvBtn) modalAddGlvBtn.addEventListener('click', openAddModal);
  if (closeEditModalBtn) closeEditModalBtn.addEventListener('click', closeEditModal);
  if (cancelEditBtn) cancelEditBtn.addEventListener('click', closeEditModal);
  if (editGlvModal) {
    editGlvModal.addEventListener('click', (e) => {
      if (e.target === editGlvModal) closeEditModal();
    });
  }

  if (formGender) {
    formGender.addEventListener('change', () => {
      if (!formPhotoData.value) {
        formPhotoPreview.src = (formGender.value === 'Nam') ? DEFAULT_AVATAR_MALE : DEFAULT_AVATAR_FEMALE;
      }
    });
  }

  if (formPhotoInput) {
    formPhotoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file hình ảnh (JPG, PNG)!');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Data = event.target.result;
        formPhotoData.value = base64Data;
        formPhotoPreview.src = base64Data;
        showToast('Đã tải ảnh lên thành công!');
      };
      reader.readAsDataURL(file);
    });
  }

  if (formPhotoResetBtn) {
    formPhotoResetBtn.addEventListener('click', () => {
      formPhotoData.value = '';
      formPhotoInput.value = '';
      formPhotoPreview.src = (formGender.value === 'Nam') ? DEFAULT_AVATAR_MALE : DEFAULT_AVATAR_FEMALE;
      showToast('Đã chuyển về ảnh đại diện mặc định!');
    });
  }

  if (glvEditForm) {
    glvEditForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveGlvForm();
    });
  }

  if (exportExcelBtn) exportExcelBtn.addEventListener('click', exportDatabaseToExcel);
  if (resetDataBtn) resetDataBtn.addEventListener('click', resetDatabaseToOriginal);

  // 4. Sự kiện Phân hệ Lớp Học
  if (classSearchInput) {
    classSearchInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      if (classClearSearchBtn) {
        classClearSearchBtn.style.display = val ? 'flex' : 'none';
      }
      renderClassesView();
    });
  }

  if (classClearSearchBtn) {
    classClearSearchBtn.addEventListener('click', () => {
      classSearchInput.value = '';
      classClearSearchBtn.style.display = 'none';
      classSearchInput.focus();
      renderClassesView();
    });
  }

  // Bộ lọc Khối Lớp (Pill Buttons)
  if (blockFilterPills) {
    blockFilterPills.querySelectorAll('.pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        blockFilterPills.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentBlockFilter = btn.getAttribute('data-block');
        renderClassesView();
      });
    });
  }

  if (resetClassFilterBtn) {
    resetClassFilterBtn.addEventListener('click', () => {
      if (classSearchInput) classSearchInput.value = '';
      if (classClearSearchBtn) classClearSearchBtn.style.display = 'none';
      currentBlockFilter = 'all';
      if (blockFilterPills) {
        blockFilterPills.querySelectorAll('.pill-btn').forEach(b => {
          b.classList.toggle('active', b.getAttribute('data-block') === 'all');
        });
      }
      renderClassesView();
    });
  }

  if (addClassBtn) {
    addClassBtn.addEventListener('click', () => openEditClassModal());
  }

  // Modal Chi Tiết Lớp
  if (closeClassDetailModalBtn) {
    closeClassDetailModalBtn.addEventListener('click', () => {
      if (classDetailModal) classDetailModal.style.display = 'none';
    });
  }
  if (closeClassDetailFooterBtn) {
    closeClassDetailFooterBtn.addEventListener('click', () => {
      if (classDetailModal) classDetailModal.style.display = 'none';
    });
  }
  if (classDetailModal) {
    classDetailModal.addEventListener('click', (e) => {
      if (e.target === classDetailModal) classDetailModal.style.display = 'none';
    });
  }
  if (btnEditClassFromDetail) {
    btnEditClassFromDetail.addEventListener('click', () => {
      if (currentDisplayedClass) {
        openEditClassModal(currentDisplayedClass.id);
      }
    });
  }

  // Modal Sửa/Thêm Lớp
  if (closeEditClassModalBtn) {
    closeEditClassModalBtn.addEventListener('click', () => {
      if (editClassModal) editClassModal.style.display = 'none';
    });
  }
  if (cancelEditClassBtn) {
    cancelEditClassBtn.addEventListener('click', () => {
      if (editClassModal) editClassModal.style.display = 'none';
    });
  }
  if (editClassModal) {
    editClassModal.addEventListener('click', (e) => {
      if (e.target === editClassModal) editClassModal.style.display = 'none';
    });
  }
  if (teacherSearchFilter) {
    teacherSearchFilter.addEventListener('input', (e) => {
      const selected = [];
      if (teacherCheckboxList) {
        teacherCheckboxList.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
          selected.push(cb.value);
        });
      }
      renderTeacherCheckboxes(selected, e.target.value.trim());
    });
  }
  if (classEditForm) {
    classEditForm.addEventListener('submit', handleClassFormSubmit);
  }
}

// ==========================================================================
// CÁC HÀM XỬ LÝ CHỈNH SỬA / THÊM / XÓA GLV
// ==========================================================================
function openAddModal() {
  if (currentUserRole === 'guest') {
    showToast('Chỉ Quản Trị Viên (Admin) mới có quyền thêm Giáo Lý Viên mới!');
    return;
  }

  editOriginalId.value = '';
  editModalTitle.innerHTML = '<i class="fa-solid fa-user-plus"></i> Thêm Giáo Lý Viên Mới';
  
  const nextNumber = glvDatabase.length + 1;
  formId.value = `GLV${String(nextNumber).padStart(2, '0')}`;
  formGender.value = 'Nữ';
  formHolyName.value = '';
  formLastName.value = '';
  formFirstName.value = '';
  formCert.value = '';
  if (formBlock) formBlock.value = '';
  formClass.value = '';
  
  formPhotoData.value = '';
  if (formPhotoInput) formPhotoInput.value = '';
  formPhotoPreview.src = DEFAULT_AVATAR_FEMALE;

  setFormInputsLockState(false);
  if (guestFormAlert) guestFormAlert.style.display = 'none';

  editGlvModal.style.display = 'flex';
  formHolyName.focus();
}

function openEditModal(glvId) {
  const glv = glvDatabase.find(item => item.id.toUpperCase() === glvId.toUpperCase());
  if (!glv) {
    showToast('Không tìm thấy thông tin để chỉnh sửa!');
    return;
  }

  editOriginalId.value = glv.id;
  editModalTitle.innerHTML = `<i class="fa-solid fa-user-pen"></i> Chỉnh Sửa: ${glv.id}`;
  
  formId.value = glv.id;
  formGender.value = glv.gender || 'Nữ';
  formHolyName.value = glv.holyName || '';
  formLastName.value = glv.lastName || '';
  formFirstName.value = glv.firstName || '';
  formCert.value = glv.cert || '';
  if (formBlock) formBlock.value = glv.block || '';
  formClass.value = glv.teachingClass || '';

  formPhotoData.value = glv.photo || '';
  if (formPhotoInput) formPhotoInput.value = '';
  formPhotoPreview.src = getGlvAvatar(glv);

  const isGuest = (currentUserRole === 'guest');
  setFormInputsLockState(isGuest);

  if (guestFormAlert) {
    guestFormAlert.style.display = isGuest ? 'flex' : 'none';
  }

  editGlvModal.style.display = 'flex';
  formFirstName.focus();
}

function setFormInputsLockState(isGuest) {
  if (formId) {
    formId.disabled = isGuest;
    formId.classList.toggle('input-locked', isGuest);
  }
  if (formGender) {
    formGender.disabled = isGuest;
    formGender.classList.toggle('input-locked', isGuest);
  }
  if (formCert) {
    formCert.disabled = isGuest;
    formCert.classList.toggle('input-locked', isGuest);
  }
  if (formBlock) {
    formBlock.disabled = isGuest;
    formBlock.classList.toggle('input-locked', isGuest);
  }
  if (formClass) {
    formClass.disabled = isGuest;
    formClass.classList.toggle('input-locked', isGuest);
  }

  if (formHolyName) {
    formHolyName.disabled = false;
    formHolyName.classList.remove('input-locked');
  }
  if (formLastName) {
    formLastName.disabled = false;
    formLastName.classList.remove('input-locked');
  }
  if (formFirstName) {
    formFirstName.disabled = false;
    formFirstName.classList.remove('input-locked');
  }
}

function closeEditModal() {
  if (editGlvModal) {
    editGlvModal.style.display = 'none';
  }
}

function saveGlvForm() {
  const originalId = editOriginalId.value.trim();
  const id = formId.value.trim().toUpperCase();
  const gender = formGender.value;
  const holyName = formHolyName.value.trim().toUpperCase();
  const lastName = formLastName.value.trim().toUpperCase();
  const firstName = formFirstName.value.trim().toUpperCase();
  const cert = formCert.value.trim();
  const block = formBlock ? formBlock.value.trim() : '';
  const teachingClass = formClass.value.trim();
  const photo = formPhotoData.value;

  if (!firstName) {
    alert('Vui lòng điền Tên!');
    return;
  }

  const isGuest = (currentUserRole === 'guest');

  if (originalId) {
    const index = glvDatabase.findIndex(item => item.id.toUpperCase() === originalId.toUpperCase());
    if (index !== -1) {
      if (isGuest) {
        glvDatabase[index] = {
          ...glvDatabase[index],
          holyName,
          lastName,
          firstName,
          photo
        };
      } else {
        glvDatabase[index] = {
          ...glvDatabase[index],
          id,
          gender,
          holyName,
          lastName,
          firstName,
          cert,
          block,
          teachingClass,
          photo
        };
      }

      saveDatabase();
      showToast(`Đã cập nhật thông tin ${glvDatabase[index].id} thành công!`);

      if (currentDisplayedGLV && currentDisplayedGLV.id.toUpperCase() === originalId.toUpperCase()) {
        displayProfileCard(glvDatabase[index]);
      }
    }
  } else {
    if (isGuest) {
      alert('Tài khoản Khách không có quyền thêm mới Giáo Lý Viên!');
      return;
    }

    if (!id) {
      alert('Vui lòng nhập Mã ID!');
      return;
    }

    const exists = glvDatabase.some(item => item.id.toUpperCase() === id);
    if (exists) {
      alert(`Mã ID "${id}" đã tồn tại! Vui lòng chọn mã khác.`);
      return;
    }

    const newGLV = {
      stt: glvDatabase.length + 1,
      id,
      gender,
      holyName,
      lastName,
      firstName,
      cert,
      block,
      teachingClass,
      photo
    };

    glvDatabase.push(newGLV);
    saveDatabase();
    showToast(`Đã thêm mới Giáo Lý Viên ${id}!`);
    displayProfileCard(newGLV);
  }

  closeEditModal();
  applyModalFilters();
}

function deleteGLV(glvId) {
  if (currentUserRole === 'guest') {
    showToast('Chỉ Quản Trị Viên (Admin) mới có quyền xóa hồ sơ!');
    return;
  }

  const glv = glvDatabase.find(item => item.id.toUpperCase() === glvId.toUpperCase());
  if (!glv) return;

  const confirmDelete = confirm(`Bạn có chắc chắn muốn xóa Giáo Lý Viên ${glv.id} (${glv.holyName} ${glv.lastName} ${glv.firstName}) không?`);
  if (!confirmDelete) return;

  glvDatabase = glvDatabase.filter(item => item.id.toUpperCase() !== glvId.toUpperCase());
  
  glvDatabase.forEach((item, idx) => {
    item.stt = idx + 1;
  });

  saveDatabase();
  showToast(`Đã xóa Giáo Lý Viên ${glv.id}!`);

  if (currentDisplayedGLV && currentDisplayedGLV.id.toUpperCase() === glvId.toUpperCase()) {
    showWelcomeState();
  }

  applyModalFilters();
}

function exportDatabaseToExcel() {
  if (typeof XLSX === 'undefined') {
    showToast('Thư viện Excel đang tải, vui lòng thử lại sau vài giây!');
    return;
  }

  try {
    const exportRows = glvDatabase.map(item => ({
      'Stt': item.stt,
      'ID': item.id,
      'Tên Thánh': item.holyName || '',
      'Họ và': item.lastName || '',
      'Tên': item.firstName || '',
      'Giới tính': item.gender || 'Nữ',
      'Chứng chỉ GLV': item.cert || '',
      'Khối Lớp': item.block || '',
      'Lớp giảng dạy': item.teachingClass || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách GLV');

    const fileName = `Data_GiaoLyVien_CapNhat_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    showToast('Đã xuất file Excel thành công!');
  } catch (err) {
    console.error('Lỗi xuất Excel:', err);
    showToast('Lỗi khi xuất file Excel!');
  }
}

function resetDatabaseToOriginal() {
  const confirmReset = confirm('Bạn có chắc chắn muốn khôi phục toàn bộ danh sách về dữ liệu gốc ban đầu không? Mọi chỉnh sửa tùy biến sẽ bị xóa.');
  if (!confirmReset) return;

  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(CLASS_STORAGE_KEY);
  glvDatabase = [...DEFAULT_DATASET];
  classDatabase = [...DEFAULT_CLASSES_DATASET];
  
  updateStatsDisplay();
  initClassModule();
  
  if (modalFilterInput) modalFilterInput.value = '';
  if (filterGender) filterGender.value = 'all';
  if (filterBlock) filterBlock.value = 'all';
  if (filterCert) filterCert.value = 'all';
  currentSort = { column: 'stt', order: 'asc' };
  
  applyModalFilters();
  showWelcomeState();
  if (currentTab === 'classes') renderClassesView();
  showToast('Đã khôi phục dữ liệu về ban đầu!');
}

function applyModalFilters() {
  const textQuery = modalFilterInput ? modalFilterInput.value.trim() : '';
  const selGender = filterGender ? filterGender.value : 'all';
  const selBlock = filterBlock ? filterBlock.value : 'all';
  const selCert = filterCert ? filterCert.value : 'all';

  let filtered = textQuery ? searchGLV(textQuery) : [...glvDatabase];

  if (selGender !== 'all') {
    filtered = filtered.filter(item => item.gender === selGender);
  }

  if (selBlock !== 'all') {
    if (selBlock === 'none') {
      filtered = filtered.filter(item => !item.block || item.block.trim() === '');
    } else {
      filtered = filtered.filter(item => item.block === selBlock);
    }
  }

  if (selCert !== 'all') {
    if (selCert === 'none') {
      filtered = filtered.filter(item => !item.cert || item.cert.trim() === '');
    } else {
      filtered = filtered.filter(item => String(item.cert || '').includes(selCert));
    }
  }

  filtered.sort((a, b) => {
    let valA = a[currentSort.column] || '';
    let valB = b[currentSort.column] || '';

    if (currentSort.column === 'stt') {
      return currentSort.order === 'asc' ? (a.stt - b.stt) : (b.stt - a.stt);
    }
    if (currentSort.column === 'name') {
      valA = `${a.lastName} ${a.firstName}`;
      valB = `${b.lastName} ${b.firstName}`;
    }
    if (currentSort.column === 'class') {
      valA = a.teachingClass || '';
      valB = b.teachingClass || '';
    }

    const comp = String(valA).localeCompare(String(valB), 'vi', { sensitivity: 'base' });
    return currentSort.order === 'asc' ? comp : -comp;
  });

  if (filterResultCount) {
    filterResultCount.textContent = filtered.length;
  }

  renderAllGlvTable(filtered);
  updateSortHeaderIcons();
}

function updateSortHeaderIcons() {
  document.querySelectorAll('.th-sortable').forEach(th => {
    const col = th.getAttribute('data-sort');
    const icon = th.querySelector('.sort-icon');
    if (!icon) return;

    th.classList.remove('sorted-asc', 'sorted-desc');
    icon.className = 'fa-solid fa-sort sort-icon';

    if (currentSort.column === col) {
      if (currentSort.order === 'asc') {
        th.classList.add('sorted-asc');
        icon.className = 'fa-solid fa-sort-up sort-icon';
      } else {
        th.classList.add('sorted-desc');
        icon.className = 'fa-solid fa-sort-down sort-icon';
      }
    }
  });
}

function renderAllGlvTable(list) {
  allGlvTableBody.innerHTML = '';
  if (list.length === 0) {
    allGlvTableBody.innerHTML = '<tr><td colspan="10" style="text-align: center; color: #64748b; padding: 2rem;">Không tìm thấy Giáo Lý Viên nào phù hợp</td></tr>';
    return;
  }

  list.forEach(item => {
    const isMale = (item.gender === 'Nam');
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>#${item.stt}</strong></td>
      <td>
        <div class="table-avatar-cell">
          <img class="table-avatar-img" src="${getGlvAvatar(item)}" alt="Ảnh GLV">
        </div>
      </td>
      <td><span class="sugg-id">${item.id}</span></td>
      <td style="color: #b45309; font-family: var(--font-serif); font-style: italic; font-weight: 700;">${item.holyName || ''}</td>
      <td style="font-weight: 800; color: #0f172a; white-space: nowrap;">${item.lastName} ${item.firstName}</td>
      <td>
        <span class="badge-gender ${isMale ? 'badge-gender-male' : 'badge-gender-female'}">
          ${isMale ? '<i class="fa-solid fa-mars"></i> Nam' : '<i class="fa-solid fa-venus"></i> Nữ'}
        </span>
      </td>
      <td><span class="badge-cert" style="font-size: 0.78rem;">${item.cert ? 'Cấp ' + item.cert : '—'}</span></td>
      <td style="color: #0369a1; font-weight: 700;">${item.block ? 'Khối ' + item.block : '—'}</td>
      <td style="color: #475569; font-weight: 500;">${item.teachingClass || 'Chưa phân công'}</td>
      <td>
        <div class="table-action-group">
          <button class="btn-action-icon btn-action-view" data-id="${item.id}" title="Xem thẻ Giáo Lý Viên">
            <i class="fa-solid fa-eye"></i>
          </button>
          <button class="btn-action-icon btn-action-edit" data-id="${item.id}" title="Sửa thông tin">
            <i class="fa-solid fa-pen"></i>
          </button>
          ${currentUserRole === 'admin' ? `
          <button class="btn-action-icon btn-action-delete" data-id="${item.id}" title="Xóa GLV này">
            <i class="fa-solid fa-trash"></i>
          </button>
          ` : ''}
        </div>
      </td>
    `;

    tr.querySelector('.btn-action-view').addEventListener('click', () => {
      allGlvModal.style.display = 'none';
      switchTab('glv');
      searchInput.value = item.id;
      clearSearchBtn.style.display = 'flex';
      displayProfileCard(item);
    });

    tr.querySelector('.btn-action-edit').addEventListener('click', () => {
      openEditModal(item.id);
    });

    if (currentUserRole === 'admin') {
      const deleteBtn = tr.querySelector('.btn-action-delete');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', () => deleteGLV(item.id));
      }
    }

    allGlvTableBody.appendChild(tr);
  });
}

function showToast(message) {
  if (!toastNotification || !toastMessage) return;
  toastMessage.textContent = message;
  toastNotification.classList.add('show');
  setTimeout(() => {
    toastNotification.classList.remove('show');
  }, 2800);
}

// ==========================================================================
// TỰ ĐỘNG NẠP FILE DATA.XLSX NẾU CÓ TRÊN HOSTING
// ==========================================================================
function tryAutoFetchExcel() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return;

  fetch('Data.xlsx')
    .then(res => {
      if (res.ok) return res.arrayBuffer();
      throw new Error('Không tìm thấy file Data.xlsx');
    })
    .then(buffer => {
      parseExcelArrayBuffer(buffer, 'Data.xlsx');
    })
    .catch(err => {
      console.log('Sử dụng dữ liệu khởi tạo mặc định:', err.message);
    });
}

function normalizeHeader(h) {
  return removeVietnameseTones(String(h || '').trim().toLowerCase());
}

function parseExcelArrayBuffer(arrayBuffer, fileName) {
  try {
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (!jsonData || jsonData.length < 2) return;

    const headers = jsonData[0].map(h => normalizeHeader(String(h || '')));
    
    const colIndex = {
      stt: headers.findIndex(h => h.includes('stt') || h.includes('so tt') || h.includes('thu tu')),
      id: headers.findIndex(h => h.includes('id') || h.includes('ma') || h.includes('code')),
      holyName: headers.findIndex(h => h.includes('ten thanh') || h.includes('thanh')),
      lastName: headers.findIndex(h => h.includes('ho va') || h.includes('ho va ten dem') || (h.includes('ho') && !h.includes('ten'))),
      firstName: headers.findIndex(h => h === 'ten' || h.includes('ten goi') || (h.includes('ten') && !h.includes('thanh') && !h.includes('ho'))),
      gender: headers.findIndex(h => h.includes('gioi tinh') || h.includes('phai') || h.includes('nam/nu')),
      cert: headers.findIndex(h => h.includes('chung chi') || h.includes('bang cap') || h.includes('cap')),
      block: headers.findIndex(h => h.includes('khoi') || h.includes('khoi lop')),
      class: headers.findIndex(h => h.includes('lop') || h.includes('giang day') || h.includes('phan cong'))
    };

    const fullCombinedNameIdx = headers.findIndex(h => h.includes('ho va ten') || h.includes('ho ten'));

    const parsedList = [];
    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (!row || row.length === 0) continue;

      let id = colIndex.id !== -1 && row[colIndex.id] ? String(row[colIndex.id]).trim() : '';
      let stt = colIndex.stt !== -1 && row[colIndex.stt] ? parseInt(row[colIndex.stt]) : parsedList.length + 1;
      let holyName = colIndex.holyName !== -1 && row[colIndex.holyName] ? String(row[colIndex.holyName]).trim() : '';
      let lastName = colIndex.lastName !== -1 && row[colIndex.lastName] ? String(row[colIndex.lastName]).trim() : '';
      let firstName = colIndex.firstName !== -1 && row[colIndex.firstName] ? String(row[colIndex.firstName]).trim() : '';
      let gender = colIndex.gender !== -1 && row[colIndex.gender] ? String(row[colIndex.gender]).trim() : '';
      let cert = colIndex.cert !== -1 && row[colIndex.cert] !== undefined ? String(row[colIndex.cert]).trim() : '';
      let block = colIndex.block !== -1 && row[colIndex.block] !== undefined ? String(row[colIndex.block]).trim() : '';
      let teachingClass = colIndex.class !== -1 && row[colIndex.class] !== undefined ? String(row[colIndex.class]).trim() : '';

      if (!id && !firstName && !lastName && fullCombinedNameIdx === -1) continue;

      if (!gender) {
        const hUpper = holyName.toUpperCase();
        if (['MARIA', 'ANNA', 'TERESA', 'TÊRÊSA', 'CATARINA', 'CECILIA'].some(n => hUpper.includes(n))) {
          gender = 'Nữ';
        } else {
          gender = 'Nam';
        }
      }

      parsedList.push({
        stt: stt || parsedList.length + 1,
        id: id || `GLV${String(parsedList.length + 1).padStart(2, '0')}`,
        holyName: holyName,
        lastName: lastName,
        firstName: firstName,
        gender: gender,
        cert: cert,
        block: block,
        teachingClass: teachingClass,
        photo: ''
      });
    }

    if (parsedList.length > 0) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        glvDatabase = parsedList;
        saveDatabase();
      }
    }
  } catch (err) {
    console.warn('Lỗi đọc dữ liệu từ Excel:', err);
  }
}
