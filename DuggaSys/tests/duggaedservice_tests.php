<?php
 
 include "../Shared/test.php";
  
 $testsData = array(
     'create an assignment' => array(
         'expected-output' => '{"debug":"NONE!","motd":"UNK"}',
         //This test has no pre querys since its only an insert
         /*'query-before-test' => "INSERT INTO course (coursecode,coursename,visibility,creator, hp) VALUES('IT401G','MyAPICourse',0,101, 7.5)",*/
         'query-after-test' => "DELETE FROM quiz WHERE id = 'UNK'",
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

     'create course test 2' => array(
         'expected-output' => '{"debug":"NONE!","motd":"UNK"}',
         'query-before-test' => "INSERT INTO quiz(cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,creator,vers,qstart,jsondeadline,`group`) 
         VALUES (null, 1885, 0, 1, 'AutomaticTest', 'Quiz', '2023-04-27 00:00:00', '2023-04-29 00:00:00', 2, '1337', '2023-04-17', '{&quot;deadline1&quot;:&quot;2023-04-27 0:0&quot;,&quot;comment1&quot;:&quot;&quot;,&quot;deadline2&quot;:&quot;&quot;,&quot;comment2&quot;:&quot;&quot;,&quot;deadline3&quot;:&quot;&quot;,&quot;comment3&quot;:&quot;&quot;}', 0);",
         'query-after-test' => "DELETE FROM quiz WHERE id = 'prevalue0????'",
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
 );
  
 testHandler($testsData, false); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON