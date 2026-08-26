<?php
// ==============================================================================
// REST API: QUẢN LÝ THIẾU NHI (STUDENTS) - 5 BẢNG CHUẨN HÓA
// ==============================================================================

require_once __DIR__ . '/config/database.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

switch ($method) {
    case 'GET':
        if (isset($_GET['class_id'])) {
            $classId = trim($_GET['class_id']);
            $stmt = $pdo->prepare("
                SELECT s.student_id as id,
                       eg.stt_in_class as stt,
                       s.holy_name as holyName,
                       s.full_name as fullName,
                       s.gender,
                       s.birth_date as birthDate,
                       eg.role_in_class as note,
                       eg.score_final,
                       eg.evaluation
                FROM enrollments_and_grades eg
                JOIN students s ON eg.student_id = s.student_id
                WHERE eg.class_id = ?
                ORDER BY eg.stt_in_class ASC
            ");
            $stmt->execute([$classId]);
            $students = $stmt->fetchAll();
            jsonResponse(true, "Lấy danh sách thiếu nhi của lớp thành công", $students);
        } else {
            $stmt = $pdo->query("
                SELECT s.student_id as id,
                       s.holy_name as holyName,
                       s.full_name as fullName,
                       s.gender,
                       s.birth_date as birthDate,
                       s.parent_name as parentName,
                       s.parent_phone as parentPhone
                FROM students s
                ORDER BY s.student_id ASC
            ");
            $students = $stmt->fetchAll();
            jsonResponse(true, "Lấy toàn bộ danh sách thiếu nhi thành công", $students);
        }
        break;

    case 'POST':
        $data = getJsonInput();
        $classId = trim($data['class_id'] ?? ($data['classId'] ?? ''));
        $holyName = trim($data['holyName'] ?? ($data['holy_name'] ?? ''));
        $fullName = trim($data['fullName'] ?? ($data['full_name'] ?? ''));
        $gender = trim($data['gender'] ?? 'Nam');
        $birthDate = trim($data['birthDate'] ?? ($data['birth_date'] ?? ''));
        $note = trim($data['note'] ?? ($data['role_in_class'] ?? 'Đang theo học'));

        if (empty($fullName)) {
            jsonResponse(false, "Họ và tên thiếu nhi không được để trống!", null, 400);
        }

        // Tách họ và tên
        $parts = explode(' ', $fullName);
        $firstName = array_pop($parts);
        $lastName = implode(' ', $parts);

        // Sinh mã thiếu nhi nếu chưa có
        $studentId = trim($data['id'] ?? ($data['student_id'] ?? ''));
        if (empty($studentId)) {
            $code = str_replace('CLASS_', '', $classId);
            $count = $pdo->query("SELECT COUNT(*) FROM students")->fetchColumn() + 1;
            $studentId = "TN-{$code}-" . str_pad($count, 2, '0', STR_PAD_LEFT);
        }

        // 1. Thêm vào bảng students
        $sStmt = $pdo->prepare("
            INSERT INTO students (student_id, holy_name, last_name, first_name, full_name, gender, birth_date)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE holy_name = VALUES(holy_name), full_name = VALUES(full_name), gender = VALUES(gender), birth_date = VALUES(birth_date)
        ");
        $sStmt->execute([$studentId, $holyName, $lastName, $firstName, $fullName, $gender, $birthDate]);

        // 2. Xếp lớp vào enrollments_and_grades
        if (!empty($classId)) {
            $sttCount = $pdo->prepare("SELECT COUNT(*) FROM enrollments_and_grades WHERE class_id = ?");
            $sttCount->execute([$classId]);
            $stt = $sttCount->fetchColumn() + 1;

            $egStmt = $pdo->prepare("
                INSERT INTO enrollments_and_grades (student_id, class_id, academic_year, stt_in_class, role_in_class)
                VALUES (?, ?, '2026-2027', ?, ?)
                ON DUPLICATE KEY UPDATE role_in_class = VALUES(role_in_class)
            ");
            $egStmt->execute([$studentId, $classId, $stt, $note]);
        }

        jsonResponse(true, "Thêm thiếu nhi thành công!", [
            "id" => $studentId,
            "holyName" => $holyName,
            "fullName" => $fullName,
            "gender" => $gender,
            "birthDate" => $birthDate,
            "note" => $note
        ], 201);
        break;

    case 'PUT':
        $data = getJsonInput();
        $studentId = trim($_GET['id'] ?? ($data['id'] ?? ($data['student_id'] ?? '')));
        $classId = trim($data['class_id'] ?? ($data['classId'] ?? ''));

        if (empty($studentId)) {
            jsonResponse(false, "Thiếu mã thiếu nhi cần sửa!", null, 400);
        }

        $holyName = trim($data['holyName'] ?? ($data['holy_name'] ?? ''));
        $fullName = trim($data['fullName'] ?? ($data['full_name'] ?? ''));
        $gender = trim($data['gender'] ?? 'Nam');
        $birthDate = trim($data['birthDate'] ?? ($data['birth_date'] ?? ''));
        $note = trim($data['note'] ?? ($data['role_in_class'] ?? 'Đang theo học'));

        $parts = explode(' ', $fullName);
        $firstName = array_pop($parts);
        $lastName = implode(' ', $parts);

        $upStmt = $pdo->prepare("
            UPDATE students 
            SET holy_name = ?, last_name = ?, first_name = ?, full_name = ?, gender = ?, birth_date = ?
            WHERE student_id = ?
        ");
        $upStmt->execute([$holyName, $lastName, $firstName, $fullName, $gender, $birthDate, $studentId]);

        if (!empty($classId)) {
            $upEg = $pdo->prepare("
                UPDATE enrollments_and_grades 
                SET role_in_class = ?
                WHERE student_id = ? AND class_id = ?
            ");
            $upEg->execute([$note, $studentId, $classId]);
        }

        jsonResponse(true, "Cập nhật thông tin thiếu nhi thành công!");
        break;

    case 'DELETE':
        $studentId = trim($_GET['id'] ?? (getJsonInput()['id'] ?? ''));
        $classId = trim($_GET['class_id'] ?? (getJsonInput()['class_id'] ?? ''));

        if (empty($studentId)) {
            jsonResponse(false, "Thiếu mã thiếu nhi cần xóa!", null, 400);
        }

        if (!empty($classId)) {
            $stmt = $pdo->prepare("DELETE FROM enrollments_and_grades WHERE student_id = ? AND class_id = ?");
            $stmt->execute([$studentId, $classId]);
        } else {
            $stmt = $pdo->prepare("DELETE FROM students WHERE student_id = ?");
            $stmt->execute([$studentId]);
        }

        jsonResponse(true, "Đã xóa thiếu nhi khỏi danh sách!");
        break;

    default:
        jsonResponse(false, "Phương thức không hỗ trợ", null, 405);
        break;
}
?>
