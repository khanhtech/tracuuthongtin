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
// STRING & SORTING HELPERS (PHẢI NẰM ĐẦU FILE TRÁNH LỖI HOISTING/TDZ)
// ==========================================================================
function removeVietnameseTones(str) {
  if (!str) return '';
  str = String(str).toLowerCase();
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
  if (norm.startsWith('bao dong')) return 315;

  // Khối Vào Đời
  if (norm.startsWith('vao doi 1')) return 410;
  if (norm.startsWith('vao doi 2')) return 420;
  if (norm.startsWith('vao doi 3')) return 430;
  if (norm.startsWith('vao doi 4')) return 440;
  if (norm.startsWith('vao doi')) return 415;

  return 500;
}

function sortClassesList(classes) {
  if (!Array.isArray(classes)) return [];
  return [...classes].sort((a, b) => {
    const pA = getBlockSortPriority(a.block);
    const pB = getBlockSortPriority(b.block);
    if (pA !== pB) return pA - pB;

    const rankA = getClassNameBaseRank(a.name);
    const rankB = getClassNameBaseRank(b.name);
    if (rankA !== rankB) return rankA - rankB;

    const nameA = String(a.name || '').trim();
    const nameB = String(b.name || '').trim();
    return nameA.localeCompare(nameB, 'vi', { numeric: true, sensitivity: 'base' });
  });
}

// ==========================================================================
// STORAGE & APP STATE
// ==========================================================================
const STORAGE_KEY = 'glv_custom_database_tanmy_v2';
const CLASS_STORAGE_KEY = 'glv_classes_custom_tanmy_v1';
const AUTH_ROLE_KEY = 'glv_user_role_tanmy_session';
const ACTIVE_TAB_KEY = 'glv_active_tab_tanmy';

const SAMPLE_MALE_HOLY_NAMES = ['Giuse', 'Phêrô', 'Phaolô', 'Gioan', 'Đaminh', 'Antôn', 'Micae', 'Phanxicô', 'Inhaxiô', 'Augustinô'];
const SAMPLE_FEMALE_HOLY_NAMES = ['Maria', 'Anna', 'Têrêsa', 'Catarina', 'Cecilia', 'Matta', 'Agata', 'Rosa', 'Lucia', 'Agnes'];

const SAMPLE_LAST_NAMES = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương'];
const SAMPLE_MIDDLE_MALE = ['Văn', 'Minh', 'Hữu', 'Đức', 'Gia', 'Quốc', 'Tuấn', 'Thành', 'Hoàng'];
const SAMPLE_MIDDLE_FEMALE = ['Thị', 'Ngọc', 'Thảo', 'Phương', 'Mai', 'Thùy', 'Diệu', 'Tuyết'];
const SAMPLE_FIRST_MALE = ['An', 'Bảo', 'Cường', 'Duy', 'Đạt', 'Hiếu', 'Huy', 'Khoa', 'Long', 'Minh', 'Nam', 'Phúc', 'Quân', 'Sang', 'Tâm', 'Thịnh', 'Trung', 'Vinh'];
const SAMPLE_FIRST_FEMALE = ['Anh', 'Châu', 'Dương', 'Giang', 'Hà', 'Hân', 'Hạnh', 'Hoa', 'Hương', 'Linh', 'Mai', 'Nga', 'Ngân', 'Nhi', 'Như', 'Quyên', 'Quỳnh', 'Trâm', 'Trang', 'Trúc', 'Uyên', 'Vy', 'Yến'];

function getEstimatedBirthYearByBlock(block) {
  const norm = removeVietnameseTones(block || '').toLowerCase();
  if (norm.includes('khai tam')) return 2019;
  if (norm.includes('ruoc le')) return 2016;
  if (norm.includes('them suc')) return 2013;
  if (norm.includes('bao dong')) return 2010;
  if (norm.includes('vao doi')) return 2008;
  return 2015;
}

function generateDefaultStudentsForClass(cls, count = 25) {
  if (!cls) return [];
  const classCode = (cls.id || 'CLS').replace('CLASS_', '').replace('_2627', '');
  const birthYear = getEstimatedBirthYearByBlock(cls.block || '');

  const list = [];
  const targetCount = count && count > 0 ? count : 25;
  for (let i = 1; i <= targetCount; i++) {
    const isMale = (i % 2 !== 0);
    const holyName = isMale ? SAMPLE_MALE_HOLY_NAMES[(i * 3) % SAMPLE_MALE_HOLY_NAMES.length] : SAMPLE_FEMALE_HOLY_NAMES[(i * 3) % SAMPLE_FEMALE_HOLY_NAMES.length];
    const lastName = SAMPLE_LAST_NAMES[(i * 7) % SAMPLE_LAST_NAMES.length];
    const midName = isMale ? SAMPLE_MIDDLE_MALE[(i * 5) % SAMPLE_MIDDLE_MALE.length] : SAMPLE_MIDDLE_FEMALE[(i * 5) % SAMPLE_MIDDLE_FEMALE.length];
    const firstName = isMale ? SAMPLE_FIRST_MALE[(i * 11) % SAMPLE_FIRST_MALE.length] : SAMPLE_FIRST_FEMALE[(i * 11) % SAMPLE_FIRST_FEMALE.length];
    const fullName = `${lastName} ${midName} ${firstName}`;
    const day = String((i * 3) % 28 + 1).padStart(2, '0');
    const month = String((i * 7) % 12 + 1).padStart(2, '0');
    const birthDate = `${day}/${month}/${birthYear}`;
    const parentName = `${lastName} ${SAMPLE_MIDDLE_MALE[(i * 2) % SAMPLE_MIDDLE_MALE.length]} ${SAMPLE_FIRST_MALE[(i * 4) % SAMPLE_FIRST_MALE.length]}`;
    const parentPhone = `090${String(1000000 + i * 37219).slice(0, 7)}`;

    // Điểm mẫu cân đối
    const baseOral = Math.min(10, Math.max(6.5, 8 + (i % 4) * 0.5));
    const base15m = Math.min(10, Math.max(7, 8.5 + ((i + 1) % 3) * 0.5));
    const base1p = Math.min(10, Math.max(6.5, 8 + ((i + 2) % 4) * 0.5));
    const baseExam = Math.min(10, Math.max(7, 8.5 + (i % 3) * 0.5));

    list.push({
      stt: i,
      id: `TN-${classCode}-${String(i).padStart(2, '0')}`,
      holyName: holyName,
      fullName: fullName,
      gender: isMale ? 'Nam' : 'Nữ',
      birthDate: birthDate,
      note: i === 1 ? 'Lớp trưởng' : (i === 2 ? 'Lớp phó' : 'Đang theo học'),
      parentName: parentName,
      parentPhone: parentPhone,
      address: `Giáo họ ${['Thánh Tâm', 'Mân Côi', 'Kitô Vua', 'Vô Nhiễm'][(i * 3) % 4]}`,
      grades: {
        hk1: { t5: 10, cn: 10, gl: 9.5, oral: baseOral, m15: base15m, p1: base1p, exam: baseExam },
        hk2: { t5: 10, cn: 9.5, gl: 9.5, oral: Math.min(10, baseOral + 0.5), m15: base15m, p1: Math.min(10, base1p + 0.5), exam: Math.min(10, baseExam + 0.5) }
      }
    });
  }
  return list;
}

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
  try {
    if (typeof updateStatsDisplay === 'function') updateStatsDisplay();
  } catch (_) {}
}

function loadSavedClassesDatabase() {
  let list = [];
  try {
    const saved = localStorage.getItem(CLASS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const filtered = parsed.filter(item => item.block !== 'Dự Trưởng');
        list = sortClassesList(filtered);
      }
    }
  } catch (e) {
    console.warn('Lỗi đọc dữ liệu Lớp học từ localStorage:', e);
  }
  if (!list || list.length === 0) {
    list = sortClassesList([...DEFAULT_CLASSES_DATASET]);
  }

  list.forEach(cls => {
    if (!Array.isArray(cls.students) || cls.students.length === 0) {
      const count = cls.studentCount && cls.studentCount > 0 ? cls.studentCount : 25;
      cls.students = generateDefaultStudentsForClass(cls, count);
      cls.studentCount = cls.students.length;
    }
  });

  return list;
}

function saveClassesDatabase() {
  try {
    classDatabase = sortClassesList(classDatabase);
    localStorage.setItem(CLASS_STORAGE_KEY, JSON.stringify(classDatabase));
  } catch (e) {
    console.warn('Lỗi lưu dữ liệu Lớp học vào localStorage:', e);
  }
  try {
    if (typeof renderClassStats === 'function') renderClassStats();
    if (typeof updateStudentStatsDisplay === 'function') updateStudentStatsDisplay();
  } catch (_) {}
}

function ensureDefaultStudentsForAllClasses() {
  if (!Array.isArray(classDatabase)) return;
  let changed = false;
  classDatabase.forEach(cls => {
    if (!Array.isArray(cls.students) || cls.students.length === 0) {
      const count = cls.studentCount && cls.studentCount > 0 ? cls.studentCount : 25;
      cls.students = generateDefaultStudentsForClass(cls, count);
      cls.studentCount = cls.students.length;
      changed = true;
    }
  });
  if (changed) {
    saveClassesDatabase();
  }
}

// ==========================================================================
// DỮ LIỆU THÔNG BÁO & TÀI LIỆU
// ==========================================================================
const NEWS_STORAGE_KEY = 'glv_news_custom_tanmy_v1';
const DOCS_STORAGE_KEY = 'glv_docs_custom_tanmy_v1';

const DEFAULT_NEWS_DATASET = [
  {
    id: 'NEWS01',
    title: 'Lễ Khai Giảng & Ra Mắt Xứ Đoàn TNTT Giáo Xứ Tân Mỹ Năm Học 2026 - 2027',
    category: 'Khẩn',
    date: '26/08/2026',
    author: 'Ban Quản Trị Xứ Đoàn TNTT',
    summary: 'Ban Giáo Lý kính gửi quý phụ huynh và các em thiếu nhi toàn đoàn thời gian tập trung khai giảng, chương trình Thánh lễ tạ ơn và dặn dò đồng phục chuẩn TNTT.',
    content: `Kính gửi: Quý Phụ Huynh, Anh Chị Huynh Trưởng và các em Thiếu Nhi toàn đoàn.\n\nNhằm chuẩn bị chu đáo cho niên khóa Giáo lý mới 2026 - 2027, Ban Quản Trị Đoàn Thiếu Nhi Thánh Thể Giáo xứ Tân Mỹ xin thông báo chương trình Lễ Khai Giảng như sau:\n\n1. Thời gian tập trung: 06h30 Chúa Nhật, ngày 06/09/2026 tại khuôn viên Giáo xứ.\n2. Thánh Lễ Tạ Ơn & Khai Giảng: 07h00 - 08h30 do Cha Tuyên Úy chủ tế.\n3. Quy định trang phục: Đồng phục Thiếu Nhi Thánh Thể chỉnh tề (áo trắng có huy hiệu, khăn quàng đúng ngành, quần sẫm màu).\n4. Sinh hoạt nhận lớp: Ngay sau Thánh lễ, các em sẽ di chuyển về các phòng học Giáo lý tương ứng theo sơ đồ hướng dẫn của Huynh Trưởng phụ trách.\n\nKính mong quý phụ huynh nhắc nhở và đưa đón các em đúng giờ để buổi lễ diễn ra trang nghiêm và sốt sắng.`,
    isPinned: true
  },
  {
    id: 'NEWS02',
    title: 'Lịch Phân Công Huynh Trưởng - Giáo Lý Viên Đứng Lớp Năm Học 2026 - 2027',
    category: 'GLV',
    date: '24/08/2026',
    author: 'Cha Tuyên Úy & Ban Điều Hành',
    summary: 'Công bố quyết định phân công phụ trách giảng dạy cho 41 Anh Chị Huynh Trưởng & GLV tại 14 lớp thuộc 5 khối Giáo Lý.',
    content: `Quyết định phân công nhiệm vụ giảng dạy Giáo lý niên khóa 2026 - 2027:\n\n- Tổng số GLV đứng lớp: 41 Huynh Trưởng & GLV.\n- Khối Khai Tâm (Dự Bị, KT1, KT2): 8 GLV phụ trách.\n- Khối Rước Lễ (RL1, RL2, RL3): 9 GLV phụ trách.\n- Khối Thêm Sức (TS1, TS2, TS3): 9 GLV phụ trách.\n- Khối Bao Đồng (BD1, BD2, BD3): 9 GLV phụ trách.\n- Khối Vào Đời (VD1, VD2): 6 GLV phụ trách.\n\nKính mời quý Anh Chị GLV kiểm tra thông tin phân công chi tiết tại mục "Lớp Giáo Lý" và "Giáo Lý Viên" trên cổng thông tin này.`,
    isPinned: false
  },
  {
    id: 'NEWS03',
    title: 'Quy Định Về Giờ Lễ Thứ 5 và Lễ Chúa Nhật Của Thiếu Nhi',
    category: 'Lịch Lễ',
    date: '20/08/2026',
    author: 'Ban Phụng Vụ Xứ Đoàn',
    summary: 'Thông báo chi tiết thời gian sinh hoạt, tham dự Thánh lễ Thứ 5 và Chúa Nhật dành cho tất cả các ngành Chiên Con, Ấu Nhi, Thiếu Nhi, Nghĩa Sĩ.',
    content: `Lịch Phụng Vụ & Sinh Hoạt Cố Định Hằng Tuần:\n\n1. Thánh Lễ Chiều Thứ 5:\n   - Tập trung & điểm danh: 17h45 tại nhà thờ.\n   - Thánh Lễ: 18h00 - 18h45.\n\n2. Thánh Lễ & Học Giáo Lý Chúa Nhật:\n   - Tập trung chào cờ TNTT: 06h45.\n   - Thánh Lễ Thiếu Nhi: 07h00 - 08h00.\n   - Giờ học Giáo Lý: 08h15 - 09h30.\n\nĐiểm chuyên cần tham dự Lễ Thứ 5, Lễ Chúa Nhật và Giờ học Giáo lý sẽ được tính trực tiếp vào Sổ Điểm Điện Tử của từng em.`,
    isPinned: false
  },
  {
    id: 'NEWS04',
    title: 'Chương Trình Sa Mạc Huấn Luyện Huynh Trưởng "Vươn Lên Với Chúa Kitô"',
    category: 'Sự Kiện',
    date: '15/08/2026',
    author: 'Ban Huấn Luyện TNTT',
    summary: 'Kế hoạch tổ chức sa mạc bồi dưỡng linh đạo, kỹ năng quản trò và phương pháp sư phạm Giáo lý cho toàn thể Huynh Trưởng.',
    content: `Khóa Sa Mạc Huấn Luyện Huynh Trưởng - GLV Năm 2026:\n\n- Chủ đề: "Vươn Lên Với Chúa Kitô"\n- Thời gian: 2 ngày 1 đêm (thứ Bảy và Chúa Nhật cuối tháng 8/2026).\n- Nội dung: Linh đạo TNTT, phương pháp dạy Giáo lý trực quan, sơ cấp cứu, kỹ năng gút dây, mật thư và tinh thần đồng đội.\n- Yêu cầu: 100% GLV trong danh sách đứng lớp tham dự đầy đủ.`,
    isPinned: false
  },
  {
    id: 'NEWS05',
    title: 'Họp Mặt Phụ Huynh Đầu Năm Học & Trao Đổi Đồng Hành Cùng Con Em',
    category: 'Phụ Huynh',
    date: '10/08/2026',
    author: 'Ban Giáo Lý Xứ Đoàn',
    summary: 'Trân trọng kính mời quý phụ huynh tham dự buổi gặp gỡ đầu năm để thống nhất nội quy và phương thức nhận thông tin điểm số qua Sổ Điểm Điện Tử.',
    content: `Kính gửi Quý Phụ Huynh,\n\nNhằm tạo sự gắn kết chặt chẽ giữa Gia Đình và Xứ Đoàn trong việc giáo dục đức tin cho các em, Ban Giáo Lý trân trọng kính mời quý phụ huynh tham dự buổi họp mặt:\n\n- Thời gian: 09h30 Chúa Nhật, ngày 13/09/2026 (sau giờ học Giáo lý).\n- Địa điểm: Hội trường Giáo xứ Tân Mỹ.\n- Nội dung: Giới thiệu chương trình học các khối, quy chế chuyên cần, hướng dẫn tra cứu Sổ Điểm Điện Tử và Phiếu Báo Điểm cá nhân.\n\nSự hiện diện của quý phụ huynh là niềm khích lệ to lớn cho các em thiếu nhi và ban giáo lý.`,
    isPinned: false
  },
  {
    id: 'NEWS06',
    title: 'Kế Hoạch Khảo Sát & Đánh Giá Chất Lượng Học Kỳ 1 (HK1)',
    category: 'Lịch Lễ',
    date: '05/08/2026',
    author: 'Ban Khảo Thí & Học Vụ',
    summary: 'Hướng dẫn cơ cấu điểm kiểm tra miệng, 15 phút, 1 tiết và thi học kỳ theo chuẩn chương trình Giáo lý Tân Mỹ.',
    content: `Kế hoạch đánh giá kết quả học tập Giáo lý HK1:\n\n1. Điểm Chuyên cần: Tính theo tỷ lệ tham gia Lễ Thứ 5, Lễ Chúa Nhật và Giờ học Giáo lý (Hệ số 5).\n2. Điểm Kiểm tra môn Giáo lý:\n   - Điểm Miệng: Hệ số 1 (trong các giờ học).\n   - Kiểm tra 15 phút: Hệ số 1 (tuần 6 của học kỳ).\n   - Kiểm tra 1 Tiết: Hệ số 2 (tuần 10 của học kỳ).\n   - Thi Học Kỳ: Hệ số 3 (cuối học kỳ).\n\nKết quả sẽ được công bố trên Sổ Điểm Điện Tử và gửi Phiếu Báo Điểm về cho gia đình.`,
    isPinned: false
  }
];

const DEFAULT_DOCS_DATASET = [
  {
    id: 'DOC01',
    title: 'Sách Giáo Lý Khối Khai Tâm (Bản Chuẩn GP. Phú Cường)',
    category: 'Giáo Trình',
    format: 'PDF',
    target: 'Khối Khai Tâm (Lớp Dự Bị, KT1, KT2)',
    size: '4.2 MB',
    author: 'Ủy Ban Giáo Lý GP Phú Cường',
    downloads: 320,
    desc: 'Giáo trình tranh ảnh đầy đủ màu sắc dành cho các em 6-8 tuổi bắt đầu làm quen với Chúa Giêsu, lời cầu nguyện và các nhân vật Kinh Thánh.',
    content: 'Tài liệu gồm 24 bài học căn bản về Thiên Chúa Tình Yêu, Chúa Giêsu Bạn Của Trẻ Thơ, Đức Mẹ Maria và những kinh nguyện đầu đời.'
  },
  {
    id: 'DOC02',
    title: 'Sách Giáo Lý Đến Bàn Tiệc Thánh - Khối Rước Lễ',
    category: 'Giáo Trình',
    format: 'PDF',
    target: 'Khối Rước Lễ (RL1, RL2, RL3)',
    size: '5.8 MB',
    author: 'Ủy Ban Giáo Lý Đức Tin',
    downloads: 415,
    desc: 'Tài liệu chuẩn bị tâm hồn cho các em xưng tội và rước lễ lần đầu, gồm các bí tích Hòa Giải và Thánh Thể.',
    content: 'Tài liệu gồm 30 bài học chuyên sâu về Bí Tích Hòa Giải, Bí Tích Thánh Thể, 10 Điều Răn và 6 Điều Răn Hội Thánh.'
  },
  {
    id: 'DOC03',
    title: 'Sách Giáo Lý Lớn Lên Trong Chúa Thánh Thần - Khối Thêm Sức',
    category: 'Giáo Trình',
    format: 'PDF',
    target: 'Khối Thêm Sức (TS1, TS2, TS3)',
    size: '6.1 MB',
    author: 'Ủy Ban Giáo Lý Đức Tin',
    downloads: 380,
    desc: 'Giáo trình bồi dưỡng đức tin và 7 ơn Chúa Thánh Thần giúp các em sẵn sàng lãnh nhận Bí tích Thêm Sức.',
    content: 'Gồm 32 bài học về Chúa Thánh Thần, Hội Thánh, Phụng Vụ, 7 Ơn Chúa Thánh Thần và Đời Sống Đức Tin Trưởng Thành.'
  },
  {
    id: 'DOC04',
    title: 'Sách Giáo Lý Sống Đạo Giữa Đời - Khối Bao Đồng',
    category: 'Giáo Trình',
    format: 'PDF',
    target: 'Khối Bao Đồng (BD1, BD2, BD3)',
    size: '7.0 MB',
    author: 'Ủy Ban Giáo Lý GP Phú Cường',
    downloads: 290,
    desc: 'Giáo trình tuyên xưng đức tin, sống đạo và đối thoại giữa người Kitô hữu trong xã hội hiện đại.',
    content: 'Gồm 36 bài học về Luân Lý Công Giáo, Nhân Bản Kitô Giáo, Lương Tâm, Tội Lỗi và Ơn Cứu Độ.'
  },
  {
    id: 'DOC05',
    title: 'Sách Giáo Lý Hành Trang Vào Đời - Khối Vào Đời',
    category: 'Giáo Trình',
    format: 'PDF',
    target: 'Khối Vào Đời (VD1, VD2)',
    size: '6.5 MB',
    author: 'Ủy Ban Giáo Lý Đức Tin',
    downloads: 260,
    desc: 'Hành trang định hướng ơn gọi, hôn nhân gia đình, đạo đức nghề nghiệp và sứ vụ tông đồ giáo dân.',
    content: 'Gồm 28 bài học định hướng tương lai, tình yêu - hôn nhân Kitô giáo, trách nhiệm xã hội và ơn gọi đời sống.'
  },
  {
    id: 'DOC06',
    title: 'Nội Quy & Sổ Tay Huynh Trưởng Thiếu Nhi Thánh Thể VN',
    category: 'Sổ Tay',
    format: 'PDF',
    target: 'Dành Cho GLV & Huynh Trưởng',
    size: '3.5 MB',
    author: 'Tổng Liên Đoàn TNTT Việt Nam',
    downloads: 510,
    desc: 'Cẩm nang toàn diện về phương pháp tự nhiên, siêu nhiên, hiệu lệnh còi cờ, nghi thức chào cờ và linh đạo TNTT.',
    content: 'Quy định đầy đủ về đồng phục, cấp bậc, nghi thức tuyên hứa, quản lý đoàn sinh và điều hành sa mạc huấn luyện.'
  },
  {
    id: 'DOC07',
    title: 'Sổ Tay Kỹ Năng & Trò Chơi Sinh Hoạt Thiếu Nhi',
    category: 'Sổ Tay',
    format: 'DOCX',
    target: 'Dành Cho GLV Đứng Lớp',
    size: '2.1 MB',
    author: 'Ban Kỹ Năng Xứ Đoàn Tân Mỹ',
    downloads: 440,
    desc: 'Tổng hợp hơn 150 trò chơi vòng tròn, băng reo, trò chơi Kinh Thánh, gút dây và mật thư ứng dụng.',
    content: 'Bộ sưu tập trò chơi sinh hoạt giáo lý theo từng chủ đề bài học, giúp giờ học luôn hào hứng và sôi nổi.'
  },
  {
    id: 'DOC08',
    title: 'Tuyển Tập Bài Hát Sinh Hoạt & Nghi Thức TNTT (Có Hợp Âm)',
    category: 'Kinh & Hát',
    format: 'MP3',
    target: 'Toàn Đoàn Thiếu Nhi & GLV',
    size: '12.8 MB',
    author: 'Ban Âm Nhạc TNTT',
    downloads: 680,
    desc: 'Tuyển tập 50 bài hát sinh hoạt, bài ca chính thức của các ngành Ấu, Thiếu, Nghĩa và Huynh Trưởng.',
    content: 'Bao gồm file nghe MP3 chất lượng cao và lời bài hát kèm hợp âm guitar/organ đệm hát trong giờ chào cờ và sinh hoạt.'
  },
  {
    id: 'DOC09',
    title: 'Kinh Nguyện Hằng Ngày Dành Cho Thiếu Nhi Thánh Thể',
    category: 'Kinh & Hát',
    format: 'PDF',
    target: 'Toàn Thể Thiếu Nhi',
    size: '1.5 MB',
    author: 'Ban Phụng Vụ Tân Mỹ',
    downloads: 590,
    desc: 'Bản in bỏ túi các kinh nguyện sáng tối, kinh dâng ngày, kinh viếng Chúa, kinh dâng hoa và kinh bổn mạng.',
    content: 'Lời kinh chữ to, rõ ràng, dễ nhớ, có hình minh họa sinh động dành cho các em thiếu nhi học thuộc.'
  },
  {
    id: 'DOC10',
    title: 'Biểu Mẫu Sổ Điểm Điện Tử & Bảng Điểm Lớp Giáo Lý 2026 - 2027',
    category: 'Biểu Mẫu',
    format: 'XLSX',
    target: 'Giáo Lý Viên & Ban Học Vụ',
    size: '1.2 MB',
    author: 'Ban Công Nghệ - Tân Mỹ',
    downloads: 350,
    desc: 'Mẫu bảng tính Excel chuẩn gồm đầy đủ 3 Sheet: Học Kỳ 1, Học Kỳ 2, Tổng Kết Cả Năm có tích hợp sẵn công thức tính điểm trung bình và xếp loại.',
    content: 'Biểu mẫu sẵn sàng nạp trực tiếp vào hệ thống web qua chức năng "Nhập Excel" của Sổ Điểm Điện Tử.'
  }
];

function loadSavedNewsDatabase() {
  try {
    const saved = localStorage.getItem(NEWS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Lỗi đọc dữ liệu Thông Báo từ localStorage:', e);
  }
  return [...DEFAULT_NEWS_DATASET];
}

function saveNewsDatabase() {
  try {
    localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(newsDatabase));
  } catch (e) {
    console.warn('Lỗi lưu dữ liệu Thông Báo vào localStorage:', e);
  }
  if (typeof renderNewsFilterCounts === 'function') renderNewsFilterCounts();
}

function loadSavedDocsDatabase() {
  try {
    const saved = localStorage.getItem(DOCS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Lỗi đọc dữ liệu Tài Liệu từ localStorage:', e);
  }
  return [...DEFAULT_DOCS_DATASET];
}

function saveDocsDatabase() {
  try {
    localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(docsDatabase));
  } catch (e) {
    console.warn('Lỗi lưu dữ liệu Tài Liệu vào localStorage:', e);
  }
  if (typeof renderDocsFilterCounts === 'function') renderDocsFilterCounts();
}

let glvDatabase = loadSavedDatabase();
let classDatabase = loadSavedClassesDatabase();
let newsDatabase = loadSavedNewsDatabase();
let docsDatabase = loadSavedDocsDatabase();
let currentDisplayedGLV = null;
let currentDisplayedClass = null;
let qrcodeInstance = null;
let currentSort = { column: 'stt', order: 'asc' };
let currentBlockFilter = 'all';
let currentNewsCategoryFilter = 'all';
let currentDocsCategoryFilter = 'all';
let currentTab = localStorage.getItem(ACTIVE_TAB_KEY) || 'news';
let currentUserRole = sessionStorage.getItem(AUTH_ROLE_KEY) || 'guest';
const ADMIN_PASSWORDS = ['admin', 'admin123', 'tanmy2026', 'tanmy'];

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
const navItemNews = document.getElementById('navItemNews');
const navItemGlv = document.getElementById('navItemGlv');
const navItemClasses = document.getElementById('navItemClasses');
const navItemDocs = document.getElementById('navItemDocs');
const tabNewsView = document.getElementById('tabNewsView');
const tabGlvView = document.getElementById('tabGlvView');
const tabClassView = document.getElementById('tabClassView');
const tabDocsView = document.getElementById('tabDocsView');
const sidebarNewsCount = document.getElementById('sidebarNewsCount');
const sidebarGlvCount = document.getElementById('sidebarGlvCount');
const sidebarClassCount = document.getElementById('sidebarClassCount');
const sidebarDocsCount = document.getElementById('sidebarDocsCount');
const sidebarRoleIcon = document.getElementById('sidebarRoleIcon');
const sidebarRoleName = document.getElementById('sidebarRoleName');
const sidebarAuthSwitchBtn = document.getElementById('sidebarAuthSwitchBtn');
const sidebarAddNewsBtn = document.getElementById('sidebarAddNewsBtn');
const sidebarAddDocBtn = document.getElementById('sidebarAddDocBtn');
const sidebarViewAllGlvBtn = document.getElementById('sidebarViewAllGlvBtn');
const sidebarAddGlvBtn = document.getElementById('sidebarAddGlvBtn');
const sidebarExportGlvBtn = document.getElementById('sidebarExportGlvBtn');
const sidebarViewAllClassesBtn = document.getElementById('sidebarViewAllClassesBtn');
const sidebarAddClassBtn = document.getElementById('sidebarAddClassBtn');
const sidebarExportClassesBtn = document.getElementById('sidebarExportClassesBtn');

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

// Students Section DOM Elements
const navItemStudents = document.getElementById('navItemStudents');
const tabStudentsView = document.getElementById('tabStudentsView');
const sidebarStudentCount = document.getElementById('sidebarStudentCount');
const studentStatTotalCount = document.getElementById('studentStatTotalCount');
const studentStatMaleCount = document.getElementById('studentStatMaleCount');
const studentStatFemaleCount = document.getElementById('studentStatFemaleCount');
const studentStatClassesCount = document.getElementById('studentStatClassesCount');
const allStudentsSearchInput = document.getElementById('allStudentsSearchInput');
const allStudentsClearSearchBtn = document.getElementById('allStudentsClearSearchBtn');
const filterStudentBlockSelect = document.getElementById('filterStudentBlockSelect');
const filterStudentClassSelect = document.getElementById('filterStudentClassSelect');
const filterStudentGenderSelect = document.getElementById('filterStudentGenderSelect');
const allStudentsTableBody = document.getElementById('allStudentsTableBody');
const allStudentsDisplayCount = document.getElementById('allStudentsDisplayCount');
const allStudentsNotFoundState = document.getElementById('allStudentsNotFoundState');
const tabStudentsAddBtn = document.getElementById('tabStudentsAddBtn');
const tabStudentsImportBtn = document.getElementById('tabStudentsImportBtn');
const tabStudentsExportBtn = document.getElementById('tabStudentsExportBtn');
const tabStudentsGradebookBtn = document.getElementById('tabStudentsGradebookBtn');
const sidebarAddStudentBtn = document.getElementById('sidebarAddStudentBtn');
const sidebarImportAllStudentsBtn = document.getElementById('sidebarImportAllStudentsBtn');
const sidebarExportAllStudentsBtn = document.getElementById('sidebarExportAllStudentsBtn');

// Gradebook & Report Card DOM Elements
const classGradebookModal = document.getElementById('classGradebookModal');
const gradebookClassTitle = document.getElementById('gradebookClassTitle');
const gradebookClassSelect = document.getElementById('gradebookClassSelect');
const gradebookSemesterTabs = document.getElementById('gradebookSemesterTabs');
const gradebookSearchInput = document.getElementById('gradebookSearchInput');
const btnSaveGradebook = document.getElementById('btnSaveGradebook');
const btnImportGradebookExcel = document.getElementById('btnImportGradebookExcel');
const btnExportGradebookExcel = document.getElementById('btnExportGradebookExcel');
const btnPrintGradebook = document.getElementById('btnPrintGradebook');
const gradebookImportFileInput = document.getElementById('gradebookImportFileInput');
const gradebookTableHead = document.getElementById('gradebookTableHead');
const gradebookTableBody = document.getElementById('gradebookTableBody');
const gbStatStudentCount = document.getElementById('gbStatStudentCount');
const gbStatClassAvg = document.getElementById('gbStatClassAvg');
const gbStatAttendanceAvg = document.getElementById('gbStatAttendanceAvg');
const gbCountGioi = document.getElementById('gbCountGioi');
const gbCountKha = document.getElementById('gbCountKha');
const gbCountTb = document.getElementById('gbCountTb');
const gbCountYeu = document.getElementById('gbCountYeu');
const studentReportCardModal = document.getElementById('studentReportCardModal');
const reportCardPrintArea = document.getElementById('reportCardPrintArea');
const btnPrintSingleReportCard = document.getElementById('btnPrintSingleReportCard');
const rosterOpenGradebookBtn = document.getElementById('rosterOpenGradebookBtn');
const btnOpenGradebookFromDetail = document.getElementById('btnOpenGradebookFromDetail');

// ==========================================================================
// KHỞI ĐỘNG ỨNG DỤNG
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  try {
    initUserRole();
    initSidebarState();
    updateStatsDisplay();
    initClassModule();
    updateStudentStatsDisplay();
    setupEventListeners();
    switchTab(currentTab);
    initApiSync();
    tryAutoFetchExcel();
  } catch (err) {
    console.error('Lỗi khởi động ứng dụng:', err);
  }
});

async function initApiSync() {
  if (typeof API === 'undefined') {
    ensureDefaultStudentsForAllClasses();
    updateStudentStatsDisplay();
    return;
  }
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

      // Đồng bộ danh sách thiếu nhi trực tiếp từ bảng students trong MySQL
      const allDbStudents = await API.getAllStudents();
      if (allDbStudents && allDbStudents.length > 0) {
        classDatabase.forEach(cls => {
          const matchStudents = allDbStudents.filter(s => s.classId === cls.id || s.classId === cls.id.replace('CLASS_', ''));
          if (matchStudents.length > 0) {
            cls.students = matchStudents;
            cls.studentCount = matchStudents.length;
          }
        });
      } else {
        for (const cls of classDatabase) {
          const students = await API.getStudents(cls.id);
          if (students && students.length > 0) {
            cls.students = students;
            cls.studentCount = students.length;
          }
        }
      }

      saveClassesDatabase();
      updateStudentStatsDisplay();
      if (currentTab === 'classes') renderClassesView();
      if (currentTab === 'students') renderAllStudentsView();
    }

    // Cập nhật News từ MySQL
    const dbNews = await API.getNews();
    if (dbNews && dbNews.length > 0) {
      newsDatabase = dbNews;
      saveNewsDatabase();
      if (currentTab === 'news') renderNewsView();
    }

    // Cập nhật Docs từ MySQL
    const dbDocs = await API.getDocs();
    if (dbDocs && dbDocs.length > 0) {
      docsDatabase = dbDocs;
      saveDocsDatabase();
      if (currentTab === 'docs') renderDocsView();
    }
  } else {
    ensureDefaultStudentsForAllClasses();
  }
  updateStudentStatsDisplay();
  populateStudentClassFilter();
  if (currentTab === 'students') renderAllStudentsView();
}

// ==========================================================================
// ==========================================================================
// QUẢN LÝ TAB & SIDEBAR NAVIGATION
// ==========================================================================
function switchTab(tabName) {
  currentTab = tabName || 'news';
  localStorage.setItem(ACTIVE_TAB_KEY, currentTab);

  const quickActionsNews = document.getElementById('quickActionsNews');
  const quickActionsGlv = document.getElementById('quickActionsGlv');
  const quickActionsClasses = document.getElementById('quickActionsClasses');
  const quickActionsStudents = document.getElementById('quickActionsStudents');
  const quickActionsDocs = document.getElementById('quickActionsDocs');

  // Reset active classes
  if (navItemNews) navItemNews.classList.remove('active');
  if (navItemGlv) navItemGlv.classList.remove('active');
  if (navItemClasses) navItemClasses.classList.remove('active');
  if (navItemStudents) navItemStudents.classList.remove('active');
  if (navItemDocs) navItemDocs.classList.remove('active');

  if (tabNewsView) tabNewsView.style.display = 'none';
  if (tabGlvView) tabGlvView.style.display = 'none';
  if (tabClassView) tabClassView.style.display = 'none';
  if (tabStudentsView) tabStudentsView.style.display = 'none';
  if (tabDocsView) tabDocsView.style.display = 'none';

  if (quickActionsNews) quickActionsNews.style.display = 'none';
  if (quickActionsGlv) quickActionsGlv.style.display = 'none';
  if (quickActionsClasses) quickActionsClasses.style.display = 'none';
  if (quickActionsStudents) quickActionsStudents.style.display = 'none';
  if (quickActionsDocs) quickActionsDocs.style.display = 'none';

  if (currentTab === 'news') {
    if (navItemNews) navItemNews.classList.add('active');
    if (tabNewsView) tabNewsView.style.display = 'block';
    if (quickActionsNews) quickActionsNews.style.display = 'block';
    renderNewsView();
  } else if (currentTab === 'glv') {
    if (navItemGlv) navItemGlv.classList.add('active');
    if (tabGlvView) tabGlvView.style.display = 'block';
    if (quickActionsGlv) quickActionsGlv.style.display = 'block';
    if (!currentDisplayedGLV) showWelcomeState();
  } else if (currentTab === 'classes') {
    if (navItemClasses) navItemClasses.classList.add('active');
    if (tabClassView) tabClassView.style.display = 'block';
    if (quickActionsClasses) quickActionsClasses.style.display = 'block';
    renderClassesView();
  } else if (currentTab === 'students') {
    if (navItemStudents) navItemStudents.classList.add('active');
    if (tabStudentsView) tabStudentsView.style.display = 'block';
    if (quickActionsStudents) quickActionsStudents.style.display = 'block';
    renderAllStudentsView();
  } else if (currentTab === 'docs') {
    if (navItemDocs) navItemDocs.classList.add('active');
    if (tabDocsView) tabDocsView.style.display = 'block';
    if (quickActionsDocs) quickActionsDocs.style.display = 'block';
    renderDocsView();
  }

  updateStudentStatsDisplay();

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

function toggleSidebarCollapse() {
  const appLayout = document.querySelector('.app-layout');
  const sidebarToggleIcon = document.getElementById('sidebarToggleIcon');
  if (!appLayout) return;

  if (window.innerWidth <= 1024) {
    if (appSidebar && appSidebar.classList.contains('sidebar-open')) {
      closeMobileSidebar();
    } else {
      openMobileSidebar();
    }
    return;
  }

  const isCollapsed = appLayout.classList.toggle('sidebar-collapsed');
  localStorage.setItem('sidebar_collapsed_pref', isCollapsed ? '1' : '0');
  if (sidebarToggleIcon) {
    sidebarToggleIcon.className = isCollapsed ? 'fa-solid fa-chevron-right' : 'fa-solid fa-chevron-left';
  }
}

function initSidebarState() {
  const appLayout = document.querySelector('.app-layout');
  const sidebarToggleIcon = document.getElementById('sidebarToggleIcon');
  const saved = localStorage.getItem('sidebar_collapsed_pref');
  if (saved === '1' && appLayout && window.innerWidth > 1024) {
    appLayout.classList.add('sidebar-collapsed');
    if (sidebarToggleIcon) {
      sidebarToggleIcon.className = 'fa-solid fa-chevron-right';
    }
  }
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
  const btnAddNews = document.getElementById('btnAddNews');
  const btnAddDoc = document.getElementById('btnAddDoc');
  const sidebarAddClassBtn = document.getElementById('sidebarAddClassBtn');
  const modalToolbarAddClassBtn = document.getElementById('modalToolbarAddClassBtn');

  if (btnAddNews) btnAddNews.style.display = isAdmin ? 'inline-flex' : 'none';
  if (sidebarAddNewsBtn) sidebarAddNewsBtn.style.display = isAdmin ? 'flex' : 'none';
  if (btnAddDoc) btnAddDoc.style.display = isAdmin ? 'inline-flex' : 'none';
  if (sidebarAddDocBtn) sidebarAddDocBtn.style.display = isAdmin ? 'flex' : 'none';

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

  // Cập nhật lại Grid Lớp học / Danh sách Thiếu nhi / News / Docs để ẩn/hiện nút sửa nhanh theo quyền
  if (currentTab === 'news') {
    renderNewsView();
  }
  if (currentTab === 'classes') {
    renderClassesView();
  }
  if (currentTab === 'students') {
    renderAllStudentsView();
  }
  if (currentTab === 'docs') {
    renderDocsView();
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
// HỘP THOẠI XÁC NHẬN TÙY BIẾN ĐẸP MẮT (CUSTOM CONFIRM MODAL)
// ==========================================================================
function showConfirmDialog({
  title = 'Xác Nhận Xóa',
  message = 'Bạn có chắc chắn muốn xóa đối tượng này không?',
  itemName = '',
  note = '⚠️ Thao tác này không thể hoàn tác và sẽ cập nhật trực tiếp về MySQL Database.',
  confirmText = 'Xác Nhận Xóa',
  cancelText = 'Hủy Bỏ',
  type = 'danger',
  iconClass = 'fa-solid fa-trash-can'
} = {}) {
  return new Promise((resolve) => {
    const modal = document.getElementById('customConfirmModal');
    const backdrop = document.getElementById('confirmModalBackdrop');
    const iconWrap = document.getElementById('confirmIconWrap');
    const icon = document.getElementById('confirmIcon');
    const titleEl = document.getElementById('confirmTitle');
    const msgEl = document.getElementById('confirmMessage');
    const itemBadge = document.getElementById('confirmItemBadge');
    const itemNameEl = document.getElementById('confirmItemName');
    const noteEl = document.getElementById('confirmNote');
    const cancelBtn = document.getElementById('btnConfirmCancel');
    const okBtn = document.getElementById('btnConfirmOk');

    if (!modal) {
      const ok = confirm(itemName ? `${message}\n[${itemName}]` : message);
      return resolve(ok);
    }

    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;
    if (noteEl) noteEl.textContent = note;

    if (itemBadge && itemNameEl) {
      if (itemName) {
        itemNameEl.textContent = itemName;
        itemBadge.style.display = 'inline-block';
        itemBadge.className = `confirm-item-badge ${type}`;
      } else {
        itemBadge.style.display = 'none';
      }
    }

    if (iconWrap && icon) {
      iconWrap.className = `confirm-icon-wrap ${type}`;
      icon.className = iconClass;
    }

    if (cancelBtn) {
      cancelBtn.innerHTML = `<i class="fa-solid fa-xmark"></i> ${cancelText}`;
    }

    if (okBtn) {
      okBtn.className = `btn-confirm-ok ${type}`;
      okBtn.innerHTML = `${type === 'danger' ? '<i class="fa-solid fa-trash-can"></i>' : '<i class="fa-solid fa-check"></i>'} ${confirmText}`;
    }

    modal.style.display = 'flex';
    requestAnimationFrame(() => {
      modal.classList.add('active');
    });

    function cleanup(result) {
      modal.classList.remove('active');
      setTimeout(() => {
        modal.style.display = 'none';
      }, 220);
      okBtn.removeEventListener('click', onOk);
      cancelBtn.removeEventListener('click', onCancel);
      if (backdrop) backdrop.removeEventListener('click', onCancel);
      resolve(result);
    }

    function onOk() { cleanup(true); }
    function onCancel() { cleanup(false); }

    okBtn.addEventListener('click', onOk);
    cancelBtn.addEventListener('click', onCancel);
    if (backdrop) backdrop.addEventListener('click', onCancel);
  });
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

function getClassStudents(cls) {
  if (!cls) return [];
  if (Array.isArray(cls.students)) {
    return cls.students.map((s, idx) => ({
      stt: s.stt || (idx + 1),
      id: s.id || `TN-${(cls.id || 'CLS').replace('CLASS_', '')}-${String(idx + 1).padStart(2, '0')}`,
      holyName: s.holyName || '',
      fullName: s.fullName || s.name || 'Chưa cập nhật tên',
      gender: s.gender || 'Nam',
      birthDate: s.birthDate || s.birth_date || '',
      note: s.note || 'Đang theo học',
      parentName: s.parentName || s.parent_name || '',
      parentPhone: s.parentPhone || s.parent_phone || '',
      address: s.address || ''
    }));
  }
  return [];
}

async function openClassStudentsRosterModal(classId) {
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

  // Lấy dữ liệu mới nhất từ MySQL Database API
  if (typeof API !== 'undefined') {
    const apiStudents = await API.getStudents(classId);
    if (apiStudents && Array.isArray(apiStudents) && apiStudents.length > 0) {
      cls.students = apiStudents;
      cls.studentCount = apiStudents.length;
      saveClassesDatabase();
    }
  }

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
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const sId = btn.getAttribute('data-student-id');
        openEditStudentModal(sId, cls.id);
      };
    });

    // Sự kiện Xóa thiếu nhi trong Roster
    tbody.querySelectorAll('.btn-roster-delete-student').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const sId = btn.getAttribute('data-student-id');
        deleteStudentFromClass(sId, cls.id);
      };
    });
  };

  if (searchInput) {
    searchInput.value = '';
    searchInput.oninput = (e) => renderTable(e.target.value);
  }

  if (addBtn) {
    addBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      openEditStudentModal(null, cls.id);
    };
  }

  if (exportBtn) {
    exportBtn.onclick = (e) => {
      e.preventDefault();
      exportClassStudentsToExcel(cls);
    };
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
    note: document.getElementById('formStudentNote'),
    parentName: document.getElementById('formStudentParentName'),
    parentPhone: document.getElementById('formStudentParentPhone'),
    address: document.getElementById('formStudentAddress')
  };
}

function openEditStudentModal(studentId = null, classId = null) {
  if (!classId) classId = currentRosterClassId;
  if (!classId) return;

  const cls = classDatabase.find(c => c.id === classId || c.id.toLowerCase() === classId.toLowerCase());
  if (!cls) return;

  const dom = getStudentDomElements();
  if (!dom.modal) return;

  const students = getClassStudents(cls);
  if (dom.classId) dom.classId.value = cls.id;

  if (studentId) {
    // Chế độ Sửa thiếu nhi
    const s = students.find(item => item.id === studentId);
    if (!s) return;

    if (dom.origId) dom.origId.value = s.id;
    if (dom.title) {
      dom.title.textContent = `Chỉnh Sửa Thiếu Nhi: ${s.fullName}`;
    }
    if (dom.id) {
      dom.id.value = s.id;
      dom.id.readOnly = true;
    }
    if (dom.holyName) dom.holyName.value = s.holyName || '';
    if (dom.fullName) dom.fullName.value = s.fullName || '';
    if (dom.gender) dom.gender.value = s.gender || 'Nam';
    if (dom.birthDate) dom.birthDate.value = s.birthDate || '';
    if (dom.note) dom.note.value = s.note || '';
    if (dom.parentName) dom.parentName.value = s.parentName || s.parent_name || '';
    if (dom.parentPhone) dom.parentPhone.value = s.parentPhone || s.parent_phone || '';
    if (dom.address) dom.address.value = s.address || '';
  } else {
    // Chế độ Thêm mới thiếu nhi
    if (dom.origId) dom.origId.value = '';
    if (dom.title) {
      dom.title.textContent = `Thêm Thiếu Nhi Mới - Lớp ${cls.name}`;
    }
    const code = (cls.id || 'CLS').replace('CLASS_', '');
    const nextStt = students.length + 1;
    if (dom.id) {
      dom.id.value = `TN-${code}-${String(nextStt).padStart(2, '0')}`;
      dom.id.readOnly = false;
    }
    if (dom.holyName) dom.holyName.value = '';
    if (dom.fullName) dom.fullName.value = '';
    if (dom.gender) dom.gender.value = 'Nam';
    if (dom.birthDate) dom.birthDate.value = '';
    if (dom.note) dom.note.value = 'Đang theo học';
    if (dom.parentName) dom.parentName.value = '';
    if (dom.parentPhone) dom.parentPhone.value = '';
    if (dom.address) dom.address.value = '';
  }

  dom.modal.style.display = 'flex';
  if (dom.fullName) setTimeout(() => dom.fullName.focus(), 50);
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
  const parentName = dom.parentName ? dom.parentName.value.trim() : '';
  const parentPhone = dom.parentPhone ? dom.parentPhone.value.trim() : '';
  const address = dom.address ? dom.address.value.trim() : '';

  if (!classId || !fullName || !id) {
    showToast('Vui lòng điền đầy đủ thông tin bắt buộc!');
    return;
  }

  const cls = classDatabase.find(c => c.id === classId || c.id.toLowerCase() === classId.toLowerCase());
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
        note: note,
        parentName: parentName,
        parentPhone: parentPhone,
        address: address
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
      note: note || 'Đang theo học',
      parentName: parentName,
      parentPhone: parentPhone,
      address: address
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
      classId: cls.id
    }, !originalId).then(success => {
      if (success) console.log('Đã tự động đồng bộ thiếu nhi vào MySQL Database!');
    });
  }

  closeEditStudentModal();

  // Cập nhật lại cửa sổ Roster nếu đang mở
  const rosterModal = document.getElementById('classStudentsModal');
  if (rosterModal && rosterModal.style.display !== 'none') {
    openClassStudentsRosterModal(cls.id);
  }
}

async function deleteStudentFromClass(studentId, classId) {
  if (!classId) classId = currentRosterClassId;
  const cls = classDatabase.find(c => c.id === classId || c.id.toLowerCase() === classId.toLowerCase());
  if (!cls) return;

  const students = getClassStudents(cls);
  const target = students.find(s => s.id === studentId);
  if (!target) return;

  const confirmed = await showConfirmDialog({
    title: 'Xác Nhận Xóa Thiếu Nhi',
    message: 'Bạn có chắc chắn muốn xóa thiếu nhi này khỏi danh sách lớp không?',
    itemName: `${target.id} - ${target.holyName ? target.holyName + ' ' : ''}${target.fullName} (Lớp ${cls.name})`,
    confirmText: 'Xác Nhận Xóa',
    type: 'danger',
    iconClass: 'fa-solid fa-user-minus'
  });

  if (!confirmed) return;

  cls.students = students.filter(s => s.id !== studentId);
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
    openClassStudentsRosterModal(cls.id);
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

async function deleteClass(classId) {
  if (currentUserRole !== 'admin') {
    showToast('Chỉ Quản Trị Viên (Admin) mới có quyền xóa lớp học!');
    return;
  }
  const cls = classDatabase.find(c => c.id === classId);
  if (!cls) return;

  const confirmed = await showConfirmDialog({
    title: 'Xác Nhận Xóa Lớp Học',
    message: 'Bạn có chắc chắn muốn xóa lớp học này khỏi hệ thống không?',
    itemName: `${cls.id} - ${cls.name} (${cls.block || 'Khối Giáo Lý'})`,
    confirmText: 'Xác Nhận Xóa Lớp',
    type: 'danger',
    iconClass: 'fa-solid fa-trash-can'
  });

  if (!confirmed) return;

  classDatabase = classDatabase.filter(c => c.id !== classId);
  saveClassesDatabase();
  renderClassesView();
  renderBlockFilterPillCounts();
  renderAllClassesTable();
  showToast(`Đã xóa lớp "${cls.name}" thành công!`);

  if (typeof API !== 'undefined' && API.isOnline) {
    API.deleteClass(cls.id);
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
// XUẤT VÀ NHẬP DANH SÁCH THIẾU NHI BẰNG FILE EXCEL (STUDENT EXCEL IMPORT/EXPORT)
// ==========================================================================
function exportClassStudentsToExcel(cls) {
  if (typeof XLSX === 'undefined') {
    showToast('Thư viện Excel đang tải, vui lòng thử lại sau vài giây!');
    return;
  }
  const students = getClassStudents(cls);
  const data = students.map((s, idx) => ({
    'STT': s.stt || (idx + 1),
    'Mã Thiếu Nhi': s.id || '',
    'Tên Thánh (Bổn Mạng)': s.holyName || '',
    'Họ và Tên (*)': s.fullName || '',
    'Giới Tính': s.gender || 'Nam',
    'Ngày Sinh (DD/MM/YYYY)': s.birthDate || '',
    'Ghi Chú / Vai Trò': s.note || 'Đang theo học',
    'Tên Phụ Huynh (Cha/Mẹ)': s.parentName || '',
    'Số Điện Thoại Phụ Huynh': s.parentPhone || '',
    'Địa Chỉ / Giáo Họ': s.address || ''
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'DanhSachThieuNhi');
  const safeName = (cls.name || 'LopGiaoLy').replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1E00-\u1EFF]/g, '_');
  XLSX.writeFile(wb, `Danh_Sach_Thieu_Nhi_${safeName}_2026_2027.xlsx`);
  showToast(`Đã xuất file Excel danh sách lớp ${cls.name}!`);
}

function downloadStudentExcelTemplate(cls) {
  if (typeof XLSX === 'undefined') {
    showToast('Thư viện Excel đang tải, vui lòng thử lại sau!');
    return;
  }
  const sampleData = [
    {
      'STT': 1,
      'Mã Thiếu Nhi': `TN-${(cls ? cls.id : 'DBKT').replace('CLASS_', '')}-01`,
      'Tên Thánh (Bổn Mạng)': 'Giuse',
      'Họ và Tên (*)': 'Nguyễn Minh An',
      'Giới Tính': 'Nam',
      'Ngày Sinh (DD/MM/YYYY)': '15/04/2019',
      'Ghi Chú / Vai Trò': 'Lớp trưởng',
      'Tên Phụ Huynh (Cha/Mẹ)': 'Nguyễn Văn Hải',
      'Số Điện Thoại Phụ Huynh': '0901234567',
      'Địa Chỉ / Giáo Họ': 'Giáo họ Thánh Giuse'
    },
    {
      'STT': 2,
      'Mã Thiếu Nhi': `TN-${(cls ? cls.id : 'DBKT').replace('CLASS_', '')}-02`,
      'Tên Thánh (Bổn Mạng)': 'Maria',
      'Họ và Tên (*)': 'Trần Ngọc Hân',
      'Giới Tính': 'Nữ',
      'Ngày Sinh (DD/MM/YYYY)': '22/08/2019',
      'Ghi Chú / Vai Trò': 'Lớp phó học tập',
      'Tên Phụ Huynh (Cha/Mẹ)': 'Trần Minh Tuấn',
      'Số Điện Thoại Phụ Huynh': '0912345678',
      'Địa Chỉ / Giáo Họ': 'Giáo họ Đức Mẹ'
    },
    {
      'STT': 3,
      'Mã Thiếu Nhi': `TN-${(cls ? cls.id : 'DBKT').replace('CLASS_', '')}-03`,
      'Tên Thánh (Bổn Mạng)': 'Phêrô',
      'Họ và Tên (*)': 'Lê Hoàng Long',
      'Giới Tính': 'Nam',
      'Ngày Sinh (DD/MM/YYYY)': '10/01/2019',
      'Ghi Chú / Vai Trò': 'Đang theo học',
      'Tên Phụ Huynh (Cha/Mẹ)': 'Lê Văn Nam',
      'Số Điện Thoại Phụ Huynh': '0987654321',
      'Địa Chỉ / Giáo Họ': 'Giáo họ Thánh Tâm'
    }
  ];

  const ws = XLSX.utils.json_to_sheet(sampleData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'MauNhapThieuNhi');
  const className = cls ? cls.name : 'Chuan';
  XLSX.writeFile(wb, `Mau_Nhap_Excel_Thieu_Nhi_${className}.xlsx`);
  showToast('Đã tải xuống file mẫu Excel thành công!');
}

let pendingImportStudents = [];
let importClassId = null;

function openStudentExcelImportModal(classId) {
  if (!classId) classId = currentRosterClassId;
  const cls = classDatabase.find(c => c.id === classId || c.id.toLowerCase() === classId.toLowerCase());
  if (!cls) return;

  importClassId = cls.id;
  pendingImportStudents = [];

  const modal = document.getElementById('importExcelPreviewModal');
  const title = document.getElementById('importExcelClassTitle');
  const previewBox = document.getElementById('importPreviewContainer');
  const statusText = document.getElementById('importFileStatusText');
  const confirmBtn = document.getElementById('btnConfirmImportExcel');
  const fileInput = document.getElementById('rosterImportFileInput');

  if (title) title.textContent = `Lớp ${cls.name}`;
  if (previewBox) previewBox.style.display = 'none';
  if (statusText) statusText.textContent = 'Chưa chọn file Excel nào';
  if (confirmBtn) {
    confirmBtn.disabled = true;
    confirmBtn.style.cursor = 'not-allowed';
    confirmBtn.style.opacity = '0.6';
  }
  if (fileInput) fileInput.value = '';

  if (modal) modal.style.display = 'flex';
}

function closeStudentExcelImportModal() {
  const modal = document.getElementById('importExcelPreviewModal');
  if (modal) modal.style.display = 'none';
}

function parseStudentExcelFile(file) {
  if (!file) return;
  const statusText = document.getElementById('importFileStatusText');
  const previewBox = document.getElementById('importPreviewContainer');
  const countDisplay = document.getElementById('importPreviewValidCount');
  const tbody = document.getElementById('importPreviewTableBody');
  const confirmBtn = document.getElementById('btnConfirmImportExcel');

  if (statusText) statusText.textContent = `Đang đọc file: ${file.name}...`;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

      if (!rows || rows.length < 2) {
        showToast('File Excel rỗng hoặc không đúng định dạng!');
        if (statusText) statusText.textContent = 'File Excel không có dữ liệu!';
        return;
      }

      // Xác định hàng tiêu đề
      const headerRow = rows[0].map(h => removeVietnameseTones(String(h).toLowerCase().trim()));
      
      const findColIdx = (keywords) => {
        return headerRow.findIndex(h => keywords.some(k => h.includes(k)));
      };

      const sttIdx = findColIdx(['stt', 'so thu tu', 'tt']);
      const idIdx = findColIdx(['ma thieu nhi', 'ma tn', 'ma hoc sinh', 'ma', 'id']);
      const holyIdx = findColIdx(['ten thanh', 'bon mang', 'holy']);
      const nameIdx = findColIdx(['ho va ten', 'ho ten', 'ho ten (*)', 'ten', 'full name']);
      const genderIdx = findColIdx(['gioi tinh', 'gioi', 'phai', 'gender']);
      const birthIdx = findColIdx(['ngay sinh', 'nam sinh', 'birth']);
      const noteIdx = findColIdx(['ghi chu', 'vai tro', 'chuc vu', 'role', 'note']);
      const parentIdx = findColIdx(['phu huynh', 'cha me', 'ten phu huynh', 'parent']);
      const phoneIdx = findColIdx(['so dien thoai', 'sdt', 'dien thoai', 'phone']);
      const addressIdx = findColIdx(['dia chi', 'giao ho', 'address']);

      const parsed = [];
      const cls = classDatabase.find(c => c.id === importClassId);
      const code = (cls ? cls.id : 'DBKT').replace('CLASS_', '');

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row.length === 0) continue;

        let fullName = (nameIdx !== -1 && row[nameIdx] !== undefined) ? String(row[nameIdx]).trim() : '';
        if (!fullName && row[3]) fullName = String(row[3]).trim();
        if (!fullName && row[2] && isNaN(row[2])) fullName = String(row[2]).trim();

        if (!fullName) continue;

        let id = (idIdx !== -1 && row[idIdx]) ? String(row[idIdx]).trim() : '';
        if (!id) {
          id = `TN-${code}-${String(parsed.length + 1).padStart(2, '0')}`;
        }

        let holyName = (holyIdx !== -1 && row[holyIdx]) ? String(row[holyIdx]).trim() : '';
        let gender = (genderIdx !== -1 && row[genderIdx]) ? String(row[genderIdx]).trim() : 'Nam';
        if (gender.toLowerCase().includes('nu') || gender.toLowerCase().includes('nữ') || gender === 'F') {
          gender = 'Nữ';
        } else {
          gender = 'Nam';
        }

        let birthDate = (birthIdx !== -1 && row[birthIdx]) ? String(row[birthIdx]).trim() : '';
        if (typeof row[birthIdx] === 'number') {
          const dateObj = new Date((row[birthIdx] - 25569) * 86400 * 1000);
          if (!isNaN(dateObj.getTime())) {
            birthDate = `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${dateObj.getFullYear()}`;
          }
        }

        let note = (noteIdx !== -1 && row[noteIdx]) ? String(row[noteIdx]).trim() : 'Đang theo học';
        let parentName = (parentIdx !== -1 && row[parentIdx]) ? String(row[parentIdx]).trim() : '';
        let parentPhone = (phoneIdx !== -1 && row[phoneIdx]) ? String(row[phoneIdx]).trim() : '';
        let address = (addressIdx !== -1 && row[addressIdx]) ? String(row[addressIdx]).trim() : '';

        parsed.push({
          stt: parsed.length + 1,
          id: id,
          holyName: holyName,
          fullName: fullName,
          gender: gender,
          birthDate: birthDate,
          note: note || 'Đang theo học',
          parentName: parentName,
          parentPhone: parentPhone,
          address: address
        });
      }

      if (parsed.length === 0) {
        showToast('Không tìm thấy dòng dữ liệu thiếu nhi hợp lệ trong file!');
        if (statusText) statusText.textContent = 'Không có dữ liệu hợp lệ!';
        return;
      }

      pendingImportStudents = parsed;

      // Render bảng Preview
      if (tbody) {
        tbody.innerHTML = parsed.map((s, idx) => `
          <tr>
            <td style="text-align: center; font-weight: 700; color: #64748b;">${idx + 1}</td>
            <td><span class="student-id-badge">${s.id}</span></td>
            <td><span class="student-holy-name">${s.holyName || '-'}</span></td>
            <td><strong style="color: #0f172a;">${s.fullName}</strong></td>
            <td style="text-align: center; font-weight: 700; color: ${s.gender === 'Nam' ? '#1d4ed8' : '#be185d'};">
              ${s.gender === 'Nam' ? '♂ Nam' : '♀ Nữ'}
            </td>
            <td style="text-align: center; color: #475569;">${s.birthDate || '-'}</td>
            <td><span class="student-note-tag">${s.note}</span></td>
            <td>${s.parentName || '-'}</td>
            <td>${s.parentPhone || '-'}</td>
          </tr>
        `).join('');
      }

      if (countDisplay) countDisplay.textContent = parsed.length;
      if (previewBox) previewBox.style.display = 'block';
      if (statusText) statusText.textContent = `File: ${file.name} (${parsed.length} em)`;

      if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.style.cursor = 'pointer';
        confirmBtn.style.opacity = '1';
      }

      showToast(`Đã đọc được ${parsed.length} em thiếu nhi từ file Excel!`);
    } catch (err) {
      console.error('Lỗi phân tích Excel:', err);
      showToast('Lỗi khi đọc file Excel: ' + err.message);
      if (statusText) statusText.textContent = 'Lỗi đọc file Excel!';
    }
  };
  reader.readAsArrayBuffer(file);
}

async function confirmStudentExcelImport() {
  if (!pendingImportStudents || pendingImportStudents.length === 0) {
    showToast('Chưa có dữ liệu thiếu nhi để nhập!');
    return;
  }

  const cls = classDatabase.find(c => c.id === importClassId);
  if (!cls) return;

  const modeRadio = document.querySelector('input[name="importModeRadio"]:checked');
  const isReplace = (modeRadio && modeRadio.value === 'replace');

  let finalStudents = [];
  if (isReplace) {
    finalStudents = pendingImportStudents.map((s, idx) => ({ ...s, stt: idx + 1 }));
  } else {
    const existing = getClassStudents(cls);
    finalStudents = [...existing, ...pendingImportStudents].map((s, idx) => ({ ...s, stt: idx + 1 }));
  }

  cls.students = finalStudents;
  cls.studentCount = finalStudents.length;

  saveClassesDatabase();
  renderClassesView();
  renderBlockFilterPillCounts();

  // Đồng bộ lưu hàng loạt vào MySQL Database
  if (typeof API !== 'undefined' && API.isOnline) {
    const res = await API.importStudents(cls.id, pendingImportStudents, isReplace);
    if (res && res.success) {
      console.log('Đã nạp toàn bộ thiếu nhi vào MySQL CSDL thành công!');
    }
  }

  showToast(`Đã nhập thành công ${pendingImportStudents.length} em thiếu nhi vào lớp ${cls.name}!`);
  closeStudentExcelImportModal();

  // Làm mới Roster Modal nếu đang mở
  const rosterModal = document.getElementById('classStudentsModal');
  if (rosterModal && rosterModal.style.display !== 'none') {
    openClassStudentsRosterModal(cls.id);
  }
  updateStudentStatsDisplay();
  if (currentTab === 'students') renderAllStudentsView();
}

// ==========================================================================
// PHÂN HỆ QUẢN LÝ THIẾU NHI TOÀN ĐOÀN (TAB THIẾU NHI)
// ==========================================================================
function getAllStudentsFlatList() {
  const all = [];
  classDatabase.forEach(cls => {
    const list = getClassStudents(cls);
    list.forEach(s => {
      all.push({
        ...s,
        classId: cls.id,
        className: cls.name,
        classBlock: cls.block
      });
    });
  });
  return all;
}

function updateStudentStatsDisplay() {
  const all = getAllStudentsFlatList();
  const maleCount = all.filter(s => s.gender === 'Nam').length;
  const femaleCount = all.filter(s => s.gender === 'Nữ').length;

  if (studentStatTotalCount) studentStatTotalCount.textContent = all.length;
  if (studentStatMaleCount) studentStatMaleCount.textContent = maleCount;
  if (studentStatFemaleCount) studentStatFemaleCount.textContent = femaleCount;
  if (studentStatClassesCount) studentStatClassesCount.textContent = classDatabase.length;
  if (sidebarStudentCount) sidebarStudentCount.textContent = all.length;
}

function populateStudentClassFilter() {
  if (!filterStudentClassSelect) return;
  const currentVal = filterStudentClassSelect.value;
  const blockVal = filterStudentBlockSelect ? filterStudentBlockSelect.value : 'all';

  let classes = [...classDatabase];
  if (blockVal !== 'all') {
    classes = classes.filter(c => c.block === blockVal);
  }
  classes = sortClassesList(classes);

  filterStudentClassSelect.innerHTML = '<option value="all">Tất cả các lớp</option>' + 
    classes.map(c => `<option value="${c.id}">${c.name} (${c.block})</option>`).join('');

  if (classes.some(c => c.id === currentVal)) {
    filterStudentClassSelect.value = currentVal;
  } else {
    filterStudentClassSelect.value = 'all';
  }
}

function renderAllStudentsView() {
  updateStudentStatsDisplay();
  populateStudentClassFilter();

  const query = allStudentsSearchInput ? allStudentsSearchInput.value.trim() : '';
  const qNorm = removeVietnameseTones(query.toLowerCase());
  const blockVal = filterStudentBlockSelect ? filterStudentBlockSelect.value : 'all';
  const classVal = filterStudentClassSelect ? filterStudentClassSelect.value : 'all';
  const genderVal = filterStudentGenderSelect ? filterStudentGenderSelect.value : 'all';

  let list = getAllStudentsFlatList();

  if (blockVal !== 'all') {
    list = list.filter(s => s.classBlock === blockVal);
  }
  if (classVal !== 'all') {
    list = list.filter(s => s.classId === classVal);
  }
  if (genderVal !== 'all') {
    list = list.filter(s => s.gender === genderVal);
  }

  if (query) {
    list = list.filter(s => {
      const holyNorm = removeVietnameseTones(s.holyName || '');
      const nameNorm = removeVietnameseTones(s.fullName || '');
      const idNorm = (s.id || '').toLowerCase();
      const parentNorm = removeVietnameseTones(s.parentName || '');
      const phoneNorm = (s.parentPhone || '').toLowerCase();
      const noteNorm = removeVietnameseTones(s.note || '');
      const classNorm = removeVietnameseTones(s.className || '');
      const addressNorm = removeVietnameseTones(s.address || '');

      return holyNorm.includes(qNorm) || nameNorm.includes(qNorm) || idNorm.includes(qNorm) ||
             parentNorm.includes(qNorm) || phoneNorm.includes(qNorm) || noteNorm.includes(qNorm) ||
             classNorm.includes(qNorm) || addressNorm.includes(qNorm);
    });
  }

  if (allStudentsDisplayCount) allStudentsDisplayCount.textContent = list.length;

  if (!allStudentsTableBody) return;

  if (list.length === 0) {
    allStudentsTableBody.innerHTML = '';
    if (allStudentsNotFoundState) allStudentsNotFoundState.style.display = 'block';
    return;
  }

  if (allStudentsNotFoundState) allStudentsNotFoundState.style.display = 'none';

  allStudentsTableBody.innerHTML = list.map((s, idx) => `
    <tr>
      <td style="text-align: center; font-weight: 700; color: #64748b;">${idx + 1}</td>
      <td><span class="student-id-badge">${s.id}</span></td>
      <td><span class="student-holy-name">${s.holyName || '-'}</span></td>
      <td><strong style="color: #0f172a; font-size: 0.92rem;">${s.fullName}</strong></td>
      <td style="text-align: center; font-weight: 700; color: ${s.gender === 'Nam' ? '#1d4ed8' : '#be185d'};">
        ${s.gender === 'Nam' ? '♂ Nam' : '♀ Nữ'}
      </td>
      <td style="text-align: center; color: #475569; font-size: 0.85rem;">${s.birthDate || '-'}</td>
      <td>
        <span class="student-class-chip" style="background: #f1f5f9; color: #1e293b; font-weight: 700; padding: 0.25rem 0.6rem; border-radius: 6px; font-size: 0.82rem; border: 1px solid #e2e8f0; display: inline-block;">
          <i class="fa-solid fa-school" style="color: #059669; margin-right: 3px;"></i> ${s.className || '-'}
        </span>
      </td>
      <td><span class="student-note-tag">${s.note || 'Đang theo học'}</span></td>
      <td>
        <div style="font-size: 0.84rem; color: #1e293b; font-weight: 600;">${s.parentName || '-'}</div>
        ${s.parentPhone ? `<div style="font-size: 0.78rem; color: #64748b;"><i class="fa-solid fa-phone" style="font-size: 0.7rem; color: #059669;"></i> ${s.parentPhone}</div>` : ''}
      </td>
      <td style="text-align: center;">
        <div class="roster-action-btns" style="justify-content: center; display: flex; gap: 0.35rem;">
          <button class="btn-roster-edit btn-all-student-edit" data-student-id="${s.id}" data-class-id="${s.classId}" title="Chỉnh sửa thông tin">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="btn-roster-del btn-all-student-del" data-student-id="${s.id}" data-class-id="${s.classId}" title="Xóa khỏi danh sách">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  // Gắn sự kiện sửa / xóa cho bảng toàn bộ thiếu nhi
  allStudentsTableBody.querySelectorAll('.btn-all-student-edit').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const sId = btn.getAttribute('data-student-id');
      const cId = btn.getAttribute('data-class-id');
      openEditStudentModal(sId, cId);
    };
  });

  allStudentsTableBody.querySelectorAll('.btn-all-student-del').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const sId = btn.getAttribute('data-student-id');
      const cId = btn.getAttribute('data-class-id');
      deleteStudentFromClass(sId, cId);
    };
  });
}

function exportAllStudentsDatabaseToExcel() {
  if (typeof XLSX === 'undefined') {
    showToast('Thư viện Excel đang tải, vui lòng thử lại sau vài giây!');
    return;
  }
  const all = getAllStudentsFlatList();
  if (all.length === 0) {
    showToast('Chưa có dữ liệu thiếu nhi để xuất file Excel!');
    return;
  }

  const data = all.map((s, idx) => ({
    'STT': idx + 1,
    'Mã Thiếu Nhi': s.id || '',
    'Tên Thánh (Bổn Mạng)': s.holyName || '',
    'Họ và Tên (*)': s.fullName || '',
    'Giới Tính': s.gender || 'Nam',
    'Ngày Sinh (DD/MM/YYYY)': s.birthDate || '',
    'Lớp Học': s.className || '',
    'Khối Giáo Lý': s.classBlock || '',
    'Ghi Chú / Vai Trò': s.note || 'Đang theo học',
    'Tên Phụ Huynh (Cha/Mẹ)': s.parentName || '',
    'Số Điện Thoại Phụ Huynh': s.parentPhone || '',
    'Địa Chỉ / Giáo Họ': s.address || ''
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'ToanDoanThieuNhi');
  XLSX.writeFile(wb, `Danh_Sach_Thieu_Nhi_Toan_Doan_TanMy_2026_2027.xlsx`);
  showToast('Đã xuất toàn bộ danh sách thiếu nhi ra file Excel!');
}

// ==========================================================================
// THIẾT LẬP TẤT CẢ SỰ KIỆN (EVENT LISTENERS)
// ==========================================================================
function setupEventListeners() {
  // 1. Sidebar & Menu Tab Navigation
  if (navItemNews) {
    navItemNews.addEventListener('click', () => switchTab('news'));
  }
  if (navItemGlv) {
    navItemGlv.addEventListener('click', () => switchTab('glv'));
  }
  if (navItemClasses) {
    navItemClasses.addEventListener('click', () => switchTab('classes'));
  }
  if (navItemStudents) {
    navItemStudents.addEventListener('click', () => switchTab('students'));
  }
  if (navItemDocs) {
    navItemDocs.addEventListener('click', () => switchTab('docs'));
  }
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', openMobileSidebar);
  }
  const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
  if (sidebarToggleBtn) {
    sidebarToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSidebarCollapse();
    });
  }
  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener('click', closeMobileSidebar);
  }
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeMobileSidebar);
  }

  // Tiện ích nhanh trên sidebar
  if (sidebarAddNewsBtn) {
    sidebarAddNewsBtn.addEventListener('click', () => {
      closeMobileSidebar();
      switchTab('news');
      openNewsEditModal();
    });
  }
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
  if (sidebarExportGlvBtn) {
    sidebarExportGlvBtn.addEventListener('click', () => {
      closeMobileSidebar();
      exportDatabaseToExcel();
    });
  }
  if (sidebarViewAllClassesBtn) {
    sidebarViewAllClassesBtn.addEventListener('click', () => {
      closeMobileSidebar();
      const allClassesModal = document.getElementById('allClassesModal');
      if (allClassesModal) {
        allClassesModal.style.display = 'flex';
        renderAllClassesTable();
      }
    });
  }
  if (sidebarAddClassBtn) {
    sidebarAddClassBtn.addEventListener('click', () => {
      closeMobileSidebar();
      switchTab('classes');
      openEditClassModal();
    });
  }
  if (sidebarExportClassesBtn) {
    sidebarExportClassesBtn.addEventListener('click', () => {
      closeMobileSidebar();
      exportClassesDatabaseToExcel();
    });
  }
  if (sidebarAddStudentBtn) {
    sidebarAddStudentBtn.addEventListener('click', () => {
      closeMobileSidebar();
      switchTab('students');
      const firstClass = classDatabase[0];
      openEditStudentModal(null, firstClass ? firstClass.id : null);
    });
  }
  if (sidebarImportAllStudentsBtn) {
    sidebarImportAllStudentsBtn.addEventListener('click', () => {
      closeMobileSidebar();
      switchTab('students');
      const firstClass = classDatabase[0];
      openStudentExcelImportModal(firstClass ? firstClass.id : null);
    });
  }
  if (sidebarExportAllStudentsBtn) {
    sidebarExportAllStudentsBtn.addEventListener('click', () => {
      closeMobileSidebar();
      exportAllStudentsDatabaseToExcel();
    });
  }
  if (sidebarAddDocBtn) {
    sidebarAddDocBtn.addEventListener('click', () => {
      closeMobileSidebar();
      switchTab('docs');
      openDocEditModal();
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
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      if (val.length > 0) {
        if (clearSearchBtn) clearSearchBtn.style.display = 'flex';
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          const suggs = getSuggestions(val);
          renderSuggestions(suggs);
        }, 150);
      } else {
        if (clearSearchBtn) clearSearchBtn.style.display = 'none';
        if (suggestionsBox) suggestionsBox.style.display = 'none';
      }
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        if (suggestionsBox) suggestionsBox.style.display = 'none';
        executeSearch(searchInput.value);
      }
    });
  }

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-card')) {
      if (suggestionsBox) suggestionsBox.style.display = 'none';
    }
  });

  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      if (suggestionsBox) suggestionsBox.style.display = 'none';
      if (searchInput) executeSearch(searchInput.value);
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      clearSearchBtn.style.display = 'none';
      if (suggestionsBox) suggestionsBox.style.display = 'none';
      showWelcomeState();
    });
  }

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
      if (searchInput) searchInput.value = q;
      if (clearSearchBtn) clearSearchBtn.style.display = 'flex';
      executeSearch(q);
    });
  });

  // Thao tác trên thẻ GLV
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  if (editCurrentGlvBtn) {
    editCurrentGlvBtn.addEventListener('click', () => {
      if (currentDisplayedGLV) {
        openEditModal(currentDisplayedGLV.id);
      }
    });
  }

  if (copyBtn) {
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
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      if (clearSearchBtn) clearSearchBtn.style.display = 'none';
      showWelcomeState();
    });
  }

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

  // 6. Sự kiện Bảng Danh Sách Lớp Học (All Classes Modal)
  const allClassesModal = document.getElementById('allClassesModal');
  const closeClassesModalBtn = document.getElementById('closeClassesModalBtn');
  const modalToolbarAddClassBtn = document.getElementById('modalToolbarAddClassBtn');
  const exportClassesTableExcelBtn = document.getElementById('exportClassesTableExcelBtn');
  const modalFilterClassInput = document.getElementById('modalFilterClassInput');
  const modalFilterClassBlockSelect = document.getElementById('modalFilterClassBlockSelect');

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

  // 8.1 Sự kiện Nhập Excel Thiếu Nhi (Student Excel Import)
  const rosterImportExcelBtn = document.getElementById('rosterImportExcelBtn');
  const rosterImportFileInput = document.getElementById('rosterImportFileInput');
  const studentExcelDropzone = document.getElementById('studentExcelDropzone');
  const btnDownloadStudentTemplate = document.getElementById('btnDownloadStudentTemplate');
  const closeImportExcelModalBtn = document.getElementById('closeImportExcelModalBtn');
  const cancelImportExcelBtn = document.getElementById('cancelImportExcelBtn');
  const btnConfirmImportExcel = document.getElementById('btnConfirmImportExcel');
  const importExcelPreviewModal = document.getElementById('importExcelPreviewModal');

  if (rosterImportExcelBtn) {
    rosterImportExcelBtn.addEventListener('click', () => {
      openStudentExcelImportModal(currentRosterClassId);
    });
  }

  if (btnDownloadStudentTemplate) {
    btnDownloadStudentTemplate.addEventListener('click', () => {
      const cls = classDatabase.find(c => c.id === currentRosterClassId || c.id === importClassId);
      downloadStudentExcelTemplate(cls);
    });
  }

  if (rosterImportFileInput) {
    rosterImportFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        parseStudentExcelFile(e.target.files[0]);
      }
    });
  }

  if (studentExcelDropzone && rosterImportFileInput) {
    studentExcelDropzone.addEventListener('click', () => {
      rosterImportFileInput.click();
    });

    studentExcelDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      studentExcelDropzone.style.background = '#d1fae5';
      studentExcelDropzone.style.borderColor = '#047857';
    });

    studentExcelDropzone.addEventListener('dragleave', () => {
      studentExcelDropzone.style.background = '#ecfdf5';
      studentExcelDropzone.style.borderColor = '#059669';
    });

    studentExcelDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      studentExcelDropzone.style.background = '#ecfdf5';
      studentExcelDropzone.style.borderColor = '#059669';
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        parseStudentExcelFile(e.dataTransfer.files[0]);
      }
    });
  }

  if (closeImportExcelModalBtn) {
    closeImportExcelModalBtn.addEventListener('click', closeStudentExcelImportModal);
  }
  if (cancelImportExcelBtn) {
    cancelImportExcelBtn.addEventListener('click', closeStudentExcelImportModal);
  }
  if (btnConfirmImportExcel) {
    btnConfirmImportExcel.addEventListener('click', confirmStudentExcelImport);
  }
  if (importExcelPreviewModal) {
    importExcelPreviewModal.addEventListener('click', (e) => {
      if (e.target === importExcelPreviewModal) closeStudentExcelImportModal();
    });
  }

  // 8.2 Sự kiện Tab Thiếu Nhi Toàn Đoàn
  if (allStudentsSearchInput) {
    let studentSearchDebounce;
    allStudentsSearchInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      if (allStudentsClearSearchBtn) {
        allStudentsClearSearchBtn.style.display = val.length > 0 ? 'flex' : 'none';
      }
      clearTimeout(studentSearchDebounce);
      studentSearchDebounce = setTimeout(() => {
        renderAllStudentsView();
      }, 150);
    });
  }

  if (allStudentsClearSearchBtn) {
    allStudentsClearSearchBtn.addEventListener('click', () => {
      if (allStudentsSearchInput) {
        allStudentsSearchInput.value = '';
        allStudentsSearchInput.focus();
      }
      allStudentsClearSearchBtn.style.display = 'none';
      renderAllStudentsView();
    });
  }

  if (filterStudentBlockSelect) {
    filterStudentBlockSelect.addEventListener('change', () => {
      populateStudentClassFilter();
      renderAllStudentsView();
    });
  }

  if (filterStudentClassSelect) {
    filterStudentClassSelect.addEventListener('change', () => {
      renderAllStudentsView();
    });
  }

  if (filterStudentGenderSelect) {
    filterStudentGenderSelect.addEventListener('change', () => {
      renderAllStudentsView();
    });
  }

  if (tabStudentsAddBtn) {
    tabStudentsAddBtn.addEventListener('click', () => {
      const firstClass = classDatabase[0];
      openEditStudentModal(null, firstClass ? firstClass.id : null);
    });
  }

  if (tabStudentsImportBtn) {
    tabStudentsImportBtn.addEventListener('click', () => {
      const firstClass = classDatabase[0];
      openStudentExcelImportModal(firstClass ? firstClass.id : null);
    });
  }

  if (tabStudentsExportBtn) {
    tabStudentsExportBtn.addEventListener('click', () => {
      exportAllStudentsDatabaseToExcel();
    });
  }

  // 8.3 Sự kiện Phân hệ Sổ Điểm Điện Tử & Chuyên Cần
  if (btnOpenGradebookFromDetail) {
    btnOpenGradebookFromDetail.addEventListener('click', () => {
      if (classDetailModal) classDetailModal.style.display = 'none';
      openClassGradebookModal(currentDisplayedClass ? currentDisplayedClass.id : null);
    });
  }

  if (rosterOpenGradebookBtn) {
    rosterOpenGradebookBtn.addEventListener('click', () => {
      if (classStudentsModal) classStudentsModal.style.display = 'none';
      openClassGradebookModal(currentRosterClassId);
    });
  }

  if (tabStudentsGradebookBtn) {
    tabStudentsGradebookBtn.addEventListener('click', () => {
      const firstClass = classDatabase[0];
      openClassGradebookModal(firstClass ? firstClass.id : null);
    });
  }

  if (gradebookClassSelect) {
    gradebookClassSelect.addEventListener('change', (e) => {
      currentGradebookClassId = e.target.value;
      const cls = classDatabase.find(c => c.id === currentGradebookClassId);
      if (gradebookClassTitle) gradebookClassTitle.textContent = cls ? cls.name : 'Lớp Học';
      renderGradebookTable();
    });
  }

  if (gradebookSemesterTabs) {
    gradebookSemesterTabs.querySelectorAll('.semester-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        gradebookSemesterTabs.querySelectorAll('.semester-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentGradebookSemester = btn.getAttribute('data-semester') || 'hk1';
        renderGradebookTable();
      });
    });
  }

  if (gradebookSearchInput) {
    gradebookSearchInput.addEventListener('input', () => {
      renderGradebookTable();
    });
  }

  if (btnSaveGradebook) {
    btnSaveGradebook.addEventListener('click', saveClassGradebook);
  }

  if (btnImportGradebookExcel && gradebookImportFileInput) {
    btnImportGradebookExcel.addEventListener('click', () => {
      gradebookImportFileInput.click();
    });

    gradebookImportFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        importGradebookFromExcel(e.target.files[0]);
      }
    });
  }

  if (btnExportGradebookExcel) {
    btnExportGradebookExcel.addEventListener('click', exportGradebookToExcel);
  }

  if (btnPrintGradebook) {
    btnPrintGradebook.addEventListener('click', () => {
      window.print();
    });
  }

  if (btnPrintSingleReportCard) {
    btnPrintSingleReportCard.addEventListener('click', () => {
      window.print();
    });
  }

  // 10. Sự kiện Phân hệ Thông Báo & Tin Tức
  const newsSearchInput = document.getElementById('newsSearchInput');
  const newsClearSearchBtn = document.getElementById('newsClearSearchBtn');
  const newsFilterPills = document.getElementById('newsFilterPills');
  const btnAddNews = document.getElementById('btnAddNews');
  const resetNewsFilterBtn = document.getElementById('resetNewsFilterBtn');
  const newsForm = document.getElementById('newsForm');
  const btnPrintNewsDetail = document.getElementById('btnPrintNewsDetail');

  if (newsSearchInput) {
    newsSearchInput.addEventListener('input', renderNewsView);
  }
  if (newsClearSearchBtn) {
    newsClearSearchBtn.addEventListener('click', () => {
      if (newsSearchInput) {
        newsSearchInput.value = '';
        newsSearchInput.focus();
      }
      renderNewsView();
    });
  }
  if (newsFilterPills) {
    newsFilterPills.querySelectorAll('.pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        newsFilterPills.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentNewsCategoryFilter = btn.getAttribute('data-category');
        renderNewsView();
      });
    });
  }
  if (resetNewsFilterBtn) {
    resetNewsFilterBtn.addEventListener('click', () => {
      if (newsSearchInput) newsSearchInput.value = '';
      currentNewsCategoryFilter = 'all';
      if (newsFilterPills) {
        newsFilterPills.querySelectorAll('.pill-btn').forEach(b => {
          b.classList.toggle('active', b.getAttribute('data-category') === 'all');
        });
      }
      renderNewsView();
    });
  }
  if (btnAddNews) {
    btnAddNews.addEventListener('click', () => openNewsEditModal());
  }
  if (newsForm) {
    newsForm.addEventListener('submit', handleNewsFormSubmit);
  }
  if (btnPrintNewsDetail) {
    btnPrintNewsDetail.addEventListener('click', () => window.print());
  }

  // 11. Sự kiện Phân hệ Kho Tài Liệu
  const docsSearchInput = document.getElementById('docsSearchInput');
  const docsClearSearchBtn = document.getElementById('docsClearSearchBtn');
  const docsFilterPills = document.getElementById('docsFilterPills');
  const btnAddDoc = document.getElementById('btnAddDoc');
  const resetDocsFilterBtn = document.getElementById('resetDocsFilterBtn');
  const docForm = document.getElementById('docForm');

  if (docsSearchInput) {
    docsSearchInput.addEventListener('input', renderDocsView);
  }
  if (docsClearSearchBtn) {
    docsClearSearchBtn.addEventListener('click', () => {
      if (docsSearchInput) {
        docsSearchInput.value = '';
        docsSearchInput.focus();
      }
      renderDocsView();
    });
  }
  if (docsFilterPills) {
    docsFilterPills.querySelectorAll('.pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        docsFilterPills.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentDocsCategoryFilter = btn.getAttribute('data-category');
        renderDocsView();
      });
    });
  }
  if (resetDocsFilterBtn) {
    resetDocsFilterBtn.addEventListener('click', () => {
      if (docsSearchInput) docsSearchInput.value = '';
      currentDocsCategoryFilter = 'all';
      if (docsFilterPills) {
        docsFilterPills.querySelectorAll('.pill-btn').forEach(b => {
          b.classList.toggle('active', b.getAttribute('data-category') === 'all');
        });
      }
      renderDocsView();
    });
  }
  if (btnAddDoc) {
    btnAddDoc.addEventListener('click', () => openDocEditModal());
  }
  if (docForm) {
    docForm.addEventListener('submit', handleDocFormSubmit);
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

async function deleteGLV(glvId) {
  if (currentUserRole !== 'admin') {
    showToast('Chỉ Quản Trị Viên (Admin) mới có quyền xóa Giáo Lý Viên!');
    return;
  }

  const glv = glvDatabase.find(item => item.id.toUpperCase() === glvId.toUpperCase());
  if (!glv) return;

  const confirmed = await showConfirmDialog({
    title: 'Xác Nhận Xóa Giáo Lý Viên',
    message: 'Bạn có chắc chắn muốn xóa Giáo Lý Viên này khỏi hệ thống không?',
    itemName: `${glv.id} - ${glv.holyName ? glv.holyName + ' ' : ''}${glv.lastName} ${glv.firstName}`,
    confirmText: 'Xác Nhận Xóa',
    type: 'danger',
    iconClass: 'fa-solid fa-trash-can'
  });

  if (!confirmed) return;

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
  const confirmed = await showConfirmDialog({
    title: 'Làm Mới & Tải Lại Dữ Liệu',
    message: 'Bạn có chắc chắn muốn làm mới và tải lại toàn bộ dữ liệu từ Cơ Sở Dữ Liệu MySQL không?',
    itemName: 'Database: giaoly_tanmy_db',
    note: 'ℹ️ Hệ thống sẽ xóa bộ nhớ đệm và kết nối lại máy chủ MySQL XAMPP.',
    confirmText: 'Đồng Ý Làm Mới',
    type: 'warning',
    iconClass: 'fa-solid fa-rotate'
  });

  if (!confirmed) return;

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

// ==========================================================================
// PHÂN HỆ SỔ ĐIỂM ĐIỆN TỬ & CHUYÊN CẦN (GRADEBOOK & REPORT CARDS)
// ==========================================================================
let currentGradebookClassId = null;
let currentGradebookSemester = 'hk1';

function getStudentGrades(student) {
  if (!student.grades) {
    // Khởi tạo điểm mặc định chuẩn mực
    const sIdNum = parseInt((student.id || '').replace(/\D/g, '')) || 1;
    const baseOral = Math.min(10, Math.max(7, 8 + (sIdNum % 3) * 0.5));
    const base15m = Math.min(10, Math.max(7, 8.5 + ((sIdNum + 1) % 3) * 0.5));
    const base1p = Math.min(10, Math.max(7, 8 + ((sIdNum + 2) % 3) * 0.5));
    const baseExam = Math.min(10, Math.max(7, 8.5 + (sIdNum % 2) * 0.5));

    student.grades = {
      hk1: {
        t5: 10,
        cn: 10,
        gl: 9.5,
        oral: baseOral,
        m15: base15m,
        p1: base1p,
        exam: baseExam
      },
      hk2: {
        t5: 10,
        cn: 9.5,
        gl: 9.5,
        oral: Math.min(10, baseOral + 0.5),
        m15: base15m,
        p1: Math.min(10, base1p + 0.5),
        exam: Math.min(10, baseExam + 0.5)
      }
    };
  }
  return student.grades;
}

function calcAttendanceAvg(t5, cn, gl) {
  const vT5 = parseFloat(t5);
  const vCN = parseFloat(cn);
  const vGL = parseFloat(gl);

  const validCount = (!isNaN(vT5) ? 1 : 0) + (!isNaN(vCN) ? 2 : 0) + (!isNaN(vGL) ? 2 : 0);
  if (validCount === 0) return null;

  const sum = (isNaN(vT5) ? 0 : vT5) + (isNaN(vCN) ? 0 : vCN * 2) + (isNaN(vGL) ? 0 : vGL * 2);
  return Math.round((sum / validCount) * 10) / 10;
}

function calcSubjectAvg(oral, m15, p1, exam) {
  const vOral = parseFloat(oral);
  const v15m = parseFloat(m15);
  const vP1 = parseFloat(p1);
  const vExam = parseFloat(exam);

  let totalWeight = 0;
  let totalScore = 0;

  if (!isNaN(vOral)) { totalScore += vOral * 1; totalWeight += 1; }
  if (!isNaN(v15m)) { totalScore += v15m * 1; totalWeight += 1; }
  if (!isNaN(vP1)) { totalScore += vP1 * 2; totalWeight += 2; }
  if (!isNaN(vExam)) { totalScore += vExam * 3; totalWeight += 3; }

  if (totalWeight === 0) return null;
  return Math.round((totalScore / totalWeight) * 10) / 10;
}

function calcYearAvg(hk1, hk2) {
  const v1 = parseFloat(hk1);
  const v2 = parseFloat(hk2);
  if (isNaN(v1) && isNaN(v2)) return null;
  if (isNaN(v1)) return v2;
  if (isNaN(v2)) return v1;
  return Math.round(((v1 + v2 * 2) / 3) * 10) / 10;
}

function getRankGrade(score) {
  if (score === null || isNaN(score)) return { text: 'Chưa xếp loại', cls: 'rank-tb' };
  if (score >= 8.0) return { text: 'Giỏi', cls: 'rank-gioi' };
  if (score >= 6.5) return { text: 'Khá', cls: 'rank-kha' };
  if (score >= 5.0) return { text: 'Trung Bình', cls: 'rank-tb' };
  return { text: 'Yếu', cls: 'rank-yeu' };
}

function getAttendanceRank(score) {
  if (score === null || isNaN(score)) return { text: 'Đang theo dõi', cls: 'rank-tb' };
  if (score >= 9.0) return { text: 'Xuất Sắc', cls: 'rank-gioi' };
  if (score >= 8.0) return { text: 'Tốt', cls: 'rank-gioi' };
  if (score >= 6.5) return { text: 'Khá', cls: 'rank-kha' };
  if (score >= 5.0) return { text: 'Đạt', cls: 'rank-tb' };
  return { text: 'Cần Cố Gắng', cls: 'rank-yeu' };
}

function openClassGradebookModal(classId, semester = 'hk1') {
  if (!classDatabase || classDatabase.length === 0) {
    showToast('Chưa có dữ liệu lớp học!');
    return;
  }

  currentGradebookClassId = classId || classDatabase[0].id;
  currentGradebookSemester = semester || 'hk1';

  // Nạp danh sách chọn lớp
  if (gradebookClassSelect) {
    gradebookClassSelect.innerHTML = classDatabase.map(c => `
      <option value="${c.id}" ${c.id === currentGradebookClassId ? 'selected' : ''}>
        ${c.name} (${c.block || 'Chưa phân khối'})
      </option>
    `).join('');
  }

  const cls = classDatabase.find(c => c.id === currentGradebookClassId);
  if (gradebookClassTitle) {
    gradebookClassTitle.textContent = cls ? cls.name : 'Lớp Học';
  }

  // Active tab học kỳ
  if (gradebookSemesterTabs) {
    gradebookSemesterTabs.querySelectorAll('.semester-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-semester') === currentGradebookSemester);
    });
  }

  if (gradebookSearchInput) gradebookSearchInput.value = '';

  renderGradebookTable();

  if (classGradebookModal) {
    classGradebookModal.style.display = 'flex';
  }
}

function renderGradebookTable() {
  const cls = classDatabase.find(c => c.id === currentGradebookClassId);
  if (!cls || !gradebookTableHead || !gradebookTableBody) return;

  const students = getClassStudents(cls);
  const sem = currentGradebookSemester;
  const kw = (gradebookSearchInput ? gradebookSearchInput.value : '').toLowerCase().trim();

  // Lọc theo từ khóa tìm kiếm
  const filtered = students.filter(s => {
    if (!kw) return true;
    const matchName = (s.fullName || '').toLowerCase().includes(kw);
    const matchHoly = (s.holyName || '').toLowerCase().includes(kw);
    const matchId = (s.id || '').toLowerCase().includes(kw);
    return matchName || matchHoly || matchId;
  });

  // 1. Render Table Head
  if (sem === 'hk1' || sem === 'hk2') {
    const semName = sem === 'hk1' ? 'HỌC KỲ 1' : 'HỌC KỲ 2';
    gradebookTableHead.innerHTML = `
      <tr>
        <th rowspan="2" style="width: 45px; text-align: center;">STT</th>
        <th rowspan="2" style="width: 110px;">Mã TN</th>
        <th rowspan="2" style="width: 110px;">Tên Thánh</th>
        <th rowspan="2" style="min-width: 170px;">Họ và Tên</th>
        <th colspan="4" class="th-group-header th-group-att"><i class="fa-solid fa-church"></i> ĐIỂM CHUYÊN CẦN (${semName})</th>
        <th colspan="5" class="th-group-header th-group-exam"><i class="fa-solid fa-book-bible"></i> KIỂM TRA GIÁO LÝ (${semName})</th>
        <th rowspan="2" style="width: 110px; text-align: center;">Xếp Loại</th>
      </tr>
      <tr>
        <th class="th-group-att" style="width: 65px; text-align: center;" title="Đi Lễ Thứ 5 hàng tuần (Hệ số 1)">Lễ T5</th>
        <th class="th-group-att" style="width: 65px; text-align: center;" title="Đi Lễ Chúa Nhật hàng tuần (Hệ số 2)">Lễ CN</th>
        <th class="th-group-att" style="width: 65px; text-align: center;" title="Đi học Giáo Lý hàng tuần (Hệ số 2)">Học GL</th>
        <th class="th-group-att" style="width: 80px; text-align: center; font-weight: 900;" title="ĐTB Chuyên Cần = (Lễ T5 + Lễ CN*2 + Học GL*2)/5">ĐTB CC</th>
        
        <th class="th-group-exam" style="width: 65px; text-align: center;" title="Điểm kiểm tra Miệng (Hệ số 1)">Miệng</th>
        <th class="th-group-exam" style="width: 65px; text-align: center;" title="Điểm kiểm tra 15 Phút (Hệ số 1)">15 Phút</th>
        <th class="th-group-exam" style="width: 65px; text-align: center;" title="Điểm kiểm tra 1 Tiết (Hệ số 2)">1 Tiết</th>
        <th class="th-group-exam" style="width: 65px; text-align: center;" title="Điểm Thi Học Kỳ (Hệ số 3)">Thi HK</th>
        <th class="th-group-exam" style="width: 80px; text-align: center; font-weight: 900;" title="ĐTB Giáo Lý = (Miệng + 15p + 1Tiet*2 + ThiHK*3)/7">ĐTB GL</th>
      </tr>
    `;
  } else {
    // Tab Tổng Kết Cả Năm
    gradebookTableHead.innerHTML = `
      <tr>
        <th style="width: 45px; text-align: center;">STT</th>
        <th style="width: 110px;">Mã TN</th>
        <th style="width: 110px;">Tên Thánh</th>
        <th style="min-width: 170px;">Họ và Tên</th>
        <th class="th-group-att" style="width: 100px; text-align: center;" title="Điểm TB Chuyên Cần cả năm">ĐTB Chuyên Cần</th>
        <th class="th-group-exam" style="width: 85px; text-align: center;" title="ĐTB Giáo Lý Học Kỳ 1">ĐTB HK1</th>
        <th class="th-group-exam" style="width: 85px; text-align: center;" title="ĐTB Giáo Lý Học Kỳ 2">ĐTB HK2</th>
        <th class="th-group-final" style="width: 100px; text-align: center; font-weight: 900;" title="ĐTB Cả Năm = (HK1 + HK2*2)/3">ĐTB Cả Năm</th>
        <th style="width: 110px; text-align: center;">Xếp Loại GL</th>
        <th style="width: 120px; text-align: center;">Xếp Loại Chuyên Cần</th>
        <th style="width: 120px; text-align: center;">Kết Quả / Bí Tích</th>
        <th style="width: 90px; text-align: center;">Phiếu Điểm</th>
      </tr>
    `;
  }

  // 2. Render Table Body
  let totalScoreGL = 0;
  let countGL = 0;
  let totalScoreCC = 0;
  let countCC = 0;
  let countGioi = 0;
  let countKha = 0;
  let countTb = 0;
  let countYeu = 0;

  if (filtered.length === 0) {
    const cols = (sem === 'final') ? 12 : 14;
    gradebookTableBody.innerHTML = `
      <tr>
        <td colspan="${cols}" style="text-align: center; padding: 2.5rem; color: #94a3b8;">
          <i class="fa-solid fa-child-reaching" style="font-size: 2rem; margin-bottom: 0.5rem; display: block; opacity: 0.5;"></i>
          ${kw ? 'Không tìm thấy thiếu nhi phù hợp với từ khóa tìm kiếm.' : 'Lớp này hiện chưa có thiếu nhi trong danh sách.'}
        </td>
      </tr>
    `;
  } else {
    gradebookTableBody.innerHTML = filtered.map((s, idx) => {
      const g = getStudentGrades(s);
      const gSem = g[sem] || {};

      // Tính điểm HK1 & HK2
      const attAvg1 = calcAttendanceAvg(g.hk1?.t5, g.hk1?.cn, g.hk1?.gl);
      const subjAvg1 = calcSubjectAvg(g.hk1?.oral, g.hk1?.m15, g.hk1?.p1, g.hk1?.exam);

      const attAvg2 = calcAttendanceAvg(g.hk2?.t5, g.hk2?.cn, g.hk2?.gl);
      const subjAvg2 = calcSubjectAvg(g.hk2?.oral, g.hk2?.m15, g.hk2?.p1, g.hk2?.exam);

      if (sem === 'hk1' || sem === 'hk2') {
        const curAttAvg = (sem === 'hk1') ? attAvg1 : attAvg2;
        const curSubjAvg = (sem === 'hk1') ? subjAvg1 : subjAvg2;
        const rank = getRankGrade(curSubjAvg);

        if (curSubjAvg !== null) {
          totalScoreGL += curSubjAvg;
          countGL++;
          if (curSubjAvg >= 8.0) countGioi++;
          else if (curSubjAvg >= 6.5) countKha++;
          else if (curSubjAvg >= 5.0) countTb++;
          else countYeu++;
        }

        if (curAttAvg !== null) {
          totalScoreCC += curAttAvg;
          countCC++;
        }

        return `
          <tr data-student-id="${s.id}">
            <td style="text-align: center; color: #64748b; font-weight: 700;">${idx + 1}</td>
            <td style="font-weight: 700; color: #0284c7;">${s.id}</td>
            <td style="font-weight: 700; color: #b45309;">${s.holyName || ''}</td>
            <td style="font-weight: 700; color: #0f172a;">${s.fullName}</td>
            
            <!-- Chuyên cần inputs -->
            <td style="text-align: center;">
              <input type="number" step="0.5" min="0" max="10" class="grade-input" data-sem="${sem}" data-field="t5" value="${gSem.t5 ?? ''}" onchange="handleGradeInputChange('${s.id}', '${sem}', 't5', this.value)">
            </td>
            <td style="text-align: center;">
              <input type="number" step="0.5" min="0" max="10" class="grade-input" data-sem="${sem}" data-field="cn" value="${gSem.cn ?? ''}" onchange="handleGradeInputChange('${s.id}', '${sem}', 'cn', this.value)">
            </td>
            <td style="text-align: center;">
              <input type="number" step="0.5" min="0" max="10" class="grade-input" data-sem="${sem}" data-field="gl" value="${gSem.gl ?? ''}" onchange="handleGradeInputChange('${s.id}', '${sem}', 'gl', this.value)">
            </td>
            <td style="text-align: center;">
              <span class="grade-avg-badge grade-avg-att cell-att-avg">${curAttAvg !== null ? curAttAvg.toFixed(1) : '--'}</span>
            </td>

            <!-- Kiểm tra môn giáo lý inputs -->
            <td style="text-align: center;">
              <input type="number" step="0.5" min="0" max="10" class="grade-input" data-sem="${sem}" data-field="oral" value="${gSem.oral ?? ''}" onchange="handleGradeInputChange('${s.id}', '${sem}', 'oral', this.value)">
            </td>
            <td style="text-align: center;">
              <input type="number" step="0.5" min="0" max="10" class="grade-input" data-sem="${sem}" data-field="m15" value="${gSem.m15 ?? ''}" onchange="handleGradeInputChange('${s.id}', '${sem}', 'm15', this.value)">
            </td>
            <td style="text-align: center;">
              <input type="number" step="0.5" min="0" max="10" class="grade-input" data-sem="${sem}" data-field="p1" value="${gSem.p1 ?? ''}" onchange="handleGradeInputChange('${s.id}', '${sem}', 'p1', this.value)">
            </td>
            <td style="text-align: center;">
              <input type="number" step="0.5" min="0" max="10" class="grade-input" data-sem="${sem}" data-field="exam" value="${gSem.exam ?? ''}" onchange="handleGradeInputChange('${s.id}', '${sem}', 'exam', this.value)">
            </td>
            <td style="text-align: center;">
              <span class="grade-avg-badge grade-avg-subject cell-subj-avg">${curSubjAvg !== null ? curSubjAvg.toFixed(1) : '--'}</span>
            </td>

            <!-- Xếp loại -->
            <td style="text-align: center;">
              <span class="rank-badge ${rank.cls} cell-rank">${rank.text}</span>
            </td>
          </tr>
        `;
      } else {
        // Final Summary Row
        const finalAttAvg = calcYearAvg(attAvg1, attAvg2);
        const finalSubjAvg = calcYearAvg(subjAvg1, subjAvg2);
        const rankGL = getRankGrade(finalSubjAvg);
        const rankCC = getAttendanceRank(finalAttAvg);
        const isPass = (finalSubjAvg !== null && finalSubjAvg >= 5.0 && finalAttAvg !== null && finalAttAvg >= 5.0);

        if (finalSubjAvg !== null) {
          totalScoreGL += finalSubjAvg;
          countGL++;
          if (finalSubjAvg >= 8.0) countGioi++;
          else if (finalSubjAvg >= 6.5) countKha++;
          else if (finalSubjAvg >= 5.0) countTb++;
          else countYeu++;
        }

        if (finalAttAvg !== null) {
          totalScoreCC += finalAttAvg;
          countCC++;
        }

        return `
          <tr data-student-id="${s.id}">
            <td style="text-align: center; color: #64748b; font-weight: 700;">${idx + 1}</td>
            <td style="font-weight: 700; color: #0284c7;">${s.id}</td>
            <td style="font-weight: 700; color: #b45309;">${s.holyName || ''}</td>
            <td style="font-weight: 700; color: #0f172a;">${s.fullName}</td>
            
            <td style="text-align: center;">
              <span class="grade-avg-badge grade-avg-att">${finalAttAvg !== null ? finalAttAvg.toFixed(1) : '--'}</span>
            </td>
            <td style="text-align: center; font-weight: 700; color: #475569;">
              ${subjAvg1 !== null ? subjAvg1.toFixed(1) : '--'}
            </td>
            <td style="text-align: center; font-weight: 700; color: #475569;">
              ${subjAvg2 !== null ? subjAvg2.toFixed(1) : '--'}
            </td>
            <td style="text-align: center;">
              <span class="grade-avg-badge grade-avg-final" style="font-size: 0.95rem;">${finalSubjAvg !== null ? finalSubjAvg.toFixed(1) : '--'}</span>
            </td>
            <td style="text-align: center;">
              <span class="rank-badge ${rankGL.cls}">${rankGL.text}</span>
            </td>
            <td style="text-align: center;">
              <span class="rank-badge ${rankCC.cls}">${rankCC.text}</span>
            </td>
            <td style="text-align: center;">
              ${isPass ? '<span style="color: #059669; font-weight: 800;"><i class="fa-solid fa-circle-check"></i> Đủ ĐK Lên Lớp</span>' : '<span style="color: #dc2626; font-weight: 700;"><i class="fa-solid fa-circle-xmark"></i> Cần Cố Gắng</span>'}
            </td>
            <td style="text-align: center;">
              <button class="btn-action-icon btn-action-view" title="Xem & In Phiếu Điểm Cá Nhân" onclick="openStudentReportCard('${s.id}')">
                <i class="fa-solid fa-file-invoice"></i>
              </button>
            </td>
          </tr>
        `;
      }
    }).join('');
  }

  // 3. Cập nhật Stats Bar
  if (gbStatStudentCount) gbStatStudentCount.textContent = `${filtered.length} Em`;
  if (gbStatClassAvg) gbStatClassAvg.textContent = countGL > 0 ? (totalScoreGL / countGL).toFixed(1) : '--';
  if (gbStatAttendanceAvg) gbStatAttendanceAvg.textContent = countCC > 0 ? (totalScoreCC / countCC).toFixed(1) : '--';
  if (gbCountGioi) gbCountGioi.textContent = countGioi;
  if (gbCountKha) gbCountKha.textContent = countKha;
  if (gbCountTb) gbCountTb.textContent = countTb;
  if (gbCountYeu) gbCountYeu.textContent = countYeu;
}

function handleGradeInputChange(studentId, sem, field, value) {
  const cls = classDatabase.find(c => c.id === currentGradebookClassId);
  if (!cls) return;

  const students = getClassStudents(cls);
  const student = students.find(s => s.id === studentId);
  if (!student) return;

  const g = getStudentGrades(student);
  if (!g[sem]) g[sem] = {};

  let num = parseFloat(value);
  if (isNaN(num)) {
    g[sem][field] = null;
  } else {
    num = Math.max(0, Math.min(10, num));
    g[sem][field] = num;
  }

  // Cập nhật lại mảng students gốc của lớp
  cls.students = students;

  // Cập nhật nhanh hàng tương ứng trong bảng DOM
  const row = gradebookTableBody.querySelector(`tr[data-student-id="${studentId}"]`);
  if (row) {
    const curAttAvg = calcAttendanceAvg(g[sem]?.t5, g[sem]?.cn, g[sem]?.gl);
    const curSubjAvg = calcSubjectAvg(g[sem]?.oral, g[sem]?.m15, g[sem]?.p1, g[sem]?.exam);
    const rank = getRankGrade(curSubjAvg);

    const cellAtt = row.querySelector('.cell-att-avg');
    if (cellAtt) cellAtt.textContent = curAttAvg !== null ? curAttAvg.toFixed(1) : '--';

    const cellSubj = row.querySelector('.cell-subj-avg');
    if (cellSubj) cellSubj.textContent = curSubjAvg !== null ? curSubjAvg.toFixed(1) : '--';

    const cellRank = row.querySelector('.cell-rank');
    if (cellRank) {
      cellRank.className = `rank-badge ${rank.cls} cell-rank`;
      cellRank.textContent = rank.text;
    }
  }

  // Tự động lưu ngầm vào localStorage
  saveClassesDatabase();
}

function saveClassGradebook() {
  saveClassesDatabase();
  showToast('Đã lưu toàn bộ điểm số & chuyên cần thành công!');
}

function exportGradebookToExcel() {
  if (typeof XLSX === 'undefined') {
    showToast('Thư viện Excel đang tải, vui lòng thử lại sau giây lát!');
    return;
  }

  const cls = classDatabase.find(c => c.id === currentGradebookClassId);
  if (!cls) return;

  const students = getClassStudents(cls);
  const wb = XLSX.utils.book_new();

  // Sheet 1: Học Kỳ 1
  const hk1Data = [
    [`BẢNG ĐIỂM HỌC KỲ 1 - LỚP ${cls.name.toUpperCase()} (${cls.block}) - NIÊN KHÓA 2026-2027`],
    ['STT', 'Mã Thiếu Nhi', 'Tên Thánh', 'Họ và Tên', 'Lễ Thứ 5', 'Lễ Chúa Nhật', 'Học Giáo Lý', 'ĐTB Chuyên Cần', 'Miệng', '15 Phút', '1 Tiết', 'Thi HK1', 'ĐTB Giáo Lý HK1', 'Xếp Loại']
  ];
  students.forEach((s, idx) => {
    const g = getStudentGrades(s);
    const att = calcAttendanceAvg(g.hk1?.t5, g.hk1?.cn, g.hk1?.gl);
    const subj = calcSubjectAvg(g.hk1?.oral, g.hk1?.m15, g.hk1?.p1, g.hk1?.exam);
    const rank = getRankGrade(subj);
    hk1Data.push([
      idx + 1, s.id, s.holyName, s.fullName,
      g.hk1?.t5 ?? '', g.hk1?.cn ?? '', g.hk1?.gl ?? '', att ?? '',
      g.hk1?.oral ?? '', g.hk1?.m15 ?? '', g.hk1?.p1 ?? '', g.hk1?.exam ?? '', subj ?? '', rank.text
    ]);
  });
  const ws1 = XLSX.utils.aoa_to_sheet(hk1Data);
  XLSX.utils.book_append_sheet(wb, ws1, 'Học Kỳ 1');

  // Sheet 2: Học Kỳ 2
  const hk2Data = [
    [`BẢNG ĐIỂM HỌC KỲ 2 - LỚP ${cls.name.toUpperCase()} (${cls.block}) - NIÊN KHÓA 2026-2027`],
    ['STT', 'Mã Thiếu Nhi', 'Tên Thánh', 'Họ và Tên', 'Lễ Thứ 5', 'Lễ Chúa Nhật', 'Học Giáo Lý', 'ĐTB Chuyên Cần', 'Miệng', '15 Phút', '1 Tiết', 'Thi HK2', 'ĐTB Giáo Lý HK2', 'Xếp Loại']
  ];
  students.forEach((s, idx) => {
    const g = getStudentGrades(s);
    const att = calcAttendanceAvg(g.hk2?.t5, g.hk2?.cn, g.hk2?.gl);
    const subj = calcSubjectAvg(g.hk2?.oral, g.hk2?.m15, g.hk2?.p1, g.hk2?.exam);
    const rank = getRankGrade(subj);
    hk2Data.push([
      idx + 1, s.id, s.holyName, s.fullName,
      g.hk2?.t5 ?? '', g.hk2?.cn ?? '', g.hk2?.gl ?? '', att ?? '',
      g.hk2?.oral ?? '', g.hk2?.m15 ?? '', g.hk2?.p1 ?? '', g.hk2?.exam ?? '', subj ?? '', rank.text
    ]);
  });
  const ws2 = XLSX.utils.aoa_to_sheet(hk2Data);
  XLSX.utils.book_append_sheet(wb, ws2, 'Học Kỳ 2');

  // Sheet 3: Tổng Kết Cả Năm
  const finalData = [
    [`BẢNG TỔNG KẾT ĐIỂM CẢ NĂM - LỚP ${cls.name.toUpperCase()} - NIÊN KHÓA 2026-2027`],
    ['STT', 'Mã Thiếu Nhi', 'Tên Thánh', 'Họ và Tên', 'ĐTB Chuyên Cần', 'ĐTB HK1', 'ĐTB HK2', 'ĐTB Cả Năm', 'Xếp Loại Giáo Lý', 'Xếp Loại Chuyên Cần', 'Kết Quả']
  ];
  students.forEach((s, idx) => {
    const g = getStudentGrades(s);
    const att1 = calcAttendanceAvg(g.hk1?.t5, g.hk1?.cn, g.hk1?.gl);
    const subj1 = calcSubjectAvg(g.hk1?.oral, g.hk1?.m15, g.hk1?.p1, g.hk1?.exam);
    const att2 = calcAttendanceAvg(g.hk2?.t5, g.hk2?.cn, g.hk2?.gl);
    const subj2 = calcSubjectAvg(g.hk2?.oral, g.hk2?.m15, g.hk2?.p1, g.hk2?.exam);

    const attFinal = calcYearAvg(att1, att2);
    const subjFinal = calcYearAvg(subj1, subj2);
    const rankGL = getRankGrade(subjFinal);
    const rankCC = getAttendanceRank(attFinal);
    const isPass = (subjFinal !== null && subjFinal >= 5.0 && attFinal !== null && attFinal >= 5.0);

    finalData.push([
      idx + 1, s.id, s.holyName, s.fullName,
      attFinal ?? '', subj1 ?? '', subj2 ?? '', subjFinal ?? '',
      rankGL.text, rankCC.text, isPass ? 'Lên Lớp' : 'Cần Cố Gắng'
    ]);
  });
  const wsFinal = XLSX.utils.aoa_to_sheet(finalData);
  XLSX.utils.book_append_sheet(wb, wsFinal, 'Tổng Kết Cả Năm');

  const fileName = `So_Diem_Lop_${cls.name.replace(/\s+/g, '_')}_2026_2027.xlsx`;
  XLSX.writeFile(wb, fileName);
  showToast(`Đã xuất file Excel sổ điểm: ${fileName}`);
}

function importGradebookFromExcel(file) {
  if (!file || typeof XLSX === 'undefined') return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (!rows || rows.length < 2) {
        showToast('File Excel không có dữ liệu hợp lệ!');
        return;
      }

      const cls = classDatabase.find(c => c.id === currentGradebookClassId);
      if (!cls) return;

      const students = getClassStudents(cls);
      const sem = currentGradebookSemester === 'final' ? 'hk1' : currentGradebookSemester;

      // Tìm vị trí tiêu đề cột
      let headerRowIndex = 0;
      for (let r = 0; r < Math.min(5, rows.length); r++) {
        const rowStr = (rows[r] || []).join(' ').toLowerCase();
        if (rowStr.includes('mã') || rowStr.includes('tên') || rowStr.includes('miệng')) {
          headerRowIndex = r;
          break;
        }
      }

      const headers = (rows[headerRowIndex] || []).map(h => removeVietnameseTones(String(h || '')).toLowerCase().trim());
      const colId = headers.findIndex(h => h.includes('ma') || h.includes('id'));
      const colT5 = headers.findIndex(h => h.includes('t5') || h.includes('thu 5'));
      const colCN = headers.findIndex(h => h.includes('cn') || h.includes('chua nhat'));
      const colGL = headers.findIndex(h => h.includes('hoc gl') || h.includes('giao ly'));
      const colOral = headers.findIndex(h => h.includes('mieng'));
      const col15m = headers.findIndex(h => h.includes('15') || h.includes('15p'));
      const colP1 = headers.findIndex(h => h.includes('1 tiet') || h.includes('1tiet'));
      const colExam = headers.findIndex(h => h.includes('thi') || h.includes('thi hk'));

      let updatedCount = 0;
      for (let r = headerRowIndex + 1; r < rows.length; r++) {
        const row = rows[r];
        if (!row || row.length === 0) continue;

        const sId = colId !== -1 && row[colId] ? String(row[colId]).trim().toUpperCase() : null;
        if (!sId) continue;

        const target = students.find(s => s.id.toUpperCase() === sId);
        if (target) {
          const g = getStudentGrades(target);
          if (!g[sem]) g[sem] = {};

          if (colT5 !== -1 && row[colT5] !== undefined) g[sem].t5 = parseFloat(row[colT5]);
          if (colCN !== -1 && row[colCN] !== undefined) g[sem].cn = parseFloat(row[colCN]);
          if (colGL !== -1 && row[colGL] !== undefined) g[sem].gl = parseFloat(row[colGL]);
          if (colOral !== -1 && row[colOral] !== undefined) g[sem].oral = parseFloat(row[colOral]);
          if (col15m !== -1 && row[col15m] !== undefined) g[sem].m15 = parseFloat(row[col15m]);
          if (colP1 !== -1 && row[colP1] !== undefined) g[sem].p1 = parseFloat(row[colP1]);
          if (colExam !== -1 && row[colExam] !== undefined) g[sem].exam = parseFloat(row[colExam]);

          updatedCount++;
        }
      }

      cls.students = students;
      saveClassesDatabase();
      renderGradebookTable();
      showToast(`Đã nhập điểm thành công cho ${updatedCount} thiếu nhi!`);
    } catch (err) {
      console.error('Lỗi nhập điểm Excel:', err);
      showToast('Đã có lỗi xảy ra khi đọc file Excel bảng điểm!');
    }
  };
  reader.readAsArrayBuffer(file);
}

function openStudentReportCard(studentId) {
  const cls = classDatabase.find(c => c.id === currentGradebookClassId);
  if (!cls) return;

  const students = getClassStudents(cls);
  const student = students.find(s => s.id === studentId);
  if (!student || !reportCardPrintArea) return;

  const g = getStudentGrades(student);

  // Điểm HK1
  const att1 = calcAttendanceAvg(g.hk1?.t5, g.hk1?.cn, g.hk1?.gl);
  const subj1 = calcSubjectAvg(g.hk1?.oral, g.hk1?.m15, g.hk1?.p1, g.hk1?.exam);
  const rank1 = getRankGrade(subj1);

  // Điểm HK2
  const att2 = calcAttendanceAvg(g.hk2?.t5, g.hk2?.cn, g.hk2?.gl);
  const subj2 = calcSubjectAvg(g.hk2?.oral, g.hk2?.m15, g.hk2?.p1, g.hk2?.exam);
  const rank2 = getRankGrade(subj2);

  // Cả năm
  const attFinal = calcYearAvg(att1, att2);
  const subjFinal = calcYearAvg(subj1, subj2);
  const rankFinal = getRankGrade(subjFinal);
  const rankCCFinal = getAttendanceRank(attFinal);
  const isPass = (subjFinal !== null && subjFinal >= 5.0 && attFinal !== null && attFinal >= 5.0);

  reportCardPrintArea.innerHTML = `
    <div class="rc-header">
      <div class="rc-org-title">GIÁO PHẬN PHÚ CƯỜNG &bull; GIÁO XỨ TÂN MỸ</div>
      <div style="font-weight: 700; font-size: 1.05rem;">ĐOÀN THIẾU NHI THÁNH THỂ TÂN MỸ</div>
      <div class="rc-main-title">PHIẾU BÁO KẾT QUẢ GIÁO LÝ & CHUYÊN CẦN</div>
      <div class="rc-sub-title">Niên Khóa: 2026 – 2027 &bull; Lớp: ${cls.name} (${cls.block})</div>
    </div>

    <div class="rc-student-info-grid">
      <div><strong>Họ và Tên:</strong> ${student.fullName}</div>
      <div><strong>Mã Thiếu Nhi:</strong> ${student.id}</div>
      <div><strong>Tên Thánh (Bổn Mạng):</strong> ${student.holyName || 'Chưa cập nhật'}</div>
      <div><strong>Ngày Sinh:</strong> ${student.birthDate || 'Chưa cập nhật'}</div>
      <div><strong>Phụ Huynh:</strong> ${student.parentName || 'Chưa cập nhật'}</div>
      <div><strong>Số Điện Thoại:</strong> ${student.parentPhone || 'Chưa cập nhật'}</div>
    </div>

    <table class="rc-table">
      <thead>
        <tr>
          <th rowspan="2">NỘI DUNG ĐÁNH GIÁ</th>
          <th colspan="4">ĐIỂM CHUYÊN CẦN</th>
          <th colspan="5">KIỂM TRA GIÁO LÝ</th>
          <th rowspan="2">XẾP LOẠI</th>
        </tr>
        <tr>
          <th>Lễ T5</th>
          <th>Lễ CN</th>
          <th>Học GL</th>
          <th>ĐTB CC</th>
          <th>Miệng</th>
          <th>15 Phút</th>
          <th>1 Tiết</th>
          <th>Thi HK</th>
          <th>ĐTB GL</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>HỌC KỲ 1</strong></td>
          <td>${g.hk1?.t5 ?? '--'}</td>
          <td>${g.hk1?.cn ?? '--'}</td>
          <td>${g.hk1?.gl ?? '--'}</td>
          <td><strong>${att1 !== null ? att1.toFixed(1) : '--'}</strong></td>
          <td>${g.hk1?.oral ?? '--'}</td>
          <td>${g.hk1?.m15 ?? '--'}</td>
          <td>${g.hk1?.p1 ?? '--'}</td>
          <td>${g.hk1?.exam ?? '--'}</td>
          <td><strong>${subj1 !== null ? subj1.toFixed(1) : '--'}</strong></td>
          <td><strong>${rank1.text}</strong></td>
        </tr>
        <tr>
          <td><strong>HỌC KỲ 2</strong></td>
          <td>${g.hk2?.t5 ?? '--'}</td>
          <td>${g.hk2?.cn ?? '--'}</td>
          <td>${g.hk2?.gl ?? '--'}</td>
          <td><strong>${att2 !== null ? att2.toFixed(1) : '--'}</strong></td>
          <td>${g.hk2?.oral ?? '--'}</td>
          <td>${g.hk2?.m15 ?? '--'}</td>
          <td>${g.hk2?.p1 ?? '--'}</td>
          <td>${g.hk2?.exam ?? '--'}</td>
          <td><strong>${subj2 !== null ? subj2.toFixed(1) : '--'}</strong></td>
          <td><strong>${rank2.text}</strong></td>
        </tr>
        <tr style="background: #f8fafc; font-weight: bold;">
          <td>TỔNG KẾT CẢ NĂM</td>
          <td colspan="4" style="color: #059669;">ĐTB Chuyên Cần: ${attFinal !== null ? attFinal.toFixed(1) : '--'} (${rankCCFinal.text})</td>
          <td colspan="5" style="color: #991b1b;">ĐTB Giáo Lý Cả Năm: ${subjFinal !== null ? subjFinal.toFixed(1) : '--'} (${rankFinal.text})</td>
          <td style="color: ${isPass ? '#059669' : '#dc2626'};">${isPass ? 'LÊN LỚP' : 'CẦN CỐ GẮNG'}</td>
        </tr>
      </tbody>
    </table>

    <div class="rc-evaluation-box">
      <div><strong>Nhận xét của Giáo Lý Viên phụ trách:</strong> Em siêng năng tham dự Thánh Lễ, tích cực phát biểu xây dựng bài Giáo Lý trong các giờ sinh hoạt.</div>
    </div>

    <div class="rc-signatures">
      <div>
        <em>Ngày ..... tháng ..... năm 2027</em><br>
        <strong>Ý KIẾN PHỤ HUYNH</strong><br>
        <span style="font-size: 0.85rem; color: #64748b;">(Ký và ghi rõ họ tên)</span>
      </div>
      <div>
        <em>Tân Mỹ, ngày ..... tháng ..... năm 2027</em><br>
        <strong>GIÁO LÝ VIÊN PHỤ TRÁCH</strong><br>
        <span style="font-size: 0.85rem; color: #64748b;">(Ký và ghi rõ họ tên)</span>
      </div>
    </div>
  `;

  if (studentReportCardModal) {
    studentReportCardModal.style.display = 'flex';
  }
}

// ==========================================================================
// PHÂN HỆ THÔNG BÁO & TIN TỨC (NEWS / ANNOUNCEMENTS)
// ==========================================================================
function renderNewsFilterCounts() {
  const countAll = newsDatabase.length;
  const countUrgent = newsDatabase.filter(n => n.category === 'Khẩn').length;
  const countSchedule = newsDatabase.filter(n => n.category === 'Lịch Lễ').length;
  const countEvent = newsDatabase.filter(n => n.category === 'Sự Kiện').length;
  const countGLV = newsDatabase.filter(n => n.category === 'GLV').length;
  const countParents = newsDatabase.filter(n => n.category === 'Phụ Huynh').length;

  const elAll = document.getElementById('countNewsAll');
  const elUrgent = document.getElementById('countNewsUrgent');
  const elSchedule = document.getElementById('countNewsSchedule');
  const elEvent = document.getElementById('countNewsEvent');
  const elGLV = document.getElementById('countNewsGLV');
  const elParents = document.getElementById('countNewsParents');
  const elSidebarNews = document.getElementById('sidebarNewsCount');

  if (elAll) elAll.textContent = countAll;
  if (elUrgent) elUrgent.textContent = countUrgent;
  if (elSchedule) elSchedule.textContent = countSchedule;
  if (elEvent) elEvent.textContent = countEvent;
  if (elGLV) elGLV.textContent = countGLV;
  if (elParents) elParents.textContent = countParents;
  if (elSidebarNews) elSidebarNews.textContent = countAll;
}

function getNewsCategoryTagClass(cat) {
  switch (cat) {
    case 'Khẩn': return 'tag-khan';
    case 'Lịch Lễ': return 'tag-lich-le';
    case 'Sự Kiện': return 'tag-su-kien';
    case 'GLV': return 'tag-glv';
    case 'Phụ Huynh': return 'tag-phu-huynh';
    default: return 'tag-lich-le';
  }
}

function renderNewsView() {
  const newsGrid = document.getElementById('newsCardsGrid');
  const notFound = document.getElementById('newsNotFoundState');
  const searchInput = document.getElementById('newsSearchInput');
  const clearBtn = document.getElementById('newsClearSearchBtn');
  const featuredNewsTitle = document.getElementById('featuredNewsTitle');
  const featuredNewsDesc = document.getElementById('featuredNewsDesc');
  const btnViewFeatured = document.getElementById('btnViewFeaturedNews');

  renderNewsFilterCounts();

  const query = (searchInput ? searchInput.value.trim() : '');
  const qNorm = removeVietnameseTones(query.toLowerCase());

  if (clearBtn) {
    clearBtn.style.display = query ? 'block' : 'none';
  }

  // Update featured pinned news
  const pinnedNews = newsDatabase.find(n => n.isPinned) || newsDatabase[0];
  if (pinnedNews) {
    if (featuredNewsTitle) featuredNewsTitle.textContent = pinnedNews.title;
    if (featuredNewsDesc) featuredNewsDesc.textContent = pinnedNews.summary;
    if (btnViewFeatured) {
      btnViewFeatured.onclick = () => openNewsDetailModal(pinnedNews.id);
    }
  }

  let list = [...newsDatabase];

  // Filter category
  if (currentNewsCategoryFilter !== 'all') {
    list = list.filter(n => n.category === currentNewsCategoryFilter);
  }

  // Filter search
  if (query) {
    list = list.filter(n => {
      const titleNorm = removeVietnameseTones(n.title || '');
      const summaryNorm = removeVietnameseTones(n.summary || '');
      const authorNorm = removeVietnameseTones(n.author || '');
      const contentNorm = removeVietnameseTones(n.content || '');
      return titleNorm.includes(qNorm) || summaryNorm.includes(qNorm) || authorNorm.includes(qNorm) || contentNorm.includes(qNorm);
    });
  }

  if (!newsGrid) return;
  newsGrid.innerHTML = '';

  if (list.length === 0) {
    if (notFound) notFound.style.display = 'block';
    return;
  }
  if (notFound) notFound.style.display = 'none';

  const isAdmin = (currentUserRole === 'admin');

  list.forEach(n => {
    const card = document.createElement('div');
    card.className = `news-card ${n.isPinned ? 'is-pinned' : ''}`;
    const tagCls = getNewsCategoryTagClass(n.category);

    card.innerHTML = `
      <div>
        <div class="news-card-header">
          <span class="news-cat-tag ${tagCls}">${n.category}</span>
          <span class="news-card-date"><i class="fa-regular fa-clock"></i> ${n.date}</span>
        </div>
        <h3 class="news-card-title">${n.isPinned ? '<i class="fa-solid fa-thumbtack" style="color: #f59e0b; margin-right: 0.35rem;"></i>' : ''}${n.title}</h3>
        <p class="news-card-summary">${n.summary || ''}</p>
        <div class="news-card-author"><i class="fa-solid fa-feather-pointed"></i> ${n.author || 'Ban Giáo Lý Tân Mỹ'}</div>
      </div>
      <div class="news-card-footer">
        <button type="button" class="btn-news-read" data-news-id="${n.id}">
          <i class="fa-solid fa-book-open-reader"></i> Xem Chi Tiết
        </button>
        ${isAdmin ? `
          <div style="display: flex; gap: 0.45rem; align-items: center;">
            <button type="button" class="btn-tool-icon edit btn-edit-news" data-edit-id="${n.id}" title="Sửa thông báo"><i class="fa-solid fa-pen-to-square"></i></button>
            <button type="button" class="btn-tool-icon delete btn-del-news" data-del-id="${n.id}" title="Xóa thông báo"><i class="fa-solid fa-trash-can"></i></button>
          </div>
        ` : ''}
      </div>
    `;

    card.querySelector('.btn-news-read').addEventListener('click', () => openNewsDetailModal(n.id));
    card.querySelector('.news-card-title').addEventListener('click', () => openNewsDetailModal(n.id));

    const editBtn = card.querySelector('.btn-edit-news');
    if (editBtn) {
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openNewsEditModal(n.id);
      });
    }

    const delBtn = card.querySelector('.btn-del-news');
    if (delBtn) {
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteNews(n.id);
      });
    }

    newsGrid.appendChild(card);
  });
}

/**
 * Tự động quét và chuyển đổi các đường dẫn URL thành liên kết có thể nhấp được (Clickable Links)
 */
function formatTextWithClickableLinks(rawText) {
  if (!rawText) return '';
  const lines = rawText.split('\n');
  return lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed) return '<div style="height: 0.45rem;"></div>';

    // Regex thông minh nhận diện link http://, https://, hoặc www.
    const urlPattern = /(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+)/gi;
    const formattedLine = line.replace(urlPattern, (matchedUrl) => {
      let href = matchedUrl;
      let trailingPunct = '';

      // Tách dấu chấm, phẩy ở cuối nếu có
      const lastChar = href.slice(-1);
      if ([',', '.', ';', '!', '?', ')', ']'].includes(lastChar)) {
        trailingPunct = lastChar;
        href = href.slice(0, -1);
      }

      if (!href.startsWith('http://') && !href.startsWith('https://')) {
        href = 'https://' + href;
      }

      let displayUrl = href;
      if (displayUrl.length > 55) {
        displayUrl = displayUrl.substring(0, 50) + '...';
      }

      return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="content-auto-link" title="${href}"><i class="fa-solid fa-arrow-up-right-from-square"></i> ${displayUrl}</a>${trailingPunct}`;
    });

    return `<p style="margin-bottom: 0.75rem; line-height: 1.6; color: #334155;">${formattedLine}</p>`;
  }).join('');
}

function openNewsDetailModal(newsId) {
  const news = newsDatabase.find(n => n.id === newsId);
  if (!news) return;

  const modal = document.getElementById('newsDetailModal');
  const body = document.getElementById('newsDetailBody');
  if (!modal || !body) return;

  const tagCls = getNewsCategoryTagClass(news.category);
  const formattedContent = formatTextWithClickableLinks(news.content || '');

  body.innerHTML = `
    <div style="margin-bottom: 1.25rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 1rem;">
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.6rem;">
        <span class="news-cat-tag ${tagCls}" style="font-size: 0.8rem;">${news.category}</span>
        <span style="font-size: 0.85rem; color: #64748b; font-weight: 500;"><i class="fa-regular fa-calendar-days"></i> ${news.date}</span>
      </div>
      <h2 style="font-size: 1.35rem; font-weight: 800; color: #1e293b; line-height: 1.35;">${news.title}</h2>
      <div style="margin-top: 0.5rem; font-size: 0.88rem; color: #475569; font-style: italic;">
        <i class="fa-solid fa-feather-pointed"></i> Người ban hành: <strong>${news.author || 'Ban Quản Trị Xứ Đoàn'}</strong>
      </div>
    </div>
    <div class="news-full-content" style="font-size: 0.95rem;">
      ${formattedContent}
    </div>
    <div style="margin-top: 1.5rem; padding: 1rem; background: #fffdfa; border: 1px dashed #fcd34d; border-radius: 12px; font-size: 0.85rem; color: #78350f;">
      <i class="fa-solid fa-cross"></i> <strong>Đoàn Thiếu Nhi Thánh Thể Giáo Xứ Tân Mỹ</strong> - Năm học 2026 - 2027
    </div>
  `;

  modal.style.display = 'flex';
}

function openNewsEditModal(newsId = null) {
  const modal = document.getElementById('newsEditModal');
  const titleEl = document.getElementById('newsModalTitle');
  const form = document.getElementById('newsForm');
  if (!modal || !form) return;

  const idInput = document.getElementById('newsEditId');
  const titleInput = document.getElementById('newsFormTitle');
  const categorySelect = document.getElementById('newsFormCategory');
  const dateInput = document.getElementById('newsFormDate');
  const authorInput = document.getElementById('newsFormAuthor');
  const summaryInput = document.getElementById('newsFormSummary');
  const contentInput = document.getElementById('newsFormContent');
  const pinnedCheckbox = document.getElementById('newsFormPinned');

  if (newsId) {
    const news = newsDatabase.find(n => n.id === newsId);
    if (!news) return;
    if (titleEl) titleEl.textContent = 'Chỉnh Sửa Thông Báo';
    idInput.value = news.id;
    titleInput.value = news.title || '';
    categorySelect.value = news.category || 'Khẩn';
    dateInput.value = news.date || '';
    authorInput.value = news.author || '';
    summaryInput.value = news.summary || '';
    contentInput.value = news.content || '';
    pinnedCheckbox.checked = !!news.isPinned;
  } else {
    if (titleEl) titleEl.textContent = 'Đăng Thông Báo Mới';
    idInput.value = '';
    form.reset();
    const today = new Date();
    const d = String(today.getDate()).padStart(2, '0');
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const y = today.getFullYear();
    dateInput.value = `${d}/${m}/${y}`;
    authorInput.value = 'Ban Quản Trị Xứ Đoàn TNTT';
  }

  modal.style.display = 'flex';
}

function handleNewsFormSubmit(e) {
  e.preventDefault();
  const idInput = document.getElementById('newsEditId');
  const titleInput = document.getElementById('newsFormTitle');
  const categorySelect = document.getElementById('newsFormCategory');
  const dateInput = document.getElementById('newsFormDate');
  const authorInput = document.getElementById('newsFormAuthor');
  const summaryInput = document.getElementById('newsFormSummary');
  const contentInput = document.getElementById('newsFormContent');
  const pinnedCheckbox = document.getElementById('newsFormPinned');

  const title = (titleInput.value || '').trim();
  if (!title) return;

  const isEdit = !!idInput.value;
  const isPinned = pinnedCheckbox.checked;

  if (isPinned) {
    // Unpin other news
    newsDatabase.forEach(n => n.isPinned = false);
  }

  let targetItem = null;
  if (isEdit) {
    const news = newsDatabase.find(n => n.id === idInput.value);
    if (news) {
      news.title = title;
      news.category = categorySelect.value;
      news.date = dateInput.value.trim() || '26/08/2026';
      news.author = authorInput.value.trim() || 'Ban Quản Trị';
      news.summary = summaryInput.value.trim();
      news.content = contentInput.value.trim();
      news.isPinned = isPinned;
      targetItem = news;
    }
  } else {
    const newId = `NEWS${String(newsDatabase.length + 1).padStart(2, '0')}`;
    targetItem = {
      id: newId,
      title: title,
      category: categorySelect.value,
      date: dateInput.value.trim() || '26/08/2026',
      author: authorInput.value.trim() || 'Ban Quản Trị',
      summary: summaryInput.value.trim(),
      content: contentInput.value.trim(),
      isPinned: isPinned
    };
    newsDatabase.unshift(targetItem);
  }

  saveNewsDatabase();
  renderNewsView();
  if (typeof API !== 'undefined' && targetItem) {
    API.saveNews(targetItem, !isEdit).then(ok => {
      if (ok) console.log('✅ Đã đồng bộ bài thông báo vào MySQL Database thành công!');
    });
  }
  document.getElementById('newsEditModal').style.display = 'none';
  showToast(isEdit ? 'Đã cập nhật thông báo thành công!' : 'Đã đăng thông báo mới!');
}

async function deleteNews(newsId) {
  const news = newsDatabase.find(n => n.id === newsId);
  if (!news) return;

  const ok = await showConfirmDialog({
    title: 'Xóa Thông Báo',
    message: 'Bạn có chắc chắn muốn xóa bài thông báo này không?',
    itemName: news.title,
    confirmText: 'Xác Nhận Xóa'
  });

  if (!ok) return;

  newsDatabase = newsDatabase.filter(n => n.id !== newsId);
  saveNewsDatabase();
  renderNewsView();
  if (typeof API !== 'undefined') {
    API.deleteNews(newsId);
  }
  showToast('Đã xóa thông báo!');
}

// ==========================================================================
// PHÂN HỆ KHO TÀI LIỆU & GIÁO TRÌNH (DOCUMENTS / RESOURCES)
// ==========================================================================
function renderDocsFilterCounts() {
  const countAll = docsDatabase.length;
  const countGT = docsDatabase.filter(d => d.category === 'Giáo Trình').length;
  const countST = docsDatabase.filter(d => d.category === 'Sổ Tay').length;
  const countKH = docsDatabase.filter(d => d.category === 'Kinh & Hát').length;
  const countBM = docsDatabase.filter(d => d.category === 'Biểu Mẫu').length;

  const elAll = document.getElementById('countDocsAll');
  const elGT = document.getElementById('countDocsGiaoTrinh');
  const elST = document.getElementById('countDocsSoTay');
  const elKH = document.getElementById('countDocsKinhHat');
  const elBM = document.getElementById('countDocsBieuMau');
  const elSidebarDocs = document.getElementById('sidebarDocsCount');

  if (elAll) elAll.textContent = countAll;
  if (elGT) elGT.textContent = countGT;
  if (elST) elST.textContent = countST;
  if (elKH) elKH.textContent = countKH;
  if (elBM) elBM.textContent = countBM;
  if (elSidebarDocs) elSidebarDocs.textContent = countAll;
}

function getDocFormatIcon(format) {
  switch (format) {
    case 'PDF': return { cls: 'format-pdf', icon: 'fa-solid fa-file-pdf' };
    case 'DOCX': return { cls: 'format-docx', icon: 'fa-solid fa-file-word' };
    case 'XLSX': return { cls: 'format-xlsx', icon: 'fa-solid fa-file-excel' };
    case 'MP3': return { cls: 'format-mp3', icon: 'fa-solid fa-file-audio' };
    default: return { cls: 'format-pdf', icon: 'fa-solid fa-file-lines' };
  }
}

function renderDocsView() {
  const docsGrid = document.getElementById('docsCardsGrid');
  const notFound = document.getElementById('docsNotFoundState');
  const searchInput = document.getElementById('docsSearchInput');
  const clearBtn = document.getElementById('docsClearSearchBtn');

  renderDocsFilterCounts();

  const query = (searchInput ? searchInput.value.trim() : '');
  const qNorm = removeVietnameseTones(query.toLowerCase());

  if (clearBtn) {
    clearBtn.style.display = query ? 'block' : 'none';
  }

  let list = [...docsDatabase];

  // Filter category
  if (currentDocsCategoryFilter !== 'all') {
    list = list.filter(d => d.category === currentDocsCategoryFilter);
  }

  // Filter search
  if (query) {
    list = list.filter(d => {
      const titleNorm = removeVietnameseTones(d.title || '');
      const descNorm = removeVietnameseTones(d.desc || '');
      const targetNorm = removeVietnameseTones(d.target || '');
      const authorNorm = removeVietnameseTones(d.author || '');
      return titleNorm.includes(qNorm) || descNorm.includes(qNorm) || targetNorm.includes(qNorm) || authorNorm.includes(qNorm);
    });
  }

  if (!docsGrid) return;
  docsGrid.innerHTML = '';

  if (list.length === 0) {
    if (notFound) notFound.style.display = 'block';
    return;
  }
  if (notFound) notFound.style.display = 'none';

  const isAdmin = (currentUserRole === 'admin');

  list.forEach(doc => {
    const card = document.createElement('div');
    card.className = 'doc-card';
    const fmt = getDocFormatIcon(doc.format);

    card.innerHTML = `
      <div class="doc-icon-box ${fmt.cls}">
        <i class="${fmt.icon}"></i>
      </div>
      <div class="doc-info">
        <h3 class="doc-title">${doc.title}</h3>
        <div class="doc-meta-row">
          <span class="doc-target-badge"><i class="fa-solid fa-users"></i> ${doc.target || 'Toàn Đoàn'}</span>
          <span>&bull; ${doc.size || '3.5 MB'}</span>
          <span>&bull; <i class="fa-solid fa-download"></i> ${doc.downloads || 100}+</span>
        </div>
        <p class="doc-desc-text">${doc.desc || ''}</p>
        <div class="doc-actions-row">
          <button type="button" class="btn-doc-view" data-doc-id="${doc.id}">
            <i class="fa-solid fa-eye"></i> Xem Nhanh
          </button>
          <button type="button" class="btn-doc-download" data-download-id="${doc.id}">
            <i class="fa-solid fa-download"></i> Tải Về
          </button>
          ${isAdmin ? `
            <button type="button" class="btn-tool-icon edit btn-edit-doc" data-edit-id="${doc.id}" title="Sửa tài liệu"><i class="fa-solid fa-pen"></i></button>
            <button type="button" class="btn-tool-icon delete btn-del-doc" data-del-id="${doc.id}" title="Xóa tài liệu"><i class="fa-solid fa-trash-can"></i></button>
          ` : ''}
        </div>
      </div>
    `;

    card.querySelector('.btn-doc-view').addEventListener('click', () => openDocPreviewModal(doc.id));
    card.querySelector('.btn-doc-download').addEventListener('click', () => downloadDoc(doc.id));

    const editBtn = card.querySelector('.btn-edit-doc');
    if (editBtn) {
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openDocEditModal(doc.id);
      });
    }

    const delBtn = card.querySelector('.btn-del-doc');
    if (delBtn) {
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteDoc(doc.id);
      });
    }

    docsGrid.appendChild(card);
  });
}

function openDocPreviewModal(docId) {
  const doc = docsDatabase.find(d => d.id === docId);
  if (!doc) return;

  const modal = document.getElementById('docPreviewModal');
  const body = document.getElementById('docPreviewBody');
  const titleEl = document.getElementById('docPreviewModalTitle');
  const downloadBtn = document.getElementById('btnDownloadDocFromPreview');
  if (!modal || !body) return;

  if (titleEl) titleEl.textContent = doc.title;
  const fmt = getDocFormatIcon(doc.format);

  body.innerHTML = `
    <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1.25rem; padding-bottom: 1rem; border-bottom: 1px solid #e2e8f0;">
      <div class="doc-icon-box ${fmt.cls}" style="width: 56px; height: 56px; font-size: 1.75rem;">
        <i class="${fmt.icon}"></i>
      </div>
      <div>
        <h3 style="font-size: 1.2rem; font-weight: 700; color: #1e293b; margin-bottom: 0.35rem;">${doc.title}</h3>
        <div style="display: flex; gap: 0.5rem; font-size: 0.82rem; color: #64748b;">
          <span class="doc-target-badge">${doc.category}</span>
          <span>&bull; Đối tượng: <strong>${doc.target}</strong></span>
          <span>&bull; Dung lượng: <strong>${doc.size}</strong></span>
        </div>
      </div>
    </div>
    <div style="font-size: 0.92rem; color: #334155; line-height: 1.6; margin-bottom: 1rem;">
      <p style="margin-bottom: 0.75rem;"><strong>Mô tả tóm tắt:</strong> ${formatTextWithClickableLinks(doc.desc || '')}</p>
      <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 1rem; margin-top: 1rem;">
        <h4 style="font-size: 0.95rem; font-weight: 700; color: #1e293b; margin-bottom: 0.5rem;"><i class="fa-solid fa-circle-info" style="color: #7c3aed;"></i> Tóm Tắt Nội Dung Giáo Lý / Biểu Mẫu:</h4>
        <div style="font-size: 0.88rem; color: #475569; line-height: 1.5;">${formatTextWithClickableLinks(doc.content || 'Tài liệu chuẩn mực phục vụ công tác giảng dạy giáo lý và sinh hoạt Thiếu Nhi Thánh Thể tại Giáo xứ Tân Mỹ.')}</div>
      </div>
    </div>
  `;

  if (downloadBtn) {
    downloadBtn.onclick = () => downloadDoc(doc.id);
  }

  modal.style.display = 'flex';
}

function openDocEditModal(docId = null) {
  const modal = document.getElementById('docEditModal');
  const titleEl = document.getElementById('docModalTitle');
  const form = document.getElementById('docForm');
  if (!modal || !form) return;

  const idInput = document.getElementById('docEditId');
  const titleInput = document.getElementById('docFormTitle');
  const categorySelect = document.getElementById('docFormCategory');
  const formatSelect = document.getElementById('docFormFormat');
  const targetInput = document.getElementById('docFormTarget');
  const sizeInput = document.getElementById('docFormSize');
  const descInput = document.getElementById('docFormDesc');

  if (docId) {
    const doc = docsDatabase.find(d => d.id === docId);
    if (!doc) return;
    if (titleEl) titleEl.textContent = 'Chỉnh Sửa Tài Liệu';
    idInput.value = doc.id;
    titleInput.value = doc.title || '';
    categorySelect.value = doc.category || 'Giáo Trình';
    formatSelect.value = doc.format || 'PDF';
    targetInput.value = doc.target || '';
    sizeInput.value = doc.size || '';
    descInput.value = doc.desc || '';
  } else {
    if (titleEl) titleEl.textContent = 'Đăng Tài Liệu Mới';
    idInput.value = '';
    form.reset();
    sizeInput.value = '3.5 MB';
    targetInput.value = 'Toàn Đoàn Thiếu Nhi';
  }

  modal.style.display = 'flex';
}

function handleDocFormSubmit(e) {
  e.preventDefault();
  const idInput = document.getElementById('docEditId');
  const titleInput = document.getElementById('docFormTitle');
  const categorySelect = document.getElementById('docFormCategory');
  const formatSelect = document.getElementById('docFormFormat');
  const targetInput = document.getElementById('docFormTarget');
  const sizeInput = document.getElementById('docFormSize');
  const descInput = document.getElementById('docFormDesc');

  const title = (titleInput.value || '').trim();
  if (!title) return;

  const isEdit = !!idInput.value;

  let targetDocItem = null;
  if (isEdit) {
    const doc = docsDatabase.find(d => d.id === idInput.value);
    if (doc) {
      doc.title = title;
      doc.category = categorySelect.value;
      doc.format = formatSelect.value;
      doc.target = targetInput.value.trim() || 'Toàn Đoàn';
      doc.size = sizeInput.value.trim() || '3.5 MB';
      doc.desc = descInput.value.trim();
      targetDocItem = doc;
    }
  } else {
    const newId = `DOC${String(docsDatabase.length + 1).padStart(2, '0')}`;
    targetDocItem = {
      id: newId,
      title: title,
      category: categorySelect.value,
      format: formatSelect.value,
      target: targetInput.value.trim() || 'Toàn Đoàn',
      size: sizeInput.value.trim() || '3.5 MB',
      author: 'Ban Giáo Lý Tân Mỹ',
      downloads: 1,
      desc: descInput.value.trim(),
      content: descInput.value.trim()
    };
    docsDatabase.unshift(targetDocItem);
  }

  saveDocsDatabase();
  renderDocsView();
  if (typeof API !== 'undefined' && targetDocItem) {
    API.saveDoc(targetDocItem, !isEdit).then(ok => {
      if (ok) console.log('✅ Đã đồng bộ tài liệu vào MySQL Database thành công!');
    });
  }
  document.getElementById('docEditModal').style.display = 'none';
  showToast(isEdit ? 'Đã cập nhật tài liệu thành công!' : 'Đã đăng tài liệu mới!');
}

function downloadDoc(docId) {
  const doc = docsDatabase.find(d => d.id === docId);
  if (!doc) return;
  doc.downloads = (doc.downloads || 0) + 1;
  saveDocsDatabase();
  renderDocsView();
  if (typeof API !== 'undefined') {
    API.recordDocDownload(docId);
  }
  showToast(`Đang tải về "${doc.title}"...`);
}

async function deleteDoc(docId) {
  const doc = docsDatabase.find(d => d.id === docId);
  if (!doc) return;

  const ok = await showConfirmDialog({
    title: 'Xóa Tài Liệu',
    message: 'Bạn có chắc chắn muốn xóa tài liệu này không?',
    itemName: doc.title,
    confirmText: 'Xác Nhận Xóa'
  });

  if (!ok) return;

  docsDatabase = docsDatabase.filter(d => d.id !== docId);
  saveDocsDatabase();
  renderDocsView();
  if (typeof API !== 'undefined') {
    API.deleteDoc(docId);
  }
  showToast('Đã xóa tài liệu!');
}


