<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('class_assignments', function (Blueprint $table) {
            $table->id();
            $table->string('class_id', 50)->comment('Mã lớp (Khóa ngoại)');
            $table->string('teacher_id', 50)->comment('Mã GLV (Khóa ngoại)');
            $table->string('role', 100)->default('Huynh trưởng phụ trách')->comment('Vai trò');
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('class_id')->references('class_id')->on('classes')->onDelete('cascade');
            $table->foreign('teacher_id')->references('teacher_id')->on('teachers')->onDelete('cascade');
            $table->unique(['class_id', 'teacher_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('class_assignments');
    }
};
