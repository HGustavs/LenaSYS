<?php

include "../../Shared/test.php";   // Include the test file where this is sent to
include_once "../../../coursesyspw.php";
include_once "../../Shared/sessions.php";

$testsData = array(   // Test-data is saved on this array that is then tested in test.php file

    //TEST #1
    //Update firstname
    'Update firstname' => array(  

        //Pre-values
        'query-before-test-1' => "INSERT INTO user(username, password) VALUES ('testuser1', 'testpwd');",

        'uid' => function($connection) {
            $result = mysqli_query($connection, "SELECT uid FROM user WHERE username = 'testuser1'");
            $row = mysqli_fetch_assoc($result);
            return $row['uid'];
        },
        
        'expected-output' => '{"debug":"NONE!","writeaccess":true,"coursecode":"IT118G","coursename":"Webbutveckling - datorgrafik","entries":[{"qname":"Bitdugga1"},{"qname":"Bitdugga2"},{"qname":"colordugga1"},{"qname":"colordugga2"},{"qname":"linjedugga1"},{"qname":"linjedugga2"},{"qname":"dugga1"},{"qname":"dugga2"},{"qname":"Quiz"},{"qname":"Rapport"},{"qname":"HTML CSS Testdugga"},{"qname":"Clipping masking testdugga"},{"qname":"test"}]}',
        'service' => 'C:\xampp\htdocs\LenaSYS\DuggaSys\accessedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'UPDATE',
                'prop' => 'firstname',
                'val' => 'test',
                'uid' => $row['uid'],
            )),
        'filter-output' => serialize(array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )),

        //Rätt platts för delete?
        'query-after-test-1' => "DELETE FROM user WHERE username = 'testuser1';",
    ),




    //TEST #2
    //Update lastname
    'Update lastname' => array(  

        //Pre-values
        'query-before-test-1' => "INSERT INTO user(username, password) VALUES ('testuser1', 'testpwd');",

        'uid' => function($connection) {
            $result = mysqli_query($connection, "SELECT uid FROM user WHERE username = 'testuser1'");
            $row = mysqli_fetch_assoc($result);
            return $row['uid'];
        },

        'expected-output' => '{"debug":"NONE!","writeaccess":true,"coursecode":"IT118G","coursename":"Webbutveckling - datorgrafik","entries":[{"qname":"Bitdugga1"},{"qname":"Bitdugga2"},{"qname":"colordugga1"},{"qname":"colordugga2"},{"qname":"linjedugga1"},{"qname":"linjedugga2"},{"qname":"dugga1"},{"qname":"dugga2"},{"qname":"Quiz"},{"qname":"Rapport"},{"qname":"HTML CSS Testdugga"},{"qname":"Clipping masking testdugga"},{"qname":"test"}]}',
        'service' => 'C:\xampp\htdocs\LenaSYS\DuggaSys\accessedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'UPDATE',
                'prop' => 'lastname',
                'val' => 'test',
                'uid' => $row['uid'],
            )),
        'filter-output' => serialize(array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )),

        //Rätt platts för delete?
        'query-after-test-1' => "DELETE FROM user WHERE username = 'testuser1';",
    ),




    //TEST #3
    //Update ssn
    'Update ssn' => array(  

        //Pre-values
        'query-before-test-1' => "INSERT INTO user(username, password) VALUES ('testuser1', 'testpwd');",

        'uid' => function($connection) {
            $result = mysqli_query($connection, "SELECT uid FROM user WHERE username = 'testuser1'");
            $row = mysqli_fetch_assoc($result);
            return $row['uid'];
        },

        'expected-output' => '{"debug":"NONE!","writeaccess":true,"coursecode":"IT118G","coursename":"Webbutveckling - datorgrafik","entries":[{"qname":"Bitdugga1"},{"qname":"Bitdugga2"},{"qname":"colordugga1"},{"qname":"colordugga2"},{"qname":"linjedugga1"},{"qname":"linjedugga2"},{"qname":"dugga1"},{"qname":"dugga2"},{"qname":"Quiz"},{"qname":"Rapport"},{"qname":"HTML CSS Testdugga"},{"qname":"Clipping masking testdugga"},{"qname":"test"}]}',
        'service' => 'C:\xampp\htdocs\LenaSYS\DuggaSys\accessedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'UPDATE',
                'prop' => 'ssn',
                'val' => 'test',
                'uid' => $row['uid'],
            )),
        'filter-output' => serialize(array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )),

        //Rätt platts för delete?
        'query-after-test-1' => "DELETE FROM user WHERE username = 'testuser1';",
    ),



    //TEST #4
    //Update username
    'Update username' => array(  

        //Pre-values
        'query-before-test-1' => "INSERT INTO user(username, password) VALUES ('testuser1', 'testpwd');",

        'uid' => function($connection) {
            $result = mysqli_query($connection, "SELECT uid FROM user WHERE username = 'testuser1'");
            $row = mysqli_fetch_assoc($result);
            return $row['uid'];
        },

        'expected-output' => '{"debug":"NONE!","writeaccess":true,"coursecode":"IT118G","coursename":"Webbutveckling - datorgrafik","entries":[{"qname":"Bitdugga1"},{"qname":"Bitdugga2"},{"qname":"colordugga1"},{"qname":"colordugga2"},{"qname":"linjedugga1"},{"qname":"linjedugga2"},{"qname":"dugga1"},{"qname":"dugga2"},{"qname":"Quiz"},{"qname":"Rapport"},{"qname":"HTML CSS Testdugga"},{"qname":"Clipping masking testdugga"},{"qname":"test"}]}',
        'service' => 'C:\xampp\htdocs\LenaSYS\DuggaSys\accessedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'UPDATE',
                'prop' => 'username',
                'val' => 'test',
                'uid' => $row['uid'],
            )),
        'filter-output' => serialize(array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )),

        //Rätt platts för delete?
        'query-after-test-1' => "DELETE FROM user WHERE username = 'testuser1';",
    ),



    

    //TEST #5
    //Update class
    'Update class' => array(  

        //Pre-values
        'query-before-test-1' => "INSERT INTO user(username, password) VALUES ('testuser1', 'testpwd');",

        'uid' => function($connection) {
            $result = mysqli_query($connection, "SELECT uid FROM user WHERE username = 'testuser1'");
            $row = mysqli_fetch_assoc($result);
            return $row['uid'];
        },

        'expected-output' => '{"debug":"NONE!","writeaccess":true,"coursecode":"IT118G","coursename":"Webbutveckling - datorgrafik","entries":[{"qname":"Bitdugga1"},{"qname":"Bitdugga2"},{"qname":"colordugga1"},{"qname":"colordugga2"},{"qname":"linjedugga1"},{"qname":"linjedugga2"},{"qname":"dugga1"},{"qname":"dugga2"},{"qname":"Quiz"},{"qname":"Rapport"},{"qname":"HTML CSS Testdugga"},{"qname":"Clipping masking testdugga"},{"qname":"test"}]}',
        'service' => 'C:\xampp\htdocs\LenaSYS\DuggaSys\accessedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'UPDATE',
                'prop' => 'class',
                'val' => 'test',
                'uid' => $row['uid'],
            )),
        'filter-output' => serialize(array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )),

        //Rätt platts för delete?
        'query-after-test-1' => "DELETE FROM user WHERE username = 'testuser1';",
    ),



    //TEST #6
    //Update class
    'Update class' => array(  

        //Pre-values 1
        'query-before-test-6' => "INSERT INTO course(creator, coursecode) VALUES ('1', 'testtest');",

        'cid' => function($connection) {
            $result = mysqli_query($connection, "SELECT cid FROM course WHERE coursecode = 'testtest'");
            $row = mysqli_fetch_assoc($result);
            return $row['cid'];
        },

        //Pre-values 2
        'query2-before-test-6' => "INSERT INTO course_course(uid, cid, access) VALUES ('2', '".$row['cid']."' , 'test');",

        //Enligt modellen ska det bara vara en select för den första query inte säker på detta

        'expected-output' => '{"debug":"NONE!","writeaccess":true,"coursecode":"IT118G","coursename":"Webbutveckling - datorgrafik","entries":[{"qname":"Bitdugga1"},{"qname":"Bitdugga2"},{"qname":"colordugga1"},{"qname":"colordugga2"},{"qname":"linjedugga1"},{"qname":"linjedugga2"},{"qname":"dugga1"},{"qname":"dugga2"},{"qname":"Quiz"},{"qname":"Rapport"},{"qname":"HTML CSS Testdugga"},{"qname":"Clipping masking testdugga"},{"qname":"test"}]}',
        'service' => 'C:\xampp\htdocs\LenaSYS\DuggaSys\accessedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'UPDATE',
                'prop' => 'examiner',
                'val' => 'test',
                'uid' => '2',
                'cid' => $row['cid'],
            ),
            
            //Inte säker om det fungerar att ha en annan array här men vi får testa
            array(
                // Data that service needs to execute function
                'opt' => 'UPDATE',
                'prop' => 'examiner',
                'val' => 'None',
                'uid' => '2',
                'cid' => $row['cid'],
            )),
        'filter-output' => serialize(array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )),

        //Rätt platts för delete?
        'query-after-test-6' => "DELETE FROM user_course WHERE cid = '".$row['cid']."';",
        'query2-after-test-6' => "DELETE FROM course WHERE cid = '".$row['cid']."';",
    ),


    //TEST #7
    //Update class
    'Update class' => array(  

        //Pre-values
        'query-before-test-1' => "INSERT INTO user(username, password) VALUES ('testuser1', 'testpwd');",

        'uid' => function($connection) {
            $result = mysqli_query($connection, "SELECT uid FROM user WHERE username = 'testuser1'");
            $row = mysqli_fetch_assoc($result);
            return $row['uid'];
        },

        'expected-output' => '{"debug":"NONE!","writeaccess":true,"coursecode":"IT118G","coursename":"Webbutveckling - datorgrafik","entries":[{"qname":"Bitdugga1"},{"qname":"Bitdugga2"},{"qname":"colordugga1"},{"qname":"colordugga2"},{"qname":"linjedugga1"},{"qname":"linjedugga2"},{"qname":"dugga1"},{"qname":"dugga2"},{"qname":"Quiz"},{"qname":"Rapport"},{"qname":"HTML CSS Testdugga"},{"qname":"Clipping masking testdugga"},{"qname":"test"}]}',
        'service' => 'C:\xampp\htdocs\LenaSYS\DuggaSys\accessedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'UPDATE',
                'prop' => 'class',
                'val' => 'test',
                'uid' => $row['uid'],
            )),
        'filter-output' => serialize(array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )),

        //Rätt platts för delete?
        'query-after-test-1' => "DELETE FROM user WHERE username = 'testuser1';",
    ),



    //TEST #8
    //Update class
    'Update class' => array(  

        //Pre-values
        'query-before-test-1' => "INSERT INTO user(username, password) VALUES ('testuser1', 'testpwd');",

        'uid' => function($connection) {
            $result = mysqli_query($connection, "SELECT uid FROM user WHERE username = 'testuser1'");
            $row = mysqli_fetch_assoc($result);
            return $row['uid'];
        },

        'expected-output' => '{"debug":"NONE!","writeaccess":true,"coursecode":"IT118G","coursename":"Webbutveckling - datorgrafik","entries":[{"qname":"Bitdugga1"},{"qname":"Bitdugga2"},{"qname":"colordugga1"},{"qname":"colordugga2"},{"qname":"linjedugga1"},{"qname":"linjedugga2"},{"qname":"dugga1"},{"qname":"dugga2"},{"qname":"Quiz"},{"qname":"Rapport"},{"qname":"HTML CSS Testdugga"},{"qname":"Clipping masking testdugga"},{"qname":"test"}]}',
        'service' => 'C:\xampp\htdocs\LenaSYS\DuggaSys\accessedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'UPDATE',
                'prop' => 'class',
                'val' => 'test',
                'uid' => $row['uid'],
            )),
        'filter-output' => serialize(array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )),

        //Rätt platts för delete?
        'query-after-test-1' => "DELETE FROM user WHERE username = 'testuser1';",
    ),



    //TEST #9
    //Update class
    'Update class' => array(  

        //Pre-values
        'query-before-test-1' => "INSERT INTO user(username, password) VALUES ('testuser1', 'testpwd');",

        'uid' => function($connection) {
            $result = mysqli_query($connection, "SELECT uid FROM user WHERE username = 'testuser1'");
            $row = mysqli_fetch_assoc($result);
            return $row['uid'];
        },

        'expected-output' => '{"debug":"NONE!","writeaccess":true,"coursecode":"IT118G","coursename":"Webbutveckling - datorgrafik","entries":[{"qname":"Bitdugga1"},{"qname":"Bitdugga2"},{"qname":"colordugga1"},{"qname":"colordugga2"},{"qname":"linjedugga1"},{"qname":"linjedugga2"},{"qname":"dugga1"},{"qname":"dugga2"},{"qname":"Quiz"},{"qname":"Rapport"},{"qname":"HTML CSS Testdugga"},{"qname":"Clipping masking testdugga"},{"qname":"test"}]}',
        'service' => 'C:\xampp\htdocs\LenaSYS\DuggaSys\accessedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'UPDATE',
                'prop' => 'class',
                'val' => 'test',
                'uid' => $row['uid'],
            )),
        'filter-output' => serialize(array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )),

        //Rätt platts för delete?
        'query-after-test-1' => "DELETE FROM user WHERE username = 'testuser1';",
    ),



    //TEST #10
    //Update class
    'Update class' => array(  

        //Pre-values
        'query-before-test-1' => "INSERT INTO user(username, password) VALUES ('testuser1', 'testpwd');",

        'uid' => function($connection) {
            $result = mysqli_query($connection, "SELECT uid FROM user WHERE username = 'testuser1'");
            $row = mysqli_fetch_assoc($result);
            return $row['uid'];
        },

        'expected-output' => '{"debug":"NONE!","writeaccess":true,"coursecode":"IT118G","coursename":"Webbutveckling - datorgrafik","entries":[{"qname":"Bitdugga1"},{"qname":"Bitdugga2"},{"qname":"colordugga1"},{"qname":"colordugga2"},{"qname":"linjedugga1"},{"qname":"linjedugga2"},{"qname":"dugga1"},{"qname":"dugga2"},{"qname":"Quiz"},{"qname":"Rapport"},{"qname":"HTML CSS Testdugga"},{"qname":"Clipping masking testdugga"},{"qname":"test"}]}',
        'service' => 'C:\xampp\htdocs\LenaSYS\DuggaSys\accessedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'UPDATE',
                'prop' => 'class',
                'val' => 'test',
                'uid' => $row['uid'],
            )),
        'filter-output' => serialize(array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )),

        //Rätt platts för delete?
        'query-after-test-1' => "DELETE FROM user WHERE username = 'testuser1';",
    ),


    //TEST #11
    //Update class
    'Update class' => array(  

        //Pre-values
        'query-before-test-1' => "INSERT INTO user(username, password) VALUES ('testuser1', 'testpwd');",

        'uid' => function($connection) {
            $result = mysqli_query($connection, "SELECT uid FROM user WHERE username = 'testuser1'");
            $row = mysqli_fetch_assoc($result);
            return $row['uid'];
        },

        'expected-output' => '{"debug":"NONE!","writeaccess":true,"coursecode":"IT118G","coursename":"Webbutveckling - datorgrafik","entries":[{"qname":"Bitdugga1"},{"qname":"Bitdugga2"},{"qname":"colordugga1"},{"qname":"colordugga2"},{"qname":"linjedugga1"},{"qname":"linjedugga2"},{"qname":"dugga1"},{"qname":"dugga2"},{"qname":"Quiz"},{"qname":"Rapport"},{"qname":"HTML CSS Testdugga"},{"qname":"Clipping masking testdugga"},{"qname":"test"}]}',
        'service' => 'C:\xampp\htdocs\LenaSYS\DuggaSys\accessedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'UPDATE',
                'prop' => 'class',
                'val' => 'test',
                'uid' => $row['uid'],
            )),
        'filter-output' => serialize(array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )),

        //Rätt platts för delete?
        'query-after-test-1' => "DELETE FROM user WHERE username = 'testuser1';",
    ),


    //TEST #12
    //Update class
    'Update class' => array(  

        //Pre-values
        'query-before-test-1' => "INSERT INTO user(username, password) VALUES ('testuser1', 'testpwd');",

        'uid' => function($connection) {
            $result = mysqli_query($connection, "SELECT uid FROM user WHERE username = 'testuser1'");
            $row = mysqli_fetch_assoc($result);
            return $row['uid'];
        },

        'expected-output' => '{"debug":"NONE!","writeaccess":true,"coursecode":"IT118G","coursename":"Webbutveckling - datorgrafik","entries":[{"qname":"Bitdugga1"},{"qname":"Bitdugga2"},{"qname":"colordugga1"},{"qname":"colordugga2"},{"qname":"linjedugga1"},{"qname":"linjedugga2"},{"qname":"dugga1"},{"qname":"dugga2"},{"qname":"Quiz"},{"qname":"Rapport"},{"qname":"HTML CSS Testdugga"},{"qname":"Clipping masking testdugga"},{"qname":"test"}]}',
        'service' => 'C:\xampp\htdocs\LenaSYS\DuggaSys\accessedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'UPDATE',
                'prop' => 'class',
                'val' => 'test',
                'uid' => $row['uid'],
            )),
        'filter-output' => serialize(array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )),

        //Rätt platts för delete?
        'query-after-test-1' => "DELETE FROM user WHERE username = 'testuser1';",
    ),



    //TEST #13
    //Update class
    'Update class' => array(  

        //Pre-values
        'query-before-test-1' => "INSERT INTO user(username, password) VALUES ('testuser1', 'testpwd');",

        'uid' => function($connection) {
            $result = mysqli_query($connection, "SELECT uid FROM user WHERE username = 'testuser1'");
            $row = mysqli_fetch_assoc($result);
            return $row['uid'];
        },

        'expected-output' => '{"debug":"NONE!","writeaccess":true,"coursecode":"IT118G","coursename":"Webbutveckling - datorgrafik","entries":[{"qname":"Bitdugga1"},{"qname":"Bitdugga2"},{"qname":"colordugga1"},{"qname":"colordugga2"},{"qname":"linjedugga1"},{"qname":"linjedugga2"},{"qname":"dugga1"},{"qname":"dugga2"},{"qname":"Quiz"},{"qname":"Rapport"},{"qname":"HTML CSS Testdugga"},{"qname":"Clipping masking testdugga"},{"qname":"test"}]}',
        'service' => 'C:\xampp\htdocs\LenaSYS\DuggaSys\accessedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
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
		'query-after-test-13-2' => "DELETE FROM class WHERE class = “testClass”;",
    ),


    //TEST #14
    //Update class
    'Update class' => array(  

        //Pre-values
        'query-before-test-1' => "INSERT INTO user(username, password) VALUES ('testuser1', 'testpwd');",

        'uid' => function($connection) {
            $result = mysqli_query($connection, "SELECT uid FROM user WHERE username = 'testuser1'");
            $row = mysqli_fetch_assoc($result);
            return $row['uid'];
        },

        'expected-output' => '{"debug":"NONE!","writeaccess":true,"coursecode":"IT118G","coursename":"Webbutveckling - datorgrafik","entries":[{"qname":"Bitdugga1"},{"qname":"Bitdugga2"},{"qname":"colordugga1"},{"qname":"colordugga2"},{"qname":"linjedugga1"},{"qname":"linjedugga2"},{"qname":"dugga1"},{"qname":"dugga2"},{"qname":"Quiz"},{"qname":"Rapport"},{"qname":"HTML CSS Testdugga"},{"qname":"Clipping masking testdugga"},{"qname":"test"}]}',
        'service' => 'C:\xampp\htdocs\LenaSYS\DuggaSys\accessedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
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

        //Rätt platts för delete?
        'query-after-test-14' => "DELETE FROM user WHERE username = 'testuser1';",
        'query-after-test-14-2' => "DELETE FROM class WHERE class = “testClass”;",
    ),



    //TEST #15
    //Connect user to user_course
    'Connect user to user_course' => array(  

        //Pre-values
        'pre-query' => "INSERT INTO course(creator, coursecode) VALUES('1', 'testtest');",

        'cid' => function($connection) {
            $result = mysqli_query($connection, "SELECT cid FROM user_course WHERE cid = '1'");
            $row = mysqli_fetch_assoc($result);
            return $row['cid'];
        },

        'expected-output' => '{"debug":"NONE!","writeaccess":true,"coursecode":"IT118G","coursename":"Webbutveckling - datorgrafik","entries":[{"qname":"Bitdugga1"},{"qname":"Bitdugga2"},{"qname":"colordugga1"},{"qname":"colordugga2"},{"qname":"linjedugga1"},{"qname":"linjedugga2"},{"qname":"dugga1"},{"qname":"dugga2"},{"qname":"Quiz"},{"qname":"Rapport"},{"qname":"HTML CSS Testdugga"},{"qname":"Clipping masking testdugga"},{"qname":"test"}]}',
        'service' => 'C:\xampp\htdocs\LenaSYS\DuggaSys\accessedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'ADDUSR',
                'regstatus' => 'UNK',
                'uid' => '2',
                'cid' => $row['cid'],
                'coursevers' => 'testvers',
            )),
        'filter-output' => serialize(array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )),

        'query-after-test-15' => "DELETE FROM user_course WHERE cid = '".$row['cid']."';",
        'query-after-test-16' => "DELETE FROM course WHERE cid= '".$row['cid']."';",

    )


);

echo json_encode($testsData); 

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON
?>