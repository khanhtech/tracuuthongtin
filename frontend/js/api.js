/**
 * ==============================================================================
 * MODULE CLIENT DATA SERVICE (API.JS)
 * Giao tiếp với PHP & MySQL Backend - Hỗ trợ Fallback tự động khi Offline
 * ==============================================================================
 */

const API_CONFIG = {
  BASE_URL: window.location.pathname.includes('/frontend') ? '../api' : 'api',
  TIMEOUT: 6000
};

const API = {
  isOnline: true,

  /**
   * Kiểm tra kết nối tới Backend PHP & MySQL
   */
  async checkBackendStatus() {
    // Trên GitHub Pages hoặc giao thức file:, tự động chạy chế độ Client-side Offline an toàn
    if (window.location.protocol === 'file:' || window.location.hostname.includes('github.io')) {
      this.isOnline = false;
      return false;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

      const res = await fetch(`${API_CONFIG.BASE_URL}/auth.php`, {
        method: 'GET',
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const text = await res.text();
        try {
          const json = JSON.parse(text);
          this.isOnline = Boolean(json && json.success === true);
        } catch (e) {
          this.isOnline = false;
        }
      } else {
        this.isOnline = false;
      }
    } catch (e) {
      this.isOnline = false;
    }
    return this.isOnline;
  },

  /**
   * 1. LẤY DANH SÁCH GIÁO LÝ VIÊN
   */
  async getTeachers() {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/teachers.php`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        this.isOnline = true;
        return json.data.map(item => ({
          stt: parseInt(item.stt, 10),
          id: item.id || item.teacher_id,
          holyName: item.holyName || item.holy_name || '',
          lastName: item.lastName || item.last_name || '',
          firstName: item.firstName || item.first_name || '',
          gender: item.gender || 'Nữ',
          cert: item.cert || '',
          block: item.block || '',
          teachingClass: item.teachingClass || item.teaching_class || '',
          role: item.role || 'Chưa phân công',
          status: item.status || 'Đang dạy học',
          photo: item.photo || item.photo_url || ''
        }));
      }
    } catch (e) {
      console.warn('Không thể kết nối API Teachers:', e);
    }
    return null;
  },

  /**
   * 2. LƯU / CẬP NHẬT GIÁO LÝ VIÊN
   */
  async saveTeacher(glv, isNew = false) {
    try {
      const method = isNew ? 'POST' : 'PUT';
      const url = isNew ? `${API_CONFIG.BASE_URL}/teachers.php` : `${API_CONFIG.BASE_URL}/teachers.php?id=${encodeURIComponent(glv.id)}`;
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: glv.id,
          stt: glv.stt,
          holyName: glv.holyName,
          lastName: glv.lastName,
          firstName: glv.firstName,
          gender: glv.gender,
          cert: glv.cert,
          block: glv.block,
          teachingClass: glv.teachingClass,
          role: glv.role || 'Đồng hành',
          status: glv.status || 'Đang dạy học',
          photo: glv.photo
        })
      });
      const json = await res.json();
      if (json.success) this.isOnline = true;
      return json.success;
    } catch (e) {
      console.warn('Lỗi lưu Teacher qua API:', e);
      return false;
    }
  },

  /**
   * 3. XÓA GIÁO LÝ VIÊN
   */
  async deleteTeacher(glvId) {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/teachers.php?id=${encodeURIComponent(glvId)}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (json.success) this.isOnline = true;
      return json.success;
    } catch (e) {
      console.warn('Lỗi xóa Teacher qua API:', e);
      return false;
    }
  },

  /**
   * 4. LẤY DANH SÁCH LỚP HỌC
   */
  async getClasses() {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/classes.php`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        this.isOnline = true;
        return json.data.map(c => ({
          id: c.id || c.class_id,
          name: c.name || c.class_name,
          block: c.block,
          room: c.room || '',
          schedule: c.schedule || 'Chủ Nhật: 07:30 - 09:00',
          studentCount: parseInt(c.studentCount || c.student_count, 10) || 0,
          teachers: c.teachers || [],
          teacherIds: c.teacherIds || [],
          note: c.note || ''
        }));
      }
    } catch (e) {
      console.warn('Không thể kết nối API Classes:', e);
    }
    return null;
  },

  /**
   * 5. LƯU / CẬP NHẬT LỚP HỌC
   */
  async saveClass(cls, isNew = false) {
    try {
      const method = isNew ? 'POST' : 'PUT';
      const url = isNew ? `${API_CONFIG.BASE_URL}/classes.php` : `${API_CONFIG.BASE_URL}/classes.php?id=${encodeURIComponent(cls.id)}`;
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: cls.id,
          name: cls.name,
          block: cls.block,
          room: cls.room,
          schedule: cls.schedule,
          studentCount: cls.studentCount,
          teacherIds: cls.teacherIds || [],
          note: cls.note
        })
      });
      const json = await res.json();
      if (json.success) this.isOnline = true;
      return json.success;
    } catch (e) {
      console.warn('Lỗi lưu Class qua API:', e);
      return false;
    }
  },

  /**
   * 6. XÓA LỚP HỌC
   */
  async deleteClass(classId) {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/classes.php?id=${encodeURIComponent(classId)}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (json.success) this.isOnline = true;
      return json.success;
    } catch (e) {
      console.warn('Lỗi xóa Class qua API:', e);
      return false;
    }
  },

  /**
   * 7. LẤY DANH SÁCH THIẾU NHI CỦA LỚP
   */
  async getStudents(classId) {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/students.php?class_id=${encodeURIComponent(classId)}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        this.isOnline = true;
        return json.data.map(s => {
          const sName = s.fullName || s.name || (s.lastName ? `${s.lastName} ${s.firstName}` : s.firstName) || '';
          const sDob = s.birthDate || s.dob || s.birth_date || '';
          return {
            stt: parseInt(s.stt, 10) || 1,
            id: s.id || s.student_id,
            holyName: s.holyName || s.holy_name || '',
            name: sName,
            fullName: sName,
            gender: s.gender || 'Nam',
            dob: sDob,
            birthDate: sDob,
            role: (s.note === 'Lớp trưởng' || s.role === 'Lớp trưởng') ? 'Lớp trưởng' : 'Thiếu nhi',
            note: (s.note === 'Lớp trưởng' || s.role === 'Lớp trưởng') ? 'Lớp trưởng' : 'Thiếu nhi',
            parentName: s.parentName || s.parent_name || '',
            parentPhone: s.parentPhone || s.parent_phone || '',
            address: s.address || '',
            scoreHK1: s.scoreHK1 || { cc: s.score_attendance_1, m: s.score_oral_1, p15: s.score_15m_1, p45: s.score_1period_1, thi: s.score_exam_1, tb: s.score_avg_1 },
            scoreHK2: s.scoreHK2 || { cc: s.score_attendance_2, m: s.score_oral_2, p15: s.score_15m_2, p45: s.score_1period_2, thi: s.score_exam_2, tb: s.score_avg_2 },
            scoreFinal: s.scoreFinal !== undefined ? s.scoreFinal : s.score_final,
            evaluation: s.evaluation || 'Đang học'
          };
        });
      }
    } catch (e) {
      console.warn(`Không thể lấy danh sách học sinh lớp ${classId} từ API:`, e);
    }
    return null;
  },

  /**
   * 7.0 LƯU BẢNG ĐIỂM SỐ & CHUYÊN CẦN CỦA LỚP VÀO MYSQL
   */
  async saveClassGrades(classId, grades) {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/students.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_class_grades',
          class_id: classId,
          grades: grades
        })
      });
      const json = await res.json();
      if (json.success) this.isOnline = true;
      return json && json.success;
    } catch (e) {
      console.warn('Lỗi lưu điểm qua API:', e);
      return false;
    }
  },
  async getAllStudents() {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/students.php`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        this.isOnline = true;
        return json.data.map(s => {
          const sName = s.fullName || s.name || (s.lastName ? `${s.lastName} ${s.firstName}` : s.firstName) || '';
          const sDob = s.birthDate || s.dob || s.birth_date || '';
          return {
            stt: parseInt(s.stt, 10) || 1,
            id: s.id || s.student_id,
            holyName: s.holyName || s.holy_name || '',
            name: sName,
            fullName: sName,
            gender: s.gender || 'Nam',
            dob: sDob,
            birthDate: sDob,
            classId: s.classId || s.class_id || '',
            className: s.className || '',
            role: (s.note === 'Lớp trưởng' || s.role === 'Lớp trưởng') ? 'Lớp trưởng' : 'Thiếu nhi',
            note: (s.note === 'Lớp trưởng' || s.role === 'Lớp trưởng') ? 'Lớp trưởng' : 'Thiếu nhi',
            parentName: s.parentName || s.parent_name || '',
            parentPhone: s.parentPhone || s.parent_phone || '',
            address: s.address || '',
            scoreFinal: s.scoreFinal !== undefined ? s.scoreFinal : s.score_final,
            evaluation: s.evaluation || 'Đang học'
          };
        });
      }
    } catch (e) {
      console.warn('Lỗi lấy toàn bộ danh sách thiếu nhi từ API:', e);
    }
    return null;
  },

  /**
   * 8. LƯU / CẬP NHẬT THIẾU NHI
   */
  async saveStudent(student, isNew = false) {
    try {
      const method = isNew ? 'POST' : 'PUT';
      const targetId = student.originalId || student.origId || student.id;
      const url = isNew ? `${API_CONFIG.BASE_URL}/students.php` : `${API_CONFIG.BASE_URL}/students.php?id=${encodeURIComponent(targetId)}`;
      const classId = student.classId || student.class_id;
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          class_id: classId,
          classId: classId,
          id: student.id,
          original_id: targetId,
          stt: student.stt,
          holyName: student.holyName,
          fullName: student.fullName || student.name,
          name: student.fullName || student.name,
          gender: student.gender,
          birthDate: student.birthDate || student.dob,
          role: (student.role === 'Lớp trưởng' || student.note === 'Lớp trưởng') ? 'Lớp trưởng' : 'Thiếu nhi',
          note: (student.note === 'Lớp trưởng' || student.role === 'Lớp trưởng') ? 'Lớp trưởng' : 'Thiếu nhi',
          parentName: student.parentName,
          parentPhone: student.parentPhone,
          address: student.address,
          scoreHK1: student.scoreHK1,
          scoreHK2: student.scoreHK2,
          scoreFinal: student.scoreFinal,
          evaluation: student.evaluation
        })
      });
      const json = await res.json();
      if (json.success) this.isOnline = true;
      return json.success;
    } catch (e) {
      console.warn('Lỗi lưu Student qua API:', e);
      return false;
    }
  },

  /**
   * 9. XÓA THIẾU NHI
   */
  async deleteStudent(studentId) {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/students.php?id=${encodeURIComponent(studentId)}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (json.success) this.isOnline = true;
      return json.success;
    } catch (e) {
      console.warn('Lỗi xóa Student qua API:', e);
      return false;
    }
  },

  /**
   * 9.1 NHẬP HÀNG LOẠT THIẾU NHI TỪ EXCEL VÀO LỚP
   */
  async importStudents(classId, students, replaceMode = false) {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/students.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'batch_import',
          class_id: classId,
          replace_mode: replaceMode,
          students: students
        })
      });
      const json = await res.json();
      if (json.success) this.isOnline = true;
      return json;
    } catch (e) {
      console.warn('Lỗi Import Students qua API:', e);
      return { success: false, message: e.message };
    }
  },

  /**
   * 10. ĐĂNG NHẬP ADMIN VÀ XÁC THỰC
   */
  async loginAdmin(password) {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/auth.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password })
      });
      const json = await res.json();
      if (json && json.success) this.isOnline = true;
      return json;
    } catch (e) {
      console.warn('Lỗi kết nối auth API:', e);
      return null;
    }
  },

  /**
   * 11. THÔNG BÁO & TIN TỨC (NEWS)
   */
  async getNews() {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/news.php`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        this.isOnline = true;
        return json.data;
      }
    } catch (e) {
      console.warn('Lỗi lấy News từ API:', e);
    }
    return null;
  },

  async saveNews(news, isNew = false) {
    try {
      const method = isNew ? 'POST' : 'PUT';
      const url = isNew ? `${API_CONFIG.BASE_URL}/news.php` : `${API_CONFIG.BASE_URL}/news.php?id=${encodeURIComponent(news.id)}`;
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(news)
      });
      const json = await res.json();
      if (json.success) this.isOnline = true;
      return json.success;
    } catch (e) {
      console.warn('Lỗi lưu News qua API:', e);
      return false;
    }
  },

  async deleteNews(newsId) {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/news.php?id=${encodeURIComponent(newsId)}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (json.success) this.isOnline = true;
      return json.success;
    } catch (e) {
      console.warn('Lỗi xóa News qua API:', e);
      return false;
    }
  },

  /**
   * 12. KHO TÀI LIỆU & GIÁO TRÌNH (DOCUMENTS)
   */
  async getDocs() {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/docs.php`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        this.isOnline = true;
        return json.data;
      }
    } catch (e) {
      console.warn('Lỗi lấy Docs từ API:', e);
    }
    return null;
  },

  async saveDoc(doc, isNew = false) {
    try {
      const method = isNew ? 'POST' : 'PUT';
      const url = isNew ? `${API_CONFIG.BASE_URL}/docs.php` : `${API_CONFIG.BASE_URL}/docs.php?id=${encodeURIComponent(doc.id)}`;
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doc)
      });
      const json = await res.json();
      if (json.success) this.isOnline = true;
      return json.success;
    } catch (e) {
      console.warn('Lỗi lưu Doc qua API:', e);
      return false;
    }
  },

  async deleteDoc(docId) {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/docs.php?id=${encodeURIComponent(docId)}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (json.success) this.isOnline = true;
      return json.success;
    } catch (e) {
      console.warn('Lỗi xóa Doc qua API:', e);
      return false;
    }
  },

  async recordDocDownload(docId) {
    try {
      await fetch(`${API_CONFIG.BASE_URL}/docs.php?id=${encodeURIComponent(docId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incrementDownload: true })
      });
    } catch (e) {
      console.warn('Lỗi ghi nhận download:', e);
    }
  }
};
