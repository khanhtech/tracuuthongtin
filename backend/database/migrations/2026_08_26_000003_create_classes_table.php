<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('classes', function (Blueprint $table) {
            $table->string('class_id', 50)->primary()->comment('Mã lớp (DBKT_2627, TS1_2627)');
            $table->string('class_name', 100)->comment('Tên lớp');
            $table->string('block', 50)->comment('Khối lớp');
            $table->string('academic_year', 20)->default('2026-2027')->comment('Năm học');
            $table->string('room', 100)->default('')->comment('Phòng học');
            $table->string('schedule', 100)->default('Chủ Nhật: 07:30 - 09:00')->comment('Lịch học');
            $table->text('note')->nullable()->comment('Ghi chú');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('classes');
    }
};
