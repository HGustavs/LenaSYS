<?php

include_once "../../../../Shared/test.php";

$testsData = array(
    'retrieveCodeviewerService' => array(
        'expected-output' => '{"examplename":"RetrieveTestExample","sectionname":"retrieveSection","playlink":"RetrieveTest.html"}',

        'query-before-test-1' => "INSERT INTO codeexample (exampleid, cid, cversion, examplename, sectionname, runlink, templateid, public, uid) VALUES (999999, 1885, 1337, 'RetrieveTestExample', 'retrieveSection', 'RetrieveTest.html', 1, 1, 101)",
        'query-before-test-2' => "INSERT INTO impwordlist (exampleid, word, label, uid) VALUES (999999, 'testword', 'testlabel', 101)",
        'query-before-test-3' => "INSERT INTO improw (exampleid, boxid, istart, iend) VALUES (999999, 1, 1, 3)",
        'query-before-test-4' => "INSERT INTO box (exampleid, boxid, boxcontent, boxtitle, filename, segment, fontsize) VALUES (999999, 1, 'CODE', 'Test Title', 'RetrieveTest.html', 0, '12px')",

        'query-after-test-1' => "DELETE FROM impwordlist WHERE exampleid = 999999",
        'query-after-test-2' => "DELETE FROM improw WHERE exampleid = 999999",
        'query-after-test-3' => "DELETE FROM box WHERE exampleid = 999999",
        'query-after-test-4' => "DELETE FROM codeexample WHERE exampleid = 999999",

        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/codeviewerService/retrieveCodeviewerService_ms.php',

        'service-data' => serialize(
            array(
                'username' => 'brom',
                'password' => 'password',
                'opt' => 'FETCH',
                'exampleid' => 999999,
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
