<?php

include "../../../../Shared/test.php";

$testsData = array(
    'update password (user)' => array(
        'expected-output' => '{}',
        'query-before-test-1' => "INSERT INTO listentries(lid, entryname,cid,vers,creator) VALUES (9789,'TestEntry',1885,1337,101);",
        'query-before-test-2' => "INSERT INTO quiz(id, cid,vers, qname) VALUES (333,1885,1337,'testQuiz')",
		'query-before-test-3' => "INSERT INTO userAnswer(aid,cid,vers, quiz,moment, useranswer) VALUES (978,1885,1337,333,9789,'hsanswer');",
		'query-after-test-1' => "DELETE FROM userAnswer WHERE aid = 978;",
		'query-after-test-2' => "DELETE FROM quiz WHERE id = 333;",
		'query-after-test-3' => "DELETE FROM listentries WHERE lid = 9789;",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/highscoreService/highscoreService_ms.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'username' => 'brom',
            'password' => 'password',
			//'opt' => '', doesnt seem to use an opt at the moment.
			'courseid' => '1885',
			'coursename' => 'Testing-Course',
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