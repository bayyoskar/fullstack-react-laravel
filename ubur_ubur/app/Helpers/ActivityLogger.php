<?php

namespace App\Helpers;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ActivityLogger
{
    /**
     * Simpan log aktivitas ke database.
     * Bisa dipanggil dari mana saja di project.
     *
     * @param string $action - Jenis aksi (contoh: 'Login', 'Logout', 'Create User')
     * @param string|null $description - Penjelasan tambahan
     * @param int|null $userId - (Opsional) ID user manual jika Auth tidak tersedia
     */
    public static function log(string $action, ?string $description = null, ?int $userId = null): void
    {
        try {
            // Ambil user yang sedang login jika ada
            $user = Auth::user();

            ActivityLog::create([
                'user_id' => $userId ?? $user?->user_id, // fallback ke Auth user jika tidak dikirim manual
                'action' => ucfirst($action),
                'description' => $description,
                'created_at' => now('Asia/Jakarta'),
            ]);
        } catch (\Throwable $e) {
            // Catat error ke laravel.log tapi jangan hentikan aplikasi
            Log::error('❌ Gagal mencatat activity log: ' . $e->getMessage());
        }
    }
}