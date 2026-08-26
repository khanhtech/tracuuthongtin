# 📖 HƯỚNG DẪN CÀI ĐẶT & VẬN HÀNH HỆ THỐNG VỚI PHP & MYSQL (XAMPP / LARAGON)

Tài liệu này hướng dẫn bạn chi tiết từng bước để chạy website kết nối với Cơ sở dữ liệu **MySQL** và Backend **PHP** trên máy tính cá nhân hoặc máy chủ.

---

## 🌟 BƯỚC 1: Cài Đặt Môi Trường PHP & MySQL (XAMPP hoặc Laragon)

Nếu máy tính của bạn chưa có PHP và MySQL, bạn chỉ cần tải và cài đặt 1 trong 2 phần mềm miễn phí sau:

### 🔹 Cách 1: Sử dụng XAMPP (Phổ biến nhất)
1. Tải XAMPP miễn phí tại: [https://www.apachefriends.org/](https://www.apachefriends.org/)
2. Cài đặt bình thường (Next -> Next -> Finish).
3. Mở phần mềm **XAMPP Control Panel**, bấm nút **Start** ở 2 dòng:
   - **Apache** *(Chuyển sang màu xanh lá)*
   - **MySQL** *(Chuyển sang màu xanh lá)*

### 🔹 Cách 2: Sử dụng Laragon (Gọn nhẹ & hiện đại)
1. Tải Laragon tại: [https://laragon.org/download/](https://laragon.org/download/)
2. Mở Laragon và bấm nút **"Start All"**.

---

## 🗄️ BƯỚC 2: Tạo Cơ Sở Dữ Liệu & Nạp Dữ Liệu Mẫu (phpMyAdmin)

1. Mở trình duyệt web (Chrome / Cốc Cốc / Edge) và truy cập vào địa chỉ:
   👉 **`http://localhost/phpmyadmin`**
2. Bấm vào tab **"Cơ sở dữ liệu" (Databases)** ở menu trên cùng.
3. Nhập tên cơ sở dữ liệu: **`giaoly_tanmy_db`**, chọn bảng mã **`utf8mb4_unicode_ci`**, rồi bấm **"Tạo" (Create)**.
4. Chọn cơ sở dữ liệu `giaoly_tanmy_db` vừa tạo ở cột bên trái -> Bấm vào tab **"Nhập" (Import)** ở menu trên.
5. Bấm nút **"Chọn tệp" (Choose File)** -> Chọn file **`database.sql`** trong thư mục dự án của bạn -> Kéo xuống dưới cùng và bấm **"Thực hiện" (Import / Go)**.

> 🎉 **Kết quả**: phpMyAdmin sẽ tự động tạo đủ 4 bảng: `teachers` (41 GLV), `classes` (13 lớp học), `students` (danh sách thiếu nhi) và `admins` (tài khoản quản trị).

---

## 🚀 BƯỚC 3: Đặt Dự Án Vào Thư Mục Chạy Của Web Server

1. **Nếu dùng XAMPP**:
   - Sao chép toàn bộ thư mục dự án này vào đường dẫn:
     📁 `C:\xampp\htdocs\tracuuthongtin`
2. **Nếu dùng Laragon**:
   - Sao chép toàn bộ thư mục dự án này vào đường dẫn:
     📁 `C:\laragon\www\tracuuthongtin`

3. Mở trình duyệt web và truy cập:
   👉 **`http://localhost/tracuuthongtin`**

---

## 🛡️ BƯỚC 4: Kiểm Tra Hoạt Động Của API Backend

Bạn có thể kiểm tra trực tiếp các đường link API sau trên trình duyệt:
- Kiểm tra trạng thái server: `http://localhost/tracuuthongtin/backend/api/auth.php`
- Danh sách Giáo Lý Viên: `http://localhost/tracuuthongtin/backend/api/teachers.php`
- Danh sách Lớp Học: `http://localhost/tracuuthongtin/backend/api/classes.php`
- Danh sách Thiếu Nhi: `http://localhost/tracuuthongtin/backend/api/students.php?class_id=CLASS_DBKT`

---

## 🔑 THÔNG TIN TÀI KHOẢN QUẢN TRỊ VIÊN MẶC ĐỊNH

- **Tài khoản**: `admin`
- **Mật khẩu**: `admin123` *(hoặc `123456`)*
- Bạn có thể đổi mật khẩu bất kỳ lúc nào trực tiếp trong bảng `admins` trên phpMyAdmin.
