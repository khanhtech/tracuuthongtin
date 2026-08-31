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
                // Lấy danh sách GLV phụ trách kèm vai trò từ class_assignments
                $tStmt = $pdo->prepare("
                    SELECT ca.teacher_id as id, ca.role, t.holy_name as holyName, t.last_name as lastName, t.first_name as firstName, t.gender
                    FROM class_assignments ca
                    JOIN teachers t ON ca.teacher_id = t.teacher_id
                    WHERE ca.class_id = ?
                    ORDER BY CASE WHEN ca.role = 'Chủ nhiệm' THEN 1 WHEN ca.role = 'Đồng hành' THEN 2 ELSE 3 END, t.stt ASC
                ");
                $tStmt->execute([$id]);
                $teachersDetailed = $tStmt->fetchAll();
                $teacherIds = array_column($teachersDetailed, 'id');

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
                    "teachers" => $teachersDetailed,
                    "teacherIds" => $teacherIds,
                    "students" => $students,
                    "note" => $class['note']
                ];
                jsonResponse(true, "Lấy thông tin lớp học thành công", $result);
            } else {
                jsonResponse(false, "Không tìm thấy lớp học", null, 404);
            }
        } else {
            // Lấy tất cả các lớp kèm teachers (có vai trò) và đếm số thiếu nhi
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
                $tStmt = $pdo->prepare("
                    SELECT ca.teacher_id as id, ca.role, t.holy_name as holyName, t.last_name as lastName, t.first_name as firstName, t.gender
                    FROM class_assignments ca
                    JOIN teachers t ON ca.teacher_id = t.teacher_id
                    WHERE ca.class_id = ?
                    ORDER BY CASE WHEN ca.role = 'Chủ nhiệm' THEN 1 WHEN ca.role = 'Đồng hành' THEN 2 ELSE 3 END, t.stt ASC
                ");
                $tStmt->execute([$c['id']]);
                $c['teachers'] = $tStmt->fetchAll() ?? [];
                $c['teacherIds'] = array_column($c['teachers'], 'id') ?? [];
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
        $teachers = $data['teachers'] ?? [];

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
        $pdo->prepare("DELETE FROM class_assignments WHERE class_id = ?")->execute([$id]);
        $asStmt = $pdo->prepare("INSERT INTO class_assignments (class_id, teacher_id, role) VALUES (?, ?, ?)");

        if (!empty($teachers) && is_array($teachers)) {
            foreach ($teachers as $t) {
                $tid = is_array($t) ? strtoupper(trim($t['id'] ?? '')) : strtoupper(trim($t));
                $trole = is_array($t) ? trim($t['role'] ?? 'Đồng hành') : 'Đồng hành';
                if (!empty($tid)) {
                    $asStmt->execute([$id, $tid, $trole]);
                }
            }
        } else if (!empty($teacherIds) && is_array($teacherIds)) {
            foreach ($teacherIds as $idx => $tId) {
                $tId = strtoupper(trim($tId));
                if (!empty($tId)) {
                    $rStmt = $pdo->prepare("SELECT role FROM teachers WHERE teacher_id = ? LIMIT 1");
                    $rStmt->execute([$tId]);
                    $tDbRole = $rStmt->fetchColumn();
                    $trole = (!empty($tDbRole) && $tDbRole !== 'Chưa phân công') ? $tDbRole : (($idx === 0) ? 'Chủ nhiệm' : 'Đồng hành');
                    $asStmt->execute([$id, $tId, $trole]);
                }
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

        // Cập nhật lại phân công GLV kèm vai trò
        if (isset($data['teachers']) && is_array($data['teachers'])) {
            $pdo->prepare("DELETE FROM class_assignments WHERE class_id = ?")->execute([$id]);
            $asStmt = $pdo->prepare("INSERT INTO class_assignments (class_id, teacher_id, role) VALUES (?, ?, ?)");
            foreach ($data['teachers'] as $t) {
                $tid = is_array($t) ? strtoupper(trim($t['id'] ?? '')) : strtoupper(trim($t));
                $trole = is_array($t) ? trim($t['role'] ?? 'Đồng hành') : 'Đồng hành';
                if (!empty($tid)) {
                    $asStmt->execute([$id, $tid, $trole]);
                }
            }
        } else if (isset($data['teacherIds']) && is_array($data['teacherIds'])) {
            $pdo->prepare("DELETE FROM class_assignments WHERE class_id = ?")->execute([$id]);
            $asStmt = $pdo->prepare("INSERT INTO class_assignments (class_id, teacher_id, role) VALUES (?, ?, ?)");
            foreach ($data['teacherIds'] as $idx => $tId) {
                $tId = strtoupper(trim($tId));
                if (!empty($tId)) {
                    $rStmt = $pdo->prepare("SELECT role FROM teachers WHERE teacher_id = ? LIMIT 1");
                    $rStmt->execute([$tId]);
                    $tDbRole = $rStmt->fetchColumn();
                    $trole = (!empty($tDbRole) && $tDbRole !== 'Chưa phân công') ? $tDbRole : (($idx === 0) ? 'Chủ nhiệm' : 'Đồng hành');
                    $asStmt->execute([$id, $tId, $trole]);
                }
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
