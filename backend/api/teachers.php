<?php
// ==============================================================================
// REST API: QUẢN LÝ GIÁO LÝ VIÊN / HUYNH TRƯỞNG (TEACHERS)
// ==============================================================================

require_once __DIR__ . '/../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    // --------------------------------------------------------------------------
    // 1. GET: LẤY DANH SÁCH HOẶC TÌM KIẾM GLV
    // --------------------------------------------------------------------------
    case 'GET':
        if (isset($_GET['id'])) {
            $id = trim($_GET['id']);
            $stmt = $pdo->prepare("SELECT * FROM teachers WHERE id = ? OR stt = ? LIMIT 1");
            $stmt->execute([$id, $id]);
            $teacher = $stmt->fetch();
            if ($teacher) {
                jsonResponse(true, "Tìm thấy thông tin Giáo Lý Viên", $teacher);
            } else {
                jsonResponse(false, "Không tìm thấy Giáo Lý Viên với mã " . $id, null, 404);
            }
        } else {
            $sql = "SELECT * FROM teachers ORDER BY stt ASC";
            $stmt = $pdo->query($sql);
            $teachers = $stmt->fetchAll();
            jsonResponse(true, "Lấy danh sách Giáo Lý Viên thành công", $teachers);
        }
        break;

    // --------------------------------------------------------------------------
    // 2. POST: THÊM MỚI GIÁO LÝ VIÊN
    // --------------------------------------------------------------------------
    case 'POST':
        $data = getJsonInput();

        if (empty($data['id']) || empty($data['firstName'])) {
            jsonResponse(false, "Mã GLV và Tên không được để trống!", null, 400);
        }

        $id = strtoupper(trim($data['id']));
        
        // Kiểm tra trùng ID
        $checkStmt = $pdo->prepare("SELECT COUNT(*) FROM teachers WHERE id = ?");
        $checkStmt->execute([$id]);
        if ($checkStmt->fetchColumn() > 0) {
            jsonResponse(false, "Mã định danh GLV này đã tồn tại!", null, 409);
        }

        // Lấy STT lớn nhất + 1 nếu chưa có
        $stt = !empty($data['stt']) ? intval($data['stt']) : 1;
        if (empty($data['stt'])) {
            $maxStt = $pdo->query("SELECT MAX(stt) FROM teachers")->fetchColumn();
            $stt = $maxStt ? ($maxStt + 1) : 1;
        }

        $holyName = trim($data['holyName'] ?? '');
        $lastName = trim($data['lastName'] ?? '');
        $firstName = trim($data['firstName'] ?? '');
        $gender = trim($data['gender'] ?? 'Nữ');
        $cert = trim($data['cert'] ?? '');
        $block = trim($data['block'] ?? '');
        $teachingClass = trim($data['teachingClass'] ?? '');
        $photoUrl = trim($data['photo'] ?? ($data['photo_url'] ?? ''));

        $insertStmt = $pdo->prepare("
            INSERT INTO teachers (id, stt, holy_name, last_name, first_name, gender, cert, block, teaching_class, photo_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $insertStmt->execute([$id, $stt, $holyName, $lastName, $firstName, $gender, $cert, $block, $teachingClass, $photoUrl]);

        jsonResponse(true, "Thêm mới Giáo Lý Viên {$id} thành công!", [
            "id" => $id,
            "stt" => $stt,
            "holyName" => $holyName,
            "lastName" => $lastName,
            "firstName" => $firstName,
            "gender" => $gender,
            "cert" => $cert,
            "block" => $block,
            "teachingClass" => $teachingClass,
            "photo" => $photoUrl
        ], 201);
        break;

    // --------------------------------------------------------------------------
    // 3. PUT: CẬP NHẬT THÔNG TIN GIÁO LÝ VIÊN
    // --------------------------------------------------------------------------
    case 'PUT':
        $data = getJsonInput();
        $id = trim($_GET['id'] ?? ($data['id'] ?? ''));

        if (empty($id)) {
            jsonResponse(false, "Thiếu mã Giáo Lý Viên cần cập nhật!", null, 400);
        }

        $stmt = $pdo->prepare("SELECT * FROM teachers WHERE id = ?");
        $stmt->execute([$id]);
        $existing = $stmt->fetch();

        if (!$existing) {
            jsonResponse(false, "Không tìm thấy Giáo Lý Viên cần sửa!", null, 404);
        }

        $holyName = isset($data['holyName']) ? trim($data['holyName']) : $existing['holy_name'];
        $lastName = isset($data['lastName']) ? trim($data['lastName']) : $existing['last_name'];
        $firstName = isset($data['firstName']) ? trim($data['firstName']) : $existing['first_name'];
        $gender = isset($data['gender']) ? trim($data['gender']) : $existing['gender'];
        $cert = isset($data['cert']) ? trim($data['cert']) : $existing['cert'];
        $block = isset($data['block']) ? trim($data['block']) : $existing['block'];
        $teachingClass = isset($data['teachingClass']) ? trim($data['teachingClass']) : $existing['teaching_class'];
        $photoUrl = isset($data['photo']) ? trim($data['photo']) : $existing['photo_url'];

        $updateStmt = $pdo->prepare("
            UPDATE teachers 
            SET holy_name = ?, last_name = ?, first_name = ?, gender = ?, cert = ?, block = ?, teaching_class = ?, photo_url = ?
            WHERE id = ?
        ");
        $updateStmt->execute([$holyName, $lastName, $firstName, $gender, $cert, $block, $teachingClass, $photoUrl, $id]);

        jsonResponse(true, "Cập nhật hồ sơ Giáo Lý Viên {$id} thành công!");
        break;

    // --------------------------------------------------------------------------
    // 4. DELETE: XÓA GIÁO LÝ VIÊN
    // --------------------------------------------------------------------------
    case 'DELETE':
        $id = trim($_GET['id'] ?? '');
        if (empty($id)) {
            $data = getJsonInput();
            $id = trim($data['id'] ?? '');
        }

        if (empty($id)) {
            jsonResponse(false, "Thiếu mã Giáo Lý Viên cần xóa!", null, 400);
        }

        $deleteStmt = $pdo->prepare("DELETE FROM teachers WHERE id = ?");
        $deleteStmt->execute([$id]);

        if ($deleteStmt->rowCount() > 0) {
            jsonResponse(true, "Đã xóa Giáo Lý Viên {$id} khỏi hệ thống!");
        } else {
            jsonResponse(false, "Không tìm thấy Giáo Lý Viên {$id} để xóa!", null, 404);
        }
        break;

    default:
        jsonResponse(false, "Phương thức HTTP không được hỗ trợ!", null, 405);
        break;
}
?>
