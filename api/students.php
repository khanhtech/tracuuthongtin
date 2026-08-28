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
                       s.parent_name as parentName,
                       s.parent_phone as parentPhone,
                       s.address,
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
                       s.last_name as lastName,
                       s.first_name as firstName,
                       s.full_name as fullName,
                       s.gender,
                       s.birth_date as birthDate,
                       s.parent_name as parentName,
                       s.parent_phone as parentPhone,
                       s.address,
                       eg.class_id as classId,
                       c.class_name as className,
                       c.block as classBlock,
                       eg.stt_in_class as stt,
                       eg.role_in_class as note,
                       eg.score_final as scoreFinal,
                       eg.evaluation
                FROM students s
                JOIN enrollments_and_grades eg ON s.student_id = eg.student_id
                LEFT JOIN classes c ON eg.class_id = c.class_id
                ORDER BY c.block ASC, c.class_name ASC, eg.stt_in_class ASC, s.student_id ASC
            ");
            $students = $stmt->fetchAll();
            jsonResponse(true, "Lấy toàn bộ danh sách thiếu nhi thành công", $students);
        }
        break;

    case 'POST':
        $data = getJsonInput();

        // 1. XỬ LÝ NHẬP HÀNG LOẠT TỪ EXCEL (BATCH IMPORT)
        if (isset($data['action']) && $data['action'] === 'batch_import' && isset($data['students']) && is_array($data['students'])) {
            $classId = trim($data['class_id'] ?? ($data['classId'] ?? ''));
            $replaceMode = !empty($data['replace_mode']) || !empty($data['replaceMode']);
            $studentsList = $data['students'];

            if (empty($classId)) {
                jsonResponse(false, "Vui lòng chọn lớp học để nhập dữ liệu!", null, 400);
            }

            try {
                $pdo->beginTransaction();

                if ($replaceMode) {
                    $delStmt = $pdo->prepare("DELETE FROM enrollments_and_grades WHERE class_id = ?");
                    $delStmt->execute([$classId]);
                    $pdo->exec("DELETE FROM students WHERE student_id NOT IN (SELECT student_id FROM enrollments_and_grades)");
                }

                $sStmt = $pdo->prepare("
                    INSERT INTO students (student_id, holy_name, last_name, first_name, full_name, gender, birth_date, address, parent_name, parent_phone)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE 
                        holy_name = VALUES(holy_name), 
                        full_name = VALUES(full_name), 
                        gender = VALUES(gender), 
                        birth_date = VALUES(birth_date),
                        address = VALUES(address),
                        parent_name = VALUES(parent_name),
                        parent_phone = VALUES(parent_phone)
                ");

                $egStmt = $pdo->prepare("
                    INSERT INTO enrollments_and_grades (student_id, class_id, academic_year, stt_in_class, role_in_class)
                    VALUES (?, ?, '2026-2027', ?, ?)
                    ON DUPLICATE KEY UPDATE 
                        stt_in_class = VALUES(stt_in_class),
                        role_in_class = VALUES(role_in_class)
                ");

                $count = 0;
                $stt = 1;
                if (!$replaceMode) {
                    $maxStt = $pdo->prepare("SELECT COALESCE(MAX(stt_in_class), 0) FROM enrollments_and_grades WHERE class_id = ?");
                    $maxStt->execute([$classId]);
                    $stt = (int)$maxStt->fetchColumn() + 1;
                }

                $code = str_replace('CLASS_', '', $classId);

                foreach ($studentsList as $s) {
                    $fullName = trim($s['fullName'] ?? ($s['full_name'] ?? ''));
                    if (empty($fullName)) continue;

                    $holyName = trim($s['holyName'] ?? ($s['holy_name'] ?? ''));
                    $gender = trim($s['gender'] ?? 'Nam');
                    $rawNote = trim($s['note'] ?? ($s['role_in_class'] ?? 'Thiếu nhi'));
                    $note = ($rawNote === 'Lớp trưởng') ? 'Lớp trưởng' : 'Thiếu nhi';
                    $parentName = trim($s['parentName'] ?? ($s['parent_name'] ?? ''));
                    $parentPhone = trim($s['parentPhone'] ?? ($s['parent_phone'] ?? ''));
                    $address = trim($s['address'] ?? '');

                    $parts = explode(' ', $fullName);
                    $firstName = array_pop($parts);
                    $lastName = implode(' ', $parts);

                    $studentId = trim($s['id'] ?? ($s['student_id'] ?? ''));
                    if (empty($studentId)) {
                        $studentId = "TN-{$code}-" . str_pad($stt, 2, '0', STR_PAD_LEFT);
                    }

                    $sStmt->execute([$studentId, $holyName, $lastName, $firstName, $fullName, $gender, $birthDate, $address, $parentName, $parentPhone]);
                    $egStmt->execute([$studentId, $classId, $stt, $note]);

                    $stt++;
                    $count++;
                }

                $pdo->commit();
                jsonResponse(true, "Đã nhập thành công {$count} em thiếu nhi vào lớp!", ["imported_count" => $count]);
            } catch (Exception $e) {
                if ($pdo->inTransaction()) $pdo->rollBack();
                jsonResponse(false, "Lỗi khi nhập dữ liệu: " . $e->getMessage(), null, 500);
            }
            break;
        }

        // 1.1 XỬ LÝ LƯU ĐIỂM SỐ & CHUYÊN CẦN CỦA LỚP
        if (isset($data['action']) && $data['action'] === 'save_class_grades' && isset($data['grades']) && is_array($data['grades'])) {
            $classId = trim($data['class_id'] ?? ($data['classId'] ?? ''));
            $grades = $data['grades'];

            try {
                $pdo->beginTransaction();
                $updateStmt = $pdo->prepare("
                    UPDATE enrollments_and_grades 
                    SET score_attendance_1 = ?,
                        score_oral_1 = ?,
                        score_15m_1 = ?,
                        score_1period_1 = ?,
                        score_exam_1 = ?,
                        score_avg_1 = ?,
                        score_attendance_2 = ?,
                        score_oral_2 = ?,
                        score_15m_2 = ?,
                        score_1period_2 = ?,
                        score_exam_2 = ?,
                        score_avg_2 = ?,
                        score_final = ?,
                        evaluation = ?
                    WHERE student_id = ? AND class_id = ?
                ");

                foreach ($grades as $g) {
                    $sId = trim($g['studentId'] ?? ($g['id'] ?? ''));
                    if (empty($sId)) continue;

                    $updateStmt->execute([
                        $g['score_attendance_1'] ?? null,
                        $g['score_oral_1'] ?? null,
                        $g['score_15m_1'] ?? null,
                        $g['score_1period_1'] ?? null,
                        $g['score_exam_1'] ?? null,
                        $g['score_avg_1'] ?? null,
                        $g['score_attendance_2'] ?? null,
                        $g['score_oral_2'] ?? null,
                        $g['score_15m_2'] ?? null,
                        $g['score_1period_2'] ?? null,
                        $g['score_exam_2'] ?? null,
                        $g['score_avg_2'] ?? null,
                        $g['score_final'] ?? null,
                        $g['evaluation'] ?? 'Đang học',
                        $sId,
                        $classId
                    ]);
                }
                $pdo->commit();
                jsonResponse(true, "Đã cập nhật bảng điểm vào MySQL thành công!");
            } catch (Exception $e) {
                if ($pdo->inTransaction()) $pdo->rollBack();
                jsonResponse(false, "Lỗi khi lưu điểm: " . $e->getMessage(), null, 500);
            }
            break;
        }

        // 2. XỬ LÝ THÊM ĐƠN LẺ 1 THIẾU NHI
        $classId = trim($data['class_id'] ?? ($data['classId'] ?? ''));
        $holyName = trim($data['holyName'] ?? ($data['holy_name'] ?? ''));
        $fullName = trim($data['fullName'] ?? ($data['full_name'] ?? ''));
        $gender = trim($data['gender'] ?? 'Nam');
        $rawNote = trim($data['note'] ?? ($data['role_in_class'] ?? 'Thiếu nhi'));
        $note = ($rawNote === 'Lớp trưởng') ? 'Lớp trưởng' : 'Thiếu nhi';

        if (empty($fullName)) {
            jsonResponse(false, "Họ và tên thiếu nhi không được để trống!", null, 400);
        }

        // Tách họ và tên
        $parts = explode(' ', $fullName);
        $firstName = array_pop($parts);
        $lastName = implode(' ', $parts);

        // Sinh mã thiếu nhi nếu chưa có
        $studentId = trim($data['id'] ?? ($data['student_id'] ?? ''));
        $parentName = trim($data['parentName'] ?? ($data['parent_name'] ?? ''));
        $parentPhone = trim($data['parentPhone'] ?? ($data['parent_phone'] ?? ''));
        $address = trim($data['address'] ?? '');

        if (empty($studentId)) {
            $code = str_replace('CLASS_', '', $classId);
            $count = $pdo->query("SELECT COUNT(*) FROM students")->fetchColumn() + 1;
            $studentId = "TN-{$code}-" . str_pad($count, 2, '0', STR_PAD_LEFT);
        }

        // 1. Thêm vào bảng students
        $sStmt = $pdo->prepare("
            INSERT INTO students (student_id, holy_name, last_name, first_name, full_name, gender, birth_date, address, parent_name, parent_phone)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                holy_name = VALUES(holy_name), 
                full_name = VALUES(full_name), 
                gender = VALUES(gender), 
                birth_date = VALUES(birth_date),
                address = VALUES(address),
                parent_name = VALUES(parent_name),
                parent_phone = VALUES(parent_phone)
        ");
        $sStmt->execute([$studentId, $holyName, $lastName, $firstName, $fullName, $gender, $birthDate, $address, $parentName, $parentPhone]);

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
            "note" => $note,
            "parentName" => $parentName,
            "parentPhone" => $parentPhone,
            "address" => $address
        ], 201);
        break;

    case 'PUT':
        $data = getJsonInput();
        $oldStudentId = trim($_GET['id'] ?? ($data['original_id'] ?? ($data['origId'] ?? ($data['id'] ?? ($data['student_id'] ?? '')))));
        $newStudentId = trim($data['id'] ?? ($data['student_id'] ?? $oldStudentId));
        $classId = trim($data['class_id'] ?? ($data['classId'] ?? ''));

        if (empty($oldStudentId)) {
            jsonResponse(false, "Thiếu mã thiếu nhi cần sửa!", null, 400);
        }

        try {
            $pdo->beginTransaction();

            // Nếu Admin đổi Mã Thiếu Nhi mới
            if (!empty($newStudentId) && $newStudentId !== $oldStudentId) {
                $pdo->exec("SET FOREIGN_KEY_CHECKS=0");
                $upIdStmt = $pdo->prepare("UPDATE students SET student_id = ? WHERE student_id = ?");
                $upIdStmt->execute([$newStudentId, $oldStudentId]);

                $upEgIdStmt = $pdo->prepare("UPDATE enrollments_and_grades SET student_id = ? WHERE student_id = ?");
                $upEgIdStmt->execute([$newStudentId, $oldStudentId]);
                $pdo->exec("SET FOREIGN_KEY_CHECKS=1");
                $studentId = $newStudentId;
            } else {
                $studentId = $oldStudentId;
            }

            $holyName = trim($data['holyName'] ?? ($data['holy_name'] ?? ''));
            $fullName = trim($data['fullName'] ?? ($data['full_name'] ?? ''));
            $gender = trim($data['gender'] ?? 'Nam');
            $rawNote = trim($data['note'] ?? ($data['role_in_class'] ?? 'Thiếu nhi'));
            $note = ($rawNote === 'Lớp trưởng') ? 'Lớp trưởng' : 'Thiếu nhi';
            $parentName = trim($data['parentName'] ?? ($data['parent_name'] ?? ''));
            $parentPhone = trim($data['parentPhone'] ?? ($data['parent_phone'] ?? ''));
            $address = trim($data['address'] ?? '');

            $parts = explode(' ', $fullName);
            $firstName = array_pop($parts);
            $lastName = implode(' ', $parts);

            $upStmt = $pdo->prepare("
                UPDATE students 
                SET holy_name = ?, last_name = ?, first_name = ?, full_name = ?, gender = ?, birth_date = ?, parent_name = ?, parent_phone = ?, address = ?
                WHERE student_id = ?
            ");
            $upStmt->execute([$holyName, $lastName, $firstName, $fullName, $gender, $birthDate, $parentName, $parentPhone, $address, $studentId]);

            if (!empty($classId)) {
                $upEg = $pdo->prepare("
                    UPDATE enrollments_and_grades 
                    SET role_in_class = ?
                    WHERE student_id = ? AND class_id = ?
                ");
                $upEg->execute([$note, $studentId, $classId]);
            }

            $pdo->commit();
            jsonResponse(true, "Cập nhật thông tin thiếu nhi thành công!", [
                "id" => $studentId,
                "holyName" => $holyName,
                "fullName" => $fullName,
                "gender" => $gender,
                "birthDate" => $birthDate,
                "note" => $note,
                "parentName" => $parentName,
                "parentPhone" => $parentPhone,
                "address" => $address
            ]);
        } catch (Exception $e) {
            if ($pdo->inTransaction()) $pdo->rollBack();
            jsonResponse(false, "Lỗi khi cập nhật thiếu nhi: " . $e->getMessage(), null, 500);
        }
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
