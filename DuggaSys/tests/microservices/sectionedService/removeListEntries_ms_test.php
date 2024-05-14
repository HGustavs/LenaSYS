<?php
include_once "../../../../Shared/test.php";

$testsData = array(
    'removeListEntries_ms' => array(
        'expected-output' => ''
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/sectionedService/removeListEntries_ms.php',
        'service-data' => serialize(
            array( 
                'username' => 'brom',
                'password' => 'password',

            )
        ),
        'filter-output' => serialize(
            array( 
                'none'
            )
        ),
    )
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON