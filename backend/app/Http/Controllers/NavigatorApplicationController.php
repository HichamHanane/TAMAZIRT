<?php

namespace App\Http\Controllers;

use App\Events\ApplicationApproved;
use App\Events\ApplicationRejected;
use App\Jobs\NewApplication;
use App\Models\NavigatorApplication;
use Illuminate\Http\Request;

class NavigatorApplicationController extends Controller
{
    //Display all applications (for admin).
    public function index(Request $req)
    {
        $user = $req->user();

        if (!$user->hasRole('admin')) {
            return response()->json([
                "message" => 'Unauthorized: admin access required.'
            ], 403);
        }

        $applications = NavigatorApplication::latest()->get();


        return response()->json([
            'status' => 'success',
            'data' => $applications
        ]);
    }


    //add new navigator application.
    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|unique:navigator_applications,email',
            'phone_number' => 'required|string|max:20',
            'city' => 'nullable|string|max:255',
            'motivation' => 'nullable|string|max:1000',
        ]);

        $application = NavigatorApplication::create($validated);
        
        NewApplication::dispatch($application);
        return response()->json([
            'message' => 'Application submitted successfully!',
            'data' => $application,
        ], 201);
    }


    //Update the status of an application (admin only).
    public function updateStatus(Request $req, $id)
    {
        $user = $req->user();

        if (!$user->hasRole('admin')) {
            return response()->json([
                "message" => 'Unauthorized: admin access required.'
            ], 403);
        }
        $validated = $req->validate([
            'status' => 'required|in:pending,approved,rejected',
        ]);

        
        $application = NavigatorApplication::findOrFail($id);
        $application->update(['status' => $validated['status']]);

        if ($validated['status'] == "approved") {
            ApplicationApproved::dispatch($application);
    
        }
        else {
            ApplicationRejected::dispatch($application);
        }
        return response()->json([
            'message' => 'Application status updated successfully.',
            'data' => $application
        ]);
    }


    //Delete an application (admin only).
    public function destroy(Request $req, $id)
    {
        $user = $req->user();

        if (!$user->hasRole('admin')) {
            return response()->json([
                "message" => 'Unauthorized: admin access required.'
            ], 403);
        }
        $application = NavigatorApplication::findOrFail($id);
        $application->delete();

        return response()->json([
            'message' => 'Application deleted successfully.'
        ]);
    }
}
