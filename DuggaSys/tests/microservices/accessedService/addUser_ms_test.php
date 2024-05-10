<?php
include "../../../../Shared/test.php";

// TEST for microservice addUser_ms.php
$testdata = array(
    'Add-user' => array(  
        //Pre-values
        'expected-output' => '{"entries":[{"username":"{\"username\":\"Addtest123\"}","class":"{\"class\":\"AUclass123\"}"}],"classes":[{"class":"AUclass123"},{"class":"DVSUG13h"},{"class":"WEBUG13h"},{"class":"WEBUG14h"}]}',
        'query-after-test-1' => "DELETE FROM user_course WHERE cid = '1885';",
        'query-after-test-2' => "DELETE FROM user WHERE username = 'Addtest123';",
        'query-after-test-3' => "DELETE FROM class WHERE class = 'AUclass123';",
        'service' => 'http://localhost/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',
                'opt' => 'ADDUSR',
                'newusers' => '[["471212-1234","Fname","Lname","Addtest123@student.his.se","AUclass123","HT-14",0]]',
                'courseid' => '1885',
                'coursevers'=> '1337'
            )),
        'filter-output' => serialize(
            array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'entries' => array(
                    'username',
                    'class'
                ),
            )),
    ),
);

testHandler($testdata, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON