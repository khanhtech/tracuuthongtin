<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassAssignment extends Model
{
    use HasFactory;

    protected $table = 'class_assignments';
    public $timestamps = false;

    protected $fillable = [
        'class_id',
        'teacher_id',
        'role',
    ];

    public function class()
    {
        return $this->belongsTo(GiaoLyClass::class, 'class_id', 'class_id');
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class, 'teacher_id', 'teacher_id');
    }
}
