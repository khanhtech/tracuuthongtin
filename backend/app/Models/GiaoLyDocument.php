<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GiaoLyDocument extends Model
{
    use HasFactory;

    protected $table = 'documents';

    protected $fillable = [
        'doc_id',
        'title',
        'category',
        'format',
        'target',
        'size',
        'author',
        'downloads',
        'desc',
        'content',
        'file_url',
    ];

    protected $casts = [
        'downloads' => 'integer',
    ];
}
