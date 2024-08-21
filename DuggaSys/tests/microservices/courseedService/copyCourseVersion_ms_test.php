<?php

include_once "../../../../Shared/test.php";

$testsData = array(
    'copyCourseVersion_ms' => array(
        'expected-output' => '{"versions":[{"cid":"1","coursecode":"DV12G","vers":"45656","versname":"HT15","coursename":"Webbprogrammering","coursenamealt":"UNK"},{"cid":"1","coursecode":"DV12G","vers":"45657","versname":"HT16","coursename":"Webbprogrammering","coursenamealt":"UNK"},{"cid":"2","coursecode":"IT118G","vers":"97731","versname":"HT14","coursename":"Webbutveckling - datorgrafik","coursenamealt":"UNK"},{"cid":"2","coursecode":"IT118G","vers":"97732","versname":"HT15","coursename":"Webbutveckling - datorgrafik","coursenamealt":"UNK"},{"cid":"3","coursecode":"IT500G","vers":"1337","versname":"HT15","coursename":"Datorns grunder","coursenamealt":"UNK"},{"cid":"4","coursecode":"IT301G","vers":"1338","versname":"HT15","coursename":"Software Engineering","coursenamealt":"UNK"},{"cid":"305","coursecode":"IT308G","vers":"12305","versname":"HT15","coursename":"Objektorienterad programmering","coursenamealt":"UNK"},{"cid":"307","coursecode":"IT115G","vers":"12307","versname":"HT15","coursename":"Datorns grunder","coursenamealt":"UNK"},{"cid":"308","coursecode":"MA161G","vers":"12308","versname":"HT15","coursename":"Diskret matematik","coursenamealt":"UNK"},{"cid":"309","coursecode":"DA322G","vers":"12309","versname":"HT15","coursename":"Operativsystem","coursenamealt":"UNK"},{"cid":"312","coursecode":"IT326G","vers":"12312","versname":"HT15","coursename":"Distribuerade system","coursenamealt":"UNK"},{"cid":"319","coursecode":"DV736A","vers":"12319","versname":"HT15","coursename":"Examensarbete i datavetenskap","coursenamealt":"UNK"},{"cid":"324","coursecode":"IT108G","vers":"12324","versname":"HT15","coursename":"Webbutveckling - webbplatsdesign","coursenamealt":"UNK"},{"cid":"1885","coursecode":"G1337","vers":"123","versname":"HT00","coursename":"Testing-Course","coursenamealt":"UNK"},{"cid":"1885","coursecode":"G1337","vers":"1337","versname":"","coursename":"Testing-Course","coursenamealt":"Course for testing codeviewer"},{"cid":"1894","coursecode":"G420","vers":"52432","versname":"ST20","coursename":"Demo-Course","coursenamealt":"Chaos Theory - Conspiracy 64k Demo"}]}',
        'query-after-test-1' => 'DELETE FROM vers WHERE vers=123 and cid=1885;',
        'query-after-test-2' => 'DELETE FROM box WHERE exampleid in (SELECT exampleid FROM codeexample WHERE  cid=1885 and cversion=123);',
        'query-after-test-3' => 'DELETE FROM codeexample WHERE cid=1885 and cversion=123;',
        'query-after-test-4' => 'DELETE FROM listentries WHERE vers=123;',
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/courseedService/copyCourseVersion_ms.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',
                'opt' => 'CPYVRS',
                'cid' => '1885',
                'versid' => '123',
                'versname' => 'HT00',
                'motd' => 'testing-motd',
                'copycourse' => '1337',
                'coursecode' => 'G1337',
                'coursename' => 'Testing-Course',
                'makeactive' => '2',
                'startdate' => '2024-05-01',
                'enddate' => '2024-05-31',
            )
        ),
        'filter-output' => serialize(
            array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'versions'
            )
        ),
    ),
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON