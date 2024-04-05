<?php

include "../../Shared/test.php";   // Include the test file where this is sent to
include_once "../../../coursesyspw.php";

$testsData = array(   // Test-data is saved on this array that is then tested in test.php file

    //TEST #1
    //Update firstname
    'Update firstname' => array(  

        //Pre-values
        'query-before-test-1' => "INSERT INTO user(username, password) VALUES ('testuser1', 'testpwd');",

        'query-get-new-user' =>	"SELECT uid FROM user WHERE username= 'testuser1';",

        'expected-output' => '{"debug":"NONE!","writeaccess":true,"coursecode":"IT118G","coursename":"Webbutveckling - datorgrafik","entries":[{"qname":"Bitdugga1"},{"qname":"Bitdugga2"},{"qname":"colordugga1"},{"qname":"colordugga2"},{"qname":"linjedugga1"},{"qname":"linjedugga2"},{"qname":"dugga1"},{"qname":"dugga2"},{"qname":"Quiz"},{"qname":"Rapport"},{"qname":"HTML CSS Testdugga"},{"qname":"Clipping masking testdugga"},{"qname":"test"}]}',
        'service' => 'C:\xampp\htdocs\LenaSYS\DuggaSys\accessedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'pw' => 'testpwd',
                'cid' => 'IT119G',
                'opt' => 'ADDCLASS',
                'uid' => 'testuser1',
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

        'expected-output' => '{"debug":"NONE!","writeaccess":true,"coursecode":"IT118G","coursename":"Webbutveckling - datorgrafik","entries":[{"qname":"Bitdugga1"},{"qname":"Bitdugga2"},{"qname":"colordugga1"},{"qname":"colordugga2"},{"qname":"linjedugga1"},{"qname":"linjedugga2"},{"qname":"dugga1"},{"qname":"dugga2"},{"qname":"Quiz"},{"qname":"Rapport"},{"qname":"HTML CSS Testdugga"},{"qname":"Clipping masking testdugga"},{"qname":"test"}]}',
        'service' => 'C:\xampp\htdocs\LenaSYS\DuggaSys\accessedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function

            )),
        'filter-output' => serialize(array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )),

        //Rätt platts för delete?
        'query-after-test-1' => "DELETE FROM user WHERE username = 'testuser1';",
    ),






);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON
?>