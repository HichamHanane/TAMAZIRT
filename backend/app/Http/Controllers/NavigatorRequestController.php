<?php

namespace App\Http\Controllers;

use App\Jobs\NavigatorRejectRequest;
use App\Jobs\NavigatorRequestResponse;
use Illuminate\Http\Request;

class NavigatorRequestController extends Controller
{
    //List all requests of the auth navigator
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

    //Update request status
    public function updateStatus(Request $req, $id)
    {
        $navigator = $req->user();

        if (!$navigator->hasRole('navigator')) {
            return response()->json([
                'message' => 'Unauthorized: navigator access required.'
            ], 403);
        }

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


    //Delete a request 
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
