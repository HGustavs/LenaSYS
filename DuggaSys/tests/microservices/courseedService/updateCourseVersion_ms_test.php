<?php

include_once "../../../../Shared/test.php";

$testsData = array(
    
    'updateCourseVersion_ms.php' => array(
        'expected-output' => '{"entries":[{"qname":"deleteDuggaTest"}]}',  
        'query-after-test-1' => "DELETE FROM vers WHERE vers =1336",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/courseedService/updateCourseVersion_ms.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',
                'opt' => 'CPYVRS',
                'cid' => 1885,
                'coursename' =>'Testing-Course',
                'coursenamealt' =>'UNK',
                'coursecode' =>'G1336',
                'versid' => 1336,
                'versname' =>'HT00',
                'copycourse' =>1337,
                'startdate' =>'2000-01-01 00:00:00',
                'enddate' =>'2000-02-02 00:00:00',
                'makeactive' => 0,
                'motd' =>'hey! hey!',
            )
        ),
        'filter-output' => serialize(
            array(
                'none'
            )
        ),
    ),
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON