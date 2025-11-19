<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class LoginTest extends TestCase
{
    /**
     * A basic feature test example.
     */

    public function test_a_use_can_successfully_login()
    {
        $password = "12345678";
        $data = [
            "email" => "hnn@gmail.com",
            'password' => $password
        ];

        $response = $this->postJson('/api/login', $data);

        $response->assertStatus(200);

        $this->assertDatabaseHas('users', ['email' => "hnn@gmail.com"]);
    }

    public function test_a_user_can_not_login_without_password_field()
    {
        $data = [
            "email" => "hnn@gmail.com"
        ];

        $response = $this->postJson('/api/login', $data);
        $response->assertStatus(422);

        $response->assertJsonValidationErrors(['password']);
    }

    public function test_a_user_can_not_loggedin_with_invalid_password_and_email()
    {
        $password = '123456789';
        $data = [
            "email" => "hnn_test@gmail.com",
            "password" => $password
        ];

        $response = $this->postJson('/api/login', $data);

        $response->assertStatus(422);

    }

}
