<?php

include "../../../../Shared/test.php";

$testsData = array(
    'update password (user)' => array(
        'expected-output' => '{}',
        //'query-before-test-1' => "INSERT INTO () VALUES ();",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/highscoreService/highscoreService_ms.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'username' => 'brom',
            'password' => 'password',
			'opt' => '',
			'courseid' => '1885',
			'coursename' => 'Testing-Course',
			'coursevers' => '1337',
			'did' => '',
			'lid' => '',
			'moment' => '',
			'hash' => '',
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'debug',
            'highscores',
            'user',
        )),
    ),
);
testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON