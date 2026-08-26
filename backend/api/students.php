<?php
// ==============================================================================
// REST API: QUẢN LÝ THIẾU NHI GIÁO LÝ THEO LỚP (STUDENTS)
// ==============================================================================

require_once __DIR__ . '/../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    // --------------------------------------------------------------------------
    // 1. GET: LẤY DANH SÁCH THIẾU NHI THEO LỚP
    // --------------------------------------------------------------------------
    case 'GET':
        if (isset($_GET['class_id'])) {
            $classId = trim($_GET['class_id']);
            $stmt = $pdo->prepare("SELECT * FROM students WHERE class_id = ? ORDER BY stt ASC");
            $stmt->execute([$classId]);
            $students = $stmt->fetchAll();
            jsonResponse(true, "Lấy danh sách thiếu nhi thành công", $students);
        } elseif (isset($_GET['id'])) {
            $id = trim($_GET['id']);
            $stmt = $pdo->prepare("SELECT * FROM students WHERE id = ? LIMIT 1");
            $stmt->execute([$id]);
            $student = $stmt->fetch();
            if ($student) {
                jsonResponse(true, "Tìm thấy thông tin thiếu nhi", $student);
            } else {
                jsonResponse(false, "Không tìm thấy thiếu nhi", null, 404);
            }
        } else {
            $stmt = $pdo->query("SELECT * FROM students ORDER BY class_id, stt ASC");
            $students = $stmt->fetchAll();
            jsonResponse(true, "Lấy tất cả thiếu nhi thành công", $students);
        }
        break;

    // --------------------------------------------------------------------------
    // 2. POST: THÊM THIẾU NHI VÀO LỚP
    // --------------------------------------------------------------------------
    case 'POST':
        $data = getJsonInput();

        if (empty($data['class_id']) || empty($data['fullName'])) {
            jsonResponse(false, "Mã lớp và Họ tên thiếu nhi không được để trống!", null, 400);
        }

        $classId = trim($data['class_id']);
        $fullName = trim($data['fullName']);
        $holyName = trim($data['holyName'] ?? '');
        $gender = trim($data['gender'] ?? 'Nam');
        $birthDate = trim($data['birthDate'] ?? '');
        $note = trim($data['note'] ?? 'Đang theo học');

        // Tự sinh ID thiếu nhi nếu chưa có
        $stt = !empty($data['stt']) ? intval($data['stt']) : 1;
        if (empty($data['stt'])) {
            $maxSttStmt = $pdo->prepare("SELECT MAX(stt) FROM students WHERE class_id = ?");
            $maxSttStmt->execute([$classId]);
            $maxStt = $maxSttStmt->fetchColumn();
            $stt = $maxStt ? ($maxStt + 1) : 1;
        }

        $code = str_replace('CLASS_', '', $classId);
        $id = !empty($data['id']) ? trim($data['id']) : ("TN-{$code}-" . str_pad($stt, 2, '0', STR_PAD_LEFT));

        $insertStmt = $pdo->prepare("
            INSERT INTO students (id, class_id, stt, holy_name, full_name, gender, birth_date, note)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $insertStmt->execute([$id, $classId, $stt, $holyName, $fullName, $gender, $birthDate, $note]);

        // Tự động cập nhật sĩ số lớp
        $countStmt = $pdo->prepare("SELECT COUNT(*) FROM students WHERE class_id = ?");
        $countStmt->execute([$classId]);
        $totalCount = $countStmt->fetchColumn();
        $updateClassStmt = $pdo->prepare("UPDATE classes SET student_count = ? WHERE id = ?");
        $updateClassStmt->execute([$totalCount, $classId]);

        jsonResponse(true, "Thêm thiếu nhi {$fullName} thành công!", [
            "id" => $id,
            "class_id" => $classId,
            "stt" => $stt,
            "holy_name" => $holyName,
            "full_name" => $fullName,
            "gender" => $gender,
            "birth_date" => $birthDate,
            "note" => $note
        ], 201);
        break;

    // --------------------------------------------------------------------------
    // 3. PUT: CẬP NHẬT THÔNG TIN THIẾU NHI
    // --------------------------------------------------------------------------
    case 'PUT':
        $data = getJsonInput();
        $id = trim($_GET['id'] ?? ($data['id'] ?? ''));

        if (empty($id)) {
            jsonResponse(false, "Thiếu mã thiếu nhi cần cập nhật!", null, 400);
        }

        $stmt = $pdo->prepare("SELECT * FROM students WHERE id = ?");
        $stmt->execute([$id]);
        $existing = $stmt->fetch();

        if (!$existing) {
            jsonResponse(false, "Không tìm thấy thiếu nhi để sửa!", null, 404);
        }

        $holyName = isset($data['holyName']) ? trim($data['holyName']) : $existing['holy_name'];
        $fullName = isset($data['fullName']) ? trim($data['fullName']) : $existing['full_name'];
        $gender = isset($data['gender']) ? trim($data['gender']) : $existing['gender'];
        $birthDate = isset($data['birthDate']) ? trim($data['birthDate']) : $existing['birth_date'];
        $note = isset($data['note']) ? trim($data['note']) : $existing['note'];

        $updateStmt = $pdo->prepare("
            UPDATE students 
            SET holy_name = ?, full_name = ?, gender = ?, birth_date = ?, note = ?
            WHERE id = ?
        ");
        $updateStmt->execute([$holyName, $fullName, $gender, $birthDate, $note, $id]);

        jsonResponse(true, "Cập nhật thông tin thiếu nhi thành công!");
        break;

    // --------------------------------------------------------------------------
    // 4. DELETE: XÓA THIẾU NHI KHỎI LỚP
    // --------------------------------------------------------------------------
    case 'DELETE':
        $id = trim($_GET['id'] ?? '');
        if (empty($id)) {
            $data = getJsonInput();
            $id = trim($data['id'] ?? '');
        }

        if (empty($id)) {
            jsonResponse(false, "Thiếu mã thiếu nhi cần xóa!", null, 400);
        }

        // Lấy class_id trước khi xóa để cập nhật lại sĩ số
        $getStmt = $pdo->prepare("SELECT class_id FROM students WHERE id = ?");
        $getStmt->execute([$id]);
        $classId = $getStmt->fetchColumn();

        $deleteStmt = $pdo->prepare("DELETE FROM students WHERE id = ?");
        $deleteStmt->execute([$id]);

        if ($deleteStmt->rowCount() > 0) {
            if ($classId) {
                $countStmt = $pdo->prepare("SELECT COUNT(*) FROM students WHERE class_id = ?");
                $countStmt->execute([$classId]);
                $totalCount = $countStmt->fetchColumn();
                $updateClassStmt = $pdo->prepare("UPDATE classes SET student_count = ? WHERE id = ?");
                $updateClassStmt->execute([$totalCount, $classId]);
            }
            jsonResponse(true, "Đã xóa thiếu nhi khỏi lớp!");
        } else {
            jsonResponse(false, "Không tìm thấy thiếu nhi để xóa!", null, 404);
        }
        break;

    default:
        jsonResponse(false, "Phương thức HTTP không được hỗ trợ!", null, 405);
        break;
}
?>
