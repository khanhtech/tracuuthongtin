<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $table = 'students';
    protected $primaryKey = 'student_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'student_id',
        'holy_name',
        'last_name',
        'first_name',
        'full_name',
        'gender',
        'birth_date',
        'address',
        'parent_name',
        'parent_phone',
    ];

    /**
     * Danh sách bảng điểm & lớp học của thiếu nhi
     */
    public function enrollments()
    {
        return $this->hasMany(EnrollmentAndGrade::class, 'student_id', 'student_id');
    }

    /**
     * Các lớp thiếu nhi từng theo học
     */
    public function classes()
    {
        return $this->belongsToMany(GiaoLyClass::class, 'enrollments_and_grades', 'student_id', 'class_id')
                    ->withPivot(['academic_year', 'stt_in_class', 'role_in_class', 'score_final', 'evaluation']);
    }
}
