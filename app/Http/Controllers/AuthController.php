<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|min:3',
            'email'    => [
                'required',
                'email',
                function ($attribute, $value, $fail) {
                    if (!preg_match('/^[a-zA-Z0-9._%+-]+@gmail\.com$/', $value)) {
                        $fail('Email harus menggunakan domain gmail.com');
                    }
                },
            ],
            'phone'    => [
                'required',
                function ($attribute, $value, $fail) {
                    if (!preg_match('/^(?:\+62|62|0)8[1-9][0-9]{7,10}$/', $value)) {
                        $fail('Nomor HP tidak valid. Gunakan format +628xx atau 08xx');
                    }
                },
            ],
            'password' => 'required|min:6|confirmed',
        ]);

        // ✅ Cek apakah email sudah terdaftar
        if (User::where('email', $request->email)->exists()) {
            return response()->json([
                'success' => false,
                'message' => '❌ Maaf, email sudah terdaftar. Silakan gunakan email lain.'
            ], 400);
        }

        // ✅ Cek apakah nomor HP sudah terdaftar
        if (User::where('phone', $request->phone)->exists()) {
            return response()->json([
                'success' => false,
                'message' => '❌ Maaf, nomor HP sudah terdaftar. Silakan gunakan nomor lain.'
            ], 400);
        }

        // ✅ Buat akun baru
        User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'phone'    => $request->phone,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'success' => true,
            'message' => '✅ Registrasi berhasil! Silakan login.'
        ]);
    }

    // ✅ Login
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            return response()->json(['success' => true, 'message' => '🚆 Login berhasil!']);
        }

        return response()->json(['success' => false, 'message' => '❌ Email atau password salah!']);
    }

    // ✅ Logout
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/');
    }
}
