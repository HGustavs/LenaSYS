<?php

include "../../../../Shared/test.php";

$testsData = array(
    'highscoreService_ms' => array(
        
        'expected-output' => '{"debug":"NONE!","highscores":[{"username":"a99joher","score":99},{"username":"mestr","score":99},{"username":"a99andni","score":99},{"username":"e93evkos","score":99},{"username":"a13siman","score":99},{"username":"brom","score":99},{"username":"a13andka","score":99},{"username":"a99perla","score":99},{"username":"Tester","score":99},{"username":"a99krila","score":99}],"user":[5]}',

        'query-before-test-1' => "INSERT INTO listentries (lid, entryname,cid,vers,creator) VALUES (9789, 'TestEntry', 1885, 1337, 101)",
        'query-before-test-2' => "INSERT INTO quiz (id, cid, vers, qname) VALUES (333, 1885, 1337, 'testQuiz')",
        'query-before-test-3' => "INSERT INTO userAnswer (aid, cid, vers, quiz, moment, useranswer, score, grade) VALUES (978, 1885, 1337, 333, 9789, 'hsanswer', 99, 2)",
        'query-after-test-1' => "DELETE FROM userAnswer WHERE aid = 978;",
        'query-after-test-2' => "DELETE FROM quiz WHERE id = 333;",
        'query-after-test-3' => "DELETE FROM listentries WHERE lid = 9789;",

        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/highscoreService/highscoreService_ms.php',

        'service-data' => serialize(array( // Data that service needs to execute function
            'username' => 'mestr',
            'password' => 'password',
			'opt' => 'GET', 
			'courseid' => '1885',
			'coursename' => 'Testing-Cours',
			'coursevers' => '1337',
			'did' => '333',
			'lid' => '9789',
        )),

        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'debug',
            'highscores',
            'user',
        )),
    ),
);
testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON
