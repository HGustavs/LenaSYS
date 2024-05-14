<?php

// This tests the microservice updateListentrie and the part of the monalith called "UPDATE" 

include_once "../../../../Shared/test.php";

$testsData = array(
'updateListentrie' => array(
        'expected-output' => '{"entries":[{"entryname":"PHP examples","kind":1,"moment":0,"link":"UNK","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"PHP Example 1","kind":2,"moment":0,"link":"1","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"PHP Example 2","kind":2,"moment":0,"link":"2","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"PHP Example 3","kind":2,"moment":0,"link":"3","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"Javascript examples","kind":1,"moment":0,"link":"UNK","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"JavaScript Example 1","kind":2,"moment":0,"link":"4","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"JavaScript Example 2","kind":2,"moment":0,"link":"5","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"JavaScript Example 3","kind":2,"moment":0,"link":"6","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"HTML5 examples","kind":1,"moment":0,"link":"UNK","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"HTML5 Example 1","kind":2,"moment":0,"link":"7","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"HTML5 Example 2","kind":2,"moment":0,"link":"8","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"HTML5 Example 3","kind":2,"moment":0,"link":"9","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"HTML5 Example 4","kind":2,"moment":0,"link":"10","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"HTML5 Example 5","kind":2,"moment":0,"link":"11","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"HTML5 Example 6","kind":2,"moment":0,"link":"12","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"HTML5 Example 7","kind":2,"moment":0,"link":"13","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"HTML5 Example 8","kind":2,"moment":0,"link":"14","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"Shader examples","kind":1,"moment":0,"link":"UNK","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"Shaderprogrammering","kind":2,"moment":0,"link":"15","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"Shaderprogrammering","kind":2,"moment":0,"link":"16","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"Updated","kind":4,"moment":7776,"link":"8887","visible":1,"highscoremode":1,"gradesys":2,"comments":"Comment updated","grptype":"Updated","feedbackenabled":1,"feedbackquestion":"Question updated"}]}',

        'query-before-test-1' => "INSERT INTO listentries (lid, cid, entryname, link, vers, kind, pos, creator, visible, comments, moment, gradesystem, highscoremode, groupKind, feedbackenabled, feedbackquestion)   
                                  VALUES(9999,1,'Test',8888,45656,0,20,22, 0,'Comment NOT updated',7777,0,0,'NOT updated',0,'Question NOT updated');",
        'query-after-test-1' => "DELETE FROM listentries WHERE lid = 9999;",

        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/sectionedService/updateListEntries_ms.php',
        'service-data' => serialize(
            array( // Data that service needs to execute function
                'opt' => 'UPDATE',
                'lid' => 9999,
                'courseid' => '1',
                'sectname' => 'Updated',
                'link' => 8887,
                'kind' => 4,
                'visibility' => 1,
                'coursevers' => 45656,
                'comments' => 'Comment updated',
                'moment' => 7776,
                'gradesys' => 2,
                'highscoremode' => 1,
                'grptype' => 'Updated',
                'feedback' => 1,
                'feedbackquestion' => 'Question updated',
                'username' => 'mestr',
                'password' => 'password'
            )
        ),
        'filter-output' => serialize(
            array( // Filter what output to use in assert test, use none to use all ouput from service
                'entries' => array(
                    'entryname',
                    'kind',
                    'moment',
                    'link',
                    'visible',
                    'highscoremode',
                    'gradesys',
                    'comments',
                    'grptype',
                    'feedbackenabled',
                    'feedbackquestion'
                )
            )
        ),
    ),
);

    testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON