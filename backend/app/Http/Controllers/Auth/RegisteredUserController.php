<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use OpenApi\Annotations as OA;



class RegisteredUserController extends Controller
{
    

    /**
     *
     * @OA\Post(
     * path="/api/register",
     * tags={"Authentication"},
     * summary="Register a new user",
     * security={},
     * description="Creates a new user account using name, email, and a confirmed password.",
     * operationId="registerUser",
     * @OA\RequestBody(
     * required=true,
     * description="User registration data",
     * @OA\JsonContent(
     * required={"name", "email", "password", "password_confirmation"},
     * @OA\Property(property="name", type="string", example="John Doe", description="The user's full name."),
     * @OA\Property(property="email", type="string", format="email", example="john@example.com", description="The user's unique email address."),
     * @OA\Property(property="password", type="string", format="password", example="secretpassword123", description="The password, must be confirmed."),
     * @OA\Property(property="password_confirmation", type="string", format="password", example="secretpassword123", description="Password confirmation.")
     * )
     * ),
     * @OA\Response(
     * response=200,
     * description="Successful registration",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="Registerd Successfully"),
     * @OA\Property(
     * property="user",
     * type="object",
     * description="Details of the newly created user.",
     * @OA\Property(property="id", type="integer", example=1),
     * @OA\Property(property="name", type="string", example="John Doe"),
     * @OA\Property(property="email", type="string", example="john@example.com"),
     * @OA\Property(property="created_at", type="string", format="date-time"),
     * @OA\Property(property="updated_at", type="string", format="date-time"),
     * )
     * )
     * ),
     * @OA\Response(
     * response=422,
     * description="Validation error",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="The given data was invalid."),
     * @OA\Property(
     * property="errors",
     * type="object",
     * description="Details of validation errors, e.g., {'email': ['The email has already been taken.']}"
     * )
     * )
     * )
     * )
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // event(new Registered($user));
        $user->addRole('Tourist');
        return response()->json([
            'message' => 'Registerd Successfully',
            'user' => $user
        ]);
    }
}
