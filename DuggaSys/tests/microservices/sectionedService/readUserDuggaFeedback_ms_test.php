<?php
include "../../../../Shared/test.php";

$testdata = array(
    'get user dugga feedback' => array(
        'expected-output' => '{"userfeedback":[{"ufid":1,"username":"brom","cid":1894,"lid":3017,"score":3,"entryname":"Feedback Dugga"}], "feedbackquestion":null,"avgfeedbackscore":3}', // avgScore should be 3.0
        'query-before-test' => "INSERT INTO userduggafeedback (ufid, username, cid, lid, score, entryname) VALUES (1, 'brom', 1894, 3017, 3, 'Feedback Dugga');",
        'query-after-test' => "DELETE FROM userduggafeedback WHERE ufid = 1 AND username='brom' AND lid = 3017;", // Clean up after the test
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/sectionedService/readUserDuggaFeedback_ms.php',
        'service-data' => serialize(array( // Data that the service needs to execute the function
            'opt' => 'GETUF',
            'courseid' => '1894',
            'moment' => '3017',
            'username' => 'brom',
            'password' => 'password',
        )),
        'filter-output' => serialize(array(
            'userfeedback',
            'avgfeedbackscore',
            'feedbackquestion'
        )),
    ),
);

testHandler($testdata, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON