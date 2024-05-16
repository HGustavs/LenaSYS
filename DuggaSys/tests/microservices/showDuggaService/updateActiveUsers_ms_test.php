<?php

include "../../../../Shared/test.php";

$testsData = array(
    //------------------------------------------------------------------------------------------
    // This tests the microservice updateActiveUsers_ms 
    //------------------------------------------------------------------------------------------
    'updateActiveUsers_ms' => array(
        'expected-output' => '{"answer":"UNK","danswer":"UNK","score":0,"highscoremode":"","grade":"UNK","submitted":"","marked":"","deadline":"UNK","release":"UNK","files":[],"userfeedback":"UNK","feedbackquestion":"UNK","variant":"UNK","ishashindb":false,"variantsize":"UNK","variantvalue":"UNK","password":"UNK","hashvariant":"UNK","isFileSubmitted":"UNK","isTeacher":1,"variants":[],"duggaTitle":null,"hash":"UNK","hashpwd":"UNK","opt":"UNK","link":null,"activeusers":1}',
        'query-after-test-1' => "DELETE FROM groupdugga WHERE hash = '46dee064';",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/showDuggaService/updateActiveUsers_ms.php',
        'service-data' => serialize(
            array( // Data that service needs to execute function
                'opt' => 'UPDATEAU',
                'username' => 'brom',
                'password' => 'password',
                'courseid' => '2',
                'coursevers' => '97732',
                'hash' => 'hjk4ert6',
                'AUtoken' => '999',
                'danswer' => 'UNK',
                'score' => '0',
                'hash' => 'hjk4ert6',
                'grade'=> 'UNK',
                'submitted'=> '',
                'marked'=> '',
                'deadline'=> 'UNK',
                'release'=> 'UNK',
                'files'=> '[]',
                'userfeedback'=> 'UNK',
                'feedbackquestion'=> 'UNK',
                'variant'=> 'UNK',
                'activeusers'=> '1'
            )
        ),
        'filter-output' => serialize(
            array( // Filter what output to use in assert test, use none to use all ouput from service
                             'none',

            )
        ),
    ),
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON