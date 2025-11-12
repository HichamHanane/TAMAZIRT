<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminTouristController extends Controller
{
    //all the tourists
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


    //Add a new tourist
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

    //Edit a tourist
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

    //Delete a tourist
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
