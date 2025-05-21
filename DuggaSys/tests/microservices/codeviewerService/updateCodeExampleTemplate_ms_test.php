<?php

include_once "../../../../Shared/test.php";

$testsData = array(
    'updateCodeExampleTemplate' => array(
        'expected-output' => '{"status":"success"}',
        
        'query-before-test-1' => "INSERT INTO codeexample (exampleid, examplename, cid, uid, cversion, templateid) VALUES (999995, 'TestCodeExample', 1885, 101, 1337, 5)",
        'query-before-test-2' => "INSERT INTO box (boxid, exampleid, boxtitle, boxcontent, filename, wordlistid, fontsize) VALUES (1, 999995, 'OldTitle', 'OldContent', 'oldfile.html', 2, 9)",
        'query-before-test-3' => "INSERT INTO box (boxid, exampleid, boxtitle, boxcontent, filename, wordlistid, fontsize) VALUES (2, 999995, 'OldTitle2', 'OldContent2', 'oldfile2.html', 3, 9)",
        
        'query-after-test-1' => "DELETE FROM box WHERE exampleid = 999995",
        'query-after-test-2' => "DELETE FROM codeexample WHERE exampleid = 999995",
        
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/codeviewerService/updateCodeExampleTemplate_ms.php',
        'service-data' => serialize(
            array(
                'username' => 'brom',
                'password' => 'password',
                'opt' => 'SETTEMPL',
                'exampleid' => 999995,
                'templateno' => 10,
                'courseid' => 1885,
                'cvers' => 1337,
                'content' => 'html,test.html,4'
            )
        ),
        'filter-output' => serialize(
            array(
                'status'
            )
        ),
    ),
);

testHandler($testsData, true);