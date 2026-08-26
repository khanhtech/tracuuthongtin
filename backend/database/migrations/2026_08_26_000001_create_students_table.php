<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->string('student_id', 50)->primary()->comment('Mã thiếu nhi (Khóa chính)');
            $table->string('holy_name', 100)->default('')->comment('Tên thánh');
            $table->string('last_name', 100)->comment('Họ và tên đệm');
            $table->string('first_name', 50)->comment('Tên');
            $table->string('full_name', 150)->comment('Họ và tên đầy đủ');
            $table->string('gender', 10)->default('Nam')->comment('Giới tính (Nam/Nữ)');
            $table->string('birth_date', 20)->default('')->comment('Ngày sinh (DD/MM/YYYY)');
            $table->string('address', 255)->default('')->comment('Địa chỉ / Giáo họ');
            $table->string('parent_name', 150)->default('')->comment('Tên Phụ huynh');
            $table->string('parent_phone', 20)->default('')->comment('SĐT phụ huynh');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
