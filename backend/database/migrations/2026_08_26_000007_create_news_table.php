<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('news', function (Blueprint $table) {
            $table->id();
            $table->string('news_id', 50)->unique();
            $table->string('title');
            $table->string('category', 50)->default('Khẩn');
            $table->string('date', 50)->nullable();
            $table->string('author', 150)->nullable();
            $table->text('summary')->nullable();
            $table->longText('content');
            $table->boolean('is_pinned')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('news');
    }
};
