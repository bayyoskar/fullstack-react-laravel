<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\ActivityLogController;
use Illuminate\Support\Facades\DB;

/*
|--------------------------------------------------------------------------
| API Routes (no register)
|--------------------------------------------------------------------------
| Semua route API pakai Sanctum Bearer token.
| Register DIHAPUS TOTAL. Login-only.
*/

// 🟢 Public (tanpa login)
Route::post('/login', [AuthController::class, 'login']);

// 🔹 Route test utama (biar /api nggak 404)
Route::get('/', function () {
    return response()->json(['message' => 'Laravel API is running! 🚀']);
});

// 🟡 Protected (wajib login)
Route::middleware(['auth:sanctum'])->group(function () {

    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // Profile (lihat & update profil sendiri)
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);

    // Lihat profil user lain (admin & super admin)
    Route::middleware(['role:admin,super_admin'])
        ->get('/profiles/{user_id}', [ProfileController::class, 'viewUserProfile']);

    // Admin & Super Admin: CRUD users (admin hanya user, super admin bisa user & admin)
    Route::middleware(['role:admin,super_admin'])->group(function () {
        Route::get   ('/admin/users',        [AdminUserController::class, 'index']);
        Route::get   ('/admin/users/{id}',   [AdminUserController::class, 'show']);
        Route::post  ('/admin/users',        [AdminUserController::class, 'store']);   // password dimasukkan manual
        Route::put   ('/admin/users/{id}',   [AdminUserController::class, 'update']);
        Route::delete('/admin/users/{id}',   [AdminUserController::class, 'destroy']);
    });

    // Super Admin only: Activity Logs
    Route::middleware(['role:super_admin'])->group(function () {
        Route::get('/activity-logs', [ActivityLogController::class, 'index']);
    });
});

// 🔍 Test koneksi database di Railway
Route::get('/db-test', function () {
    try {
        DB::connection()->getPdo();
        $dbName = DB::connection()->getDatabaseName();
        return response()->json([
            'success' => true,
            'message' => "Database connected successfully: {$dbName}"
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => "Database connection failed: " . $e->getMessage()
        ]);
    }
});