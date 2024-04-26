<?php

include "../../Shared/test.php";   // Include the test file where this is sent to

$testsData = array(   // Test-data is saved on this array that is then tested in test.php file

    //TEST #1
    //Update firstname
    'Update-firstname' => array(  
        'expected-output'   => '{"output":"PLACEHOLDER"}',
        //Pre-values
        'query-before-test-1' => "INSERT INTO user(username, password) VALUES ('testuser1', 'testpwd');",
        'query-after-test-1' => "DELETE FROM user WHERE username = 'testuser1';",
        'query-after-test-2' => "DELETE FROM user WHERE username = 'testuser2';",
        'service' => 'http://localhost/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',
                'opt' => 'UPDATE',
                'prop' => 'firstname',
                'val' => 'testuser2',
            )),
        'filter-output' => serialize(array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )),
        ),

    //TEST #2
    //Update lastname
    'Update-lastname' => array(
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
                'prop' => 'lastname',
                'val' => 'test',
                'uid' => '<!query-before-test-2!><*[0]["uid"]*>',
            )),
        'filter-output' => serialize(array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )),
    ),

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
    ),

    //TEST #6
    //Update examiner
    'Update-examiner' => array(  
        //Pre-values
        'expected-output' => '{"output":"PLACEHOLDER"}',
        'query-before-test-1' => "INSERT INTO course(creator, cid, coursecode) VALUES (1, 9999, 'testtest');",
        'query-before-test-2' => "INSERT INTO user_course(uid, cid, access) VALUES (2, 9999, 'test');",
        'query-before-test-3' => "SELECT cid FROM course WHERE coursecode = 'testtest'",
        'query-after-test-1' => "DELETE FROM user_course WHERE cid = 9999;",
        'query-after-test-2' => "DELETE FROM course WHERE cid = 9999;",
        'service' => 'http://localhost/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',
                'opt' => 'UPDATE',
                'prop' => 'examiner',
                'val' => 'test',
                'uid' => '2',
                'cid' => '<!query-before-test-3!><*[0]["cid"]*>',
            ),
        ),
        'filter-output' => serialize(array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )),
    ),
    //TEST #7
    //Update examiner to none
    'Update-examiner-to-none' => array(  
        //Pre-values
        'expected-output' => '{"output":"PLACEHOLDER"}',
        'query-before-test-1' => "INSERT INTO course(creator, cid, coursecode) VALUES (1, 9999, 'testtest');",
        'variables-query-before-test-1' => "cid",
        'query-before-test-2' => "INSERT INTO user_course(uid, cid, access) VALUES (2, 9999, 'test');",
        'query-before-test-3' => "SELECT cid FROM course WHERE coursecode = 'testtest';",
        'query-after-test-1' => "DELETE FROM user_course WHERE cid = 9999",
        'query-after-test-2' => "DELETE FROM course WHERE cid = 9999;",
        'service' => 'http://localhost/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',
                'opt' => 'UPDATE',
                'prop' => 'examiner',
                'val' => 'None',
                'uid' => '2',
                'cid' => '<!query-before-test-3!><*[0]["cid"]*>',
            )),
        'filter-output' => serialize(array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )),
    ),

    //TEST #8
    //Update version
    'Update-version' => array(  
        //Pre-values
        'expected-output' => '{"output":"PLACEHOLDER"}',
        'query-before-test-1' => "INSERT INTO course(creator, cid, coursecode) VALUES (1, 9999, 'testtest');",
        'query-before-test-2' => "INSERT INTO user_course(uid, cid, access) VALUES (2, 9999, 'test');",
        'query-before-test-3' => "SELECT cid FROM course WHERE coursecode = 'testtest';",
        'variables-query-before-test-1' => "cid",
        'query-after-test-1' => "DELETE FROM user_course WHERE cid = 9999;",
        'query-after-test-2' => "DELETE FROM course WHERE cid = 9999;",
        'service' => 'http://localhost/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',
                'opt' => 'UPDATE',
                'prop' => 'vers',
                'val' => 'test',
                'uid' => '2',
                'cid' => '<!query-before-test-3!><*[0]["cid"]*>',
            )),
        'filter-output' => serialize(array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )),
    ),
    //TEST #9
    //Update access
    'Update-access' => array(  
        //Pre-values
        'expected-output' => '{"output":"PLACEHOLDER"}',

        'query-before-test-1' => "INSERT INTO course(creator, cid, coursecode) VALUES (1, 9999, 'testtest');",
        'query-before-test-2' => "INSERT INTO user_course(uid, cid, access) VALUES (2, 9999, 'test');",
        'query-before-test-3' => "SELECT cid FROM course WHERE coursecode = 'testtest';",
        'variables-query-before-test-1' => "cid",
        'query-after-test-1' => "DELETE FROM user_course WHERE cid = 9999;",
        'query-after-test-2' => "DELETE FROM course WHERE cid = 9999;",
        'service' => 'http://localhost/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',
                'opt' => 'UPDATE',
                'prop' => 'access',
                'val' => 'test',
                'uid' => '2',
                'cid' => '<!query-before-test-3!><*[0]["cid"]*>',
            )),
        'filter-output' => serialize(array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )),
    ),
    //TEST #10
    //Update group
    'Update-group' => array(  
        //Pre-values
        'expected-output' => '{"output":"PLACEHOLDER"}',
        'query-before-test-1' => "INSERT INTO course(creator, cid, coursecode) VALUES (1, 9999, 'testtest');",
        'query-before-test-2' => "INSERT INTO user_course(uid, cid, access) VALUES (2, 9999, 'test');",
        'query-before-test-3' => "SELECT cid FROM course WHERE coursecode = 'testtest';",
        'variables-query-before-test-1' => "cid",
        'query-after-test-1' => "DELETE FROM user_course WHERE cid = 9999;",
        'query-after-test-2' => "DELETE FROM course WHERE cid = 9999;",
        'service' => 'http://localhost/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',
                'opt' => 'UPDATE',
                'prop' => 'group',
                'val' => 'test',
                'uid' => '2',
                'cid' => '<!query-before-test-3!><*[0]["cid"]*>',
            )),
        'filter-output' => serialize(array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )),
    ),
    //TEST #11
    //Add class / Working test
    'Add-class' => array(  
        'expected-output' => '{"classes":[{"class":"DVSUG13h"},{"class":"Testclass1"},{"class":"WEBUG13h"},{"class":"WEBUG14h"}]}',
        'query-after-test-1' => "DELETE FROM class WHERE class = 'Testclass1';",
        'service' => 'http://localhost/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',
                'opt' => 'ADDCLASS',
                'newclass' => '[["Testclass1","101","testclass","199399","WEBUG",180,"100",null]]'
            )),
        'filter-output' => serialize(array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'classes'
            )),
    ),
    //TEST #12
    //Change password
    'Change-password' => array(  
        //Pre-values
        'expected-output' => '{"output":"PLACEHOLDER"}',
        'query-before-test-1' => "INSERT INTO user(username, password) VALUES ('testuser1', 'testpwd');",
        'query-before-test-2' => "SELECT uid FROM user WHERE username = 'testuser1';",
        'query-after-test-1' => "DELETE FROM user WHERE username = 'testuser1';",
        'service' => 'http://localhost/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',
                'opt' => 'CHPWD',
                'uid' => '<!query-before-test-2!><*[0]["uid"]*>',
                'pwd' => 'testpwd',
            )),
        'filter-output' => serialize(array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )),
    ),

    //TEST #13
    //Add user
    'Add-user' => array(  
        //Pre-values
        'expected-output' => '{"output":"PLACEHOLDER"}',
        'query-after-test-1' => "DELETE FROM user_course WHERE cid = '1885';",
        'query-after-test-2' => "DELETE FROM user WHERE username = 'Addtest123';",
        'service' => 'http://localhost/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',
                'opt' => 'ADDUSR',
                'newusers' => '[["471212-1234","Fname","Lname","Addtest123@student.his.se","testClass","HT-14",0]]',
                'courseid' => '1885',
                'coursevers'=> '1337'
            )),
        'filter-output' => serialize(array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'entries' => array(
                    'username',
                    'class'
                ),
            )),
    ),

    //TEST #14
    //Add user where no class exists
    'Add-user-no-class' => array(  
        'expected-output' => '{"output":"PLACEHOLDER"}',
        'query-after-test-1' => "DELETE FROM user WHERE username = 'testuser';",
        'query-after-test-2' => "DELETE FROM class WHERE class = 'testClass';",
        'service' => 'http://localhost/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',
                'opt' => 'ADDUSR',
                'cstmt' => '0',
                'className' => 'testClass',
                'saveemail' => 'testmail',
                'firstname' => 'testfirstname',
                'lastname' => 'testlastname',
                'ssn' => 'testssn',
                'rnd' => 'testpassword',
            )),
        'filter-output' => serialize(array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )),
    ),

    //TEST #15
    //Connect user to user_course
    'Connect-user-to-user-course' => array(  
        //Pre-values
        'expected-output' => '{"output":"PLACEHOLDER"}',
        'query-before-test-1' => "INSERT INTO course(creator, cid, coursecode) VALUES(1, 9999, 'testtest');",
        'query-before-test-2' => "SELECT cid FROM course WHERE coursecode = 'testtest';",
        'query-after-test-1' => "DELETE FROM user_course WHERE cid = 9999;",
        'query-after-test-2' => "DELETE FROM course WHERE cid = 9999;",
        'service' => 'http://localhost/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',
                'opt' => 'ADDUSR',
                'regstatus' => 'UNK',
                'uid' => '2',
                'cid' => '<!query-before-test-2!><*[0]["cid"]*>',
                'coursevers' => 'testvers',
            )),
        'filter-output' => serialize(array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )),
        ),


);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON
?>