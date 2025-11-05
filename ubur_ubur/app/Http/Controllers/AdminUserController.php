<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Helpers\ActivityLogger;

class AdminUserController extends Controller
{
    /**
     * 🟦 Tampilkan semua user (dibatasi berdasarkan role)
     */
    public function index(Request $request)
    {
        $currentUser = $request->user();

        $users = User::query()
            ->when($currentUser->role === 'admin', function ($q) {
                $q->where('role', 'user'); // admin hanya lihat user
            })
            ->when($currentUser->role === 'super_admin', function ($q) {
                $q->whereIn('role', ['user', 'admin']); // super admin lihat admin & user
            })
            ->orderBy('role')
            ->orderBy('name')
            ->get();

        return response()->json($users);
    }

    /**
     * 🟩 Lihat detail user tertentu
     */
    public function show(Request $request, $id)
    {
        $currentUser = $request->user();
        $user = User::findOrFail($id);

        // Cegah akses ilegal
        if ($currentUser->role === 'admin' && $user->role !== 'user') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        if ($currentUser->role === 'super_admin' && $user->role === 'super_admin') {
            return response()->json(['message' => 'Cannot view another super admin'], 403);
        }

        return response()->json($user);
    }

    /**
     * 🟨 Tambah user baru
     */
    public function store(Request $request)
    {
        $currentUser = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'role' => 'required|in:user,admin',
        ]);

        // Admin hanya boleh buat role user
        if ($currentUser->role === 'admin' && $validated['role'] !== 'user') {
            return response()->json(['message' => 'Admins can only create users'], 403);
        }

        $validated['password'] = Hash::make($validated['password']);
        $user = User::create($validated);

        // 🟢 Catat aktivitas
        ActivityLogger::log(
            'Create User',
            "{$currentUser->name} ({$currentUser->role}) created {$user->name} ({$user->role})"
        );

        return response()->json(['message' => 'User created successfully', 'user' => $user], 201);
    }

    /**
     * 🟧 Update user
     */
    public function update(Request $request, $id)
    {
        $currentUser = $request->user();
        $user = User::findOrFail($id);

        // ❌ Tidak boleh ubah diri sendiri
        if ($currentUser->user_id === $user->user_id) {
            return response()->json(['message' => 'You cannot edit your own account'], 403);
        }

        // Admin tidak boleh ubah admin/super_admin
        if ($currentUser->role === 'admin' && $user->role !== 'user') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Super admin tidak boleh ubah super admin lain
        if ($currentUser->role === 'super_admin' && $user->role === 'super_admin') {
            return response()->json(['message' => 'Cannot edit another super admin'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->user_id . ',user_id',
            'password' => 'nullable|min:6',
            'role' => 'sometimes|in:user,admin',
        ]);

        // Admin gak boleh ubah role jadi admin
        if ($currentUser->role === 'admin' && isset($validated['role']) && $validated['role'] !== 'user') {
            return response()->json(['message' => 'Admins cannot assign admin roles'], 403);
        }

        // 🟢 FIX — hanya update password jika diisi
        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']); // hapus agar tidak diset NULL
        }

        $user->update($validated);

        // 🟢 Log aktivitas
        ActivityLogger::log(
            'Update User',
            "{$currentUser->name} ({$currentUser->role}) updated {$user->name} ({$user->role})"
        );

        return response()->json(['message' => 'User updated successfully', 'user' => $user]);
    }

    /**
     * 🟥 Hapus user
     */
    public function destroy(Request $request, $id)
    {
        $currentUser = $request->user();
        $user = User::findOrFail($id);

        // ❌ Tidak boleh hapus diri sendiri
        if ($currentUser->user_id === $user->user_id) {
            return response()->json(['message' => 'You cannot delete your own account'], 403);
        }

        // Admin tidak boleh hapus admin/super_admin
        if ($currentUser->role === 'admin' && $user->role !== 'user') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Super admin tidak boleh hapus super admin lain
        if ($currentUser->role === 'super_admin' && $user->role === 'super_admin') {
            return response()->json(['message' => 'Cannot delete another super admin'], 403);
        }

        $user->delete();

        // 🟢 Log aktivitas
        ActivityLogger::log(
            'Delete User',
            "{$currentUser->name} ({$currentUser->role}) deleted {$user->name} ({$user->role})"
        );

        return response()->json(['message' => 'User deleted successfully']);
    }
}