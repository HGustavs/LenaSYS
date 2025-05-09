<?php
include_once "../../../../Shared/test.php";

$testsData = array(
    'readGroupValues_ms' => array(
        'expected-output' => '{"debug":"NONE!","coursevers":"1337","courseid":"1885","groups":{"No":["1","2","3","4","5","6","7","8"],"Le":["A","B","C","D","E","F","G","H"],"Vi":["I","II","III","IV","V","VI","VII","VIII"]}}',
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/sectionedService/readGroupValues_ms.php',
        'service-data' => serialize(
            array( 
                // Data that service needs to execute function
                'courseid' => 1885,
                'vers' => 1337,
                'coursevers' => 1337,
                'username' => 'brom',
                'password' => 'password',
            )
        ),
        'filter-output' => serialize(
            array( 
                'debug',
                'coursevers',
                'courseid',
                'groups',
            )
        ),
    )
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON
