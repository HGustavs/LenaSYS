<?php

include "../../../../Shared/test.php";

$testsData = array(
    //------------------------------------------------------------------------------------------
    // This tests the microservice updateActiveUsers_ms 
    //------------------------------------------------------------------------------------------
    'updateActiveUsers_ms' => array(
        'expected-output' => '3',
        'query-before-test-1' => "INSERT INTO groupdugga(hash,active_users) VALUES('hjk4ert6', 3);",
        'query-after-test-1' => "DELETE FROM groupdugga WHERE hash = 'hjk4ert6';",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/showDuggaService/updateActiveUsers_ms.php',
        'service-data' => serialize(
            array( // Data that service needs to execute function
                'opt' => 'UPDATEAU',
                'username' => 'brom',
                'password' => 'password',
                'courseid' => '2',
                'coursevers' => '97732',
                'hash' => 'hjk4ert6',
                'AUtoken' => 3
            )
        ),
        'filter-output' => serialize(
            array( // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )
        ),
    ),
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON