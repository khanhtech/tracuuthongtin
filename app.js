/**
 * HỆ THỐNG TRA CỨU GIÁO LÝ VIÊN (GLV) - XỨ ĐOÀN TÂN MỸ
 * Logic xử lý đọc dữ liệu, tìm kiếm thông minh, render thẻ, ảnh thẻ, giới tính, in ấn và quản trị
 */

// Đường dẫn ảnh avatar mặc định theo giới tính
const DEFAULT_AVATAR_MALE = 'assets/avatar_male.jpg';
const DEFAULT_AVATAR_FEMALE = 'assets/avatar_female.jpg';

// Dữ liệu chuẩn bị sẵn từ Data.xlsx với trường Giới tính (Nam/Nữ) và Ảnh
const DEFAULT_DATASET = [
  { stt: 1, id: 'GLV01', holyName: 'MARIA', lastName: 'NGUYỄN THỊ VÂN', firstName: 'ANH', gender: 'Nữ', cert: '2', block: '', teachingClass: '', photo: '' },
  { stt: 2, id: 'GLV02', holyName: 'GIUSE', lastName: 'NGUYỄN CÔNG', firstName: 'ANH', gender: 'Nam', cert: '3', block: '', teachingClass: '', photo: '' },
  { stt: 3, id: 'GLV03', holyName: 'VINCENT', lastName: 'VŨ THÀNH', firstName: 'ÂN', gender: 'Nam', cert: '2', block: '', teachingClass: '', photo: '' },
  { stt: 4, id: 'GLV04', holyName: 'INHAXIO', lastName: 'PHAN THIÊN', firstName: 'ÂN', gender: 'Nam', cert: '2', block: '', teachingClass: '', photo: '' },
  { stt: 5, id: 'GLV05', holyName: 'GIUSE', lastName: 'LÊ', firstName: 'DUY', gender: 'Nam', cert: '1', block: '', teachingClass: '', photo: '' },
  { stt: 6, id: 'GLV06', holyName: 'GIUSE', lastName: 'PHẠM ĐĂNG', firstName: 'DUY', gender: 'Nam', cert: '', block: '', teachingClass: '', photo: '' },
  { stt: 7, id: 'GLV07', holyName: 'GIUSE', lastName: 'NGUYỄN THÁI', firstName: 'DƯƠNG', gender: 'Nam', cert: '1', block: '', teachingClass: '', photo: '' },
  { stt: 8, id: 'GLV08', holyName: 'ĐAMINH', lastName: 'LÊ TRÍ', firstName: 'ĐẠO', gender: 'Nam', cert: '2', block: '', teachingClass: '', photo: '' },
  { stt: 9, id: 'GLV09', holyName: 'GIUSE', lastName: 'TRỊNH THANH', firstName: 'HẢI', gender: 'Nam', cert: '1', block: '', teachingClass: '', photo: '' },
  { stt: 10, id: 'GLV10', holyName: 'TERESA', lastName: 'NGUYỄN THỊ NGỌC', firstName: 'HÂN', gender: 'Nữ', cert: '', block: '', teachingClass: '', photo: '' },
  { stt: 11, id: 'GLV11', holyName: 'MARIA', lastName: 'TRẦN THỊ', firstName: 'HIỀN', gender: 'Nữ', cert: '1', block: '', teachingClass: '', photo: '' },
  { stt: 12, id: 'GLV12', holyName: 'GIUSE', lastName: 'PHẠM HOÀNG MINH', firstName: 'HIẾU', gender: 'Nam', cert: '2', block: '', teachingClass: '', photo: '' },
  { stt: 13, id: 'GLV13', holyName: 'ĐAMINH', lastName: 'ĐẶNG TRẦN NHẬT', firstName: 'HOAN', gender: 'Nam', cert: '2', block: '', teachingClass: '', photo: '' },
  { stt: 14, id: 'GLV14', holyName: 'GIOAN BOSCO', lastName: 'ĐỊNH QUANG', firstName: 'HUY', gender: 'Nam', cert: '3', block: '', teachingClass: '', photo: '' },
  { stt: 15, id: 'GLV15', holyName: 'MARIA', lastName: 'BÙI DIỆU', firstName: 'HUYỀN', gender: 'Nữ', cert: '3', block: '', teachingClass: '', photo: '' },
  { stt: 16, id: 'GLV16', holyName: 'ĐAMINH', lastName: 'ĐÀO BẢO', firstName: 'KHANH', gender: 'Nam', cert: '3 - BMVTT', block: '', teachingClass: '', photo: '' },
  { stt: 17, id: 'GLV17', holyName: 'GIOAN KIM', lastName: 'TRẦN VŨ ĐĂNG', firstName: 'KHOA', gender: 'Nam', cert: '2 - BMVTT', block: '', teachingClass: '', photo: '' },
  { stt: 18, id: 'GLV18', holyName: 'MARIA', lastName: 'LÂM HOÀI', firstName: 'LIÊN', gender: 'Nữ', cert: '3', block: '', teachingClass: '', photo: '' },
  { stt: 19, id: 'GLV19', holyName: 'GIUSE', lastName: 'LÊ DƯƠNG CÔNG', firstName: 'MINH', gender: 'Nam', cert: '2 - BMVTT', block: '', teachingClass: '', photo: '' },
  { stt: 20, id: 'GLV20', holyName: 'MARIA', lastName: 'DƯƠNG ĐỖ GIA', firstName: 'NGHI', gender: 'Nữ', cert: '3', block: '', teachingClass: '', photo: '' },
  { stt: 21, id: 'GLV21', holyName: 'GIOANKIM', lastName: 'NGUYỄN ĐỨC', firstName: 'NHẬT', gender: 'Nam', cert: '1', block: '', teachingClass: '', photo: '' },
  { stt: 22, id: 'GLV22', holyName: 'MARIA', lastName: 'NGUYỄN HÀ UYÊN', firstName: 'NHI', gender: 'Nữ', cert: '2', block: '', teachingClass: '', photo: '' },
  { stt: 23, id: 'GLV23', holyName: 'MARIA', lastName: 'NGUYỄN THỊ DIỆU', firstName: 'NHƯ', gender: 'Nữ', cert: '1', block: '', teachingClass: '', photo: '' },
  { stt: 24, id: 'GLV24', holyName: 'MARIA', lastName: 'TRẦN NHẬT QUỲNH', firstName: 'NHƯ', gender: 'Nữ', cert: '1', block: '', teachingClass: '', photo: '' },
  { stt: 25, id: 'GLV25', holyName: 'ANNA', lastName: 'HOÀNG NHƯ', firstName: 'QUỲNH', gender: 'Nữ', cert: '1', block: '', teachingClass: '', photo: '' },
  { stt: 26, id: 'GLV26', holyName: 'MARIA', lastName: 'PHẠM NGUYỄN HƯƠNG', firstName: 'QUỲNH', gender: 'Nữ', cert: '1', block: '', teachingClass: '', photo: '' },
  { stt: 27, id: 'GLV27', holyName: 'TERESA', lastName: 'KIM NGUYỄN THANH', firstName: 'TÂM', gender: 'Nữ', cert: '2', block: '', teachingClass: '', photo: '' },
  { stt: 28, id: 'GLV28', holyName: 'PHERO', lastName: 'HOÀNG NHẬT', firstName: 'TÂN', gender: 'Nam', cert: '1', block: '', teachingClass: '', photo: '' },
  { stt: 29, id: 'GLV29', holyName: 'MARIA', lastName: 'VÕ NGỌC LAN', firstName: 'THẢO', gender: 'Nữ', cert: '3', block: '', teachingClass: '', photo: '' },
  { stt: 30, id: 'GLV30', holyName: 'TERESA', lastName: 'ĐỊNH THỊ THANH', firstName: 'THẢO', gender: 'Nữ', cert: '3', block: '', teachingClass: '', photo: '' },
  { stt: 31, id: 'GLV31', holyName: 'ANNA', lastName: 'VŨ THỊ', firstName: 'THẢO', gender: 'Nữ', cert: '3', block: '', teachingClass: '', photo: '' },
  { stt: 32, id: 'GLV32', holyName: 'GIUSE', lastName: 'VÕ DUY', firstName: 'THỐNG', gender: 'Nam', cert: '2', block: '', teachingClass: '', photo: '' },
  { stt: 33, id: 'GLV33', holyName: 'MARIA', lastName: 'VŨ NGỌC ANH', firstName: 'THƯ', gender: 'Nữ', cert: '2', block: '', teachingClass: '', photo: '' },
  { stt: 34, id: 'GLV34', holyName: 'MARIA', lastName: 'TRẦN NHẬT ANH', firstName: 'THƯ', gender: 'Nữ', cert: '2', block: '', teachingClass: '', photo: '' },
  { stt: 35, id: 'GLV35', holyName: 'PHERO', lastName: 'NGUYỄN TẤN', firstName: 'TIẾN', gender: 'Nam', cert: '1', block: '', teachingClass: '', photo: '' },
  { stt: 36, id: 'GLV36', holyName: 'MARIA', lastName: 'BẠCH NGUYỄN BẢO', firstName: 'TRÂM', gender: 'Nữ', cert: '1', block: '', teachingClass: '', photo: '' },
  { stt: 37, id: 'GLV37', holyName: 'TERESA', lastName: 'NGUYỄN NHẬT KHÁNH', firstName: 'TRÂN', gender: 'Nữ', cert: '3 - BMVTT', block: '', teachingClass: '', photo: '' },
  { stt: 38, id: 'GLV38', holyName: 'MARIA', lastName: 'NGUYỄN THANH', firstName: 'TRÚC', gender: 'Nữ', cert: '1', block: '', teachingClass: '', photo: '' },
  { stt: 39, id: 'GLV39', holyName: 'MARIA', lastName: 'ĐOÀN THANH', firstName: 'TRÚC', gender: 'Nữ', cert: '', block: '', teachingClass: '', photo: '' },
  { stt: 40, id: 'GLV40', holyName: 'MARIA', lastName: 'TRẦN NGUYỄN PHƯƠNG', firstName: 'UYÊN', gender: 'Nữ', cert: '1', block: '', teachingClass: '', photo: '' },
  { stt: 41, id: 'GLV41', holyName: 'MARIA', lastName: 'NGUYỄN KHÁNH', firstName: 'VY', gender: 'Nữ', cert: '', block: '', teachingClass: '', photo: '' }
];

// Trạng thái ứng dụng & Nạp từ localStorage
const STORAGE_KEY = 'glv_custom_database_tanmy_v2';
let glvDatabase = loadSavedDatabase();
let currentDisplayedGLV = null;
let qrcodeInstance = null;

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
    console.warn('Lỗi đọc dữ liệu từ localStorage:', e);
  }
  return [...DEFAULT_DATASET];
}

function saveDatabase() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(glvDatabase));
  } catch (e) {
    console.warn('Lỗi lưu dữ liệu vào localStorage:', e);
  }
  updateStatsDisplay();
}

function getGlvAvatar(glv) {
  if (glv && glv.photo && glv.photo.trim()) {
    return glv.photo;
  }
  return (glv && glv.gender === 'Nam') ? DEFAULT_AVATAR_MALE : DEFAULT_AVATAR_FEMALE;
}

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const suggestionsBox = document.getElementById('suggestionsBox');
const totalGLVCount = document.getElementById('totalGLVCount');

// Quản lý Quyền Người Dùng (Admin vs Guest) - Mặc định luôn là Khách (Guest)
const AUTH_ROLE_KEY = 'glv_user_role_tanmy_session';
let currentUserRole = sessionStorage.getItem(AUTH_ROLE_KEY) || 'guest';
const ADMIN_PASSWORDS = ['admin', 'admin123', 'tanmy2026', 'tanmy'];

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

// View Containers
const welcomeState = document.getElementById('welcomeState');
const loadingState = document.getElementById('loadingState');
const notFoundState = document.getElementById('notFoundState');
const resultCard = document.getElementById('resultCard');
const multipleResultsCard = document.getElementById('multipleResultsCard');
const glvGridList = document.getElementById('glvGridList');
const searchedKeyword = document.getElementById('searchedKeyword');
const matchCount = document.getElementById('matchCount');

// Card Elements
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

// Buttons
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

// Modal Danh Sách Toàn Bộ & Bộ Lọc Cột
const allGlvModal = document.getElementById('allGlvModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalFilterInput = document.getElementById('modalFilterInput');
const allGlvTableBody = document.getElementById('allGlvTableBody');
const filterGender = document.getElementById('filterGender');
const filterBlock = document.getElementById('filterBlock');
const filterCert = document.getElementById('filterCert');
const filterResultCount = document.getElementById('filterResultCount');

// Trạng thái sắp xếp cột
let currentSort = { column: 'stt', order: 'asc' };

// Modal Form Chỉnh Sửa / Thêm Mới
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

// ==========================================================================
// KHỞI ĐỘNG ỨNG DỤNG & PHÂN QUYỀN
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initUserRole();
  updateStatsDisplay();
  setupEventListeners();
  tryAutoFetchExcel();
});

function initUserRole() {
  updateRoleUI();
}

function setRole(newRole) {
  currentUserRole = newRole;
  try {
    sessionStorage.setItem(AUTH_ROLE_KEY, newRole);
    // Xóa khóa cũ nếu có
    localStorage.removeItem('glv_user_role_tanmy_v1');
  } catch (e) {
    console.warn('Lỗi lưu vai trò:', e);
  }
  updateRoleUI();
}

function updateRoleUI() {
  const isAdmin = (currentUserRole === 'admin');

  // Cập nhật Nút Icon hiển thị vai trò bên góc phải
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

  // Nút Thêm Mới & Khôi phục gốc chỉ hiển thị cho Admin
  if (addNewGlvBtn) {
    addNewGlvBtn.style.display = isAdmin ? 'inline-flex' : 'none';
  }
  if (modalAddGlvBtn) {
    modalAddGlvBtn.style.display = isAdmin ? 'inline-flex' : 'none';
  }
  if (resetDataBtn) {
    resetDataBtn.style.display = isAdmin ? 'inline-flex' : 'none';
  }

  // Làm mới bảng nếu bảng đang mở
  if (allGlvModal && allGlvModal.style.display !== 'none') {
    applyModalFilters();
  }
}

function checkAdminPassword() {
  const enteredPass = (adminPasswordInput.value || '').trim();
  if (ADMIN_PASSWORDS.includes(enteredPass.toLowerCase())) {
    setRole('admin');
    if (loginModal) loginModal.style.display = 'none';
    if (adminPasswordInput) adminPasswordInput.value = '';
    showToast('Đăng nhập Quản Trị Viên thành công! Toàn quyền kích hoạt.');
  } else {
    alert('Mật khẩu Admin không chính xác. Vui lòng thử lại!');
    if (adminPasswordInput) {
      adminPasswordInput.focus();
      adminPasswordInput.select();
    }
  }
}

function updateStatsDisplay() {
  if (totalGLVCount) {
    totalGLVCount.textContent = glvDatabase.length;
  }
}

// Cố gắng fetch Data.xlsx nếu chạy qua Live Server / HTTP Server
async function tryAutoFetchExcel() {
  try {
    const response = await fetch('Data.xlsx');
    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer();
      parseExcelArrayBuffer(arrayBuffer, 'Data.xlsx');
    }
  } catch (err) {
    // Không cần log lỗi vì đã có dataset mặc định
  }
}

// ==========================================================================
// XỬ LÝ FILE EXCEL VỚI SHEETJS (NẾU CÓ)
// ==========================================================================
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

    // Nếu chỉ có 1 cột Họ và tên gộp chung
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

      // Tự động đoán giới tính nếu chưa có
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
      // Giữ lại các ảnh/thông tin custom nếu đã lưu trong localStorage
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        glvDatabase = parsedList;
        saveDatabase();
      }
    }
  } catch (err) {
    console.error('Lỗi khi đọc file Excel:', err);
  }
}

// Chuẩn hóa header và chuỗi tiếng Việt
function normalizeHeader(str) {
  return str.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .trim();
}

function normalizeString(str) {
  if (!str) return '';
  return str.toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .trim();
}

// ==========================================================================
// TÌM KIẾM & GỢI Ý (CHỈ THEO MÃ ID HOẶC TÊN / TÊN THÁNH)
// ==========================================================================
function searchGLV(query) {
  if (!query) return [];
  const q = query.trim();
  const normQ = normalizeString(q);

  // 1. Tìm chính xác theo mã ID
  const exactIdMatches = glvDatabase.filter(item => {
    const itemIdNorm = normalizeString(item.id);
    const numOnly = item.id.replace(/\D/g, '');
    const qNumOnly = q.replace(/\D/g, '');

    return itemIdNorm === normQ ||
           (qNumOnly && (numOnly === qNumOnly || parseInt(numOnly) === parseInt(qNumOnly)));
  });

  if (exactIdMatches.length > 0 && (normQ.startsWith('glv') || /^\d+$/.test(normQ))) {
    return exactIdMatches;
  }

  // 2. Chỉ tìm theo Tên Thánh, Họ và Tên đầy đủ, Tên gọi
  const textMatches = glvDatabase.filter(item => {
    const fullName = `${item.lastName} ${item.firstName}`;
    const fullWithHoly = `${item.holyName} ${item.lastName} ${item.firstName}`;
    
    const normFullName = normalizeString(fullName);
    const normWithHoly = normalizeString(fullWithHoly);
    const normHoly = normalizeString(item.holyName);
    const normFirstName = normalizeString(item.firstName);

    return (
      normFullName.includes(normQ) ||
      normWithHoly.includes(normQ) ||
      normHoly.includes(normQ) ||
      normFirstName === normQ ||
      normalizeString(item.id).includes(normQ)
    );
  });

  return textMatches;
}

function getSuggestions(query) {
  if (!query || query.trim().length < 1) return [];
  const normQ = normalizeString(query);

  return glvDatabase.filter(item => {
    const fullName = `${item.lastName} ${item.firstName}`;
    const fullWithHoly = `${item.holyName} ${item.lastName} ${item.firstName}`;
    const idNorm = normalizeString(item.id);

    return (
      idNorm.includes(normQ) ||
      normalizeString(fullName).includes(normQ) ||
      normalizeString(fullWithHoly).includes(normQ) ||
      normalizeString(item.holyName).includes(normQ)
    );
  }).slice(0, 7);
}

function renderSuggestions(list) {
  if (list.length === 0) {
    suggestionsBox.style.display = 'none';
    return;
  }

  suggestionsBox.innerHTML = '';
  list.forEach(item => {
    const div = document.createElement('div');
    div.className = 'suggestion-item';
    div.innerHTML = `
      <div class="suggestion-left">
        <img class="table-avatar-img" style="width: 28px; height: 28px;" src="${getGlvAvatar(item)}" alt="avatar">
        <span class="sugg-id">${item.id}</span>
        <div>
          <span class="sugg-holy">${item.holyName || ''}</span>
          <span class="sugg-name">${item.lastName} ${item.firstName}</span>
        </div>
      </div>
      <span class="sugg-cert">${item.gender === 'Nam' ? '♂ Nam' : '♀ Nữ'}${item.cert ? ' • Cấp ' + item.cert : ''}</span>
    `;

    div.addEventListener('click', () => {
      searchInput.value = item.id;
      suggestionsBox.style.display = 'none';
      clearSearchBtn.style.display = 'block';
      displayProfileCard(item);
    });

    suggestionsBox.appendChild(div);
  });

  suggestionsBox.style.display = 'block';
}

// ==========================================================================
// ĐIỀU HƯỚNG VIEW & RENDER THẺ HỒ SƠ
// ==========================================================================
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
  
  // Tên Thánh trang trọng
  const holy = (glv.holyName || '').trim().toUpperCase();
  cardHolyName.textContent = holy ? holy : 'GIÁO LÝ VIÊN';
  
  // Họ và Tên đầy đủ
  const lastName = (glv.lastName || '').trim();
  const firstName = (glv.firstName || '').trim();
  const fullName = `${lastName} ${firstName}`.trim();
  cardFullName.textContent = fullName || 'Chưa cập nhật tên';

  // Giới tính & Badge Icon
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

  // Ảnh thẻ GLV
  if (cardAvatarImg) {
    cardAvatarImg.src = getGlvAvatar(glv);
  }

  // Format Chứng chỉ GLV
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

  // Lớp giảng dạy & Khối Lớp
  cardClass.textContent = glv.teachingClass ? glv.teachingClass : 'Chưa phân công lớp';
  if (cardBlock) {
    cardBlock.textContent = glv.block ? `Khối ${glv.block}` : 'Chưa phân khối';
  }

  // Tạo Mã QR Code
  generateQRCode(glv);

  resultCard.style.display = 'block';
}

function generateQRCode(glv) {
  if (!qrcodeContainer) return;
  qrcodeContainer.innerHTML = '';

  const qrData = `MÃ GLV: ${glv.id}\nTÊN THÁNH: ${glv.holyName || ''}\nHỌ TÊN: ${glv.lastName} ${glv.firstName}\nGIỚI TÍNH: ${glv.gender || 'Nữ'}\nCHỨNG CHỈ: ${glv.cert || 'Chưa có'}`;

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
// EVENT LISTENERS & QUẢN TRỊ DỮ LIỆU
// ==========================================================================
function setupEventListeners() {
  // Tìm kiếm realtime / Debounce gợi ý
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

  // Đóng dropdown gợi ý khi bấm ra ngoài
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-card')) {
      suggestionsBox.style.display = 'none';
    }
  });

  // Nút tìm kiếm
  searchBtn.addEventListener('click', () => {
    suggestionsBox.style.display = 'none';
    executeSearch(searchInput.value);
  });

  // Phím Enter
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      suggestionsBox.style.display = 'none';
      executeSearch(searchInput.value);
    }
  });

  // Nút xóa tìm kiếm
  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    suggestionsBox.style.display = 'none';
    searchInput.focus();
    showWelcomeState();
  });

  // ==========================================================================
  // XỬ LÝ AUTH & PHÂN QUYỀN (ADMIN / GUEST)
  // ==========================================================================
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
      if (e.target === loginModal) {
        loginModal.style.display = 'none';
      }
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

  // Ẩn / Hiện mật khẩu Admin
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

  // In thẻ GLV
  printBtn.addEventListener('click', () => {
    window.print();
  });

  // Sửa GLV đang xem trên thẻ
  if (editCurrentGlvBtn) {
    editCurrentGlvBtn.addEventListener('click', () => {
      if (currentDisplayedGLV) {
        openEditModal(currentDisplayedGLV.id);
      }
    });
  }

  // Sao chép thông tin
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

  // Tra cứu khác
  resetBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    searchInput.focus();
    showWelcomeState();
  });

  // Modal Danh Sách Toàn Bộ
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

  // Lọc nhanh trong Modal (theo Tên hoặc Mã ID)
  if (modalFilterInput) {
    modalFilterInput.addEventListener('input', applyModalFilters);
  }

  // Bộ lọc cột Giới tính, Khối lớp, Chứng chỉ
  if (filterGender) {
    filterGender.addEventListener('change', applyModalFilters);
  }
  if (filterBlock) {
    filterBlock.addEventListener('change', applyModalFilters);
  }
  if (filterCert) {
    filterCert.addEventListener('change', applyModalFilters);
  }

  // Bấm vào tiêu đề cột để sắp xếp (Click-to-sort headers)
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

  // Nút Thêm Mới GLV
  if (addNewGlvBtn) {
    addNewGlvBtn.addEventListener('click', openAddModal);
  }
  if (modalAddGlvBtn) {
    modalAddGlvBtn.addEventListener('click', openAddModal);
  }

  // Modal Form Sửa / Thêm
  if (closeEditModalBtn) {
    closeEditModalBtn.addEventListener('click', closeEditModal);
  }
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener('click', closeEditModal);
  }
  if (editGlvModal) {
    editGlvModal.addEventListener('click', (e) => {
      if (e.target === editGlvModal) {
        closeEditModal();
      }
    });
  }

  // Xử lý Thay Đổi Giới Tính trong Form -> Tự động đổi avatar preview nếu chưa chọn ảnh riêng
  if (formGender) {
    formGender.addEventListener('change', () => {
      if (!formPhotoData.value) {
        formPhotoPreview.src = (formGender.value === 'Nam') ? DEFAULT_AVATAR_MALE : DEFAULT_AVATAR_FEMALE;
      }
    });
  }

  // Xử lý Upload Ảnh Thẻ Riêng từ Máy Tính (Cả Admin và Guest đều dùng được)
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

  // Nút Reset Ảnh về Mặc Định
  if (formPhotoResetBtn) {
    formPhotoResetBtn.addEventListener('click', () => {
      formPhotoData.value = '';
      formPhotoInput.value = '';
      formPhotoPreview.src = (formGender.value === 'Nam') ? DEFAULT_AVATAR_MALE : DEFAULT_AVATAR_FEMALE;
      showToast('Đã chuyển về ảnh đại diện mặc định!');
    });
  }

  // Xử lý Submit Form Chỉnh Sửa / Thêm Mới
  if (glvEditForm) {
    glvEditForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveGlvForm();
    });
  }

  // Nút Xuất File Excel
  if (exportExcelBtn) {
    exportExcelBtn.addEventListener('click', exportDatabaseToExcel);
  }

  // Nút Khôi Phục Dữ Liệu Gốc (Chỉ Admin)
  if (resetDataBtn) {
    resetDataBtn.addEventListener('click', resetDatabaseToOriginal);
  }
}

// ==========================================================================
// CÁC HÀM XỬ LÝ CHỈNH SỬA / THÊM / XÓA / XUẤT EXCEL
// ==========================================================================
function openAddModal() {
  if (currentUserRole === 'guest') {
    showToast('Chỉ Quản Trị Viên (Admin) mới có quyền thêm Giáo Lý Viên mới!');
    return;
  }

  editOriginalId.value = '';
  editModalTitle.innerHTML = '<i class="fa-solid fa-user-plus"></i> Thêm Giáo Lý Viên Mới';
  
  // Tạo mã ID gợi ý tiếp theo
  const nextNumber = glvDatabase.length + 1;
  formId.value = `GLV${String(nextNumber).padStart(2, '0')}`;
  formGender.value = 'Nữ';
  formHolyName.value = '';
  formLastName.value = '';
  formFirstName.value = '';
  formCert.value = '';
  if (formBlock) formBlock.value = '';
  formClass.value = '';
  
  // Reset ảnh upload
  formPhotoData.value = '';
  if (formPhotoInput) formPhotoInput.value = '';
  formPhotoPreview.src = DEFAULT_AVATAR_FEMALE;

  // Đảm bảo mở khóa các trường cho Admin
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

  // Nạp ảnh hiện tại
  formPhotoData.value = glv.photo || '';
  if (formPhotoInput) formPhotoInput.value = '';
  formPhotoPreview.src = getGlvAvatar(glv);

  // Khóa hoặc mở khóa trường theo vai trò
  const isGuest = (currentUserRole === 'guest');
  setFormInputsLockState(isGuest);

  if (guestFormAlert) {
    guestFormAlert.style.display = isGuest ? 'flex' : 'none';
  }

  editGlvModal.style.display = 'flex';
  formFirstName.focus();
}

// Bật/tắt chế độ khóa trường (Guest Mode)
function setFormInputsLockState(isGuest) {
  // Các trường bị khóa đối với Guest (Chỉ xem)
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

  // Các trường Guest ĐƯỢC PHÉP SỬA
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
    // Chế độ CẬP NHẬT
    const index = glvDatabase.findIndex(item => item.id.toUpperCase() === originalId.toUpperCase());
    if (index !== -1) {
      if (isGuest) {
        // Guest: Chỉ được cập nhật Tên Thánh, Họ và Tên, và Ảnh Thẻ
        glvDatabase[index] = {
          ...glvDatabase[index],
          holyName,
          lastName,
          firstName,
          photo
        };
      } else {
        // Admin: Toàn quyền cập nhật mọi trường
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

      // Nếu đang xem thẻ này, cập nhật ngay
      if (currentDisplayedGLV && currentDisplayedGLV.id.toUpperCase() === originalId.toUpperCase()) {
        displayProfileCard(glvDatabase[index]);
      }
    }
  } else {
    // Chế độ THÊM MỚI (Chỉ Admin)
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

    // Hiển thị luôn thẻ vừa thêm
    displayProfileCard(newGLV);
  }

  closeEditModal();

  // Luôn làm mới dữ liệu bảng và bộ lọc
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
  
  // Đánh lại số thứ tự STT
  glvDatabase.forEach((item, idx) => {
    item.stt = idx + 1;
  });

  saveDatabase();
  showToast(`Đã xóa Giáo Lý Viên ${glv.id}!`);

  // Nếu đang xem thẻ bị xóa -> quay về màn hình ban đầu
  if (currentDisplayedGLV && currentDisplayedGLV.id.toUpperCase() === glvId.toUpperCase()) {
    showWelcomeState();
  }

  // Làm mới bảng
  applyModalFilters();
}

// Xuất file Excel chứa toàn bộ dữ liệu đã chỉnh sửa
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

    // Tự động tải file về máy
    const fileName = `Data_GiaoLyVien_CapNhat_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    showToast('Đã xuất file Excel thành công!');
  } catch (err) {
    console.error('Lỗi xuất Excel:', err);
    showToast('Lỗi khi xuất file Excel!');
  }
}

// Khôi phục dữ liệu gốc
function resetDatabaseToOriginal() {
  const confirmReset = confirm('Bạn có chắc chắn muốn khôi phục toàn bộ danh sách về dữ liệu gốc ban đầu không? Mọi chỉnh sửa tùy biến sẽ bị xóa.');
  if (!confirmReset) return;

  localStorage.removeItem(STORAGE_KEY);
  glvDatabase = [...DEFAULT_DATASET];
  updateStatsDisplay();
  
  if (modalFilterInput) modalFilterInput.value = '';
  if (filterGender) filterGender.value = 'all';
  if (filterBlock) filterBlock.value = 'all';
  if (filterCert) filterCert.value = 'all';
  currentSort = { column: 'stt', order: 'asc' };
  
  applyModalFilters();
  showWelcomeState();
  showToast('Đã khôi phục dữ liệu về ban đầu!');
}

// ==========================================================================
// BỘ LỌC CỘT & SẮP XẾP BẢNG DANH SÁCH
// ==========================================================================
function applyModalFilters() {
  const textQuery = modalFilterInput ? modalFilterInput.value.trim() : '';
  const selGender = filterGender ? filterGender.value : 'all';
  const selBlock = filterBlock ? filterBlock.value : 'all';
  const selCert = filterCert ? filterCert.value : 'all';

  let filtered = textQuery ? searchGLV(textQuery) : [...glvDatabase];

  // Lọc theo Giới tính
  if (selGender !== 'all') {
    filtered = filtered.filter(item => item.gender === selGender);
  }

  // Lọc theo Khối Lớp
  if (selBlock !== 'all') {
    if (selBlock === 'none') {
      filtered = filtered.filter(item => !item.block || item.block.trim() === '');
    } else {
      filtered = filtered.filter(item => item.block === selBlock);
    }
  }

  // Lọc theo Chứng chỉ
  if (selCert !== 'all') {
    if (selCert === 'none') {
      filtered = filtered.filter(item => !item.cert || item.cert.trim() === '');
    } else {
      filtered = filtered.filter(item => String(item.cert || '').includes(selCert));
    }
  }

  // Sắp xếp theo cột
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

// Render bảng danh sách với đầy đủ thao tác Sửa / Xóa / Xem
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

    // Nút Xem
    tr.querySelector('.btn-action-view').addEventListener('click', () => {
      allGlvModal.style.display = 'none';
      searchInput.value = item.id;
      clearSearchBtn.style.display = 'flex';
      displayProfileCard(item);
    });

    // Nút Sửa
    tr.querySelector('.btn-action-edit').addEventListener('click', () => {
      openEditModal(item.id);
    });

    // Nút Xóa
    tr.querySelector('.btn-action-delete').addEventListener('click', () => {
      deleteGLV(item.id);
    });

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
