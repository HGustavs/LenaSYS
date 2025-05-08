<?php
include_once "../../../../Shared/test.php";

$testsData = array(
    'updateQuizDeadline_ms' => array(
        'expected-output' => '{"debug":"NONE!","duggor":[{"qname":"quiz to be deleted","deadline":"2024-05-16 16:00:00","relativedeadline":"senare"}]}',

        'query-before-test-1' => "INSERT INTO quiz(cid, vers, deadline, relativedeadline, qname) VALUES (1885, 1337, '2024-05-15 15:00:00', 'snart', 'quiz to be deleted');",
        'query-before-test-2' => "SELECT MAX(id) AS id FROM quiz",
        'query-after-test-1' => "DELETE FROM quiz WHERE cid = 1885 AND qname = 'quiz to be deleted';",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/sectionedService/updateQuizDeadline_ms.php',
        'service-data' => serialize(
            array( 
                // Data that service needs to execute function
                'courseid' => 1885,
                'coursevers' => 1337,
                'opt' => 'UPDATEDEADLINE',
                'link' => '<!query-before-test-2!><*[0]["id"]*>',
                'deadline' => '2024-05-16 16:00:00',
                'relativedeadline' => 'senare',
                'username' => 'brom',
                'password' => 'password',
            )
        ),
        'filter-output' => serialize(
            array( 
                // Filter what output to use in assert test, use none to use all ouput from service
                'duggor' => array(
                    'qname',
                    'deadline',
                    'relativedeadline',
                ),
                'debug'
            )
        ),
    )
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON