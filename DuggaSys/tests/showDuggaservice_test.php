<?php

include "../../Shared/test.php";
/*Warning! No test works since showDugga doesn't work properly. Expected outputs in this document have not been fixed yet.*/

$testsData = array(

    // 'Get active users' => array(
    //     'expected-output' => '{"debug":"[Guest] Missing hash\/password\/variant!","param":"{}","answer":"UNK","danswer":"UNK","score":0,"highscoremode":"","grade":"UNK","submitted":"","marked":"","deadline":"UNK","release":"UNK","files":[],"userfeedback":"UNK","feedbackquestion":"UNK","variant":"UNK","ishashindb":false,"variantsize":"UNK","variantvalue":"UNK","password":"UNK","hashvariant":"UNK","isFileSubmitted":"UNK","isTeacher":0,"variants":[],"duggaTitle":"UNK","hash":"UNK","hashpwd":"UNK","opt":"UNK","link":"UNK"}',
    //     'query-before-test-1' => "INSERT INTO groupdugga(hash, active_users) VALUES ('hnf3j58s', 5);",
    //     'query-after-test-1' => "DELETE FROM groupdugga WHERE hash = 'hnf3j58s';",
    //     'service' => 'http://localhost/LenaSYS/DuggaSys/showDuggaservice.php',
    //     'service-data' => serialize(array( // Data that service needs to execute function
    //         'opt' => 'UPDATEAU',
    //         'hash' => 'hnf3j58s'
    //     )),
    //     'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
    //         'none'
    //     )),
    // ),
    // 'Create active users' => array(
    //     'expected-output' => '{"debug":"[Guest] Missing hash\/password\/variant!","param":"{}","answer":"UNK","danswer":"UNK","score":0,"highscoremode":"","grade":"UNK","submitted":"","marked":"","deadline":"UNK","release":"UNK","files":[],"userfeedback":"UNK","feedbackquestion":"UNK","variant":"UNK","ishashindb":false,"variantsize":"UNK","variantvalue":"UNK","password":"UNK","hashvariant":"UNK","isFileSubmitted":"UNK","isTeacher":0,"variants":[],"duggaTitle":"UNK","hash":"UNK","hashpwd":"UNK","opt":"UNK","link":"UNK"}',
    //     //Get newly added active users?
    //     'query-after-test-1' => "DELETE FROM groupdugga WHERE hash = 'tj7dh2nb';",
    //     'service' => 'http://localhost/LenaSYS/DuggaSys/showDuggaservice.php',
    //     'service-data' => serialize(array( // Data that service needs to execute function
    //         'opt' => 'UPDATEAU',
    //         'hash' => 'tj7dh2nb',
    //         'AUtoken' => '999'
    //     )),
    //     'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
    //         'none'
    //     )),
    // ),
    // 'update active users' => array(
    //     'expected-output' => '{"debug":"[Guest] Missing hash\/password\/variant!","param":"{}","answer":"UNK","danswer":"UNK","score":0,"highscoremode":"","grade":"UNK","submitted":"","marked":"","deadline":"UNK","release":"UNK","files":[],"userfeedback":"UNK","feedbackquestion":"UNK","variant":"UNK","ishashindb":false,"variantsize":"UNK","variantvalue":"UNK","password":"UNK","hashvariant":"UNK","isFileSubmitted":"UNK","isTeacher":0,"variants":[],"duggaTitle":"UNK","hash":"UNK","hashpwd":"UNK","opt":"UNK","link":"UNK"}',
    //     'query-before-test-1' => "INSERT INTO groupdugga(hash,active_users) VALUES('hjk4ert6', 52);",
    //     'query-after-test-1' => "DELETE FROM groupdugga WHERE hash = 'hjk4ert6';",
    //     'service' => 'http://localhost/LenaSYS/DuggaSys/showDuggaservice.php',
    //     'service-data' => serialize(array( // Data that service needs to execute function
    //         'opt' => 'UPDATEAU',
    //         'hash' => 'hjk4ert6',
    //         'AUtoken' => '9999'
    //     )),
    //     'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
    //         'none'
    //     )),
    // ),
    // 'get data from userAnswer (student)' => array(
    //     'expected-output' => '{"debug":"[Guest] Missing hash\/password\/variant!","param":"{}","answer":"UNK","danswer":"UNK","score":0,"highscoremode":"","grade":"UNK","submitted":"","marked":"","deadline":"UNK","release":"UNK","files":[],"userfeedback":"UNK","feedbackquestion":"UNK","variant":"UNK","ishashindb":false,"variantsize":"UNK","variantvalue":"UNK","password":"UNK","hashvariant":"UNK","isFileSubmitted":"UNK","isTeacher":0,"variants":[],"duggaTitle":"UNK","hash":"UNK","hashpwd":"UNK","opt":"UNK","link":"UNK"}',
    //     'query-before-test-1' => "INSERT INTO course(cid, creator) VALUES (9999, 1);",
    //     'query-before-test-2' => "INSERT INTO listentries(cid,entryname,link,kind,pos,creator,visible,vers,gradesystem,highscoremode,feedbackenabled,feedbackquestion) VALUES(9999, 'Inserttobedeleted', 'UNK', 4, 12, 2, 1, 1337, 1, 1, 0, 'UNK');",
    //     'query-before-test-3' => "SELECT MAX(lid) AS listentries FROM listentries",
    //     'variables-query-before-test-4' => "moment",
    //     'query-before-test-4' => "INSERT INTO userAnswer (hash, password, variant, cid, moment) VALUES('ghj1jfg2', 'dsa4cxz5', 13, 9999, ?);",
    //     'query-after-test-1' => "DELETE FROM userAnswer ORDER BY aid DESC LIMIT 1;",
    //     'query-after-test-2' => "DELETE FROM listentries WHERE cid = 9999;",
    //     'query-after-test-3' => "DELETE FROM course WHERE cid = 9999;",
    //     'service' => 'http://localhost/LenaSYS/DuggaSys/showDuggaservice.php',
    //     'service-data' => serialize(array( // Data that service needs to execute function
    //         'opt' => 'SAVDU',
    //         'hash' => 'ghj1jfg2',
    //         'username' => 'a99marjo',
    //         'password' => 'password',
    //         'moment' => '<!query-before-test-3!><*[0]["listentries"]*>'
    //     )),
    //     'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
    //         'none'
    //     )),
    // ),
    // 'get data from userAnswer (teacher)' => array(
    //     'expected-output' => '{"debug":"[Guest] Missing hash\/password\/variant!","param":"{}","answer":"UNK","danswer":"UNK","score":0,"highscoremode":"","grade":"UNK","submitted":"","marked":"","deadline":"UNK","release":"UNK","files":[],"userfeedback":"UNK","feedbackquestion":"UNK","variant":"UNK","ishashindb":false,"variantsize":"UNK","variantvalue":"UNK","password":"UNK","hashvariant":"UNK","isFileSubmitted":"UNK","isTeacher":0,"variants":[],"duggaTitle":"UNK","hash":"UNK","hashpwd":"UNK","opt":"UNK","link":"UNK"}',
    //     'query-before-test-1' => "INSERT INTO course(cid, creator) VALUES (9999, 1);",
    //     'query-before-test-2' => "INSERT INTO listentries(cid,entryname,link,kind,pos,creator,visible,vers,gradesystem,highscoremode,feedbackenabled,feedbackquestion) VALUES(9999, 'Inserttobedeleted', 'UNK', 4, 12, 2, 1, 1337, 1, 1, 0, 'UNK');",
    //     'query-before-test-3' => "SELECT MAX(lid) AS listentries FROM listentries",
    //     'variables-query-before-test-4' => "moment",
    //     'query-before-test-4' => "INSERT INTO userAnswer (hash, password, variant, cid, moment) VALUES('ghj1jfg2', 'dsa4cxz5', 13, 9999, ?);",
    //     'query-after-test-1' => "DELETE FROM userAnswer ORDER BY aid DESC LIMIT 1;",
    //     'query-after-test-2' => "DELETE FROM listentries WHERE cid = 9999;",
    //     'query-after-test-3' => "DELETE FROM course WHERE cid = 9999;",
    //     'service' => 'http://localhost/LenaSYS/DuggaSys/showDuggaservice.php',
    //     'service-data' => serialize(array( // Data that service needs to execute function
    //         'opt' => 'SAVDU',
    //         'hash' => 'ghj1jfg2',
    //         'username' => 'stei',
    //         'password' => 'password',
    //         'moment' => '<!query-before-test-3!><*[0]["listentries"]*>'
    //     )),
    //     'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
    //         'none'
    //     )),
    // ),
    // 'update submitted dugga' => array(
    //     'expected-output' => '{"debug":"[Guest] Missing hash\/password\/variant!","param":"{}","answer":"UNK","danswer":"UNK","score":0,"highscoremode":"","grade":"UNK","submitted":"","marked":"","deadline":"UNK","release":"UNK","files":[],"userfeedback":"UNK","feedbackquestion":"UNK","variant":"UNK","ishashindb":false,"variantsize":"UNK","variantvalue":"UNK","password":"UNK","hashvariant":"UNK","isFileSubmitted":"UNK","isTeacher":0,"variants":[],"duggaTitle":"UNK","hash":"UNK","hashpwd":"UNK","opt":"UNK","link":"UNK"}',
    //     'query-before-test-1' => "INSERT INTO course(cid, creator) VALUES (9999, 1);",
    //     'query-before-test-2' => "INSERT INTO listentries(cid,entryname,link,kind,pos,creator,visible,vers,gradesystem,highscoremode,feedbackenabled,feedbackquestion) VALUES(9999, 'Inserttobedeleted', 'UNK', 4, 12, 2, 1, 1337, 1, 1, 0, 'UNK');",
    //     'query-before-test-3' => "SELECT MAX(lid) AS listentries FROM listentries",
    //     'variables-query-before-test-4' => "moment",
    //     'query-before-test-4' => "INSERT INTO userAnswer(cid,hash,password,moment) VALUES(9999, 'dfg4zxc5', 'asdfasdf', ?);",
    //     'query-after-test-1' => "DELETE FROM userAnswer ORDER BY aid DESC LIMIT 1;",
    //     'query-after-test-2' => "DELETE FROM listentries WHERE cid = 9999;",
    //     'query-after-test-3' => "DELETE FROM course WHERE cid = 9999;",
    //     'service' => 'http://localhost/LenaSYS/DuggaSys/showDuggaservice.php',
    //     'service-data' => serialize(array( // Data that service needs to execute function
    //         'opt' => 'SAVDU',
    //         'hash' => 'dfg4zxc5',
    //         'haspwd' => 'asdfasdf',
    //         'answer' => 'im updated',
    //         'moment' => '<!query-before-test-3!><*[0]["listentries"]*>'
    //     )),
    //     'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
    //         'none'
    //     )),
    // ),
    // 'submit dugga' => array(
    //     'expected-output' => '{"debug":"[Guest] Missing hash\/password\/variant!","param":"{}","answer":"UNK","danswer":"UNK","score":0,"highscoremode":"","grade":"UNK","submitted":"","marked":"","deadline":"UNK","release":"UNK","files":[],"userfeedback":"UNK","feedbackquestion":"UNK","variant":"UNK","ishashindb":false,"variantsize":"UNK","variantvalue":"UNK","password":"UNK","hashvariant":"UNK","isFileSubmitted":"UNK","isTeacher":0,"variants":[],"duggaTitle":"UNK","hash":"UNK","hashpwd":"UNK","opt":"UNK","link":"UNK"}',
    //     'query-before-test-1' => "INSERT INTO course(cid, creator) VALUES (9999, 1);",
    //     'query-before-test-2' => "INSERT INTO listentries(cid,entryname,link,kind,pos,creator,visible,vers,gradesystem,highscoremode,feedbackenabled,feedbackquestion) VALUES (9999, 'Inserttobedeleted', 'UNK', 4, 12, 2, 1, 1337, 1, 1, 0, 'UNK');",
    //     'query-before-test-3' => "SELECT MAX(lid) AS listentries FROM listentries",
    //     'variables-query-before-test-4' => "moment",
    //     'query-after-test-1' => "DELETE FROM userAnswer ORDER BY aid DESC LIMIT 1;",
    //     'query-after-test-2' => "DELETE FROM listentries WHERE cid = 9999;",
    //     'query-after-test-3' => "DELETE FROM course WHERE cid = 9999;",
    //     'service' => 'http://localhost/LenaSYS/DuggaSys/showDuggaservice.php',
    //     'service-data' => serialize(array( // Data that service needs to execute function
    //         'opt' => 'SAVDU',
    //         'cid' => '9999',
    //         'coursevers' => '52432',
    //         'duggaid' => '1',
    //         'moment' => '<!query-before-test-3!><*[0]["listentries"]*>',
    //         'variant' => '3',
    //         'hash' => 'ghj1ghj2',
    //         'haspwd' => 'asddasdd',
    //         'answer' => 'NULL'
    //     )),
    //     'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
    //         'none'
    //     )),
    // ),

    /* This test doesn't work.
    'super-view data from useranswer on hash (teacher)' => array(
        'expected-output' => '{"debug":"[Guest] Missing hash\/password\/variant!","param":"{}","answer":"UNK","danswer":"UNK","score":0,"highscoremode":"","grade":"UNK","submitted":"","marked":"","deadline":"UNK","release":"UNK","files":[],"userfeedback":"UNK","feedbackquestion":"UNK","variant":"UNK","ishashindb":false,"variantsize":"UNK","variantvalue":"UNK","password":"UNK","hashvariant":"UNK","isFileSubmitted":"UNK","isTeacher":0,"variants":[],"duggaTitle":"UNK","hash":"UNK","hashpwd":"UNK","opt":"UNK","link":"UNK"}',
        'query-before-test-1' => "INSERT INTO course(cid, creator) VALUES (9999, 1);",
        'query-before-test-2' => "INSERT INTO listentries(cid,entryname,link,kind,pos,creator,visible,vers,gradesystem,highscoremode,feedbackenabled,feedbackquestion) VALUES (9999, 'Inserttobedeleted', 'UNK', 4, 12, 2, 1, 1337, 1, 1, 0, 'UNK');",
        'query-before-test-3' => "SELECT MAX(lid) FROM listentries",
        'query-before-test-4' => "INSERT INTO userAnswer(cid,hash,password,moment) VALUES(9999,'dfg4zxc5','asdfasdf',?);",
        'query-after-test-1' => "DELETE FROM userAnswer ORDER BY aid DESC LIMIT 1;",
        'query-after-test-2' => "DELETE FROM listentries WHERE cid = 9999;",
        'query-after-test-3' => "DELETE FROM course WHERE cid = 9999;",

        'service' => 'http://localhost/LenaSYS/DuggaSys/showDuggaservice.php',

        'service' => 'localhost/LenaSYS/DuggaSys/showDuggaservice.php',

        'service-data' => serialize(array( // Data that service needs to execute function
            'hash' => 'dfg4zxc5'
            'username' => 'stei',
            'password' => 'password',
            'moment' => '<!query-before-test3!> <*[0][listentries]*>'
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'none'
        )),
    ),*/

    // 'super-view data from useranswer on moment (teacher)' => array(
    //     'expected-output' => '{"debug":"[Guest] Missing hash\/password\/variant!","param":"{}","answer":"UNK","danswer":"UNK","score":0,"highscoremode":"","grade":"UNK","submitted":"","marked":"","deadline":"UNK","release":"UNK","files":[],"userfeedback":"UNK","feedbackquestion":"UNK","variant":"UNK","ishashindb":false,"variantsize":"UNK","variantvalue":"UNK","password":"UNK","hashvariant":"UNK","isFileSubmitted":"UNK","isTeacher":0,"variants":[],"duggaTitle":"UNK","hash":"UNK","hashpwd":"UNK","opt":"UNK","link":"UNK"}',
    //     'query-before-test-1' => "INSERT INTO course(cid, creator) VALUES (9999, 1);",
    //     'query-before-test-2' => "INSERT INTO listentries(cid,entryname,link,kind,pos,creator,visible,vers,gradesystem,highscoremode,feedbackenabled,feedbackquestion) VALUES (9999, 'Inserttobedeleted', 'UNK', 4, 12, 2, 1, 1337, 1, 1, 0, 'UNK');",
    //     'query-before-test-3' => "SELECT MAX(lid) AS listentries FROM listentries",
    //     'variables-query-before-test-4' => "moment",
    //     'query-after-test-1' => "DELETE FROM listentries WHERE cid = 9999;",
    //     'query-after-test-2' => "DELETE FROM course WHERE cid = 9999;",
    //     'service' => 'http://localhost/LenaSYS/DuggaSys/showDuggaservice.php',
    //     'service-data' => serialize(array( // Data that service needs to execute function
    //         'username' => 'stei',
    //         'password' => 'password',
    //         'moment' => '<!query-before-test-3!><*[0]["listentries"]*>'
    //     )),
    //     'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
    //         'none'
    //     )),
    // ),
    // 'super-view data on quizname (teacher)' => array(
    //     'expected-output' => '{"debug":"[Guest] Missing hash\/password\/variant!","param":"{}","answer":"UNK","danswer":"UNK","score":0,"highscoremode":"","grade":"UNK","submitted":"","marked":"","deadline":"UNK","release":"UNK","files":[],"userfeedback":"UNK","feedbackquestion":"UNK","variant":"UNK","ishashindb":false,"variantsize":"UNK","variantvalue":"UNK","password":"UNK","hashvariant":"UNK","isFileSubmitted":"UNK","isTeacher":0,"variants":[],"duggaTitle":"UNK","hash":"UNK","hashpwd":"UNK","opt":"UNK","link":"UNK"}',
    //     'query-before-test-1' => "INSERT INTO course(cid, creator) VALUES (9999, 1);",
    //     'query-before-test-2' => "INSERT INTO listentries(cid,entryname,link,kind,pos,creator,visible,vers,gradesystem,highscoremode,feedbackenabled,feedbackquestion) VALUES (9999, 'Inserttobedeleted', 'UNK', 4, 12, 2, 1, 1337, 1, 1, 0, 'UNK');",
    //     'query-before-test-3' => "SELECT MAX(lid) AS listentries FROM listentries",
    //     'query-after-test-1' => "DELETE FROM listentries WHERE cid = 9999;",
    //     'query-after-test-2' => "DELETE FROM course WHERE cid = 9999;",
    //     'service' => 'http://localhost/LenaSYS/DuggaSys/showDuggaservice.php',
    //     'service-data' => serialize(array( // Data that service needs to execute function
    //         'username' => 'stei',
    //         'password' => 'password',
    //         'moment' => '<!query-before-test3!> <*[0]["listentries"]*>'
    //     )),
    //     'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
    //         'none'
    //     )),
    // ),
    'view data on userAnswer (teacher)' => array(
        'expected-output' => '{"debug":"NONE!","param":"{\"tal\":\"10\"}","answer":"an answer","danswer":"{\"danswer\":\"00002 0 A\"}","score":0,"highscoremode":"","grade":"UNK","submitted":"","marked":"","deadline":"UNK","release":"UNK","files":[],"userfeedback":"UNK","feedbackquestion":"UNK","variant":"UNK","ishashindb":false,"variantsize":"UNK","variantvalue":"UNK","password":"password","hashvariant":"UNK","isFileSubmitted":"UNK","isTeacher":1,"variants":[],"duggaTitle":"Inserttobedeleted","hash":null,"hashpwd":null,"opt":"UNK","link":"https:\/\/localhost\/sh\/?s="}',
        'query-before-test-1' => "INSERT INTO course(cid, creator) VALUES (9999, 1);",
        'query-before-test-2' => "INSERT INTO listentries(cid, entryname, link, kind, pos, creator, visible, vers, gradesystem, highscoremode, feedbackenabled, feedbackquestion) VALUES (9999, 'Inserttobedeleted', 'UNK', 4, 12, 2, 1, 1337, 1, 1, 0, 'UNK');",
        'query-before-test-3' => "INSERT INTO quiz(cid) VALUES (9999);",
        'query-before-test-4' => "SELECT MAX(id) AS did FROM quiz",
        'query-before-test-5' => "SELECT MAX(lid) AS moment FROM listentries",
        'variables-query-before-test-6' => "did, moment",
        'query-before-test-6' => "INSERT INTO userAnswer (cid, quiz, variant, moment, useranswer, submitted, marked, vers, score, hash, password) VALUES(9999, ?, 3, ?, 'an answer', '2024-04-15 14:00:00', '2024-04-15 14:30:00', 1337, '0', 'ghj1ghj2', 'asddasdd');",
        'query-after-test-1' => "DELETE FROM userAnswer ORDER BY aid DESC LIMIT 1;",
        'query-after-test-2' => "DELETE FROM listentries WHERE cid = 9999;",
        'query-after-test-3' => "DELETE FROM course WHERE cid = 9999;",
        'query-after-test-4' => "DELETE FROM quiz WHERE cid = 9999;",
        'service' => 'http://localhost/LenaSYS/DuggaSys/showDuggaservice.php',
        'service-data' => serialize(
            array( 
                // Data that service needs to execute function
                'hash' => 'ghj1ghj2',
                'hashpwd' => 'asddasdd',
                'username' => 'stei',
                'password' => 'password',
                'courseid' => 9999,
                'coursevers' => 1337,
                'did' => '<!query-before-test-4!> <*[0]["did"]*>',
                'moment' => '<!query-before-test-5!> <*[0]["moment"]*>'
            )
        ),
        'filter-output' => serialize(
            array( 
                // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )
        ),
    ),
    // 'super-view data on quizname (teacher)' => array(
    //     'expected-output' => '{"debug":"[Guest] Missing hash\/password\/variant!","param":"{}","answer":"UNK","danswer":"UNK","score":0,"highscoremode":"","grade":"UNK","submitted":"","marked":"","deadline":"UNK","release":"UNK","files":[],"userfeedback":"UNK","feedbackquestion":"UNK","variant":"UNK","ishashindb":false,"variantsize":"UNK","variantvalue":"UNK","password":"UNK","hashvariant":"UNK","isFileSubmitted":"UNK","isTeacher":0,"variants":[],"duggaTitle":"UNK","hash":"UNK","hashpwd":"UNK","opt":"UNK","link":"UNK"}',
    //     'query-before-test-1' => "INSERT INTO course(cid, creator) VALUES (9999, 1);",
    //     'query-before-test-2' => "INSERT INTO listentries(cid,entryname,link,kind,pos,creator,visible,vers,gradesystem,highscoremode,feedbackenabled,feedbackquestion) VALUES (9999, 'Inserttobedeleted', 'UNK', 4, 12, 2, 1, 1337, 1, 1, 0, 'UNK');",
    //     'query-before-test-3' => "SELECT MAX(lid) AS listentries FROM listentries",
    //     'variables-query-before-test-4' => 'moment',
    //     'query-before-test-4' => "INSERT INTO userAnswer(cid,quiz,moment,vers,variant,hash,password,timesSubmitted,timesAccessed,useranswer,submitted) VALUES(9999,52432,1,?,3,'ghj1ghj2','UNK',NULL,now());",
    //     'query-after-test-1' => "DELETE FROM userAnswer ORDER BY aid DESC LIMIT 1;",
    //     'query-after-test-2' => "DELETE FROM listentries WHERE cid = 9999;",
    //     'query-after-test-3' => "DELETE FROM course WHERE cid = 9999;",
    //     'service' => 'http://localhost/LenaSYS/DuggaSys/showDuggaservice.php',
    //     'service-data' => serialize(array( // Data that service needs to execute function
    //         'courseid' => '9999',
    //         'duggaid' => '1',
    //         'tmpvariant' => '3',
    //         'tmphash' => 'ghj1ghj2',
    //         'tmphashpwd' => 'UNK',
    //         'username' => 'stei',
    //         'password' => 'password',
    //         'moment' => '<!query-before-test3!> <*[0]["listentries"]*>'
    //     )),
    //     'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
    //         'none'
    //     )),
    // ),
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON

