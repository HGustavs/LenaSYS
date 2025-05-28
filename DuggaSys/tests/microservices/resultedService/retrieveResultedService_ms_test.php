<?php

include_once "../../../../Shared/test.php";

$testsData = array(
    'retrieveResultedService' => array(
        'expected-output' => '{"tableInfo":{"name":"students"},"duggaFilterOptions":{"duggaid":123}}',

        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/resultedService/retrieveResultedService_ms.php',

        'service-data' => serialize(
            array(
                'username' => 'brom',
                'password' => 'password',
                'tableInfo' => json_encode(array("name" => "students")),
                'duggaFilterOptions' => json_encode(array("duggaid" => 123))
            )
        ),

        'filter-output' => serialize(array(
            'tableInfo',
            'duggaFilterOptions'
        )),
    ),
);

testHandler($testsData, true);
