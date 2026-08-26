-- ==============================================================================
-- CƠ SỞ DỮ LIỆU: HỆ THỐNG QUẢN LÝ & TRA CỨU GIÁO LÝ VIÊN - LỚP HỌC
-- ĐOÀN THIẾU NHI THÁNH THỂ - GIÁO XỨ TÂN MỸ (NIÊN KHÓA 2026 - 2027)
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `giaoly_tanmy_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `giaoly_tanmy_db`;

-- ------------------------------------------------------------------------------
-- 1. BẢNG TÀI KHOẢN QUẢN TRỊ VIÊN (ADMINS)
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

-- Mật khẩu mặc định: admin123 (hoặc 123456)
INSERT INTO `admins` (`username`, `password`, `display_name`, `role`) VALUES
('admin', 'admin123', 'Quản Trị Viên Giáo Xứ', 'admin'),
('bql', '123456', 'Ban Giáo Lý Tân Mỹ', 'admin');

-- ------------------------------------------------------------------------------
-- 2. BẢNG GIÁO LÝ VIÊN / HUYNH TRƯỞNG (TEACHERS)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `teachers`;
CREATE TABLE `teachers` (
  `id` VARCHAR(10) NOT NULL PRIMARY KEY,
  `stt` INT NOT NULL,
  `holy_name` VARCHAR(100) DEFAULT '',
  `last_name` VARCHAR(100) NOT NULL,
  `first_name` VARCHAR(50) NOT NULL,
  `gender` VARCHAR(10) NOT NULL DEFAULT 'Nữ',
  `cert` VARCHAR(50) DEFAULT '',
  `block` VARCHAR(50) DEFAULT '',
  `teaching_class` VARCHAR(100) DEFAULT '',
  `photo_url` TEXT DEFAULT NULL,
  `status` VARCHAR(20) DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Nạp 41 Giáo Lý Viên mẫu
INSERT INTO `teachers` (`stt`, `id`, `holy_name`, `last_name`, `first_name`, `gender`, `cert`, `block`, `teaching_class`, `photo_url`) VALUES
(1, 'GLV01', 'MARIA', 'TRẦN THỊ NGỌC', 'ANH', 'Nữ', '2', 'Khai Tâm', 'Khai Tâm 1', ''),
(2, 'GLV02', 'ANNA', 'PHẠM VŨ THÙY', 'DƯƠNG', 'Nữ', '1', 'Thêm Sức', 'Thêm Sức 2', ''),
(3, 'GLV03', 'MARIA', 'VŨ THỊ THÙY', 'DƯƠNG', 'Nữ', '3', 'Bao Đồng', 'Bao Đồng 2', ''),
(4, 'GLV04', 'MARIA', 'NGUYỄN NGỌC THÙY', 'DƯƠNG', 'Nữ', '2', 'Thêm Sức', 'Thêm Sức 1', ''),
(5, 'GLV05', 'GIUSE', 'LÊ', 'DUY', 'Nam', '1', 'Khai Tâm', 'Dự Bị Khai Tâm', ''),
(6, 'GLV06', 'TERESA', 'ĐÀO PHƯƠNG', 'GIANG', 'Nữ', '2', 'Rước Lễ', 'Rước Lễ 1', ''),
(7, 'GLV07', 'MARIA', 'TRẦN NGỌC HƯƠNG', 'GIANG', 'Nữ', '2', 'Rước Lễ', 'Rước Lễ 1', ''),
(8, 'GLV08', 'TERESA', 'DƯƠNG THỊ MỸ', 'HẠNH', 'Nữ', '3', 'Bao Đồng', 'Bao Đồng 2', ''),
(9, 'GLV09', 'TERESA', 'NGUYỄN PHÚC NGỌC', 'HÂN', 'Nữ', '1', 'Thêm Sức', 'Thêm Sức 2', ''),
(10, 'GLV10', 'GIUSE', 'NGUYỄN VĂN', 'HIẾU', 'Nam', '3', 'Bao Đồng', 'Bao Đồng 2', ''),
(11, 'GLV11', 'TERESA', 'ĐẶNG THỊ KIM', 'HOA', 'Nữ', '2', 'Khai Tâm', 'Khai Tâm 1', ''),
(12, 'GLV12', 'MARIA', 'PHAN THỊ THANH', 'HOÀI', 'Nữ', '2', 'Thêm Sức', 'Thêm Sức 2', ''),
(13, 'GLV13', 'ĐAMINH', 'ĐẶNG TRẦN NHẬT', 'HOAN', 'Nam', '2', 'Bao Đồng', 'Bao Đồng 1', ''),
(14, 'GLV14', 'GIOAN BOSCO', 'ĐỊNH QUANG', 'HUY', 'Nam', '3', 'Bao Đồng', 'Bao Đồng 3', ''),
(15, 'GLV15', 'MARIA', 'BÙI DIỆU', 'HUYỀN', 'Nữ', '3', 'Thêm Sức', 'Thêm Sức 3', ''),
(16, 'GLV16', 'ĐAMINH', 'ĐÀO BẢO', 'KHANH', 'Nam', '3 - BMVTN', 'Vào Đời', 'Vào Đời 1', ''),
(17, 'GLV17', 'GIOAN KIM', 'TRẦN VŨ ĐĂNG', 'KHOA', 'Nam', '2 - BMVTN', 'Vào Đời', 'Vào Đời 1', ''),
(18, 'GLV18', 'MARIA', 'LÂM HOÀI', 'LIÊN', 'Nữ', '3', 'Bao Đồng', 'Bao Đồng 3', ''),
(19, 'GLV19', 'GIUSE', 'LÊ DƯƠNG CÔNG', 'MINH', 'Nam', '2 - BMVTN', 'Vào Đời', 'Vào Đời 2', ''),
(20, 'GLV20', 'MARIA', 'DƯƠNG ĐỖ GIA', 'NGHI', 'Nữ', '3', 'Vào Đời', 'Vào Đời 1', ''),
(21, 'GLV21', 'GIOANKIM', 'NGUYỄN ĐỨC', 'NHẬT', 'Nam', '1', 'Rước Lễ', 'Rước Lễ 2', ''),
(22, 'GLV22', 'MARIA', 'NGUYỄN HÀ UYÊN', 'NHI', 'Nữ', '2', 'Khai Tâm', 'Khai Tâm 2', ''),
(23, 'GLV23', 'MARIA', 'NGUYỄN THỊ DIỆU', 'NHƯ', 'Nữ', '1', 'Thêm Sức', 'Thêm Sức 1', ''),
(24, 'GLV24', 'MARIA', 'TRẦN NHẬT QUỲNH', 'NHƯ', 'Nữ', '1', 'Khai Tâm', 'Khai Tâm 2', ''),
(25, 'GLV25', 'ANNA', 'HOÀNG NHƯ', 'QUỲNH', 'Nữ', '1', 'Rước Lễ', 'Rước Lễ 1', ''),
(26, 'GLV26', 'MARIA', 'PHẠM NGUYỄN HƯƠNG', 'QUỲNH', 'Nữ', '1', 'Bao Đồng', 'Bao Đồng 1', ''),
(27, 'GLV27', 'TERESA', 'KIM NGUYỄN THANH', 'TÂM', 'Nữ', '2', 'Thêm Sức', 'Thêm Sức 2', ''),
(28, 'GLV28', 'PHERO', 'HOÀNG NHẬT', 'TÂN', 'Nam', '1', 'Bao Đồng', 'Bao Đồng 3', ''),
(29, 'GLV29', 'MARIA', 'VÕ NGỌC LAN', 'THẢO', 'Nữ', '3', 'Bao Đồng', 'Bao Đồng 1', ''),
(30, 'GLV30', 'TERESA', 'ĐỊNH THỊ THANH', 'THẢO', 'Nữ', '3', 'Bao Đồng', 'Bao Đồng 2', ''),
(31, 'GLV31', 'ANNA', 'VŨ THỊ', 'THẢO', 'Nữ', '3', 'Rước Lễ', 'Rước Lễ 2', ''),
(32, 'GLV32', 'GIUSE', 'VÕ DUY', 'THỐNG', 'Nam', '2', 'Rước Lễ', 'Rước Lễ 3', ''),
(33, 'GLV33', 'MARIA', 'VŨ NGỌC ANH', 'THƯ', 'Nữ', '2', 'Rước Lễ', 'Rước Lễ 3', ''),
(34, 'GLV34', 'MARIA', 'TRẦN NHẬT ANH', 'THƯ', 'Nữ', '2', 'Thêm Sức', 'Thêm Sức 1', ''),
(35, 'GLV35', 'PHERO', 'NGUYỄN TẤN', 'TIẾN', 'Nam', '1', 'Rước Lễ', 'Rước Lễ 2', ''),
(36, 'GLV36', 'MARIA', 'BẠCH NGUYỄN BẢO', 'TRÂM', 'Nữ', '1', 'Khai Tâm', 'Khai Tâm 2', ''),
(37, 'GLV37', 'TERESA', 'NGUYỄN NHẬT KHÁNH', 'TRÂN', 'Nữ', '3 - BMVTN', 'Vào Đời', 'Vào Đời 2', ''),
(38, 'GLV38', 'MARIA', 'NGUYỄN THANH', 'TRÚC', 'Nữ', '1', 'Khai Tâm', 'Khai Tâm 2', ''),
(39, 'GLV39', 'MARIA', 'ĐOÀN THANH', 'TRÚC', 'Nữ', '', 'Bao Đồng', 'Bao Đồng 2', ''),
(40, 'GLV40', 'MARIA', 'TRẦN NGUYỄN PHƯƠNG', 'UYÊN', 'Nữ', '1', 'Thêm Sức', 'Thêm Sức 3', ''),
(41, 'GLV41', 'MARIA', 'NGUYỄN KHÁNH', 'VY', 'Nữ', '', 'Vào Đời', 'Vào Đời 1', '');

-- ------------------------------------------------------------------------------
-- 3. BẢNG LỚP GIÁO LÝ (CLASSES)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `classes`;
CREATE TABLE `classes` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `block` VARCHAR(50) NOT NULL,
  `room` VARCHAR(100) DEFAULT '',
  `schedule` VARCHAR(100) DEFAULT 'Chủ Nhật: 07:30 - 09:00',
  `student_count` INT DEFAULT 0,
  `teacher_ids` TEXT DEFAULT NULL, -- JSON array lưu các mã GLV phụ trách
  `note` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Nạp 13 Lớp học mẫu
INSERT INTO `classes` (`id`, `name`, `block`, `room`, `schedule`, `student_count`, `teacher_ids`, `note`) VALUES
('CLASS_DBKT', 'Dự Bị Khai Tâm', 'Khai Tâm', 'Phòng 100 (Dãy A)', 'Chủ Nhật: 07:30 - 09:00', 24, '[\"GLV05\", \"GLV24\"]', 'Lớp ấu nhi làm quen môi trường Giáo Lý & Thiếu Nhi Thánh Thể'),
('CLASS_KT1', 'Khai Tâm 1', 'Khai Tâm', 'Phòng 101 (Dãy A)', 'Chủ Nhật: 07:30 - 09:00', 26, '[\"GLV01\", \"GLV11\"]', 'Lớp chuẩn bị làm quen Giáo Lý & Sinh hoạt Thiếu nhi Thánh Thể'),
('CLASS_KT2', 'Khai Tâm 2', 'Khai Tâm', 'Phòng 102 (Dãy A)', 'Chủ Nhật: 07:30 - 09:00', 28, '[\"GLV22\", \"GLV38\", \"GLV36\"]', 'Học kinh căn bản, chuyện Phúc Âm và nhân bản Kitô giáo'),
('CLASS_RL1', 'Rước Lễ 1', 'Rước Lễ', 'Phòng 201 (Dãy B)', 'Chủ Nhật: 07:30 - 09:00', 30, '[\"GLV25\", \"GLV07\", \"GLV06\"]', 'Học lịch sử Cứu Độ và các Bí Tích Nhập Môn'),
('CLASS_RL2', 'Rước Lễ 2', 'Rước Lễ', 'Phòng 202 (Dãy B)', 'Chủ Nhật: 07:30 - 09:00', 32, '[\"GLV31\", \"GLV35\", \"GLV21\", \"GLV32\"]', 'Bí tích Thánh Thể & Nghi thức Xưng Tội Rước Lễ Lần Đầu'),
('CLASS_TS1', 'Thêm Sức 1', 'Thêm Sức', 'Phòng 301 (Dãy C)', 'Chủ Nhật: 07:30 - 09:00', 29, '[\"GLV04\", \"GLV23\", \"GLV34\"]', 'Tìm hiểu ơn Chúa Thánh Thần và Đời sống chứng nhân Kitô hữu'),
('CLASS_TS2', 'Thêm Sức 2', 'Thêm Sức', 'Phòng 302 (Dãy C)', 'Chủ Nhật: 07:30 - 09:00', 31, '[\"GLV12\", \"GLV27\", \"GLV09\", \"GLV02\", \"GLV15\", \"GLV40\"]', 'Chuẩn bị lãnh nhận Bí Tích Thêm Sức từ Đức Giám Mục'),
('CLASS_BD1', 'Bao Đồng 1', 'Bao Đồng', 'Hội Trường A', 'Chủ Nhật: 07:30 - 09:00', 27, '[\"GLV13\", \"GLV26\", \"GLV29\"]', 'Tuyên Xưng Đức Tin và Sống Lời Chúa giữa dòng đời'),
('CLASS_BD2', 'Bao Đồng 2', 'Bao Đồng', 'Hội Trường B', 'Chủ Nhật: 07:30 - 09:00', 25, '[\"GLV03\", \"GLV08\", \"GLV10\", \"GLV30\", \"GLV39\"]', 'Tuyên Hứa Bao Đồng & Trưởng thành trong đời sống Kitô hữu'),
('CLASS_BD3', 'Bao Đồng 3', 'Bao Đồng', 'Phòng 401 (Dãy D)', 'Chủ Nhật: 07:30 - 09:00', 22, '[\"GLV14\", \"GLV18\", \"GLV28\"]', 'Học hỏi Giáo lý Hội Thánh và Thần học căn bản'),
('CLASS_BD4', 'Bao Đồng 4', 'Bao Đồng', 'Phòng 402 (Dãy D)', 'Chủ Nhật: 07:30 - 09:00', 20, '[]', 'Tìm hiểu ơn gọi và định hướng tương lai theo tinh thần Tin Mừng'),
('CLASS_VD1', 'Vào Đời 1', 'Vào Đời', 'Phòng Sinh Hoạt 1', 'Chủ Nhật: 07:30 - 09:00', 18, '[\"GLV16\", \"GLV17\", \"GLV20\", \"GLV41\"]', 'Đạo đức sinh học, Hôn nhân gia đình và Thử thách xã hội'),
('CLASS_VD2', 'Vào Đời 2', 'Vào Đời', 'Phòng Sinh Hoạt 2', 'Chủ Nhật: 07:30 - 09:00', 16, '[\"GLV19\", \"GLV37\"]', 'Dấn thân phục vụ Giáo Xứ và chuẩn bị trở thành Huynh Trưởng');

-- ------------------------------------------------------------------------------
-- 4. BẢNG THIẾU NHI THEO LỚP (STUDENTS)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `students`;
CREATE TABLE `students` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `class_id` VARCHAR(50) NOT NULL,
  `stt` INT NOT NULL,
  `holy_name` VARCHAR(100) DEFAULT '',
  `full_name` VARCHAR(150) NOT NULL,
  `gender` VARCHAR(10) NOT NULL DEFAULT 'Nam',
  `birth_date` VARCHAR(20) DEFAULT '',
  `note` VARCHAR(150) DEFAULT 'Đang theo học',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Nạp thiếu nhi mẫu
INSERT INTO `students` (`id`, `class_id`, `stt`, `holy_name`, `full_name`, `gender`, `birth_date`, `note`) VALUES
('TN-DBKT-01', 'CLASS_DBKT', 1, 'Giuse', 'Nguyễn Minh An', 'Nam', '15/04/2019', 'Lớp trưởng'),
('TN-DBKT-02', 'CLASS_DBKT', 2, 'Maria', 'Trần Ngọc Hân', 'Nữ', '22/08/2019', 'Lớp phó học tập'),
('TN-DBKT-03', 'CLASS_DBKT', 3, 'Phêrô', 'Lê Hoàng Long', 'Nam', '10/01/2019', 'Đang theo học'),
('TN-DBKT-04', 'CLASS_DBKT', 4, 'Anna', 'Phạm Thảo Vy', 'Nữ', '05/11/2019', 'Đang theo học'),
('TN-DBKT-05', 'CLASS_DBKT', 5, 'Đaminh', 'Hoàng Gia Bảo', 'Nam', '18/06/2019', 'Ban Lễ Sinh');
