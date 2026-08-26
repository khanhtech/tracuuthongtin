<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('enrollments_and_grades', function (Blueprint $table) {
            $table->id()->comment('Mã bảng điểm (Khóa chính tự tăng)');
            $table->string('student_id', 50)->comment('Mã thiếu nhi (Khóa ngoại)');
            $table->string('class_id', 50)->comment('Mã lớp (Khóa ngoại)');
            $table->string('academic_year', 20)->default('2026-2027')->comment('Năm học');
            $table->integer('stt_in_class')->default(1)->comment('STT trong lớp');
            $table->string('role_in_class', 100)->default('Đang theo học')->comment('Vai trò');

            // Điểm HK1
            $table->decimal('score_attendance_1', 4, 2)->nullable()->comment('Chuyên cần HK1');
            $table->decimal('score_oral_1', 4, 2)->nullable()->comment('Điểm Miệng HK1');
            $table->decimal('score_15m_1', 4, 2)->nullable()->comment('Điểm 15p HK1');
            $table->decimal('score_1period_1', 4, 2)->nullable()->comment('Điểm 1 tiết HK1');
            $table->decimal('score_exam_1', 4, 2)->nullable()->comment('Điểm Thi HK1');
            $table->decimal('score_avg_1', 4, 2)->nullable()->comment('Điểm TB HK1');

            // Điểm HK2
            $table->decimal('score_attendance_2', 4, 2)->nullable()->comment('Chuyên cần HK2');
            $table->decimal('score_oral_2', 4, 2)->nullable()->comment('Điểm Miệng HK2');
            $table->decimal('score_15m_2', 4, 2)->nullable()->comment('Điểm 15p HK2');
            $table->decimal('score_1period_2', 4, 2)->nullable()->comment('Điểm 1 tiết HK2');
            $table->decimal('score_exam_2', 4, 2)->nullable()->comment('Điểm Thi HK2');
            $table->decimal('score_avg_2', 4, 2)->nullable()->comment('Điểm TB HK2');

            // Điểm Tổng kết & Xếp loại
            $table->decimal('score_final', 4, 2)->nullable()->comment('Điểm Tổng kết cả năm');
            $table->string('evaluation', 50)->default('Đang học')->comment('Xếp loại');
            $table->text('note')->nullable()->comment('Ghi chú');

            $table->timestamps();

            $table->foreign('student_id')->references('student_id')->on('students')->onDelete('cascade');
            $table->foreign('class_id')->references('class_id')->on('classes')->onDelete('cascade');
            $table->unique(['student_id', 'class_id', 'academic_year']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('enrollments_and_grades');
    }
};
