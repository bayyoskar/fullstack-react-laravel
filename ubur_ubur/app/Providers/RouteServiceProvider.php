<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * Define your route model bindings, pattern filters, and other route configuration.
     */
    public function boot(): void
    {
        // ✅ Daftarkan alias middleware custom kamu biar Laravel mengenali "role"
        Route::aliasMiddleware('role', \App\Http\Middleware\RoleMiddleware::class);

        // 🟢 Pastikan API routes terbaca
        Route::middleware('api')
            ->prefix('api')
            ->group(base_path('routes/api.php'));

        // 🟢 Pastikan Web routes terbaca
        Route::middleware('web')
            ->group(base_path('routes/web.php'));
    }
}