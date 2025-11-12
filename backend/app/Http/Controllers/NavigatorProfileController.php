<?php

namespace App\Http\Controllers;

use App\Jobs\SentCredentialsJob;
use App\Models\NavigatorProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class NavigatorProfileController extends Controller
{



    //Show all navigator 
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user->hasRole('admin')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized: admin access required.'
            ], 403);
        }

        $profiles = NavigatorProfile::with('user')->latest()->get();

        return response()->json([
            'data' => $profiles
        ], 200);
    }


    //Create profile for the navigator
    public function store(Request $request)
    {
        $admin = $request->user();

        if (!$admin->hasRole('admin')) {
            return response()->json([
                'message' => 'Unauthorized: admin access required.'
            ], 403);
        }

        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'city' => 'required|string|max:255',
            'bio' => 'nullable|string|max:1000',
            'languages' => 'nullable|array',
            'phone_number' => 'nullable|string|max:20',
        ]);

        $user = User::create([
            'name' => $validated['full_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $user->addRole('navigator');

        $profile = NavigatorProfile::create([
            'user_id' => $user->id,
            'city' => $validated['city'],
            'bio' => $validated['bio'] ?? null,
            'languages' => $validated['languages'] ?? [],
            'verified' => true,
            'phone_number' => $validated['phone_number'] ?? null,
        ]);

        

        SentCredentialsJob::dispatch($user);

        return response()->json([
            'message' => 'Navigator account and profile created successfully.',
            'data' => [
                'user' => $user,
                'profile' => $profile,
            ]
        ], 201);
    }

    //Admin-only: Update any navigator profile
    public function adminUpdate(Request $request, $id)
    {
        $admin = $request->user();

        if (!$admin->hasRole('admin')) {
            return response()->json([
                'message' => 'Unauthorized: admin access required.'
            ], 403);
        }

        $profile = NavigatorProfile::with('user')->findOrFail($id);

        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . $profile->user->id,
            'password' => 'nullable|string|min:8',
            'city' => 'nullable|string|max:255',
            'bio' => 'nullable|string|max:1000',
            'languages' => 'nullable|array',
            'phone_number' => 'nullable|string|max:20',
            'verified' => 'nullable|boolean',
        ]);

        $profile->user->update([
            'name' => $validated['name'] ?? $profile->user->name,
            'email' => $validated['email'] ?? $profile->user->email,
            'password' => isset($validated['password'])
                ? Hash::make($validated['password'])
                : $profile->user->password,
        ]);

        $profile->update([
            'city' => $validated['city'] ?? $profile->city,
            'bio' => $validated['bio'] ?? $profile->bio,
            'languages' => $validated['languages'] ?? $profile->languages,
            'phone_number' => $validated['phone_number'] ?? $profile->phone_number,
            'verified' => $validated['verified'] ?? $profile->verified,
        ]);

        return response()->json([
            'message' => 'Navigator profile updated successfully by admin.',
            'data' => $profile->load('user')
        ], 200);
    }

    // Update profile
    public function update(Request $request, $id)
    {
        $profile = NavigatorProfile::findOrFail($id);

        $user = $request->user();

        if (!$user->hasRole('navigator') && $user->id !== $profile->user_id) {
            return response()->json([
                'message' => 'Unauthorized access.'
            ], 403);
        }

        $validated = $request->validate([
            'city' => 'nullable|string|max:255',
            'bio' => 'nullable|string|max:1000',
            'languages' => 'nullable|array',
            'phone_number' => 'nullable|string|max:20',
            'verified' => 'nullable|boolean',
        ]);

        if (!$user->hasRole('admin')) {
            unset($validated['verified']);
        }

        $profile->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully.',
            'data' => $profile
        ]);
    }


    // Delete profile 
    public function destroy(Request $request, $id)
    {
        $user = $request->user();

        if (!$user->hasRole('admin')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized: admin access required.'
            ], 403);
        }

        $profile = NavigatorProfile::findOrFail($id);
        $profile->delete();

        return response()->json([
            'message' => 'Navigator profile deleted successfully.'
        ]);
    }
}
