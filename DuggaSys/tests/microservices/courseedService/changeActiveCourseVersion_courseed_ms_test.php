<?php
include "../../../../Shared/test.php";  

$testsData = array(  
'changeActiveCourseVersion_courseed_ms' => array(  
        'expected-output' => '{"entries":[{"cid":"3","coursename":"Datorns grunder","coursecode":"IT500G","visibility":"1","activeversion":"1337","activeedversion":null,"registered":false},{"cid":"307","coursename":"Datorns grunder","coursecode":"IT115G","visibility":"0","activeversion":"12307","activeedversion":null,"registered":false},{"cid":"1894","coursename":"Demo-Course","coursecode":"G420","visibility":"1","activeversion":"52432","activeedversion":null,"registered":false},{"cid":"308","coursename":"Diskret matematik","coursecode":"MA161G","visibility":"0","activeversion":"12308","activeedversion":null,"registered":false},{"cid":"312","coursename":"Distribuerade system","coursecode":"IT326G","visibility":"0","activeversion":"12312","activeedversion":null,"registered":false},{"cid":"319","coursename":"Examensarbete i datavetenskap","coursecode":"DV736A","visibility":"0","activeversion":"12319","activeedversion":null,"registered":false},{"cid":"305","coursename":"Objektorienterad programmering","coursecode":"IT308G","visibility":"0","activeversion":"12305","activeedversion":null,"registered":false},{"cid":"309","coursename":"Operativsystem","coursecode":"DA322G","visibility":"0","activeversion":"12309","activeedversion":null,"registered":false},{"cid":"4","coursename":"Software Engineering","coursecode":"IT301G","visibility":"1","activeversion":"1338","activeedversion":null,"registered":false},{"cid":"1885","coursename":"Testing-Course","coursecode":"G1337","visibility":"1","activeversion":"1337","activeedversion":null,"registered":false},{"cid":"1","coursename":"Webbprogrammering","coursecode":"DV12G","visibility":"1","activeversion":"45656","activeedversion":null,"registered":false},{"cid":"2","coursename":"Webbutveckling - datorgrafik","coursecode":"IT118G","visibility":"1","activeversion":"97732","activeedversion":null,"registered":false},{"cid":"324","coursename":"Webbutveckling - webbplatsdesign","coursecode":"IT108G","visibility":"0","activeversion":"12324","activeedversion":null,"registered":false}],"debug":"NONE!"}',
        'query-before-test-1' => 'UPDATE course SET activeversion=NULL WHERE cid=1885;',
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/courseedService/changeActiveCourseVersion_courseed_ms.php',
        'service-data' => serialize(
            array(
                'username' => 'brom',
                'password' => 'password',
                'opt' => 'CHGVERS',
                'cid' => '1885',
                'vers' => '1337',
            )),
        'filter-output' => serialize(array(
            'entries',
            'debug'
        )),
    ),
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON
?>

