<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use DatabaseTransactions;


    public function test_a_user_can_register_successfully_as_a_tourist()
    {
        $password = 'password';
        $data = [
            'name' => 'tourist_test',
            'email' => 'test@example.com',
            'password' => $password,
            'password_confirmation' => $password,
        ];

        $response = $this->postJson('/api/register', $data);

        $response->assertStatus(200);

        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
            'name' => 'tourist_test',
        ]);

        $user = User::where('email', 'test@example.com')->first();
        $this->assertTrue($user && $user->hasRole('tourist'), 'The registered user must exist and have the Tourist role.');



    }

    public function test_a_user_can_not_register_without_sent_name()
    {
        $password = 'password';
        $data = [
            'email' => "hicham_test@gmail.com",
            'password' => $password,
            'password_confirmation' => $password,
        ];

        $response = $this->postJson('/api/register', $data);

        $response->assertStatus(422);
    }

    public function test_a_user_can_not_register_if_password_not_match()
    {
        $password = "password";

        $data = [
            'email' => "hicham_test@gmail.com",
            'password' => $password,
            'password_confirmation' => "12345678",
        ];

        $response = $this->postJson('/api/register', $data);
        $response->assertStatus(422);

        $this->assertDatabaseMissing('users', ['email' => "hicham_test@gmail.com"]);
    }
}
