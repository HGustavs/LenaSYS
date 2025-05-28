<?php
include_once "../../../../Shared/test.php";

$testsData = array(
    'createGithubCodeExample_ms' => array(
        'expected-output' => '{"debug":"Success","entries":[{"entryname":"GH-test-entry"}]}',

        'query-before-test-1' => "INSERT INTO listentries(cid, entryname, visible, creator, vers) VALUES (1885, 'GH-test-entry', 1, 101, 1337);",
        
        'query-before-test-2' => "SELECT lid FROM listentries WHERE entryname = 'GH-test-entry';",
        
        'query-before-test-3' => "INSERT INTO userAnswer (cid, moment, useranswer, vers, hash, password) VALUES(1885, '2025-11-02 00:00:00', 'dummy', 1337, 'hash', 'password');",

        'query-after-test-1' => "DELETE FROM userAnswer WHERE useranswer = 'dummy' AND cid = 1885;",
        'query-after-test-2' => "DELETE FROM listentries WHERE entryname = 'GH-test-entry' AND cid = 1885;",

        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/sectionedService/createGithubCodeExample_ms.php',
        'service-data' => serialize(
            array(
                'opt' => 'CREGITEX',
                'lid' => '<!query-before-test-2!><*[0]["lid"]*>',
                'username' => 'brom',
                'password' => 'password',
                'courseid' => 1885,
                'coursevers' => 1337
            )
        ),
        'filter-output' => serialize(
            array(
                'debug',
                'entries' => array(
                    'entryname',
                ),
            )
        ),
    )
);

testHandler($testsData, true);
