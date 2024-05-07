<?php

include "../../../../Shared/test.php";

$testsData = array(
    'delete variant' => array(
        'expected-output' => '{"debug":"NONE!","writeaccess":true,"coursecode":"IT118G","coursename":"Webbutveckling - datorgrafik","variants":["{\"danswer\":\"00000010 0 2\"}","{\"danswer\":\"00000101 0 5\"}","{\"danswer\":\"00002 0 A\"}","{\"danswer\":\"00011001 1 9\"}","{\"danswer\":\"02111 5 7\"}","{\"danswer\":\"11000000 C 0\"}","{Variant}","{Variant}","{Variant}","{Variant}","{Variant}","{Variant}","{Variant}","{Variant}","{Variant}","{Variant}","B","A","C","A","","",""]}',
        'query-before-test-1' => "INSERT INTO quiz(id, cid,vers, qname) VALUES (333,1885,1337,'testQuiz')",
        'query-before-test-2' => "INSERT INTO variant(quizID, param, variantanswer) VALUES (333,'param','delvariAnswer')",
        'query-before-test-3' => "SELECT vid FROM variant WHERE variantanswer = 'delvariAnswer'",
        'query-after-test-1' => "DELETE FROM quiz WHERE id = 333",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/duggaedService/deleteDuggaVariant_ms.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',
                'opt' => 'DELVARI',
                'cid' => 1885,
                'coursevers' => 1337,
                'vid' => '<!query-before-test-3!><*[0]["vid"]*>',
            )
        ),
        'filter-output' => serialize(
            array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'debug',
                'writeaccess',
                'coursename',
                'coursecode',
                'variants',
            )
        ),
    ),
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON