<?php

//TEST FOR GET ACTIVE USERS

include "../../Shared/test.php";

//FIX THIS: Gather expected output by triggering corresponding opt and inspect the payload
//How to trigger opt UPDATEAU???
$testsData = array(
    'Get active users' => array(
        'expected-output' => '{"debug":"[Guest] Missing hash\/password\/variant!","param":"{}","answer":"UNK","danswer":"UNK","score":0,"highscoremode":"","grade":"UNK","submitted":"","marked":"","deadline":"UNK","release":"UNK","files":[],"userfeedback":"UNK","feedbackquestion":"UNK","variant":"UNK","ishashindb":false,"variantsize":"UNK","variantvalue":"UNK","password":"UNK","hashvariant":"UNK","isFileSubmitted":"UNK","isTeacher":0,"variants":[],"duggaTitle":"UNK","hash":"UNK","hashpwd":"UNK","opt":"UNK","link":"UNK"}',
        'query-before-test-1' => "INSERT INTO groupdugga(hash, active_users) VALUES ('hnf3j58s', 5);",
        'query-after-test-1' => "DELETE FROM groupdugga WHERE hash = 'hnf3j58s';",
        'service' => 'http://localhost/LenaSYS/DuggaSys/showDuggaservice.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'opt' => 'UPDATEAU',
            'hash' => 'hnf3j58s'
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'none'
        )),
    )
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON

?>