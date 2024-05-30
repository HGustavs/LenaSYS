<?php
/********************************************************************************

   Documentation 

*********************************************************************************
 
 Documentation for how these tests are used can be found in Shared/Documentation/Test API

 The original code for the service that is tested in reorderListEntries, changes the value of "moment", therefore these tests can only be performed once with a passing grades. Should another attempt be performed before reseting the database some test will undoubtedly fail.

 The service used in test removeListEntries, is never used
 The github related services "REFGIT" and "CREGITEX"  do not have tests for the time being. they were not completed at the time. They therefore need to be added to this file.
 The services changeActiveCourseVersion_sectioned and updateCourseVersion_sectioned are not in a functioning state, the tests for them are therefore not complete. 

-------------==============######## Documentation End ###########==============-------------
*/

include "../../Shared/test.php";


$testsData = array(
    //------------------------------------------------------------------------------------------
    // This test the microservice getCourseGroupsAndMembers and the part of the monalith called "GRP" 
    //------------------------------------------------------------------------------------------
    'getCourseGroupsAndMembers' => array(
        'expected-output' => '{"debug": "NONE!","coursevers": "1337","courseid": "1885","grpmembershp": "No_2","grplst": [["No_2",null,null,"Tester@student.his.se"],["No_2","Martin","Brobygge","martin.b@his.se"]]}',
        'query-before-test-1' => "INSERT INTO user_course (cid, vers, uid,groups,access) VALUES (1885,1337,3, 'No_2','W'), (1885,1337,101, 'No_2','W');",
        'query-after-test-1' => "DELETE FROM user_course WHERE uid=3 AND cid=1885;",
        'query-after-test-2' => "DELETE FROM user_course WHERE uid=101 AND cid=1885;",
        'service' => 'http://localhost/LenaSYS/DuggaSys/sectionedservice.php',
        'service-data' => serialize(
            array( // Data that service needs to execute function
                'opt' => 'GRP',
                'username' => 'mestr',
                'password' => 'password',
                'showgrp' => 'No_2',
                'courseid' => '1885',
                'coursevers' => '1337',
            )
        ),
        'filter-output' => serialize(
            array( // Filter what output to use in assert test, use none to use all ouput from service
                'debug',
                'coursevers',
                'courseid',
                'grpmembershp',
                'grplst'
            )
        )
    ),
    //---------------------------------------------------------------------------------------------------------------
    // This test will test the micro-service deleteListEntries and its curresponding part in the monolith called "DEL"
    //---------------------------------------------------------------------------------------------------------------
    'deleteListEntries' => array(
        'expected-output' => '{"entries":[{"entryname":"JavaScript-Code:"},{"entryname":"JS-TEST template 1"},{"entryname":"JS-TEST template 2"},{"entryname":"JS-TEST template 3"},{"entryname":"JS-TEST template 4"},{"entryname":"JS-TEST template 5"},{"entryname":"JS-TEST template 6"},{"entryname":"JS-TEST template 7"},{"entryname":"JS-TEST template 8"},{"entryname":"JS-TEST template 9"},{"entryname":"JS-TEST template 10"},{"entryname":"HTML-Code:"},{"entryname":"Html-test template 1"},{"entryname":"Html-test template 2"},{"entryname":"Html-test template 3"},{"entryname":"Html-test template 4"},{"entryname":"Html-test template 5"},{"entryname":"Html-test template 6"},{"entryname":"Html-test template 7"},{"entryname":"Html-test template 8"},{"entryname":"Html-test template 9"},{"entryname":"Html-test template 10"},{"entryname":"SQL-CODE:"},{"entryname":"SQL-TEST template 1"},{"entryname":"SQL-TEST template 2"},{"entryname":"SQL-TEST template 3"},{"entryname":"SQL-TEST template 4"},{"entryname":"SQL-TEST template 5"},{"entryname":"SQL-TEST template 6"},{"entryname":"SQL-TEST template 7"},{"entryname":"SQL-TEST template 8"},{"entryname":"SQL-TEST template 9"},{"entryname":"SQL-TEST template 10"},{"entryname":"PHP-CODE:"},{"entryname":"PHP-TEST template 1"},{"entryname":"PHP-TEST template 2"},{"entryname":"PHP-TEST template 3"},{"entryname":"PHP-TEST template 4"},{"entryname":"PHP-TEST template 5"},{"entryname":"PHP-TEST template 6"},{"entryname":"PHP-TEST template 7"},{"entryname":"PHP-TEST template 8"},{"entryname":"PHP-TEST template 9"},{"entryname":"PHP-TEST template 10"},{"entryname":"Other:"}],"debug":"NONE!","coursename":"Testing-Course"}',
        'query-before-test-1' => "INSERT INTO listentries(cid, entryname, kind, creator, visible, vers) VALUES (1885, 'Inserttobedeleted', 4, 2, 1, 1337);",
        'query-before-test-2' => "SELECT MAX(lid) AS lid FROM listentries",
        'variables-query-before-test-3' => "lid",
        'query-before-test-3' => "INSERT INTO userAnswer (cid, variant, moment, useranswer, submitted, marked, vers, hash, password) VALUES(1885, 3, ?, 'an answer to be deleted', '2024-04-15 14:00:00', '2024-04-15 14:30:00', 1337, 'ghj1ghj2', 'asddasdd');",
        'query-after-test-1' => "DELETE FROM userAnswer WHERE cid = 1885 AND useranswer = 'an answer to be deleted';",
        'query-after-test-2' => "DELETE FROM listentries WHERE cid = 1885 AND entryname = 'Inserttobedeleted';",
        'service' => 'http://localhost/LenaSYS/DuggaSys/sectionedservice.php',
        'service-data' => serialize(
            array( // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',
                'courseid' => 1885,
                'coursevers'=> 1337,
                'opt'=> 'DEL',
                'lid'=> '<!query-before-test-2!><*[0]["lid"]*>',
            )
        ),
        'filter-output' => serialize(
            array( // Filter what output to use in assert test, use none to use all ouput from service
                'entries' => array(
                    'entryname',
                ),
                'debug',
                'coursename',
            )),
    ),
    //-------------------------------------------------------------------------------------------------------------------
    // This test will test the micro-service removeListEntries and its curresponding part in the monolith called "DELETED"
    // THIS WILL FAIL THE FIRST TIME IT EXECUTES AFTER INSTALLING DATABASE!
    //-------------------------------------------------------------------------------------------------------------------
    'removeListEntries' => array(
        'expected-output' => '{"debug":"NONE!","writeaccess":true,"readaccess":true,"entries":[{"entryname":"PHP examples","visible":"1"},{"entryname":"PHP Example 1","visible":"1"},{"entryname":"PHP Example 2","visible":"1"},{"entryname":"PHP Example 3","visible":"1"},{"entryname":"Javascript examples","visible":"1"},{"entryname":"RemoveTest123","visible":"3"},{"entryname":"JavaScript Example 1","visible":"1"},{"entryname":"JavaScript Example 2","visible":"1"},{"entryname":"JavaScript Example 3","visible":"1"},{"entryname":"HTML5 examples","visible":"1"},{"entryname":"HTML5 Example 1","visible":"1"},{"entryname":"HTML5 Example 2","visible":"1"},{"entryname":"HTML5 Example 3","visible":"1"},{"entryname":"HTML5 Example 4","visible":"1"},{"entryname":"HTML5 Example 5","visible":"1"},{"entryname":"HTML5 Example 6","visible":"1"},{"entryname":"HTML5 Example 7","visible":"1"},{"entryname":"HTML5 Example 8","visible":"1"},{"entryname":"Shader examples","visible":"1"},{"entryname":"Shaderprogrammering","visible":"1"},{"entryname":"Shaderprogrammering","visible":"1"}]}',
        'query-before-test-1' => "INSERT INTO listentries (cid,vers, entryname, link, kind, pos, visible,creator,comments, gradesystem, highscoremode, groupKind) VALUES(1,45656,'RemoveTest123',9021,6,5,0,101,'TOP', 0, 0, null);",
        'query-before-test-2' => "SELECT lid FROM listentries WHERE entryname = 'RemoveTest123';",
        'query-after-test-1' => "DELETE FROM listentries WHERE entryname = 'RemoveTest123';",
        'service' => 'http://localhost/LenaSYS/DuggaSys/sectionedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'DELETED',
                'username' => 'brom',
                'password' => 'password',
                'lid' => '<!query-before-test-2!><*[0]["lid"]*>',
                'courseid' => '1',
                'coursevers' => '45656',
            )
        ),
        'filter-output' => serialize(
            array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'debug',
                'writeaccess',
                'readaccess',
                'entries' => array(
                    'entryname',
                    'visible',
                ),
            )
        ),
    ),
    //---------------------------------------------------------------------------------------
    // This test the microservice createListentrie and the part of the monalith called "NEW".
    //---------------------------------------------------------------------------------------
    'createListentrie' => array(
        'expected-output' => '{"entries":[{"entryname":"PHP examples","pos":0,"kind":1,"visible":1,"highscoremode":0,"deadline":null,"qrelease":null,"feedbackenabled":0},{"entryname":"PHP Example 1","pos":1,"kind":2,"visible":1,"highscoremode":0,"deadline":"2015-01-30 15:30:00","qrelease":"2015-01-01 00:00:00","feedbackenabled":0},{"entryname":"PHP Example 2","pos":2,"kind":2,"visible":1,"highscoremode":0,"deadline":"2015-01-25 15:30:00","qrelease":"2015-01-08 00:00:00","feedbackenabled":0},{"entryname":"PHP Example 3","pos":3,"kind":2,"visible":1,"highscoremode":0,"deadline":"2015-01-20 15:30:00","qrelease":"2015-01-01 00:00:00","feedbackenabled":0},{"entryname":"Javascript examples","pos":4,"kind":1,"visible":1,"highscoremode":0,"deadline":null,"qrelease":null,"feedbackenabled":0},{"entryname":"New Code","pos":5,"kind":2,"visible":0,"highscoremode":0,"deadline":null,"qrelease":null,"feedbackenabled":0},{"entryname":"JavaScript Example 1","pos":5,"kind":2,"visible":1,"highscoremode":0,"deadline":"2015-01-18 15:30:00","qrelease":"2015-01-08 00:00:00","feedbackenabled":0},{"entryname":"JavaScript Example 2","pos":6,"kind":2,"visible":1,"highscoremode":0,"deadline":"2015-02-10 15:30:00","qrelease":"2015-01-01 00:00:00","feedbackenabled":0},{"entryname":"JavaScript Example 3","pos":7,"kind":2,"visible":1,"highscoremode":0,"deadline":"2015-02-15 15:30:00","qrelease":"2015-01-01 00:00:00","feedbackenabled":0},{"entryname":"HTML5 examples","pos":8,"kind":1,"visible":1,"highscoremode":0,"deadline":null,"qrelease":null,"feedbackenabled":0},{"entryname":"HTML5 Example 1","pos":9,"kind":2,"visible":1,"highscoremode":0,"deadline":"2015-02-05 15:30:00","qrelease":"2015-01-01 00:00:00","feedbackenabled":0},{"entryname":"HTML5 Example 2","pos":10,"kind":2,"visible":1,"highscoremode":0,"deadline":"2015-02-20 15:30:00","qrelease":"2015-02-01 00:00:00","feedbackenabled":0},{"entryname":"HTML5 Example 3","pos":11,"kind":2,"visible":1,"highscoremode":0,"deadline":"2015-02-19 15:30:00","qrelease":"2015-01-01 00:00:00","feedbackenabled":0},{"entryname":"HTML5 Example 4","pos":12,"kind":2,"visible":1,"highscoremode":0,"deadline":"2015-02-19 15:30:00","qrelease":"2015-01-01 00:00:00","feedbackenabled":0},{"entryname":"HTML5 Example 5","pos":13,"kind":2,"visible":1,"highscoremode":0,"deadline":"2015-02-19 15:30:00","qrelease":"2015-01-01 00:00:00","feedbackenabled":0},{"entryname":"HTML5 Example 6","pos":14,"kind":2,"visible":1,"highscoremode":0,"deadline":"2015-02-19 15:30:00","qrelease":"2015-01-01 00:00:00","feedbackenabled":0},{"entryname":"HTML5 Example 7","pos":15,"kind":2,"visible":1,"highscoremode":0,"deadline":"2020-06-30 00:00:00","qrelease":"2020-05-01 00:00:00","feedbackenabled":0},{"entryname":"HTML5 Example 8","pos":16,"kind":2,"visible":1,"highscoremode":0,"deadline":"2020-06-30 00:00:00","qrelease":"2020-05-01 00:00:00","feedbackenabled":0},{"entryname":"Shader examples","pos":17,"kind":1,"visible":1,"highscoremode":0,"deadline":null,"qrelease":null,"feedbackenabled":0},{"entryname":"Shaderprogrammering","pos":18,"kind":2,"visible":1,"highscoremode":0,"deadline":"2020-06-30 00:00:00","qrelease":"2020-05-01 00:00:00","feedbackenabled":0},{"entryname":"Shaderprogrammering","pos":19,"kind":2,"visible":1,"highscoremode":0,"deadline":"2020-06-30 00:00:00","qrelease":"2020-05-01 00:00:00","feedbackenabled":0}]}',

        'query-after-test-1' => "DELETE FROM listentries WHERE lid > 5009;",
        'query-after-test-2' => "DELETE FROM codeexample WHERE exampleid > 9009;",
        'service' => 'http://localhost/LenaSYS/DuggaSys/sectionedservice.php',
        'service-data' => serialize(
            // Data that service needs to execute function
            array(
                'opt' => 'NEW',
                'username' => 'mestr',
                'password' => 'password',
                'courseid' => '1',
                'coursevers' => '45656',
                'sectname' => 'New Code',
                'sname' => 'examplename',
                'gradesys' => '0',
                'tabs' => '0',
                'userid' => '2',
                'link' => '-1',
                'kind' => '2',
                'comments' => 'undefined',
                'lid' => 'undefined',
                'moment' => 'null',
                'grptype' => 'UNK',
                'deadline' => '0:0',
                'relativedeadline' => '1:1:0:0',
                'visibility' => '0',
                'highscoremode' => '0',
                'pos' => '5',
                'log_uuid' => 'XvH6j8E6SLBWBLP',
                'hash' => 'UNK'
            )
        ),
        'filter-output' => serialize(
            // Filter what output to use in assert test, use none to use all ouput from service
            array(
                'entries' => array(
                    'entryname',
                    'pos',
                    'kind',
                    'visible',
                    'highscoremode',
                    'deadline',
                    'qrelease',
                    'feedbackenabled',
                ),
            )
        ),
    ),
    //------------------------------------------------------------------------------------------
    // This test the microservice reorderListEntries and the part of the monalith called "REORDER" 
    //------------------------------------------------------------------------------------------
    'reorderListEntries' => array(
        'expected-output' => '{"entries":[{"entryname":"PHP examples","lid":1001,"pos":0},{"entryname":"PHP Example 2","lid":1003,"pos":1},{"entryname":"PHP Example 1","lid":1002,"pos":2},{"entryname":"PHP Example 3","lid":1004,"pos":3},{"entryname":"Javascript examples","lid":1005,"pos":4},{"entryname":"JavaScript Example 1","lid":1006,"pos":5},{"entryname":"JavaScript Example 2","lid":1007,"pos":6},{"entryname":"JavaScript Example 3","lid":1008,"pos":7},{"entryname":"HTML5 examples","lid":1009,"pos":8},{"entryname":"HTML5 Example 1","lid":1010,"pos":9},{"entryname":"HTML5 Example 2","lid":1011,"pos":10},{"entryname":"HTML5 Example 3","lid":1012,"pos":11},{"entryname":"HTML5 Example 4","lid":1013,"pos":12},{"entryname":"HTML5 Example 5","lid":1014,"pos":13},{"entryname":"HTML5 Example 6","lid":1015,"pos":14},{"entryname":"HTML5 Example 7","lid":1016,"pos":15},{"entryname":"HTML5 Example 8","lid":1017,"pos":16},{"entryname":"Shader examples","lid":1018,"pos":17},{"entryname":"Shaderprogrammering","lid":1019,"pos":18},{"entryname":"Shaderprogrammering","lid":1020,"pos":19}],"coursename":"Webbprogrammering"}',
        'query-after-test-1' => "UPDATE listentries SET pos=1 WHERE lid=1002;",
        'query-after-test-2' => "UPDATE listentries SET pos=2 WHERE lid=1003;",
        'service' => 'http://localhost/LenaSYS/DuggaSys/sectionedservice.php',
        'service-data' => serialize(
            array( // Data that service needs to execute function
                'opt' => 'REORDER',
                'username' => 'mestr',
                'password' => 'password',
                'courseid' => '1',
                'coursename' => '1',
                'coursevers' => '45656',
                'comment' => 'undefined',
                'order' => '0XX1001XX0,1XX1003XX0,2XX1002XX0,3XX1004XX0,4XX1005XX0,5XX1006XX0,6XX1007XX0,7XX1008XX0,8XX1009XX0,9XX1010XX0,10XX1011XX0,11XX1012XX0,12XX1013XX0,13XX1014XX0,14XX1015XX0,15XX1016XX0,16XX1017XX0,17XX1018XX0,18XX1019XX0,19XX1020XX0',
                'hash' => 'UNK'

            )
        ),
        'filter-output' => serialize(
            array( // Filter what output to use in assert test, use none to use all ouput from service
                'entries' => array(
                    'entryname',
                    'lid',
                    'pos',
                ),
                'coursename',
            )
        ),
    ),
    //---------------------------------------------------------------------------------------
    // This tests the microservice updateListentrie and the part of the monalith called "UPDATE" 
    //---------------------------------------------------------------------------------------
    'updateListentrie' => array(
        'expected-output' => '{"entries":[{"entryname":"PHP examples","kind":1,"moment":0,"link":"UNK","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"PHP Example 1","kind":2,"moment":0,"link":"1","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"PHP Example 2","kind":2,"moment":0,"link":"2","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"PHP Example 3","kind":2,"moment":0,"link":"3","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"Javascript examples","kind":1,"moment":0,"link":"UNK","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"JavaScript Example 1","kind":2,"moment":0,"link":"4","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"JavaScript Example 2","kind":2,"moment":0,"link":"5","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"JavaScript Example 3","kind":2,"moment":0,"link":"6","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"HTML5 examples","kind":1,"moment":0,"link":"UNK","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"HTML5 Example 1","kind":2,"moment":0,"link":"7","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"HTML5 Example 2","kind":2,"moment":0,"link":"8","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"HTML5 Example 3","kind":2,"moment":0,"link":"9","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"HTML5 Example 4","kind":2,"moment":0,"link":"10","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"HTML5 Example 5","kind":2,"moment":0,"link":"11","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"HTML5 Example 6","kind":2,"moment":0,"link":"12","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"HTML5 Example 7","kind":2,"moment":0,"link":"13","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"HTML5 Example 8","kind":2,"moment":0,"link":"14","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"Shader examples","kind":1,"moment":0,"link":"UNK","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"Shaderprogrammering","kind":2,"moment":0,"link":"15","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"Shaderprogrammering","kind":2,"moment":0,"link":"16","visible":1,"highscoremode":0,"gradesys":null,"comments":null,"grptype":null,"feedbackenabled":0,"feedbackquestion":null},{"entryname":"Updated","kind":4,"moment":7776,"link":"8887","visible":1,"highscoremode":1,"gradesys":2,"comments":"Comment updated","grptype":"Updated","feedbackenabled":1,"feedbackquestion":"Question updated"}]}',

        'query-before-test-1' => "INSERT INTO listentries (lid, cid, entryname, link, vers, kind, pos, creator, visible, comments, moment, gradesystem, highscoremode, groupKind, feedbackenabled, feedbackquestion)   
                                  VALUES(9999,1,'Test',8888,45656,0,20,22, 0,'Comment NOT updated',7777,0,0,'NOT updated',0,'Question NOT updated');",
        'query-after-test-1' => "DELETE FROM listentries WHERE lid = 9999;",

        'service' => 'http://localhost/LenaSYS/DuggaSys/sectionedservice.php',
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
    //----------------------------------------------------------------------------------------------------
    // This tests the microservice updateQuizDeadline and the part of the monalith called "UPDATEDEADLINE"
    //----------------------------------------------------------------------------------------------------

    'updateQuizDeadline' => array(
        'expected-output' => '{"entries":[{"entryname":"Bitr\u00e4kningsduggor 1HP","deadline":null,"relativedeadline":null},{"entryname":"Bitr\u00e4kningsdugga 1","deadline":"2015-01-30 15:30:00","relativedeadline":null},{"entryname":"Bitr\u00e4kningsdugga 2","deadline":"2015-01-31 16:30:00","relativedeadline":"2:1:0:0"},{"entryname":"F\u00e4rgduggor 1HP","deadline":null,"relativedeadline":null},{"entryname":"F\u00e4rgdugga 1","deadline":"2015-01-20 15:30:00","relativedeadline":null},{"entryname":"F\u00e4rgdugga 2","deadline":"2015-01-18 15:30:00","relativedeadline":null},{"entryname":"Geometri 2HP","deadline":null,"relativedeadline":null},{"entryname":"Linjedugga 1","deadline":"2015-02-10 15:30:00","relativedeadline":null},{"entryname":"Linjedugga 2","deadline":"2015-02-15 15:30:00","relativedeadline":null},{"entryname":"Transformationer 3,5HP","deadline":null,"relativedeadline":null},{"entryname":"Transformationsdugga 1","deadline":"2015-02-05 15:30:00","relativedeadline":null},{"entryname":"Transformationsdugga 2","deadline":"2015-02-20 15:30:00","relativedeadline":null},{"entryname":"Fr\u00e5geduggor 1HP","deadline":null,"relativedeadline":null},{"entryname":"Fr\u00e5gedugga 1","deadline":"2015-02-19 15:30:00","relativedeadline":null},{"entryname":"Rapport 1HP","deadline":null,"relativedeadline":null},{"entryname":"Rapport inl\u00e4mning","deadline":"2015-02-19 15:30:00","relativedeadline":null},{"entryname":"HTML and CSS 1HP","deadline":null,"relativedeadline":null},{"entryname":"Random css dugga","deadline":"2015-02-19 15:30:00","relativedeadline":null},{"entryname":"Clipping","deadline":null,"relativedeadline":null},{"entryname":"Random clipping dugga","deadline":"2015-02-19 15:30:00","relativedeadline":null}],"duggor":[{"deadline":"2015-01-30 15:30:00","relativedeadline":null},{"deadline":"2015-01-31 16:30:00","relativedeadline":"2:1:0:0"},{"deadline":"2015-02-19 15:30:00","relativedeadline":null},{"deadline":"2015-01-20 15:30:00","relativedeadline":null},{"deadline":"2015-01-18 15:30:00","relativedeadline":null},{"deadline":"2015-02-05 15:30:00","relativedeadline":null},{"deadline":"2015-02-20 15:30:00","relativedeadline":null},{"deadline":"2015-02-19 15:30:00","relativedeadline":null},{"deadline":"2015-02-10 15:30:00","relativedeadline":null},{"deadline":"2015-02-15 15:30:00","relativedeadline":null},{"deadline":"2015-02-19 15:30:00","relativedeadline":null},{"deadline":"2015-02-19 15:30:00","relativedeadline":null}]}',

        'query-after-test-1' => "UPDATE quiz SET deadline='2015-01-25 15:30:00', relativedeadline=null WHERE id=2;",

        'service' => 'http://localhost/LenaSYS/DuggaSys/sectionedservice.php',
        'service-data' => serialize(
            // Data that service needs to execute function
            array(
                'opt' => 'UPDATEDEADLINE',
                'username' => 'mestr',
                'password' => 'password',
                'courseid' => '2',
                'coursename' => '2',
                'coursevers' => '97732',
                'comment' => 'undefined',
                'gradesys' => '0',
                'lid' => '2002',
                'kind' => '3',
                'link' => '2',
                'highscoremode' => '1',
                'sectname' => 'Bitr&auml;kningsdugga 1',
                'visibility' => '1',
                'tabs' => '0',
                'moment' => '2001',
                'comments' => 'null',
                'grptype' => 'UNK',
                'deadline' => '2015-01-31 16:30',
                'relativedeadline' => '2:1:0:0',
                'pos' => '5',
                'hash' => 'UNK'
            )
        ),
        'filter-output' => serialize(
            // Filter what output to use in assert test, use none to use all ouput from service
            array(
                'entries' => array(
                    'entryname',
                    'deadline',
                    'relativedeadline'
                ),
            )
        ),
    ),


    //  //-----------------------------------------------------------------------------------------------------------  
//  // This tests the microservice updateCourseVersion_sectioned and the part of the monolith called "UPDATEVRS" 
//  //-----------------------------------------------------------------------------------------------------------
'updateCourseVersion_sectioned' => array(
    'expected-output' => '{
        "versions": [
            {
                "cid": "1",
                "coursecode": "DV12G",
                "vers": "45656",
                "versname": "HT15",
                "coursename": "Webbprogrammering",
                "coursenamealt": "UNK",
                "startdate": "2014-12-29 00:00:00",
                "enddate": "2015-03-08 00:00:00",
                "motd": "Webbprogrammering - HT15"
            },
            {
                "cid": "1",
                "coursecode": "DV12G",
                "vers": "45657",
                "versname": "HT16",
                "coursename": "Webbprogrammering",
                "coursenamealt": "UNK",
                "startdate": "2015-12-29 00:00:00",
                "enddate": "2016-03-08 00:00:00",
                "motd": "Webbprogrammering - HT16"
            },
            {
                "cid": "2",
                "coursecode": "IT118G",
                "vers": "97731",
                "versname": "HT14",
                "coursename": "Webbutveckling - datorgrafik",
                "coursenamealt": "UNK",
                "startdate": "2014-12-29 00:00:00",
                "enddate": "2015-03-08 00:00:00",
                "motd": "Webbutveckling - datorgrafik - HT14"
            },
            {
                "cid": "2",
                "coursecode": "IT118G",
                "vers": "97732",
                "versname": "HT15",
                "coursename": "Webbutveckling - datorgrafik",
                "coursenamealt": "UNK",
                "startdate": "2014-12-29 00:00:00",
                "enddate": "2015-03-08 00:00:00",
                "motd": "Webbutveckling - datorgrafik - HT15"
            },
            {
                "cid": "3",
                "coursecode": "IT500G",
                "vers": "1337",
                "versname": "HT15",
                "coursename": "Datorns grunder",
                "coursenamealt": "UNK",
                "startdate": "2014-12-29 00:00:00",
                "enddate": "2015-03-08 00:00:00",
                "motd": "Datorns grunder - HT15"
            },
            {
                "cid": "4",
                "coursecode": "IT301G",
                "vers": "1338",
                "versname": "HT15",
                "coursename": "Software Engineering",
                "coursenamealt": "UNK",
                "startdate": "2014-12-29 00:00:00",
                "enddate": "2015-03-08 00:00:00",
                "motd": "Software Engineering - HT15"
            },
            {
                "cid": "305",
                "coursecode": "IT308G",
                "vers": "12305",
                "versname": "HT15",
                "coursename": "Objektorienterad programmering",
                "coursenamealt": "UNK",
                "startdate": null,
                "enddate": null,
                "motd": null
            },
            {
                "cid": "307",
                "coursecode": "IT115G",
                "vers": "12307",
                "versname": "HT15",
                "coursename": "Datorns grunder",
                "coursenamealt": "UNK",
                "startdate": null,
                "enddate": null,
                "motd": null
            },
            {
                "cid": "308",
                "coursecode": "MA161G",
                "vers": "12308",
                "versname": "HT15",
                "coursename": "Diskret matematik",
                "coursenamealt": "UNK",
                "startdate": null,
                "enddate": null,
                "motd": null
            },
            {
                "cid": "309",
                "coursecode": "DA322G",
                "vers": "12309",
                "versname": "HT15",
                "coursename": "Operativsystem",
                "coursenamealt": "UNK",
                "startdate": null,
                "enddate": null,
                "motd": null
            }
        ]
    }',
    'service' => 'http://localhost/LenaSYS/DuggaSys/sectionedService.php',
    'service-data' => serialize(array(
        'opt' => 'UPDATEVRS',
        'username' => 'mestr',
        'password' => 'password',
        'courseid' => '2',
        'coursename' => '2',
        'coursevers' => '97731',
        'motd' => 'TEST TEXT',
        'comment' => 'undefined',
        'lid' => '2008',
        'tabs' => '1',
        'hash' => 'UNK'
    )),
    'filter-output' => serialize(array(
        'versions'
    )),
),
//*******************************************************************************************/
    //       THIS SERVICE DOES NOT FUNCTION AS INTENDED, the test therefore is incompleat.      //
    //*******************************************************************************************/

    //  //-----------------------------------------------------------------------------------------------------------  
    //  // This test the microservice updateCourseVersion_sectioned and the part of the monalith called "UPDATEVRS" 
    //  //-----------------------------------------------------------------------------------------------------------
    //  'updateCourseVersion_sectioned' => array(
    //     'expected-output'   => '',

    //     'query-after-test-1' => "UPDATE listentries SET tabs=null, gradesystem=0 WHERE lid=2008;",

    //     'service' => 'http://localhost/LenaSYS/DuggaSys/sectionedservice.php',
    //     'service-data' => serialize(array( // Data that service needs to execute function
    //         'opt' => 'UPDATEVRS',
    //         'username' => 'mestr',
    //         'password' => 'password',
    //         'courseid' => '2',
    //         'coursename' => '2',
    //         'coursevers' => '97731',
    //         'motd' => 'TEST TEXT'
    //         'comment' => 'undefined',
    //         'lid' => '2008', 
    //         'tabs' => '1',
    //         'hash' => 'UNK'

    //     )),
    //     'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
    //         'entries' => array(
    //             'entryname',
    //             'lid',
    //             'pos',
    //             'kind',
    //             'moment',
    //             'link',
    //             'visible',
    //             'highscoremode',
    //             'gradesys',
    //             'code_id',
    //             'deadline',
    //             'relativedeadline',
    //             'qrelease',
    //             'comments',
    //             'qstart',
    //             'grptype',
    //             'tabs',
    //             'feedbackenabled',
    //             'feedbackquestion',
    //             //'ts'
    //         ),
    //         'debug',
    //         'writeaccess',
    //         'studentteacher',
    //         'readaccess',
    //         'coursename',
    //         'coursevers',
    //         'coursecode',
    //         'courseid',
    //         'links',
    //         'duggor',
    //         'results',
    //         'versions',
    //         'codeexamples',
    //         'unmarked',
    //         'startdate',
    //         'enddate',
    //         'groups',
    //         'grpmembershp',
    //         'grplst',
    //         'userfeedback',
    //         'feedbackquestion',
    //         'avgfeedbackscore'
    //     )),
    // ),  



    //**********************************************************************************************/
    //           THIS SERVICE DOES NOT FUNCTION AS INTENDED, the test therefore is incompleat.     //
    //**********************************************************************************************/

    // //-------------------------------------------------------------------------------
    // // This test the microservice changeActiveCourseVersion_sectioned and the part of the monalith called "CHGVERS" 
    // //-------------------------------------------------------------------------------
    'changeActiveCourseVersion_sectioned' => array(
        'expected-output' => '{"entries":[{"entryname":"New Test","lid":"99999","gradesys":"0","tabs":"0" },{"entryname":"JavaScript-Code:","lid":"1","gradesys":null,"tabs":null},{"entryname":"JS-TEST template 1","lid":"4000","gradesys":null,"tabs":null},{"entryname":"JS-TEST template 2","lid":"4001","gradesys":null,"tabs":null},{"entryname":"JS-TEST template 3","lid":"4002","gradesys":null,"tabs":null},{"entryname":"JS-TEST template 4","lid":"4003","gradesys":null,"tabs":null},{"entryname":"JS-TEST template 5","lid":"4004","gradesys":null,"tabs":null},{"entryname":"JS-TEST template 6","lid":"4005","gradesys":null,"tabs":null},{"entryname":"JS-TEST template 7","lid":"4006","gradesys":null,"tabs":null},{"entryname":"JS-TEST template 8","lid":"4007","gradesys":null,"tabs":null},{"entryname":"JS-TEST template 9","lid":"4008","gradesys":null,"tabs":null},{"entryname":"JS-TEST template 10","lid":"4009","gradesys":null,"tabs":null},{"entryname":"HTML-Code:","lid":"2","gradesys":null,"tabs":null},{"entryname":"Html-test template 1","lid":"5000","gradesys":null,"tabs":null},{"entryname":"Html-test template 2","lid":"5001","gradesys":null,"tabs":null},{"entryname":"Html-test template 3","lid":"5002","gradesys":null,"tabs":null},{"entryname":"Html-test template 4","lid":"5003","gradesys":null,"tabs":null},{"entryname":"Html-test template 5","lid":"5004","gradesys":null,"tabs":null},{"entryname":"Html-test template 6","lid":"5005","gradesys":null,"tabs":null},{"entryname":"Html-test template 7","lid":"5006","gradesys":null,"tabs":null},{"entryname":"Html-test template 8","lid":"5007","gradesys":null,"tabs":null},{"entryname":"Html-test template 9","lid":"5008","gradesys":null,"tabs":null},{"entryname":"Html-test template 10","lid":"5009","gradesys":null,"tabs":null},{"entryname":"SQL-CODE:","lid":"4","gradesys":null,"tabs":null},{"entryname":"SQL-TEST template 1","lid":"3110","gradesys":null,"tabs":null},{"entryname":"SQL-TEST template 2","lid":"3111","gradesys":null,"tabs":null},{"entryname":"SQL-TEST template 3","lid":"3112","gradesys":null,"tabs":null},{"entryname":"SQL-TEST template 4","lid":"3113","gradesys":null,"tabs":null},{"entryname":"SQL-TEST template 5","lid":"3114","gradesys":null,"tabs":null},{"entryname":"SQL-TEST template 6","lid":"3115","gradesys":null,"tabs":null},{"entryname":"SQL-TEST template 7","lid":"3116","gradesys":null,"tabs":null},{"entryname":"SQL-TEST template 8","lid":"3117","gradesys":null,"tabs":null },{"entryname":"SQL-TEST template 9","lid":"3118","gradesys":null,"tabs":null },{"entryname":"SQL-TEST template 10","lid":"3119","gradesys":null,"tabs":null },{"entryname":"PHP-CODE:","lid":"5","gradesys":null,"tabs":null },{"entryname":"PHP-TEST template 1","lid":"2110","gradesys":null,"tabs":null },{"entryname":"PHP-TEST template 2","lid":"2111","gradesys":null,"tabs":null },{"entryname":"PHP-TEST template 3","lid":"2112","gradesys":null,"tabs":null },{"entryname":"PHP-TEST template 4","lid":"2113","gradesys":null,"tabs":null },{"entryname":"PHP-TEST template 5","lid":"2114","gradesys":null,"tabs":null },{"entryname":"PHP-TEST template 6","lid":"2115","gradesys":null,"tabs":null },{"entryname":"PHP-TEST template 7","lid":"2116","gradesys":null,"tabs":null },{"entryname":"PHP-TEST template 8","lid":"2117","gradesys":null,"tabs":null },{"entryname":"PHP-TEST template 9","lid":"2118","gradesys":null,"tabs":null },{"entryname":"PHP-TEST template 10","lid":"2119","gradesys":null,"tabs":null },{"entryname":"Other:","lid":"6","gradesys":null,"tabs":null }],"debug":"NONE!"}',
        'query-before-test-1' => "INSERT INTO listentries (lid,cid,vers, entryname,gradesystem, tabs,highscoremode, groupKind,creator,visible) VALUES (99999,1885,1337,'New Test', 0 ,null , 0, null,101,1);",
        'query-after-test-1' => "DELETE FROM listentries WHERE lid=99999",
        'service' => 'http://localhost/LenaSYS/DuggaSys/sectionedservice.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'opt' => 'UPDATETABS',
            'username' => 'mestr',
            'password' => 'password',
            'courseid' => '1885',
            'coursevers' => '1337',
            'comment' => 'undefined',
            'lid' => '99999', 
            'tabs' => '1',
            'hash' => 'UNK'

        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'entries' => array(
                'entryname',
                'lid',
                'gradesys',
                'tabs',
            ),
            'debug',
        )),
        
    ),

    //--------------------------------------------------------------------------------------------------
    // This test the microservice setVisibleListentrie and the part of the monalith called "HIDDEN" 
    //--------------------------------------------------------------------------------------------------

    'setVisibleListentrieHIDDEN' => array(
        'expected-output'   => '{"entries":[{"entryname":"HIDDENTEST123","visible":0}]}',
        'query-before-test-1' => "INSERT INTO course(cid, creator) VALUES (9999, 1);",
        'query-before-test-2' => "INSERT INTO listentries (cid,vers, entryname, visible,creator) VALUES(9999,888,'HIDDENTEST123',0,101);",
        'query-before-test-3' => "SELECT lid FROM listentries WHERE entryname = 'HIDDENTEST123';",
        'query-after-test-1' => "DELETE FROM listentries WHERE entryname = 'HIDDENTEST123';",
        'query-after-test-2' => "DELETE FROM course WHERE cid = 9999;",
        'service' => 'http://localhost/LenaSYS/DuggaSys/sectionedservice.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'opt' => 'HIDDEN',
            'username' => 'brom',
            'password' => 'password',
            'courseid' => '9999',
            'coursevers' => '888',
            'lid' => '<!query-before-test-3!><*[0]["lid"]*>', 
            'hash' => 'UNK'
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'entries' => array(
                'entryname',
                'visible',
            ),
        )),
    ),
    
    //------------------------------------------------------------------------------------------
    // This tests the microservice setVisibleListentrie and the part of the monolith called "PUBLIC" 
    //------------------------------------------------------------------------------------------
    'setVisibleListentriePUBLIC' => array(
        'expected-output'   => '{"entries":[{"entryname":"PUBLICTEST123","visible":"1"}]}',
        'query-before-test-1' => "INSERT INTO course(cid, creator) VALUES (9999, 1);",
        'query-before-test-2' => "INSERT INTO listentries (cid,vers, entryname, visible,creator) VALUES(9999,888,'PUBLICTEST123',0,101);",
        'query-before-test-3' => "SELECT lid FROM listentries WHERE entryname = 'PUBLICTEST123';",
        'query-after-test-1' => "DELETE FROM listentries WHERE entryname = 'PUBLICTEST123';",
        'query-after-test-2' => "DELETE FROM course WHERE cid = 9999;",
        'service' => 'http://localhost/LenaSYS/DuggaSys/sectionedservice.php',
        'service-data' => serialize(array( 
            // Data that service needs to execute function
            'opt' => 'PUBLIC',
            'username' => 'brom',
            'password' => 'password',
            'lid' => '<!query-before-test-3!><*[0]["lid"]*>',
            'courseid' => '9999',
            'coursevers' => '888',
        )),
        'filter-output' => serialize(array( 
            // Filter what output to use in assert test, use none to use all ouput from service
            'entries' => array(
                'entryname',
                'visible',
            ),
        )),
    ), 
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON

?>
