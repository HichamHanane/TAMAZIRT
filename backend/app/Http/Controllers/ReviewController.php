<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    //Create a new review for a navigator
    public function store(Request $request)
    {
        $user = $request->user();

        if (!$user->hasRole('tourist')) {
            return response()->json([
                'message' => 'Unauthorized. Only tourists can create reviews.'
            ], 403);
        }

        $validated = $request->validate([
            'navigator_id' => 'required|exists:users,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        // stop the tourist to add a review to a navigator if his is already give him a review
        $existing = Review::where('tourist_id', $user->id)
            ->where('navigator_id', $validated['navigator_id'])
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'You have already reviewed this navigator.'
            ], 409);
        }

        $review = Review::create([
            'tourist_id' => $user->id,
            'navigator_id' => $validated['navigator_id'],
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? null,
        ]);

        return response()->json([
            'message' => 'Review submitted successfully.',
            'data' => $review
        ], 201);
    }


    // View all reviews for a specific navigator
    public function navigatorReviews($navigatorId)
    {
        $reviews = Review::with('tourist:id,name,email')
            ->where('navigator_id', $navigatorId)
            ->latest()
            ->get();

        return response()->json([
            'data' => $reviews
        ]);
    }

    // Tourist update his own review
    public function update(Request $request, $id)
    {
        $user = $request->user();

        $review = Review::findOrFail($id);

        if ($review->tourist_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized. You can only edit your own review.'
            ], 403);
        }

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $review->update($validated);

        return response()->json([
            'message' => 'Review updated successfully.',
            'data' => $review
        ]);
    }

    //Tourist delete his own review
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $review = Review::findOrFail($id);

        if ($review->tourist_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized. You can only delete your own review.'
            ], 403);
        }

        $review->delete();

        return response()->json([
            'message' => 'Review deleted successfully.'
        ]);
    }

    // View all reviews 
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user->hasRole('admin')) {
            return response()->json([
                'message' => 'Unauthorized. Admin access only.'
            ], 403);
        }

        $reviews = Review::with(['tourist:id,name,email', 'navigator:id,name,email'])
            ->latest()
            ->get();

        return response()->json([
            'data' => $reviews
        ]);
    }
}
