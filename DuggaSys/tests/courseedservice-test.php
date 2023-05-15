/*
----------------------------------------------------------
    Courseedservice.php implement test file
----------------------------------------------------------
*/
 
<?php
 
include "../../Shared/test.php";
 
$testsData = array(

    /* Insert into course */

    'Insert into course test' => array(
        'expected-output' => '{"debug":"NONE!","motd":"UNK"}',
        'query-before-test-1' => "SELECT cid FROM course WHERE coursecode = 'G1337' ORDER BY coursecode DESC LIMIT 1",
        'query-before-test-2' => "INSERT INTO course (coursecode,coursename,visibility) VALUES('G1337','Testing-Course',1)",
        'query-before-test-3' => "DELETE FROM course WHERE coursecode = 'G1337' AND cid = ?",
        'query-after-test-1' => "DELETE FROM course WHERE coursecode = 'G1337' AND coursename = 'Testing-Course'",
        'query-after-test-2' => "DELETE FROM course WHERE coursecode = 'G1337' AND coursename = 'Testing-Course'",
	'query-variables' => "blop",
        'service' => 'https://cms.webug.se/root/G2/students/a21ponkr/LenaSYS/DuggaSys/courseedservice.php',
        'service-data' => serialize(array(
            'opt' => 'NEW',
            'cid' => '1885',
            'username' => 'usr',
            'password' => 'pass',
            'coursecode' => 'G1337',
            'coursename' => 'Testing-Course',
            'activeversion' => '1337',
            'activeedversion' => null,
            'registered' => false,
	    'blop' => '<!query-before-test-1!> <*[0][cid]*>'
        )),
        'filter-output' => serialize(array(
            'debug',
            'readonly'
        )),
    ),

    /* Insert into vers */

    'Insert into course test' => array(
        'expected-output' => '{"debug":"NONE!","motd":"UNK"}',
        'query-before-test-1' => "SELECT cid FROM course WHERE coursecode = 'G1337' ORDER BY coursecode DESC LIMIT 1",
        'query-before-test-2' => "INSERT INTO course($cid, creator) VALUES ($preValuesCourse[0], $preValuesCourse[1])",
        'query-before-test-3' => "DELETE FROM course WHERE coursecode = 'G1337' AND cid = ?",
        'query-after-test-1' => "DELETE FROM vers WHERE cid = 9999",
        'query-after-test-2' => "DELETE FROM course WHERE cid = 9999'",
	'query-variables' => "blop",
        'service' => 'https://cms.webug.se/root/G2/students/a21ponkr/LenaSYS/DuggaSys/courseedservice.php',
        'service-data' => serialize(array(
            'opt' => 'NEWVRS',
            'cid' => '9999',
            'coursecode' => 'G1337',
            'versid' => '1338',
            'versname' => 'HT15',
            'coursename' => 'Testing-Course',
            'coursenamealt' => 'Course for testing codeviewer',
            'motd' => 'Code examples shows both templateid and boxid!',
            'startdate' => '2020-05-01 00:00:00',
            'enddate' => '2020-06-30 00:00:00',
	    'blop' => '<!query-before-test-1!> <*[0][cid]*>'
        )),
        'filter-output' => serialize(array(
            'debug',
            'readonly'
        )),
    ),
);
 
testHandler($testsData, false);
