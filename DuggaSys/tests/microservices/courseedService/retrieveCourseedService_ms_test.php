<?php
//------------------------------------------------------------------------------------------------
// Test for the microservice retrieveCourseedService
//------------------------------------------------------------------------------------------------

include "../../../../Shared/test.php";  

$testsData = array(  

    //TEST #1
    'Retrieve-public-course' => array(  
        'expected-output' => '{"entries":[{"cid":"1001","coursename":"Test Course","visibility":"1","registered":false}]}',
        'query-before-test-1' => "INSERT INTO user(uid, username) VALUES (9997, 'testuser1');", // Ensure user exists first
        'query-before-test-2' => "INSERT INTO course(cid, coursename, visibility, creator) VALUES (1001, 'Test Course', 1, 9997);", // Then insert course with reference to user
        'query-after-test-1' => "DELETE FROM course WHERE cid = '1001';",
        'query-after-test-2' => "DELETE FROM user WHERE uid = '9997';",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/retrieveCourseedService_ms.php',
        'service-data' => serialize(
            array(
                'username' => 'brom',
                'password' => 'password',
                'cid' => '1001',
                'opt' => 'RETRIEVE'
            )),
        'filter-output' => serialize(array(
                'entries' => array(
                    'cid',
                    'coursename',
                    'visibility',
                    'registered'
                ),
            )),
        ),

    //TEST #2
    'Retrieve-deleted-course-superuser' => array(
        'expected-output' => '{"entries":[{"cid":"1002","coursename":"Old Course","visibility":"3","registered":false}]}',
        'query-before-test-1' => "INSERT INTO user(uid, username) VALUES (9998, 'superuser');", // Insert user first
        'query-before-test-2' => "INSERT INTO course(cid, coursename, visibility, creator) VALUES (1002, 'Old Course', 3, 9998);", // Then insert course
        'query-after-test-1' => "DELETE FROM course WHERE cid = '1002';",
        'query-after-test-2' => "DELETE FROM user WHERE uid = '9998';",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/retrieveCourseedService_ms.php',
        'service-data' => serialize(
            array(
                'username' => 'superuser',
                'cid' => '1002',
                'opt' => 'RETRIEVE'
            )),
        'filter-output' => serialize(array(
                'entries' => array(
                    'cid',
                    'coursename',
                    'visibility',
                    'registered'
                ),
        )),
    ),
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON
?>
