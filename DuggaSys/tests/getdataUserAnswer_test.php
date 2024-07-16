<?php


    include "../../Shared/test.php";


    $testsData = array(

        'get data from userAnswer (student)' => array(

            'expected-output' => '{"debug":"[Guest] Missing hash\/password\/variant!","param":"{}","answer":"UNK","danswer":"UNK","score":0,"highscoremode":"","grade":"UNK","submitted":"","marked":"","deadline":"UNK","release":"UNK","files":[],"userfeedback":"UNK","feedbackquestion":"UNK","variant":"UNK","ishashindb":false,"variantsize":"UNK","variantvalue":"UNK","password":"UNK","hashvariant":"UNK","isFileSubmitted":"UNK","isTeacher":0,"variants":[],"duggaTitle":"UNK","hash":"UNK","hashpwd":"UNK","opt":"UNK","link":"UNK"}',
            'query-before-test-1' => "INSERT INTO course(cid, creator) VALUES (9999, 1);",
            'query-before-test-2' => "INSERT INTO listentries(cid,entryname,link,kind,pos,creator,visible,vers,gradesystem,highscoremode,feedbackenabled,feedbackquestion) VALUES(9999, 'Inserttobedeleted', 'UNK', 4, 12, 2, 1, 1337, 1, 1, 0, 'UNK');",
            'query-before-test-3' => "SELECT MAX(lid) AS listentries FROM listentries",
            'variables-query-before-test-4' => "moment",
            'query-before-test-4' => "INSERT INTO userAnswer (hash, password, variant, cid, moment) VALUES('ghj1jfg2', 'dsa4cxz5', 13, 9999, ?);",
            'query-after-test-1' => "DELETE FROM userAnswer WHERE hash = 'ghj1jfg2';",
            'query-after-test-2' => "DELETE FROM listentries WHERE cid = 9999;",
            'query-after-test-3' => "DELETE FROM course WHERE cid = 9999;",
            'service' => 'http://localhost/LenaSYS/DuggaSys/getdataUserAnswer.php', // The service URL
            'service-data' => serialize(array( // Data to be sent to the service
                'opt' => 'SAVDU',
                'hash' => 'ghj1jfg2',
                'username' => 'a99marjo',
                'password' => 'password',
                'moment' => '<!query-before-test-3!><*[0]["listentries"]*>'
            )),
            'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )),
        ),

    );

    testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON
?>
