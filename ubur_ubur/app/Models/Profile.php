<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    use HasFactory;

    protected $primaryKey = 'profile_id';

    // Laravel akan otomatis mengisi created_at & updated_at
    public $timestamps = true;

    protected $fillable = [
        'user_id',
        'address',
        'phone',
        'bio',
        'created_at',
        'updated_at',
    ];

    // Relasi ke model User
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}