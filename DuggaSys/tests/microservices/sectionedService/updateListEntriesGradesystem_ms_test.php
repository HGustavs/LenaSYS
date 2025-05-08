<?php
include_once "../../../../Shared/test.php";

$testsData = array(
    'updateListEntriesGradesystem_ms' => array(
        'expected-output' => '{"entries":[{"lid":1,"gradesys":1},{"lid":4000,"gradesys":null},{"lid":4001,"gradesys":null},{"lid":4002,"gradesys":null},{"lid":4003,"gradesys":null},{"lid":4004,"gradesys":null},{"lid":4005,"gradesys":null},{"lid":4006,"gradesys":null},{"lid":4007,"gradesys":null},{"lid":4008,"gradesys":null},{"lid":4009,"gradesys":null},{"lid":2,"gradesys":null},{"lid":5000,"gradesys":null},{"lid":5001,"gradesys":null},{"lid":5002,"gradesys":null},{"lid":5003,"gradesys":null},{"lid":5004,"gradesys":null},{"lid":5005,"gradesys":null},{"lid":5006,"gradesys":null},{"lid":5007,"gradesys":null},{"lid":5008,"gradesys":null},{"lid":5009,"gradesys":null},{"lid":4,"gradesys":null},{"lid":3110,"gradesys":null},{"lid":3111,"gradesys":null},{"lid":3112,"gradesys":null},{"lid":3113,"gradesys":null},{"lid":3114,"gradesys":null},{"lid":3115,"gradesys":null},{"lid":3116,"gradesys":null},{"lid":3117,"gradesys":null},{"lid":3118,"gradesys":null},{"lid":3119,"gradesys":null},{"lid":5,"gradesys":null},{"lid":2110,"gradesys":null},{"lid":2111,"gradesys":null},{"lid":2112,"gradesys":null},{"lid":2113,"gradesys":null},{"lid":2114,"gradesys":null},{"lid":2115,"gradesys":null},{"lid":2116,"gradesys":null},{"lid":2117,"gradesys":null},{"lid":2118,"gradesys":null},{"lid":2119,"gradesys":null},{"lid":6,"gradesys":null}],"debug":"NONE!"}',

        'query-after-test-1' => "UPDATE listentries SET gradesystem = null WHERE cid = 1885 AND lid = 1;",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/sectionedService/updateListEntriesGradesystem_ms.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'courseid' => 1885,
                'coursevers' => 1337,
                'lid' => '1',
                'gradesys' => '1',
                'username' => 'brom',
                'password' => 'password',
            )
        ),
        'filter-output' => serialize(
            array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'entries' => array(
                    'lid',
                    'gradesys',
                ),
                'debug'
            )
        ),
    )
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON