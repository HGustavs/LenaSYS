<?php
include_once "../../../../Shared/test.php";

$testsData = array(
    'specialUpdate_ms' => array(
        'expected-output' => '{"entries":[{"cid":3,"coursename":"Datorns grunder","coursecode":"IT500G","visibility":1,"activeversion":"1337","activeedversion":null,"registered":false},{"cid":307,"coursename":"Datorns grunder","coursecode":"IT115G","visibility":0,"activeversion":"12307","activeedversion":null,"registered":false},{"cid":1894,"coursename":"Demo-Course","coursecode":"G420","visibility":1,"activeversion":"52432","activeedversion":null,"registered":false},{"cid":308,"coursename":"Diskret matematik","coursecode":"MA161G","visibility":0,"activeversion":"12308","activeedversion":null,"registered":false},{"cid":312,"coursename":"Distribuerade system","coursecode":"IT326G","visibility":0,"activeversion":"12312","activeedversion":null,"registered":false},{"cid":319,"coursename":"Examensarbete i datavetenskap","coursecode":"DV736A","visibility":0,"activeversion":"12319","activeedversion":null,"registered":false},{"cid":305,"coursename":"Objektorienterad programmering","coursecode":"IT308G","visibility":0,"activeversion":"12305","activeedversion":null,"registered":false},{"cid":309,"coursename":"Operativsystem","coursecode":"DA322G","visibility":0,"activeversion":"12309","activeedversion":null,"registered":false},{"cid":4,"coursename":"Software Engineering","coursecode":"IT301G","visibility":1,"activeversion":"1338","activeedversion":null,"registered":false},{"cid":1234567890,"coursename":"TESTCOURSEDELETED","coursecode":"TE123S","visibility":0,"activeversion":null,"activeedversion":null,"registered":false},{"cid":1885,"coursename":"Testing-Course","coursecode":"G1337","visibility":1,"activeversion":"1337","activeedversion":null,"registered":false},{"cid":1,"coursename":"Webbprogrammering","coursecode":"DV12G","visibility":1,"activeversion":"45656","activeedversion":null,"registered":false},{"cid":2,"coursename":"Webbutveckling - datorgrafik","coursecode":"IT118G","visibility":1,"activeversion":"97732","activeedversion":null,"registered":false},{"cid":324,"coursename":"Webbutveckling - webbplatsdesign","coursecode":"IT108G","visibility":0,"activeversion":"12324","activeedversion":null,"registered":false}]}',
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
                'entries',
            )
        ),
    ),
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON
?>
