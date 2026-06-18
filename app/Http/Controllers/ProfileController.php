<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Http\Requests\UpdateUsernameRequest;
use App\Http\Requests\UpdatePasswordRequest;
use App\Http\Requests\UpdatePhotoProfileRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    //tampilan form user profile

    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    //update user profile
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    //hapus akun user
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    //get user saat ini
    public function getProfile(Request $request)
    {
        $user = $request->user();
        
        return response()->json([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'photo_profile' => $user->photo_profile ? asset('storage/' . $user->photo_profile) : null,
                'created_at' => $user->created_at,
            ],
        ]);
    }

    //update username
    public function updateUsername(UpdateUsernameRequest $request)
    {
        try {
            $user = $request->user();
            $user->update($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Username berhasil diperbarui',
                'data' => [
                    'id' => $user->id,
                    'name' => $user->name,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui username: ' . $e->getMessage(),
            ], 500);
        }
    }

    //update password
    public function updatePassword(UpdatePasswordRequest $request)
    {
        try {
            $user = $request->user();
            $user->update([
                'password' => bcrypt($request->validated()['password']),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Password berhasil diperbarui',
                'data' => [
                    'id' => $user->id,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui password: ' . $e->getMessage(),
            ], 500);
        }
    }

    //update foto profile
    public function updatePhotoProfile(UpdatePhotoProfileRequest $request)
    {
        try {
            $user = $request->user();

            //hapus foto profile lama
            if ($user->photo_profile && Storage::disk('public')->exists($user->photo_profile)) {
                Storage::disk('public')->delete($user->photo_profile);
            }

            //foto profile baru
            if ($request->hasFile('photo_profile')) {
                $path = $request->file('photo_profile')->store('profile-photos', 'public');
                $user->update(['photo_profile' => $path]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Foto profil berhasil diperbarui',
                'data' => [
                    'id' => $user->id,
                    'photo_profile' => $user->photo_profile ? asset('storage/' . $user->photo_profile) : null,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui foto profil: ' . $e->getMessage(),
            ], 500);
        }
    }
}
