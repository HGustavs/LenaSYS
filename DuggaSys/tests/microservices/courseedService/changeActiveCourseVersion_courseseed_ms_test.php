<?php

include_once "../../../../Shared/test.php";

$testsData = array(
    'changeActiveCourseVersion_courseed' => array(
        'expected-output' => '"NONE!"',
        'query-after-test-1' => "DELETE FROM course SET activeversion=:vers WHERE cid=:cid",
        'service' => 'http://localhost/LenaSYS/DuggaSys/courseed.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'ADDCourse',
                'username' => 'brom',
                'password' => 'password',
                'newCourse' => '[["Testing-Course", "101", "testclass", "123", "TEST", 180, "100", null]]'
            )
        ),
        'filter-output' => serialize(
            array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )
        ),
    ),
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON
