<?php

include_once "../../../../Shared/test.php";

$testsData = array(
    'createDugga_ms' => array(
        'expected-output' => '{"entries":[{"qname":"createDuggaTest","autograde":0,"gradesystem":1,"qstart":"2024-03-03","deadline":"2024-01-01 01:01:01","qrelease":"2024-02-02 02:02:02","jsondeadline":"{\"TestJSON\":\"2024-04-04 04:04:04\"}"}]}',
        
        'query-after-test-1' => "DELETE FROM quiz WHERE qname = 'createDuggaTest' AND cid = 1885",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/duggaedService/createDugga_ms.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'SAVDUGGA',
                'cid' => 1885,
                'nme' => 'createDuggaTest',
                'coursevers' => 1337,
                'autograde' => 0,
                'gradesys' => 1,
                'template' => 'group-assignment',
                'jsondeadline' => '{"TestJSON":"2024-04-04 04:04:04"}',
                'release' => '2024-02-02 02:02:02',
                'deadline' => '2024-01-01 01:01:01',
                'qstart' => '2024-03-03',
                'username' => 'brom',
                'password' => 'password'
            )
        ),
        'filter-output' => serialize(array(
                'entries' => array(
                    'qname',
                    'autograde',
                    'gradesystem',
                    'quizfile',
                    'qstart',
                    'deadline',
                    'qrelease',
                    'jsondeadline',
                    'group'
                ),
            )     
        ),
    ),
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON