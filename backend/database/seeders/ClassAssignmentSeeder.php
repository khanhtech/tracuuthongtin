<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ClassAssignmentSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('class_assignments')->delete();
        DB::table('class_assignments')->insert([
            ['class_id' => 'DBKT_2627', 'teacher_id' => 'GLV05', 'role' => 'Huynh trưởng phụ trách'],
            ['class_id' => 'DBKT_2627', 'teacher_id' => 'GLV24', 'role' => 'GLV đứng lớp'],
            ['class_id' => 'KT1_2627', 'teacher_id' => 'GLV01', 'role' => 'Huynh trưởng phụ trách'],
            ['class_id' => 'KT1_2627', 'teacher_id' => 'GLV11', 'role' => 'GLV đứng lớp'],
            ['class_id' => 'KT2_2627', 'teacher_id' => 'GLV22', 'role' => 'Huynh trưởng phụ trách'],
            ['class_id' => 'KT2_2627', 'teacher_id' => 'GLV38', 'role' => 'GLV đứng lớp'],
            ['class_id' => 'KT2_2627', 'teacher_id' => 'GLV36', 'role' => 'Trợ tá'],
            ['class_id' => 'RL1_2627', 'teacher_id' => 'GLV25', 'role' => 'Huynh trưởng phụ trách'],
            ['class_id' => 'RL1_2627', 'teacher_id' => 'GLV07', 'role' => 'GLV đứng lớp'],
            ['class_id' => 'RL1_2627', 'teacher_id' => 'GLV06', 'role' => 'GLV đứng lớp'],
            ['class_id' => 'RL2_2627', 'teacher_id' => 'GLV31', 'role' => 'Huynh trưởng phụ trách'],
            ['class_id' => 'RL2_2627', 'teacher_id' => 'GLV35', 'role' => 'GLV đứng lớp'],
            ['class_id' => 'RL2_2627', 'teacher_id' => 'GLV21', 'role' => 'GLV đứng lớp'],
            ['class_id' => 'RL2_2627', 'teacher_id' => 'GLV32', 'role' => 'Trợ tá'],
            ['class_id' => 'TS1_2627', 'teacher_id' => 'GLV04', 'role' => 'Huynh trưởng phụ trách'],
            ['class_id' => 'TS1_2627', 'teacher_id' => 'GLV23', 'role' => 'GLV đứng lớp'],
            ['class_id' => 'TS1_2627', 'teacher_id' => 'GLV34', 'role' => 'Trợ tá'],
            ['class_id' => 'TS2_2627', 'teacher_id' => 'GLV12', 'role' => 'Huynh trưởng phụ trách'],
            ['class_id' => 'TS2_2627', 'teacher_id' => 'GLV27', 'role' => 'GLV đứng lớp'],
            ['class_id' => 'TS2_2627', 'teacher_id' => 'GLV09', 'role' => 'GLV đứng lớp'],
            ['class_id' => 'TS2_2627', 'teacher_id' => 'GLV02', 'role' => 'GLV đứng lớp'],
            ['class_id' => 'TS2_2627', 'teacher_id' => 'GLV15', 'role' => 'Trợ tá'],
            ['class_id' => 'TS2_2627', 'teacher_id' => 'GLV40', 'role' => 'Trợ tá'],
            ['class_id' => 'BD1_2627', 'teacher_id' => 'GLV13', 'role' => 'Huynh trưởng phụ trách'],
            ['class_id' => 'BD1_2627', 'teacher_id' => 'GLV26', 'role' => 'GLV đứng lớp'],
            ['class_id' => 'BD1_2627', 'teacher_id' => 'GLV29', 'role' => 'Trợ tá'],
            ['class_id' => 'BD2_2627', 'teacher_id' => 'GLV03', 'role' => 'Huynh trưởng phụ trách'],
            ['class_id' => 'BD2_2627', 'teacher_id' => 'GLV08', 'role' => 'GLV đứng lớp'],
            ['class_id' => 'BD2_2627', 'teacher_id' => 'GLV10', 'role' => 'GLV đứng lớp'],
            ['class_id' => 'BD2_2627', 'teacher_id' => 'GLV30', 'role' => 'GLV đứng lớp'],
            ['class_id' => 'BD2_2627', 'teacher_id' => 'GLV39', 'role' => 'Trợ tá'],
            ['class_id' => 'BD3_2627', 'teacher_id' => 'GLV14', 'role' => 'Huynh trưởng phụ trách'],
            ['class_id' => 'BD3_2627', 'teacher_id' => 'GLV18', 'role' => 'GLV đứng lớp'],
            ['class_id' => 'BD3_2627', 'teacher_id' => 'GLV28', 'role' => 'Trợ tá'],
            ['class_id' => 'VD1_2627', 'teacher_id' => 'GLV16', 'role' => 'Huynh trưởng phụ trách'],
            ['class_id' => 'VD1_2627', 'teacher_id' => 'GLV17', 'role' => 'GLV đứng lớp'],
            ['class_id' => 'VD1_2627', 'teacher_id' => 'GLV20', 'role' => 'GLV đứng lớp'],
            ['class_id' => 'VD1_2627', 'teacher_id' => 'GLV41', 'role' => 'Trợ tá'],
            ['class_id' => 'VD2_2627', 'teacher_id' => 'GLV19', 'role' => 'Huynh trưởng phụ trách'],
            ['class_id' => 'VD2_2627', 'teacher_id' => 'GLV37', 'role' => 'GLV đứng lớp'],
        ]);
    }
}
