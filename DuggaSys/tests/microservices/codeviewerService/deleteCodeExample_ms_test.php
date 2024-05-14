<?php

include_once "../../../../Shared/test.php";

$testsData = array(
    'deleteCodeExample' => array(
        'expected-output' => '"deleted": true',

        'query-before-test-1' => "SELECT * FROM codeexample WHERE exampleid = ?;",
        'query-before-test-2' => "SELECT * FROM box WHERE exampleid = ?;",
        'query-before-test-3' => "SELECT * FROM impwordlist WHERE exampleid = ?;",
        'query-before-test-4' => "SELECT * FROM improw WHERE exampleid = ?;",
        'query-before-test-5' => "SELECT * FROM listentries WHERE lid = ?;",

        'query-after-test-1' => "INSERT INTO codeexample (exampleid) VALUES (1001);",
        'query-after-test-2' => "INSERT INTO box (exampleid) VALUES (1001);",
        'query-after-test-3' => "INSERT INTO impwordlist (exampleid) VALUES (1001);",
        'query-after-test-4' => "INSERT INTO improw (exampleid) VALUES (1001);",
        'query-after-test-5' => "INSERT INTO listentries (lid) VALUES (301);",

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
