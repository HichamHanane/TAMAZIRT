<?php

use App\Http\Controllers\NavigatorApplicationController;
use App\Http\Controllers\NavigatorProfileController;
use App\Http\Controllers\NavigatorRequestController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\TouristController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});



//applications routes 
Route::post('/navigator-applications', [NavigatorApplicationController::class, 'store']);
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/navigator-applications', [NavigatorApplicationController::class, 'index']);
    Route::patch('/navigator-applications/{id}/status', [NavigatorApplicationController::class, 'updateStatus']);
    Route::delete('/navigator-applications/{id}', [NavigatorApplicationController::class, 'destroy']);
});



// navigator profile routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/navigator-profiles', [NavigatorProfileController::class, 'store']);
    Route::get('/navigator-profiles', [NavigatorProfileController::class, 'index']);
    Route::put('/navigator-profiles/{id}', [NavigatorProfileController::class, 'update']);
    Route::delete('/navigator-profiles/{id}', [NavigatorProfileController::class, 'destroy']);
});


// navigator requests routes 
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/navigator/requests', [NavigatorRequestController::class, 'index']);
    Route::patch('/navigator/requests/{id}/status', [NavigatorRequestController::class, 'updateStatus']);
});

// reviews routes
Route::middleware(['auth:sanctum'])->group(function () {
    // Tourist routes
    Route::get('/my-reviews', [ReviewController::class, 'myReviews']);
    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::patch('/reviews/{id}', [ReviewController::class, 'update']);
    Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);

    // Public view for navigator reviews
    Route::get('/navigators/{id}/reviews', [ReviewController::class, 'navigatorReviews']);

    // Admin view all reviews
    Route::get('/reviews', [ReviewController::class, 'index']);
});

// tourist routes 
Route::get('/tourist/navigators', [TouristController::class, 'getNavigators']);
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/tourist/requests', [TouristController::class, 'storeRequest']);
    Route::get('/tourist/requests', [TouristController::class, 'myRequests']);
    Route::delete('/tourist/requests/{id}', [TouristController::class, 'destroy']);
    // Route::delete(uri: '/tourist/requests/{id}', [TouristController::class, 'destroy']);

});



Route::get('/test', function () {
    return 'hello hicham hnn';
});



require __DIR__ . '/auth.php';