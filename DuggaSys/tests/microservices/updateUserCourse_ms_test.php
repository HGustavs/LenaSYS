<?php

include "../../../Shared/test.php";

$testsData = array(
    //------------------------------------------------------------------------------------------
    // This is a test-file for testing if it works to update data in the table UserCourse using microservice updateUserCourse_ms
    //------------------------------------------------------------------------------------------
    'setExaminer' => array(
        'expected-output' => '999',
        'query-before-test-1' => "INSERT INTO user(uid, username, password) VALUES (9999, 'testuser1', 'testpwd');",
        'query-before-test-2' => "INSERT INTO user_course(uid,cid) VALUES(9999, 3);",
        'query-after-test-1' => "DELETE FROM user WHERE uid = '9999';",
        'query-after-test-2' => "DELETE FROM user_course WHERE uid = '9999';",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/accessedService/updateUserCourse_ms.php',
        'service-data' => serialize(
            array( // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',
                'prop' => 'examiner',
                'courseid' => '3',
                'uid' => '9999',
            )
        ),
        'filter-output' => serialize(
            array( // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )
        ),
    ),

    'setVers' => array(
        'expected-output' => '999',
        'query-before-test-1' => "INSERT INTO user(uid, username, password) VALUES (9999, 'testuser1', 'testpwd');",
        'query-before-test-2' => "INSERT INTO user_course(uid,cid) VALUES(9999, 3);",
        'query-after-test-1' => "DELETE FROM user WHERE uid = '9999';",
        'query-after-test-2' => "DELETE FROM user_course WHERE uid = '9999';",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/accessedService/updateUserCourse_ms.php',
        'service-data' => serialize(
            array( // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',
                'vers' => '9999',
                'prop' => 'vers',
                'courseid' => '3',
                'uid' => '9999',
            )
        ),
        'filter-output' => serialize(
            array( // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )
        ),
    ),

    'setAccess' => array(
        'expected-output' => '999',
        'query-before-test-1' => "INSERT INTO user(uid, username, password) VALUES (9999, 'testuser1', 'testpwd');",
        'query-before-test-2' => "INSERT INTO user_course(uid,cid) VALUES(9999, 3);",
        'query-after-test-1' => "DELETE FROM user WHERE uid = 9999;",
        'query-after-test-2' => "DELETE FROM user_course WHERE uid = '9999';",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/accessedService/updateUserCourse_ms.php',
        'service-data' => serialize(
            array( // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',
                'access' => 'R',
                'prop' => 'access',
                'courseid' => '3',
                'uid' => '9999',
            )
        ),
        'filter-output' => serialize(
            array( // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )
        ),
    ),

    'setGroup' => array(
        'expected-output' => '999',
        'query-before-test-1' => "INSERT INTO user(uid, username, password) VALUES (9999, 'testuser1', 'testpwd');",
        'query-before-test-2' => "INSERT INTO user_course(uid,cid) VALUES(9999, 3);",
        'query-after-test-1' => "DELETE FROM user WHERE uid = 9999;",
        'query-after-test-2' => "DELETE FROM user_course WHERE uid = '9999';",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/accessedService/updateUserCourse_ms.php',
        'service-data' => serialize(
            array( // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',
                'group' => 'No_2',
                'prop' => 'group',
                'courseid' => '3',
                'uid' => '9999',
            )
        ),
        'filter-output' => serialize(
            array( // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )
        ),
    ),
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON