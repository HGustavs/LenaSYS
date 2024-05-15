<?php
//------------------------------------------------------------------------------------------------
// Test for the microservice retrieveCourseedService
//------------------------------------------------------------------------------------------------

include "../../../../Shared/test.php";  

$testsData = array(  

    //TEST #1
    'RetrieveCourseseedService' => array(  
        'expected-output' => '{"LastCourseCreated":null,"entries":[{"cid":"3","coursename":"Datorns grunder","coursecode":"IT500G","visibility":"1","activeversion":"1337","activeedversion":null,"registered":false},{"cid":"307","coursename":"Datorns grunder","coursecode":"IT115G","visibility":"0","activeversion":"12307","activeedversion":null,"registered":false},{"cid":"1894","coursename":"Demo-Course","coursecode":"G420","visibility":"1","activeversion":"52432","activeedversion":null,"registered":false},{"cid":"308","coursename":"Diskret matematik","coursecode":"MA161G","visibility":"0","activeversion":"12308","activeedversion":null,"registered":false},{"cid":"312","coursename":"Distribuerade system","coursecode":"IT326G","visibility":"0","activeversion":"12312","activeedversion":null,"registered":false},{"cid":"319","coursename":"Examensarbete i datavetenskap","coursecode":"DV736A","visibility":"0","activeversion":"12319","activeedversion":null,"registered":false},{"cid":"305","coursename":"Objektorienterad programmering","coursecode":"IT308G","visibility":"0","activeversion":"12305","activeedversion":null,"registered":false},{"cid":"309","coursename":"Operativsystem","coursecode":"DA322G","visibility":"0","activeversion":"12309","activeedversion":null,"registered":false},{"cid":"4","coursename":"Software Engineering","coursecode":"IT301G","visibility":"1","activeversion":"1338","activeedversion":null,"registered":false},{"cid":"1885","coursename":"Testing-Course","coursecode":"G1337","visibility":"1","activeversion":"1337","activeedversion":null,"registered":false},{"cid":"1","coursename":"Webbprogrammering","coursecode":"DV12G","visibility":"1","activeversion":"45656","activeedversion":null,"registered":false},{"cid":"2","coursename":"Webbutveckling - datorgrafik","coursecode":"IT118G","visibility":"1","activeversion":"97732","activeedversion":null,"registered":false},{"cid":"324","coursename":"Webbutveckling - webbplatsdesign","coursecode":"IT108G","visibility":"0","activeversion":"12324","activeedversion":null,"registered":false}],"versions":[{"cid":"1","coursecode":"DV12G","vers":"45656","versname":"HT15","coursename":"Webbprogrammering","coursenamealt":"UNK"},{"cid":"1","coursecode":"DV12G","vers":"45657","versname":"HT16","coursename":"Webbprogrammering","coursenamealt":"UNK"},{"cid":"2","coursecode":"IT118G","vers":"97731","versname":"HT14","coursename":"Webbutveckling - datorgrafik","coursenamealt":"UNK"},{"cid":"2","coursecode":"IT118G","vers":"97732","versname":"HT15","coursename":"Webbutveckling - datorgrafik","coursenamealt":"UNK"},{"cid":"3","coursecode":"IT500G","vers":"1337","versname":"HT15","coursename":"Datorns grunder","coursenamealt":"UNK"},{"cid":"4","coursecode":"IT301G","vers":"1338","versname":"HT15","coursename":"Software Engineering","coursenamealt":"UNK"},{"cid":"305","coursecode":"IT308G","vers":"12305","versname":"HT15","coursename":"Objektorienterad programmering","coursenamealt":"UNK"},{"cid":"307","coursecode":"IT115G","vers":"12307","versname":"HT15","coursename":"Datorns grunder","coursenamealt":"UNK"},{"cid":"308","coursecode":"MA161G","vers":"12308","versname":"HT15","coursename":"Diskret matematik","coursenamealt":"UNK"},{"cid":"309","coursecode":"DA322G","vers":"12309","versname":"HT15","coursename":"Operativsystem","coursenamealt":"UNK"},{"cid":"312","coursecode":"IT326G","vers":"12312","versname":"HT15","coursename":"Distribuerade system","coursenamealt":"UNK"},{"cid":"319","coursecode":"DV736A","vers":"12319","versname":"HT15","coursename":"Examensarbete i datavetenskap","coursenamealt":"UNK"},{"cid":"324","coursecode":"IT108G","vers":"12324","versname":"HT15","coursename":"Webbutveckling - webbplatsdesign","coursenamealt":"UNK"},{"cid":"1885","coursecode":"G1337","vers":"1337","versname":"","coursename":"Testing-Course","coursenamealt":"Course for testing codeviewer"},{"cid":"1894","coursecode":"G420","vers":"52432","versname":"ST20","coursename":"Demo-Course","coursenamealt":"Chaos Theory - Conspiracy 64k Demo"}],"debug":"NONE!","writeaccess":true,"motd":"UNK","readonly":0}',
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/courseedService/getCourseed_ms.php',
        'service-data' => serialize(
            array(
                'username' => 'brom',
                'password' => 'password',
            )),
        'filter-output' => serialize(array(
            'LastCourseCreated',
            'entries',
            'versions',
            'debug',
            'writeaccess',
            'motd',
            'readonly',
        )),
    ),
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON
?>
