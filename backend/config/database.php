<?php
// ==============================================================================
// CẤU HÌNH KẾT NỐI CƠ SỞ DỮ LIỆU MYSQL (PDO) & CORS
// ==============================================================================

// Thiết lập Headers cho phép gọi API từ Frontend (CORS)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Xử lý Preflight Request (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Thông tin kết nối MySQL (Mặc định cho XAMPP / Laragon)
$db_host = "localhost";
$db_port = "3306";
$db_name = "giaoly_tanmy_db";
$db_user = "root";
$db_pass = ""; // Mặc định trên XAMPP/Laragon là rỗng

try {
    $pdo = new PDO("mysql:host={$db_host};port={$db_port};dbname={$db_name};charset=utf8mb4", $db_user, $db_pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Không thể kết nối đến cơ sở dữ liệu MySQL: " . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

// Helper: Hàm trả về phản hồi JSON chuẩn
function jsonResponse($success, $message = "", $data = null, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode([
        "success" => $success,
        "message" => $message,
        "data" => $data
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit();
}

// Helper: Đọc dữ liệu JSON gửi từ body request
function getJsonInput() {
    $raw = file_get_contents("php://input");
    return json_decode($raw, true) ?? [];
}
?>
