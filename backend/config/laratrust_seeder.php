<?php

return [
    /**
     * Control if the seeder should create a user per role while seeding the data.
     */
    'create_users' => true, // On veut créer un user test pour chaque rôle

    /**
     * Control if all the laratrust tables should be truncated before running the seeder.
     */
    'truncate_tables' => true,

    'roles_structure' => [
        'admin' => [
            'users' => 'c,r,u,d',
            'requests' => 'c,r,u,d',
            'reviews' => 'r,d',
            'profiles' => 'r,u',
            'handoff' => 'c,r,u', // action clé : partager les contacts
        ],
        'navigator' => [
            'profiles' => 'c,r,u',
            'requests' => 'r,u',   // confirmer mission
            'reviews' => 'r',
        ],
        'tourist' => [
            'requests' => 'c,r,u',
            'reviews' => 'c,r',
            'profiles' => 'r',     // lire les profils de navigateurs
        ],
    ],

    'permissions_map' => [
        'c' => 'create',
        'r' => 'read',
        'u' => 'update',
        'd' => 'delete',
    ],
];
