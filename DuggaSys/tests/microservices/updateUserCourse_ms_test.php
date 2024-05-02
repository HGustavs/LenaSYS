<?php

include "../../../Shared/test.php";

$testsData = array(
    //------------------------------------------------------------------------------------------
    // This is a test-file for testing if it works to update data in the table UserCourse using microservice updateUserCourse_ms
    //------------------------------------------------------------------------------------------
    'updateUserCourse_ms' => array(
        'expected-output' => '999',
        'query-before-test-1' => "INSERT INTO groupdugga(hash,active_users) VALUES('hjk4ert6', 999);",
        'query-after-test-1' => "DELETE FROM groupdugga WHERE hash = 'hjk4ert6';",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/accessedService/updateUserCourse_ms.php',
        'service-data' => serialize(
            array( // Data that service needs to execute function
                'opt' => 'UPDATEAU',
                'username' => 'brom',
                'password' => 'password',
                'courseid' => '3',
                'coursevers' => '97732',
                'hash' => 'hjk4ert6',
                'AUtoken' => 999
            )
        ),
        'filter-output' => serialize(
            array( // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )
        ),
    ),

    'updateActiveUsers_ms' => array(
        'expected-output' => '999',
        'query-before-test-1' => "INSERT INTO groupdugga(hash,active_users) VALUES('hjk4ert6', 999);",
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
                'AUtoken' => 999
            )
        ),
        'filter-output' => serialize(
            array( // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )
        ),
    ),

    'updateActiveUsers_ms' => array(
        'expected-output' => '999',
        'query-before-test-1' => "INSERT INTO groupdugga(hash,active_users) VALUES('hjk4ert6', 999);",
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
                'AUtoken' => 999
            )
        ),
        'filter-output' => serialize(
            array( // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )
        ),
    ),

    'updateActiveUsers_ms' => array(
        'expected-output' => '999',
        'query-before-test-1' => "INSERT INTO groupdugga(hash,active_users) VALUES('hjk4ert6', 999);",
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
                'AUtoken' => 999
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