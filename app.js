/**
 * HỆ THỐNG QUẢN TRỊ & TRA CỨU - ĐOÀN THIẾU NHI THÁNH THỂ TÂN MỸ
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
// ==========================================================================
// DỮ LIỆU CƠ SỞ ĐƯỢC TẢI TRỰC TIẾP TỪ DATABASE MYSQL (REST API)
// ==========================================================================
const DEFAULT_DATASET = [];
const DEFAULT_CLASSES_DATASET = [];

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
          cert: (item.cert || '').replace(/BMVTT/gi, 'BMVTN'),
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
  initApiSync();
  tryAutoFetchExcel();
});

async function initApiSync() {
  if (typeof API === 'undefined') return;
  const isOnline = await API.checkBackendStatus();
  if (isOnline) {
    console.log('🟢 Kết nối MySQL Database Backend thành công (Online)!');
    // Cập nhật teachers từ MySQL
    const dbTeachers = await API.getTeachers();
    if (dbTeachers && dbTeachers.length > 0) {
      glvDatabase = dbTeachers;
      saveDatabase();
      updateStatsDisplay();
      if (currentTab === 'glv' && !currentDisplayedGLV) {
        showWelcomeState();
      }
    }
    // Cập nhật classes từ MySQL
    const dbClasses = await API.getClasses();
    if (dbClasses && dbClasses.length > 0) {
      classDatabase = dbClasses;
      saveClassesDatabase();
      if (currentTab === 'classes') renderClassesView();
    }
  }
}

// ==========================================================================
// QUẢN LÝ TAB & SIDEBAR NAVIGATION
// ==========================================================================
function switchTab(tabName) {
  currentTab = tabName;
  localStorage.setItem(ACTIVE_TAB_KEY, tabName);

  const quickActionsGlv = document.getElementById('quickActionsGlv');
  const quickActionsClasses = document.getElementById('quickActionsClasses');

  if (tabName === 'glv') {
    if (navItemGlv) navItemGlv.classList.add('active');
    if (navItemClasses) navItemClasses.classList.remove('active');
    if (tabGlvView) tabGlvView.style.display = 'block';
    if (tabClassView) tabClassView.style.display = 'none';
    if (quickActionsGlv) quickActionsGlv.style.display = 'block';
    if (quickActionsClasses) quickActionsClasses.style.display = 'none';
    if (!currentDisplayedGLV) showWelcomeState();
  } else if (tabName === 'classes') {
    if (navItemGlv) navItemGlv.classList.remove('active');
    if (navItemClasses) navItemClasses.classList.add('active');
    if (tabGlvView) tabGlvView.style.display = 'none';
    if (tabClassView) tabClassView.style.display = 'block';
    if (quickActionsGlv) quickActionsGlv.style.display = 'none';
    if (quickActionsClasses) quickActionsClasses.style.display = 'block';
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
  const sidebarAddClassBtn = document.getElementById('sidebarAddClassBtn');
  const modalToolbarAddClassBtn = document.getElementById('modalToolbarAddClassBtn');

  if (addNewGlvBtn) addNewGlvBtn.style.display = isAdmin ? 'inline-flex' : 'none';
  if (modalAddGlvBtn) modalAddGlvBtn.style.display = isAdmin ? 'inline-flex' : 'none';
  if (sidebarAddGlvBtn) sidebarAddGlvBtn.style.display = isAdmin ? 'flex' : 'none';
  if (resetDataBtn) resetDataBtn.style.display = isAdmin ? 'inline-flex' : 'none';
  if (addClassBtn) addClassBtn.style.display = isAdmin ? 'inline-flex' : 'none';
  if (sidebarAddClassBtn) sidebarAddClassBtn.style.display = isAdmin ? 'flex' : 'none';
  if (modalToolbarAddClassBtn) modalToolbarAddClassBtn.style.display = isAdmin ? 'inline-flex' : 'none';

  // Làm mới bảng nếu đang mở
  if (allGlvModal && allGlvModal.style.display !== 'none') {
    applyModalFilters();
  }

  const allClassesModal = document.getElementById('allClassesModal');
  if (allClassesModal && allClassesModal.style.display !== 'none') {
    renderAllClassesTable();
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
  if (glvDatabase && glvDatabase.length > 0) {
    displayMultipleResults(glvDatabase);
  } else {
    welcomeState.style.display = 'block';
  }
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
  }

  cardAvatarImg.src = getGlvAvatar(glv);

  let certText = 'Chưa có';
  let isGold = false;
  if (glv.cert) {
    certText = `Cấp ${glv.cert}`;
    if (glv.cert.toString().includes('3')) {
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
  if (matchCount) matchCount.textContent = list.length;
  if (!glvGridList) return;
  glvGridList.innerHTML = '';

  const multiHeaderTitle = multipleResultsCard.querySelector('.multi-header h3');
  const multiHeaderDesc = multipleResultsCard.querySelector('.multi-header p');
  
  if (searchInput && searchInput.value && searchInput.value.trim() !== '') {
    if (multiHeaderTitle) multiHeaderTitle.innerHTML = `<i class="fa-solid fa-users"></i> Tìm thấy <span id="matchCount">${list.length}</span> kết quả phù hợp:`;
    if (multiHeaderDesc) multiHeaderDesc.textContent = 'Nhấp vào một Giáo Lý Viên để xem thẻ chi tiết';
  } else {
    if (multiHeaderTitle) multiHeaderTitle.innerHTML = `<i class="fa-solid fa-users-line"></i> Danh Sách Giáo Lý Viên (${list.length} GLV)`;
    if (multiHeaderDesc) multiHeaderDesc.textContent = 'Dữ liệu được nạp trực tiếp từ Cơ Sở Dữ Liệu MySQL (XAMPP). Bấm vào thẻ để xem chi tiết';
  }

  list.forEach(item => {
    const isMale = (item.gender === 'Nam');
    const div = document.createElement('div');
    div.className = 'glv-mini-card';
    div.innerHTML = `
      <div class="mini-card-top">
        <div style="display: flex; align-items: center; gap: 0.6rem;">
          <img class="table-avatar-img" style="width: 38px; height: 38px; border-radius: 50%; border: 2px solid ${isMale ? '#3b82f6' : '#ec4899'};" src="${getGlvAvatar(item)}" alt="avatar">
          <div>
            <span class="mini-id" style="font-weight: 800; color: #b91c1c;">${item.id}</span>
            <span style="font-size: 0.75rem; color: #64748b; margin-left: 4px;">#${String(item.stt).padStart(2, '0')}</span>
          </div>
        </div>
        <span class="mini-cert" style="font-weight: 600; font-size: 0.75rem;">${isMale ? '<span style="color:#1d4ed8;">♂ Nam</span>' : '<span style="color:#be185d;">♀ Nữ</span>'}${item.cert ? ' • Cấp ' + item.cert : ''}</span>
      </div>
      <div class="mini-holy" style="color: #991b1b; font-weight: 700; font-size: 0.82rem; margin-top: 0.4rem;">${item.holyName || ''}</div>
      <div class="mini-name" style="font-weight: 800; font-size: 1.05rem; color: #0f172a;">${item.lastName} ${item.firstName}</div>
      <div style="margin-top: 0.4rem; padding-top: 0.35rem; border-top: 1px dashed #e2e8f0; font-size: 0.8rem; color: #475569; display: flex; justify-content: space-between; align-items: center;">
        <span><i class="fa-solid fa-layer-group" style="color: #b91c1c;"></i> ${item.block ? 'Khối ' + item.block : 'Đoàn TNTT'}</span>
        <span style="font-weight: 600; color: #0369a1;"><i class="fa-solid fa-chalkboard-user"></i> ${item.teachingClass || 'Chưa phân'}</span>
      </div>
    `;

    div.addEventListener('click', () => {
      searchInput.value = item.id;
      if (clearSearchBtn) clearSearchBtn.style.display = 'block';
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
              <div class="teacher-chip" data-glv-id="${t.id}" title="Bấm để xem hồ sơ ${t.holyName} ${t.lastName} ${t.firstName}">
                <span class="chip-name-box">
                  <strong class="chip-holy">${t.holyName || ''}</strong>
                  <span class="chip-name">${t.lastName} ${t.firstName}</span>
                </span>
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

    // Sự kiện bấm vào tên GLV trong card -> Mở xem nhanh thẻ GLV (không rời trang lớp)
    card.querySelectorAll('.teacher-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        const glvId = chip.getAttribute('data-glv-id');
        openGlvQuickView(glvId);
      });
    });

    classCardsGrid.appendChild(card);
  });
}

// ==========================================================================
// XEM NHANH THẺ GLV (QUICK VIEW MODAL - KHÔNG RỜI KHỎI MODAL LỚP)
// ==========================================================================
let currentQuickViewGlvId = null;

function openGlvQuickView(glvId) {
  const glv = glvDatabase.find(g => g.id.toUpperCase() === (glvId || '').toUpperCase());
  if (!glv) return;

  currentQuickViewGlvId = glv.id;
  const quickGlvModal = document.getElementById('glvQuickViewModal');
  const quickGlvBody = document.getElementById('quickGlvBody');
  if (!quickGlvModal || !quickGlvBody) return;

  const isMale = (glv.gender === 'Nam');
  const avatarSrc = getGlvAvatar(glv);
  const certText = glv.cert ? `Cấp ${glv.cert}` : 'Chưa có chứng chỉ';
  const blockText = glv.block ? `Khối ${glv.block}` : 'Chưa phân khối';
  const classText = glv.teachingClass || 'Chưa phân lớp';

  quickGlvBody.innerHTML = `
    <div class="quick-profile-card">
      <div class="quick-card-emblem">
        <i class="fa-solid fa-cross"></i>
        <span>ĐOÀN TNTT GIÁO XỨ TÂN MỸ</span>
      </div>

      <img class="quick-card-avatar" src="${avatarSrc}" alt="avatar">

      <div>
        <span class="quick-card-holy">${glv.holyName || 'GIÁO LÝ VIÊN'}</span>
        <h3 class="quick-card-name">${glv.lastName} ${glv.firstName}</h3>
      </div>

      <table class="quick-card-info-table">
        <tbody>
          <tr>
            <td><i class="fa-solid fa-id-card"></i> Mã Định Danh:</td>
            <td><strong style="color: #b91c1c; font-size: 0.95rem;">${glv.id}</strong></td>
          </tr>
          <tr>
            <td><i class="fa-solid fa-venus-mars"></i> Giới tính:</td>
            <td>${isMale ? '<span style="color: #1d4ed8; font-weight: 700;"><i class="fa-solid fa-mars"></i> Nam</span>' : '<span style="color: #be185d; font-weight: 700;"><i class="fa-solid fa-venus"></i> Nữ</span>'}</td>
          </tr>
          <tr>
            <td><i class="fa-solid fa-certificate"></i> Chứng chỉ GLV:</td>
            <td><span style="font-weight: 700; color: #1e293b;">${certText}</span></td>
          </tr>
          <tr>
            <td><i class="fa-solid fa-layer-group"></i> Khối phụ trách:</td>
            <td><strong>${blockText}</strong></td>
          </tr>
          <tr>
            <td><i class="fa-solid fa-school"></i> Lớp giảng dạy:</td>
            <td><strong style="color: #b91c1c;">${classText}</strong></td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

  quickGlvModal.style.display = 'flex';
}

function closeGlvQuickView() {
  const quickGlvModal = document.getElementById('glvQuickViewModal');
  if (quickGlvModal) {
    quickGlvModal.style.display = 'none';
  }
}

// ==========================================================================
// DỮ LIỆU & QUẢN LÝ THIẾU NHI THEO LỚP (MYSQL DATABASE)
// ==========================================================================
function getClassStudents(cls) {
  if (!cls) return [];
  if (Array.isArray(cls.students)) {
    return cls.students;
  }
  cls.students = [];
  return cls.students;
}

function exportClassStudentsToExcel(cls) {
  if (typeof XLSX === 'undefined') {
    showToast('Thư viện xuất Excel chưa tải xong!');
    return;
  }
  const students = getClassStudents(cls);
  const data = students.map((s, idx) => ({
    'STT': idx + 1,
    'Mã Thiếu Nhi': s.id,
    'Tên Thánh': s.holyName,
    'Họ và Tên': s.fullName,
    'Giới Tính': s.gender,
    'Ngày Sinh': s.birthDate,
    'Lớp Giáo Lý': cls.name,
    'Khối Lớp': cls.block,
    'Ghi Chú': s.note
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'DanhSachThieuNhi');
  const safeName = removeVietnameseTones(cls.name).replace(/\s+/g, '_');
  XLSX.writeFile(wb, `Danh_Sach_Lop_${safeName}_TanMy_2026_2027.xlsx`);
  showToast(`Đã xuất file Excel danh sách lớp ${cls.name}!`);
}

function openClassDetailModal(classId) {
  const cls = classDatabase.find(c => c.id === classId);
  if (!cls) return;

  currentDisplayedClass = cls;
  const teachers = getTeachersByClass(cls.teacherIds);
  const badgeCls = getBlockBadgeClass(cls.block);
  const students = getClassStudents(cls);

  if (classDetailModalTitle) {
    classDetailModalTitle.textContent = `Thông Tin Lớp ${cls.name}`;
  }

  if (classDetailBody) {
    classDetailBody.innerHTML = `
      <div class="class-detail-hero">
        <div>
          <h2 class="class-hero-title">${cls.name}</h2>
          <p class="class-hero-subtitle">Đoàn TNTT Giáo xứ Tân Mỹ &bull; Niên Khóa 2026 - 2027</p>
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

      <!-- Danh Sách Huynh Trưởng / GLV -->
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

      <!-- Khối Xem & Quản Lý Danh Sách Thiếu Nhi -->
      <div class="detail-students-container" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: var(--radius-md); padding: 1.25rem; margin-top: 1.25rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;">
          <div>
            <div style="font-weight: 800; font-size: 1.05rem; color: #1e293b; display: flex; align-items: center; gap: 0.5rem;">
              <i class="fa-solid fa-children" style="color: var(--primary-red);"></i>
              <span>Danh Sách Thiếu Nhi (${students.length} Em)</span>
            </div>
            <p style="font-size: 0.82rem; color: #64748b; margin-top: 0.25rem;">
              Quản lý toàn diện hồ sơ, bổn mạng, ngày sinh và phân công vai trò trong lớp.
            </p>
          </div>
          <button class="btn-export-students" id="btnExportThisClassStudents" title="Tải về danh sách thiếu nhi lớp này">
            <i class="fa-solid fa-file-excel"></i> Xuất Excel Lớp
          </button>
        </div>

        <button type="button" class="btn-open-student-roster" id="btnOpenStudentRoster">
          <span>
            <i class="fa-solid fa-users-viewfinder" style="font-size: 1.15rem; margin-right: 0.5rem;"></i>
            Mở Cửa Sổ Quản Lý Danh Sách Thiếu Nhi (${students.length} Em)
          </span>
          <span class="roster-btn-arrow">
            <i class="fa-solid fa-arrow-up-right-from-square"></i> Mở Cửa Sổ Riêng
          </span>
        </button>
      </div>
    `;

    // Sự kiện mở Cửa Sổ Danh Sách Thiếu Nhi Riêng Biệt
    const btnOpenRoster = classDetailBody.querySelector('#btnOpenStudentRoster');
    if (btnOpenRoster) {
      btnOpenRoster.addEventListener('click', () => {
        openClassStudentsRosterModal(cls.id);
      });
    }

    // Sự kiện xuất Excel danh sách thiếu nhi lớp này
    const btnExportClass = classDetailBody.querySelector('#btnExportThisClassStudents');
    if (btnExportClass) {
      btnExportClass.addEventListener('click', () => {
        exportClassStudentsToExcel(cls);
      });
    }

    // Sự kiện nút "Xem Thẻ" của từng GLV trong modal chi tiết lớp -> Mở xem nhanh thẻ GLV trên modal
    classDetailBody.querySelectorAll('.btn-view-teacher-glv').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const glvId = btn.getAttribute('data-glv-id');
        openGlvQuickView(glvId);
      });
    });
  }

  // Nút Sửa lớp trong chân modal chi tiết
  if (btnEditClassFromDetail) {
    btnEditClassFromDetail.style.display = (currentUserRole === 'admin') ? 'inline-flex' : 'none';
  }

  classDetailModal.style.display = 'flex';
}

// ==========================================================================
// CỬA SỔ QUẢN LÝ DANH SÁCH THIẾU NHI RIÊNG BIỆT (STUDENT ROSTER MODAL)
// ==========================================================================
let currentRosterClassId = null;

function openClassStudentsRosterModal(classId) {
  const cls = classDatabase.find(c => c.id === classId);
  if (!cls) return;

  currentRosterClassId = classId;
  const modal = document.getElementById('classStudentsModal');
  const classTitle = document.getElementById('studentRosterClassTitle');
  const classNameDisplay = document.getElementById('rosterClassNameDisplay');
  const countDisplay = document.getElementById('rosterStudentCountDisplay');
  const searchInput = document.getElementById('rosterSearchInput');
  const tbody = document.getElementById('rosterTableBody');
  const addBtn = document.getElementById('rosterAddStudentBtn');
  const exportBtn = document.getElementById('rosterExportExcelBtn');

  if (!modal) return;

  if (classTitle) classTitle.textContent = `Lớp ${cls.name}`;
  if (classNameDisplay) classNameDisplay.textContent = cls.name;

  const students = getClassStudents(cls);
  if (countDisplay) countDisplay.textContent = students.length;

  const renderTable = (filterText = '') => {
    if (!tbody) return;
    const q = removeVietnameseTones(filterText.toLowerCase().trim());
    const currentStudents = getClassStudents(cls);
    if (countDisplay) countDisplay.textContent = currentStudents.length;

    const filtered = currentStudents.filter(s => {
      if (!q) return true;
      const holyNorm = removeVietnameseTones(s.holyName || '');
      const nameNorm = removeVietnameseTones(s.fullName || '');
      const idNorm = (s.id || '').toLowerCase();
      const noteNorm = removeVietnameseTones(s.note || '');
      return holyNorm.includes(q) || nameNorm.includes(q) || idNorm.includes(q) || noteNorm.includes(q);
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 2.5rem; color: #94a3b8; font-style: italic;">
            <i class="fa-solid fa-user-xmark" style="font-size: 1.8rem; margin-bottom: 0.5rem; display: block; opacity: 0.5;"></i>
            Không tìm thấy em thiếu nhi nào phù hợp với từ khóa "${filterText}"
          </td>
        </tr>
      `;
      return;
    }

    const isAdmin = (currentUserRole === 'admin');

    tbody.innerHTML = filtered.map((s, idx) => `
      <tr>
        <td style="text-align: center; font-weight: 700; color: #64748b;">${s.stt || (idx + 1)}</td>
        <td><span class="student-id-badge">${s.id}</span></td>
        <td><span class="student-holy-name">${s.holyName || ''}</span></td>
        <td><strong style="color: #1e293b; font-size: 0.92rem;">${s.fullName}</strong></td>
        <td style="text-align: center; font-weight: 700; font-size: 0.84rem; color: ${s.gender === 'Nam' ? '#1d4ed8' : '#be185d'};">
          ${s.gender === 'Nam' ? '♂ Nam' : '♀ Nữ'}
        </td>
        <td style="text-align: center; color: #475569; font-weight: 500;">${s.birthDate || '-'}</td>
        <td>
          <span class="student-note-tag ${s.note && s.note !== 'Đang theo học' ? 'special' : ''}">
            ${s.note || 'Đang theo học'}
          </span>
        </td>
        <td style="text-align: center;">
          <div class="table-action-group" style="justify-content: center;">
            <button class="btn-action-icon btn-action-edit btn-roster-edit-student" data-student-id="${s.id}" title="Chỉnh sửa thông tin em ${s.fullName}">
              <i class="fa-solid fa-pen"></i>
            </button>
            ${isAdmin ? `
            <button class="btn-action-icon btn-action-delete btn-roster-delete-student" data-student-id="${s.id}" title="Xóa em ${s.fullName} khỏi lớp">
              <i class="fa-solid fa-trash-can"></i>
            </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `).join('');

    // Sự kiện Sửa thiếu nhi trong Roster
    tbody.querySelectorAll('.btn-roster-edit-student').forEach(btn => {
      btn.addEventListener('click', () => {
        const sId = btn.getAttribute('data-student-id');
        openEditStudentModal(sId, cls.id);
      });
    });

    // Sự kiện Xóa thiếu nhi trong Roster
    tbody.querySelectorAll('.btn-roster-delete-student').forEach(btn => {
      btn.addEventListener('click', () => {
        const sId = btn.getAttribute('data-student-id');
        deleteStudentFromClass(sId, cls.id);
      });
    });
  };

  if (searchInput) {
    searchInput.value = '';
    searchInput.oninput = (e) => renderTable(e.target.value);
  }

  if (addBtn) {
    addBtn.onclick = () => openEditStudentModal(null, cls.id);
  }

  if (exportBtn) {
    exportBtn.onclick = () => exportClassStudentsToExcel(cls);
  }

  renderTable('');
  modal.style.display = 'flex';
}

function closeClassStudentsRosterModal() {
  const modal = document.getElementById('classStudentsModal');
  if (modal) modal.style.display = 'none';
}

// ==========================================================================
// THÊM, SỬA, XÓA THIẾU NHI TRONG LỚP (STUDENT MANAGEMENT)
// ==========================================================================
function getStudentDomElements() {
  return {
    modal: document.getElementById('editStudentModal'),
    title: document.getElementById('editStudentModalTitle'),
    form: document.getElementById('studentEditForm'),
    origId: document.getElementById('formStudentOriginalId'),
    classId: document.getElementById('formStudentClassId'),
    id: document.getElementById('formStudentId'),
    holyName: document.getElementById('formStudentHolyName'),
    fullName: document.getElementById('formStudentFullName'),
    gender: document.getElementById('formStudentGender'),
    birthDate: document.getElementById('formStudentBirthDate'),
    note: document.getElementById('formStudentNote')
  };
}

function openEditStudentModal(studentId = null, classId = null) {
  if (!classId) return;
  const cls = classDatabase.find(c => c.id === classId);
  if (!cls) return;

  const dom = getStudentDomElements();
  const students = getClassStudents(cls);
  dom.classId.value = classId;

  if (studentId) {
    // Chế độ Sửa thiếu nhi
    const s = students.find(item => item.id === studentId);
    if (!s) return;

    dom.origId.value = s.id;
    if (dom.title) {
      dom.title.textContent = `Chỉnh Sửa Thiếu Nhi: ${s.fullName}`;
    }
    dom.id.value = s.id;
    dom.id.readOnly = true;
    dom.holyName.value = s.holyName || '';
    dom.fullName.value = s.fullName || '';
    dom.gender.value = s.gender || 'Nam';
    dom.birthDate.value = s.birthDate || '';
    dom.note.value = s.note || '';
  } else {
    // Chế độ Thêm mới thiếu nhi
    dom.origId.value = '';
    if (dom.title) {
      dom.title.textContent = `Thêm Thiếu Nhi Mới - Lớp ${cls.name}`;
    }
    const code = (cls.id || 'CLS').replace('CLASS_', '');
    const nextStt = students.length + 1;
    dom.id.value = `TN-${code}-${String(nextStt).padStart(2, '0')}`;
    dom.id.readOnly = false;
    dom.holyName.value = '';
    dom.fullName.value = '';
    dom.gender.value = 'Nam';
    dom.birthDate.value = '';
    dom.note.value = 'Đang theo học';
  }

  if (dom.modal) dom.modal.style.display = 'flex';
  if (dom.fullName) dom.fullName.focus();
}

function closeEditStudentModal() {
  const dom = getStudentDomElements();
  if (dom.modal) dom.modal.style.display = 'none';
}

function handleStudentFormSubmit(e) {
  e.preventDefault();

  const dom = getStudentDomElements();
  const classId = dom.classId.value.trim();
  const originalId = dom.origId.value.trim();
  const id = dom.id.value.trim();
  const holyName = dom.holyName.value.trim();
  const fullName = dom.fullName.value.trim();
  const gender = dom.gender.value;
  const birthDate = dom.birthDate.value.trim();
  const note = dom.note.value.trim();

  if (!classId || !fullName || !id) {
    showToast('Vui lòng điền đầy đủ thông tin bắt buộc!');
    return;
  }

  const cls = classDatabase.find(c => c.id === classId);
  if (!cls) return;

  const students = getClassStudents(cls);
  let savedStudentObj = null;

  if (originalId) {
    // Cập nhật
    const idx = students.findIndex(s => s.id === originalId);
    if (idx !== -1) {
      students[idx] = {
        ...students[idx],
        id: id,
        holyName: holyName,
        fullName: fullName,
        gender: gender,
        birthDate: birthDate,
        note: note
      };
      savedStudentObj = students[idx];
      showToast(`Đã cập nhật thông tin em ${fullName}!`);
    }
  } else {
    // Thêm mới
    const newStudent = {
      stt: students.length + 1,
      id: id,
      holyName: holyName,
      fullName: fullName,
      gender: gender,
      birthDate: birthDate,
      note: note || 'Đang theo học'
    };
    students.push(newStudent);
    savedStudentObj = newStudent;
    showToast(`Đã thêm em ${fullName} vào lớp ${cls.name}!`);
  }

  cls.students = students;
  cls.studentCount = students.length;
  saveClassesDatabase();
  renderClassesView();
  renderBlockFilterPillCounts();

  // Tự động lưu vào MySQL Database qua API
  if (typeof API !== 'undefined' && API.isOnline && savedStudentObj) {
    API.saveStudent({
      ...savedStudentObj,
      classId: classId
    }, !originalId).then(success => {
      if (success) console.log('Đã tự động đồng bộ thiếu nhi vào MySQL Database!');
    });
  }

  closeEditStudentModal();

  // Cập nhật lại cửa sổ Roster nếu đang mở
  const rosterModal = document.getElementById('classStudentsModal');
  if (rosterModal && rosterModal.style.display !== 'none') {
    openClassStudentsRosterModal(classId);
  }
}

function deleteStudentFromClass(studentId, classId) {
  const cls = classDatabase.find(c => c.id === classId);
  if (!cls) return;

  const students = getClassStudents(cls);
  const target = students.find(s => s.id === studentId);
  if (!target) return;

  if (confirm(`Bạn có chắc chắn muốn xóa em "${target.holyName ? target.holyName + ' ' : ''}${target.fullName}" khỏi lớp ${cls.name} không?`)) {
    cls.students = students.filter(s => s.id !== studentId);
    // Cập nhật lại STT
    cls.students.forEach((s, idx) => { s.stt = idx + 1; });
    cls.studentCount = cls.students.length;

    saveClassesDatabase();
    renderClassesView();
    renderBlockFilterPillCounts();
    showToast(`Đã xóa em ${target.fullName} khỏi danh sách lớp!`);

    // Tự động xóa khỏi MySQL Database
    if (typeof API !== 'undefined' && API.isOnline) {
      API.deleteStudent(studentId).then(success => {
        if (success) console.log('Đã xóa thiếu nhi khỏi MySQL Database!');
      });
    }

    // Cập nhật lại cửa sổ Roster nếu đang mở
    const rosterModal = document.getElementById('classStudentsModal');
    if (rosterModal && rosterModal.style.display !== 'none') {
      openClassStudentsRosterModal(classId);
    }
  }
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
// BẢNG DANH SÁCH & QUẢN LÝ CÁC LỚP GIÁO LÝ (CLASS DIRECTORY MODAL)
// ==========================================================================
let currentClassSort = { column: 'stt', order: 'asc' };

function openAllClassesModal() {
  const allClassesModal = document.getElementById('allClassesModal');
  const modalFilterClassInput = document.getElementById('modalFilterClassInput');
  const modalFilterClassBlockSelect = document.getElementById('modalFilterClassBlockSelect');

  if (modalFilterClassInput) modalFilterClassInput.value = '';
  if (modalFilterClassBlockSelect) modalFilterClassBlockSelect.value = 'all';

  renderAllClassesTable();
  if (allClassesModal) allClassesModal.style.display = 'flex';
}

function closeAllClassesModal() {
  const allClassesModal = document.getElementById('allClassesModal');
  if (allClassesModal) allClassesModal.style.display = 'none';
}

function renderAllClassesTable() {
  const allClassesTableBody = document.getElementById('allClassesTableBody');
  const modalFilterClassInput = document.getElementById('modalFilterClassInput');
  const modalFilterClassBlockSelect = document.getElementById('modalFilterClassBlockSelect');
  const filterClassModalCount = document.getElementById('filterClassModalCount');
  const filterClassModalStudents = document.getElementById('filterClassModalStudents');

  if (!allClassesTableBody) return;

  const query = (modalFilterClassInput ? modalFilterClassInput.value.trim().toLowerCase() : '');
  const qNorm = removeVietnameseTones(query);
  const blockFilter = modalFilterClassBlockSelect ? modalFilterClassBlockSelect.value : 'all';

  let filtered = [...classDatabase];

  if (blockFilter !== 'all') {
    filtered = filtered.filter(c => c.block === blockFilter);
  }

  if (query) {
    filtered = filtered.filter(cls => {
      const nameNorm = removeVietnameseTones(cls.name || '');
      const blockNorm = removeVietnameseTones(cls.block || '');
      const roomNorm = removeVietnameseTones(cls.room || '');
      const noteNorm = removeVietnameseTones(cls.note || '');
      if (nameNorm.includes(qNorm) || blockNorm.includes(qNorm) || roomNorm.includes(qNorm) || noteNorm.includes(qNorm)) return true;

      const teachers = getTeachersByClass(cls.teacherIds);
      return teachers.some(t => {
        const tNameNorm = removeVietnameseTones(`${t.holyName} ${t.lastName} ${t.firstName}`);
        return tNameNorm.includes(qNorm) || t.id.toLowerCase().includes(qNorm);
      });
    });
  }

  // Sort
  filtered.sort((a, b) => {
    let valA, valB;
    if (currentClassSort.column === 'stt' || currentClassSort.column === 'name') {
      const rankA = getClassNameBaseRank(a.name);
      const rankB = getClassNameBaseRank(b.name);
      if (rankA !== rankB) return currentClassSort.order === 'asc' ? (rankA - rankB) : (rankB - rankA);
      valA = String(a.name || '');
      valB = String(b.name || '');
      return currentClassSort.order === 'asc' ? valA.localeCompare(valB, 'vi') : valB.localeCompare(valA, 'vi');
    } else if (currentClassSort.column === 'block') {
      const wA = getBlockSortPriority(a.block);
      const wB = getBlockSortPriority(b.block);
      return currentClassSort.order === 'asc' ? (wA - wB) : (wB - wA);
    } else if (currentClassSort.column === 'studentCount') {
      valA = parseInt(a.studentCount, 10) || 0;
      valB = parseInt(b.studentCount, 10) || 0;
      return currentClassSort.order === 'asc' ? (valA - valB) : (valB - valA);
    } else if (currentClassSort.column === 'room') {
      valA = (a.room || '').toLowerCase();
      valB = (b.room || '').toLowerCase();
      return currentClassSort.order === 'asc' ? valA.localeCompare(valB, 'vi') : valB.localeCompare(valA, 'vi');
    }
    return 0;
  });

  const totalStudents = filtered.reduce((sum, c) => sum + (parseInt(c.studentCount) || 0), 0);
  if (filterClassModalCount) filterClassModalCount.textContent = filtered.length;
  if (filterClassModalStudents) filterClassModalStudents.textContent = totalStudents;

  allClassesTableBody.innerHTML = '';

  if (filtered.length === 0) {
    allClassesTableBody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align: center; padding: 2rem; color: #94a3b8;">
          <i class="fa-solid fa-school-circle-xmark" style="font-size: 1.8rem; margin-bottom: 0.5rem; display: block; color: #fca5a5;"></i>
          Không tìm thấy lớp học nào phù hợp với bộ lọc
        </td>
      </tr>
    `;
    return;
  }

  const isAdmin = (currentUserRole === 'admin');

  filtered.forEach((cls, index) => {
    const teachers = getTeachersByClass(cls.teacherIds);
    const badgeCls = getBlockBadgeClass(cls.block);
    const tr = document.createElement('tr');

    const teacherNames = teachers.length > 0 
      ? teachers.map(t => `<span class="table-teacher-tag" data-glv-id="${t.id}" style="cursor: pointer; display: inline-block; background: #fff5f5; border: 1px solid #fecaca; border-radius: 4px; padding: 0.15rem 0.45rem; margin: 0.15rem 0.2rem; font-size: 0.78rem; font-weight: 700; color: #991b1b;" title="Bấm để xem nhanh hồ sơ">${t.holyName ? t.holyName + ' ' : ''}${t.lastName} ${t.firstName}</span>`).join('')
      : '<span style="color: #94a3b8; font-style: italic; font-size: 0.8rem;">Chưa phân công</span>';

    tr.innerHTML = `
      <td style="font-weight: 800; color: var(--primary-gold-dark);">${String(index + 1).padStart(2, '0')}</td>
      <td>
        <strong style="color: #1e293b; font-size: 0.95rem;">${cls.name}</strong>
      </td>
      <td>
        <span class="class-block-badge ${badgeCls}" style="font-size: 0.72rem; padding: 0.18rem 0.55rem;">
          Khối ${cls.block}
        </span>
      </td>
      <td><i class="fa-solid fa-door-open" style="color: #94a3b8; margin-right: 0.3rem;"></i>${cls.room || 'Chưa xếp'}</td>
      <td style="font-size: 0.82rem; color: #475569;">${formatScheduleShort(cls.schedule)}</td>
      <td style="text-align: center;">
        <span style="display: inline-block; padding: 0.2rem 0.6rem; background: #eff6ff; color: #1d4ed8; font-weight: 800; border-radius: 12px; font-size: 0.84rem;">
          ${cls.studentCount || 0} Em
        </span>
      </td>
      <td style="max-width: 240px; white-space: normal;">
        ${teacherNames}
      </td>
      <td style="max-width: 180px; white-space: normal; font-size: 0.8rem; color: #64748b;">
        ${cls.note || '-'}
      </td>
      <td style="text-align: center;">
        <div class="table-action-group">
          <button class="btn-action-icon btn-action-view" data-view-class-id="${cls.id}" title="Xem Chi Tiết Lớp">
            <i class="fa-solid fa-eye"></i>
          </button>
          ${isAdmin ? `
          <button class="btn-action-icon btn-action-edit" data-edit-class-id="${cls.id}" title="Sửa Lớp Học">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="btn-action-icon btn-action-delete" data-delete-class-id="${cls.id}" title="Xóa Lớp Học">
            <i class="fa-solid fa-trash-can"></i>
          </button>
          ` : ''}
        </div>
      </td>
    `;

    // Sự kiện nút Xem chi tiết
    tr.querySelector('[data-view-class-id]').addEventListener('click', () => {
      closeAllClassesModal();
      openClassDetailModal(cls.id);
    });

    // Sự kiện bấm vào tên GLV
    tr.querySelectorAll('.table-teacher-tag').forEach(tag => {
      tag.addEventListener('click', (e) => {
        e.stopPropagation();
        const glvId = tag.getAttribute('data-glv-id');
        openGlvQuickView(glvId);
      });
    });

    if (isAdmin) {
      tr.querySelector('[data-edit-class-id]').addEventListener('click', () => {
        closeAllClassesModal();
        openEditClassModal(cls.id);
      });
      tr.querySelector('[data-delete-class-id]').addEventListener('click', () => {
        deleteClass(cls.id);
      });
    }

    allClassesTableBody.appendChild(tr);
  });
}

function deleteClass(classId) {
  if (currentUserRole !== 'admin') {
    showToast('Chỉ Quản Trị Viên (Admin) mới có quyền xóa lớp học!');
    return;
  }
  const cls = classDatabase.find(c => c.id === classId);
  if (!cls) return;

  if (confirm(`Bạn có chắc chắn muốn xóa lớp "${cls.name}" không? Thao tác này không thể hoàn tác.`)) {
    classDatabase = classDatabase.filter(c => c.id !== classId);
    saveClassesDatabase();
    renderClassesView();
    renderBlockFilterPillCounts();
    renderAllClassesTable();
    showToast(`Đã xóa lớp "${cls.name}" thành công!`);
  }
}

function exportClassesDatabaseToExcel() {
  if (typeof XLSX === 'undefined') {
    showToast('Thư viện xuất Excel chưa tải xong!');
    return;
  }
  const data = classDatabase.map((cls, idx) => {
    const teachers = getTeachersByClass(cls.teacherIds);
    const teacherNames = teachers.map(t => `${t.holyName ? t.holyName + ' ' : ''}${t.lastName} ${t.firstName}`.trim()).join(', ');
    return {
      'STT': idx + 1,
      'Tên Lớp Học': cls.name || '',
      'Khối Lớp': cls.block || '',
      'Phòng Học': cls.room || '',
      'Thời Gian Học': cls.schedule || '',
      'Sĩ Số (Em)': cls.studentCount || 0,
      'Huynh Trưởng Phụ Trách': teacherNames,
      'Ghi Chú': cls.note || ''
    };
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'DanhSachLopGiaoLy');
  XLSX.writeFile(wb, `Danh_Sach_Cac_Lop_Giao_Ly_TanMy_2026_2027.xlsx`);
  showToast('Đã xuất file Excel danh sách lớp thành công!');
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

  // 5. Sự kiện Xem Nhanh Thẻ GLV
  const quickGlvModal = document.getElementById('glvQuickViewModal');
  const closeQuickGlvModalBtn = document.getElementById('closeQuickGlvModalBtn');
  const closeQuickGlvFooterBtn = document.getElementById('closeQuickGlvFooterBtn');
  const btnGoToGlvProfile = document.getElementById('btnGoToGlvProfile');

  if (closeQuickGlvModalBtn) {
    closeQuickGlvModalBtn.addEventListener('click', closeGlvQuickView);
  }
  if (closeQuickGlvFooterBtn) {
    closeQuickGlvFooterBtn.addEventListener('click', closeGlvQuickView);
  }
  if (quickGlvModal) {
    quickGlvModal.addEventListener('click', (e) => {
      if (e.target === quickGlvModal) closeGlvQuickView();
    });
  }
    if (btnGoToGlvProfile) {
    btnGoToGlvProfile.addEventListener('click', () => {
      if (currentQuickViewGlvId) {
        closeGlvQuickView();
        if (classDetailModal) classDetailModal.style.display = 'none';
        switchTab('glv');
        searchInput.value = currentQuickViewGlvId;
        clearSearchBtn.style.display = 'flex';
        const target = glvDatabase.find(g => g.id.toUpperCase() === currentQuickViewGlvId.toUpperCase());
        if (target) displayProfileCard(target);
      }
    });
  }

  // 6. Sự kiện Bảng Danh Sách Lớp Học (All Classes Modal) & Tiện Ích Sidebar
  const sidebarViewAllClassesBtn = document.getElementById('sidebarViewAllClassesBtn');
  const sidebarExportGlvBtn = document.getElementById('sidebarExportGlvBtn');
  const sidebarExportClassesBtn = document.getElementById('sidebarExportClassesBtn');
  const allClassesModal = document.getElementById('allClassesModal');
  const closeClassesModalBtn = document.getElementById('closeClassesModalBtn');
  const modalToolbarAddClassBtn = document.getElementById('modalToolbarAddClassBtn');
  const exportClassesTableExcelBtn = document.getElementById('exportClassesTableExcelBtn');
  const modalFilterClassInput = document.getElementById('modalFilterClassInput');
  const modalFilterClassBlockSelect = document.getElementById('modalFilterClassBlockSelect');

  if (sidebarViewAllClassesBtn) {
    sidebarViewAllClassesBtn.addEventListener('click', openAllClassesModal);
  }
  if (sidebarExportGlvBtn) {
    sidebarExportGlvBtn.addEventListener('click', exportDatabaseToExcel);
  }
  if (sidebarExportClassesBtn) {
    sidebarExportClassesBtn.addEventListener('click', exportClassesDatabaseToExcel);
  }
  if (closeClassesModalBtn) {
    closeClassesModalBtn.addEventListener('click', closeAllClassesModal);
  }
  if (allClassesModal) {
    allClassesModal.addEventListener('click', (e) => {
      if (e.target === allClassesModal) closeAllClassesModal();
    });
  }
  if (modalToolbarAddClassBtn) {
    modalToolbarAddClassBtn.addEventListener('click', () => {
      closeAllClassesModal();
      openEditClassModal();
    });
  }
  if (exportClassesTableExcelBtn) {
    exportClassesTableExcelBtn.addEventListener('click', exportClassesDatabaseToExcel);
  }
  if (modalFilterClassInput) {
    modalFilterClassInput.addEventListener('input', renderAllClassesTable);
  }
  if (modalFilterClassBlockSelect) {
    modalFilterClassBlockSelect.addEventListener('change', renderAllClassesTable);
  }

  // Sortable headers trong All Classes Modal
  document.querySelectorAll('th[data-sort-class]').forEach(th => {
    th.addEventListener('click', () => {
      const col = th.getAttribute('data-sort-class');
      if (currentClassSort.column === col) {
        currentClassSort.order = currentClassSort.order === 'asc' ? 'desc' : 'asc';
      } else {
        currentClassSort.column = col;
        currentClassSort.order = 'asc';
      }

      document.querySelectorAll('th[data-sort-class]').forEach(t => {
        t.classList.remove('sorted-asc', 'sorted-desc');
        const icon = t.querySelector('.sort-icon');
        if (icon) icon.className = 'fa-solid fa-sort sort-icon';
      });

      th.classList.add(currentClassSort.order === 'asc' ? 'sorted-asc' : 'sorted-desc');
      const activeIcon = th.querySelector('.sort-icon');
      if (activeIcon) {
        activeIcon.className = currentClassSort.order === 'asc' ? 'fa-solid fa-sort-up sort-icon' : 'fa-solid fa-sort-down sort-icon';
      }

      renderAllClassesTable();
    });
  });

  // 7. Sự kiện Modal Thêm/Sửa Thiếu Nhi
  const editStudentModal = document.getElementById('editStudentModal');
  const closeEditStudentModalBtn = document.getElementById('closeEditStudentModalBtn');
  const cancelEditStudentBtn = document.getElementById('cancelEditStudentBtn');
  const studentEditForm = document.getElementById('studentEditForm');

  if (closeEditStudentModalBtn) {
    closeEditStudentModalBtn.addEventListener('click', closeEditStudentModal);
  }
  if (cancelEditStudentBtn) {
    cancelEditStudentBtn.addEventListener('click', closeEditStudentModal);
  }
  if (editStudentModal) {
    editStudentModal.addEventListener('click', (e) => {
      if (e.target === editStudentModal) closeEditStudentModal();
    });
  }
  if (studentEditForm) {
    studentEditForm.addEventListener('submit', handleStudentFormSubmit);
  }

  // 8. Sự kiện Cửa Sổ Danh Sách Thiếu Nhi (Class Students Roster Modal)
  const classStudentsModal = document.getElementById('classStudentsModal');
  const closeClassStudentsModalBtn = document.getElementById('closeClassStudentsModalBtn');
  const closeClassStudentsFooterBtn = document.getElementById('closeClassStudentsFooterBtn');

  if (closeClassStudentsModalBtn) {
    closeClassStudentsModalBtn.addEventListener('click', closeClassStudentsRosterModal);
  }
  if (closeClassStudentsFooterBtn) {
    closeClassStudentsFooterBtn.addEventListener('click', closeClassStudentsRosterModal);
  }
  if (classStudentsModal) {
    classStudentsModal.addEventListener('click', (e) => {
      if (e.target === classStudentsModal) closeClassStudentsRosterModal();
    });
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

      if (typeof API !== 'undefined' && API.isOnline) {
        API.saveTeacher(glvDatabase[index], false);
      }

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

    if (typeof API !== 'undefined' && API.isOnline) {
      API.saveTeacher(newGLV, true);
    }
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

  if (typeof API !== 'undefined' && API.isOnline) {
    API.deleteTeacher(glv.id);
  }

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

async function resetDatabaseToOriginal() {
  const confirmReset = confirm('Bạn có chắc chắn muốn làm mới và tải lại toàn bộ dữ liệu từ Cơ Sở Dữ Liệu MySQL không?');
  if (!confirmReset) return;

  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(CLASS_STORAGE_KEY);
  await initApiSync();
  
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
  showToast('Đã tải lại toàn bộ dữ liệu từ MySQL Database!');
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
