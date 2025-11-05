<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    /**
     * 🔹 User melihat profilnya sendiri
     */
    public function show(Request $request)
    {
        $user = $request->user();
        $profile = $user->profile;

        return response()->json([
            'user' => $user,
            'profile' => $profile,
        ]);
    }

    /**
     * 🔹 Update atau buat profil user login
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'address' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
        ]);

        $profile = $user->profile()->updateOrCreate(
            ['user_id' => $user->user_id],
            $data
        );

        ActivityLog::create([
            'user_id' => $user->user_id,
            'action' => 'update_profile',
            'description' => "{$user->name} updated their profile",
            'created_at' => now(),
        ]);

        return response()->json([
            'message' => 'Profile updated successfully',
            'profile' => $profile,
        ]);
    }

    /**
     * 🔹 Admin / Super Admin melihat profil user lain
     */
    public function view($id, Request $request)
    {
        $currentUser = $request->user();

        // 🚫 Hanya admin & super admin yang boleh akses
        if (!in_array($currentUser->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // 🔎 Ambil user target + profil
        $targetUser = User::with('profile')->find($id);

        if (!$targetUser) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // 🔒 Admin hanya boleh lihat user biasa
        if ($currentUser->role === 'admin' && $targetUser->role !== 'user') {
            return response()->json(['message' => 'Admins can only view user profiles'], 403);
        }

        // 🔒 Super admin tidak boleh lihat super admin lain
        if ($currentUser->role === 'super_admin' && $targetUser->role === 'super_admin') {
            return response()->json(['message' => 'Cannot view another super admin profile'], 403);
        }

        return response()->json([
            'target_user' => $targetUser,
            'profile' => $targetUser->profile
        ]);
    }
}