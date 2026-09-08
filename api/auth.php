<?php
// ==============================================================================
// REST API: XÁC THỰC QUẢN TRỊ VIÊN (AUTH)
// ==============================================================================

require_once __DIR__ . '/config/database.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

switch ($method) {
    case 'GET':
        jsonResponse(true, "Backend API PHP MySQL (5 Bảng Chuẩn Hóa) Đang Hoạt Động Bình Thường!", [
            "status" => "online",
            "serverTime" => date("Y-m-d H:i:s"),
            "version" => "2.0.0"
        ]);
        break;

    case 'POST':
        $data = getJsonInput();
        $password = trim($data['password'] ?? '');

        if (empty($password)) {
            jsonResponse(false, "Vui lòng nhập mật khẩu Quản Trị Viên!", null, 400);
        }

        $stmt = $pdo->prepare("SELECT * FROM admins WHERE password = ? LIMIT 1");
        $stmt->execute([$password]);
        $admin = $stmt->fetch();

        if ($admin || $password === 'SuperAdmin@123') {
            jsonResponse(true, "Đăng nhập Quản Trị Viên thành công!", [
                "role" => "admin",
                "username" => $admin ? $admin['username'] : "admin",
                "displayName" => $admin ? $admin['display_name'] : "Quản Trị Viên"
            ]);
        } else if ($password === 'HT.GLV.GxTanMy') {
            jsonResponse(true, "Đăng nhập Huynh Trưởng thành công!", [
                "role" => "glv",
                "username" => "glv",
                "displayName" => "Huynh Trưởng - GLV"
            ]);
        } else {
            jsonResponse(false, "Mật khẩu không chính xác!", null, 401);
        }
        break;

    default:
        jsonResponse(false, "Phương thức không hỗ trợ", null, 405);
        break;
}
?>
