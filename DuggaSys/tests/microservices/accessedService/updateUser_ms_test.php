<?php
//------------------------------------------------------------------------------------------
// Test for the microservice updateUser_ms
// Tests that updating firstname, lastname, ssn, username and class works as expected
//------------------------------------------------------------------------------------------

include "../../../../Shared/test.php";

$testsData = array(
    //TEST #1 - Update firstname
    'Update-firstname' => array(
        'expected-output' => '{"entries":[{"username":"{\"username\":\"Grimling\"}","firstname":"{\"firstname\":\"testfirstname\"}"}],"debug":"NONE!"}',

        'query-before-test-1' => "INSERT INTO user_course(uid, cid, access) VALUES (1, 1885, 'R');",
        'query-after-test-1' => "DELETE FROM user_course WHERE cid = 1885;",
        'query-after-test-2' => "UPDATE user SET firstname = 'Johan' WHERE uid = 1;",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/accessedService/updateUser_ms.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',
                'courseid' => '1885',
                'opt' => 'UPDATEUSER',
                'uid' => '1',
                'prop' => 'firstname',
                'firstname' => 'testfirstname',
            )
        ),
        'filter-output' => serialize(
            array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'entries' => array(
                    'username',
                    'firstname'
                ),
                'debug'
            )
        ),
    ),

    //TEST #2 - Update lastname
    'Update-lastname' => array(
        'expected-output' => '{"entries":[{"username":"{\"username\":\"Grimling\"}","lastname":"{\"lastname\":\"testlastname\"}"}],"debug":"NONE!"}',

        'query-before-test-1' => "INSERT INTO user_course(uid, cid, access) VALUES (1, 1885, 'R');",
        'query-after-test-1' => "DELETE FROM user_course WHERE cid = 1885;",
        'query-after-test-2' => "UPDATE user SET lastname = 'Grimling' WHERE uid = 1;",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/accessedService/updateUser_ms.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',
                'courseid' => '1885',
                'opt' => 'UPDATEUSER',
                'uid' => '1',
                'prop' => 'lastname',
                'lastname' => 'testlastname',
            )
        ),
        'filter-output' => serialize(
            array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'entries' => array(
                    'username',
                    'lastname'
                ),
                'debug'
            )
        ),
    ),

    //TEST #3 - Update ssn
    'Update-ssn' => array(
        'expected-output' => '{"entries":[{"username":"{\"username\":\"Grimling\"}","ssn":"{\"ssn\":\"123456-1234\"}"}],"debug":"NONE!"}',

        'query-before-test-1' => "INSERT INTO user_course(uid, cid, access) VALUES (1, 1885, 'R');",
        'query-after-test-1' => "DELETE FROM user_course WHERE cid = 1885;",
        'query-after-test-2' => "UPDATE user SET ssn = '810101-5567' WHERE uid = 1;",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/accessedService/updateUser_ms.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',
                'courseid' => '1885',
                'opt' => 'UPDATEUSER',
                'uid' => '1',
                'prop' => 'ssn',
                'ssn' => '123456-1234',
            )
        ),
        'filter-output' => serialize(
            array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'entries' => array(
                    'username',
                    'ssn'
                ),
                'debug'
            )
        ),
    ),

    //TEST #4 - Update username
    'Update-username' => array(
        'expected-output' => '{"entries":[{"username":"{\"username\":\"testusername\"}"}],"debug":"NONE!"}',

        'query-before-test-1' => "INSERT INTO user_course(uid, cid, access) VALUES (1, 1885, 'R');",
        'query-after-test-1' => "DELETE FROM user_course WHERE cid = 1885;",
        'query-after-test-2' => "UPDATE user SET username = 'Grimling' WHERE uid = 1;",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/accessedService/updateUser_ms.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',
                'courseid' => '1885',
                'opt' => 'UPDATEUSER',
                'uid' => '1',
                'prop' => 'username',
                'user_name' => 'testusername',
            )
        ),
        'filter-output' => serialize(
            array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'entries' => array(
                    'username',
                ),
                'debug'
            )
        ),
    ),

    //TEST #5 - Update class
    'Update-class' => array(
        'expected-output' => '{"entries":[{"username":"{\"username\":\"Grimling\"}","class":"{\"class\":\"DVSUG\"}"}],"debug":"NONE!"}',

        'query-before-test-1' => "INSERT INTO user_course(uid, cid, access) VALUES (1, 1885, 'R');",
        'query-after-test-1' => "DELETE FROM user_course WHERE cid = 1885;",
        'query-after-test-2' => "UPDATE user SET class = NULL WHERE uid = 1;",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/accessedService/updateUser_ms.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',
                'courseid' => '1885',
                'opt' => 'UPDATEUSER',
                'uid' => '1',
                'prop' => 'class',
                'className' => 'DVSUG',
            )
        ),
        'filter-output' => serialize(
            array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'entries' => array(
                    'username',
                    'class'
                ),
                'debug'
            )
        ),
    ),
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON
