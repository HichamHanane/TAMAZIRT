<?php

namespace App\Http\Controllers;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminStatisticsController extends Controller
{
    public function index(Request $req)
    {
        $admin = $req->user();

        logger($admin);


        if (!$admin->hasRole('admin')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized: admin access required.'
            ], 403);
        }

        // Total number of navigators
        $navigatorsCount = User::all()->filter(function ($user) {
            return $user->hasRole('navigator');
        })->count();

        // Total number of tourists
        $touristsCount = User::all()->filter(function ($user) {
            return $user->hasRole('tourist');
        })->count();

        // Total number of requests
        $requestsCount = \App\Models\Request::count();

        // Requests this month
        $thisMonthRequests = \App\Models\Request::whereMonth('created_at', Carbon::now()->month)
            ->whereYear('created_at', Carbon::now()->year)
            ->with(['tourist','navigator'])
            ->get();

        // Requests today
        $todayRequests = \App\Models\Request::whereDate('created_at', Carbon::today())->get();

        return response()->json([
            'navigators_count' => $navigatorsCount,
            'tourists_count' => $touristsCount,
            'requests_count' => $requestsCount,
            'this_month_requests' => $thisMonthRequests,
            'today_requests' => $todayRequests,
        ]);
    }


    public function editProfile(Request $req, $id)
    {
        $user = $req->user();

        if (!$user->hasRole('admin')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized:access required.'
            ], 403);
        }

        $req->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => ['sometimes', 'required', 'email', Rule::unique('users')->ignore($id)],
            'password' => 'sometimes|required|min:8|confirmed',
            'current_password' => 'required|string|min:8'
        ]);

        $user_to_update = User::findOrFail($id);
        $check_current_password = Hash::check($req->current_password, $user_to_update->password);

        if (!$check_current_password) {
            return response()->json([
                'message' => 'current password incorrect'
            ], 401);
        }

        $user_to_update->updated([
            'name' => $req->name,
            'email' => $req->email,
            'password' => Hash::make($req->password),
        ]);

        return response()->json([
            'user' => $user_to_update
        ], 200);

    }
}
