<?php
// ==============================================================================
// SCRIPT KIỂM TRA KẾT NỐI DATABASE MYSQL TỪ LARAVEL / PHP .ENV
// ==============================================================================

// Đọc file .env nếu có
$envFile = __DIR__ . '/.env';
$dbHost = '127.0.0.1';
$dbPort = '3306';
$dbName = 'giaoly_tanmy_db';
$dbUser = 'root';
$dbPass = '';

if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (strpos($line, '=') !== false) {
            list($key, $val) = explode('=', $line, 2);
            $key = trim($key);
            $val = trim($val);
            if ($key === 'DB_HOST') $dbHost = $val;
            if ($key === 'DB_PORT') $dbPort = $val;
            if ($key === 'DB_DATABASE') $dbName = $val;
            if ($key === 'DB_USERNAME') $dbUser = $val;
            if ($key === 'DB_PASSWORD') $dbPass = $val;
        }
    }
}

echo "====================================================================\n";
echo "🔍 ĐANG KIỂM TRA KẾT NỐI TỪ FILE .ENV TỚI CƠ SỞ DỮ LIỆU MYSQL...\n";
echo "====================================================================\n";
echo "  • Host        : {$dbHost}:{$dbPort}\n";
echo "  • Database    : {$dbName}\n";
echo "  • User        : {$dbUser}\n";
echo "--------------------------------------------------------------------\n";

try {
    $pdo = new PDO("mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4", $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
    
    echo "🎉 KẾT NỐI THÀNH CÔNG RỰC RỠ! (STATUS: OK)\n";
    echo "--------------------------------------------------------------------\n";
    echo "📊 THỐNG KÊ 5 BẢNG CHUẨN HÓA TRONG DATABASE:\n";
    
    $tables = [
        'students'                => 'Bảng 1: Danh mục Thiếu Nhi',
        'teachers'                => 'Bảng 2: Danh mục Giáo Lý Viên',
        'classes'                 => 'Bảng 3: Danh mục Lớp Học',
        'class_assignments'       => 'Bảng 4: Phân Công GLV Phụ Trách',
        'enrollments_and_grades'  => 'Bảng 5: Bảng Điểm & Xếp Lớp',
        'admins'                  => 'Bảng 0: Tài Khoản Quản Trị'
    ];
    
    foreach ($tables as $t => $desc) {
        $check = $pdo->query("SHOW TABLES LIKE '{$t}'")->fetch();
        if ($check) {
            $count = $pdo->query("SELECT COUNT(*) FROM `{$t}`")->fetchColumn();
            echo "  ✅ {$desc} (`{$t}`): {$count} bản ghi\n";
        } else {
            echo "  ⚠️ Bảng `{$t}`: Chưa tìm thấy (Cần import database.sql)\n";
        }
    }
    
    echo "====================================================================\n";
} catch (Exception $e) {
    echo "❌ LỖI KẾT NỐI DATABASE:\n";
    echo "  " . $e->getMessage() . "\n";
    echo "====================================================================\n";
}
?>
