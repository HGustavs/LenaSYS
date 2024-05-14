<?php

include_once "../../../../Shared/test.php";

$testsData = array(
    'deleteCodeExample' => array(
        'expected-output' => '{"box":[],"improws":[],"impwords":[],"examplename":"UNK","exampleno":null}',

        'query-before-test-1' => "INSERT INTO codeexample (exampleid, examplename, cid, uid, cversion, templateid) VALUES (999996, 'TestCodeExample', 1885, 101, 1337, 10)",
        'query-before-test-2' => "INSERT INTO box (boxid, exampleid, boxtitle) VALUES (1, 999996, 'TestBox')",
        'query-before-test-3' => "INSERT INTO improw (boxid, exampleid, uid, istart, iend) VALUES (1, 999996, 101, 120, 220)",
        'query-before-test-4' => "INSERT INTO impwordlist (exampleid, word, uid) VALUES (999996, 'TestWord', 101)",
        'query-before-test-5' => "INSERT INTO listentries (cid, entryname, creator) VALUES (1885, 'TestListentry', 101)",

        'query-before-test-6' => "SELECT MAX(lid) AS lid FROM listentries",
        'variables-query-before-test-3' => "lid",

        // Deletes for if MS fails
        'query-after-test-1' => "DELETE FROM listentries where cid = 1885 AND entryname = 'TestListentry' AND creator = 101",
        'query-after-test-2' => "DELETE FROM impwordlist WHERE exampleid = 999996",
        'query-after-test-3' => "DELETE FROM improw WHERE boxid = 1 AND exampleid = 999996",
        'query-after-test-4' => "DELETE FROM box WHERE boxid = 1 AND exampleid = 999996",
        'query-after-test-5' => "DELETE FROM codeexample WHERE exampleid = 999996",

        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/codeviewerService/deleteCodeExample_ms.php',
        'service-data' => serialize(
            array(
                'opt' => "DELEXAMPLE",
                'exampleid' => 999996,
                'boxid' => 1,
                'lid' => '<!query-before-test-6!><*[0]["lid"]*>',
                'username' => 'brom',
                'password' => 'password',
                'courseid' => 1885,
                'cvers' => 1337,
            )
        ),
        'filter-output' => serialize(
            array(
                'box',
                'improws',
                'impwords',
                'examplename',
                'exampleno'
            )
        ),
    ),
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = pretty print (HTML), false = raw JSON
