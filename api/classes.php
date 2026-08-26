<?php
// ==============================================================================
// REST API: QUẢN LÝ LỚP HỌC (CLASSES) - 5 BẢNG CHUẨN HÓA
// ==============================================================================

require_once __DIR__ . '/config/database.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $id = trim($_GET['id']);
            $stmt = $pdo->prepare("SELECT * FROM classes WHERE class_id = ? LIMIT 1");
            $stmt->execute([$id]);
            $class = $stmt->fetch();
            if ($class) {
                // Lấy danh sách ID các GLV phụ trách từ class_assignments
                $tStmt = $pdo->prepare("SELECT teacher_id FROM class_assignments WHERE class_id = ?");
                $tStmt->execute([$id]);
                $teacherIds = $tStmt->fetchAll(PDO::FETCH_COLUMN);

                // Lấy danh sách thiếu nhi & điểm từ enrollments_and_grades + students
                $sStmt = $pdo->prepare("
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
                $sStmt->execute([$id]);
                $students = $sStmt->fetchAll();

                $result = [
                    "id" => $class['class_id'],
                    "name" => $class['class_name'],
                    "block" => $class['block'],
                    "academicYear" => $class['academic_year'],
                    "room" => $class['room'],
                    "schedule" => $class['schedule'],
                    "studentCount" => count($students),
                    "teacherIds" => $teacherIds,
                    "students" => $students,
                    "note" => $class['note']
                ];
                jsonResponse(true, "Lấy thông tin lớp học thành công", $result);
            } else {
                jsonResponse(false, "Không tìm thấy lớp học", null, 404);
            }
        } else {
            // Lấy tất cả các lớp kèm teacherIds và đếm số thiếu nhi
            $stmt = $pdo->query("
                SELECT c.class_id as id,
                       c.class_name as name,
                       c.block,
                       c.academic_year as academicYear,
                       c.room,
                       c.schedule,
                       c.note,
                       (SELECT COUNT(*) FROM enrollments_and_grades eg WHERE eg.class_id = c.class_id) as studentCount
                FROM classes c
                ORDER BY c.class_id ASC
            ");
            $classes = $stmt->fetchAll();

            foreach ($classes as &$c) {
                $c['studentCount'] = intval($c['studentCount']);
                $tStmt = $pdo->prepare("SELECT teacher_id FROM class_assignments WHERE class_id = ?");
                $tStmt->execute([$c['id']]);
                $c['teacherIds'] = $tStmt->fetchAll(PDO::FETCH_COLUMN) ?? [];
            }
            jsonResponse(true, "Lấy danh sách lớp học thành công", $classes);
        }
        break;

    case 'POST':
        $data = getJsonInput();
        $id = trim($data['id'] ?? ($data['class_id'] ?? ''));
        $name = trim($data['name'] ?? ($data['class_name'] ?? ''));
        $block = trim($data['block'] ?? 'Khai Tâm');
        $academicYear = trim($data['academicYear'] ?? ($data['academic_year'] ?? '2026-2027'));
        $room = trim($data['room'] ?? '');
        $schedule = trim($data['schedule'] ?? 'Chủ Nhật: 07:30 - 09:00');
        $note = trim($data['note'] ?? '');
        $teacherIds = $data['teacherIds'] ?? [];

        if (empty($id) || empty($name)) {
            jsonResponse(false, "Mã lớp và Tên lớp không được để trống!", null, 400);
        }

        $check = $pdo->prepare("SELECT COUNT(*) FROM classes WHERE class_id = ?");
        $check->execute([$id]);
        if ($check->fetchColumn() > 0) {
            jsonResponse(false, "Mã lớp học này đã tồn tại!", null, 409);
        }

        $stmt = $pdo->prepare("
            INSERT INTO classes (class_id, class_name, block, academic_year, room, schedule, note)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([$id, $name, $block, $academicYear, $room, $schedule, $note]);

        // Cập nhật phân công GLV trong class_assignments
        if (!empty($teacherIds) && is_array($teacherIds)) {
            $asStmt = $pdo->prepare("INSERT IGNORE INTO class_assignments (class_id, teacher_id, role) VALUES (?, ?, 'Huynh trưởng phụ trách')");
            foreach ($teacherIds as $tId) {
                if (!empty($tId)) $asStmt->execute([$id, $tId]);
            }
        }

        jsonResponse(true, "Thêm mới lớp học thành công!", ["id" => $id, "name" => $name], 201);
        break;

    case 'PUT':
        $data = getJsonInput();
        $id = trim($_GET['id'] ?? ($data['id'] ?? ($data['class_id'] ?? '')));

        if (empty($id)) {
            jsonResponse(false, "Thiếu mã lớp học cần sửa!", null, 400);
        }

        $stmt = $pdo->prepare("SELECT * FROM classes WHERE class_id = ?");
        $stmt->execute([$id]);
        $existing = $stmt->fetch();
        if (!$existing) {
            jsonResponse(false, "Không tìm thấy lớp học", null, 404);
        }

        $name = isset($data['name']) ? trim($data['name']) : $existing['class_name'];
        $block = isset($data['block']) ? trim($data['block']) : $existing['block'];
        $room = isset($data['room']) ? trim($data['room']) : $existing['room'];
        $schedule = isset($data['schedule']) ? trim($data['schedule']) : $existing['schedule'];
        $note = isset($data['note']) ? trim($data['note']) : $existing['note'];

        $upStmt = $pdo->prepare("
            UPDATE classes 
            SET class_name = ?, block = ?, room = ?, schedule = ?, note = ?
            WHERE class_id = ?
        ");
        $upStmt->execute([$name, $block, $room, $schedule, $note, $id]);

        // Cập nhật lại phân công GLV
        if (isset($data['teacherIds']) && is_array($data['teacherIds'])) {
            $pdo->prepare("DELETE FROM class_assignments WHERE class_id = ?")->execute([$id]);
            $asStmt = $pdo->prepare("INSERT INTO class_assignments (class_id, teacher_id, role) VALUES (?, ?, 'Huynh trưởng phụ trách')");
            foreach ($data['teacherIds'] as $tId) {
                if (!empty($tId)) $asStmt->execute([$id, $tId]);
            }
        }

        jsonResponse(true, "Cập nhật thông tin lớp học thành công!");
        break;

    case 'DELETE':
        $id = trim($_GET['id'] ?? (getJsonInput()['id'] ?? ''));
        if (empty($id)) {
            jsonResponse(false, "Thiếu mã lớp học cần xóa!", null, 400);
        }

        $stmt = $pdo->prepare("DELETE FROM classes WHERE class_id = ?");
        $stmt->execute([$id]);
        if ($stmt->rowCount() > 0) {
            jsonResponse(true, "Đã xóa lớp học khỏi hệ thống!");
        } else {
            jsonResponse(false, "Không tìm thấy lớp học để xóa!", null, 404);
        }
        break;

    default:
        jsonResponse(false, "Phương thức không hỗ trợ", null, 405);
        break;
}
?>
