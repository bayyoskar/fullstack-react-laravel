<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Helpers\ActivityLogger;

class AuthController extends Controller
{
    /**
     * LOGIN (email + password)
     */
    public function login(Request $r)
    {
        $r->validate([
            'email'    => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $r->email)->first();

        if (!$user || !Hash::check($r->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        // Log aktivitas
        ActivityLogger::log('login', "{$user->name} ({$user->role}) logged in");

        return response()->json([
            'message' => 'Login success',
            'token'   => $token,
            'user'    => $user,
        ]);
    }

    /**
     * LOGOUT (hapus token aktif)
     */
    public function logout(Request $r)
    {
        $user = $r->user();

        if ($user && $user->currentAccessToken()) {
            $user->currentAccessToken()->delete();
            ActivityLogger::log('logout', "{$user->name} ({$user->role}) logged out");
        }

        return response()->json(['message' => 'Logged out']);
    }
}