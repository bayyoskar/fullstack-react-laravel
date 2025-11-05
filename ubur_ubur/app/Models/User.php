<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    // ✅ Kasih tahu Laravel kalau primary key kamu adalah user_id
    protected $primaryKey = 'user_id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function profile()
    {
        // ✅ Relasi profile pakai user_id
        return $this->hasOne(Profile::class, 'user_id', 'user_id');
    }

    public function logs()
    {
        // ✅ Relasi activity log pakai user_id
        return $this->hasMany(ActivityLog::class, 'user_id', 'user_id');
    }
}