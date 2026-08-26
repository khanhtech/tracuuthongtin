<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EnrollmentAndGradeSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('enrollments_and_grades')->delete();
        DB::table('enrollments_and_grades')->insert([
            [
                'student_id' => 'TN-DBKT-01',
                'class_id' => 'DBKT_2627',
                'academic_year' => '2026-2027',
                'stt_in_class' => 1,
                'role_in_class' => 'Lớp trưởng',
                'score_attendance_1' => 10.0,
                'score_oral_1' => 9.0,
                'score_15m_1' => 9.5,
                'score_1period_1' => 9.0,
                'score_exam_1' => 9.5,
                'score_avg_1' => 9.4,
                'score_final' => 9.4,
                'evaluation' => 'Xuất Sắc',
            ],
            [
                'student_id' => 'TN-DBKT-02',
                'class_id' => 'DBKT_2627',
                'academic_year' => '2026-2027',
                'stt_in_class' => 2,
                'role_in_class' => 'Lớp phó học tập',
                'score_attendance_1' => 10.0,
                'score_oral_1' => 8.5,
                'score_15m_1' => 9.0,
                'score_1period_1' => 8.5,
                'score_exam_1' => 9.0,
                'score_avg_1' => 8.9,
                'score_final' => 8.9,
                'evaluation' => 'Giỏi',
            ],
            [
                'student_id' => 'TN-DBKT-03',
                'class_id' => 'DBKT_2627',
                'academic_year' => '2026-2027',
                'stt_in_class' => 3,
                'role_in_class' => 'Đang theo học',
                'score_attendance_1' => 9.0,
                'score_oral_1' => 8.0,
                'score_15m_1' => 8.0,
                'score_1period_1' => 8.5,
                'score_exam_1' => 8.0,
                'score_avg_1' => 8.2,
                'score_final' => 8.2,
                'evaluation' => 'Khá',
            ],
            [
                'student_id' => 'TN-DBKT-04',
                'class_id' => 'DBKT_2627',
                'academic_year' => '2026-2027',
                'stt_in_class' => 4,
                'role_in_class' => 'Đang theo học',
                'score_attendance_1' => 9.5,
                'score_oral_1' => 8.5,
                'score_15m_1' => 8.5,
                'score_1period_1' => 9.0,
                'score_exam_1' => 8.5,
                'score_avg_1' => 8.7,
                'score_final' => 8.7,
                'evaluation' => 'Giỏi',
            ],
            [
                'student_id' => 'TN-DBKT-05',
                'class_id' => 'DBKT_2627',
                'academic_year' => '2026-2027',
                'stt_in_class' => 5,
                'role_in_class' => 'Ban Lễ Sinh',
                'score_attendance_1' => 10.0,
                'score_oral_1' => 9.0,
                'score_15m_1' => 8.5,
                'score_1period_1' => 9.0,
                'score_exam_1' => 9.0,
                'score_avg_1' => 9.0,
                'score_final' => 9.0,
                'evaluation' => 'Giỏi',
            ],
        ]);
    }
}
