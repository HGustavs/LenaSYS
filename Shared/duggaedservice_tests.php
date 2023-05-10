<?php

include "../Shared/test.php";

$testsData = array(
    'Create an assignment' => array(
        'expected-output' => '{"debug":"NONE!","motd":"UNK"}',
        'service' => 'https://cms.webug.se/root/G2/students/c21axepe/LenaSYS/DuggaSys/duggaedservice.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'opt' => 'SAVDUGGA',
            'qid' => 'UNK',
            'cid' => '1885',
            'userid' => '2',      // this is automatically added depending on what session is active (if any), we want the value to be 2
            'coursevers' => '1337',
            'qname' => 'TestQuiz',
            'autograde' => '1',
            'gradesys' => '2',
            'template' => 'Quiz',
            'jsondeadline' => '{&quot;deadline1&quot;:&quot;2023-04-27 0:0&quot;,&quot;comment1&quot;:&quot;&quot;,&quot;deadline2&quot;:&quot;&quot;,&quot;comment2&quot;:&quot;&quot;,&quot;deadline3&quot;:&quot;&quot;,&quot;comment3&quot;:&quot;&quot;}',
            'release' => '2023-04-27 00:00:00',
            'deadline' => '2023-04-29 00:00:00',
            'qstart' => '2023-04-17',
            'username' => '2',
            'password' => 'Kong'
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'debug',
            'readonly'
        )),
    ),

    'Update an assignment' => array(
        'expected-output' => '{"debug":"NONE!","motd":"UNK"}',
        'service' => 'https://cms.webug.se/root/G2/students/c21axepe/LenaSYS/DuggaSys/duggaedservice.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'opt' = 'SAVDUGGA',
            'qid' = 'NULL',
            'name' = 'UpdatedAutomaticTest',
            'autograde' = '1',
            'gradesys' = '2',
            'template' = 'group-assignment',
            'jsondeadline' = '{&quot;deadline1&quot;:&quot;2023-04-30 0:0&quot;;&quot;comment1&quot;:&quot;&quot;;&quot;deadline2&quot;:&quot;&quot;;&quot;comment2&quot;:&quot;&quot;;&quot;deadline3&quot;:&quot;&quot;;&quot;comment3&quot;:&quot;&quot;}',
            'groupAssignment' = '1', 
            'release' = '2023-04-28 00:00:00',
            'deadline' = '2023-04-30 00:00:00',
            'qstart' = '2023-04-18',
            'username' = '2',
            'password' = 'Kong'
            )),
            'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'debug',
            'readonly'
            )),
    ),
    /*
    'create course test 2' => array(
        'expected-output' => '{"debug":"NONE!","motd":"UNK"}',
        'service' => 'https://cms.webug.se/root/G2/students/c21axepe/LenaSYS/DuggaSys/duggaedservice.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'opt' => 'NEW',
            'username' => 'usr',
            'password' => 'pass',
            'coursecode' => 'IT466G',
            'coursename' => 'TestCourseFromAPI5',
            'uid' => '101'
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'none'
        )),
    ),
    */
);

testHandler($testsData, false); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON
