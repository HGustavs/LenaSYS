<?php
include_once "../../../../Shared/test.php";

$testsData = array(
    'updateListEntriesTabs_ms' => array(
        'expected-output' => 'null',

        'query-after-test-1' => "UPDATE listentries SET tabs = null WHERE cid = 1885 AND lid = 1;",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/sectionedService/updateListEntriesTabs_ms.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'UPDATETABS',
                'courseid' => 1885,
                'coursevers' => 1337,
                'lid' => 1,
                'tabs' => 1,
                'username' => 'brom',
                'password' => 'password',
            )
        ),
        'filter-output' => serialize(
            array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'entries' => array(
                    'lid',
                    'tabs',
                ),
                'debug'
            )
        ),
    )
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON