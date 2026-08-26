<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GiaoLyClassSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('classes')->delete();
        DB::table('classes')->insert([
            ['class_id' => 'DBKT_2627', 'class_name' => 'Dự Bị Khai Tâm', 'block' => 'Khai Tâm', 'academic_year' => '2026-2027', 'room' => 'Phòng 100 (Dãy A)', 'schedule' => 'Chủ Nhật: 07:30 - 09:00', 'note' => 'Lớp ấu nhi làm quen môi trường Giáo Lý & Thiếu Nhi Thánh Thể'],
            ['class_id' => 'KT1_2627', 'class_name' => 'Khai Tâm 1', 'block' => 'Khai Tâm', 'academic_year' => '2026-2027', 'room' => 'Phòng 101 (Dãy A)', 'schedule' => 'Chủ Nhật: 07:30 - 09:00', 'note' => 'Lớp chuẩn bị làm quen Giáo Lý & Sinh hoạt Thiếu nhi Thánh Thể'],
            ['class_id' => 'KT2_2627', 'class_name' => 'Khai Tâm 2', 'block' => 'Khai Tâm', 'academic_year' => '2026-2027', 'room' => 'Phòng 102 (Dãy A)', 'schedule' => 'Chủ Nhật: 07:30 - 09:00', 'note' => 'Học kinh căn bản, chuyện Phúc Âm và nhân bản Kitô giáo'],
            ['class_id' => 'RL1_2627', 'class_name' => 'Rước Lễ 1', 'block' => 'Rước Lễ', 'academic_year' => '2026-2027', 'room' => 'Phòng 201 (Dãy B)', 'schedule' => 'Chủ Nhật: 07:30 - 09:00', 'note' => 'Học lịch sử Cứu Độ và các Bí Tích Nhập Môn'],
            ['class_id' => 'RL2_2627', 'class_name' => 'Rước Lễ 2', 'block' => 'Rước Lễ', 'academic_year' => '2026-2027', 'room' => 'Phòng 202 (Dãy B)', 'schedule' => 'Chủ Nhật: 07:30 - 09:00', 'note' => 'Bí tích Thánh Thể & Nghi thức Xưng Tội Rước Lễ Lần Đầu'],
            ['class_id' => 'TS1_2627', 'class_name' => 'Thêm Sức 1', 'block' => 'Thêm Sức', 'academic_year' => '2026-2027', 'room' => 'Phòng 301 (Dãy C)', 'schedule' => 'Chủ Nhật: 07:30 - 09:00', 'note' => 'Tìm hiểu ơn Chúa Thánh Thần và Đời sống chứng nhân Kitô hữu'],
            ['class_id' => 'TS2_2627', 'class_name' => 'Thêm Sức 2', 'block' => 'Thêm Sức', 'academic_year' => '2026-2027', 'room' => 'Phòng 302 (Dãy C)', 'schedule' => 'Chủ Nhật: 07:30 - 09:00', 'note' => 'Chuẩn bị lãnh nhận Bí Tích Thêm Sức từ Đức Giám Mục'],
            ['class_id' => 'BD1_2627', 'class_name' => 'Bao Đồng 1', 'block' => 'Bao Đồng', 'academic_year' => '2026-2027', 'room' => 'Hội Trường A', 'schedule' => 'Chủ Nhật: 07:30 - 09:00', 'note' => 'Tuyên Xưng Đức Tin và Sống Lời Chúa giữa dòng đời'],
            ['class_id' => 'BD2_2627', 'class_name' => 'Bao Đồng 2', 'block' => 'Bao Đồng', 'academic_year' => '2026-2027', 'room' => 'Hội Trường B', 'schedule' => 'Chủ Nhật: 07:30 - 09:00', 'note' => 'Tuyên Hứa Bao Đồng & Trưởng thành trong đời sống Kitô hữu'],
            ['class_id' => 'BD3_2627', 'class_name' => 'Bao Đồng 3', 'block' => 'Bao Đồng', 'academic_year' => '2026-2027', 'room' => 'Phòng 401 (Dãy D)', 'schedule' => 'Chủ Nhật: 07:30 - 09:00', 'note' => 'Học hỏi Giáo lý Hội Thánh và Thần học căn bản'],
            ['class_id' => 'BD4_2627', 'class_name' => 'Bao Đồng 4', 'block' => 'Bao Đồng', 'academic_year' => '2026-2027', 'room' => 'Phòng 402 (Dãy D)', 'schedule' => 'Chủ Nhật: 07:30 - 09:00', 'note' => 'Tìm hiểu ơn gọi và định hướng tương lai theo tinh thần Tin Mừng'],
            ['class_id' => 'VD1_2627', 'class_name' => 'Vào Đời 1', 'block' => 'Vào Đời', 'academic_year' => '2026-2027', 'room' => 'Phòng Sinh Hoạt 1', 'schedule' => 'Chủ Nhật: 07:30 - 09:00', 'note' => 'Đạo đức sinh học, Hôn nhân gia đình và Thử thách xã hội'],
            ['class_id' => 'VD2_2627', 'class_name' => 'Vào Đời 2', 'block' => 'Vào Đời', 'academic_year' => '2026-2027', 'room' => 'Phòng Sinh Hoạt 2', 'schedule' => 'Chủ Nhật: 07:30 - 09:00', 'note' => 'Dấn thân phục vụ Giáo Xứ và chuẩn bị trở thành Huynh Trưởng'],
        ]);
    }
}
