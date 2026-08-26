<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('admins')->delete();
        DB::table('admins')->insert([
            [
                'username' => 'admin',
                'password' => 'admin123',
                'display_name' => 'Quản Trị Viên Giáo Xứ',
                'role' => 'admin',
            ],
            [
                'username' => 'bql',
                'password' => '123456',
                'display_name' => 'Ban Giáo Lý Tân Mỹ',
                'role' => 'admin',
            ],
        ]);
    }
}
