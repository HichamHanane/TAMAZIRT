<?php

namespace App\Observers;

use App\Models\NavigatorProfile;
use App\Models\Review;
use Illuminate\Support\Facades\Log;

class ReviewObserver
{
    /**
     * Handle the Review "created" event.
     */
    public function created(Review $review): void
    {
        //

        $this->updateTheAvgRatingForNavigator($review);

    }

    /**
     * Handle the Review "updated" event.
     */
    public function updated(Review $review): void
    {
        //
        $this->updateTheAvgRatingForNavigator($review);
    }

    /**
     * Handle the Review "deleted" event.
     */
    public function deleted(Review $review): void
    {
        //
        $this->updateTheAvgRatingForNavigator($review);
    }

    /**
     * Handle the Review "restored" event.
     */
    public function restored(Review $review): void
    {
        //
    }

    /**
     * Handle the Review "force deleted" event.
     */
    public function forceDeleted(Review $review): void
    {
        //
    }


    protected function updateTheAvgRatingForNavigator(Review $review)
    {
        $navigator = NavigatorProfile::findOrFail($review->navigator_id);

        $avg = Review::where('navigator_id', $review->navigator_id)->avg('rating') ?? 0;

        Log::info("Avg : {$avg}");

        $navigator->update(['average_rating' => round($avg, 1)]);
        $navigator->save();


        Log::info("Review : {$review}");

        Log::info("Navigator : {$navigator}");
    }
}
