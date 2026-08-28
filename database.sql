-- ==============================================================================
-- CƠ SỞ DỮ LIỆU CHUẨN HÓA (5 BẢNG LIÊN KẾT TỐI ƯU)
-- HỆ THỐNG QUẢN TRỊ & TRA CỨU GIÁO LÝ - ĐOÀN TNTT GIÁO XỨ TÂN MỸ
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `giaoly_tanmy_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `giaoly_tanmy_db`;

SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------------------------
-- 0. BẢNG TÀI KHOẢN QUẢN TRỊ VIÊN (ADMINS)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `admins`;
CREATE TABLE `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `display_name` VARCHAR(100) DEFAULT 'Ban Quản Trị',
  `role` VARCHAR(20) DEFAULT 'admin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `admins` (`username`, `password`, `display_name`, `role`) VALUES
('admin', 'admin123', 'Quản Trị Viên Giáo Xứ', 'admin'),
('bql', '123456', 'Ban Giáo Lý Tân Mỹ', 'admin');

-- ------------------------------------------------------------------------------
-- BẢNG 1: DANH MỤC THIẾU NHI (STUDENTS) - Chỉ lưu thông tin cá nhân
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `students`;
CREATE TABLE `students` (
  `student_id` VARCHAR(50) NOT NULL PRIMARY KEY COMMENT 'Mã thiếu nhi (Khóa chính)',
  `holy_name` VARCHAR(100) DEFAULT '' COMMENT 'Tên thánh bổn mạng',
  `last_name` VARCHAR(100) NOT NULL COMMENT 'Họ và tên đệm',
  `first_name` VARCHAR(50) NOT NULL COMMENT 'Tên',
  `full_name` VARCHAR(150) NOT NULL COMMENT 'Họ và tên đầy đủ',
  `gender` VARCHAR(10) NOT NULL DEFAULT 'Nam' COMMENT 'Giới tính (Nam/Nữ)',
  `birth_date` VARCHAR(20) DEFAULT '' COMMENT 'Ngày sinh (DD/MM/YYYY)',
  `address` VARCHAR(255) DEFAULT '' COMMENT 'Địa chỉ / Giáo họ',
  `parent_name` VARCHAR(150) DEFAULT '' COMMENT 'Tên Phụ huynh (Cha/Mẹ)',
  `parent_phone` VARCHAR(20) DEFAULT '' COMMENT 'Số điện thoại phụ huynh',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Nạp dữ liệu Thiếu nhi mẫu
INSERT INTO `students` (`student_id`, `holy_name`, `last_name`, `first_name`, `full_name`, `gender`, `birth_date`, `parent_name`, `parent_phone`) VALUES
('TN-DBKT-01', 'Giuse', 'Nguyễn Minh', 'An', 'Nguyễn Minh An', 'Nam', '15/04/2019', 'Nguyễn Văn Hải', '0901234567'),
('TN-DBKT-02', 'Maria', 'Trần Ngọc', 'Hân', 'Trần Ngọc Hân', 'Nữ', '22/08/2019', 'Trần Văn Nam', '0902345678'),
('TN-DBKT-03', 'Phêrô', 'Lê Hoàng', 'Long', 'Lê Hoàng Long', 'Nam', '10/01/2019', 'Lê Văn Tuấn', '0903456789'),
('TN-DBKT-04', 'Anna', 'Phạm Thảo', 'Vy', 'Phạm Thảo Vy', 'Nữ', '05/11/2019', 'Phạm Hữu Nghĩa', '0904567890'),
('TN-DBKT-05', 'Đaminh', 'Hoàng Gia', 'Bảo', 'Hoàng Gia Bảo', 'Nam', '18/06/2019', 'Hoàng Quốc Việt', '0905678901');

-- ------------------------------------------------------------------------------
-- BẢNG 2: DANH MỤC GIÁO LÝ VIÊN (TEACHERS) - Chỉ lưu thông tin cá nhân & chứng chỉ
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `teachers`;
CREATE TABLE `teachers` (
  `teacher_id` VARCHAR(50) NOT NULL PRIMARY KEY COMMENT 'Mã GLV (Khóa chính)',
  `stt` INT NOT NULL COMMENT 'Số thứ tự',
  `holy_name` VARCHAR(100) DEFAULT '' COMMENT 'Tên thánh',
  `last_name` VARCHAR(100) NOT NULL COMMENT 'Họ và tên đệm',
  `first_name` VARCHAR(50) NOT NULL COMMENT 'Tên',
  `gender` VARCHAR(10) NOT NULL DEFAULT 'Nữ' COMMENT 'Giới tính (Nam/Nữ)',
  `cert` VARCHAR(50) DEFAULT '' COMMENT 'Chứng chỉ GLV (Cấp 1, 2, 3, 3 - BMVTN)',
  `phone` VARCHAR(20) DEFAULT '' COMMENT 'Số điện thoại',
  `email` VARCHAR(100) DEFAULT '' COMMENT 'Email liên hệ',
  `photo_url` TEXT DEFAULT NULL COMMENT 'Ảnh thẻ',
  `status` VARCHAR(50) NOT NULL DEFAULT 'Đang dạy học' COMMENT 'Trạng thái hoạt động (Đang dạy học / Hỗ trợ / Tạm nghỉ)',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Nạp 41 Giáo Lý Viên
INSERT INTO `teachers` (`stt`, `teacher_id`, `holy_name`, `last_name`, `first_name`, `gender`, `cert`, `photo_url`) VALUES
(1, 'GLV01', 'MARIA', 'TRẦN THỊ NGỌC', 'ANH', 'Nữ', '2', ''),
(2, 'GLV02', 'ANNA', 'PHẠM VŨ THÙY', 'DƯƠNG', 'Nữ', '1', ''),
(3, 'GLV03', 'MARIA', 'VŨ THỊ THÙY', 'DƯƠNG', 'Nữ', '3', ''),
(4, 'GLV04', 'MARIA', 'NGUYỄN NGỌC THÙY', 'DƯƠNG', 'Nữ', '2', ''),
(5, 'GLV05', 'GIUSE', 'LÊ', 'DUY', 'Nam', '1', ''),
(6, 'GLV06', 'TERESA', 'ĐÀO PHƯƠNG', 'GIANG', 'Nữ', '2', ''),
(7, 'GLV07', 'MARIA', 'TRẦN NGỌC HƯƠNG', 'GIANG', 'Nữ', '2', ''),
(8, 'GLV08', 'TERESA', 'DƯƠNG THỊ MỸ', 'HẠNH', 'Nữ', '3', ''),
(9, 'GLV09', 'TERESA', 'NGUYỄN PHÚC NGỌC', 'HÂN', 'Nữ', '1', ''),
(10, 'GLV10', 'GIUSE', 'NGUYỄN VĂN', 'HIẾU', 'Nam', '3', ''),
(11, 'GLV11', 'TERESA', 'ĐẶNG THỊ KIM', 'HOA', 'Nữ', '2', ''),
(12, 'GLV12', 'MARIA', 'PHAN THỊ THANH', 'HOÀI', 'Nữ', '2', ''),
(13, 'GLV13', 'ĐAMINH', 'ĐẶNG TRẦN NHẬT', 'HOAN', 'Nam', '2', ''),
(14, 'GLV14', 'GIOAN BOSCO', 'ĐỊNH QUANG', 'HUY', 'Nam', '3', ''),
(15, 'GLV15', 'MARIA', 'BÙI DIỆU', 'HUYỀN', 'Nữ', '3', ''),
(16, 'GLV16', 'ĐAMINH', 'ĐÀO BẢO', 'KHANH', 'Nam', '3 - BMVTN', ''),
(17, 'GLV17', 'GIOAN KIM', 'TRẦN VŨ ĐĂNG', 'KHOA', 'Nam', '2 - BMVTN', ''),
(18, 'GLV18', 'MARIA', 'LÂM HOÀI', 'LIÊN', 'Nữ', '3', ''),
(19, 'GLV19', 'GIUSE', 'LÊ DƯƠNG CÔNG', 'MINH', 'Nam', '2 - BMVTN', ''),
(20, 'GLV20', 'MARIA', 'DƯƠNG ĐỖ GIA', 'NGHI', 'Nữ', '3', ''),
(21, 'GLV21', 'GIOANKIM', 'NGUYỄN ĐỨC', 'NHẬT', 'Nam', '1', ''),
(22, 'GLV22', 'MARIA', 'NGUYỄN HÀ UYÊN', 'NHI', 'Nữ', '2', ''),
(23, 'GLV23', 'MARIA', 'NGUYỄN THỊ DIỆU', 'NHƯ', 'Nữ', '1', ''),
(24, 'GLV24', 'MARIA', 'TRẦN NHẬT QUỲNH', 'NHƯ', 'Nữ', '1', ''),
(25, 'GLV25', 'ANNA', 'HOÀNG NHƯ', 'QUỲNH', 'Nữ', '1', ''),
(26, 'GLV26', 'MARIA', 'PHẠM NGUYỄN HƯƠNG', 'QUỲNH', 'Nữ', '1', ''),
(27, 'GLV27', 'TERESA', 'KIM NGUYỄN THANH', 'TÂM', 'Nữ', '2', ''),
(28, 'GLV28', 'PHERO', 'HOÀNG NHẬT', 'TÂN', 'Nam', '1', ''),
(29, 'GLV29', 'MARIA', 'VÕ NGỌC LAN', 'THẢO', 'Nữ', '3', ''),
(30, 'GLV30', 'TERESA', 'ĐỊNH THỊ THANH', 'THẢO', 'Nữ', '3', ''),
(31, 'GLV31', 'ANNA', 'VŨ THỊ', 'THẢO', 'Nữ', '3', ''),
(32, 'GLV32', 'GIUSE', 'VÕ DUY', 'THỐNG', 'Nam', '2', ''),
(33, 'GLV33', 'MARIA', 'VŨ NGỌC ANH', 'THƯ', 'Nữ', '2', ''),
(34, 'GLV34', 'MARIA', 'TRẦN NHẬT ANH', 'THƯ', 'Nữ', '2', ''),
(35, 'GLV35', 'PHERO', 'NGUYỄN TẤN', 'TIẾN', 'Nam', '1', ''),
(36, 'GLV36', 'MARIA', 'BẠCH NGUYỄN BẢO', 'TRÂM', 'Nữ', '1', ''),
(37, 'GLV37', 'TERESA', 'NGUYỄN NHẬT KHÁNH', 'TRÂN', 'Nữ', '3 - BMVTN', ''),
(38, 'GLV38', 'MARIA', 'NGUYỄN THANH', 'TRÚC', 'Nữ', '1', ''),
(39, 'GLV39', 'MARIA', 'ĐOÀN THANH', 'TRÚC', 'Nữ', '', ''),
(40, 'GLV40', 'MARIA', 'TRẦN NGUYỄN PHƯƠNG', 'UYÊN', 'Nữ', '1', ''),
(41, 'GLV41', 'MARIA', 'NGUYỄN KHÁNH', 'VY', 'Nữ', '', '');

-- ------------------------------------------------------------------------------
-- BẢNG 3: DANH MỤC LỚP HỌC (CLASSES) - Thông tin lớp theo từng năm học
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `classes`;
CREATE TABLE `classes` (
  `class_id` VARCHAR(50) NOT NULL PRIMARY KEY COMMENT 'Mã lớp (Ví dụ: DBKT_2627, TS1_2627)',
  `class_name` VARCHAR(100) NOT NULL COMMENT 'Tên lớp (Ví dụ: Dự Bị Khai Tâm, Thêm Sức 1)',
  `block` VARCHAR(50) NOT NULL COMMENT 'Khối lớp (Khai Tâm, Rước Lễ, Thêm Sức, Bao Đồng, Vào Đời)',
  `academic_year` VARCHAR(20) NOT NULL DEFAULT '2026-2027' COMMENT 'Năm học (Ví dụ: 2026-2027)',
  `room` VARCHAR(100) DEFAULT '' COMMENT 'Phòng học',
  `schedule` VARCHAR(100) DEFAULT 'Chủ Nhật: 07:30 - 09:00' COMMENT 'Lịch học',
  `note` TEXT DEFAULT NULL COMMENT 'Ghi chú',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Nạp 13 Lớp học niên khóa 2026 - 2027
INSERT INTO `classes` (`class_id`, `class_name`, `block`, `academic_year`, `room`, `schedule`, `note`) VALUES
('DBKT_2627', 'Dự Bị Khai Tâm', 'Khai Tâm', '2026-2027', 'Phòng 100 (Dãy A)', 'Chủ Nhật: 07:30 - 09:00', 'Lớp ấu nhi làm quen môi trường Giáo Lý & Thiếu Nhi Thánh Thể'),
('KT1_2627', 'Khai Tâm 1', 'Khai Tâm', '2026-2027', 'Phòng 101 (Dãy A)', 'Chủ Nhật: 07:30 - 09:00', 'Lớp chuẩn bị làm quen Giáo Lý & Sinh hoạt Thiếu nhi Thánh Thể'),
('KT2_2627', 'Khai Tâm 2', 'Khai Tâm', '2026-2027', 'Phòng 102 (Dãy A)', 'Chủ Nhật: 07:30 - 09:00', 'Học kinh căn bản, chuyện Phúc Âm và nhân bản Kitô giáo'),
('RL1_2627', 'Rước Lễ 1', 'Rước Lễ', '2026-2027', 'Phòng 201 (Dãy B)', 'Chủ Nhật: 07:30 - 09:00', 'Học lịch sử Cứu Độ và các Bí Tích Nhập Môn'),
('RL2_2627', 'Rước Lễ 2', 'Rước Lễ', '2026-2027', 'Phòng 202 (Dãy B)', 'Chủ Nhật: 07:30 - 09:00', 'Bí tích Thánh Thể & Nghi thức Xưng Tội Rước Lễ Lần Đầu'),
('TS1_2627', 'Thêm Sức 1', 'Thêm Sức', '2026-2027', 'Phòng 301 (Dãy C)', 'Chủ Nhật: 07:30 - 09:00', 'Tìm hiểu ơn Chúa Thánh Thần và Đời sống chứng nhân Kitô hữu'),
('TS2_2627', 'Thêm Sức 2', 'Thêm Sức', '2026-2027', 'Phòng 302 (Dãy C)', 'Chủ Nhật: 07:30 - 09:00', 'Chuẩn bị lãnh nhận Bí Tích Thêm Sức từ Đức Giám Mục'),
('BD1_2627', 'Bao Đồng 1', 'Bao Đồng', '2026-2027', 'Hội Trường A', 'Chủ Nhật: 07:30 - 09:00', 'Tuyên Xưng Đức Tin và Sống Lời Chúa giữa dòng đời'),
('BD2_2627', 'Bao Đồng 2', 'Bao Đồng', '2026-2027', 'Hội Trường B', 'Chủ Nhật: 07:30 - 09:00', 'Tuyên Hứa Bao Đồng & Trưởng thành trong đời sống Kitô hữu'),
('BD3_2627', 'Bao Đồng 3', 'Bao Đồng', '2026-2027', 'Phòng 401 (Dãy D)', 'Chủ Nhật: 07:30 - 09:00', 'Học hỏi Giáo lý Hội Thánh và Thần học căn bản'),
('BD4_2627', 'Bao Đồng 4', 'Bao Đồng', '2026-2027', 'Phòng 402 (Dãy D)', 'Chủ Nhật: 07:30 - 09:00', 'Tìm hiểu ơn gọi và định hướng tương lai theo tinh thần Tin Mừng'),
('VD1_2627', 'Vào Đời 1', 'Vào Đời', '2026-2027', 'Phòng Sinh Hoạt 1', 'Chủ Nhật: 07:30 - 09:00', 'Đạo đức sinh học, Hôn nhân gia đình và Thử thách xã hội'),
('VD2_2627', 'Vào Đời 2', 'Vào Đời', '2026-2027', 'Phòng Sinh Hoạt 2', 'Chủ Nhật: 07:30 - 09:00', 'Dấn thân phục vụ Giáo Xứ và chuẩn bị trở thành Huynh Trưởng');

-- ------------------------------------------------------------------------------
-- BẢNG 4: PHÂN CÔNG PHỤ TRÁCH (CLASS_ASSIGNMENTS) - Liên kết GLV và Lớp
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `class_assignments`;
CREATE TABLE `class_assignments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `class_id` VARCHAR(50) NOT NULL COMMENT 'Mã lớp (Khóa ngoại)',
  `teacher_id` VARCHAR(50) NOT NULL COMMENT 'Mã GLV (Khóa ngoại)',
  `role` VARCHAR(100) DEFAULT 'Đồng hành' COMMENT 'Vai trò phụ trách (Chủ nhiệm, Đồng hành, Hỗ trợ)',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`class_id`) REFERENCES `classes`(`class_id`) ON DELETE CASCADE,
  FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`teacher_id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_class_teacher` (`class_id`, `teacher_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Phân công GLV vào các lớp theo 3 vai trò: Chủ nhiệm, Đồng hành, Hỗ trợ
INSERT INTO `class_assignments` (`class_id`, `teacher_id`, `role`) VALUES
('DBKT_2627', 'GLV05', 'Chủ nhiệm'),
('DBKT_2627', 'GLV24', 'Đồng hành'),
('KT1_2627', 'GLV01', 'Chủ nhiệm'),
('KT1_2627', 'GLV11', 'Đồng hành'),
('KT2_2627', 'GLV22', 'Chủ nhiệm'),
('KT2_2627', 'GLV38', 'Đồng hành'),
('KT2_2627', 'GLV36', 'Hỗ trợ'),
('RL1_2627', 'GLV25', 'Chủ nhiệm'),
('RL1_2627', 'GLV07', 'Đồng hành'),
('RL1_2627', 'GLV06', 'Đồng hành'),
('RL2_2627', 'GLV31', 'Chủ nhiệm'),
('RL2_2627', 'GLV35', 'Đồng hành'),
('RL2_2627', 'GLV21', 'Đồng hành'),
('RL2_2627', 'GLV32', 'Hỗ trợ'),
('TS1_2627', 'GLV04', 'Chủ nhiệm'),
('TS1_2627', 'GLV23', 'Đồng hành'),
('TS1_2627', 'GLV34', 'Hỗ trợ'),
('TS2_2627', 'GLV12', 'Chủ nhiệm'),
('TS2_2627', 'GLV27', 'Đồng hành'),
('TS2_2627', 'GLV09', 'Đồng hành'),
('TS2_2627', 'GLV02', 'Đồng hành'),
('TS2_2627', 'GLV15', 'Hỗ trợ'),
('TS2_2627', 'GLV40', 'Hỗ trợ'),
('BD1_2627', 'GLV13', 'Chủ nhiệm'),
('BD1_2627', 'GLV26', 'Đồng hành'),
('BD1_2627', 'GLV29', 'Hỗ trợ'),
('BD2_2627', 'GLV03', 'Chủ nhiệm'),
('BD2_2627', 'GLV08', 'Đồng hành'),
('BD2_2627', 'GLV10', 'Đồng hành'),
('BD2_2627', 'GLV30', 'Đồng hành'),
('BD2_2627', 'GLV39', 'Hỗ trợ'),
('BD3_2627', 'GLV14', 'Chủ nhiệm'),
('BD3_2627', 'GLV18', 'Đồng hành'),
('BD3_2627', 'GLV28', 'Hỗ trợ'),
('VD1_2627', 'GLV16', 'Chủ nhiệm'),
('VD1_2627', 'GLV17', 'Đồng hành'),
('VD1_2627', 'GLV20', 'Đồng hành'),
('VD1_2627', 'GLV41', 'Hỗ trợ'),
('VD2_2627', 'GLV19', 'Chủ nhiệm'),
('VD2_2627', 'GLV37', 'Đồng hành');

-- ------------------------------------------------------------------------------
-- BẢNG 5: BẢNG ĐIỂM & XẾP LỚP (ENROLLMENTS_AND_GRADES) - Liên kết Thiếu Nhi và Lớp
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `enrollments_and_grades`;
CREATE TABLE `enrollments_and_grades` (
  `id` INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Mã bảng điểm (Khóa chính tự tăng)',
  `student_id` VARCHAR(50) NOT NULL COMMENT 'Mã thiếu nhi (Khóa ngoại)',
  `class_id` VARCHAR(50) NOT NULL COMMENT 'Mã lớp (Khóa ngoại)',
  `academic_year` VARCHAR(20) NOT NULL DEFAULT '2026-2027' COMMENT 'Năm học',
  `stt_in_class` INT NOT NULL DEFAULT 1 COMMENT 'Số thứ tự trong lớp',
  `role_in_class` VARCHAR(100) DEFAULT 'Đang theo học' COMMENT 'Vai trò (Lớp trưởng, Lớp phó, Ban Lễ Sinh, Ca đoàn, Đang theo học)',
  
  -- Điểm Học Kỳ 1
  `score_attendance_1` DECIMAL(4,2) DEFAULT NULL COMMENT 'Chuyên cần HK1',
  `score_oral_1` DECIMAL(4,2) DEFAULT NULL COMMENT 'Điểm Miệng HK1',
  `score_15m_1` DECIMAL(4,2) DEFAULT NULL COMMENT 'Điểm 15 phút HK1',
  `score_1period_1` DECIMAL(4,2) DEFAULT NULL COMMENT 'Điểm 1 tiết HK1',
  `score_exam_1` DECIMAL(4,2) DEFAULT NULL COMMENT 'Điểm Thi HK1',
  `score_avg_1` DECIMAL(4,2) DEFAULT NULL COMMENT 'Điểm Trung Bình HK1',
  
  -- Điểm Học Kỳ 2
  `score_attendance_2` DECIMAL(4,2) DEFAULT NULL COMMENT 'Chuyên cần HK2',
  `score_oral_2` DECIMAL(4,2) DEFAULT NULL COMMENT 'Điểm Miệng HK2',
  `score_15m_2` DECIMAL(4,2) DEFAULT NULL COMMENT 'Điểm 15 phút HK2',
  `score_1period_2` DECIMAL(4,2) DEFAULT NULL COMMENT 'Điểm 1 tiết HK2',
  `score_exam_2` DECIMAL(4,2) DEFAULT NULL COMMENT 'Điểm Thi HK2',
  `score_avg_2` DECIMAL(4,2) DEFAULT NULL COMMENT 'Điểm Trung Bình HK2',
  
  -- Điểm Tổng Kết Cả Năm
  `score_final` DECIMAL(4,2) DEFAULT NULL COMMENT 'Điểm Tổng Kết Cả Năm',
  `evaluation` VARCHAR(50) DEFAULT 'Đang học' COMMENT 'Xếp loại (Xuất Sắc, Giỏi, Khá, Đạt, Chưa đạt)',
  `note` TEXT DEFAULT NULL COMMENT 'Ghi chú học tập / Hạnh kiểm',
  
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`student_id`) ON DELETE CASCADE,
  FOREIGN KEY (`class_id`) REFERENCES `classes`(`class_id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_student_class_year` (`student_id`, `class_id`, `academic_year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Nạp bảng điểm & xếp lớp mẫu
INSERT INTO `enrollments_and_grades` 
(`student_id`, `class_id`, `academic_year`, `stt_in_class`, `role_in_class`, `score_attendance_1`, `score_oral_1`, `score_15m_1`, `score_1period_1`, `score_exam_1`, `score_avg_1`, `score_final`, `evaluation`) 
VALUES
('TN-DBKT-01', 'DBKT_2627', '2026-2027', 1, 'Lớp trưởng', 10.0, 9.0, 9.5, 9.0, 9.5, 9.4, 9.4, 'Xuất Sắc'),
('TN-DBKT-02', 'DBKT_2627', '2026-2027', 2, 'Lớp phó học tập', 10.0, 8.5, 9.0, 8.5, 9.0, 8.9, 8.9, 'Giỏi'),
('TN-DBKT-03', 'DBKT_2627', '2026-2027', 3, 'Đang theo học', 9.0, 8.0, 8.0, 8.5, 8.0, 8.2, 8.2, 'Khá'),
('TN-DBKT-04', 'DBKT_2627', '2026-2027', 4, 'Đang theo học', 9.5, 8.5, 8.5, 9.0, 8.5, 8.7, 8.7, 'Giỏi'),
('TN-DBKT-05', 'DBKT_2627', '2026-2027', 5, 'Ban Lễ Sinh', 10.0, 9.0, 8.5, 9.0, 9.0, 9.0, 9.0, 'Giỏi');

-- ------------------------------------------------------------------------------
-- BẢNG 6: THÔNG BÁO & TIN TỨC (NEWS)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `news`;
CREATE TABLE `news` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `news_id` VARCHAR(50) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(50) NOT NULL DEFAULT 'Khẩn',
  `date` VARCHAR(50) DEFAULT NULL,
  `author` VARCHAR(150) DEFAULT NULL,
  `summary` TEXT DEFAULT NULL,
  `content` LONGTEXT NOT NULL,
  `is_pinned` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `news` (`news_id`, `title`, `category`, `date`, `author`, `summary`, `content`, `is_pinned`) VALUES
('NEWS01', 'Lễ Khai Giảng & Ra Mắt Xứ Đoàn TNTT Giáo Xứ Tân Mỹ Năm Học 2026 - 2027', 'Khẩn', '26/08/2026', 'Ban Quản Trị Xứ Đoàn TNTT', 'Ban Giáo Lý kính gửi quý phụ huynh và các em thiếu nhi toàn đoàn thời gian tập trung khai giảng, chương trình Thánh lễ tạ ơn và dặn dò đồng phục chuẩn TNTT.', 'Kính gửi: Quý Phụ Huynh, Anh Chị Huynh Trưởng và các em Thiếu Nhi toàn đoàn.\n\nNhằm chuẩn bị chu đáo cho niên khóa Giáo lý mới 2026 - 2027, Ban Quản Trị Đoàn Thiếu Nhi Thánh Thể Giáo xứ Tân Mỹ xin thông báo chương trình Lễ Khai Giảng như sau:\n\n1. Thời gian tập trung: 06h30 Chúa Nhật, ngày 06/09/2026 tại khuôn viên Giáo xứ.\n2. Thánh Lễ Tạ Ơn & Khai Giảng: 07h00 - 08h30 do Cha Tuyên Úy chủ tế.\n3. Quy định trang phục: Đồng phục Thiếu Nhi Thánh Thể chỉnh tề (áo trắng có huy hiệu, khăn quàng đúng ngành, quần sẫm màu).\n4. Sinh hoạt nhận lớp: Ngay sau Thánh lễ, các em sẽ di chuyển về các phòng học Giáo lý tương ứng theo sơ đồ hướng dẫn của Huynh Trưởng phụ trách.\n\nKính mong quý phụ huynh nhắc nhở và đưa đón các em đúng giờ để buổi lễ diễn ra trang nghiêm và sốt sắng.', 1),
('NEWS02', 'Lịch Phân Công Huynh Trưởng - Giáo Lý Viên Đứng Lớp Năm Học 2026 - 2027', 'GLV', '24/08/2026', 'Cha Tuyên Úy & Ban Điều Hành', 'Công bố quyết định phân công phụ trách giảng dạy cho 41 Anh Chị Huynh Trưởng & GLV tại 14 lớp thuộc 5 khối Giáo Lý.', 'Quyết định phân công nhiệm vụ giảng dạy Giáo lý niên khóa 2026 - 2027:\n\n- Tổng số GLV đứng lớp: 41 Huynh Trưởng & GLV.\n- Khối Khai Tâm (Dự Bị, KT1, KT2): 8 GLV phụ trách.\n- Khối Rước Lễ (RL1, RL2, RL3): 9 GLV phụ trách.\n- Khối Thêm Sức (TS1, TS2, TS3): 9 GLV phụ trách.\n- Khối Bao Đồng (BD1, BD2, BD3): 9 GLV phụ trách.\n- Khối Vào Đời (VD1, VD2): 6 GLV phụ trách.\n\nKính mời quý Anh Chị GLV kiểm tra thông tin phân công chi tiết tại mục \"Lớp Giáo Lý\" và \"Giáo Lý Viên\" trên cổng thông tin này.', 0),
('NEWS03', 'Quy Định Về Giờ Lễ Thứ 5 và Lễ Chúa Nhật Của Thiếu Nhi', 'Lịch Lễ', '20/08/2026', 'Ban Phụng Vụ Xứ Đoàn', 'Thông báo chi tiết thời gian sinh hoạt, tham dự Thánh lễ Thứ 5 và Chúa Nhật dành cho tất cả các ngành Chiên Con, Ấu Nhi, Thiếu Nhi, Nghĩa Sĩ.', 'Lịch Phụng Vụ & Sinh Hoạt Cố Định Hằng Tuần:\n\n1. Thánh Lễ Chiều Thứ 5:\n   - Tập trung & điểm danh: 17h45 tại nhà thờ.\n   - Thánh Lễ: 18h00 - 18h45.\n\n2. Thánh Lễ & Học Giáo Lý Chúa Nhật:\n   - Tập trung chào cờ TNTT: 06h45.\n   - Thánh Lễ Thiếu Nhi: 07h00 - 08h00.\n   - Giờ học Giáo Lý: 08h15 - 09h30.\n\nĐiểm chuyên cần tham dự Lễ Thứ 5, Lễ Chúa Nhật và Giờ học Giáo lý sẽ được tính trực tiếp vào Sổ Điểm Điện Tử của từng em.', 0),
('NEWS04', 'Chương Trình Sa Mạc Huấn Luyện Huynh Trưởng \"Vươn Lên Với Chúa Kitô\"', 'Sự Kiện', '15/08/2026', 'Ban Huấn Luyện TNTT', 'Kế hoạch tổ chức sa mạc bồi dưỡng linh đạo, kỹ năng quản trò và phương pháp sư phạm Giáo lý cho toàn thể Huynh Trưởng.', 'Khóa Sa Mạc Huấn Luyện Huynh Trưởng - GLV Năm 2026:\n\n- Chủ đề: \"Vươn Lên Với Chúa Kitô\"\n- Thời gian: 2 ngày 1 đêm (thứ Bảy và Chúa Nhật cuối tháng 8/2026).\n- Nội dung: Linh đạo TNTT, phương pháp dạy Giáo lý trực quan, sơ cấp cứu, kỹ năng gút dây, mật thư và tinh thần đồng đội.\n- Yêu cầu: 100% GLV trong danh sách đứng lớp tham dự đầy đủ.', 0),
('NEWS05', 'Họp Mặt Phụ Huynh Đầu Năm Học & Trao Đổi Đồng Hành Cùng Con Em', 'Phụ Huynh', '10/08/2026', 'Ban Giáo Lý Xứ Đoàn', 'Trân trọng kính mời quý phụ huynh tham dự buổi gặp gỡ đầu năm để thống nhất nội quy và phương thức nhận thông tin điểm số qua Sổ Điểm Điện Tử.', 'Kính gửi Quý Phụ Huynh,\n\nNhằm tạo sự gắn kết chặt chẽ giữa Gia Đình và Xứ Đoàn trong việc giáo dục đức tin cho các em, Ban Giáo Lý trân trọng kính mời quý phụ huynh tham dự buổi họp mặt:\n\n- Thời gian: 09h30 Chúa Nhật, ngày 13/09/2026 (sau giờ học Giáo lý).\n- Địa điểm: Hội trường Giáo xứ Tân Mỹ.\n- Nội dung: Giới thiệu chương trình học các khối, quy chế chuyên cần, hướng dẫn tra cứu Sổ Điểm Điện Tử và Phiếu Báo Điểm cá nhân.\n\nSự hiện diện của quý phụ huynh là niềm khích lệ to lớn cho các em thiếu nhi và ban giáo lý.', 0),
('NEWS06', 'Kế Hoạch Khảo Sát & Đánh Giá Chất Lượng Học Kỳ 1 (HK1)', 'Lịch Lễ', '05/08/2026', 'Ban Khảo Thí & Học Vụ', 'Hướng dẫn cơ cấu điểm kiểm tra miệng, 15 phút, 1 tiết và thi học kỳ theo chuẩn chương trình Giáo lý Tân Mỹ.', 'Kế hoạch đánh giá kết quả học tập Giáo lý HK1:\n\n1. Điểm Chuyên cần: Tính theo tỷ lệ tham gia Lễ Thứ 5, Lễ Chúa Nhật và Giờ học Giáo lý (Hệ số 5).\n2. Điểm Kiểm tra môn Giáo lý:\n   - Điểm Miệng: Hệ số 1 (trong các giờ học).\n   - Kiểm tra 15 phút: Hệ số 1 (tuần 6 của học kỳ).\n   - Kiểm tra 1 Tiết: Hệ số 2 (tuần 10 của học kỳ).\n   - Thi Học Kỳ: Hệ số 3 (cuối học kỳ).\n\nKết quả sẽ được công bố trên Sổ Điểm Điện Tử và gửi Phiếu Báo Điểm về cho gia đình.', 0);

-- ------------------------------------------------------------------------------
-- BẢNG 7: KHO TÀI LIỆU & GIÁO TRÌNH (DOCUMENTS)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `documents`;
CREATE TABLE `documents` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `doc_id` VARCHAR(50) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(50) NOT NULL DEFAULT 'Giáo Trình',
  `format` VARCHAR(20) NOT NULL DEFAULT 'PDF',
  `target` VARCHAR(150) DEFAULT NULL,
  `size` VARCHAR(50) DEFAULT NULL,
  `author` VARCHAR(150) DEFAULT NULL,
  `downloads` INT NOT NULL DEFAULT 0,
  `desc` TEXT DEFAULT NULL,
  `content` LONGTEXT DEFAULT NULL,
  `file_url` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `documents` (`doc_id`, `title`, `category`, `format`, `target`, `size`, `author`, `downloads`, `desc`, `content`) VALUES
('DOC01', 'Sách Giáo Lý Khối Khai Tâm (Bản Chuẩn GP. Phú Cường)', 'Giáo Trình', 'PDF', 'Khối Khai Tâm (Lớp Dự Bị, KT1, KT2)', '4.2 MB', 'Ủy Ban Giáo Lý GP Phú Cường', 320, 'Giáo trình tranh ảnh đầy đủ màu sắc dành cho các em 6-8 tuổi bắt đầu làm quen với Chúa Giêsu, lời cầu nguyện và các nhân vật Kinh Thánh.', 'Tài liệu gồm 24 bài học căn bản về Thiên Chúa Tình Yêu, Chúa Giêsu Bạn Của Trẻ Thơ, Đức Mẹ Maria và những kinh nguyện đầu đời.'),
('DOC02', 'Sách Giáo Lý Đến Bàn Tiệc Thánh - Khối Rước Lễ', 'Giáo Trình', 'PDF', 'Khối Rước Lễ (RL1, RL2, RL3)', '5.8 MB', 'Ủy Ban Giáo Lý Đức Tin', 415, 'Tài liệu chuẩn bị tâm hồn cho các em xưng tội và rước lễ lần đầu, gồm các bí tích Hòa Giải và Thánh Thể.', 'Tài liệu gồm 30 bài học chuyên sâu về Bí Tích Hòa Giải, Bí Tích Thánh Thể, 10 Điều Răn và 6 Điều Răn Hội Thánh.'),
('DOC03', 'Sách Giáo Lý Lớn Lên Trong Chúa Thánh Thần - Khối Thêm Sức', 'Giáo Trình', 'PDF', 'Khối Thêm Sức (TS1, TS2, TS3)', '6.1 MB', 'Ủy Ban Giáo Lý Đức Tin', 380, 'Giáo trình bồi dưỡng đức tin và 7 ơn Chúa Thánh Thần giúp các em sẵn sàng lãnh nhận Bí tích Thêm Sức.', 'Gồm 32 bài học về Chúa Thánh Thần, Hội Thánh, Phụng Vụ, 7 Ơn Chúa Thánh Thần và Đời Sống Đức Tin Trưởng Thành.'),
('DOC04', 'Sách Giáo Lý Sống Đạo Giữa Đời - Khối Bao Đồng', 'Giáo Trình', 'PDF', 'Khối Bao Đồng (BD1, BD2, BD3)', '7.0 MB', 'Ủy Ban Giáo Lý GP Phú Cường', 290, 'Giáo trình tuyên xưng đức tin, sống đạo và đối thoại giữa người Kitô hữu trong xã hội hiện đại.', 'Gồm 36 bài học về Luân Lý Công Giáo, Nhân Bản Kitô Giáo, Lương Tâm, Tội Lỗi và Ơn Cứu Độ.'),
('DOC05', 'Sách Giáo Lý Hành Trang Vào Đời - Khối Vào Đời', 'Giáo Trình', 'PDF', 'Khối Vào Đời (VD1, VD2)', '6.5 MB', 'Ủy Ban Giáo Lý Đức Tin', 260, 'Hành trang định hướng ơn gọi, hôn nhân gia đình, đạo đức nghề nghiệp và sứ vụ tông đồ giáo dân.', 'Gồm 28 bài học định hướng tương lai, tình yêu - hôn nhân Kitô giáo, trách nhiệm xã hội và ơn gọi đời sống.'),
('DOC06', 'Nội Quy & Sổ Tay Huynh Trưởng Thiếu Nhi Thánh Thể VN', 'Sổ Tay', 'PDF', 'Dành Cho GLV & Huynh Trưởng', '3.5 MB', 'Tổng Liên Đoàn TNTT Việt Nam', 510, 'Cẩm nang toàn diện về phương pháp tự nhiên, siêu nhiên, hiệu lệnh còi cờ, nghi thức chào cờ và linh đạo TNTT.', 'Quy định đầy đủ về đồng phục, cấp bậc, nghi thức tuyên hứa, quản lý đoàn sinh và điều hành sa mạc huấn luyện.'),
('DOC07', 'Sổ Tay Kỹ Năng & Trò Chơi Sinh Hoạt Thiếu Nhi', 'Sổ Tay', 'DOCX', 'Dành Cho GLV Đứng Lớp', '2.1 MB', 'Ban Kỹ Năng Xứ Đoàn Tân Mỹ', 440, 'Tổng hợp hơn 150 trò chơi vòng tròn, băng reo, trò chơi Kinh Thánh, gút dây và mật thư ứng dụng.', 'Bộ sưu tập trò chơi sinh hoạt giáo lý theo từng chủ đề bài học, giúp giờ học luôn hào hứng và sôi nổi.'),
('DOC08', 'Tuyển Tập Bài Hát Sinh Hoạt & Nghi Thức TNTT (Có Hợp Âm)', 'Kinh & Hát', 'MP3', 'Toàn Đoàn Thiếu Nhi & GLV', '12.8 MB', 'Ban Âm Nhạc TNTT', 680, 'Tuyển tập 50 bài hát sinh hoạt, bài ca chính thức của các ngành Ấu, Thiếu, Nghĩa và Huynh Trưởng.', 'Bao gồm file nghe MP3 chất lượng cao và lời bài hát kèm hợp âm guitar/organ đệm hát trong giờ chào cờ và sinh hoạt.'),
('DOC09', 'Kinh Nguyện Hằng Ngày Dành Cho Thiếu Nhi Thánh Thể', 'Kinh & Hát', 'PDF', 'Toàn Thể Thiếu Nhi', '1.5 MB', 'Ban Phụng Vụ Tân Mỹ', 590, 'Bản in bỏ túi các kinh nguyện sáng tối, kinh dâng ngày, kinh viếng Chúa, kinh dâng hoa và kinh bổn mạng.', 'Lời kinh chữ to, rõ ràng, dễ nhớ, có hình minh họa sinh động dành cho các em thiếu nhi học thuộc.'),
('DOC10', 'Biểu Mẫu Sổ Điểm Điện Tử & Bảng Điểm Lớp Giáo Lý 2026 - 2027', 'Biểu Mẫu', 'XLSX', 'Giáo Lý Viên & Ban Học Vụ', '1.2 MB', 'Ban Công Nghệ - Tân Mỹ', 350, 'Mẫu bảng tính Excel chuẩn gồm đầy đủ 3 Sheet: Học Kỳ 1, Học Kỳ 2, Tổng Kết Cả Năm có tích hợp sẵn công thức tính điểm trung bình và xếp loại.', 'Biểu mẫu sẵn sàng nạp trực tiếp vào hệ thống web qua chức năng "Nhập Excel" của Sổ Điểm Điện Tử.');

SET FOREIGN_KEY_CHECKS = 1;

