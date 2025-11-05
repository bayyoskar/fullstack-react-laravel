<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class ActivityLogController extends Controller
{
    /**
     * Ambil semua log aktivitas (hanya Super Admin yang bisa akses)
     */
    public function index(): JsonResponse
    {
        try {
            // Ambil semua log, urut dari terbaru
            $logs = ActivityLog::with('user')
                ->orderByDesc('created_at')
                ->get()
                ->map(function ($log) {
                    return [
                        'log_id'      => $log->log_id,
                        'user_name'   => $log->user->name ?? 'Unknown',
                        'action'      => ucfirst($log->action),
                        'description' => $log->description,
                        'created_at'  => Carbon::parse($log->created_at)
                            ->timezone('Asia/Jakarta')
                            ->format('Y-m-d H:i:s'),
                    ];
                });

            return response()->json([
                'success' => true,
                'count'   => $logs->count(),
                'data'    => $logs,
            ], 200);

        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data activity logs',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}