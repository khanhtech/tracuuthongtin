<?php
// ==============================================================================
// REST API: QUẢN LÝ GIÁO LÝ VIÊN (TEACHERS) - 5 BẢNG CHUẨN HÓA
// ==============================================================================

require_once __DIR__ . '/config/database.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $id = trim($_GET['id']);
            $stmt = $pdo->prepare("
                SELECT t.*, 
                       COALESCE(t.status, 'Đang dạy học') as status,
                       COALESCE(GROUP_CONCAT(DISTINCT c.class_name SEPARATOR ', '), '') as teaching_class,
                       COALESCE(GROUP_CONCAT(DISTINCT c.block SEPARATOR ', '), '') as block,
                       COALESCE(GROUP_CONCAT(DISTINCT ca.role SEPARATOR ', '), 'Chưa phân công') as role
                FROM teachers t
                LEFT JOIN class_assignments ca ON t.teacher_id = ca.teacher_id
                LEFT JOIN classes c ON ca.class_id = c.class_id
                WHERE t.teacher_id = ? OR t.stt = ?
                GROUP BY t.teacher_id
                LIMIT 1
            ");
            $stmt->execute([$id, $id]);
            $teacher = $stmt->fetch();
            if ($teacher) {
                jsonResponse(true, "Tìm thấy Giáo Lý Viên", $teacher);
            } else {
                jsonResponse(false, "Không tìm thấy Giáo Lý Viên", null, 404);
            }
        } else {
            $stmt = $pdo->query("
                SELECT t.teacher_id as id,
                       t.stt,
                       t.holy_name as holyName,
                       t.last_name as lastName,
                       t.first_name as firstName,
                       t.gender,
                       t.cert,
                       COALESCE(t.status, 'Đang dạy học') as status,
                       COALESCE(GROUP_CONCAT(DISTINCT c.block SEPARATOR ', '), '') as block,
                       COALESCE(GROUP_CONCAT(DISTINCT c.class_name SEPARATOR ', '), '') as teachingClass,
                       COALESCE(GROUP_CONCAT(DISTINCT ca.role SEPARATOR ', '), 'Chưa phân công') as role,
                       t.photo_url as photo
                FROM teachers t
                LEFT JOIN class_assignments ca ON t.teacher_id = ca.teacher_id
                LEFT JOIN classes c ON ca.class_id = c.class_id
                GROUP BY t.teacher_id
                ORDER BY t.stt ASC
            ");
            $teachers = $stmt->fetchAll();
            jsonResponse(true, "Lấy danh sách Giáo Lý Viên thành công", $teachers);
        }
        break;

    case 'POST':
        $data = getJsonInput();
        $id = strtoupper(trim($data['id'] ?? ($data['teacher_id'] ?? '')));
        $firstName = trim($data['firstName'] ?? ($data['first_name'] ?? ''));

        if (empty($firstName)) {
            jsonResponse(false, "Tên Giáo Lý Viên không được để trống!", null, 400);
        }

        // Tự động cấp mã ID nếu chưa có
        if (empty($id)) {
            $existingIds = $pdo->query("SELECT teacher_id FROM teachers")->fetchAll(PDO::FETCH_COLUMN);
            $maxNum = 0;
            foreach ($existingIds as $tId) {
                if (preg_match('/^GLV(\d+)$/i', $tId, $matches)) {
                    $num = intval($matches[1]);
                    if ($num > $maxNum) $maxNum = $num;
                }
            }
            $nextNum = $maxNum + 1;
            $id = 'GLV' . str_pad($nextNum, 2, '0', STR_PAD_LEFT);
        }

        $check = $pdo->prepare("SELECT COUNT(*) FROM teachers WHERE teacher_id = ?");
        $check->execute([$id]);
        if ($check->fetchColumn() > 0) {
            jsonResponse(false, "Mã GLV này đã tồn tại!", null, 409);
        }

        $stt = !empty($data['stt']) ? intval($data['stt']) : (intval($pdo->query("SELECT COALESCE(MAX(stt), 0) FROM teachers")->fetchColumn()) + 1);
        $holyName = trim($data['holyName'] ?? ($data['holy_name'] ?? ''));
        $lastName = trim($data['lastName'] ?? ($data['last_name'] ?? ''));
        $gender = trim($data['gender'] ?? 'Nữ');
        $cert = trim($data['cert'] ?? '');
        $photo = trim($data['photo'] ?? ($data['photo_url'] ?? ''));
        $status = trim($data['status'] ?? 'Đang dạy học');

        $stmt = $pdo->prepare("
            INSERT INTO teachers (teacher_id, stt, holy_name, last_name, first_name, gender, cert, photo_url, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([$id, $stt, $holyName, $lastName, $firstName, $gender, $cert, $photo, $status]);

        jsonResponse(true, "Thêm mới Giáo Lý Viên {$id} thành công!", [
            "id" => $id, "stt" => $stt, "holyName" => $holyName, "lastName" => $lastName,
            "firstName" => $firstName, "gender" => $gender, "cert" => $cert, "photo" => $photo,
            "status" => $status
        ], 201);
        break;

    case 'PUT':
        $data = getJsonInput();
        $id = trim($_GET['id'] ?? ($data['id'] ?? ($data['teacher_id'] ?? '')));

        if (empty($id)) {
            jsonResponse(false, "Thiếu mã Giáo Lý Viên cần sửa!", null, 400);
        }

        $stmt = $pdo->prepare("SELECT * FROM teachers WHERE teacher_id = ?");
        $stmt->execute([$id]);
        $existing = $stmt->fetch();
        if (!$existing) {
            jsonResponse(false, "Không tìm thấy Giáo Lý Viên", null, 404);
        }

        $holyName = isset($data['holyName']) ? trim($data['holyName']) : $existing['holy_name'];
        $lastName = isset($data['lastName']) ? trim($data['lastName']) : $existing['last_name'];
        $firstName = isset($data['firstName']) ? trim($data['firstName']) : $existing['first_name'];
        $gender = isset($data['gender']) ? trim($data['gender']) : $existing['gender'];
        $cert = isset($data['cert']) ? trim($data['cert']) : $existing['cert'];
        $photo = isset($data['photo']) ? trim($data['photo']) : $existing['photo_url'];
        $status = isset($data['status']) ? trim($data['status']) : ($existing['status'] ?? 'Đang dạy học');

        $upStmt = $pdo->prepare("
            UPDATE teachers 
            SET holy_name = ?, last_name = ?, first_name = ?, gender = ?, cert = ?, photo_url = ?, status = ?
            WHERE teacher_id = ?
        ");
        $upStmt->execute([$holyName, $lastName, $firstName, $gender, $cert, $photo, $status, $id]);

        jsonResponse(true, "Cập nhật thông tin Giáo Lý Viên {$id} thành công!");
        break;

    case 'DELETE':
        $id = trim($_GET['id'] ?? (getJsonInput()['id'] ?? ''));
        if (empty($id)) {
            jsonResponse(false, "Thiếu mã Giáo Lý Viên cần xóa!", null, 400);
        }

        // Xóa phân công liên quan trong class_assignments
        $pdo->prepare("DELETE FROM class_assignments WHERE teacher_id = ?")->execute([$id]);

        $stmt = $pdo->prepare("DELETE FROM teachers WHERE teacher_id = ?");
        $stmt->execute([$id]);
        if ($stmt->rowCount() > 0) {
            jsonResponse(true, "Đã xóa Giáo Lý Viên {$id} khỏi hệ thống!");
        } else {
            jsonResponse(false, "Không tìm thấy Giáo Lý Viên để xóa!", null, 404);
        }
        break;

    default:
        jsonResponse(false, "Phương thức không hỗ trợ", null, 405);
        break;
}
?>
