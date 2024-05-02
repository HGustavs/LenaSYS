<?php

include_once "../../../../Shared/test.php";

$testsData = array(
    'addClass' => array(
        'expected-output' => '"NONE!"',

        'query-after-test-1' => "DELETE FROM class WHERE class = 'Testclass1';",

        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/accessedService/addClass_ms.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'ADDCLASS',
                'username' => 'brom',
                'password' => 'password',
                'newclass' => '[["Testclass1", "101", "testclass", "123", "TEST", 180, "100", null]]'
            )
        ),
        'filter-output' => serialize(
            array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )
        ),
    ),
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON