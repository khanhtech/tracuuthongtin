<?php
// ==============================================================================
// CẤU HÌNH KẾT NỐI DATABASE MYSQL (5 BẢNG CHUẨN HÓA)
// ==============================================================================

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$db_host = "127.0.0.1";
$db_port = "3306";
$db_name = "giaoly_tanmy_db";
$db_user = "root";
$db_pass = "";

try {
    $pdo = new PDO("mysql:host={$db_host};port={$db_port};dbname={$db_name};charset=utf8mb4", $db_user, $db_pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Không thể kết nối đến MySQL: " . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

function jsonResponse($success, $message = "", $data = null, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode([
        "success" => $success,
        "message" => $message,
        "data" => $data
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit();
}

function getJsonInput() {
    $raw = file_get_contents("php://input");
    return json_decode($raw, true) ?? [];
}
?>
