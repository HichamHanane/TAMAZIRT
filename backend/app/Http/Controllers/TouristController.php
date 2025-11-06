<?php

namespace App\Http\Controllers;

use App\Models\NavigatorProfile;
use Illuminate\Http\Request;

class TouristController extends Controller
{

    // all verified navigators with optional filters
    public function getNavigators(Request $request)
    {
        $query = NavigatorProfile::with('user:id,name,email')
            ->where('verified', true);

        if ($request->has('city')) {
            $query->where('city', 'LIKE', '%' . $request->city . '%');
        }

        if ($request->has('language')) {
            $query->whereJsonContains('languages', $request->language);
        }

        $navigators = $query->get();

        return response()->json([
            'data' => $navigators
        ], 200);
    }


    //Send a new request to a navigator
    public function storeRequest(Request $request)
    {
        $user = $request->user();

        if (!$user->hasRole('tourist')) {
            return response()->json(['message' => 'Unauthorized. Only tourists can send requests.'], 403);
        }

        $validated = $request->validate([
            'navigator_id' => 'required|exists:users,id',
            'date' => 'required|date|after:now',
            'message' => 'nullable|string|max:1000'
        ]);

        // stop duplicate requests
        $exists = \App\Models\Request::where('tourist_id', $user->id)
            ->where('navigator_id', $validated['navigator_id'])
            ->whereIn('status', ['Pending', 'Confirmed'])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'You already have a pending or confirmed request with this navigator.'
            ], 409);
        }

        $requestData = \App\Models\Request::create([
            'tourist_id' => $user->id,
            'navigator_id' => $validated['navigator_id'],
            'date' => $validated['date'],
            'message' => $validated['message'] ?? null,
            'status' => 'Pending',
        ]);

        return response()->json([
            'message' => 'Request sent successfully!',
            'data' => $requestData
        ], 201);
    }

    //Get all requests of the auth tourist
    public function myRequests(Request $request)
    {
        $user = $request->user();

        if (!$user->hasRole('tourist')) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $requests = \App\Models\Request::with('navigator:id,name,email')
            ->where('tourist_id', $user->id)
            ->latest()
            ->get();

        return response()->json([
            'data' => $requests
        ]);
    }

    //Delete a request 
    public function destroy(Request $req, $id)
    {
        $tourist = $req->user();

        if (!$tourist->hasRole('tourist')) {
            return response()->json([
                'message' => 'Unauthorized: tourist access required.'
            ], 403);
        }

        $requestModel = \App\Models\Request::findOrFail($id);

        if ($requestModel->tourist_id !== $tourist->id) {
            return response()->json([
                'message' => 'You can only delete your assigned requests.'
            ], 403);
        }

        $requestModel->delete();

        return response()->json([
            'message' => 'Request deleted successfully.'
        ]);
    }
}
