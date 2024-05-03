<?php
//------------------------------------------------------------------------------------------
// Test for the microservice updateUser_ms
// Tests that updating firstname, lastname, ssn, username and class works as expected
// See documentation for how it works:
// Shared/Documentation/Test API/Guide on how to use Test API.md  
//------------------------------------------------------------------------------------------

include "../../Shared/test.php";   // Include the test file where this is sent to

$testsData = array(   // Test-data is saved on this array that is then tested in test.php file

    //TEST #1
    //Update firstname
    'Update-firstname' => array(  
        'expected-output' => '{"entries":[{"username":"{\"username\":\"testuser1\"}","firstname":"{\"firstname\":\"testfirstname\"}"}]}',
        //Pre-values
        'query-before-test-1' => "INSERT INTO user(uid, username, password) VALUES (9997, 'testuser1', 'testpwd');",
        'query-before-test-2' => "INSERT INTO user_course(uid, cid, access) VALUES (9997, 1885, 'R');",
        'query-after-test-1' => "DELETE FROM user_course WHERE uid = '9997';",
        'query-after-test-2' => "DELETE FROM user WHERE uid = '9997';",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/accessedService/updateUsers_ms.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',
                'courseid' => '1885',
                'opt' => 'UPDATE',
                'uid' => '9997',
                'prop' => 'firstname',
                'val' => 'testfirstname',
            )),
        'filter-output' => serialize(array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'entries' => array(
                    'username',
                    'firstname'
                ),
            )),
        ),

    //TEST #2
    //Update lastname
    'Update-lastname' => array(
        'expected-output' => '{"entries":[{"username":"{\"username\":\"testuser1\"}","lastname":"{\"lastname\":\"testlastname\"}"}]}',
        //Pre-values
        'query-before-test-1' => "INSERT INTO user(uid, username, password) VALUES (9997, 'testuser1', 'testpwd');",
        'query-before-test-2' => "INSERT INTO user_course(uid, cid, access) VALUES (9997, 1885, 'R');",
        'query-after-test-1' => "DELETE FROM user_course WHERE uid = '9997';",
        'query-after-test-2' => "DELETE FROM user WHERE uid = '9997';",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/accessedService/updateUsers_ms.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',
                'courseid' => '1885',
                'opt' => 'UPDATE',
                'uid' => '9997',
                'prop' => 'lastname',
                'val' => 'testlastname',
            )),
        'filter-output' => serialize(array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'entries' => array(
                    'username',
                    'lastname'
                ),
            )),
        ),

    /*
    //TEST #3
    //Update ssn
    'Update-ssn' => array(  
        //Pre-values
        'expected-output' => '{"output":"PLACEHOLDER"}',
        'query-before-test-1' => "INSERT INTO user(username, password) VALUES ('testuser1', 'testpwd');",
        'query-before-test-2' => "SELECT uid FROM user WHERE username = 'testuser1';",
        'variables-query-before-test-1' => "uid",
        'query-after-test-1' => "DELETE FROM user WHERE username = 'testuser1';",
        'service' => 'http://localhost/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',
                'opt' => 'UPDATE',
                'prop' => 'ssn',
                'val' => 'test',
                'uid' => '<!query-before-test-2!><*[0]["uid"]*>',
            )),
        'filter-output' => serialize(array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )),
    ),

    //TEST #4
    //Update username
    'Update-username' => array(  
        //Pre-values
        'expected-output' => '{"output":"PLACEHOLDER"}',
        'query-before-test-1' => "INSERT INTO user(username, password) VALUES ('testuser1', 'testpwd');",
        'query-before-test-2' => "SELECT uid FROM user WHERE username = 'testuser1';",
        'query-after-test-1' => "DELETE FROM user WHERE username = 'testuser1';",
        'query-after-test-2' => "DELETE FROM user WHERE username = 'testuser2';",
        'service' => 'http://localhost/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',
                'opt' => 'UPDATE',
                'prop' => 'username',
                'val' => 'testuser2',
                'uid' => '<!query-before-test-2!><*[0]["uid"]*>',
            )),
        'filter-output' => serialize(array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )),
    ),

    //TEST #5
    //Update class
    'Update-class' => array(  
        //Pre-values
        'expected-output' => '{"output":"PLACEHOLDER"}',
        'query-before-test-1' => "INSERT INTO user(username, password) VALUES ('testuser1', 'testpwd');",
        'query-before-test-2' => "SELECT uid FROM user WHERE username = 'testuser1';",
        'variables-query-before-test-1' => "uid",
        'query-after-test-1' => "DELETE FROM user WHERE username = 'testuser1';",
        'service' => 'http://localhost/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',
                'opt' => 'UPDATE',
                'prop' => 'class',
                'val' => 'test',
                'uid' => '<!query-before-test-2!><*[0]["uid"]*>',
            )),
        'filter-output' => serialize(array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )),
    )*/
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON
?>