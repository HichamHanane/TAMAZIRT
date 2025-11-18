<?php

namespace App\Http\Controllers;

use App\Jobs\NavigatorRejectRequest;
use App\Jobs\NavigatorRequestResponse;
use Illuminate\Http\Request;

class NavigatorRequestController extends Controller
{
    /**
     * List all requests assigned to the authenticated navigator.
     *
     * @OA\Get(
     * path="/api/navigator/requests",
     * tags={"Navigator Requests"},
     * summary="Get all assigned requests (Navigator only)",
     * description="Retrieves a list of all service requests where the authenticated user is the assigned navigator. Requires 'navigator' role.",
     * operationId="navigatorIndexRequests",
     * security={
     * {"bearerAuth": {}}
     * },
     * @OA\Response(
     * response=200,
     * description="Successful operation",
     * @OA\JsonContent(
     * @OA\Property(property="data", type="array", @OA\Items(
     * @OA\Property(property="id", type="integer", example=10),
     * @OA\Property(property="status", type="string", example="Pending"),
     * @OA\Property(property="tourist", type="object", description="Associated tourist details")
     * ))
     * )
     * ),
     * @OA\Response(response=401, description="Unauthenticated"),
     * @OA\Response(response=403, description="Unauthorized: navigator access required or not authenticated")
     * )
     */
    public function index(Request $req)
    {
        $navigator = $req->user();

        if (!$navigator->hasRole('navigator')) {
            return response()->json([
                'message' => 'Unauthorized: navigator access required.'
            ], 403);
        }

        $requests = \App\Models\Request::with('tourist')
            ->where('navigator_id', $navigator->id)
            ->latest()
            ->get();

        return response()->json([
            'data' => $requests
        ]);
    }

    /**
     * Update the status of an assigned request (Navigator only).
     *
     * @OA\Patch(
     * path="/api/navigator/requests/{id}/status",
     * tags={"Navigator Requests"},
     * summary="Update request status (Navigator only)",
     * description="Allows the navigator to update the status of an assigned request to Pending, Confirmed, or HandOff. Requires 'navigator' role and ownership of the request.",
     * operationId="navigatorUpdateRequestStatus",
     * security={
     * {"bearerAuth": {}}
     * },
     * @OA\Parameter(
     * name="id",
     * in="path",
     * required=true,
     * description="ID of the request to update",
     * @OA\Schema(type="integer", example=10)
     * ),
     * @OA\RequestBody(
     * required=true,
     * description="New status for the request",
     * @OA\JsonContent(
     * required={"status"},
     * @OA\Property(property="status", type="string", enum={"Pending", "Confirmed", "HandOff"}, example="Confirmed")
     * )
     * ),
     * @OA\Response(
     * response=200,
     * description="Request status updated successfully",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="Request status updated successfully."),
     * @OA\Property(property="data", type="object")
     * )
     * ),
     * @OA\Response(response=401, description="Unauthenticated"),
     * @OA\Response(response=403, description="Unauthorized: not the assigned navigator"),
     * @OA\Response(response=404, description="Not Found")
     * )
     */
    public function updateStatus(Request $req, $id)
    {
        $navigator = $req->user();

        if (!$navigator->hasRole('navigator')) {
            return response()->json([
                'message' => 'Unauthorized: navigator access required.'
            ], 403);
        }

        logger($req->all());

        $validated = $req->validate([
            'status' => 'required|in:Pending,Confirmed,HandOff',
        ]);

        $requestModel = \App\Models\Request::findOrFail($id);

        if ($requestModel->navigator_id !== $navigator->id) {
            return response()->json([
                'message' => 'You can only update your assigned requests.'
            ], 403);
        }

        $requestModel->update([
            'status' => $validated['status'],
        ]);

        // if ($validated['status'] == "HandOff") {
        //     NavigatorRejectRequest::dispatch($requestModel);
        // }

        NavigatorRequestResponse::dispatch($requestModel);

        return response()->json([
            'message' => 'Request status updated successfully.',
            'data' => $requestModel
        ]);
    }


    /**
     * Delete an assigned request (Navigator only).
     *
     * @OA\Delete(
     * path="/api/navigator/requests/{id}",
     * tags={"Navigator Requests"},
     * summary="Delete an assigned request (Navigator only)",
     * description="Deletes an assigned service request. Requires 'navigator' role and ownership of the request.",
     * operationId="navigatorDeleteRequest",
     * security={
     * {"bearerAuth": {}}
     * },
     * @OA\Parameter(
     * name="id",
     * in="path",
     * required=true,
     * description="ID of the request to delete",
     * @OA\Schema(type="integer", example=10)
     * ),
     * @OA\Response(
     * response=200,
     * description="Request deleted successfully",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="Request deleted successfully.")
     * )
     * ),
     * @OA\Response(response=401, description="Unauthenticated"),
     * @OA\Response(response=403, description="Unauthorized: not the assigned navigator"),
     * @OA\Response(response=404, description="Not Found")
     * )
     */
    public function destroy(Request $req, $id)
    {
        $navigator = $req->user();
        if (!$navigator->hasRole('navigator')) {
            return response()->json([
                'message' => 'Unauthorized: navigator access required.'
            ], 403);
        }
        $requestModel = \App\Models\Request::findOrFail($id);
        if ($requestModel->navigator_id !== $navigator->id) {
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
