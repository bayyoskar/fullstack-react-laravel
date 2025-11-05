<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    use HasFactory;

    /**
     * Kolom primary key tabel
     */
    protected $primaryKey = 'log_id';

    /**
     * Nonaktifkan updated_at (kita cuma pakai created_at)
     */
    public $timestamps = false;

    /**
     * Kolom yang boleh diisi (mass assignable)
     */
    protected $fillable = [
        'user_id',
        'action',
        'description',
        'created_at',
    ];

    /**
     * Relasi ke model User
     * Setiap log dimiliki oleh 1 user
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    /**
     * Format created_at otomatis ke waktu lokal (Asia/Jakarta)
     */
    public function getCreatedAtAttribute($value)
    {
        return \Carbon\Carbon::parse($value)->timezone('Asia/Jakarta');
    }
}