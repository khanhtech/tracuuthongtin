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
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('doc_id', 50)->unique();
            $table->string('title');
            $table->string('category', 50)->default('Giáo Trình');
            $table->string('format', 20)->default('PDF');
            $table->string('target', 150)->nullable();
            $table->string('size', 50)->nullable();
            $table->string('author', 150)->nullable();
            $table->integer('downloads')->default(0);
            $table->text('desc')->nullable();
            $table->longText('content')->nullable();
            $table->string('file_url')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
