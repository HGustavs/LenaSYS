<?php

include "../../../../Shared/test.php";

$testsData = array(
    'delete variant' => array(
        'expected-output' => '{"variants":["othervariant"]}',
        'query-before-test-1' => "INSERT INTO quiz(id, cid,vers, qname) VALUES (333,1885,1337,'testQuiz')",
        'query-before-test-2' => "INSERT INTO variant(quizID, param, variantanswer) VALUES (333,'param','deletevariant');",
        'query-before-test-3' => "INSERT INTO variant(quizID, param, variantanswer) VALUES (333,'param','othervariant');",
        'query-before-test-4' => "SELECT vid FROM variant WHERE variantanswer = 'deletevariant'",
        'query-after-test-1' => "DELETE FROM variant WHERE variantanswer = 'othervariant'",
        'query-after-test-2' => "DELETE FROM quiz WHERE id = 333",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/duggaedService/deleteDuggaVariant_ms.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',
                'opt' => 'DELVARI',
                'cid' => 1885,
                'coursevers' => 1337,
                'vid' => '<!query-before-test-4!><*[0]["vid"]*>',
            )
        ),
        'filter-output' => serialize(
            array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'variants',
            )
        ),
    ),
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON