<?php
include_once "../../../../Shared/test.php";

$testsData = array(
    'updateDuggaVariant_ms' => array(
        'expected-output' => '{"variants":["Answer 123"]}',

        'query-before-test-1' => "INSERT INTO quiz (cid, qname, vers) VALUES (1885, 'toBeDeleted', 1337);",
        'query-before-test-2' => "SELECT MAX(id) AS qid FROM quiz",
        'variables-query-before-test-3' => "qid",
        'query-before-test-3' => "INSERT INTO variant (quizID, param, variantanswer, creator, disabled) VALUES (?, 'Empty', 'Answer 1', 101, 1);",
        'query-before-test-4' => "SELECT MAX(vid) AS vid FROM variant",
 
        'query-after-test-1' => "DELETE FROM quiz WHERE qname = 'toBeDeleted' AND cid = 1885", // Deleting the quiz also deletes the variant

        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/duggaedService/updateDuggaVariant_ms.php',
        'service-data' => serialize(
            array(
                'opt' => 'SAVVARI',
                'cid' => 1885,
                'coursevers' => 1337,
                'qid' => '<!query-before-test-2!> <*[0]["qid"]*>',
                'vid' => '<!query-before-test-4!> <*[0]["vid"]*>',
                'parameter' => 'Not empty',
                'variantanswer' => 'Answer 123',
                'disabled' => '0',
                'username' => 'brom',
                'password' => 'password'
            )
        ),
        // TODO: Update the filter-output after test.php allows double-nested arrays
        'filter-output' => serialize(
            array(
                'entries' => array(
                    'variants' => array(
                        'vid'=>"",
                        'param'=>"",
                        'variantanswer'=>"",
                        'disabled'=>""
                    )
                )
            )
        )
    ),
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON