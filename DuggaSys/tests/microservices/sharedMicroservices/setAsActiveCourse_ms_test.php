<?php

include_once "../../../../Shared/test.php";

$testsData = array(
    'setAsActiveCourse_ms' => array(
        'expected-output' => '{"status":"success"}',

		'query-before-test-1' => "INSERT INTO course (cid, coursename, coursecode, activeversion, creator) VALUES (99999, 'Test Course', 'TC999', 12345, 1) ON DUPLICATE KEY UPDATE activeversion = 12345;",

        'query-after-test-1' => "DELETE FROM course WHERE cid = 99999;",

        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/sharedMicroservices/setAsActiveCourse_ms.php',
        'service-data' => serialize(
            array(
                'cid' => 99999,
                'versid' => 54321,
                'username' => 'brom',
                'password' => 'password'
            )
        ),

        'filter-output' => serialize(
            array(
                'status'
            )
        ),
    )
);

testHandler($testsData, true);
