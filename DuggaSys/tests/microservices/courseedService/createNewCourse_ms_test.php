<?php

include "../../../../Shared/test.php";

error_reporting(E_ALL);

$testsData = array(
    'createNewCourse_ms' => array(
        'expected-output' => '{"entries":[{"coursename":"Datorns grunder","coursecode":"IT500G"},{"coursename":"Datorns grunder","coursecode":"IT115G"},{"coursename":"Demo-Course","coursecode":"G420"},{"coursename":"Diskret matematik","coursecode":"MA161G"},{"coursename":"Distribuerade system","coursecode":"IT326G"},{"coursename":"Examensarbete i datavetenskap","coursecode":"DV736A"},{"coursename":"Objektorienterad programmering","coursecode":"IT308G"},{"coursename":"Operativsystem","coursecode":"DA322G"},{"coursename":"Software Engineering","coursecode":"IT301G"},{"coursename":"Test Course","coursecode":"TE001S"},{"coursename":"Testing-Course","coursecode":"G1337"},{"coursename":"Webbprogrammering","coursecode":"DV12G"},{"coursename":"Webbutveckling - datorgrafik","coursecode":"IT118G"},{"coursename":"Webbutveckling - webbplatsdesign","coursecode":"IT108G"}],"versions":[{"coursecode":"DV12G","vers":"45656","versname":"HT15","coursename":"Webbprogrammering","coursenamealt":"UNK"},{"coursecode":"DV12G","vers":"45657","versname":"HT16","coursename":"Webbprogrammering","coursenamealt":"UNK"},{"coursecode":"IT118G","vers":"97731","versname":"HT14","coursename":"Webbutveckling - datorgrafik","coursenamealt":"UNK"},{"coursecode":"IT118G","vers":"97732","versname":"HT15","coursename":"Webbutveckling - datorgrafik","coursenamealt":"UNK"},{"coursecode":"IT500G","vers":"1337","versname":"HT15","coursename":"Datorns grunder","coursenamealt":"UNK"},{"coursecode":"IT301G","vers":"1338","versname":"HT15","coursename":"Software Engineering","coursenamealt":"UNK"},{"coursecode":"IT308G","vers":"12305","versname":"HT15","coursename":"Objektorienterad programmering","coursenamealt":"UNK"},{"coursecode":"IT115G","vers":"12307","versname":"HT15","coursename":"Datorns grunder","coursenamealt":"UNK"},{"coursecode":"MA161G","vers":"12308","versname":"HT15","coursename":"Diskret matematik","coursenamealt":"UNK"},{"coursecode":"DA322G","vers":"12309","versname":"HT15","coursename":"Operativsystem","coursenamealt":"UNK"},{"coursecode":"IT326G","vers":"12312","versname":"HT15","coursename":"Distribuerade system","coursenamealt":"UNK"},{"coursecode":"DV736A","vers":"12319","versname":"HT15","coursename":"Examensarbete i datavetenskap","coursenamealt":"UNK"},{"coursecode":"IT108G","vers":"12324","versname":"HT15","coursename":"Webbutveckling - webbplatsdesign","coursenamealt":"UNK"},{"coursecode":"G1337","vers":"1337","versname":"","coursename":"Testing-Course","coursenamealt":"Course for testing codeviewer"},{"coursecode":"G420","vers":"52432","versname":"ST20","coursename":"Demo-Course","coursenamealt":"Chaos Theory - Conspiracy 64k Demo"}],"debug":"NONE!"}',
        'query-after-test-1' => 'DELETE FROM course WHERE coursecode = "TE001S";',
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/courseedService/createNewCourse_ms.php',
        'service-data' => serialize(
            array( 
                'opt' => 'NEW',
                'username' => 'brom',
                'password' => 'password',
                'coursename' => 'Test Course',
                'coursecode' => 'TE001S',
                'courseGitURL' => 'UNK',
                'AUtoken' => 1,
            )
        ),
        'filter-output' => serialize(
            array(
                'entries' => array(
                    'coursename',
                    'coursecode'
                ),
                'versions' => array(
                    'coursecode',
                    'vers',
                    'versname',
                    'coursename',
                    'coursenamealt'
                ),
                'debug'
            )
        ),
    ),
);

testHandler($testsData, true); // true = prettyprint (HTML), false = raw JSON
?>
