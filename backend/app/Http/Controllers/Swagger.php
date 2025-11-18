<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
/**
 * @OA\Info(
 * version="1.0.0",
 * title="TAMAZIRT API Documentation",
 * description="API for TAMAZIRT",
 * @OA\Contact(
 * email="support@tamazirt.com"
 * )
 * )
 *
 * @OA\Server(
 * url=L5_SWAGGER_CONST_HOST,
 * description="TAMAZIRT API Server"
 * )
 *
 * @OA\SecurityScheme(
 * securityScheme="bearerAuth",
 * in="header",
 * name="Bearer Token Authentication",
 * type="http",
 * scheme="Bearer",
 * bearerFormat="Sanctum Token",
 * )
 */

class Swagger extends Controller
{
    //
}
