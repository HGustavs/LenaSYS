<?php
include_once "../../../../Shared/test.php";

$testsData = array(
    'removeListEntries_ms.php' => array(
        'expected-output' => 'debug	"NONE!"',
        'query-before-test-1' => "INSERT INTO course(cid, coursecode, coursename, creator) VALUES (9999, 'willBeDeleted', 'testcourse', 1);",
        'query-before-test-2' => "INSERT INTO listentries(lid, cid, entryname, creator, vers) VALUES (9999, 9999, 'listentry to be deleted', 101, 1337);",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/sectionedService/removeListEntries_ms.php',
        'service-data' => serialize(
            array( 
                // Data that service needs to execute function
                'opt' => 'DELETE',
                'lid' => '9999',
                'username' => 'brom',
                'password' => 'password',
            )
        ),
        'filter-output' => serialize(
            array( 
                // Filter what output to use in assert test, use none to use all ouput from service
                'debug',
            )
        ),
    )
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON