<?php

include_once "../../../../Shared/test.php";

$testsData = array(
    'editBoxTitle_ms' => array(
        'expected-output' => '{"box":[["99","BOXCONTENT","File: testing.php not found.","2","newTitle","testing.php","12",null,null]]}',
        'query-before-test-1' => "INSERT INTO codeexample (exampleid,cid,uid) VALUES (9997,1885,101);",
        'query-before-test-2' => "INSERT INTO box (boxid,boxtitle,exampleid, boxcontent, filename, wordlistid, segment, fontsize) VALUES (99,'oldTitle',9997,'boxcontent','testing.php',2,2,12);",
        'query-after-test-1' => "DELETE FROM box WHERE boxid = 99;",
        'query-after-test-2' => "DELETE FROM codeexample WHERE exampleid = 9997;",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/codeviewerService/editBoxTitle_ms.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password', 
                'opt' => 'EDITTITLE',
                'exampleid' => '9997', 
                'boxid' => '99',
                'boxtitle' => 'newTitle' 
            )
        ),
        'filter-output' => serialize(
            array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'box',
            )
        ),
    ),
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = pretty print (HTML), false = raw JSON
