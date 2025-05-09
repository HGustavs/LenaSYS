<?php
include_once "../../../../Shared/test.php";

$testsData = array(
    'specialUpdate_ms' => array(
        'expected-output' => '{"debug":"NONE!"}',
        'query-before-test-1' => 'INSERT INTO course (cid, visibility,creator,coursecode,coursename) VALUES (1234567890,0,1,"TE123S","TESTCOURSEDELETED");',
        'query-before-test-2' => 'INSERT INTO vers (cid, vers,versname,coursecode,coursename,coursenamealt) VALUES (1234567890,10001,"HT00","TE123S","TESTCOURSEDELETED","coursealt");',
        'query-after-test-1' => 'DELETE FROM vers WHERE vers=10001 and cid=1234567890',
        'query-after-test-2' => 'DELETE FROM course WHERE cid=1234567890',
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/courseedService/specialUpdate_ms.php',
        'service-data' => serialize(
            array(
                'opt' => 'SPECIALUPDATE',
                'cid' => '1234567890',
                'courseGitURL' => 'TESTURL',
                'username' => 'brom',
                'password' => 'password',
            )
        ),
        'filter-output' => serialize(
            array(
                'debug',
            )
        ),
    ),
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON
?>
