<?php

include "../../Shared/test.php";   // Include the test file where this is sent to

$testsData = array(   // Test-data is saved on this array that is then tested in test.php file

    //TEST #1
    //Update course update time
    'Update-course-update-time' => array(  
        'expected-output'   => '{"entries":[{"cid":"1885","updated":"2024-07-09 12:00:00"}]}',
        //Pre-values
        'query-before-test-1' => "UPDATE course SET updated = '2000-01-01 00:00:00' WHERE cid = 1885;",
        'query-after-test-1' => "UPDATE course SET updated = '2000-01-01 00:00:00' WHERE cid = 1885;",
        'service' => 'http://localhost/LenaSYS/DuggaSys\microservices\gitCommitService\newUpdateTime_ms.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',
                'courseid' => '1885',
                'currentTime' => '1720000000', // July 9, 2024 12:00:00 PM
            )),
        'filter-output' => serialize(array(
                // Filter what output to use in assert test
                'entries' => array(
                    'cid',
                    'updated'
                ),
            )),
        ),
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON
?>