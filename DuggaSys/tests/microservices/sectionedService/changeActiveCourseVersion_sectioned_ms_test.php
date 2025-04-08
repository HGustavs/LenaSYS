<?php
include "../../../../Shared/test.php";  

$testsData = array(  
'changeActiveCourseVersion_sectioned_ms' => array(  
        'expected-output' => '{"debug":"NONE!","coursevers":"9999"}',
        'query-before-test-1' => 'INSERT INTO vers (cid,vers,versname,coursecode,coursename,coursenamealt) VALUES (1885,9999,"HT00","G1337","Testing-Course","testing");',
        'query-after-test-1' => 'UPDATE course SET activeversion=1337 WHERE cid=1885;',
        'query-after-test-2' => 'DELETE FROM vers WHERE vers=9999 and cid=1885;',
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/sectionedService/changeActiveCourseVersion_sectioned_ms.php',
        'service-data' => serialize(
            array(
                'username' => 'brom',
                'password' => 'password',
                'opt' => 'CHGVERS',
                'cid' => '1885',
                'vers' => '9999',
            )),
        'filter-output' => serialize(array(
            'coursevers',
            'debug'
        )),
    ),
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON
?>


