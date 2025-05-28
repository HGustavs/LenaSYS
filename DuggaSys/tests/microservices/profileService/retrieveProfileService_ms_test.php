<?php

include_once "../../../../Shared/test.php";

$testsData = array(
    'retrieveProfileService_ms' => array(
        'expected-output' => '{"success":true,"status":"OK","debug":"NONE!"}',

        // Microservice and the data (POST)
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/profileService/retrieveProfileService_ms.php',
        'service-data' => serialize(
            array(
                // Parameters consumed by the microservice
                'success' => true,
                'status'  => 'OK',
                'debug'   => 'NONE!',

                // Session / login 
                'username' => 'brom',
                'password' => 'password'
            )
        ),

        'filter-output' => serialize(
            array(
                'success',
                'status',
                'debug'
            )
        ),
    ),
);

testHandler($testsData, true);
?>