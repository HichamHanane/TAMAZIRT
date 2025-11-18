<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AdminTouristController extends Controller
{
    /**
     * Retrieve a list of all tourist accounts.
     *
     * @OA\Get(
     * path="/api/admin/tourists",
     * tags={"Admin - Tourists"},
     * summary="Get all tourist accounts (Admin only)",
     * description="Fetches a list of all users who have the 'tourist' role. Requires 'admin' role.",
     * operationId="adminIndexTourists",
     * security={
     * {"bearerAuth": {}}
     * },
     * @OA\Response(
     * response=200,
     * description="Successful operation",
     * @OA\JsonContent(
     * @OA\Property(property="data", type="array", @OA\Items(
     * @OA\Property(property="id", type="integer", example=1),
     * @OA\Property(property="name", type="string", example="Alice Smith"),
     * @OA\Property(property="email", type="string", format="email", example="alice@example.com"),
     * @OA\Property(property="role", type="string", example="tourist"),
     * ))
     * )
     * ),
     * @OA\Response(
     * response=401,
     * description="Unauthenticated",
     * @OA\JsonContent(@OA\Property(property="message", type="string", example="Unauthenticated."))
     * ),
     * @OA\Response(
     * response=403,
     * description="Unauthorized: Admin access required",
     * @OA\JsonContent(
     * @OA\Property(property="status", type="string", example="error"),
     * @OA\Property(property="message", type="string", example="Unauthorized: admin access required.")
     * )
     * )
     * )
     */
    public function index(Request $request)
    {
        $admin = $request->user();

        if (!$admin->hasRole('admin')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized: admin access required.'
            ], 403);
        }


        $tourists = User::all()->filter(function ($user) {
            return $user->hasRole('tourist');
        });
        $tourists = $tourists->values();
        return response()->json([
            'data' => $tourists
        ], 200);
    }


    /**
     * Add a new tourist account.
     *
     * @OA\Post(
     * path="/api/admin/tourists",
     * tags={"Admin - Tourists"},
     * summary="Create a new tourist account (Admin only)",
     * description="Creates a new user, assigns the 'tourist' role, and requires 'admin' role for access.",
     * operationId="adminStoreTourist",
     * security={
     * {"bearerAuth": {}}
     * },
     * @OA\RequestBody(
     * required=true,
     * description="Data for the new tourist account",
     * @OA\JsonContent(
     * required={"name", "email", "password"},
     * @OA\Property(property="name", type="string", example="New Tourist"),
     * @OA\Property(property="email", type="string", format="email", example="new.tourist@example.com"),
     * @OA\Property(property="password", type="string", format="password", example="securepass123")
     * )
     * ),
     * @OA\Response(
     * response=201,
     * description="Tourist account created successfully",
     * @OA\JsonContent(
     * @OA\Property(property="status", type="string", example="success"),
     * @OA\Property(property="message", type="string", example="Tourist account created successfully."),
     * @OA\Property(property="data", type="object")
     * )
     * ),
     * @OA\Response(
     * response=422,
     * description="Validation error",
     * @OA\JsonContent(@OA\Property(property="message", type="string", example="The given data was invalid."))
     * ),
     * @OA\Response(response=401, description="Unauthenticated"),
     * @OA\Response(response=403, description="Unauthorized: Admin access required")
     * )
     */
    public function store(Request $request)
    {
        $admin = $request->user();

        if (!$admin->hasRole('admin')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized: admin access required.'
            ], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
        ]);

        $tourist = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $tourist->addRole('tourist');

        return response()->json([
            'status' => 'success',
            'message' => 'Tourist account created successfully.',
            'data' => $tourist
        ], 201);
    }

    /**
     * Edit an existing tourist account.
     *
     * @OA\Put(
     * path="/api/admin/tourists/{id}",
     * tags={"Admin - Tourists"},
     * summary="Update a tourist account (Admin only)",
     * description="Updates an existing tourist's details. Requires 'admin' role.",
     * operationId="adminUpdateTourist",
     * security={
     * {"bearerAuth": {}}
     * },
     * @OA\Parameter(
     * name="id",
     * in="path",
     * required=true,
     * description="ID of the tourist to update",
     * @OA\Schema(type="integer", example=1)
     * ),
     * @OA\RequestBody(
     * required=false,
     * description="Fields to update (all optional)",
     * @OA\JsonContent(
     * @OA\Property(property="name", type="string", nullable=true, example="Alice Updated"),
     * @OA\Property(property="email", type="string", format="email", nullable=true, example="alice.updated@example.com"),
     * @OA\Property(property="password", type="string", format="password", nullable=true, example="newsecurepass123")
     * )
     * ),
     * @OA\Response(
     * response=200,
     * description="Tourist account updated successfully",
     * @OA\JsonContent(
     * @OA\Property(property="status", type="string", example="success"),
     * @OA\Property(property="message", type="string", example="Tourist account updated successfully."),
     * @OA\Property(property="data", type="object")
     * )
     * ),
     * @OA\Response(response=400, description="Bad Request: User is not a tourist"),
     * @OA\Response(response=404, description="Not Found: Tourist not found"),
     * @OA\Response(response=422, description="Validation error"),
     * @OA\Response(response=401, description="Unauthenticated"),
     * @OA\Response(response=403, description="Unauthorized: Admin access required")
     * )
     */
    public function update(Request $request, $id)
    {
        $admin = $request->user();

        if (!$admin->hasRole('admin')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized: admin access required.'
            ], 403);
        }

        $tourist = User::findOrFail($id);

        if (!$tourist->hasRole('tourist')) {
            return response()->json([
                'message' => 'This user is not a tourist.'
            ], 400);
        }

        
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . $tourist->id,
            'password' => 'nullable|string|min:8',
        ]);


        $tourist->update([
            'name' => $validated['name'] ?? $tourist->name,
            'email' => $validated['email'] ?? $tourist->email,
            'password' => isset($validated['password']) ? Hash::make($validated['password']) : $tourist->password,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Tourist account updated successfully.',
            'data' => $tourist
        ], 200);
    }

    /**
     * Delete a tourist account.
     *
     * @OA\Delete(
     * path="/api/admin/tourists/{id}",
     * tags={"Admin - Tourists"},
     * summary="Delete a tourist account (Admin only)",
     * description="Deletes an existing tourist account by ID. Requires 'admin' role.",
     * operationId="adminDeleteTourist",
     * security={
     * {"bearerAuth": {}}
     * },
     * @OA\Parameter(
     * name="id",
     * in="path",
     * required=true,
     * description="ID of the tourist to delete",
     * @OA\Schema(type="integer", example=1)
     * ),
     * @OA\Response(
     * response=200,
     * description="Tourist account deleted successfully",
     * @OA\JsonContent(
     * @OA\Property(property="status", type="string", example="success"),
     * @OA\Property(property="message", type="string", example="Tourist account deleted successfully.")
     * )
     * ),
     * @OA\Response(response=400, description="Bad Request: User is not a tourist"),
     * @OA\Response(response=404, description="Not Found: Tourist not found"),
     * @OA\Response(response=401, description="Unauthenticated"),
     * @OA\Response(response=403, description="Unauthorized: Admin access required")
     * )
     */
    public function destroy(Request $request, $id)
    {
        $admin = $request->user();

        if (!$admin->hasRole('admin')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized: admin access required.'
            ], 403);
        }

        $tourist = User::findOrFail($id);

        if (!$tourist->hasRole('tourist')) {
            return response()->json([
                'status' => 'error',
                'message' => 'This user is not a tourist.'
            ], 400);
        }

        $tourist->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Tourist account deleted successfully.'
        ], 200);
    }
}
