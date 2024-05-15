<?php

include_once "../../../../Shared/test.php";

$testsData = array(
    'createDuggaVariant_ms' => array(
        'expected-output' => '{"entries":[{"variants":[{"param":"{question\"What is the correct answer?: A\"Answer1: B\"Answer2: C\"Answer3}","variantanswer":"Answer3"}]}]}',
        
        'query-before-test-1' => "INSERT INTO quiz (id, cid, qname, vers) VALUES (2147483645, 1885, 'createDuggaVariantTestQuiz', 1337)",
        'query-after-test-1' => "DELETE FROM variant WHERE quizID = 2147483645",
        'query-after-test-2' => "DELETE FROM quiz WHERE id = 2147483645",

        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/duggaedService/createDuggaVariant_ms.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'ADDVARI',
                'cid' => 1885,
                'qid' => 2147483645,
                'disabled' => 0,
                'parameter' =>'{question"What is the correct answer?: A"Answer1: B"Answer2: C"Answer3}',
                'variantanswer' => 'Answer3',
                'coursevers' => 1337,
                'username' => 'brom',
                'password' => 'password'
            )
        ),
        'filter-output' => serialize(
            array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'entries' => array(
                    'variants' => array(
                        'param',
                        'variantanswer'
                    )
                )
            )
        ),
    ),
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON