<?php

namespace App\Http\Controllers;

use App\Events\ApplicationApproved;
use App\Events\ApplicationRejected;
use App\Jobs\NewApplication;
use App\Models\NavigatorApplication;
use Illuminate\Http\Request;

class NavigatorApplicationController extends Controller
{
    /**
     * Display all applications (Admin only).
     *
     * @OA\Get(
     * path="/api/navigator-applications",
     * tags={"Navigator Applications"},
     * summary="Get all navigator applications (Admin only)",
     * description="Retrieves a list of all submitted applications. Requires 'admin' role.",
     * operationId="adminIndexApplications",
     * security={
     * {"bearerAuth": {}}
     * },
     * @OA\Response(
     * response=200,
     * description="Successful operation",
     * @OA\JsonContent(
     * @OA\Property(property="status", type="string", example="success"),
     * @OA\Property(property="data", type="array", @OA\Items(
     * @OA\Property(property="id", type="integer", example=1),
     * @OA\Property(property="full_name", type="string", example="Omar Benali"),
     * @OA\Property(property="status", type="string", example="pending")
     * ))
     * )
     * ),
     * @OA\Response(response=401, description="Unauthenticated"),
     * @OA\Response(response=403, description="Unauthorized: admin access required")
     * )
     */
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


    /**
     * Submit a new navigator application.
     *
     * @OA\Post(
     * path="/api/navigator-applications",
     * tags={"Navigator Applications"},
     * summary="Submit a new navigator application (Public)",
     * description="Allows any user to submit an application to become a navigator.",
     * operationId="submitApplication",
     * security={},
     * @OA\RequestBody(
     * required=true,
     * description="Application details",
     * @OA\JsonContent(
     * required={"full_name", "email", "phone_number"},
     * @OA\Property(property="full_name", type="string", example="Omar Benali"),
     * @OA\Property(property="email", type="string", format="email", example="omar.benali@example.com"),
     * @OA\Property(property="phone_number", type="string", example="+212600000000"),
     * @OA\Property(property="city", type="string", nullable=true, example="Marrakesh"),
     * @OA\Property(property="motivation", type="string", nullable=true, example="I want to share my knowledge of the city.")
     * )
     * ),
     * @OA\Response(
     * response=201,
     * description="Application submitted successfully",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="Application submitted successfully!"),
     * @OA\Property(property="data", type="object")
     * )
     * ),
     * @OA\Response(
     * response=422,
     * description="Validation error"
     * )
     * )
     */
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


    /**
     * Update the status of an application (Admin only).
     *
     * @OA\Patch(
     * path="/api/navigator-applications/{id}/status",
     * tags={"Navigator Applications"},
     * summary="Update application status (Admin only)",
     * description="Changes the status of a specific application (pending, approved, or rejected). Requires 'admin' role.",
     * operationId="adminUpdateApplicationStatus",
     * security={
     * {"bearerAuth": {}}
     * },
     * @OA\Parameter(
     * name="id",
     * in="path",
     * required=true,
     * description="ID of the application to update",
     * @OA\Schema(type="integer", example=1)
     * ),
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"status"},
     * @OA\Property(property="status", type="string", enum={"pending", "approved", "rejected"}, example="approved")
     * )
     * ),
     * @OA\Response(
     * response=200,
     * description="Status updated successfully",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="Application status updated successfully."),
     * @OA\Property(property="data", type="object")
     * )
     * ),
     * @OA\Response(response=401, description="Unauthenticated"),
     * @OA\Response(response=403, description="Unauthorized: admin access required"),
     * @OA\Response(response=404, description="Not Found")
     * )
     */
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

        } else {
            ApplicationRejected::dispatch($application);
        }
        return response()->json([
            'message' => 'Application status updated successfully.',
            'data' => $application
        ]);
    }


    /**
     * Delete an application (Admin only).
     *
     * @OA\Delete(
     * path="/api/navigator-applications/{id}",
     * tags={"Navigator Applications"},
     * summary="Delete an application (Admin only)",
     * description="Deletes a specific navigator application. Requires 'admin' role.",
     * operationId="adminDeleteApplication",
     * security={
     * {"bearerAuth": {}}
     * },
     * @OA\Parameter(
     * name="id",
     * in="path",
     * required=true,
     * description="ID of the application to delete",
     * @OA\Schema(type="integer", example=1)
     * ),
     * @OA\Response(
     * response=200,
     * description="Application deleted successfully",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="Application deleted successfully.")
     * )
     * ),
     * @OA\Response(response=401, description="Unauthenticated"),
     * @OA\Response(response=403, description="Unauthorized: admin access required"),
     * @OA\Response(response=404, description="Not Found")
     * )
     */
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
