<?php

include "../../Shared/test.php";   // Include the test file where this is sent to
include_once "../../../coursesyspw.php";
include_once "../../Shared/sessions.php";

$testsData = array(   // Test-data is saved on this array that is then tested in test.php file

    //TEST #1
    //Update firstname
    'Update-firstname' => array(  
        //Pre-values
        'query-before-test-1' => "INSERT INTO user(username, password) VALUES ('testuser1', 'testpwd');",
        'query-after-test-1' => "DELETE FROM user WHERE username = 'testuser1';",
        'service' => 'http://localhost/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',
                'opt' => 'UPDATE',
                'prop' => 'firstname',
                'val' => 'test',
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
        'expected-output' => '',
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
                'uid' => '<!query-before-test-2!><[0]["uid"]>',
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
        'query-before-test-1' => "INSERT INTO user(username, password) VALUES ('testuser1', 'testpwd');",
        'query-before-test-2' => "SELECT uid FROM user WHERE username = 'testuser1'",
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
                'uid' => '<!query-before-test-2!><[0]["uid"]>',
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
        'query-before-test-1' => "INSERT INTO user(username, password) VALUES ('testuser1', 'testpwd');",
        'query-before-test-2' => "SELECT uid FROM user WHERE username = 'testuser1'",
        'variables-query-before-test-1' => "uid",
        'query-after-test-1' => "DELETE FROM user WHERE username = 'testuser1';",
        'service' => 'http://localhost/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',
                'opt' => 'UPDATE',
                'prop' => 'username',
                'val' => 'test',
                'uid' => '<!query-before-test-2!><[0]["uid"]>',
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
        'query-before-test-1' => "INSERT INTO user(username, password) VALUES ('testuser1', 'testpwd');",
        'query-before-test-2' => "SELECT uid FROM user WHERE username = 'testuser1'",
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
                'uid' => '<!query-before-test-2!><[0]["uid"]>',
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
        'query-before-test-1' => "INSERT INTO course(creator, coursecode) VALUES ('1', 'testtest');",
        'query-before-test-2' => "INSERT INTO course_course(uid, cid, access) VALUES ('2', (SELECT cid FROM course WHERE coursecode = 'testtest'), 'test');",
        'query-before-test-3' => "SELECT cid FROM course WHERE coursecode = 'testtest'",
        'variables-query-before-test-1' => "cid",
        'query-after-test-1' => "DELETE FROM user_course WHERE cid = 'cid';",
        'query-after-test-2' => "DELETE FROM course WHERE cid = 'cid';",
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
                'cid' => '<!query-before-test-3!><[0]["cid"]>',
            ),
        ),
        //Send 2
        'service' => 'http://localhost/LenaSYS/DuggaSys/accessedservice.php',
        'service-data2' => serialize(
            array(
                // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',
                'opt' => 'UPDATE',
                'prop' => 'examiner',
                'val' => 'None',
                'uid' => '2',
                'cid' => '<!query-before-test-3!><[0]["cid"]>',
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
        'query-before-test-7' => "INSERT INTO course(creator, coursecode) VALUES ('1', 'testtest');",

        
        'query2-before-test-7' => "INSERT INTO user_course(uid, cid, access) VALUES ('2', (SELECT cid FROM course WHERE coursecode = 'testtest'), 'test');",

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
                'cid' => "SELECT cid FROM course WHERE coursecode = 'testtest'",
            )),
        'filter-output' => serialize(array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )),


        'cid' => "SELECT cid FROM course WHERE coursecode = 'testtest'",
        //Rätt platts för delete?
        'query-after-test-7' => "DELETE FROM user_course WHERE cid = 'cid';",
        'query2-after-test-7' => "DELETE FROM course WHERE cid = 'cid';",
    ),



    //TEST #8
    //Update version
    'Update-version' => array(  

        //Pre-values
        'query-before-test-8' => "INSERT INTO course(creator, coursecode) VALUES ('1', 'testtest');",


         //Pre-values2
         'query2-before-test-8' => "INSERT INTO user_course(uid, cid, access) VALUES (SELECT cid FROM course WHERE coursecode = 'testtest') , 'test');",

        'service' => 'http://localhost/LenaSYS/DuggaSys/tests/accessedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',

                'opt' => 'UPDATE',
                'prop' => 'vers',
                'val' => 'test',
                'uid' => '2',
                'cid' => "SELECT cid FROM course WHERE coursecode = 'testtest'",
            )),
        'filter-output' => serialize(array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )),

        'cid' => "SELECT cid FROM course WHERE coursecode = 'testtest'",
        //Rätt platts för delete?
        'query-after-test-8' => "DELETE FROM user_course WHERE cid = 'cid';",
        'query2-after-test-8' => "DELETE FROM course WHERE cid = 'cid';",
    ),



    //TEST #9
    //Update access
    'Update-access' => array(  

        //Pre-values
        'query-before-test-9' => "INSERT INTO course(creator, coursecode) VALUES ('1', 'testtest');",


        //Pre-values2
        'query2-before-test-9' => "INSERT INTO user_course(uid, cid, access) VALUES ('2', (SELECT cid FROM course WHERE coursecode = 'testtest'), 'test');",

        'service' => 'http://localhost/LenaSYS/DuggaSys/tests/accessedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',

                'opt' => 'UPDATE',
                'prop' => 'access',
                'val' => 'test',
                'uid' => '2',
                'cid' => "SELECT cid FROM course WHERE coursecode = 'testtest'",
            )),
        'filter-output' => serialize(array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )),
        
        'cid' => "SELECT cid FROM course WHERE coursecode = 'testtest'",
        //Rätt platts för delete?
        'query-after-test-9' => "DELETE FROM user_course WHERE cid = 'cid';",
        'query2-after-test-9' => "DELETE FROM course WHERE cid = 'cid';",
    ),



    //TEST #10
    //Update group
    'Update-group' => array(  

        //Pre-values
        'query-before-test-1' => "INSERT INTO course(creator, coursecode) VALUES ('1', 'testtest');",


        //Pre-values2
        'query2-before-test-1' => "INSERT INTO user_course(uid, cid, access) VALUES ('2', (SELECT cid FROM course WHERE coursecode = 'testtest'), 'test');",

        'service' => 'http://localhost/LenaSYS/DuggaSys/tests/accessedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',

                'opt' => 'UPDATE',
                'prop' => 'group',
                'val' => 'test',
                'uid' => '2',
                'cid' => "SELECT cid FROM course WHERE coursecode = 'testtest'",
            )),
        'filter-output' => serialize(array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )),

        'cid' => "SELECT cid FROM course WHERE coursecode = 'testtest'",

        //Rätt platts för delete?
        'cid' => "SELECT cid FROM course WHERE coursecode = 'testtest'",
        'query-after-test-10' => "DELETE FROM user_course WHERE cid = 'cid';",
        'query2-after-test-10' => "DELETE FROM course WHERE cid = 'cid';",
    ),


    //TEST #11
    //Add class
    'Add-class' => array(  

        'service' => 'http://localhost/LenaSYS/DuggaSys/tests/accessedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',

                'opt' => 'ADDCLASS',
                'class' => 'testClass',
                'responsible' => '2',
                'classname' => 'testClassName',
                'regcode' => '12345678',
                'classcode' => '87654321',
                'hp' => '7.5',
                'tempo' => '100',
                'hpProgress' => '1.5',
            )),
        'filter-output' => serialize(array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )),

        //Rätt platts för delete?
        'query-after-test-1' => "DELETE FROM class WHERE class = 'testClass';",
    ),


    //TEST #12
    //Change password
    'Change-password' => array(  

        //Pre-values
        'query-before-test-1' => "INSERT INTO user(username, password) VALUES ('testuser1', 'testpwd');",


        'service' => 'http://localhost/LenaSYS/DuggaSys/tests/accessedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',

                'opt' => 'CHPWD',
                'uid' => "SELECT uid FROM user WHERE username = 'testuser1'",
                'pwd' => '123123',
            )),
        'filter-output' => serialize(array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )),

        //Rätt platts för delete?
        'query-after-test-1' => "DELETE FROM user WHERE username = 'testuser1';",
    ),



    //TEST #13
    //Add user
    'Add-user' => array(  

        //Pre-values
        'query-before-test-13' => "INSERT INTO class(class, responsible, classname, regcode, classcode, hp, tempo, hpProgress) 
        VALUES ('testClass', '2', 'testClassName, '12345678', '87654321', '7.5', '100', '1.5');",

        'service' => 'http://localhost/LenaSYS/DuggaSys/tests/accessedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',
                
                'opt' => 'ADDUSR',
                'username' => 'testuser',
                'saveemail' => 'testmail',
                'firstname' => 'testfirstname',
                'lastname' => 'testlastname',
                'ssn' => 'testssn',
                'rnd' => 'testpassword',
                'className' => 'testClassName',
            )),
        'filter-output' => serialize(array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )),

        //Rätt platts för delete?
        'query-after-test-13' => "DELETE FROM user WHERE username = “testuser”;",
		'query2-after-test-13' => "DELETE FROM class WHERE class = “testClass”;",
    ),


    //TEST #14
    //Add user where no class exists
    'Add-user-no-class' => array(  


        'query-after-test-1' => "DELETE FROM user WHERE username = 'testuser';",
        'query-after-test-2' => "DELETE FROM class WHERE class = “testClass”;",

        'service' => 'http://localhost/LenaSYS/DuggaSys/tests/accessedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',

                'opt' => 'ADDUSR',
                'cstmt' => '0',
                'className' => 'testClass',
                'username' => 'testuser',
                'saveemail' => 'testmail',
                'firstname' => 'testfirstname',
                'lastname' => 'testlastname',
                'ssn' => 'testssn',
                'rnd' => 'testpassword',
                'className' => 'testClassName',
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
        'expected-output' => '',
        'pre-query' => "INSERT INTO course(creator, coursecode) VALUES('1', 'testtest');",

        'query-before-test-1' => "SELECT cid FROM course WHERE coursecode = 'testtest'",
        'variables-query-before-test-1' => "cid",

        'query-after-test-1' => "DELETE FROM user_course WHERE cid = 'cid';",
        'query-after-test-2' => "DELETE FROM user_course WHERE cid = 'cid';",

        'service' => 'http://localhost/LenaSYS/DuggaSys/tests/accessedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',

                'opt' => 'ADDUSR',
                'regstatus' => 'UNK',
                'uid' => '2',
                'cid' => '<!query-before-test-1!><[0]["cid"]>',
                'coursevers' => 'testvers',
            )),
        'filter-output' => serialize(array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )),


    )


);

echo json_encode($testsData); 

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON
?>