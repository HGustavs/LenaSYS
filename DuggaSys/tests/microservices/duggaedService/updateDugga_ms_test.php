<?php
include_once "../../../../Shared/test.php";

$testsData = array(
    'updateDugga_ms' => array(
        'expected-output' => '{"entries":[{"qname":"updateDuggaTestUPDATED","autograde":1,"gradesystem":1,"quizFile":"group-assignment","qstart":"2024-04-04","deadline":"2024-02-02 02:02:02","qrelease":"2024-03-03 03:03:03","jsondeadline":"{\"TestJSON\":\"2024-05-05 05:05:05\"}","group":1}]}',

        'query-before-test-1' => "INSERT INTO quiz (cid, autograde, gradesystem, qname, qrelease, deadline, relativedeadline, creator, vers, qstart, jsondeadline) VALUES (1885, 0, 0, 'updateDuggaTest', '2024-02-02 02:02:02', '2024-01-01 01:01:01', 'snart', 101, 1337, '2024-03-03', '{\"TestJSON\":\"2024-04-04 04:04:04\"}');",
        'query-before-test-2' => "SELECT MAX(id) AS qid FROM quiz",

        'query-after-test-1' => "DELETE FROM quiz WHERE qname = 'updateDuggaTestUPDATED' AND cid = 1885",
        'query-after-test-2' => "DELETE FROM quiz WHERE qname = 'updateDuggaTest' AND cid = 1885", // Failsafe

        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/duggaedService/updateDugga_ms.php',
        'service-data' => serialize(
            array(
                'opt' => 'SAVDUGGA',
                'cid' => 1885,
                'coursevers' => 1337,
                'qid' => '<!query-before-test-2!> <*[0]["qid"]*>',
                'nme' => 'updateDuggaTestUPDATED',
                'autograde' => 1,
                'gradesys' => 1,
                'template' => 'group-assignment',
                'jsondeadline' => '{"TestJSON":"2024-05-05 05:05:05"}',
                'release' => '2024-03-03 03:03:03',
                'deadline' => '2024-02-02 02:02:02',
                'qstart' => '2024-04-04',
                'username' => 'brom',
                'password' => 'password'
            )
        ),
        'filter-output' => serialize(
            array(
                'entries' => array(
                    'qname',
                    'autograde',
                    'gradesystem',
                    'quizFile',
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