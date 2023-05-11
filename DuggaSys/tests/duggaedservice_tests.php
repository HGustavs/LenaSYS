<?php
 
 include "../Shared/test.php";
  
 $testsData = array(
     'create course test' => array(
         'expected-output' => '{"debug":"NONE!","motd":"UNK"}',
         'query-before-test' => "INSERT INTO course (coursecode,coursename,visibility,creator, hp) VALUES('IT401G','MyAPICourse',0,101, 7.5)",
         'query-after-test' => "DELETE FROM course WHERE coursecode = 'IT478G' AND coursename = 'APICreateCourseTestQuery'",
         'service' => 'https://cms.webug.se/root/G2/students/c21alest/LenaSYS/DuggaSys/courseedservice.php',
         'service-data' => serialize(array( // Data that service needs to execute function
             'opt' => 'NEW',
             'username' => 'usr',
             'password' => 'pass',
             'coursecode' => 'IT466G',
             'coursename' => 'TestCourseFromAPI4',
             'uid' => '101'
         )),
         'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
             'debug',
             'readonly'
         )),
     ),
     'create course test 2' => array(
         'expected-output' => '{"debug":"NONE!","motd":"UNK"}',
         'service' => 'https://cms.webug.se/root/G2/students/c21alest/LenaSYS/DuggaSys/courseedservice.php',
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
 );
  
 testHandler($testsData, false); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON