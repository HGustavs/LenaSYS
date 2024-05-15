<?php

include "../../Shared/test.php";

$testsData = array(
    'Get course versions' => array(
        'expected-output' => '[{"cid":"4","coursecode":"IT301G","vers":"1338","versname":"HT15","coursename":"Software Engineering","coursenamealt":"UNK","startdate":"2024-01-01 00:00:00","enddate":"2025-12-31 00:00:00","motd":"Welcome to Software Engineering - HT15!"}]', 
        'query-after-test-1' => "DELETE FROM vers WHERE cid = 4;", 
        'service' => 'http://localhost/LenaSYS/DuggaSys/tests/getCourseVersion_test.php',


        'service-data' => serialize(array( 

            'username' => 'mestr', 
            'password' => 'password', 
        )),

        'filter-output' => serialize(array( 
            // Filter what output to use in assert test

            'entries' => array(
                'cid',
                'coursecode',
                'vers',
                'versname',
                'coursename',
                'coursenamealt',
                'startdate',
                'enddate',
                'motd'
            ),
        )),
    ),
);


testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON

?>
