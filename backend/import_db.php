<?php
// ==============================================================================
// SCRIPT IMPORT DATABASE.SQL VÀO MYSQL XAMPP
// ==============================================================================

$sqlFile = __DIR__ . '/../database.sql';
if (!file_exists($sqlFile)) {
    $sqlFile = 'C:/xampp/htdocs/tracuuthongtin/database.sql';
}

echo "📂 Đang đọc file SQL: {$sqlFile} ...\n";

if (!file_exists($sqlFile)) {
    die("❌ Không tìm thấy file database.sql!\n");
}

$sqlContent = file_get_contents($sqlFile);

try {
    $pdo = new PDO("mysql:host=127.0.0.1;port=3306;charset=utf8mb4", "root", "", [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);

    echo "🔌 Đang kết nối tới MySQL XAMPP...\n";
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `giaoly_tanmy_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
    $pdo->exec("USE `giaoly_tanmy_db`;");

    echo "⚡ Đang nạp các bảng và dữ liệu từ database.sql...\n";
    $pdo->exec($sqlContent);

    echo "\n========================================================\n";
    echo "🎉 IMPORT DATABASE.SQL LÊN MYSQL XAMPP THÀNH CÔNG RỰC RỠ!\n";
    echo "========================================================\n";

    $tables = [
        'admins'                 => 'Bảng 0: Tài Khoản Quản Trị (admins)',
        'students'               => 'Bảng 1: Danh mục Thiếu Nhi (students)',
        'teachers'               => 'Bảng 2: Danh mục Giáo Lý Viên (teachers)',
        'classes'                => 'Bảng 3: Danh mục Lớp Học (classes)',
        'class_assignments'      => 'Bảng 4: Phân Công GLV (class_assignments)',
        'enrollments_and_grades' => 'Bảng 5: Bảng Điểm & Xếp Lớp (enrollments_and_grades)'
    ];

    foreach ($tables as $table => $desc) {
        $check = $pdo->query("SHOW TABLES LIKE '{$table}'")->fetch();
        if ($check) {
            $count = $pdo->query("SELECT COUNT(*) FROM `{$table}`")->fetchColumn();
            echo "  ✅ {$desc}: {$count} bản ghi dữ liệu\n";
        }
    }
    echo "========================================================\n";

} catch (Exception $e) {
    echo "❌ LỖI TRONG QUÁ TRÌNH IMPORT: " . $e->getMessage() . "\n";
}
?>
