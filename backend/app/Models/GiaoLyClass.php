<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GiaoLyClass extends Model
{
    use HasFactory;

    protected $table = 'classes';
    protected $primaryKey = 'class_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'class_id',
        'class_name',
        'block',
        'academic_year',
        'room',
        'schedule',
        'note',
    ];

    /**
     * Danh sách Giáo Lý Viên phụ trách lớp
     */
    public function teachers()
    {
        return $this->belongsToMany(Teacher::class, 'class_assignments', 'class_id', 'teacher_id')
                    ->withPivot('role');
    }

    /**
     * Danh sách phân công của lớp
     */
    public function assignments()
    {
        return $this->hasMany(ClassAssignment::class, 'class_id', 'class_id');
    }

    /**
     * Danh sách thiếu nhi theo học lớp này
     */
    public function students()
    {
        return $this->belongsToMany(Student::class, 'enrollments_and_grades', 'class_id', 'student_id')
                    ->withPivot(['academic_year', 'stt_in_class', 'role_in_class', 'score_final', 'evaluation']);
    }

    /**
     * Bảng điểm và hồ sơ nhập học của lớp
     */
    public function enrollments()
    {
        return $this->hasMany(EnrollmentAndGrade::class, 'class_id', 'class_id');
    }
}
