<?php

include "../Shared/test.php";

$testsData = array(
    'Get active users' => array(
        'expected-output' => '{"debug":"NONE!","":""}',
        'service' => 'https://cms.webug.se/root/G2/students/a21oscgu/LenaSYS/DuggaSys/courseedservice.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'opt' => 'NEW',
            '' => '',
            '' => '',
            '' => '',
            '' => '',
            '' => ''
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'debug',
            'readonly'
        )),
    ),
    'Get active users' => array(
        'expected-output' => '{"debug":"NONE!","":""}',
        'service' => 'https://cms.webug.se/root/G2/students/a21oscgu/LenaSYS/DuggaSys/courseedservice.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'opt' => 'NEW',
            '' => '',
            '' => '',
            '' => '',
            '' => '',
            '' => ''
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'none'
        )),
    ),
);

testHandler($testsData, false); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON