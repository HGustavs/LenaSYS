<?php
include "../../../../Shared/test.php";
//------------------------------------------------------
// This test the microservice readCourseGroupsAndMembers_ms
//------------------------------------------------------


$testdata = array(
    'Read Course Groups and Members' => array(
        'expected-output' => '{"debug": "NONE!","coursevers": "1337","courseid": "1885","grpmembershp": "No_2","grplst": [["No_2",null,null,"Tester@student.his.se"],["No_2","Martin","Brobygge","martin.b@his.se"]]}',
        'query-before-test-1' => "INSERT INTO user_course (cid, vers, uid,groups,access) VALUES (1885,1337,3, 'No_2','W'), (1885,1337,101, 'No_2','W');",
        'query-after-test-1' => "DELETE FROM user_course WHERE uid=3 AND cid=1885;",
        'query-after-test-2' => "DELETE FROM user_course WHERE uid=101 AND cid=1885;",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/sectionedService/readCourseGroupsAndMembers_ms.php',
        'service-data' => serialize(
            array( // Data that service needs to execute function
                'opt' => 'GRP',
                'username' => 'brom',
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
    )
);

testHandler($testdata, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON