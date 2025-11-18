<?php

namespace App\Http\Controllers;

use App\Jobs\SentRequest;
use App\Models\NavigatorProfile;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class TouristController extends Controller
{

    /**
     * Get a list of verified navigators with optional filters.
     *
     * @OA\Get(
     * path="/api/tourist/navigators",
     * tags={"Tourist Actions"},
     * summary="Get verified navigators (Public)",
     * description="Retrieves a paginated list of verified navigator profiles. Can be filtered by city and language.",
     * operationId="getVerifiedNavigators",
     * security={},
     * @OA\Parameter(
     * name="city",
     * in="query",
     * required=false,
     * @OA\Schema(type="string", example="Fez"),
     * description="Filter navigators by city."
     * ),
     * @OA\Parameter(
     * name="language",
     * in="query",
     * required=false,
     * @OA\Schema(type="string", example="English"),
     * description="Filter navigators by language spoken."
     * ),
     * @OA\Response(
     * response=200,
     * description="Successful operation",
     * @OA\JsonContent(
     * @OA\Property(property="data", type="object", description="Paginated list of navigator profiles.")
     * )
     * )
     * )
     */
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


    /**
     * Send a new service request to a navigator (Tourist only).
     *
     * @OA\Post(
     * path="/api/tourist/requests",
     * tags={"Tourist Actions"},
     * summary="Send a service request (Tourist only)",
     * description="Allows an authenticated tourist to send a new service request to a specific navigator. Requires 'tourist' role.",
     * operationId="touristStoreRequest",
     * security={
     * {"bearerAuth": {}}
     * },
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"navigator_id", "date", "destination", "number_of_people"},
     * @OA\Property(property="navigator_id", type="integer", example=2, description="ID of the target navigator."),
     * @OA\Property(property="date", type="string", format="date-time", example="2024-12-01T10:00:00", description="Date and time of the request (must be in the future)."),
     * @OA\Property(property="destination", type="string", example="Old Medina, Fez", description="The requested destination."),
     * @OA\Property(property="number_of_people", type="integer", example=2, description="Number of people in the group (min 1)."),
     * @OA\Property(property="message", type="string", nullable=true, example="We are looking for a 3-hour tour in the morning.")
     * )
     * ),
     * @OA\Response(
     * response=201,
     * description="Request sent successfully.",
     * @OA\JsonContent(@OA\Property(property="message", type="string", example="Request sent successfully!"))
     * ),
     * @OA\Response(response=403, description="Unauthorized: tourist access required."),
     * @OA\Response(response=422, description="Validation error")
     * )
     */
    public function storeRequest(Request $request)
    {
        $user = $request->user();

        if (!$user->hasRole('tourist')) {
            return response()->json(['message' => 'Unauthorized. Only tourists can send requests.'], 403);
        }

        logger($request->all());

        $validated = $request->validate([
            'navigator_id' => 'required|exists:users,id',
            'date' => 'required|date|after:now',
            'message' => 'nullable|string|max:1000',
            'destination' => 'required|string|max:255',
            'number_of_people' => 'required|integer|min:1',
        ]);


        $check_availability = \App\Models\Request::where('navigator_id', $validated['navigator_id'])
            ->where('date', $validated['date'])
            ->exists();


        if ($check_availability) {
            return response()->json([
                "message" => "This guide unavailable in this date"
            ], 409);
        }


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

        // $validated['date'] = Carbon::parse($validated['date'])->toDateTimeString();

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

    /**
     * Get all service requests created by the authenticated tourist (Tourist only).
     *
     * @OA\Get(
     * path="/api/tourist/requests",
     * tags={"Tourist Actions"},
     * summary="Get own service requests (Tourist only)",
     * description="Retrieves a list of all service requests created by the authenticated tourist. Requires 'tourist' role.",
     * operationId="touristMyRequests",
     * security={
     * {"bearerAuth": {}}
     * },
     * @OA\Response(
     * response=200,
     * description="Successful operation",
     * @OA\JsonContent(
     * @OA\Property(property="data", type="array", @OA\Items(
     * @OA\Property(property="id", type="integer", example=1),
     * @OA\Property(property="status", type="string", example="Pending"),
     * @OA\Property(property="navigator", type="object", description="Associated navigator details")
     * ))
     * )
     * ),
     * @OA\Response(response=403, description="Unauthorized: tourist access required.")
     * )
     */
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

    /**
     * Delete/Cancel a service request (Tourist only).
     *
     * @OA\Delete(
     * path="/api/tourist/requests/{id}",
     * tags={"Tourist Actions"},
     * summary="Cancel/Delete own service request (Tourist only)",
     * description="Allows the authenticated tourist to delete/cancel one of their service requests. Requires ownership.",
     * operationId="touristDeleteRequest",
     * security={
     * {"bearerAuth": {}}
     * },
     * @OA\Parameter(
     * name="id",
     * in="path",
     * required=true,
     * description="ID of the request to delete",
     * @OA\Schema(type="integer", example=1)
     * ),
     * @OA\Response(
     * response=200,
     * description="Request deleted successfully.",
     * @OA\JsonContent(@OA\Property(property="message", type="string", example="Request deleted successfully."))
     * ),
     * @OA\Response(response=403, description="Unauthorized: not the request owner."),
     * @OA\Response(response=404, description="Request not found.")
     * )
     */
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


    
    /**
     * Update the authenticated tourist's user profile (Tourist only).
     *
     * @OA\Put(
     * path="/api/tourist/profile",
     * tags={"Tourist Actions"},
     * summary="Update own user profile (Tourist only)",
     * description="Allows the authenticated tourist to update their name, email, and profile picture. Requires 'tourist' role.",
     * operationId="touristUpdateProfile",
     * security={
     * {"bearerAuth": {}}
     * },
     * @OA\RequestBody(
     * required=true,
     * @OA\MediaType(
     * mediaType="multipart/form-data",
     * @OA\Schema(
     * @OA\Property(property="name", type="string", nullable=true, example="New Tourist Name"),
     * @OA\Property(property="email", type="string", format="email", nullable=true, example="new.tourist@example.com"),
     * @OA\Property(property="avatar", type="string", format="binary", nullable=true, description="New profile image file (max 5MB).")
     * )
     * )
     * ),
     * @OA\Response(
     * response=200,
     * description="Profile updated successfully.",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="Profile updated successfully!"),
     * @OA\Property(property="user", type="object")
     * )
     * ),
     * @OA\Response(response=403, description="Unauthorized: tourist access required."),
     * @OA\Response(response=422, description="Validation error")
     * )
     */
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


    /**
     * Update an existing service request (Tourist only).
     *
     * @OA\Patch(
     * path="/api/tourist/requests/{id}",
     * tags={"Tourist Actions"},
     * summary="Update own service request (Tourist only)",
     * description="Allows the authenticated tourist to update an existing request, but only if its status is 'Pending'. Requires ownership.",
     * operationId="touristUpdateRequest",
     * security={
     * {"bearerAuth": {}}
     * },
     * @OA\Parameter(
     * name="id",
     * in="path",
     * required=true,
     * description="ID of the request to update",
     * @OA\Schema(type="integer", example=1)
     * ),
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"date", "destination", "number_of_people"},
     * @OA\Property(property="date", type="string", format="date-time", example="2024-12-05T14:00:00", description="Updated date and time."),
     * @OA\Property(property="destination", type="string", example="New City Center"),
     * @OA\Property(property="number_of_people", type="integer", example=3),
     * @OA\Property(property="message", type="string", nullable=true, example="New message for the navigator.")
     * )
     * ),
     * @OA\Response(
     * response=200,
     * description="Request updated successfully.",
     * @OA\JsonContent(@OA\Property(property="message", type="string", example="Request updated successfully!"))
     * ),
     * @OA\Response(response=400, description="Bad Request: Cannot edit a non-Pending request."),
     * @OA\Response(response=403, description="Unauthorized: not the request owner."),
     * @OA\Response(response=404, description="Request not found."),
     * @OA\Response(response=422, description="Validation error")
     * )
     */
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
        // $validated['date'] = Carbon::parse($validated['date'])->toDateTimeString();

        $requestModel->update($validated);

        return response()->json([
            'message' => 'Request updated successfully!',
            'data' => $requestModel->fresh(),
        ]);
    }
}
