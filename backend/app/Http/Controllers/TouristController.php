<?php

namespace App\Http\Controllers;

use App\Jobs\SentRequest;
use App\Models\NavigatorProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

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

        $navigators = $query->paginate(15);

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
            'message' => 'nullable|string|max:1000',
            'destination' => 'required|string|max:255',
            'number_of_people' => 'required|integer|min:1',
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
            'destination' => $validated['destination'],
            'number_of_people' => $validated['number_of_people'],
            'status' => 'Pending',
        ]);

        // $tourist_request = \App\Models\Request::where('tourist_id', $requestData->tourist_id)->with(['tourist:id,name,email', 'navigator:id,name,email'])->get();

        SentRequest::dispatch($requestData);

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

    //edit my profile 
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        if (!$user->hasRole('tourist')) {
            return response()->json(['message' => 'Unauthorized: Only tourists can update their profile.'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            'avatar' => 'nullable|image|max:1024',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
        ];

        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');

            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }

            $path = $file->store('avatars', 'public');
            $updateData['avatar'] = $path;
        }

        $user->update($updateData);

        $updatedUser = $user->fresh();

        return response()->json([
            'message' => 'Profile updated successfully!',
            'user' => [
                'name' => $updatedUser->name,
                'email' => $updatedUser->email,
                'avatar_url' => $updatedUser->avatar_url,
            ],
        ], 200);
    }

    public function updateRequest(Request $request, $id)
    {
        $tourist = $request->user();

        if (!$tourist->hasRole('tourist')) {
            return response()->json([
                'message' => 'Unauthorized: tourist access required.'
            ], 403);
        }

        $requestModel = \App\Models\Request::with('navigator:id,name,email')->findOrFail($id);

        if ($requestModel->tourist_id !== $tourist->id) {
            return response()->json([
                'message' => 'You can only edit your own requests.'
            ], 403);
        }

        if ($requestModel->status !== 'Pending') {
            return response()->json([
                'message' => 'Cannot edit a request that is not pending.'
            ], 400);
        }

        $validated = $request->validate([
            'date' => 'required|date|after:now',
            'message' => 'nullable|string|max:1000',
            'destination' => 'required|string|max:255',
            'number_of_people' => 'required|integer|min:1',
        ]);

        $requestModel->update($validated);

        return response()->json([
            'message' => 'Request updated successfully!',
            'data' => $requestModel->fresh(),
        ]);
    }
}
