<?php

include "../../../../Shared/test.php";

$testsData = array(

    'Save new dugga' => array(
        'expected-output' => '{"debug":"[Guest] Missing hash\/password\/variant!","param":"{}","answer":"UNK","danswer":"UNK","score":0,"highscoremode":"","grade":"UNK","submitted":"","marked":"","deadline":"UNK","release":"UNK","files":[],"userfeedback":"UNK","feedbackquestion":"UNK","variant":"UNK","ishashindb":false,"variantsize":"UNK","variantvalue":"UNK","password":"UNK","hashvariant":"UNK","isFileSubmitted":"UNK","isTeacher":0,"variants":[],"duggaTitle":"UNK","hash":"UNK","hashpwd":"UNK","opt":"UNK","link":"UNK"}',
        'query-before-test-1' => "INSERT INTO course(cid, creator) VALUES (9999, 1);",
        'query-before-test-2' => "INSERT INTO listentries(cid,entryname,link,kind,pos,creator,visible,vers,gradesystem,highscoremode,feedbackenabled,feedbackquestion) VALUES (9999, 'Inserttobedeleted', 'UNK', 4, 12, 2, 1, 1337, 1, 1, 0, 'UNK');",
        'query-before-test-3' => "SELECT MAX(lid) AS listentries FROM listentries",
        'query-after-test-1' => "DELETE FROM userAnswer ORDER BY aid DESC LIMIT 1;",
        'query-after-test-2' => "DELETE FROM listentries WHERE cid = 9999;",
        'query-after-test-3' => "DELETE FROM course WHERE cid = 9999;",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/showDuggaService/saveDugga_ms.php',
        'service-data' => serialize(array( //Data that service needs to execute function
            'username' => 'a87antal',
            'password' => 'password',
            'opt' => 'SAVDU',
            'courseid' => '9999',
            'coursevers' => '52432',
            'duggaid' => '1',
            'moment' => '<!query-before-test-3!><*[0]["listentries"]*>',
            'variant' => '3',
            'hash' => 'UNK',
            'password' => 'UNK',
            'answer' => 'NULL',
            'did' => 3
        )),
        'filter-output' => serialize(array( //Filter what output to use in assert test, use none to use all ouput from service
            'none'
        )),
    ),

    'Save updated dugga' => array(
        'expected-output' => '{"debug":"[Guest] Missing hash\/password\/variant!","param":"{}","answer":"UNK","danswer":"UNK","score":0,"highscoremode":"","grade":"UNK","submitted":"","marked":"","deadline":"UNK","release":"UNK","files":[],"userfeedback":"UNK","feedbackquestion":"UNK","variant":"UNK","ishashindb":false,"variantsize":"UNK","variantvalue":"UNK","password":"UNK","hashvariant":"UNK","isFileSubmitted":"UNK","isTeacher":0,"variants":[],"duggaTitle":"UNK","hash":"UNK","hashpwd":"UNK","opt":"UNK","link":"UNK"}',
        'query-before-test-1' => "INSERT INTO course(cid, creator) VALUES (9999, 1);",
        'query-before-test-2' => "INSERT INTO listentries(cid,entryname,link,kind,pos,creator,visible,vers,gradesystem,highscoremode,feedbackenabled,feedbackquestion) VALUES(9999, 'Inserttobedeleted', 'UNK', 4, 12, 2, 1, 1337, 1, 1, 0, 'UNK');",
        'query-before-test-3' => "SELECT MAX(lid) AS listentries FROM listentries",
        'variables-query-before-test-4' => "moment",
        'query-before-test-4' => "INSERT INTO userAnswer(cid,hash,password,moment) VALUES(9999, 'dfg4zxc5', 'asdfasdf', ?);",
        'query-after-test-1' => "DELETE FROM userAnswer ORDER BY aid DESC LIMIT 1;",
        'query-after-test-2' => "DELETE FROM listentries WHERE cid = 9999;",
        'query-after-test-3' => "DELETE FROM course WHERE cid = 9999;",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/showDuggaService/saveDugga_ms.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'username' => 'a87antal',
            'password' => 'password',
            'opt' => 'SAVDU',
            'hash' => 'dfg4zxc5',
            'password' => 'asdfasdf',
            'answer' => 'im updated',
            'moment' => '<!query-before-test-3!><*[0]["listentries"]*>'
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'none'
        )),
    ),
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON

?>