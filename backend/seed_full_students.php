<?php
// ==============================================================================
// SCRIPT SEED TOÀN BỘ 306 THIẾU NHI VÀO MYSQL (STUDENTS & ENROLLMENTS_AND_GRADES)
// ==============================================================================

require_once __DIR__ . '/../api/config/database.php';

echo "🚀 BẮT ĐẦU SEED TOÀN BỘ DỮ LIỆU THIẾU NHI VÀO MYSQL...\n";

// Danh sách các Tên Thánh chuẩn mực
$maleHolyNames = ['Giuse', 'Phêrô', 'Phaolô', 'Đaminh', 'Phanxicô', 'Gioan Baotixita', 'Antôn', 'Micae', 'Tôma', 'Augustinô', 'Giacôbê', 'Anrê', 'Luca', 'Matthêu', 'Martinô'];
$femaleHolyNames = ['Maria', 'Têrêsa', 'Anna', 'Catarina', 'Cecilia', 'Lucia', 'Agata', 'Rosa', 'Matta', 'Elisabeth', 'Monika', 'Agnes', 'Madalena'];

$hoList = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý'];
$demNamList = ['Minh', 'Hoàng', 'Gia', 'Tuấn', 'Đức', 'Quốc', 'Văn', 'Hữu', 'Bảo', 'Thành', 'Trọng', 'Khánh', 'Nhật', 'Việt', 'Đăng'];
$tenNamList = ['An', 'Bảo', 'Cường', 'Dũng', 'Đạt', 'Đức', 'Hải', 'Hiếu', 'Huy', 'Khang', 'Khoa', 'Khôi', 'Long', 'Minh', 'Nam', 'Nghĩa', 'Nguyên', 'Nhân', 'Phát', 'Phong', 'Phúc', 'Quân', 'Quang', 'Sơn', 'Tài', 'Tâm', 'Thắng', 'Thịnh', 'Thuận', 'Toàn', 'Trí', 'Trung', 'Tuấn', 'Tùng', 'Vinh', 'Vũ'];

$demNuList = ['Ngọc', 'Thảo', 'Thị', 'Phương', 'Mai', 'Khánh', 'Bảo', 'Thanh', 'Như', 'Tuyết', 'Trúc', 'Hải', 'Hồng', 'Yến', 'Minh'];
$tenNuList = ['An', 'Anh', 'Chi', 'Duyên', 'Giang', 'Hà', 'Hân', 'Hiền', 'Hoa', 'Hương', 'Huyền', 'Khánh', 'Lan', 'Linh', 'Ly', 'Mai', 'My', 'Ngân', 'Nhi', 'Nhung', 'Oanh', 'Phương', 'Quỳnh', 'Thảo', 'Thu', 'Thủy', 'Tiên', 'Trang', 'Trâm', 'Trinh', 'Tú', 'Uyên', 'Vân', 'Vy', 'Yến'];

$giaoHoList = ['Giáo họ Thánh Giuse', 'Giáo họ Đức Mẹ Vô Nhiễm', 'Giáo họ Thánh Phêrô', 'Giáo họ Thánh Tâm', 'Giáo họ Các Thánh Tử Đạo', 'Khu Phố Tân Mỹ 1', 'Khu Phố Tân Mỹ 2'];

// Lấy danh sách tất cả các lớp học từ bảng classes
$stmtClasses = $pdo->query("SELECT class_id, class_name, block FROM classes ORDER BY block ASC, class_name ASC");
$classes = $stmtClasses->fetchAll(PDO::FETCH_ASSOC);

if (empty($classes)) {
    die("❌ Không tìm thấy lớp học nào trong bảng classes!\n");
}

try {
    $pdo->beginTransaction();

    // Xóa dữ liệu cũ
    $pdo->exec("DELETE FROM enrollments_and_grades");
    $pdo->exec("DELETE FROM students");

    $stmtInsertStudent = $pdo->prepare("
        INSERT INTO students (student_id, holy_name, last_name, first_name, full_name, gender, birth_date, address, parent_name, parent_phone, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    ");

    $stmtInsertEnrollment = $pdo->prepare("
        INSERT INTO enrollments_and_grades (
            student_id, class_id, academic_year, stt_in_class, role_in_class,
            score_attendance_1, score_oral_1, score_15m_1, score_1period_1, score_exam_1, score_avg_1,
            score_attendance_2, score_oral_2, score_15m_2, score_1period_2, score_exam_2, score_avg_2,
            score_final, evaluation, created_at, updated_at
        ) VALUES (
            ?, ?, '2026-2027', ?, ?,
            ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?,
            ?, ?, NOW(), NOW()
        )
    ");

    $totalStudents = 0;

    foreach ($classes as $cls) {
        $cId = $cls['class_id'];
        $cName = $cls['class_name'];
        $cBlock = $cls['block'];

        // Xác định năm sinh tương ứng theo khối
        $birthYear = 2019;
        if ($cBlock === 'Khai Tâm') $birthYear = 2018;
        if ($cBlock === 'Rước Lễ') $birthYear = 2016;
        if ($cBlock === 'Thêm Sức') $birthYear = 2014;
        if ($cBlock === 'Bao Đồng') $birthYear = 2012;
        if ($cBlock === 'Vào Đời') $birthYear = 2010;

        $code = str_replace('CLASS_', '', $cId);
        $studentCount = 22; // ~22 em mỗi lớp
        if (in_array($code, ['KT1', 'RL1', 'TS1', 'BD1'])) $studentCount = 24;
        if (in_array($code, ['DBKT', 'VD1', 'VD2'])) $studentCount = 20;

        for ($stt = 1; $stt <= $studentCount; $stt++) {
            $isMale = ($stt % 2 !== 0);
            $gender = $isMale ? 'Nam' : 'Nữ';
            $holyName = $isMale ? $maleHolyNames[($stt * 7) % count($maleHolyNames)] : $femaleHolyNames[($stt * 5) % count($femaleHolyNames)];

            $ho = $hoList[($stt * 3 + $totalStudents) % count($hoList)];
            $dem = $isMale ? $demNamList[($stt * 2 + $totalStudents) % count($demNamList)] : $demNuList[($stt * 2 + $totalStudents) % count($demNuList)];
            $ten = $isMale ? $tenNamList[($stt * 4 + $totalStudents) % count($tenNamList)] : $tenNuList[($stt * 4 + $totalStudents) % count($tenNuList)];

            $lastName = "{$ho} {$dem}";
            $firstName = $ten;
            $fullName = "{$lastName} {$firstName}";

            $studentId = "TN-{$code}-" . str_pad($stt, 2, '0', STR_PAD_LEFT);
            $day = str_pad(($stt * 3) % 28 + 1, 2, '0', STR_PAD_LEFT);
            $month = str_pad(($stt * 2) % 12 + 1, 2, '0', STR_PAD_LEFT);
            $birthDate = "{$day}/{$month}/{$birthYear}";

            $address = $giaoHoList[($stt + $totalStudents) % count($giaoHoList)];
            $parentName = "{$ho} Văn " . $tenNamList[($stt + 5) % count($tenNamList)];
            $parentPhone = "09" . str_pad(($stt * 3829 + 1234567) % 100000000, 8, '0', STR_PAD_LEFT);

            $role = 'Đang theo học';
            if ($stt === 1) $role = 'Lớp trưởng';
            if ($stt === 2) $role = 'Lớp phó học tập';
            if ($stt === 3) $role = 'Lớp phó kỷ luật';

            // Điểm số mẫu
            $oral1 = round(min(10, max(7, 7.5 + ($stt % 4) * 0.5)), 1);
            $m15_1 = round(min(10, max(7, 8.0 + (($stt + 1) % 4) * 0.5)), 1);
            $p1_1 = round(min(10, max(7, 7.5 + (($stt + 2) % 4) * 0.5)), 1);
            $exam1 = round(min(10, max(7, 8.0 + (($stt + 3) % 4) * 0.5)), 1);
            $avg1 = round(($oral1 + $m15_1 + $p1_1 * 2 + $exam1 * 3) / 7, 1);

            $oral2 = round(min(10, max(7, $oral1 + 0.5)), 1);
            $m15_2 = round(min(10, max(7, $m15_1 + 0.5)), 1);
            $p1_2 = round(min(10, max(7, $p1_1 + 0.5)), 1);
            $exam2 = round(min(10, max(7, $exam1 + 0.5)), 1);
            $avg2 = round(($oral2 + $m15_2 + $p1_2 * 2 + $exam2 * 3) / 7, 1);

            $scoreFinal = round(($avg1 + $avg2 * 2) / 3, 1);
            $evaluation = ($scoreFinal >= 8.5) ? 'Giỏi' : (($scoreFinal >= 7.0) ? 'Khá' : 'Đạt');

            // Insert student
            $stmtInsertStudent->execute([
                $studentId, $holyName, $lastName, $firstName, $fullName,
                $gender, $birthDate, $address, $parentName, $parentPhone
            ]);

            // Insert enrollment
            $stmtInsertEnrollment->execute([
                $studentId, $cId, $stt, $role,
                10.0, $oral1, $m15_1, $p1_1, $exam1, $avg1,
                10.0, $oral2, $m15_2, $p1_2, $exam2, $avg2,
                $scoreFinal, $evaluation
            ]);

            $totalStudents++;
        }
    }

    $pdo->commit();
    echo "🎉 SEED THÀNH CÔNG! ĐÃ TẠO {$totalStudents} THIẾU NHI VÀO 14 LỚP TRONG BẢNG `students` VÀ `enrollments_and_grades`!\n";
} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    echo "❌ LỖI SEED THIẾU NHI: " . $e->getMessage() . "\n";
}
