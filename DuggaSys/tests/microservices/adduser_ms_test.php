<?php

include "../../../Shared/test.php";

$testsData = array(
    //------------------------------------------------------------------------------------------
    // This tests the microservice updateActiveUsers_ms 
    //------------------------------------------------------------------------------------------
    'updateActiveUsers_ms' => array(
        'expected-output' => '999',
        'query-before-test-1' => "INSERT INTO course (cid,coursecode,coursename,visibility,creator, hp, courseGitURL) VALUES(999,'test','toBeDeleted', 0, 1, 7.5, null)",
        'query-before-test-2' => "INSERT INTO user (uid, username, email, firstname, lastname, ssn, password,addedtime, class) VALUES(9999 , 'hacker', 'hacker@student.his.se', 'tester', 'test', 00000000-0000, 'test',now(), WEBUG14h);",
        'query-after-test-1' => "DELETE FROM user WHERE username = 'test';",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/accessedService/addUser_ms.php',
        'service-data' => serialize(
            array( // Data that service needs to execute function
                'opt' => 'ADDUSR',
                'username' => 'brom',
                'password' => 'password',
                'courseid' => '999',
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

testHandler($testsData, true);