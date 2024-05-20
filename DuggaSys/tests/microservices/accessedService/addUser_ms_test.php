<?php
include "../../../../Shared/test.php";

// TEST for microservice addUser_ms.php
$testdata = array(
    'addUser_ms' => array(  
        'expected-output' => '{"entries":[{"username":"{\"username\":\"Addtest123\"}","ssn":"{\"ssn\":\"471212-1234\"}","firstname":"{\"firstname\":\"Fname\"}","lastname":"{\"lastname\":\"Lname\"}","class":"{\"class\":\"TESTclass1\"}","access":"{\"access\":\"R\"}"}],"debug":"NONE!","classes":[{"class":"TESTclass1"},{"class":"DVSUG13h"},{"class":"WEBUG13h"},{"class":"WEBUG14h"}]}',
        'query-after-test-1' => "DELETE FROM user_course WHERE cid = '1885';",
        'query-after-test-2' => "DELETE FROM user WHERE username = 'Addtest123' AND firstname = 'Fname' AND lastname = 'Lname';",
        'query-after-test-3' => "DELETE FROM class WHERE class = 'TESTclass1';",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/accessedService/addUser_ms.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',
                'opt' => 'ADDUSR',
                'newusers' => '[["471212-1234", "Fname", "Lname", "Addtest123@student.his.se", "TESTclass1", "HT-14"]]',
                'courseid' => '1885',
                'coursevers'=> '1337'
            )),
        'filter-output' => serialize(
            array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'entries' => array(
                    'username',
                    'ssn',
                    'firstname',
                    'lastname',
                    'class',
                    'access'
                ),
                'classes',
                'debug'
            )),
    ),
);

testHandler($testdata, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON