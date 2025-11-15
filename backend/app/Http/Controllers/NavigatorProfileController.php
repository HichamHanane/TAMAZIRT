<?php

namespace App\Http\Controllers;

use App\Jobs\SentCredentialsJob;
use App\Models\NavigatorProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

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
            'full_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . $profile->user->id,
            'password' => 'nullable|string|min:8',
            'city' => 'nullable|string|max:255',
            'bio' => 'nullable|string|max:1000',
            'languages' => 'nullable|array',
            'phone_number' => 'nullable|string|max:20',
            'verified' => 'nullable|boolean',
        ]);

        $profile->user->update([
            'name' => $validated['full_name'] ?? $profile->user->name,
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
        $profile = NavigatorProfile::with('user')->findOrFail($id);

        $user = $request->user();

        if (!$user->hasRole('navigator') || $user->id !== $profile->user_id) {
            return response()->json([
                'message' => 'Unauthorized access.'
            ], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($profile->user_id),
            ],
            'city' => 'nullable|string|max:255',
            'bio' => 'nullable|string|max:1000',
            'languages' => 'nullable|array',
            'phone_number' => 'nullable|string|max:20',
            'verified' => 'nullable|boolean',
            'profile_picture' => 'nullable|image|max:5120',
        ]);

        logger($request->all());


        // If a new image is uploaded, store and delete the old file
        if ($request->hasFile('profile_picture')) {
            // delete old if exists
            if ($profile->profile_picture) {
                Storage::disk('public')->delete($profile->profile_picture);
            }
            $path = $request->file('profile_picture')->store('profile_pictures', 'public');
            $validated['profile_picture'] = $path;
        }

        $userData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
        ];

        $profileData = collect($validated)->except(['name', 'emailAddress'])->all();

        if (!$user->hasRole('admin')) {
            unset($validated['verified']);
        }

        $profile->user->update($userData);

        $profile->update($profileData);


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


    public function myProfile(Request $request)
    {
        logger("my profile");
        $user = $request->user();
        if (!$user->hasRole('navigator')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized: navigator access required.'
            ], 403);
        }

        $profile = NavigatorProfile::with('user')->where('user_id', $user->id)->firstOrFail();
        return response()->json([
            "data" => $profile
        ], 200);

    }

    public function updatePassword(Request $request)
    {
        $user = $request->user();

        logger($request->all());

        $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'The provided current password does not match your actual password.'
            ], 400);
        }


        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json([
            'message' => 'Password updated successfully.',
        ], 200);
    }
}
