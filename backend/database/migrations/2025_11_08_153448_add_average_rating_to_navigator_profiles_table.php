<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('navigator_profiles', function (Blueprint $table) {
            $table->float('average_rating')->default(0)->after('phone_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('navigator_profiles', function (Blueprint $table) {
            Schema::table('navigator_profiles', function (Blueprint $table) {
                $table->dropColumn('average_rating');
            });
        });
    }
};
