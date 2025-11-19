<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Create a new review for a navigator (Tourist only).
     *
     * @OA\Post(
     * path="/api/reviews",
     * tags={"Reviews"},
     * summary="Submit a new review (Tourist only)",
     * description="Allows an authenticated tourist to submit a review for a navigator. A tourist can only review a specific navigator once.",
     * operationId="touristStoreReview",
     * security={
     * {"bearerAuth": {}}
     * },
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"navigator_id", "rating"},
     * @OA\Property(property="navigator_id", type="integer", example=2, description="ID of the navigator being reviewed."),
     * @OA\Property(property="rating", type="integer", minimum=1, maximum=5, example=5, description="The rating given (1 to 5)."),
     * @OA\Property(property="comment", type="string", nullable=true, example="Excellent service, very knowledgeable!", description="Optional comment.")
     * )
     * ),
     * @OA\Response(
     * response=201,
     * description="Review submitted successfully.",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="Review submitted successfully."),
     * @OA\Property(property="data", type="object")
     * )
     * ),
     * @OA\Response(response=403, description="Unauthorized: Only tourists can create reviews."),
     * @OA\Response(response=409, description="Conflict: You have already reviewed this navigator."),
     * @OA\Response(response=422, description="Validation error")
     * )
     */
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


    /**
     * Get all reviews created by the authenticated tourist (Tourist only).
     *
     * @OA\Get(
     * path="/api/my-reviews",
     * tags={"Reviews"},
     * summary="Get reviews submitted by the authenticated tourist (Tourist only)",
     * description="Retrieves a list of all reviews written by the authenticated user. Requires 'tourist' role.",
     * operationId="touristMyReviews",
     * security={
     * {"bearerAuth": {}}
     * },
     * @OA\Response(
     * response=200,
     * description="Successful operation",
     * @OA\JsonContent(
     * @OA\Property(property="data", type="array", @OA\Items(
     * @OA\Property(property="id", type="integer", example=1),
     * @OA\Property(property="rating", type="integer", example=5),
     * @OA\Property(property="navigator", type="object", description="Navigator details")
     * ))
     * )
     * ),
     * @OA\Response(response=403, description="Unauthorized: Only tourists can view their reviews.")
     * )
     */
    public function myReviews(Request $request)
    {
        $user = $request->user();

        if (!$user->hasRole('tourist')) {
            return response()->json([
                'message' => 'Unauthorized. Only tourists can view their reviews.'
            ], 403);
        }

        $reviews = Review::with('navigator:id,name,email')
            ->where('tourist_id', $user->id)
            ->latest()
            ->get();

        return response()->json([
            'data' => $reviews
        ]);
    }


    /**
     * View all reviews for the authenticated navigator (Navigator only).
     *
     * @OA\Get(
     * path="/api/navigators/reviews",
     * tags={"Reviews"},
     * summary="Get reviews received by the authenticated navigator (Navigator only)",
     * description="Retrieves a list of all reviews given to the authenticated navigator. Requires 'navigator' role.",
     * operationId="navigatorGetOwnReviews",
     * security={
     * {"bearerAuth": {}}
     * },
     * @OA\Response(
     * response=200,
     * description="Successful operation",
     * @OA\JsonContent(
     * @OA\Property(property="data", type="array", @OA\Items(
     * @OA\Property(property="id", type="integer", example=1),
     * @OA\Property(property="rating", type="integer", example=5),
     * @OA\Property(property="tourist", type="object", description="Tourist details")
     * ))
     * )
     * ),
     * @OA\Response(response=403, description="Unauthorized: Only navigators can view their reviews.")
     * )
     */
    public function navigatorReviews(Request $request)
    {
        logger("navigator reviews");

        $user = $request->user();


        if (!$user->hasRole('navigator')) {
            return response()->json([
                'message' => 'Unauthorized. Only navigator can view their reviews.'
            ], 403);
        }
        $reviews = Review::with(['tourist:id,name,email' , 'navigator'])
            ->where('navigator_id', $user->id)
            ->latest()
            ->get();

        return response()->json([
            'data' => $reviews
        ]);
    }

    /**
     * Update an existing review (Tourist only).
     *
     * @OA\Patch(
     * path="/api/reviews/{id}",
     * tags={"Reviews"},
     * summary="Update own review (Tourist only)",
     * description="Allows the authenticated tourist to update the rating and comment of their own review. Requires ownership.",
     * operationId="touristUpdateReview",
     * security={
     * {"bearerAuth": {}}
     * },
     * @OA\Parameter(
     * name="id",
     * in="path",
     * required=true,
     * description="ID of the review to update",
     * @OA\Schema(type="integer", example=1)
     * ),
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"rating"},
     * @OA\Property(property="rating", type="integer", minimum=1, maximum=5, example=4),
     * @OA\Property(property="comment", type="string", nullable=true, example="It was good, changed my rating to 4.")
     * )
     * ),
     * @OA\Response(
     * response=200,
     * description="Review updated successfully.",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="Review updated successfully."),
     * @OA\Property(property="data", type="object")
     * )
     * ),
     * @OA\Response(response=403, description="Unauthorized: You can only edit your own review."),
     * @OA\Response(response=404, description="Review not found."),
     * @OA\Response(response=422, description="Validation error")
     * )
     */
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

    /**
     * Delete an existing review (Tourist only).
     *
     * @OA\Delete(
     * path="/api/reviews/{id}",
     * tags={"Reviews"},
     * summary="Delete own review (Tourist only)",
     * description="Allows the authenticated tourist to delete their own review. Requires ownership.",
     * operationId="touristDeleteReview",
     * security={
     * {"bearerAuth": {}}
     * },
     * @OA\Parameter(
     * name="id",
     * in="path",
     * required=true,
     * description="ID of the review to delete",
     * @OA\Schema(type="integer", example=1)
     * ),
     * @OA\Response(
     * response=200,
     * description="Review deleted successfully.",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="Review deleted successfully.")
     * )
     * ),
     * @OA\Response(response=403, description="Unauthorized: You can only delete your own review."),
     * @OA\Response(response=404, description="Review not found.")
     * )
     */
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

    /**
     * View all reviews (Admin only).
     *
     * @OA\Get(
     * path="/api/reviews",
     * tags={"Reviews"},
     * summary="Get all reviews (Admin only)",
     * description="Retrieves a list of all reviews submitted in the system, with tourist and navigator details. Requires 'admin' role.",
     * operationId="adminIndexReviews",
     * security={
     * {"bearerAuth": {}}
     * },
     * @OA\Response(
     * response=200,
     * description="Successful operation",
     * @OA\JsonContent(
     * @OA\Property(property="data", type="array", @OA\Items(
     * @OA\Property(property="id", type="integer", example=1),
     * @OA\Property(property="rating", type="integer", example=5),
     * @OA\Property(property="tourist", type="object", description="Tourist details"),
     * @OA\Property(property="navigator", type="object", description="Navigator details")
     * ))
     * )
     * ),
     * @OA\Response(response=403, description="Unauthorized: Admin access only.")
     * )
     */
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
