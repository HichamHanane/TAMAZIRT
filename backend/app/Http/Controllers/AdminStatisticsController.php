<?php

namespace App\Http\Controllers;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class AdminStatisticsController extends Controller
{
    public function index(Request $req)
    {
        $admin = $req->user();

        if (!$admin->hasRole('admin')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized: admin access required.'
            ], 403);
        }

        // Total number of navigators
        $navigatorsCount = User::all()->filter(function ($user) {
            return $user->hasRole('navigators');
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
}
