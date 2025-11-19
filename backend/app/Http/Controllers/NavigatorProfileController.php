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



    /**
     * Show all navigator profiles (Admin only).
     *
     * @OA\Get(
     * path="/api/navigator-profiles",
     * tags={"Navigator Profiles"},
     * summary="Get all navigator profiles (Admin only)",
     * description="Retrieves a list of all existing navigator profiles, including associated user data. Requires 'admin' role.",
     * operationId="adminIndexProfiles",
     * security={
     * {"bearerAuth": {}}
     * },
     * @OA\Response(
     * response=200,
     * description="Successful operation",
     * @OA\JsonContent(
     * @OA\Property(property="data", type="array", @OA\Items(
     * @OA\Property(property="id", type="integer", example=1),
     * @OA\Property(property="city", type="string", example="Fez"),
     * @OA\Property(property="verified", type="boolean", example=true),
     * @OA\Property(property="user", type="object", description="Associated user details")
     * ))
     * )
     * ),
     * @OA\Response(response=401, description="Unauthenticated"),
     * @OA\Response(response=403, description="Unauthorized: admin access required")
     * )
     */
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


    /**
     * Create profile for a new navigator (Admin only).
     *
     * @OA\Post(
     * path="/api/navigator-profiles",
     * tags={"Navigator Profiles"},
     * summary="Create a new navigator user and profile (Admin only)",
     * description="Creates a User account with the 'navigator' role and an associated NavigatorProfile. Requires 'admin' role.",
     * operationId="adminStoreNavigator",
     * security={
     * {"bearerAuth": {}}
     * },
     * @OA\RequestBody(
     * required=true,
     * description="Data for the new navigator account and profile",
     * @OA\JsonContent(
     * required={"full_name", "email", "password", "city"},
     * @OA\Property(property="full_name", type="string", example="Hamid Navigator"),
     * @OA\Property(property="email", type="string", format="email", example="hamid.nav@example.com"),
     * @OA\Property(property="password", type="string", format="password", example="securepass123"),
     * @OA\Property(property="city", type="string", example="Rabat"),
     * @OA\Property(property="bio", type="string", nullable=true, example="Experienced local guide."),
     * @OA\Property(property="languages", type="array", @OA\Items(type="string"), nullable=true, example={"Arabic", "French"}),
     * @OA\Property(property="phone_number", type="string", nullable=true, example="+212610203040")
     * )
     * ),
     * @OA\Response(
     * response=201,
     * description="Navigator account and profile created successfully",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="Navigator account and profile created successfully."),
     * @OA\Property(property="data", type="object")
     * )
     * ),
     * @OA\Response(response=422, description="Validation error"),
     * @OA\Response(response=401, description="Unauthenticated"),
     * @OA\Response(response=403, description="Unauthorized: admin access required")
     * )
     */
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

    /**
     * Update any navigator profile (Admin only).
     *
     * @OA\Put(
     * path="/api/admin/navigators/{id}",
     * tags={"Navigator Profiles"},
     * summary="Admin update for any navigator profile",
     * description="Allows an administrator to update any navigator's user and profile details, including the 'verified' status.",
     * operationId="adminUpdateNavigatorProfile",
     * security={
     * {"bearerAuth": {}}
     * },
     * @OA\Parameter(
     * name="id",
     * in="path",
     * required=true,
     * description="ID of the navigator profile to update",
     * @OA\Schema(type="integer", example=1)
     * ),
     * @OA\RequestBody(
     * required=false,
     * @OA\JsonContent(
     * @OA\Property(property="full_name", type="string", nullable=true, example="Updated Admin Name"),
     * @OA\Property(property="email", type="string", format="email", nullable=true, example="updated.admin@example.com"),
     * @OA\Property(property="password", type="string", format="password", nullable=true, example="newsecret123"),
     * @OA\Property(property="city", type="string", nullable=true, example="Casablanca"),
     * @OA\Property(property="bio", type="string", nullable=true, example="Updated bio by admin."),
     * @OA\Property(property="languages", type="array", @OA\Items(type="string"), nullable=true),
     * @OA\Property(property="phone_number", type="string", nullable=true),
     * @OA\Property(property="verified", type="boolean", nullable=true, example=true, description="Admin can change verification status.")
     * )
     * ),
     * @OA\Response(
     * response=200,
     * description="Profile updated successfully by admin",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="Navigator profile updated successfully by admin."),
     * @OA\Property(property="data", type="object")
     * )
     * ),
     * @OA\Response(response=422, description="Validation error"),
     * @OA\Response(response=401, description="Unauthenticated"),
     * @OA\Response(response=403, description="Unauthorized: admin access required")
     * )
     */
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

    /**
     * Update own navigator profile details.
     *
     * @OA\Put(
     * path="/api/navigator-profiles/{id}",
     * tags={"Navigator Profiles"},
     * summary="Update own profile (Navigator only)",
     * description="Allows a navigator to update their profile details (user data and profile data). Requires 'navigator' role and ownership.",
     * operationId="navigatorUpdateProfile",
     * security={
     * {"bearerAuth": {}}
     * },
     * @OA\Parameter(
     * name="id",
     * in="path",
     * required=true,
     * description="ID of the navigator profile to update (must match the authenticated user's profile)",
     * @OA\Schema(type="integer", example=1)
     * ),
     * @OA\RequestBody(
     * required=true,
     * @OA\MediaType(
     * mediaType="multipart/form-data",
     * @OA\Schema(
     * @OA\Property(property="name", type="string", example="Updated Navigator Name"),
     * @OA\Property(property="email", type="string", format="email", example="updated.nav@example.com"),
     * @OA\Property(property="city", type="string", nullable=true, example="Casablanca"),
     * @OA\Property(property="bio", type="string", nullable=true, example="Updated bio."),
     * @OA\Property(property="languages", type="array", @OA\Items(type="string"), nullable=true),
     * @OA\Property(property="phone_number", type="string", nullable=true),
     * @OA\Property(property="profile_picture", type="string", format="binary", nullable=true, description="New profile image (max 5MB)")
     * )
     * )
     * ),
     * @OA\Response(
     * response=200,
     * description="Profile updated successfully",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="Profile updated successfully."),
     * @OA\Property(property="data", type="object")
     * )
     * ),
     * @OA\Response(response=422, description="Validation error"),
     * @OA\Response(response=401, description="Unauthenticated"),
     * @OA\Response(response=403, description="Unauthorized: not the profile owner or role mismatch")
     * )
     */
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


    /**
     * Delete a navigator profile (Admin only).
     *
     * @OA\Delete(
     * path="/api/navigator-profiles/{id}",
     * tags={"Navigator Profiles"},
     * summary="Delete a navigator profile (Admin only)",
     * description="Deletes a specific navigator profile. Requires 'admin' role.",
     * operationId="adminDeleteProfile",
     * security={
     * {"bearerAuth": {}}
     * },
     * @OA\Parameter(
     * name="id",
     * in="path",
     * required=true,
     * description="ID of the navigator profile to delete",
     * @OA\Schema(type="integer", example=1)
     * ),
     * @OA\Response(
     * response=200,
     * description="Profile deleted successfully",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="Navigator profile deleted successfully.")
     * )
     * ),
     * @OA\Response(response=401, description="Unauthenticated"),
     * @OA\Response(response=403, description="Unauthorized: admin access required"),
     * @OA\Response(response=404, description="Not Found")
     * )
     */
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

    /**
     * Get the authenticated navigator's own profile.
     *
     * @OA\Get(
     * path="/api/navigator-profile",
     * tags={"Navigator Profiles"},
     * summary="Get own profile (Navigator only)",
     * description="Retrieves the profile and user data associated with the authenticated navigator.",
     * operationId="navigatorMyProfile",
     * security={
     * {"bearerAuth": {}}
     * },
     * @OA\Response(
     * response=200,
     * description="Successful operation",
     * @OA\JsonContent(
     * @OA\Property(property="data", type="object", description="The navigator profile object with nested user details.")
     * )
     * ),
     * @OA\Response(response=401, description="Unauthenticated"),
     * @OA\Response(response=403, description="Unauthorized: navigator access required")
     * )
     */
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


    /**
     * Update the authenticated user's password.
     *
     * @OA\Put(
     * path="/api/user/password",
     * tags={"Authentication"},
     * summary="Update password",
     * description="Allows an authenticated user to change their password by providing the current password and a new confirmed password.",
     * operationId="updateUserPassword",
     * security={
     * {"bearerAuth": {}}
     * },
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"current_password", "password", "password_confirmation"},
     * @OA\Property(property="current_password", type="string", format="password", example="oldpassword123"),
     * @OA\Property(property="password", type="string", format="password", example="newstrongpass123"),
     * @OA\Property(property="password_confirmation", type="string", format="password", example="newstrongpass123")
     * )
     * ),
     * @OA\Response(
     * response=200,
     * description="Password updated successfully",
     * @OA\JsonContent(@OA\Property(property="message", type="string", example="Password updated successfully."))
     * ),
     * @OA\Response(
     * response=400,
     * description="Bad Request: Current password mismatch",
     * @OA\JsonContent(@OA\Property(property="message", type="string", example="The provided current password does not match your actual password."))
     * ),
     * @OA\Response(response=422, description="Validation error"),
     * @OA\Response(response=401, description="Unauthenticated")
     * )
     */
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
