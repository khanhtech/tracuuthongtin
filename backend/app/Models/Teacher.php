<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    use HasFactory;

    protected $table = 'teachers';
    protected $primaryKey = 'teacher_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'teacher_id',
        'stt',
        'holy_name',
        'last_name',
        'first_name',
        'gender',
        'cert',
        'phone',
        'email',
        'photo_url',
    ];

    /**
     * Danh sách phân công phụ trách lớp của GLV
     */
    public function assignments()
    {
        return $this->hasMany(ClassAssignment::class, 'teacher_id', 'teacher_id');
    }

    /**
     * Các lớp mà GLV này đang phụ trách giảng dạy
     */
    public function classes()
    {
        return $this->belongsToMany(GiaoLyClass::class, 'class_assignments', 'teacher_id', 'class_id')
                    ->withPivot('role');
    }
}
