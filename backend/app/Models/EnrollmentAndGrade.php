<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EnrollmentAndGrade extends Model
{
    use HasFactory;

    protected $table = 'enrollments_and_grades';

    protected $fillable = [
        'student_id',
        'class_id',
        'academic_year',
        'stt_in_class',
        'role_in_class',
        'score_attendance_1',
        'score_oral_1',
        'score_15m_1',
        'score_1period_1',
        'score_exam_1',
        'score_avg_1',
        'score_attendance_2',
        'score_oral_2',
        'score_15m_2',
        'score_1period_2',
        'score_exam_2',
        'score_avg_2',
        'score_final',
        'evaluation',
        'note',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id', 'student_id');
    }

    public function class()
    {
        return $this->belongsTo(GiaoLyClass::class, 'class_id', 'class_id');
    }
}
