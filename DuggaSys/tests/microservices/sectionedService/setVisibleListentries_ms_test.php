<?php
include_once "../../../../Shared/test.php";

$testsData = array(
    'setVisibleListEntries_ms' => array(
        'expected-output' => '{"entries":[],"debug":"Visibility update successfully.","writeaccess":true,"studentteacher":false,"readaccess":false,"coursename":"UNK","coursevers":"1337","coursecode":"UNK","courseid":"UNK","links":[{"fileid":-1,"filename":"---===######===---"},{"fileid":45,"filename":"diagram.json"},{"fileid":47,"filename":"helloWorld.html"},{"fileid":4,"filename":"HTML_Ex1.txt"},{"fileid":6,"filename":"HTML_Ex2.txt"},{"fileid":8,"filename":"HTML_Ex3.txt"},{"fileid":10,"filename":"HTML_Ex4.txt"},{"fileid":12,"filename":"HTML_Ex5.txt"},{"fileid":14,"filename":"HTML_Ex6.txt"},{"fileid":16,"filename":"HTML_Ex7.txt"},{"fileid":20,"filename":"HTML_Ex8.txt"},{"fileid":23,"filename":"JavaScript_Ex1.txt"},{"fileid":26,"filename":"JavaScript_Ex2.txt"},{"fileid":29,"filename":"JavaScript_Ex3.txt"},{"fileid":50,"filename":"mdTest.md"},{"fileid":31,"filename":"PHP_Ex1.txt"},{"fileid":33,"filename":"PHP_Ex2.txt"},{"fileid":35,"filename":"PHP_Ex3.txt"},{"fileid":38,"filename":"Shader_Ex1.txt"},{"fileid":41,"filename":"Shader_Ex2.txt"}],"duggor":[],"results":[],"versions":[{"cid":1,"coursecode":"DV12G","vers":"45656","versname":"HT15","coursename":"Webbprogrammering","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Webbprogrammering - HT15"},{"cid":1,"coursecode":"DV12G","vers":"45657","versname":"HT16","coursename":"Webbprogrammering","coursenamealt":"UNK","startdate":"2015-12-29 00:00:00","enddate":"2016-03-08 00:00:00","motd":"Webbprogrammering - HT16"},{"cid":2,"coursecode":"IT118G","vers":"97731","versname":"HT14","coursename":"Webbutveckling - datorgrafik","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Webbutveckling - datorgrafik - HT14"},{"cid":2,"coursecode":"IT118G","vers":"97732","versname":"HT15","coursename":"Webbutveckling - datorgrafik","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Webbutveckling - datorgrafik - HT15"},{"cid":3,"coursecode":"IT500G","vers":"1337","versname":"HT15","coursename":"Datorns grunder","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Datorns grunder - HT15"},{"cid":4,"coursecode":"IT301G","vers":"1338","versname":"HT15","coursename":"Software Engineering","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Software Engineering - HT15"},{"cid":305,"coursecode":"IT308G","vers":"12305","versname":"HT15","coursename":"Objektorienterad programmering","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":307,"coursecode":"IT115G","vers":"12307","versname":"HT15","coursename":"Datorns grunder","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":308,"coursecode":"MA161G","vers":"12308","versname":"HT15","coursename":"Diskret matematik","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":309,"coursecode":"DA322G","vers":"12309","versname":"HT15","coursename":"Operativsystem","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":312,"coursecode":"IT326G","vers":"12312","versname":"HT15","coursename":"Distribuerade system","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":319,"coursecode":"DV736A","vers":"12319","versname":"HT15","coursename":"Examensarbete i datavetenskap","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":324,"coursecode":"IT108G","vers":"12324","versname":"HT15","coursename":"Webbutveckling - webbplatsdesign","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":1885,"coursecode":"G1337","vers":"1337","versname":"","coursename":"Testing-Course","coursenamealt":"Course for testing codeviewer","startdate":"2020-05-01 00:00:00","enddate":"2020-06-30 00:00:00","motd":"Code examples shows both templateid and boxid!"},{"cid":1894,"coursecode":"G420","vers":"52432","versname":"ST20","coursename":"Demo-Course","coursenamealt":"Chaos Theory - Conspiracy 64k Demo","startdate":"2020-05-01 00:00:00","enddate":"2020-06-30 00:00:00","motd":"Demo Course 2020 - All current duggas"}],"codeexamples":[{"exampleid":"-1","cid":"","examplename":"","sectionname":"New Example","runlink":"","cversion":""}],"unmarked":0,"startdate":null,"enddate":null,"groups":[],"grpmembershp":null,"grplst":[],"userfeedback":[],"feedbackquestion":[],"avgfeedbackscore":[]}',
        'query-before-test-1' => "INSERT INTO listentries(cid, entryname,visible, creator, vers) VALUES (1885, 'setvisListEntry',1, 101, 1337);",
        'query-before-test-2' => "SELECT lid FROM listentries WHERE entryname = 'setvisListEntry';",
        'query-after-test-1' => "DELETE FROM listentries WHERE entryname = 'setvisListEntry';",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/sectionedService/setVisibleListentries_ms.php',
        'service-data' => serialize(
            array( 
                'username' => 'brom',
                'password' => 'password',
                'lid' => '<!query-before-test-2!><*[0]["lid"]*>',
                'visible' => 0,
                'cid' => 1885,
                'vers' => 1337,
                'opt' => 'PUBLIC', //unsure which opt is suitable
            )
        ),
        'filter-output' => serialize(
            array( 
                // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )
        ),
    )
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON