<?php

include_once "../../../../Shared/test.php";

$testsData = array(
    'retrieveCodeviewerService' => array(
        'expected-output' => '{"examplename":"RetrieveTestExample","sectionname":"retrieveSection","playlink":"RetrieveTest.html"}',

        'query-before-test-1' => "INSERT INTO codeexample (exampleid, cid, cversion, examplename, sectionname, runlink, templateid, public, uid) VALUES (999984, 1885, 1337, 'RetrieveTestExample', 'retrieveSection', 'RetrieveTest.html', 10, 1, 101)",
        'query-before-test-2' => "INSERT INTO impwordlist (exampleid, word, label, uid) VALUES (999984, 'testword', 'testlabel', 101)",
        'query-before-test-3' => "INSERT INTO box (exampleid, boxid, boxcontent, boxtitle, filename, segment, fontsize) VALUES (999984, 1, 'CODE', 'Test Title', 'RetrieveTest.html', 0, 12)",
        'query-before-test-4' => "INSERT INTO improw (exampleid, boxid, istart, iend, uid) VALUES (999984, 1, 1, 3, 101)",

        'query-after-test-1' => "DELETE FROM impwordlist WHERE exampleid = 999984",
        'query-after-test-2' => "DELETE FROM improw WHERE exampleid = 999984",
        'query-after-test-3' => "DELETE FROM box WHERE exampleid = 999984",
        'query-after-test-4' => "DELETE FROM codeexample WHERE exampleid = 999984",

        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/codeviewerService/retrieveCodeviewerService_ms.php',

        'service-data' => serialize(
            array(
                'username' => 'brom',
                'password' => 'password',
                'opt' => 'FETCH',
                'exampleid' => 999984,
                'courseid' => 1885,
                'cvers' => 1337
            )
        ),

        'filter-output' => serialize(
            array(
                'examplename',
                'sectionname',
                'playlink'
            )
        ),
    ),
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = pretty print (HTML), false = raw JSON
