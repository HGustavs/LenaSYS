<?php

include_once "../../../../Shared/test.php";
$testsData = array(
    'removeListEntries_ms.php' => array(
        'expected-output' => '{"debug":"NONE!","coursename":"Testing-Course","coursevers":"1337","coursecode":"G1337","courseid":"1885"}',
        'query-before-test-1' => "INSERT INTO listentries (lid, vers, entryname, creator, cid, kind, visible) VALUES (4294967295, 97732, 'TestMoment', 101, 1885, 3, 1);",
        'query-after-test-1' => "DELETE FROM listentries WHERE lid = 4294967295;", 
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/sectionedService/removeListEntries_ms.php',
        'service-data' => serialize(
            array( 
                // Data that service needs to execute function
                'opt' => 'DELETE',
                'lid' => '4294967295',
                'courseid' => 1885,
                'coursevers' => 1337,
                'comment' => 'undefined',
                'username' => 'brom',
                'password' => 'password',
            )
        ),
        'filter-output' => serialize(
            array( 
                // Filter what output to use in assert test, use none to use all ouput from service
                'debug',
                'coursename',
                'coursevers',
                'coursecode',
                'courseid',
            )
        ),
    )
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON
?>