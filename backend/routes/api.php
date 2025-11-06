<?php

use App\Http\Controllers\NavigatorApplicationController;
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


Route::get('/test',function(){
    return 'hello hicham hnn';
});



require __DIR__.'/auth.php';