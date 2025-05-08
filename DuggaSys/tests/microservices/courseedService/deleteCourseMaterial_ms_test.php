<?php

include_once "../../../../Shared/test.php";

$testsData = array(
    'deleteCourseMaterial' => array(
        'expected-output' => '{"LastCourseCreated":null,"entries":[{"cid":"3","coursename":"Datorns grunder","coursecode":"IT500G","visibility":"1","activeversion":"1337","activeedversion":null,"registered":false},{"cid":"307","coursename":"Datorns grunder","coursecode":"IT115G","visibility":"0","activeversion":"12307","activeedversion":null,"registered":false},{"cid":"1894","coursename":"Demo-Course","coursecode":"G420","visibility":"1","activeversion":"52432","activeedversion":null,"registered":false},{"cid":"308","coursename":"Diskret matematik","coursecode":"MA161G","visibility":"0","activeversion":"12308","activeedversion":null,"registered":false},{"cid":"312","coursename":"Distribuerade system","coursecode":"IT326G","visibility":"0","activeversion":"12312","activeedversion":null,"registered":false},{"cid":"319","coursename":"Examensarbete i datavetenskap","coursecode":"DV736A","visibility":"0","activeversion":"12319","activeedversion":null,"registered":false},{"cid":"305","coursename":"Objektorienterad programmering","coursecode":"IT308G","visibility":"0","activeversion":"12305","activeedversion":null,"registered":false},{"cid":"309","coursename":"Operativsystem","coursecode":"DA322G","visibility":"0","activeversion":"12309","activeedversion":null,"registered":false},{"cid":"4","coursename":"Software Engineering","coursecode":"IT301G","visibility":"1","activeversion":"1338","activeedversion":null,"registered":false},{"cid":"1885","coursename":"Testing-Course","coursecode":"G1337","visibility":"1","activeversion":"1337","activeedversion":null,"registered":false},{"cid":"1","coursename":"Webbprogrammering","coursecode":"DV12G","visibility":"1","activeversion":"45656","activeedversion":null,"registered":false},{"cid":"2","coursename":"Webbutveckling - datorgrafik","coursecode":"IT118G","visibility":"1","activeversion":"97732","activeedversion":null,"registered":false},{"cid":"324","coursename":"Webbutveckling - webbplatsdesign","coursecode":"IT108G","visibility":"0","activeversion":"12324","activeedversion":null,"registered":false}],"versions":[{"cid":"1","coursecode":"DV12G","vers":"45656","versname":"HT15","coursename":"Webbprogrammering","coursenamealt":"UNK"},{"cid":"1","coursecode":"DV12G","vers":"45657","versname":"HT16","coursename":"Webbprogrammering","coursenamealt":"UNK"},{"cid":"2","coursecode":"IT118G","vers":"97731","versname":"HT14","coursename":"Webbutveckling - datorgrafik","coursenamealt":"UNK"},{"cid":"2","coursecode":"IT118G","vers":"97732","versname":"HT15","coursename":"Webbutveckling - datorgrafik","coursenamealt":"UNK"},{"cid":"3","coursecode":"IT500G","vers":"1337","versname":"HT15","coursename":"Datorns grunder","coursenamealt":"UNK"},{"cid":"4","coursecode":"IT301G","vers":"1338","versname":"HT15","coursename":"Software Engineering","coursenamealt":"UNK"},{"cid":"305","coursecode":"IT308G","vers":"12305","versname":"HT15","coursename":"Objektorienterad programmering","coursenamealt":"UNK"},{"cid":"307","coursecode":"IT115G","vers":"12307","versname":"HT15","coursename":"Datorns grunder","coursenamealt":"UNK"},{"cid":"308","coursecode":"MA161G","vers":"12308","versname":"HT15","coursename":"Diskret matematik","coursenamealt":"UNK"},{"cid":"309","coursecode":"DA322G","vers":"12309","versname":"HT15","coursename":"Operativsystem","coursenamealt":"UNK"},{"cid":"312","coursecode":"IT326G","vers":"12312","versname":"HT15","coursename":"Distribuerade system","coursenamealt":"UNK"},{"cid":"319","coursecode":"DV736A","vers":"12319","versname":"HT15","coursename":"Examensarbete i datavetenskap","coursenamealt":"UNK"},{"cid":"324","coursecode":"IT108G","vers":"12324","versname":"HT15","coursename":"Webbutveckling - webbplatsdesign","coursenamealt":"UNK"},{"cid":"1885","coursecode":"G1337","vers":"1337","versname":"","coursename":"Testing-Course","coursenamealt":"Course for testing codeviewer"},{"cid":"1894","coursecode":"G420","vers":"52432","versname":"ST20","coursename":"Demo-Course","coursenamealt":"Chaos Theory - Conspiracy 64k Demo"}],"debug":"NONE!","writeaccess":true,"motd":"UNK","readonly":0}',
        'query-before-test-1' => 'INSERT INTO course (cid, visibility,creator,coursecode,coursename) VALUES (9999,3,1,"TE123S","TESTCOURSE");',
        'query-before-test-2' => 'INSERT INTO coursekeys (urlkey,cid,coursecode,coursename) VALUES ("TESTINGKEY",9999,"TE123S","TESTCOURSE"); ',
        'query-before-test-3' => 'INSERT INTO course_req (cid,req_cid) VALUES (9999,1885);',
        'query-before-test-5' => 'INSERT INTO programcourse (cid,class) VALUES (9999,"DVSUG13h");',
        'query-before-test-7' => 'INSERT INTO vers (cid, vers,versname,coursecode,coursename,coursenamealt) VALUES (9999,10001,"HT00","TE123S","TESTCOURSE","coursealt");',
        'query-before-test-4' => 'INSERT INTO user_course (cid,uid,access,vers) VALUES (9999,101,"R",10001);',
        'query-before-test-6' => 'INSERT INTO fileLink (cid,fileid,filename,vers) VALUES (9999, 10000,"filenametest",10001);',
        'query-before-test-8' => 'INSERT INTO quiz (cid, id,vers,creator) VALUES (9999,10002,10001,1);',
        'query-before-test-9' => 'INSERT INTO variant (vid,quizID) VALUES (10003,10002);',
        'query-before-test-10' => 'INSERT INTO timesheet (cid,uid,tid,vers,did,moment,day) VALUES (9999,101,10004,10001,1,3001,"2024-01-01");',
        'query-before-test-11' => 'INSERT INTO listentries (cid,lid,vers,moment,creator) VALUES (9999, 10005,10001,3001,1);',
        'query-before-test-12' => 'INSERT INTO userAnswer (cid,aid,vers,moment,uid) VALUES (9999, 10006,10001,3001,101);',
        'query-before-test-13' => 'INSERT INTO user_participant (id,lid,uid) VALUES (10007,10005,101);',
        'query-before-test-14' => 'INSERT INTO codeexample (cid,exampleid,uid) VALUES (9999,10008,101);',
        'query-before-test-15' => 'INSERT INTO impwordlist (wordid,exampleid,uid) VALUES (10009,10008,101);',
        'query-before-test-16' => 'INSERT INTO box (boxid,exampleid,filename) VALUES (10010,10008,"filenametest");',
        'query-before-test-17' => 'INSERT INTO improw (impid,boxid,exampleid,uid) VALUES (10011,10010,10008,101);',
        'query-before-test-18' => 'INSERT INTO subparts (cid,partname) VALUES (9999,"testpart");',
        'query-before-test-19' => 'INSERT INTO partresult (cid,uid,partname) VALUES (9999,101,"testpart");',
        //Deletes are performed just in case the service fails
        'query-after-test-1' => 'DELETE FROM course WHERE cid=9999;',
        'query-after-test-2' => 'DELETE FROM coursekeys WHERE urlkey="TESTINGKEY" AND cid=9999;',
        'query-after-test-3' => 'DELETE FROM course_req WHERE cid=9999 AND req_cid=1885;',
        'query-after-test-4' => 'DELETE FROM user_course WHERE cid=9999 AND uid=101;',
        'query-after-test-5' => 'DELETE FROM programcourse WHERE cid=9999 AND class="DVSUG13h";',
        'query-after-test-6' => 'DELETE FROM fileLink WHERE cid=9999 AND fileid=10000;',
        'query-after-test-7' => 'DELETE FROM vers WHERE cid=9999 AND vers=10001;',
        'query-after-test-8' => 'DELETE FROM quiz WHERE cid=9999 AND id=10002;',
        'query-after-test-9' => 'DELETE FROM variant WHERE quizID=10002 AND vid=10003;',
        'query-after-test-10' => 'DELETE FROM timesheet WHERE cid=9999 AND uid=101 AND tid=10004;',
        'query-after-test-11' => 'DELETE FROM listentries WHERE cid=9999 AND lid=10005;',
        'query-after-test-12' => 'DELETE FROM userAnswer WHERE cid=9999 AND aid=10006;',
        'query-after-test-13' => 'DELETE FROM user_participant WHERE id=10007 AND lid=10005;',
        'query-after-test-14' => 'DELETE FROM codeexample WHERE cid=9999 AND exampleid=10008;',
        'query-after-test-15' => 'DELETE FROM impwordlist WHERE wordid=10009 and exampleid=10008;',
        'query-after-test-16' => 'DELETE FROM box WHERE boxid=10010 AND exampleid=10008;',
        'query-after-test-17' => 'DELETE FROM improw WHERE impid=10011 AND boxid=10010 AND exampleid=10008;',
        'query-after-test-18' => 'DELETE FROM subparts WHERE cid=9999 AND partname="testpart";',
        'query-after-test-19' => 'DELETE FROM partresult WHERE cid=9999 AND uid=101 AND partname="testpart";',
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/courseedService/retrieveAllCourseedServiceData_ms.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',
            )
        ),
        'filter-output' => serialize(
            array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )
        ),
    ),
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON
