<?php

include_once "../../../../Shared/test.php";

$testsData = array(

    'deleteFileLink_ms' => array(
        'expected-output' => '{"debug":"NONE!"}',

        'query-before-test-1' => "INSERT INTO fileLink (fileid, filename, kind, cid, uploaddate) VALUES (9999, 'testFile.html', 1, 1885, NOW())",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/fileedService/deleteFileLink_ms.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'DELFILE',
                'fid' => 9999,
                'cid' => '1885',
                'kind' => 1,
                'filename' => 'testFile.html',
                'username' => 'brom',
                'password' => 'password'
            )
        ),
        'filter-output' => serialize(
            array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'debug'
            )
        ),
    ),
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON