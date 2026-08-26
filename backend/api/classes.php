<?php
// ==============================================================================
// REST API: QUẢN LÝ LỚP GIÁO LÝ (CLASSES)
// ==============================================================================

require_once __DIR__ . '/../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    // --------------------------------------------------------------------------
    // 1. GET: LẤY DANH SÁCH HOẶC CHI TIẾT LỚP HỌC
    // --------------------------------------------------------------------------
    case 'GET':
        if (isset($_GET['id'])) {
            $id = trim($_GET['id']);
            $stmt = $pdo->prepare("SELECT * FROM classes WHERE id = ? LIMIT 1");
            $stmt->execute([$id]);
            $class = $stmt->fetch();
            if ($class) {
                $class['teacherIds'] = json_decode($class['teacher_ids'], true) ?? [];
                unset($class['teacher_ids']);
                
                // Lấy kèm danh sách thiếu nhi của lớp
                $stuStmt = $pdo->prepare("SELECT * FROM students WHERE class_id = ? ORDER BY stt ASC");
                $stuStmt->execute([$id]);
                $class['students'] = $stuStmt->fetchAll();

                jsonResponse(true, "Lấy thông tin lớp học thành công", $class);
            } else {
                jsonResponse(false, "Không tìm thấy lớp học với mã " . $id, null, 404);
            }
        } else {
            $stmt = $pdo->query("SELECT * FROM classes");
            $classes = $stmt->fetchAll();
            foreach ($classes as &$c) {
                $c['teacherIds'] = json_decode($c['teacher_ids'], true) ?? [];
                unset($c['teacher_ids']);
            }
            jsonResponse(true, "Lấy danh sách lớp học thành công", $classes);
        }
        break;

    // --------------------------------------------------------------------------
    // 2. POST: THÊM MỚI LỚP HỌC
    // --------------------------------------------------------------------------
    case 'POST':
        $data = getJsonInput();

        if (empty($data['name']) || empty($data['block'])) {
            jsonResponse(false, "Tên lớp và Khối lớp không được để trống!", null, 400);
        }

        $id = !empty($data['id']) ? trim($data['id']) : ('CLASS_' . time());
        $name = trim($data['name']);
        $block = trim($data['block']);
        $room = trim($data['room'] ?? '');
        $schedule = trim($data['schedule'] ?? 'Chủ Nhật: 07:30 - 09:00');
        $studentCount = intval($data['studentCount'] ?? 0);
        $teacherIds = json_encode($data['teacherIds'] ?? [], JSON_UNESCAPED_UNICODE);
        $note = trim($data['note'] ?? '');

        // Kiểm tra trùng ID
        $checkStmt = $pdo->prepare("SELECT COUNT(*) FROM classes WHERE id = ?");
        $checkStmt->execute([$id]);
        if ($checkStmt->fetchColumn() > 0) {
            jsonResponse(false, "Mã lớp học này đã tồn tại!", null, 409);
        }

        $insertStmt = $pdo->prepare("
            INSERT INTO classes (id, name, block, room, schedule, student_count, teacher_ids, note)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $insertStmt->execute([$id, $name, block, $room, $schedule, $studentCount, $teacherIds, $note]);

        jsonResponse(true, "Thêm mới lớp học {$name} thành công!", [
            "id" => $id,
            "name" => $name,
            "block" => $block,
            "room" => $room,
            "schedule" => $schedule,
            "studentCount" => $studentCount,
            "teacherIds" => $data['teacherIds'] ?? [],
            "note" => $note
        ], 201);
        break;

    // --------------------------------------------------------------------------
    // 3. PUT: CẬP NHẬT THÔNG TIN LỚP HỌC
    // --------------------------------------------------------------------------
    case 'PUT':
        $data = getJsonInput();
        $id = trim($_GET['id'] ?? ($data['id'] ?? ''));

        if (empty($id)) {
            jsonResponse(false, "Thiếu mã lớp học cần cập nhật!", null, 400);
        }

        $stmt = $pdo->prepare("SELECT * FROM classes WHERE id = ?");
        $stmt->execute([$id]);
        $existing = $stmt->fetch();

        if (!$existing) {
            jsonResponse(false, "Không tìm thấy lớp học cần sửa!", null, 404);
        }

        $name = isset($data['name']) ? trim($data['name']) : $existing['name'];
        $block = isset($data['block']) ? trim($data['block']) : $existing['block'];
        $room = isset($data['room']) ? trim($data['room']) : $existing['room'];
        $schedule = isset($data['schedule']) ? trim($data['schedule']) : $existing['schedule'];
        $studentCount = isset($data['studentCount']) ? intval($data['studentCount']) : $existing['student_count'];
        $teacherIds = isset($data['teacherIds']) ? json_encode($data['teacherIds'], JSON_UNESCAPED_UNICODE) : $existing['teacher_ids'];
        $note = isset($data['note']) ? trim($data['note']) : $existing['note'];

        $updateStmt = $pdo->prepare("
            UPDATE classes 
            SET name = ?, block = ?, room = ?, schedule = ?, student_count = ?, teacher_ids = ?, note = ?
            WHERE id = ?
        ");
        $updateStmt->execute([$name, $block, $room, $schedule, $studentCount, $teacherIds, $note, $id]);

        jsonResponse(true, "Cập nhật thông tin lớp {$name} thành công!");
        break;

    // --------------------------------------------------------------------------
    // 4. DELETE: XÓA LỚP HỌC
    // --------------------------------------------------------------------------
    case 'DELETE':
        $id = trim($_GET['id'] ?? '');
        if (empty($id)) {
            $data = getJsonInput();
            $id = trim($data['id'] ?? '');
        }

        if (empty($id)) {
            jsonResponse(false, "Thiếu mã lớp học cần xóa!", null, 400);
        }

        $deleteStmt = $pdo->prepare("DELETE FROM classes WHERE id = ?");
        $deleteStmt->execute([$id]);

        if ($deleteStmt->rowCount() > 0) {
            jsonResponse(true, "Đã xóa lớp học khỏi hệ thống!");
        } else {
            jsonResponse(false, "Không tìm thấy lớp học để xóa!", null, 404);
        }
        break;

    default:
        jsonResponse(false, "Phương thức HTTP không được hỗ trợ!", null, 405);
        break;
}
?>
