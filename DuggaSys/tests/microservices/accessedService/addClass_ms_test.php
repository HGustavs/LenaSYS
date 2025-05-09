<?php

include_once "../../../../Shared/test.php";

$testsData = array(
    'addClass' => array(
        'expected-output' => '{"debug":"NONE!","classes":[{"class":"DVSUG13h","responsible":100,"classname":"theGreat","regcode":199191,"classcode":"DVSUG","hp":"180.0","tempo":100,"hpProgress":null},{"class":"Testclass1","responsible":101,"classname":"testclass","regcode":123,"classcode":"TEST","hp":"180.0","tempo":100,"hpProgress":"50.0"},{"class":"WEBUG13h","responsible":101,"classname":"theBEST","regcode":199292,"classcode":"WEBUG","hp":"180.0","tempo":100,"hpProgress":null},{"class":"WEBUG14h","responsible":101,"classname":"theDEST","regcode":199393,"classcode":"WEBUG","hp":"180.0","tempo":100,"hpProgress":null}]}',

        'query-after-test-1' => "DELETE FROM class WHERE class = 'Testclass1' AND responsible = 101;",

        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/accessedService/addClass_ms.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'ADDCLASS',
                'username' => 'brom',
                'password' => 'password',
                'newclass' => '[["Testclass1", "101", "testclass", "123", "TEST", 180, "100", 50]]'
            )
        ),
        'filter-output' => serialize(
            array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'classes',
                'debug'
            )
        ),
    ),
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON