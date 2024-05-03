<?php

include_once "../../../../Shared/test.php";

$testsData = array(
    'deleteCodeExample' => array(
        'expected-output' => '"deleted": true',

        'query-after-test-1' => "INSERT INTO improw (exampleid) VALUES (:exampleid);",
        'query-after-test-2' => "INSERT INTO box (exampleid) VALUES (:exampleid);",
        'query-after-test-3' => "INSERT INTO impwordlist (exampleid) VALUES (:exampleid);",
        'query-after-test-4' => "INSERT INTO codeexample (exampleid) VALUES (:exampleid);",
        'query-after-test-5' => "INSERT INTO listentries (lid) VALUES (:lid);",

        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/accessedService/deleteCodeExample_ms.php',
        'service-data' => serialize(
            array(
                'username' => 'brom',
                'password' => 'password', 
                'opt' => 'DELETEEXAMPLE',
                'exampleid' => '1001', 
                'boxid' => '501',
                'lid' => '301' 
            )
        ),
        'filter-output' => serialize(
            array(
                'none'
            )
        ),
    ),
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = pretty print (HTML), false = raw JSON
