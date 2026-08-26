/**
 * ==============================================================================
 * MODULE CLIENT DATA SERVICE (API.JS)
 * Giao tiếp với PHP & MySQL Backend - Hỗ trợ Fallback tự động khi Offline
 * ==============================================================================
 */

const API_CONFIG = {
  // Đường dẫn gốc của API (Tự động thích ứng khi chạy local hoặc sub-folder)
  BASE_URL: window.location.origin.includes('github.io') 
    ? 'https://your-domain.com/backend/api' // Thay bằng domain hosting của bạn khi deploy
    : (window.location.pathname.includes('/backend/') ? '../api' : 'backend/api'),
  TIMEOUT: 4000
};

const API = {
  isOnline: false,

  /**
   * Kiểm tra kết nối tới Backend PHP & MySQL
   */
  async checkBackendStatus() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

      const res = await fetch(`${API_CONFIG.BASE_URL}/auth.php`, {
        method: 'GET',
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        this.isOnline = (json && json.success);
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
    if (!this.isOnline) return null;
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/teachers.php`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        return json.data.map(item => ({
          stt: parseInt(item.stt, 10),
          id: item.id,
          holyName: item.holy_name || '',
          lastName: item.last_name || '',
          firstName: item.first_name || '',
          gender: item.gender || 'Nữ',
          cert: item.cert || '',
          block: item.block || '',
          teachingClass: item.teaching_class || '',
          photo: item.photo_url || ''
        }));
      }
    } catch (e) {
      console.warn('Không thể kết nối API Teachers, chuyển sang LocalStorage:', e);
    }
    return null;
  },

  /**
   * 2. LƯU / CẬP NHẬT GIÁO LÝ VIÊN
   */
  async saveTeacher(glv, isNew = false) {
    if (!this.isOnline) return false;
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
          photo: glv.photo
        })
      });
      const json = await res.json();
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
    if (!this.isOnline) return false;
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/teachers.php?id=${encodeURIComponent(glvId)}`, {
        method: 'DELETE'
      });
      const json = await res.json();
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
    if (!this.isOnline) return null;
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/classes.php`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        return json.data.map(c => ({
          id: c.id,
          name: c.name,
          block: c.block,
          room: c.room || '',
          schedule: c.schedule || 'Chủ Nhật: 07:30 - 09:00',
          studentCount: parseInt(c.student_count, 10) || 0,
          teacherIds: c.teacherIds || [],
          note: c.note || ''
        }));
      }
    } catch (e) {
      console.warn('Không thể kết nối API Classes, chuyển sang LocalStorage:', e);
    }
    return null;
  },

  /**
   * 5. LƯU / CẬP NHẬT LỚP HỌC
   */
  async saveClass(cls, isNew = false) {
    if (!this.isOnline) return false;
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
    if (!this.isOnline) return false;
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/classes.php?id=${encodeURIComponent(classId)}`, {
        method: 'DELETE'
      });
      const json = await res.json();
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
    if (!this.isOnline) return null;
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/students.php?class_id=${encodeURIComponent(classId)}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        return json.data.map(s => ({
          stt: parseInt(s.stt, 10),
          id: s.id,
          holyName: s.holy_name || '',
          fullName: s.full_name,
          gender: s.gender || 'Nam',
          birthDate: s.birth_date || '',
          note: s.note || 'Đang theo học'
        }));
      }
    } catch (e) {
      console.warn('Lỗi lấy danh sách thiếu nhi qua API:', e);
    }
    return null;
  },

  /**
   * 8. ĐĂNG NHẬP ADMIN VÀ XÁC THỰC
   */
  async loginAdmin(password) {
    if (!this.isOnline) return null;
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/auth.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password })
      });
      const json = await res.json();
      return json;
    } catch (e) {
      console.warn('Lỗi kết nối auth API:', e);
      return null;
    }
  }
};
