
<?php



include "../../Shared/test.php";

$submitDugga = array(

    'Submit dugga' => array(
        'expected-output' => '{"debug":"[Guest] Missing hash\/password\/variant!","param":"{}","answer":"UNK","danswer":"UNK","score":0,"highscoremode":"","grade":"UNK","submitted":"","marked":"","deadline":"UNK","release":"UNK","files":[],"userfeedback":"UNK","feedbackquestion":"UNK","variant":"UNK","ishashindb":false,"variantsize":"UNK","variantvalue":"UNK","password":"UNK","hashvariant":"UNK","isFileSubmitted":"UNK","isTeacher":0,"variants":[],"duggaTitle":"UNK","hash":"UNK","hashpwd":"UNK","opt":"UNK","link":"UNK"}',
        'query-before-test-1' => "INSERT INTO course(cid, creator) VALUES (9999, 1);",
        'query-before-test-2' => "INSERT INTO listentries(cid,entryname,link,kind,pos,creator,visible,vers,gradesystem,highscoremode,feedbackenabled,feedbackquestion) VALUES (9999, 'Inserttobedeleted', 'UNK', 4, 12, 2, 1, 1337, 1, 1, 0, 'UNK');",
        'query-before-test-3' => "SELECT MAX(lid) FROM listentries",
        'variables-query-before-test-4' => 'moment',
        'query-before-test-4' => "INSERT INTO userAnswer (cid,quiz,moment,vers,variant,hash,password,timesSubmitted,timesAccessed,useranswer,submitted) VALUES(9999,52432,1,1,3,'YOUR_HASH','YOUR_PASSWORD', NULL,now());",
        'query-after-test-1' => "DELETE FROM userAnswer ORDER BY aid DESC LIMIT 1;",
        'query-after-test-2' => "DELETE FROM listentries WHERE cid = 9999;",
        'query-after-test-3' => "DELETE FROM course WHERE cid = 9999;",

        'service' => 'http://localhost/LenaSYS/DuggaSys/showDuggaservice.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'opt' => 'SAVDU',
            'hash' => 'ghj1ghj2',
            'hashpwd' => 'asddasdd',
            'username' => 'a99marjo',
            'password' => 'password',
            'moment' => '<!query-before-test3!> <*[0][listentries]*>',
            'answer' => 'dugga answer'
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'none'
        )),
    ),
);
