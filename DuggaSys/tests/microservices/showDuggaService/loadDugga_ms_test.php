<?php

include "../../../../Shared/test.php";

$testsData = array(

    'load dugga' => array(
        'expected-output' => '{"debug":"[Guest] Missing hash\/password\/variant!","param":"{}","answer":"UNK","danswer":"UNK","score":0,"highscoremode":"","grade":"UNK","submitted":"","marked":"","deadline":"UNK","release":"UNK","files":[],"userfeedback":"UNK","feedbackquestion":"UNK","variant":"UNK","ishashindb":false,"variantsize":"UNK","variantvalue":"UNK","password":"UNK","hashvariant":"UNK","isFileSubmitted":"UNK","isTeacher":0,"variants":[],"duggaTitle":"UNK","hash":"UNK","hashpwd":"UNK","opt":"UNK","link":"UNK"}',
        'query-before-test-1' => "INSERT INTO variant (param, variantanswer) VALUES ('{testparam}','{Variant}');",
        'query-before-test-2' => "INSERT INTO listentries (cid,vers, entryname, visible,creator) VALUES(1885,1337,'LDMOMENT',1,101);",
        'query-before-test-3' => "SELECT MAX(vid) AS vid FROM variant",
        'query-before-test-4' => "SELECT MAX(lid) AS moment FROM listentries",
        'variables-query-before-test-5' => "vid, moment",
        'query-before-test-5' => "INSERT INTO userAnswer (cid, variant, moment, hash) VALUES (1885, ?, ?, 'hnf3j58s');",
        'service' => 'http://localhost/LenaSYS/DuggaSys/showDuggaservice.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'username' => 'brom',
            'password' => 'password',
            'hash' => 'PWVykkqQ',
            'moment' => '2002',
            //'moment' => '<!query-before-test-4!><*[0]["moment"]*>',
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'none'
        )),
    ),
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON