<?php

include_once "../../../../Shared/test.php";

$testsData = array(
    
    'deleteDugga_ms' => array(
        'expected-output' => '{"entries":[{"qname":"deleteDuggaTest"}]}',
        
        'query-before-test-1' => "INSERT INTO quiz (id, cid, qname, vers) VALUES (99999, 1885, 'deleteDuggaTest', 1337);",
        'query-before-test-2' => "INSERT INTO quiz (id, cid, qname, vers) VALUES (99999, 1885, 'IShouldBeDeleted', 1337);",
        'query-after-test-1' => "DELETE FROM quiz WHERE id = 99999;",
        'query-after-test-2' => "DELETE FROM quiz WHERE id = 99999;", // In case the microservice fails
        
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/duggaedService/deleteDugga_ms.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'DELDU',
                'cid' => 1885,
                'qid' => 99999,
                'coursevers' => 1337,
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