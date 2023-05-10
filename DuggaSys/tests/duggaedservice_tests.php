<?php

include "../../Shared/test.php";

$testsData = array(
    'create course test' => array(
        'expected-output' => '{"debug":"NONE!","motd":"UNK"}',
        'service' => 'https://cms.webug.se/root/G2/students/c21axepe/LenaSYS/DuggaSys/duggaedservice.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'opt' => 'GET',
            'cid' => '2',
            'coursevers' => '97732',
            'username' => 'toddler',
            'password' => 'Kong'
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'none'
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
