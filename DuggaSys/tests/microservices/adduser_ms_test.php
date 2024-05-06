<?php


$newusers_value = '[[null,"Help","He","Help@student.his.se",null,"HT-20",null]]';

$testsData = array(
    //------------------------------------------------------------------------------------------
    // This tests the microservice addUser_ms 
    //------------------------------------------------------------------------------------------
    'addUser_ms' => array(
        'expected-output' => '999',
        'query-before-test-1' => "INSERT INTO course (cid,coursecode,coursename,visibility,creator, hp, courseGitURL) VALUES(999,'test','toBeDeleted', 0, 1, 7.5, null)",
        'query-after-test-1' => "DELETE FROM course WHERE cid = 999;",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/showDuggaService/addUser_ms.php',
        'service-data' => serialize(
            array( // Data that service needs to execute function
                'opt' => 'ADDUSR',
                'username' => 'brom',
                'password' => 'password',
                'courseid' => '999',
                'coursevers' => '97732',
                'newusers' => $newusers_value,,
                'hash' => 'hjk4ert6',
                'AUtoken' => 999
            )
        ),
        'filter-output' => serialize(
            array( // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )
        ),
    ),
);

testHandler($testsData, true);


// $opt = getOP('opt');
// $cid = getOP('courseid');
// $newusers = getOP('newusers');
// $coursevers = getOP('coursevers');
// $log_uuid = getOP('log_uuid');





?>