<?php

// This tests the microservice updateListentries_ms.php

include_once "../../../../Shared/test.php";

$testsData = array(
'updateListentrie' => array(
        'expected-output' => '{"entries":[{"entryname":"JavaScript-Code:","kind":1,"moment":null,"link":"1","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"JS-TEST template 1","kind":2,"moment":null,"link":"7000","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"JS-TEST template 2","kind":2,"moment":null,"link":"7001","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"JS-TEST template 3","kind":2,"moment":null,"link":"7002","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"JS-TEST template 4","kind":2,"moment":null,"link":"7003","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"JS-TEST template 5","kind":2,"moment":null,"link":"7004","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"JS-TEST template 6","kind":2,"moment":null,"link":"7005","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"JS-TEST template 7","kind":2,"moment":null,"link":"7006","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"JS-TEST template 8","kind":2,"moment":null,"link":"7007","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"JS-TEST template 9","kind":2,"moment":null,"link":"7008","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"JS-TEST template 10","kind":2,"moment":null,"link":"7009","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"HTML-Code:","kind":1,"moment":null,"link":"1","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"Html-test template 1","kind":2,"moment":null,"link":"6000","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"Html-test template 2","kind":2,"moment":null,"link":"6001","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"Html-test template 3","kind":2,"moment":null,"link":"6002","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"Html-test template 4","kind":2,"moment":null,"link":"6003","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"Html-test template 5","kind":2,"moment":null,"link":"6004","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"Html-test template 6","kind":2,"moment":null,"link":"6005","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"Html-test template 7","kind":2,"moment":null,"link":"6006","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"Html-test template 8","kind":2,"moment":null,"link":"6007","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"Html-test template 9","kind":2,"moment":null,"link":"6008","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"Html-test template 10","kind":2,"moment":null,"link":"6009","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"SQL-CODE:","kind":1,"moment":null,"link":"1","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"SQL-TEST template 1","kind":2,"moment":null,"link":"8000","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"SQL-TEST template 2","kind":2,"moment":null,"link":"8001","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"SQL-TEST template 3","kind":2,"moment":null,"link":"8002","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"SQL-TEST template 4","kind":2,"moment":null,"link":"8003","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"SQL-TEST template 5","kind":2,"moment":null,"link":"8004","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"SQL-TEST template 6","kind":2,"moment":null,"link":"8005","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"SQL-TEST template 7","kind":2,"moment":null,"link":"8006","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"SQL-TEST template 8","kind":2,"moment":null,"link":"8007","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"SQL-TEST template 9","kind":2,"moment":null,"link":"8008","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"SQL-TEST template 10","kind":2,"moment":null,"link":"8009","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"PHP-CODE:","kind":1,"moment":null,"link":"1","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"PHP-TEST template 1","kind":2,"moment":null,"link":"9000","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"PHP-TEST template 2","kind":2,"moment":null,"link":"9001","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"PHP-TEST template 3","kind":2,"moment":null,"link":"9002","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"PHP-TEST template 4","kind":2,"moment":null,"link":"9003","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"PHP-TEST template 5","kind":2,"moment":null,"link":"9004","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"PHP-TEST template 6","kind":2,"moment":null,"link":"9005","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"PHP-TEST template 7","kind":2,"moment":null,"link":"9006","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"PHP-TEST template 8","kind":2,"moment":null,"link":"9007","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"PHP-TEST template 9","kind":2,"moment":null,"link":"9008","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"PHP-TEST template 10","kind":2,"moment":null,"link":"9009","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"Other:","kind":1,"moment":null,"link":"1","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null}]}',

        'query-before-test-1' => "INSERT INTO listentries (lid, cid, entryname, link, vers, kind, pos, creator, visible, comments, moment, gradesystem, highscoremode, groupKind, feedbackenabled, feedbackquestion)   
                                  VALUES(9999,1,'Test',8888,45656,0,20,22, 0,'Comment NOT updated',7777,0,0,'NOT updated',0,'Question NOT updated');",
        'query-after-test-1' => "DELETE FROM listentries WHERE lid = 9999;",

        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/sectionedService/updateListEntries_ms.php',
        'service-data' => serialize(
            array( // Data that service needs to execute function
                'opt' => 'UPDATE',
                'lid' => 9999,
                'courseid' => '1885',
                'sectname' => 'Updated',
                'link' => 8887,
                'kind' => 4,
                'visibility' => 1,
                'coursevers' => 1337,
                'comments' => 'Comment updated',
                'moment' => 7776,
                'gradesys' => 2,
                'highscoremode' => 1,
                'grptype' => 'Updated',
                'deadline' => '2024-05-16 16:00:00',
                'relativedeadline' => 'senare',
                'pos' => '5',
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