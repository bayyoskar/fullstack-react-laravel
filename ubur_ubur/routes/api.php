<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\ActivityLogController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| Semua route API pakai Sanctum Bearer token.
| Register DIHAPUS TOTAL. Login-only.
*/

/* ✅ TEST: CEK DB CONNECTED / ERROR */
Route::get('/db-test', function () {
    try {
        DB::connection()->getPdo();
        return response()->json(['status' => 'success', 'message' => 'DB Connected ✔']);
    } catch (\Exception $e) {
        return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
    }
});

/* 🟢 Public (tanpa login) */
Route::post('/login', [AuthController::class, 'login']);

/* 🟡 Protected (wajib login) */
Route::middleware(['auth:sanctum'])->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);

    /* Admin & Super Admin: Lihat profil user lain */
    Route::middleware(['role:admin,super_admin'])
        ->get('/profiles/{user_id}', [ProfileController::class, 'viewUserProfile']);

    /* Admin & Super Admin: CRUD Users */
    Route::middleware(['role:admin,super_admin'])->group(function () {
        Route::get('/admin/users', [AdminUserController::class, 'index']);
        Route::get('/admin/users/{id}', [AdminUserController::class, 'show']);
        Route::post('/admin/users', [AdminUserController::class, 'store']);
        Route::put('/admin/users/{id}', [AdminUserController::class, 'update']);
        Route::delete('/admin/users/{id}', [AdminUserController::class, 'destroy']);
    });

    /* Super Admin Only: Activity Logs */
    Route::middleware(['role:super_admin'])->group(function () {
        Route::get('/activity-logs', [ActivityLogController::class, 'index']);
    });
});