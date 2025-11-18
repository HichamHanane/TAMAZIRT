<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request (Login).
     *
     * @OA\Post(
     * path="/api/login",
     * tags={"Authentication"},
     * summary="Log a user into the application",
     * description="Authenticates a user with email and password and returns a Sanctum API token.",
     * operationId="loginUser",
     * @OA\RequestBody(
     * required=true,
     * description="User login credentials",
     * @OA\JsonContent(
     * required={"email", "password"},
     * @OA\Property(property="email", type="string", format="email", example="john@example.com", description="The user's registered email address."),
     * @OA\Property(property="password", type="string", format="password", example="secretpassword123", description="The user's password.")
     * )
     * ),
     * @OA\Response(
     * response=200,
     * description="Login successful, returns the user and the API token.",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="Login successful."),
     * @OA\Property(
     * property="user",
     * type="object",
     * description="Authenticated user details.",
     * @OA\Property(property="name", type="string", example="John Doe"),
     * @OA\Property(property="email", type="string", example="john@example.com"),
     * @OA\Property(property="role", type="string", example="Tourist", description="The primary role of the user.")
     * ),
     * @OA\Property(property="token", type="string", example="1|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", description="The generated Sanctum API token.")
     * )
     * ),
     * @OA\Response(
     * response=401,
     * description="Unauthenticated / Invalid Credentials",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="These credentials do not match our records.")
     * )
     * )
     * )
     */
    public function store(LoginRequest $request): JsonResponse
    {
        $request->authenticate();

        // Retrieve authenticated user
        $user = Auth::user();

        // Create a new token for the user
        $token = $user->createToken('eventify_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful.',
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->roles->pluck('name')->first(),
            ],
            'token' => $token,
        ], 200);
    }

    /**
     * Destroy an authenticated session (Logout).
     *
     * @OA\Post(
     * path="/api/logout",
     * tags={"Authentication"},
     * summary="Log a user out (Revoke token)",
     * description="Revokes the current API token, effectively logging the user out.",
     * operationId="logoutUser",
     * security={{"bearerAuth": {}}},
     * @OA\Response(
     * response=200,
     * description="Logout successful.",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="Logged out successfully.")
     * )
     * ),
     * @OA\Response(
     * response=401,
     * description="Unauthenticated",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="Unauthenticated.")
     * )
     * )
     * )
     */
    public function destroy(Request $request): JsonResponse
    {
        logger($request);
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully.',
        ], 200);
    }
}
