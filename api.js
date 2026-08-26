/**
 * ==============================================================================
 * MODULE CLIENT DATA SERVICE (API.JS)
 * Giao tiếp với PHP & MySQL Backend - Hỗ trợ Fallback tự động khi Offline
 * ==============================================================================
 */

const API_CONFIG = {
  BASE_URL: 'api',
  TIMEOUT: 5000
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
          id: item.id || item.teacher_id,
          holyName: item.holyName || item.holy_name || '',
          lastName: item.lastName || item.last_name || '',
          firstName: item.firstName || item.first_name || '',
          gender: item.gender || 'Nữ',
          cert: item.cert || '',
          block: item.block || '',
          teachingClass: item.teachingClass || item.teaching_class || '',
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
          id: c.id || c.class_id,
          name: c.name || c.class_name,
          block: c.block,
          room: c.room || '',
          schedule: c.schedule || 'Chủ Nhật: 07:30 - 09:00',
          studentCount: parseInt(c.studentCount || c.student_count, 10) || 0,
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
          stt: parseInt(s.stt, 10) || 1,
          id: s.id || s.student_id || '',
          holyName: s.holyName || s.holy_name || '',
          fullName: s.fullName || s.full_name || `${s.lastName || s.last_name || ''} ${s.firstName || s.first_name || ''}`.trim() || 'Chưa đặt tên',
          gender: s.gender || 'Nam',
          birthDate: s.birthDate || s.birth_date || '',
          note: s.note || s.role_in_class || 'Đang theo học',
          parentName: s.parentName || s.parent_name || '',
          parentPhone: s.parentPhone || s.parent_phone || '',
          address: s.address || ''
        }));
      }
    } catch (e) {
      console.warn('Lỗi lấy danh sách thiếu nhi qua API:', e);
    }
    return null;
  },

  /**
   * 8. LƯU / CẬP NHẬT THIẾU NHI
   */
  async saveStudent(stu, isNew = false) {
    if (!this.isOnline) return false;
    try {
      const method = isNew ? 'POST' : 'PUT';
      const url = isNew ? `${API_CONFIG.BASE_URL}/students.php` : `${API_CONFIG.BASE_URL}/students.php?id=${encodeURIComponent(stu.id)}`;
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: stu.id,
          class_id: stu.classId,
          stt: stu.stt,
          holyName: stu.holyName,
          fullName: stu.fullName,
          gender: stu.gender,
          birthDate: stu.birthDate,
          note: stu.note,
          parentName: stu.parentName,
          parentPhone: stu.parentPhone,
          address: stu.address
        })
      });
      const json = await res.json();
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
    if (!this.isOnline) return false;
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/students.php?id=${encodeURIComponent(studentId)}`, {
        method: 'DELETE'
      });
      const json = await res.json();
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
    if (!this.isOnline) return false;
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
