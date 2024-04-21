
<?php



include_once "../../Shared/test.php";   // Include the test file where this is sent to
include_once "../../../coursesyspw.php";
include_once "../../Shared/sessions.php";
//Submitt Dugga 


include_once "../../showduggaservice.php"; 

$testsData = array(

    'submit dugga' => array(

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
                // Filter what output to use in assert test, use none to use all output from service
                'none'
            )
        ),
    ),
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON

?>



