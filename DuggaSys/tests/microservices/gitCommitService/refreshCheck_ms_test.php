<?php

include "../../../../Shared/test.php";

$testsData = array(
    //------------------------------------------------------------------------------------------
    // This tests the microservice refreshCheck_ms.php
    //------------------------------------------------------------------------------------------
    'refreshCheck_ms' => array(
        'expected-output' => '{"cid":"1885","user":"1"}',
        'query-before-test' => "INSERT INTO course (cid, coursecode, coursename, created, creator, visibility, updated, activeversion) VALUES ('1885', 'Gg133g', 'Testing-Course', '2024-05-06 14:24:03', '1', '1', '2024-05-17 15:23:51', '1337');",
        'query-after-test-1' => "DELETE FROM course WHERE cid = '1885';",

        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/gitCommitService/refreshCheck_ms.php',
        'service-data' => serialize(
            array( // Data that service needs to execute function
                'cid' => '1885',
                'user' => '1',
                'hash' => 'hnf3j58s'
            ) 
        ),
        'filter-output' => serialize(
            array( // Filter what output to use in assert test, use none to use all output from service
                'cid',
                'user',
            )
        ),
    ),
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON
