<?php

include "../../../../Shared/test.php";

$testsData = array(
    'readCourseVersions_ms' => array(
        'expected-output' => '{"debug":"NONE!","versions":[{"cid":"1","coursecode":"DV12G","vers":"45656","versname":"HT15","coursename":"Webbprogrammering","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Webbprogrammering - HT15"},{"cid":"1","coursecode":"DV12G","vers":"45657","versname":"HT16","coursename":"Webbprogrammering","coursenamealt":"UNK","startdate":"2015-12-29 00:00:00","enddate":"2016-03-08 00:00:00","motd":"Webbprogrammering - HT16"},{"cid":"2","coursecode":"IT118G","vers":"97731","versname":"HT14","coursename":"Webbutveckling - datorgrafik","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Webbutveckling - datorgrafik - HT14"},{"cid":"2","coursecode":"IT118G","vers":"97732","versname":"HT15","coursename":"Webbutveckling - datorgrafik","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Webbutveckling - datorgrafik - HT15"},{"cid":"3","coursecode":"IT500G","vers":"1337","versname":"HT15","coursename":"Datorns grunder","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Datorns grunder - HT15"},{"cid":"4","coursecode":"IT301G","vers":"1338","versname":"HT15","coursename":"Software Engineering","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Software Engineering - HT15"},{"cid":"305","coursecode":"IT308G","vers":"12305","versname":"HT15","coursename":"Objektorienterad programmering","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"307","coursecode":"IT115G","vers":"12307","versname":"HT15","coursename":"Datorns grunder","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"308","coursecode":"MA161G","vers":"12308","versname":"HT15","coursename":"Diskret matematik","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"309","coursecode":"DA322G","vers":"12309","versname":"HT15","coursename":"Operativsystem","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"312","coursecode":"IT326G","vers":"12312","versname":"HT15","coursename":"Distribuerade system","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"319","coursecode":"DV736A","vers":"12319","versname":"HT15","coursename":"Examensarbete i datavetenskap","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"324","coursecode":"IT108G","vers":"12324","versname":"HT15","coursename":"Webbutveckling - webbplatsdesign","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"1885","coursecode":"G1337","vers":"1337","versname":"","coursename":"Testing-Course","coursenamealt":"Course for testing codeviewer","startdate":"2020-05-01 00:00:00","enddate":"2020-06-30 00:00:00","motd":"Code examples shows both templateid and boxid!"},{"cid":"1894","coursecode":"G420","vers":"52432","versname":"ST20","coursename":"Demo-Course","coursenamealt":"Chaos Theory - Conspiracy 64k Demo","startdate":"2020-05-01 00:00:00","enddate":"2020-06-30 00:00:00","motd":"Demo Course 2020 - All current duggas"}]}', 
        // Using getListEntries because it calls retrieveSectionedService. 
        // retrieveSectionedService retrieves and returns course versions by calling readCourseVersions()
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/sectionedService/getListEntries_ms.php',
        'service-data' => serialize(array( 
                'courseid' => 1885,
                'coursevers' => 1337,
                'opt' => 'get',
                'username' => 'brom',
                'password' => 'password',
        )),
        'filter-output' => serialize(array( 
            // Filter what output to use in assert test
            'debug',
            'versions',
        )),
    ),
);


testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON

?>
