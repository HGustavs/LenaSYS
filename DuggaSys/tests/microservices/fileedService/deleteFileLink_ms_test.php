<?php

include_once "../../../../Shared/test.php";

$testsData = array(
    
    'deleteDugga_ms' => array(
        'expected-output' => '{"debug":[{"The file was deleted"}]}',
        
        'query-before-test-1' => "INSERT INTO fileLink () VALUES ();",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/fileedService/deleteFileLink_ms.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'DELFILE',
                // 'cid' => 1885,
                // 'qid' => 2147483647,
                // 'coursevers' => 1337,
                'username' => 'brom',
                'password' => 'password'
            )
        ),
        'filter-output' => serialize(
            array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'entries' => array(
                    'qname'
                ),
            )
        ),
    ),
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON