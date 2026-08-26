<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StudentSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('students')->delete();
        DB::table('students')->insert([
            [
                'student_id' => 'TN-DBKT-01',
                'holy_name' => 'Giuse',
                'last_name' => 'Nguyễn Minh',
                'first_name' => 'An',
                'full_name' => 'Nguyễn Minh An',
                'gender' => 'Nam',
                'birth_date' => '15/04/2019',
                'parent_name' => 'Nguyễn Văn Hải',
                'parent_phone' => '0901234567',
            ],
            [
                'student_id' => 'TN-DBKT-02',
                'holy_name' => 'Maria',
                'last_name' => 'Trần Ngọc',
                'first_name' => 'Hân',
                'full_name' => 'Trần Ngọc Hân',
                'gender' => 'Nữ',
                'birth_date' => '22/08/2019',
                'parent_name' => 'Trần Văn Nam',
                'parent_phone' => '0902345678',
            ],
            [
                'student_id' => 'TN-DBKT-03',
                'holy_name' => 'Phêrô',
                'last_name' => 'Lê Hoàng',
                'first_name' => 'Long',
                'full_name' => 'Lê Hoàng Long',
                'gender' => 'Nam',
                'birth_date' => '10/01/2019',
                'parent_name' => 'Lê Văn Tuấn',
                'parent_phone' => '0903456789',
            ],
            [
                'student_id' => 'TN-DBKT-04',
                'holy_name' => 'Anna',
                'last_name' => 'Phạm Thảo',
                'first_name' => 'Vy',
                'full_name' => 'Phạm Thảo Vy',
                'gender' => 'Nữ',
                'birth_date' => '05/11/2019',
                'parent_name' => 'Phạm Hữu Nghĩa',
                'parent_phone' => '0904567890',
            ],
            [
                'student_id' => 'TN-DBKT-05',
                'holy_name' => 'Đaminh',
                'last_name' => 'Hoàng Gia',
                'first_name' => 'Bảo',
                'full_name' => 'Hoàng Gia Bảo',
                'gender' => 'Nam',
                'birth_date' => '18/06/2019',
                'parent_name' => 'Hoàng Quốc Việt',
                'parent_phone' => '0905678901',
            ],
        ]);
    }
}
