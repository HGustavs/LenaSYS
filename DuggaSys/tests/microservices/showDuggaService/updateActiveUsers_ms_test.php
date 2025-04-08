<?php

include "../../../../Shared/test.php";

$testsData = array(
    //------------------------------------------------------------------------------------------
    // This tests the microservice updateActiveUsers_ms 
    //------------------------------------------------------------------------------------------
    'updateActiveUsers_ms' => array(
        
        'expected-output' => '{"hash":"hjk4ert6"}',
        
        'query-after-test-1' => "DELETE FROM groupdugga WHERE hash = 'hjk4ert6';",

        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/showDuggaService/updateActiveUsers_ms.php',
        'service-data' => serialize(
            array( // Data that service needs to execute function
                'opt' => 'UPDATEAU',
                'username' => 'brom',
                'password' => 'password',
                'courseid' => 1885,
                'coursevers' => 1337,
                'hash' => 'hjk4ert6',
                'AUtoken' => 999,
            )
        ),
        'filter-output' => serialize(
            array( // Filter what output to use in assert test, use none to use all ouput from service
                'hash'
            )
        ),
    ),
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON