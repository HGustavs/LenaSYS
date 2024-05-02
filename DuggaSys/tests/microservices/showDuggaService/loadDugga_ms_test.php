<?php

include "../../../../Shared/test.php";

$testsData = array(

    'load dugga' => array(
        'expected-output' => '{"debug":"[Guest] Missing hash\/password\/variant!","param":"{}","answer":"UNK","danswer":"UNK","score":0,"highscoremode":"","grade":"UNK","submitted":"","marked":"","deadline":"UNK","release":"UNK","files":[],"userfeedback":"UNK","feedbackquestion":"UNK","variant":"UNK","ishashindb":false,"variantsize":"UNK","variantvalue":"UNK","password":"UNK","hashvariant":"UNK","isFileSubmitted":"UNK","isTeacher":0,"variants":[],"duggaTitle":"UNK","hash":"UNK","hashpwd":"UNK","opt":"UNK","link":"UNK"}',
        'query-before-test-1' => "INSERT INTO variant (vid,param, variantanswer) VALUES (991,'{testparam}','{Variant}');",
        'query-before-test-2' => "INSERT INTO listentries (lid,cid,vers, entryname, visible,creator) VALUES(9991,1885,1337,'LDMOMENT',1,101);",
        'query-before-test-3' => "INSERT INTO userAnswer (cid, variant, moment, hash) VALUES (1885, 991, 9991, 'hnf3j58s');",
        'query-after-test-1' => "DELETE FROM userAnswer WHERE hash = 'hnf3j58s';",
        'query-after-test-2' => "DELETE FROM variant WHERE vid = 991;",
        'query-after-test-3' => "DELETE FROM listentries WHERE lid = 9991;",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/showDuggaService/loadDugga_ms.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'username' => 'brom',
            'password' => 'password',
            'hash' => 'hnf3j58s',
            'moment' => '9991',
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'none'
        )),
    ),
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON