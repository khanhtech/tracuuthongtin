<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Admin extends Authenticatable
{
    use HasFactory;

    protected $table = 'admins';
    public $timestamps = false;

    protected $fillable = [
        'username',
        'password',
        'display_name',
        'role',
    ];

    protected $hidden = [
        'password',
    ];
}
