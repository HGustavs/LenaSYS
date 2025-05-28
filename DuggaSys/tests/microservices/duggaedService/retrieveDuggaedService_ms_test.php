<?php

include_once "../../../../Shared/test.php";

$testsData = array(
    'retrieveDuggaedService_ms' => array(
        'expected-output' => '{"debug":"NONE!","writeaccess":true,"coursecode":"IT118G","coursename":"Webbutveckling - datorgrafik"}',

        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/duggaedService/retrieveDuggaedService_ms.php',
        'service-data' => serialize(
            array(
                'opt' => 'fetch',
                'cid' => 2,
                'coursevers' => 97732,
                'username' => 'brom',
                'password' => 'password'
            )
        ),
        'filter-output' => serialize(
            array(
                'debug',
                'writeaccess',
                'coursecode',
                'coursename'
            )
        ),
    ),
);

testHandler($testsData, true);