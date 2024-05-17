<?php

include "../../../../Shared/test.php";

$testsData = array(
    //------------------------------------------------------------------------------------------
    // This tests the microservice refreshCheck_ms.php
    //------------------------------------------------------------------------------------------
    'refreshCheck_ms' => array(
        'expected-output' => '{"cid":"1885","user":"1"}',
        'query-after-test-1' => "INSERT into course (cid, updated, courseCode) VALUES ('1885', NOW(),'hnf3j58s');",
        'query-after-test-1' => "DELETE FROM course WHERE hash = 'hnf3j58s';",

        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/gitCommitService/refreshCheck_ms.php',
        'service-data' => serialize(
            array( // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',
                'cid' => '1885',
                'user' => '1',
                'hash' => 'hnf3j58s',

            ) 
        ),
        'filter-output' => serialize(
            array( // Filter what output to use in assert test, use none to use all ouput from service
                'none',
            )
        ),
    ),
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON