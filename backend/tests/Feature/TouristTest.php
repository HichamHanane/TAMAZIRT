<?php

namespace Tests\Feature;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class TouristTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    // public function test_example(): void
    // {
    //     $response = $this->get('/');

    //     $response->assertStatus(200);
    // }


    public function test_a_tourist_sent_request_successfully()
    {
        $guide = User::factory()->create();
        $guide->addRole('navigator');

        $tourist = User::factory()->create();
        $tourist->addRole('tourist');

        $random_date = Carbon::now()->addDay()->toDateTimeString();

        $request_data = [
            'navigator_id' => $guide->id,
            'date' => $random_date,
            'message' => "Hello , are you open for a trip",
            "number_of_people" => 3,
            "destination" => "Fes"
        ];

        $response = $this->actingAs($tourist)->postJson('/api/tourist/requests', $request_data);
        $response->assertStatus(201);

        $this->assertDatabaseHas('requests', [
            'tourist_id' => $tourist->id,
            'navigator_id' => $guide->id,
            'destination' => 'Fes',
        ]);


    }


    public function test_tourist_sent_request_with_invalid_date()
    {

        $guide = User::factory()->create();
        $guide->addRole('navigator');

        $tourist = User::factory()->create();
        $tourist->addRole('tourist');

        $request_data = [
            'navigator_id' => $guide->id,
            "tourist_id" => $tourist->id,
            "message" => "hello , guide",
            "destination" => "Casablanca",
            "number_of_people" => 1,
        ];

        $response = $this->actingAs($tourist)->postJson('/api/tourist/requests', $request_data);

        $response->assertStatus(422);

        $this->assertDatabaseMissing('requests', [
            'tourist_id' => $tourist->id,
            'navigator_id' => $tourist->id
        ]);
    }


    public function test_sent_request_with_user_without_role_tourist()
    {
        $guide = User::factory()->create();
        $guide->addRole('navigator');

        $tourist = User::factory()->create();
        $tourist->addRole('tourist');

        $request_data = [
            'navigator_id' => $guide->id,
            "tourist_id" => $tourist->id,
            "message" => "hello , guide",
            "destination" => "Casablanca",
            "number_of_people" => 1,
        ];

        $response = $this->actingAs($guide)->postJson('/api/tourist/requests', $request_data);
        $response->assertStatus(403);
    }
}
