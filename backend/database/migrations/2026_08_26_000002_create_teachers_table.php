<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teachers', function (Blueprint $table) {
            $table->string('teacher_id', 50)->primary()->comment('Mã GLV (Khóa chính)');
            $table->integer('stt')->comment('Số thứ tự');
            $table->string('holy_name', 100)->default('')->comment('Tên thánh');
            $table->string('last_name', 100)->comment('Họ và tên đệm');
            $table->string('first_name', 50)->comment('Tên');
            $table->string('gender', 10)->default('Nữ')->comment('Giới tính');
            $table->string('cert', 50)->default('')->comment('Chứng chỉ GLV (1, 2, 3, 3 - BMVTN)');
            $table->string('phone', 20)->default('')->comment('Số điện thoại');
            $table->string('email', 100)->default('')->comment('Email');
            $table->text('photo_url')->nullable()->comment('Ảnh thẻ');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('teachers');
    }
};
