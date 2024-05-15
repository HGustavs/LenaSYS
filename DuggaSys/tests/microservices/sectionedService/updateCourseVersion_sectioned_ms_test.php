<?php

include_once "../../../../Shared/test.php";

$testsData = array(
    
    'updateCourseVersion_ms_sectioned.php' => array(
        'expected-output' => '{"entries":[],"debug":"NONE!","writeaccess":true,"studentteacher":false,"readaccess":false,"coursename":"UNK","coursevers":"333","coursecode":"UNK","courseid":"undefined","links":[{"fileid":-1,"filename":"---===######===---"},{"fileid":45,"filename":"diagram.json"},{"fileid":47,"filename":"helloWorld.html"},{"fileid":4,"filename":"HTML_Ex1.txt"},{"fileid":6,"filename":"HTML_Ex2.txt"},{"fileid":8,"filename":"HTML_Ex3.txt"},{"fileid":10,"filename":"HTML_Ex4.txt"},{"fileid":12,"filename":"HTML_Ex5.txt"},{"fileid":14,"filename":"HTML_Ex6.txt"},{"fileid":16,"filename":"HTML_Ex7.txt"},{"fileid":20,"filename":"HTML_Ex8.txt"},{"fileid":23,"filename":"JavaScript_Ex1.txt"},{"fileid":26,"filename":"JavaScript_Ex2.txt"},{"fileid":29,"filename":"JavaScript_Ex3.txt"},{"fileid":50,"filename":"mdTest.md"},{"fileid":31,"filename":"PHP_Ex1.txt"},{"fileid":33,"filename":"PHP_Ex2.txt"},{"fileid":35,"filename":"PHP_Ex3.txt"},{"fileid":38,"filename":"Shader_Ex1.txt"},{"fileid":41,"filename":"Shader_Ex2.txt"}],"duggor":[],"results":[],"versions":[{"cid":1,"coursecode":"DV12G","vers":"45656","versname":"HT15","coursename":"Webbprogrammering","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Webbprogrammering - HT15"},{"cid":1,"coursecode":"DV12G","vers":"45657","versname":"HT16","coursename":"Webbprogrammering","coursenamealt":"UNK","startdate":"2015-12-29 00:00:00","enddate":"2016-03-08 00:00:00","motd":"Webbprogrammering - HT16"},{"cid":2,"coursecode":"IT118G","vers":"97731","versname":"HT14","coursename":"Webbutveckling - datorgrafik","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Webbutveckling - datorgrafik - HT14"},{"cid":2,"coursecode":"IT118G","vers":"97732","versname":"HT15","coursename":"Webbutveckling - datorgrafik","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Webbutveckling - datorgrafik - HT15"},{"cid":3,"coursecode":"IT500G","vers":"1337","versname":"HT15","coursename":"Datorns grunder","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Datorns grunder - HT15"},{"cid":4,"coursecode":"IT301G","vers":"1338","versname":"HT15","coursename":"Software Engineering","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Software Engineering - HT15"},{"cid":305,"coursecode":"IT308G","vers":"12305","versname":"HT15","coursename":"Objektorienterad programmering","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":307,"coursecode":"IT115G","vers":"12307","versname":"HT15","coursename":"Datorns grunder","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":308,"coursecode":"MA161G","vers":"12308","versname":"HT15","coursename":"Diskret matematik","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":309,"coursecode":"DA322G","vers":"12309","versname":"HT15","coursename":"Operativsystem","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":312,"coursecode":"IT326G","vers":"12312","versname":"HT15","coursename":"Distribuerade system","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":319,"coursecode":"DV736A","vers":"12319","versname":"HT15","coursename":"Examensarbete i datavetenskap","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":324,"coursecode":"IT108G","vers":"12324","versname":"HT15","coursename":"Webbutveckling - webbplatsdesign","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":1885,"coursecode":"G1337","vers":"1337","versname":"","coursename":"Testing-Course","coursenamealt":"Course for testing codeviewer","startdate":"2020-05-01 00:00:00","enddate":"2020-06-30 00:00:00","motd":"Code examples shows both templateid and boxid!"},{"cid":1894,"coursecode":"G420","vers":"52432","versname":"ST20","coursename":"Demo-Course","coursenamealt":"Chaos Theory - Conspiracy 64k Demo","startdate":"2020-05-01 00:00:00","enddate":"2020-06-30 00:00:00","motd":"Demo Course 2020 - All current duggas"}],"codeexamples":[{"exampleid":"-1","cid":"","examplename":"","sectionname":"New Example","runlink":"","cversion":""}],"unmarked":0,"startdate":"2024-05-08","enddate":"2024-05-23","groups":{"No":["1","2","3","4","5","6","7","8"],"Le":["A","B","C","D","E","F","G","H"],"Vi":["I","II","III","IV","V","VI","VII","VIII"]},"grpmembershp":"UNK","grplst":[],"userfeedback":[],"feedbackquestion":"UNK","avgfeedbackscore":0}',  
        'query-after-test-1' => "UPDATE vers SET versname='' WHERE cid=1885 AND coursecode='G1337' AND vers=1337;",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/sectionedService/updateCourseVersion_sectioned_ms.php',
        'service-data' => serialize(
            array(
                'username' => 'brom',
                'password' => 'password',
                'courseid' => 'password',
                'coursename' => 'undefined',
                'coursevers' => 333,
                'comment' => 'password',
                'opt' => 'UPDATEVRS',
                'courseid' => 'undefined',
                'cid' => 'undefined',
                'versid' => 333,
                'versname' =>'HT19',
                'coursecode' =>'UNK',
                'makeactive' => 2,
                'startdate' => '2024-05-07',
                'enddate' => '2024-05-24',
                'motd' =>'UNK',
                'log_uuid' => '75E2MMos31iApY8',
                'hash' => 'UNK'
  
                

            )
        ),
        'filter-output' => serialize(
            array(
                'none'
            )
        ),
    ),
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON