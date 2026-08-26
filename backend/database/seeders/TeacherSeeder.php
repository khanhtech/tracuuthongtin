<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TeacherSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('teachers')->delete();
        DB::table('teachers')->insert([
            ['stt' => 1, 'teacher_id' => 'GLV01', 'holy_name' => 'MARIA', 'last_name' => 'TRẦN THỊ NGỌC', 'first_name' => 'ANH', 'gender' => 'Nữ', 'cert' => '2', 'photo_url' => ''],
            ['stt' => 2, 'teacher_id' => 'GLV02', 'holy_name' => 'ANNA', 'last_name' => 'PHẠM VŨ THÙY', 'first_name' => 'DƯƠNG', 'gender' => 'Nữ', 'cert' => '1', 'photo_url' => ''],
            ['stt' => 3, 'teacher_id' => 'GLV03', 'holy_name' => 'MARIA', 'last_name' => 'VŨ THỊ THÙY', 'first_name' => 'DƯƠNG', 'gender' => 'Nữ', 'cert' => '3', 'photo_url' => ''],
            ['stt' => 4, 'teacher_id' => 'GLV04', 'holy_name' => 'MARIA', 'last_name' => 'NGUYỄN NGỌC THÙY', 'first_name' => 'DƯƠNG', 'gender' => 'Nữ', 'cert' => '2', 'photo_url' => ''],
            ['stt' => 5, 'teacher_id' => 'GLV05', 'holy_name' => 'GIUSE', 'last_name' => 'LÊ', 'first_name' => 'DUY', 'gender' => 'Nam', 'cert' => '1', 'photo_url' => ''],
            ['stt' => 6, 'teacher_id' => 'GLV06', 'holy_name' => 'TERESA', 'last_name' => 'ĐÀO PHƯƠNG', 'first_name' => 'GIANG', 'gender' => 'Nữ', 'cert' => '2', 'photo_url' => ''],
            ['stt' => 7, 'teacher_id' => 'GLV07', 'holy_name' => 'MARIA', 'last_name' => 'TRẦN NGỌC HƯƠNG', 'first_name' => 'GIANG', 'gender' => 'Nữ', 'cert' => '2', 'photo_url' => ''],
            ['stt' => 8, 'teacher_id' => 'GLV08', 'holy_name' => 'TERESA', 'last_name' => 'DƯƠNG THỊ MỸ', 'first_name' => 'HẠNH', 'gender' => 'Nữ', 'cert' => '3', 'photo_url' => ''],
            ['stt' => 9, 'teacher_id' => 'GLV09', 'holy_name' => 'TERESA', 'last_name' => 'NGUYỄN PHÚC NGỌC', 'first_name' => 'HÂN', 'gender' => 'Nữ', 'cert' => '1', 'photo_url' => ''],
            ['stt' => 10, 'teacher_id' => 'GLV10', 'holy_name' => 'GIUSE', 'last_name' => 'NGUYỄN VĂN', 'first_name' => 'HIẾU', 'gender' => 'Nam', 'cert' => '3', 'photo_url' => ''],
            ['stt' => 11, 'teacher_id' => 'GLV11', 'holy_name' => 'TERESA', 'last_name' => 'ĐẶNG THỊ KIM', 'first_name' => 'HOA', 'gender' => 'Nữ', 'cert' => '2', 'photo_url' => ''],
            ['stt' => 12, 'teacher_id' => 'GLV12', 'holy_name' => 'MARIA', 'last_name' => 'PHAN THỊ THANH', 'first_name' => 'HOÀI', 'gender' => 'Nữ', 'cert' => '2', 'photo_url' => ''],
            ['stt' => 13, 'teacher_id' => 'GLV13', 'holy_name' => 'ĐAMINH', 'last_name' => 'ĐẶNG TRẦN NHẬT', 'first_name' => 'HOAN', 'gender' => 'Nam', 'cert' => '2', 'photo_url' => ''],
            ['stt' => 14, 'teacher_id' => 'GLV14', 'holy_name' => 'GIOAN BOSCO', 'last_name' => 'ĐỊNH QUANG', 'first_name' => 'HUY', 'gender' => 'Nam', 'cert' => '3', 'photo_url' => ''],
            ['stt' => 15, 'teacher_id' => 'GLV15', 'holy_name' => 'MARIA', 'last_name' => 'BÙI DIỆU', 'first_name' => 'HUYỀN', 'gender' => 'Nữ', 'cert' => '3', 'photo_url' => ''],
            ['stt' => 16, 'teacher_id' => 'GLV16', 'holy_name' => 'ĐAMINH', 'last_name' => 'ĐÀO BẢO', 'first_name' => 'KHANH', 'gender' => 'Nam', 'cert' => '3 - BMVTN', 'photo_url' => ''],
            ['stt' => 17, 'teacher_id' => 'GLV17', 'holy_name' => 'GIOAN KIM', 'last_name' => 'TRẦN VŨ ĐĂNG', 'first_name' => 'KHOA', 'gender' => 'Nam', 'cert' => '2 - BMVTN', 'photo_url' => ''],
            ['stt' => 18, 'teacher_id' => 'GLV18', 'holy_name' => 'MARIA', 'last_name' => 'LÂM HOÀI', 'first_name' => 'LIÊN', 'gender' => 'Nữ', 'cert' => '3', 'photo_url' => ''],
            ['stt' => 19, 'teacher_id' => 'GLV19', 'holy_name' => 'GIUSE', 'last_name' => 'LÊ DƯƠNG CÔNG', 'first_name' => 'MINH', 'gender' => 'Nam', 'cert' => '2 - BMVTN', 'photo_url' => ''],
            ['stt' => 20, 'teacher_id' => 'GLV20', 'holy_name' => 'MARIA', 'last_name' => 'DƯƠNG ĐỖ GIA', 'first_name' => 'NGHI', 'gender' => 'Nữ', 'cert' => '3', 'photo_url' => ''],
            ['stt' => 21, 'teacher_id' => 'GLV21', 'holy_name' => 'GIOANKIM', 'last_name' => 'NGUYỄN ĐỨC', 'first_name' => 'NHẬT', 'gender' => 'Nam', 'cert' => '1', 'photo_url' => ''],
            ['stt' => 22, 'teacher_id' => 'GLV22', 'holy_name' => 'MARIA', 'last_name' => 'NGUYỄN HÀ UYÊN', 'first_name' => 'NHI', 'gender' => 'Nữ', 'cert' => '2', 'photo_url' => ''],
            ['stt' => 23, 'teacher_id' => 'GLV23', 'holy_name' => 'MARIA', 'last_name' => 'NGUYỄN THỊ DIỆU', 'first_name' => 'NHƯ', 'gender' => 'Nữ', 'cert' => '1', 'photo_url' => ''],
            ['stt' => 24, 'teacher_id' => 'GLV24', 'holy_name' => 'MARIA', 'last_name' => 'TRẦN NHẬT QUỲNH', 'first_name' => 'NHƯ', 'gender' => 'Nữ', 'cert' => '1', 'photo_url' => ''],
            ['stt' => 25, 'teacher_id' => 'GLV25', 'holy_name' => 'ANNA', 'last_name' => 'HOÀNG NHƯ', 'first_name' => 'QUỲNH', 'gender' => 'Nữ', 'cert' => '1', 'photo_url' => ''],
            ['stt' => 26, 'teacher_id' => 'GLV26', 'holy_name' => 'MARIA', 'last_name' => 'PHẠM NGUYỄN HƯƠNG', 'first_name' => 'QUỲNH', 'gender' => 'Nữ', 'cert' => '1', 'photo_url' => ''],
            ['stt' => 27, 'teacher_id' => 'GLV27', 'holy_name' => 'TERESA', 'last_name' => 'KIM NGUYỄN THANH', 'first_name' => 'TÂM', 'gender' => 'Nữ', 'cert' => '2', 'photo_url' => ''],
            ['stt' => 28, 'teacher_id' => 'GLV28', 'holy_name' => 'PHERO', 'last_name' => 'HOÀNG NHẬT', 'first_name' => 'TÂN', 'gender' => 'Nam', 'cert' => '1', 'photo_url' => ''],
            ['stt' => 29, 'teacher_id' => 'GLV29', 'holy_name' => 'MARIA', 'last_name' => 'VÕ NGỌC LAN', 'first_name' => 'THẢO', 'gender' => 'Nữ', 'cert' => '3', 'photo_url' => ''],
            ['stt' => 30, 'teacher_id' => 'GLV30', 'holy_name' => 'TERESA', 'last_name' => 'ĐỊNH THỊ THANH', 'first_name' => 'THẢO', 'gender' => 'Nữ', 'cert' => '3', 'photo_url' => ''],
            ['stt' => 31, 'teacher_id' => 'GLV31', 'holy_name' => 'ANNA', 'last_name' => 'VŨ THỊ', 'first_name' => 'THẢO', 'gender' => 'Nữ', 'cert' => '3', 'photo_url' => ''],
            ['stt' => 32, 'teacher_id' => 'GLV32', 'holy_name' => 'GIUSE', 'last_name' => 'VÕ DUY', 'first_name' => 'THỐNG', 'gender' => 'Nam', 'cert' => '2', 'photo_url' => ''],
            ['stt' => 33, 'teacher_id' => 'GLV33', 'holy_name' => 'MARIA', 'last_name' => 'VŨ NGỌC ANH', 'first_name' => 'THƯ', 'gender' => 'Nữ', 'cert' => '2', 'photo_url' => ''],
            ['stt' => 34, 'teacher_id' => 'GLV34', 'holy_name' => 'MARIA', 'last_name' => 'TRẦN NHẬT ANH', 'first_name' => 'THƯ', 'gender' => 'Nữ', 'cert' => '2', 'photo_url' => ''],
            ['stt' => 35, 'teacher_id' => 'GLV35', 'holy_name' => 'PHERO', 'last_name' => 'NGUYỄN TẤN', 'first_name' => 'TIẾN', 'gender' => 'Nam', 'cert' => '1', 'photo_url' => ''],
            ['stt' => 36, 'teacher_id' => 'GLV36', 'holy_name' => 'MARIA', 'last_name' => 'BẠCH NGUYỄN BẢO', 'first_name' => 'TRÂM', 'gender' => 'Nữ', 'cert' => '1', 'photo_url' => ''],
            ['stt' => 37, 'teacher_id' => 'GLV37', 'holy_name' => 'TERESA', 'last_name' => 'NGUYỄN NHẬT KHÁNH', 'first_name' => 'TRÂN', 'gender' => 'Nữ', 'cert' => '3 - BMVTN', 'photo_url' => ''],
            ['stt' => 38, 'teacher_id' => 'GLV38', 'holy_name' => 'MARIA', 'last_name' => 'NGUYỄN THANH', 'first_name' => 'TRÚC', 'gender' => 'Nữ', 'cert' => '1', 'photo_url' => ''],
            ['stt' => 39, 'teacher_id' => 'GLV39', 'holy_name' => 'MARIA', 'last_name' => 'ĐOÀN THANH', 'first_name' => 'TRÚC', 'gender' => 'Nữ', 'cert' => '', 'photo_url' => ''],
            ['stt' => 40, 'teacher_id' => 'GLV40', 'holy_name' => 'MARIA', 'last_name' => 'TRẦN NGUYỄN PHƯƠNG', 'first_name' => 'UYÊN', 'gender' => 'Nữ', 'cert' => '1', 'photo_url' => ''],
            ['stt' => 41, 'teacher_id' => 'GLV41', 'holy_name' => 'MARIA', 'last_name' => 'NGUYỄN KHÁNH', 'first_name' => 'VY', 'gender' => 'Nữ', 'cert' => '', 'photo_url' => ''],
        ]);
    }
}
