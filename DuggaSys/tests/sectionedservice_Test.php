<?php
/********************************************************************************

   Documentation 

*********************************************************************************
 
 Documentation for how these tests are used can be found in Shared/Documentation/Test API

 The original code for the service that is tested in reorderListentries, changes the value of "moment", therefore these tests can only be performed once with a passing grades. Should another attempt be performed before reseting the database some test will undoubtedly fail.

 The service used in test removeListentries, is never used
 The github related services "REFGIT" and "CREGITEX"  do not have tests for the time being. they were not completed at the time. They therefore need to be added to this file.
 The services changeActiveCourseVersion_sectioned and updateCourseVersion_sectioned are not in a functioning state, the tests for them are therefore not complete. 

-------------==============######## Documentation End ###########==============-------------
*/
 
include "../../Shared/test.php";


$testsData = array(
    //------------------------------------------------------------------------------------------
    // This test the microservice getCourseGroupsAndMembers and the part of the monalith called "GRP" 
    //------------------------------------------------------------------------------------------
    'getCourseGroupsAndMembers' => array(
        'expected-output' => '{"entries":[{"entryname":"PHP examples","pos":"1","moment":null,"visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"PHP Example 1","pos":"2","moment":null,"visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2015-01-30 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"PHP Example 2","pos":"3","moment":null,"visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2015-01-25 15:30:00","relativedeadline":null,"qrelease":"2015-01-08 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"PHP Example 3","pos":"4","moment":null,"visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2015-01-20 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"New Group","pos":"5","moment":null,"visible":"0","highscoremode":"0","gradesys":"0","code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":"TOP","qstart":null,"grptype":null,"tabs":"0","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Javascript examples","pos":"5","moment":null,"visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"JavaScript Example 1","pos":"6","moment":null,"visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2015-01-18 15:30:00","relativedeadline":null,"qrelease":"2015-01-08 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"JavaScript Example 2","pos":"7","moment":null,"visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2015-02-10 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"JavaScript Example 3","pos":"8","moment":null,"visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2015-02-15 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"HTML5 examples","pos":"9","moment":null,"visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"HTML5 Example 1","pos":"10","moment":null,"visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2015-02-05 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"HTML5 Example 2","pos":"11","moment":null,"visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2015-02-20 15:30:00","relativedeadline":null,"qrelease":"2015-02-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"HTML5 Example 3","pos":"12","moment":null,"visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2015-02-19 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"HTML5 Example 4","pos":"13","moment":null,"visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2015-02-19 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"HTML5 Example 5","pos":"14","moment":null,"visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2015-02-19 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"HTML5 Example 6","pos":"15","moment":null,"visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2015-02-19 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"HTML5 Example 7","pos":"16","moment":null,"visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2020-06-30 00:00:00","relativedeadline":null,"qrelease":"2020-05-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"HTML5 Example 8","pos":"17","moment":null,"visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2020-06-30 00:00:00","relativedeadline":null,"qrelease":"2020-05-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"Shader examples","pos":"18","moment":null,"visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"Shaderprogrammering","pos":"19","moment":null,"visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2020-06-30 00:00:00","relativedeadline":null,"qrelease":"2020-05-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"Shaderprogrammering","pos":"20","moment":null,"visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2020-06-30 00:00:00","relativedeadline":null,"qrelease":"2020-05-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null}],"groups":{"No":["1","2","3","4","5","6","7","8"],"Le":["A","B","C","D","E","F","G","H"],"Vi":["I","II","III","IV","V","VI","VII","VIII"]},"debug":"NONE!","writeaccess":true,"studentteacher":false,"readaccess":true,"coursename":"Webbprogrammering","coursevers":"45656","coursecode":"DV12G","courseid":"1","links":[{"fileid":-1,"filename":"---===######===---"},{"fileid":"45","filename":"diagram.json"},{"fileid":"47","filename":"helloWorld.html"},{"fileid":"4","filename":"HTML_Ex1.txt"},{"fileid":"6","filename":"HTML_Ex2.txt"},{"fileid":"8","filename":"HTML_Ex3.txt"},{"fileid":"10","filename":"HTML_Ex4.txt"},{"fileid":"12","filename":"HTML_Ex5.txt"},{"fileid":"14","filename":"HTML_Ex6.txt"},{"fileid":"16","filename":"HTML_Ex7.txt"},{"fileid":"20","filename":"HTML_Ex8.txt"},{"fileid":"23","filename":"JavaScript_Ex1.txt"},{"fileid":"26","filename":"JavaScript_Ex2.txt"},{"fileid":"29","filename":"JavaScript_Ex3.txt"},{"fileid":"50","filename":"mdTest.md"},{"fileid":"31","filename":"PHP_Ex1.txt"},{"fileid":"33","filename":"PHP_Ex2.txt"},{"fileid":"35","filename":"PHP_Ex3.txt"},{"fileid":"38","filename":"Shader_Ex1.txt"},{"fileid":"41","filename":"Shader_Ex2.txt"},{"fileid":-1,"filename":"---===######===---"},{"fileid":"1","filename":"HTML_Ex1.css"},{"fileid":"2","filename":"HTML_Ex1.html"},{"fileid":"3","filename":"HTML_Ex1.js"},{"fileid":"5","filename":"HTML_Ex2.html"},{"fileid":"7","filename":"HTML_Ex3.html"},{"fileid":"9","filename":"HTML_Ex4.html"},{"fileid":"11","filename":"HTML_Ex5.html"},{"fileid":"13","filename":"HTML_Ex6.html"},{"fileid":"15","filename":"HTML_Ex7.html"},{"fileid":"17","filename":"HTML_Ex8.css"},{"fileid":"18","filename":"HTML_Ex8.html"},{"fileid":"19","filename":"HTML_Ex8.js"},{"fileid":"21","filename":"JavaScript_Ex1.html"},{"fileid":"22","filename":"JavaScript_Ex1.js"},{"fileid":"24","filename":"JavaScript_Ex2.html"},{"fileid":"25","filename":"JavaScript_Ex2.js"},{"fileid":"27","filename":"JavaScript_Ex3.html"},{"fileid":"28","filename":"JavaScript_Ex3.js"},{"fileid":"30","filename":"PHP_Ex1.php"},{"fileid":"32","filename":"PHP_Ex2.php"},{"fileid":"34","filename":"PHP_Ex3.php"},{"fileid":"36","filename":"Shader_Ex1.html"},{"fileid":"37","filename":"Shader_Ex1.js"},{"fileid":"39","filename":"Shader_Ex2.html"},{"fileid":"40","filename":"Shader_Ex2.js"}],"duggor":[],"results":[],"versions":[{"cid":"1","coursecode":"DV12G","vers":"45656","versname":"HT15","coursename":"Webbprogrammering","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Webbprogrammering - HT15"},{"cid":"1","coursecode":"DV12G","vers":"45657","versname":"HT16","coursename":"Webbprogrammering","coursenamealt":"UNK","startdate":"2015-12-29 00:00:00","enddate":"2016-03-08 00:00:00","motd":"Webbprogrammering - HT16"},{"cid":"2","coursecode":"IT118G","vers":"97731","versname":"HT14","coursename":"Webbutveckling - datorgrafik","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Webbutveckling - datorgrafik - HT14"},{"cid":"2","coursecode":"IT118G","vers":"97732","versname":"HT15","coursename":"Webbutveckling - datorgrafik","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Webbutveckling - datorgrafik - HT15"},{"cid":"3","coursecode":"IT500G","vers":"1337","versname":"HT15","coursename":"Datorns grunder","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Datorns grunder - HT15"},{"cid":"4","coursecode":"IT301G","vers":"1338","versname":"HT15","coursename":"Software Engineering","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Software Engineering - HT15"},{"cid":"305","coursecode":"IT308G","vers":"12305","versname":"HT15","coursename":"Objektorienterad programmering","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"307","coursecode":"IT115G","vers":"12307","versname":"HT15","coursename":"Datorns grunder","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"308","coursecode":"MA161G","vers":"12308","versname":"HT15","coursename":"Diskret matematik","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"309","coursecode":"DA322G","vers":"12309","versname":"HT15","coursename":"Operativsystem","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"312","coursecode":"IT326G","vers":"12312","versname":"HT15","coursename":"Distribuerade system","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"319","coursecode":"DV736A","vers":"12319","versname":"HT15","coursename":"Examensarbete i datavetenskap","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"324","coursecode":"IT108G","vers":"12324","versname":"HT15","coursename":"Webbutveckling - webbplatsdesign","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"1885","coursecode":"G1337","vers":"1337","versname":"","coursename":"Testing-Course","coursenamealt":"Course for testing codeviewer","startdate":"2020-05-01 00:00:00","enddate":"2020-06-30 00:00:00","motd":"Code examples shows both templateid and boxid!"},{"cid":"1894","coursecode":"G420","vers":"52432","versname":"ST20","coursename":"Demo-Course","coursenamealt":"Chaos Theory - Conspiracy 64k Demo","startdate":"2020-05-01 00:00:00","enddate":"2020-06-30 00:00:00","motd":"Demo Course 2020 - All current duggas"}],"codeexamples":[{"exampleid":"-1","cid":"","examplename":"","sectionname":"New Example","runlink":"","cversion":""},{"exampleid":"12","cid":"1","examplename":"2D Tile Map and Mouse Coordinates","sectionname":"HTML5 Example 6","runlink":"HTML_Ex6.html","cversion":"45656"},{"exampleid":"5","cid":"1","examplename":"Adding and removing elements in the DOM","sectionname":"JavaScript Example 2","runlink":"JavaScript_Ex2.html","cversion":"45656"},{"exampleid":"9","cid":"1","examplename":"Animation and drawing images","sectionname":"HTML5 Example 3","runlink":"HTML_Ex3.html","cversion":"45656"},{"exampleid":"7","cid":"1","examplename":"Basic canvas graphics","sectionname":"HTML5 Example 1","runlink":"HTML_Ex1.html","cversion":"45656"},{"exampleid":"8","cid":"1","examplename":"Canvas Gradients and Transformations","sectionname":"HTML5 Example 2","runlink":"HTML_Ex2.html","cversion":"45656"},{"exampleid":"14","cid":"1","examplename":"Cookies","sectionname":"HTML5 Example 8","runlink":"HTML_Ex8.html","cversion":"45656"},{"exampleid":"4","cid":"1","examplename":"Events, DOM access and console.log","sectionname":"JavaScript Example 1","runlink":"JavaScript_Ex1.html","cversion":"45656"},{"exampleid":"13","cid":"1","examplename":"Isometric Tile Map and Mouse Coordinates","sectionname":"HTML5 Example 7","runlink":"HTML_Ex7.html","cversion":"45656"},{"exampleid":"9021","cid":"1","examplename":"New Group","sectionname":"New Group9021","runlink":null,"cversion":"45656"},{"exampleid":"15","cid":"1","examplename":"Per Pixel Diffuse Lighting","sectionname":"Shaderprogrammering","runlink":"Shader_Ex1.html","cversion":"45656"},{"exampleid":"2","cid":"1","examplename":"PHP Startup","sectionname":"PHP Example 2","runlink":"PHP_Ex2.php","cversion":"45656"},{"exampleid":"1","cid":"1","examplename":"PHP Startup","sectionname":"PHP Example 1","runlink":"PHP_Ex1.php","cversion":"45656"},{"exampleid":"3","cid":"1","examplename":"PHP Variables","sectionname":"PHP Example 3","runlink":"PHP_Ex3.php","cversion":"45656"},{"exampleid":"11","cid":"1","examplename":"Reading mouse coordinates","sectionname":"HTML5 Example 5","runlink":"HTML_Ex5.html","cversion":"45656"},{"exampleid":"16","cid":"1","examplename":"Rim Lighting","sectionname":"Shaderprogrammering","runlink":"Shader_Ex2.html","cversion":"45656"},{"exampleid":"10","cid":"1","examplename":"Shadows","sectionname":"HTML5 Example 4","runlink":"HTML_Ex4.html","cversion":"45656"},{"exampleid":"6","cid":"1","examplename":"Validating form data","sectionname":"JavaScript Example 3","runlink":"JavaScript_Ex3.html","cversion":"45656"}],"unmarked":"0","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","grpmembershp":"UNK","grplst":[],"userfeedback":[],"feedbackquestion":"UNK","avgfeedbackscore":0}',

        'query-before-test-1' => "INSERT INTO listentries (cid,vers, entryname, link, kind, pos, visible,creator,comments, gradesystem, highscoremode, groupKind) VALUES(1,45656,'New Group',9021,6,5,0,22,'TOP', 0, 0, null)",
        'query-before-test-2' => "INSERT INTO codeexample (exampleid, cid, examplename, sectionname, beforeid, afterid, runlink, cversion, public, uid, templateid) VALUE (9021, 1, 'New Group', 'New Group9021', NULL, NULL, NULL, 45656, 0, 1, 0);",
        'query-after-test-1' => "DELETE FROM listentries WHERE lid > 5009;",
        'query-after-test-2' => "DELETE FROM codeexample WHERE exampleid > 9009;",
        'service' => 'sectionedservice.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'opt' => 'GRP',
            'username' => 'mestr',
            'password' => 'password',
            'courseid' => '1',
            'coursevers' => '45656',
            'blop' => '!query-before-test-1! [0][coursename]',
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'entries' => array(
                'entryname',
                //'lid',
                'pos',
                'moment',
                //'link',
                'visible',
                'highscoremode',
                'gradesys',
                'code_id',
                'deadline',
                'relativedeadline',
                'qrelease',
                'comments',
                'qstart',
                'grptype',
                'tabs',
                'feedbackenabled',
                'feedbackquestion',
                //'ts'
            ),
            'debug',
            'writeaccess',
            'studentteacher',
            'readaccess',
            'coursename',
            'coursevers',
            'coursecode',
            'courseid',
            'links',
            'duggor',
            'results',
            'versions',
            'codeexamples',
            'unmarked',
            'startdate',
            'enddate',
            'groups',
            'grpmembershp',
            'grplst',
            'userfeedback',
            'feedbackquestion',
            'avgfeedbackscore'
        )),
    ),
    //---------------------------------------------------------------------------------------------------------------
    // This test will test the micro-service deleteListentries and its curresponding part in the monolith called "DEL"
    //---------------------------------------------------------------------------------------------------------------
    'deleteListentries' => array(
        'expected-output'   => '{"groups":{"No":["1","2","3","4","5","6","7","8"],"Le":["A","B","C","D","E","F","G","H"],"Vi":["I","II","III","IV","V","VI","VII","VIII"]},"debug":"NONE!","writeaccess":false,"studentteacher":false,"readaccess":false,"coursename":"UNK","coursevers":"UNK","coursecode":"UNK","courseid":"UNK","links":[],"duggor":[],"results":[],"versions":[{"cid":"1","coursecode":"DV12G","vers":"45656","versname":"HT15","coursename":"Webbprogrammering","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Webbprogrammering - HT15"},{"cid":"1","coursecode":"DV12G","vers":"45657","versname":"HT16","coursename":"Webbprogrammering","coursenamealt":"UNK","startdate":"2015-12-29 00:00:00","enddate":"2016-03-08 00:00:00","motd":"Webbprogrammering - HT16"},{"cid":"2","coursecode":"IT118G","vers":"97731","versname":"HT14","coursename":"Webbutveckling - datorgrafik","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Webbutveckling - datorgrafik - HT14"},{"cid":"2","coursecode":"IT118G","vers":"97732","versname":"HT15","coursename":"Webbutveckling - datorgrafik","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Webbutveckling - datorgrafik - HT15"},{"cid":"3","coursecode":"IT500G","vers":"1337","versname":"HT15","coursename":"Datorns grunder","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Datorns grunder - HT15"},{"cid":"4","coursecode":"IT301G","vers":"1338","versname":"HT15","coursename":"Software Engineering","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Software Engineering - HT15"},{"cid":"305","coursecode":"IT308G","vers":"12305","versname":"HT15","coursename":"Objektorienterad programmering","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"307","coursecode":"IT115G","vers":"12307","versname":"HT15","coursename":"Datorns grunder","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"308","coursecode":"MA161G","vers":"12308","versname":"HT15","coursename":"Diskret matematik","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"309","coursecode":"DA322G","vers":"12309","versname":"HT15","coursename":"Operativsystem","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"312","coursecode":"IT326G","vers":"12312","versname":"HT15","coursename":"Distribuerade system","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"319","coursecode":"DV736A","vers":"12319","versname":"HT15","coursename":"Examensarbete i datavetenskap","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"324","coursecode":"IT108G","vers":"12324","versname":"HT15","coursename":"Webbutveckling - webbplatsdesign","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"1885","coursecode":"G1337","vers":"1337","versname":"","coursename":"Testing-Course","coursenamealt":"Course for testing codeviewer","startdate":"2020-05-01 00:00:00","enddate":"2020-06-30 00:00:00","motd":"Code examples shows both templateid and boxid!"},{"cid":"1894","coursecode":"G420","vers":"52432","versname":"ST20","coursename":"Demo-Course","coursenamealt":"Chaos Theory - Conspiracy 64k Demo","startdate":"2020-05-01 00:00:00","enddate":"2020-06-30 00:00:00","motd":"Demo Course 2020 - All current duggas"}],"codeexamples":[],"unmarked":0,"startdate":"UNK","enddate":"UNK","grpmembershp":"UNK","grplst":[],"userfeedback":[],"feedbackquestion":"UNK","avgfeedbackscore":0}',
        'query-before-test-1' => "INSERT INTO listentries (lid, cid, vers, entryname, link, kind, pos, visible, creator, comments, gradesystem, highscoremode, groupKind)   
                                  VALUES(5020,1,45656,'New Group',9021,6,5,0,22,'TOP', 0, 0, null);",
        'query-after-test-1' =>  "DELETE FROM listentries WHERE lid > 5009;",
        'service' => 'sectionedservice.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'opt' => 'DEL',
            'username' => 'mestr',
            'password' => 'password',
            'lid' => '5020'
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service	
            'debug',
            'writeaccess',
            'studentteacher',
            'readaccess', 
            'coursename',
            'coursevers',
            'coursecode',
            'courseid',
            'links',
            'duggor',
            'results',
            'versions',
            'codeexamples',
            'unmarked',
            'startdate',
            'enddate',
            'groups',
            'grpmembershp',
            'grplst',
            'userfeedback',
            'feedbackquestion',
            'avgfeedbackscore'
        )),
    ),
    //-------------------------------------------------------------------------------------------------------------------
    // This test will test the micro-service removeListentries and its curresponding part in the monolith called "DELETED"
    //-------------------------------------------------------------------------------------------------------------------
    'removeListentries' => array(
        'expected-output'   => '{"groups":{"No":["1","2","3","4","5","6","7","8"],"Le":["A","B","C","D","E","F","G","H"],"Vi":["I","II","III","IV","V","VI","VII","VIII"]},"debug":"NONE!","writeaccess":false,"studentteacher":false,"readaccess":false,"coursename":"UNK","coursevers":"UNK","coursecode":"UNK","courseid":"UNK","links":[],"duggor":[],"results":[],"versions":[{"cid":"1","coursecode":"DV12G","vers":"45656","versname":"HT15","coursename":"Webbprogrammering","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Webbprogrammering - HT15"},{"cid":"1","coursecode":"DV12G","vers":"45657","versname":"HT16","coursename":"Webbprogrammering","coursenamealt":"UNK","startdate":"2015-12-29 00:00:00","enddate":"2016-03-08 00:00:00","motd":"Webbprogrammering - HT16"},{"cid":"2","coursecode":"IT118G","vers":"97731","versname":"HT14","coursename":"Webbutveckling - datorgrafik","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Webbutveckling - datorgrafik - HT14"},{"cid":"2","coursecode":"IT118G","vers":"97732","versname":"HT15","coursename":"Webbutveckling - datorgrafik","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Webbutveckling - datorgrafik - HT15"},{"cid":"3","coursecode":"IT500G","vers":"1337","versname":"HT15","coursename":"Datorns grunder","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Datorns grunder - HT15"},{"cid":"4","coursecode":"IT301G","vers":"1338","versname":"HT15","coursename":"Software Engineering","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Software Engineering - HT15"},{"cid":"305","coursecode":"IT308G","vers":"12305","versname":"HT15","coursename":"Objektorienterad programmering","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"307","coursecode":"IT115G","vers":"12307","versname":"HT15","coursename":"Datorns grunder","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"308","coursecode":"MA161G","vers":"12308","versname":"HT15","coursename":"Diskret matematik","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"309","coursecode":"DA322G","vers":"12309","versname":"HT15","coursename":"Operativsystem","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"312","coursecode":"IT326G","vers":"12312","versname":"HT15","coursename":"Distribuerade system","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"319","coursecode":"DV736A","vers":"12319","versname":"HT15","coursename":"Examensarbete i datavetenskap","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"324","coursecode":"IT108G","vers":"12324","versname":"HT15","coursename":"Webbutveckling - webbplatsdesign","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"1885","coursecode":"G1337","vers":"1337","versname":"","coursename":"Testing-Course","coursenamealt":"Course for testing codeviewer","startdate":"2020-05-01 00:00:00","enddate":"2020-06-30 00:00:00","motd":"Code examples shows both templateid and boxid!"},{"cid":"1894","coursecode":"G420","vers":"52432","versname":"ST20","coursename":"Demo-Course","coursenamealt":"Chaos Theory - Conspiracy 64k Demo","startdate":"2020-05-01 00:00:00","enddate":"2020-06-30 00:00:00","motd":"Demo Course 2020 - All current duggas"}],"codeexamples":[],"unmarked":0,"startdate":"UNK","enddate":"UNK","grpmembershp":"UNK","grplst":[],"userfeedback":[],"feedbackquestion":"UNK","avgfeedbackscore":0}',
        'query-before-test-1' => "INSERT INTO listentries (lid, cid, vers, entryname, link, kind, pos, visible, creator, comments, gradesystem, highscoremode, groupKind)   
                                  VALUES(5020,1,45656,'New Group',9021,6,5,0,22,'TOP', 0, 0, null);",
        'query-after-test-1' =>  "DELETE FROM listentries WHERE lid > 5009;",
        'service' => 'sectionedservice.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'opt' => 'DELETED',
            'username' => 'mestr',
            'password' => 'password',
            'lid' => '5020'
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'debug',
            'writeaccess',
            'studentteacher',
            'readaccess', 
            'coursename',
            'coursevers',
            'coursecode',
            'courseid',
            'links',
            'duggor',
            'results',
            'versions',
            'codeexamples',
            'unmarked',
            'startdate',
            'enddate',
            'groups',
            'grpmembershp',
            'grplst',
            'userfeedback',
            'feedbackquestion',
            'avgfeedbackscore'
    )),
    ),
    //-------------------------------------------------------------------------------------
    // This test the microservice createListentrie and the part of the monalith called "NEW"
    //-------------------------------------------------------------------------------------
    'createListentrie' => array(
        'expected-output'   => '{"entries":[{"entryname":"PHP examples","pos":"1","kind":"1","moment":null,"visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"PHP Example 1","pos":"2","kind":"2","moment":null,"visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2015-01-30 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"PHP Example 2","pos":"3","kind":"2","moment":null,"visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2015-01-25 15:30:00","relativedeadline":null,"qrelease":"2015-01-08 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"PHP Example 3","pos":"4","kind":"2","moment":null,"visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2015-01-20 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"New Code","pos":"5","kind":"2","moment":null,"visible":"0","highscoremode":"0","gradesys":"0","code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":"undefined","qstart":null,"grptype":null,"tabs":"0","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Javascript examples","pos":"5","kind":"1","moment":null,"visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"JavaScript Example 1","pos":"6","kind":"2","moment":null,"visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2015-01-18 15:30:00","relativedeadline":null,"qrelease":"2015-01-08 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"JavaScript Example 2","pos":"7","kind":"2","moment":null,"visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2015-02-10 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"JavaScript Example 3","pos":"8","kind":"2","moment":null,"visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2015-02-15 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"HTML5 examples","pos":"9","kind":"1","moment":null,"visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"HTML5 Example 1","pos":"10","kind":"2","moment":null,"visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2015-02-05 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"HTML5 Example 2","pos":"11","kind":"2","moment":null,"visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2015-02-20 15:30:00","relativedeadline":null,"qrelease":"2015-02-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"HTML5 Example 3","pos":"12","kind":"2","moment":null,"visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2015-02-19 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"HTML5 Example 4","pos":"13","kind":"2","moment":null,"visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2015-02-19 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"HTML5 Example 5","pos":"14","kind":"2","moment":null,"visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2015-02-19 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"HTML5 Example 6","pos":"15","kind":"2","moment":null,"visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2015-02-19 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"HTML5 Example 7","pos":"16","kind":"2","moment":null,"visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2020-06-30 00:00:00","relativedeadline":null,"qrelease":"2020-05-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"HTML5 Example 8","pos":"17","kind":"2","moment":null,"visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2020-06-30 00:00:00","relativedeadline":null,"qrelease":"2020-05-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"Shader examples","pos":"18","kind":"1","moment":null,"visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"Shaderprogrammering","pos":"19","kind":"2","moment":null,"visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2020-06-30 00:00:00","relativedeadline":null,"qrelease":"2020-05-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"Shaderprogrammering","pos":"20","kind":"2","moment":null,"visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2020-06-30 00:00:00","relativedeadline":null,"qrelease":"2020-05-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null}],"groups":{"No":["1","2","3","4","5","6","7","8"],"Le":["A","B","C","D","E","F","G","H"],"Vi":["I","II","III","IV","V","VI","VII","VIII"]},"debug":"NONE!","writeaccess":true,"studentteacher":false,"readaccess":true,"coursename":"Webbprogrammering","coursevers":"45656","coursecode":"DV12G","courseid":"1","links":[{"fileid":-1,"filename":"---===######===---"},{"fileid":"45","filename":"diagram.json"},{"fileid":"47","filename":"helloWorld.html"},{"fileid":"4","filename":"HTML_Ex1.txt"},{"fileid":"6","filename":"HTML_Ex2.txt"},{"fileid":"8","filename":"HTML_Ex3.txt"},{"fileid":"10","filename":"HTML_Ex4.txt"},{"fileid":"12","filename":"HTML_Ex5.txt"},{"fileid":"14","filename":"HTML_Ex6.txt"},{"fileid":"16","filename":"HTML_Ex7.txt"},{"fileid":"20","filename":"HTML_Ex8.txt"},{"fileid":"23","filename":"JavaScript_Ex1.txt"},{"fileid":"26","filename":"JavaScript_Ex2.txt"},{"fileid":"29","filename":"JavaScript_Ex3.txt"},{"fileid":"50","filename":"mdTest.md"},{"fileid":"31","filename":"PHP_Ex1.txt"},{"fileid":"33","filename":"PHP_Ex2.txt"},{"fileid":"35","filename":"PHP_Ex3.txt"},{"fileid":"38","filename":"Shader_Ex1.txt"},{"fileid":"41","filename":"Shader_Ex2.txt"},{"fileid":-1,"filename":"---===######===---"},{"fileid":"1","filename":"HTML_Ex1.css"},{"fileid":"2","filename":"HTML_Ex1.html"},{"fileid":"3","filename":"HTML_Ex1.js"},{"fileid":"5","filename":"HTML_Ex2.html"},{"fileid":"7","filename":"HTML_Ex3.html"},{"fileid":"9","filename":"HTML_Ex4.html"},{"fileid":"11","filename":"HTML_Ex5.html"},{"fileid":"13","filename":"HTML_Ex6.html"},{"fileid":"15","filename":"HTML_Ex7.html"},{"fileid":"17","filename":"HTML_Ex8.css"},{"fileid":"18","filename":"HTML_Ex8.html"},{"fileid":"19","filename":"HTML_Ex8.js"},{"fileid":"21","filename":"JavaScript_Ex1.html"},{"fileid":"22","filename":"JavaScript_Ex1.js"},{"fileid":"24","filename":"JavaScript_Ex2.html"},{"fileid":"25","filename":"JavaScript_Ex2.js"},{"fileid":"27","filename":"JavaScript_Ex3.html"},{"fileid":"28","filename":"JavaScript_Ex3.js"},{"fileid":"30","filename":"PHP_Ex1.php"},{"fileid":"32","filename":"PHP_Ex2.php"},{"fileid":"34","filename":"PHP_Ex3.php"},{"fileid":"36","filename":"Shader_Ex1.html"},{"fileid":"37","filename":"Shader_Ex1.js"},{"fileid":"39","filename":"Shader_Ex2.html"},{"fileid":"40","filename":"Shader_Ex2.js"}],"duggor":[],"results":[],"versions":[{"cid":"1","coursecode":"DV12G","vers":"45656","versname":"HT15","coursename":"Webbprogrammering","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Webbprogrammering - HT15"},{"cid":"1","coursecode":"DV12G","vers":"45657","versname":"HT16","coursename":"Webbprogrammering","coursenamealt":"UNK","startdate":"2015-12-29 00:00:00","enddate":"2016-03-08 00:00:00","motd":"Webbprogrammering - HT16"},{"cid":"2","coursecode":"IT118G","vers":"97731","versname":"HT14","coursename":"Webbutveckling - datorgrafik","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Webbutveckling - datorgrafik - HT14"},{"cid":"2","coursecode":"IT118G","vers":"97732","versname":"HT15","coursename":"Webbutveckling - datorgrafik","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Webbutveckling - datorgrafik - HT15"},{"cid":"3","coursecode":"IT500G","vers":"1337","versname":"HT15","coursename":"Datorns grunder","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Datorns grunder - HT15"},{"cid":"4","coursecode":"IT301G","vers":"1338","versname":"HT15","coursename":"Software Engineering","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Software Engineering - HT15"},{"cid":"305","coursecode":"IT308G","vers":"12305","versname":"HT15","coursename":"Objektorienterad programmering","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"307","coursecode":"IT115G","vers":"12307","versname":"HT15","coursename":"Datorns grunder","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"308","coursecode":"MA161G","vers":"12308","versname":"HT15","coursename":"Diskret matematik","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"309","coursecode":"DA322G","vers":"12309","versname":"HT15","coursename":"Operativsystem","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"312","coursecode":"IT326G","vers":"12312","versname":"HT15","coursename":"Distribuerade system","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"319","coursecode":"DV736A","vers":"12319","versname":"HT15","coursename":"Examensarbete i datavetenskap","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"324","coursecode":"IT108G","vers":"12324","versname":"HT15","coursename":"Webbutveckling - webbplatsdesign","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"1885","coursecode":"G1337","vers":"1337","versname":"","coursename":"Testing-Course","coursenamealt":"Course for testing codeviewer","startdate":"2020-05-01 00:00:00","enddate":"2020-06-30 00:00:00","motd":"Code examples shows both templateid and boxid!"},{"cid":"1894","coursecode":"G420","vers":"52432","versname":"ST20","coursename":"Demo-Course","coursenamealt":"Chaos Theory - Conspiracy 64k Demo","startdate":"2020-05-01 00:00:00","enddate":"2020-06-30 00:00:00","motd":"Demo Course 2020 - All current duggas"}],"unmarked":"0","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","grpmembershp":"UNK","grplst":[],"userfeedback":[],"feedbackquestion":"UNK","avgfeedbackscore":0}',

        'query-after-test-1' =>  "DELETE FROM listentries WHERE lid > 5009;",
        'query-after-test-2' => "DELETE FROM codeexample WHERE exampleid > 9009;",
        'service' => 'sectionedservice.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'opt' => 'NEW',
            'username' => 'mestr',
            'password' => 'password',
            'courseid' => '1',
            'coursevers' => '45656',
            'sectname' => 'New Code',
            'sname' => 'examplename',
            'gradesys' => '0',
            'tabs' => '0',
            'userid' => '2',
            'link' => '-1',
            'kind' => '2',
            'comments' => 'undefined',
            'lid' => 'undefined',
            'moment' => 'null',
            'grptype' => 'UNK',
            'deadline' => '0:0',
            'relativedeadline' => '1:1:0:0',
            'visibility' => '0',
            'highscoremode' => '0',
            'pos' => '5',
            'log_uuid' => 'XvH6j8E6SLBWBLP',
            'hash' => 'UNK'
            
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'entries' => array(
                'entryname',
                //'lid',
                'pos',
                'kind',
                'moment',
                //'link',
                'visible',
                'highscoremode',
                'gradesys',
                'code_id',
                'deadline',
                'relativedeadline',
                'qrelease',
                'comments',
                'qstart',
                'grptype',
                'tabs',
                'feedbackenabled',
                'feedbackquestion',
                //'ts'
            ),
            'debug',
            'writeaccess',
            'studentteacher',
            'readaccess',
            'coursename',
            'coursevers',
            'coursecode',
            'courseid',
            'links',
            'duggor',
            'results',
            'versions',
            // 'codeexamples',
            'unmarked',
            'startdate',
            'enddate',
            'groups',
            'grpmembershp',
            'grplst',
            'userfeedback',
            'feedbackquestion',
            'avgfeedbackscore'
        )),
    ),
    //------------------------------------------------------------------------------------------
    // This test the microservice reorderListentries and the part of the monalith called "REORDER" 
    //------------------------------------------------------------------------------------------
    'reorderListentries' => array(
        'expected-output'   => '{"entries":[{"entryname":"PHP examples","lid":"1001","pos":"0","kind":"1","moment":"0","link":"UNK","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"PHP Example 2","lid":"1003","pos":"1","kind":"2","moment":"0","link":"2","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2015-01-25 15:30:00","relativedeadline":null,"qrelease":"2015-01-08 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"PHP Example 1","lid":"1002","pos":"2","kind":"2","moment":"0","link":"1","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2015-01-30 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"PHP Example 3","lid":"1004","pos":"3","kind":"2","moment":"0","link":"3","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2015-01-20 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"Javascript examples","lid":"1005","pos":"4","kind":"1","moment":"0","link":"UNK","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"JavaScript Example 1","lid":"1006","pos":"5","kind":"2","moment":"0","link":"4","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2015-01-18 15:30:00","relativedeadline":null,"qrelease":"2015-01-08 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"JavaScript Example 2","lid":"1007","pos":"6","kind":"2","moment":"0","link":"5","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2015-02-10 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"JavaScript Example 3","lid":"1008","pos":"7","kind":"2","moment":"0","link":"6","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2015-02-15 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"HTML5 examples","lid":"1009","pos":"8","kind":"1","moment":"0","link":"UNK","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"HTML5 Example 1","lid":"1010","pos":"9","kind":"2","moment":"0","link":"7","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2015-02-05 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"HTML5 Example 2","lid":"1011","pos":"10","kind":"2","moment":"0","link":"8","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2015-02-20 15:30:00","relativedeadline":null,"qrelease":"2015-02-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"HTML5 Example 3","lid":"1012","pos":"11","kind":"2","moment":"0","link":"9","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2015-02-19 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"HTML5 Example 4","lid":"1013","pos":"12","kind":"2","moment":"0","link":"10","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2015-02-19 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"HTML5 Example 5","lid":"1014","pos":"13","kind":"2","moment":"0","link":"11","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2015-02-19 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"HTML5 Example 6","lid":"1015","pos":"14","kind":"2","moment":"0","link":"12","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2015-02-19 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"HTML5 Example 7","lid":"1016","pos":"15","kind":"2","moment":"0","link":"13","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2020-06-30 00:00:00","relativedeadline":null,"qrelease":"2020-05-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"HTML5 Example 8","lid":"1017","pos":"16","kind":"2","moment":"0","link":"14","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2020-06-30 00:00:00","relativedeadline":null,"qrelease":"2020-05-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"Shader examples","lid":"1018","pos":"17","kind":"1","moment":"0","link":"UNK","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"Shaderprogrammering","lid":"1019","pos":"18","kind":"2","moment":"0","link":"15","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2020-06-30 00:00:00","relativedeadline":null,"qrelease":"2020-05-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"Shaderprogrammering","lid":"1020","pos":"19","kind":"2","moment":"0","link":"16","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2020-06-30 00:00:00","relativedeadline":null,"qrelease":"2020-05-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null}],"debug":"NONE!","writeaccess":true,"studentteacher":false,"readaccess":true,"coursename":"Webbprogrammering","coursevers":"45656","coursecode":"DV12G","courseid":"1","links":[{"fileid":-1,"filename":"---===######===---"},{"fileid":"45","filename":"diagram.json"},{"fileid":"47","filename":"helloWorld.html"},{"fileid":"4","filename":"HTML_Ex1.txt"},{"fileid":"6","filename":"HTML_Ex2.txt"},{"fileid":"8","filename":"HTML_Ex3.txt"},{"fileid":"10","filename":"HTML_Ex4.txt"},{"fileid":"12","filename":"HTML_Ex5.txt"},{"fileid":"14","filename":"HTML_Ex6.txt"},{"fileid":"16","filename":"HTML_Ex7.txt"},{"fileid":"20","filename":"HTML_Ex8.txt"},{"fileid":"23","filename":"JavaScript_Ex1.txt"},{"fileid":"26","filename":"JavaScript_Ex2.txt"},{"fileid":"29","filename":"JavaScript_Ex3.txt"},{"fileid":"50","filename":"mdTest.md"},{"fileid":"31","filename":"PHP_Ex1.txt"},{"fileid":"33","filename":"PHP_Ex2.txt"},{"fileid":"35","filename":"PHP_Ex3.txt"},{"fileid":"38","filename":"Shader_Ex1.txt"},{"fileid":"41","filename":"Shader_Ex2.txt"},{"fileid":-1,"filename":"---===######===---"},{"fileid":"1","filename":"HTML_Ex1.css"},{"fileid":"2","filename":"HTML_Ex1.html"},{"fileid":"3","filename":"HTML_Ex1.js"},{"fileid":"5","filename":"HTML_Ex2.html"},{"fileid":"7","filename":"HTML_Ex3.html"},{"fileid":"9","filename":"HTML_Ex4.html"},{"fileid":"11","filename":"HTML_Ex5.html"},{"fileid":"13","filename":"HTML_Ex6.html"},{"fileid":"15","filename":"HTML_Ex7.html"},{"fileid":"17","filename":"HTML_Ex8.css"},{"fileid":"18","filename":"HTML_Ex8.html"},{"fileid":"19","filename":"HTML_Ex8.js"},{"fileid":"21","filename":"JavaScript_Ex1.html"},{"fileid":"22","filename":"JavaScript_Ex1.js"},{"fileid":"24","filename":"JavaScript_Ex2.html"},{"fileid":"25","filename":"JavaScript_Ex2.js"},{"fileid":"27","filename":"JavaScript_Ex3.html"},{"fileid":"28","filename":"JavaScript_Ex3.js"},{"fileid":"30","filename":"PHP_Ex1.php"},{"fileid":"32","filename":"PHP_Ex2.php"},{"fileid":"34","filename":"PHP_Ex3.php"},{"fileid":"36","filename":"Shader_Ex1.html"},{"fileid":"37","filename":"Shader_Ex1.js"},{"fileid":"39","filename":"Shader_Ex2.html"},{"fileid":"40","filename":"Shader_Ex2.js"}],"duggor":[],"results":[],"versions":[{"cid":"1","coursecode":"DV12G","vers":"45656","versname":"HT15","coursename":"Webbprogrammering","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Webbprogrammering - HT15"},{"cid":"1","coursecode":"DV12G","vers":"45657","versname":"HT16","coursename":"Webbprogrammering","coursenamealt":"UNK","startdate":"2015-12-29 00:00:00","enddate":"2016-03-08 00:00:00","motd":"Webbprogrammering - HT16"},{"cid":"2","coursecode":"IT118G","vers":"97731","versname":"HT14","coursename":"Webbutveckling - datorgrafik","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Webbutveckling - datorgrafik - HT14"},{"cid":"2","coursecode":"IT118G","vers":"97732","versname":"HT15","coursename":"Webbutveckling - datorgrafik","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Webbutveckling - datorgrafik - HT15"},{"cid":"3","coursecode":"IT500G","vers":"1337","versname":"HT15","coursename":"Datorns grunder","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Datorns grunder - HT15"},{"cid":"4","coursecode":"IT301G","vers":"1338","versname":"HT15","coursename":"Software Engineering","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Software Engineering - HT15"},{"cid":"305","coursecode":"IT308G","vers":"12305","versname":"HT15","coursename":"Objektorienterad programmering","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"307","coursecode":"IT115G","vers":"12307","versname":"HT15","coursename":"Datorns grunder","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"308","coursecode":"MA161G","vers":"12308","versname":"HT15","coursename":"Diskret matematik","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"309","coursecode":"DA322G","vers":"12309","versname":"HT15","coursename":"Operativsystem","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"312","coursecode":"IT326G","vers":"12312","versname":"HT15","coursename":"Distribuerade system","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"319","coursecode":"DV736A","vers":"12319","versname":"HT15","coursename":"Examensarbete i datavetenskap","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"324","coursecode":"IT108G","vers":"12324","versname":"HT15","coursename":"Webbutveckling - webbplatsdesign","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"1885","coursecode":"G1337","vers":"1337","versname":"","coursename":"Testing-Course","coursenamealt":"Course for testing codeviewer","startdate":"2020-05-01 00:00:00","enddate":"2020-06-30 00:00:00","motd":"Code examples shows both templateid and boxid!"},{"cid":"1894","coursecode":"G420","vers":"52432","versname":"ST20","coursename":"Demo-Course","coursenamealt":"Chaos Theory - Conspiracy 64k Demo","startdate":"2020-05-01 00:00:00","enddate":"2020-06-30 00:00:00","motd":"Demo Course 2020 - All current duggas"}],"unmarked":"0","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","groups":{"No":["1","2","3","4","5","6","7","8"],"Le":["A","B","C","D","E","F","G","H"],"Vi":["I","II","III","IV","V","VI","VII","VIII"]},"grpmembershp":"UNK","grplst":[],"userfeedback":[],"feedbackquestion":"UNK","avgfeedbackscore":0}',

        'query-after-test-1' => "UPDATE listentries SET pos=1 WHERE lid=1002;",
        'query-after-test-2' => "UPDATE listentries SET pos=2 WHERE lid=1003;",
        'service' => 'sectionedservice.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'opt' => 'REORDER',
            'username' => 'mestr',
            'password' => 'password',
            'courseid' => '1',
            'coursename' => '1',
            'coursevers' => '45656',
            'comment' => 'undefined',
            'order' => '0XX1001XX0,1XX1003XX0,2XX1002XX0,3XX1004XX0,4XX1005XX0,5XX1006XX0,6XX1007XX0,7XX1008XX0,8XX1009XX0,9XX1010XX0,10XX1011XX0,11XX1012XX0,12XX1013XX0,13XX1014XX0,14XX1015XX0,15XX1016XX0,16XX1017XX0,17XX1018XX0,18XX1019XX0,19XX1020XX0',
            'hash' => 'UNK'
            
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'entries' => array(
                'entryname',
                'lid',
                'pos',
                'kind',
                'moment',
                'link',
                'visible',
                'highscoremode',
                'gradesys',
                'code_id',
                'deadline',
                'relativedeadline',
                'qrelease',
                'comments',
                'qstart',
                'grptype',
                'tabs',
                'feedbackenabled',
                'feedbackquestion',
                //'ts'
            ),
            'groups',
            'debug',
            'writeaccess',
            'studentteacher',
            'readaccess',
            'coursename',
            'coursevers',
            'coursecode',
            'courseid',
            'links',
            'duggor',
            'results',
            'versions',
            //'codeexamples', 
            'unmarked',
            'startdate',
            'enddate',
            'grpmembershp',
            'grplst',
            'userfeedback',
            'feedbackquestion',
            'avgfeedbackscore'
        )),
    ),
    //---------------------------------------------------------------------------------------
    // This test the microservice updateListentrie and the part of the monalith called "UPDATE" 
    //---------------------------------------------------------------------------------------
    'updateListentrie' => array(
        'expected-output'   => '{"entries":[{"entryname":"JavaScript-Code:","lid":"1","pos":"1","kind":"1","moment":null,"link":"1","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2015-01-30 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"JS-TEST template 1","lid":"4000","pos":"1","kind":"2","moment":null,"link":"7000","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"JS-TEST template 2","lid":"4001","pos":"1","kind":"2","moment":null,"link":"7001","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"JS-TEST template 3","lid":"4002","pos":"1","kind":"2","moment":null,"link":"7002","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"JS-TEST template 4","lid":"4003","pos":"1","kind":"2","moment":null,"link":"7003","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"JS-TEST template 5","lid":"4004","pos":"1","kind":"2","moment":null,"link":"7004","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"JS-TEST template 6","lid":"4005","pos":"1","kind":"2","moment":null,"link":"7005","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"JS-TEST template 7","lid":"4006","pos":"1","kind":"2","moment":null,"link":"7006","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"JS-TEST template 8","lid":"4007","pos":"1","kind":"2","moment":null,"link":"7007","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"JS-TEST template 9","lid":"4008","pos":"1","kind":"2","moment":null,"link":"7008","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"JS-TEST template 10","lid":"4009","pos":"1","kind":"2","moment":null,"link":"7009","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"Html-test template 1","lid":"5000","pos":"2","kind":"2","moment":null,"link":"6000","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"Html-test template 2","lid":"5001","pos":"2","kind":"2","moment":null,"link":"6001","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"Html-test template 3","lid":"5002","pos":"2","kind":"2","moment":null,"link":"6002","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"Html-test template 4","lid":"5003","pos":"2","kind":"2","moment":null,"link":"6003","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"Html-test template 5","lid":"5004","pos":"2","kind":"2","moment":null,"link":"6004","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"Html-test template 6","lid":"5005","pos":"2","kind":"2","moment":null,"link":"6005","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"Html-test template 7","lid":"5006","pos":"2","kind":"2","moment":null,"link":"6006","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"Html-test template 8","lid":"5007","pos":"2","kind":"2","moment":null,"link":"6007","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"Html-test template 9","lid":"5008","pos":"2","kind":"2","moment":null,"link":"6008","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"Html-test template 10","lid":"5009","pos":"2","kind":"2","moment":null,"link":"6009","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"HTML-Code:","lid":"2","pos":"2","kind":"1","moment":null,"link":"1","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2015-01-30 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"SQL-TEST template 9","lid":"3118","pos":"3","kind":"2","moment":null,"link":"8008","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"SQL-CODE:","lid":"4","pos":"3","kind":"1","moment":null,"link":"1","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2015-01-30 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"SQL-TEST template 1","lid":"3110","pos":"3","kind":"2","moment":null,"link":"8000","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"SQL-TEST template 2","lid":"3111","pos":"3","kind":"2","moment":null,"link":"8001","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"SQL-TEST template 3","lid":"3112","pos":"3","kind":"2","moment":null,"link":"8002","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"SQL-TEST template 4","lid":"3113","pos":"3","kind":"2","moment":null,"link":"8003","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"SQL-TEST template 6","lid":"3115","pos":"3","kind":"2","moment":null,"link":"8005","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"SQL-TEST template 8","lid":"3117","pos":"3","kind":"2","moment":null,"link":"8007","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"SQL-TEST template 10","lid":"3119","pos":"3","kind":"2","moment":null,"link":"8009","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"SQL-TEST template 7","lid":"3116","pos":"3","kind":"2","moment":null,"link":"8006","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"SQL-TEST template 5","lid":"3114","pos":"3","kind":"2","moment":null,"link":"8004","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"PHP-TEST template 10","lid":"2119","pos":"4","kind":"2","moment":null,"link":"9009","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"PHP-TEST template 9","lid":"2118","pos":"4","kind":"2","moment":null,"link":"9008","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"PHP-TEST template 8","lid":"2117","pos":"4","kind":"2","moment":null,"link":"9007","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"PHP-TEST template 7","lid":"2116","pos":"4","kind":"2","moment":null,"link":"9006","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"PHP-TEST template 6","lid":"2115","pos":"4","kind":"2","moment":null,"link":"9005","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"PHP-TEST template 5","lid":"2114","pos":"4","kind":"2","moment":null,"link":"9004","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"PHP-TEST template 4","lid":"2113","pos":"4","kind":"2","moment":null,"link":"9003","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"PHP-TEST template 3","lid":"2112","pos":"4","kind":"2","moment":null,"link":"9002","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"PHP-TEST template 2","lid":"2111","pos":"4","kind":"2","moment":null,"link":"9001","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"PHP-TEST template 1","lid":"2110","pos":"4","kind":"2","moment":null,"link":"9000","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"PHP-CODE:","lid":"5","pos":"4","kind":"1","moment":null,"link":"1","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2015-01-30 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null},{"entryname":"Other:","lid":"6","pos":"5","kind":"1","moment":null,"link":"1","visible":"1","highscoremode":"0","gradesys":null,"code_id":null,"deadline":"2015-01-30 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":"0","feedbackquestion":null}],"groups":{"No":["1","2","3","4","5","6","7","8"],"Le":["A","B","C","D","E","F","G","H"],"Vi":["I","II","III","IV","V","VI","VII","VIII"]},"debug":"NONE!","writeaccess":false,"studentteacher":false,"readaccess":true,"coursename":"Testing-Course","coursevers":"1337","coursecode":"G1337","courseid":"1885","links":[],"duggor":[],"results":[],"versions":[{"cid":"1","coursecode":"DV12G","vers":"45656","versname":"HT15","coursename":"Webbprogrammering","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Webbprogrammering - HT15"},{"cid":"1","coursecode":"DV12G","vers":"45657","versname":"HT16","coursename":"Webbprogrammering","coursenamealt":"UNK","startdate":"2015-12-29 00:00:00","enddate":"2016-03-08 00:00:00","motd":"Webbprogrammering - HT16"},{"cid":"2","coursecode":"IT118G","vers":"97731","versname":"HT14","coursename":"Webbutveckling - datorgrafik","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Webbutveckling - datorgrafik - HT14"},{"cid":"2","coursecode":"IT118G","vers":"97732","versname":"HT15","coursename":"Webbutveckling - datorgrafik","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Webbutveckling - datorgrafik - HT15"},{"cid":"3","coursecode":"IT500G","vers":"1337","versname":"HT15","coursename":"Datorns grunder","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Datorns grunder - HT15"},{"cid":"4","coursecode":"IT301G","vers":"1338","versname":"HT15","coursename":"Software Engineering","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Software Engineering - HT15"},{"cid":"305","coursecode":"IT308G","vers":"12305","versname":"HT15","coursename":"Objektorienterad programmering","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"307","coursecode":"IT115G","vers":"12307","versname":"HT15","coursename":"Datorns grunder","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"308","coursecode":"MA161G","vers":"12308","versname":"HT15","coursename":"Diskret matematik","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"309","coursecode":"DA322G","vers":"12309","versname":"HT15","coursename":"Operativsystem","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"312","coursecode":"IT326G","vers":"12312","versname":"HT15","coursename":"Distribuerade system","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"319","coursecode":"DV736A","vers":"12319","versname":"HT15","coursename":"Examensarbete i datavetenskap","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"324","coursecode":"IT108G","vers":"12324","versname":"HT15","coursename":"Webbutveckling - webbplatsdesign","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"1885","coursecode":"G1337","vers":"1337","versname":"","coursename":"Testing-Course","coursenamealt":"Course for testing codeviewer","startdate":"2020-05-01 00:00:00","enddate":"2020-06-30 00:00:00","motd":"Code examples shows both templateid and boxid!"},{"cid":"1894","coursecode":"G420","vers":"52432","versname":"ST20","coursename":"Demo-Course","coursenamealt":"Chaos Theory - Conspiracy 64k Demo","startdate":"2020-05-01 00:00:00","enddate":"2020-06-30 00:00:00","motd":"Demo Course 2020 - All current duggas"}],"unmarked":0,"startdate":"2020-05-01 00:00:00","enddate":"2020-06-30 00:00:00","grpmembershp":"UNK","grplst":[],"userfeedback":[],"feedbackquestion":"UNK","avgfeedbackscore":0}',

        'query-after-test-1' => "UPDATE listentries SET highscoremode = 0, gradesystem = null, moment= null, entryname = 'JavaScript-Code:', kind = 1, link = 1, visible = 1, comments = null, groupKind = null, feedbackenabled = 0, feedbackquestion = null WHERE lid = 1;",
    
        'service' => 'sectionedservice.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'opt' => 'UPDATE',
            'username' => 'mestr',
            'password' => 'password',
            'courseid' => '1885',
            'coursename' => '1885',
            'coursevers' => '1337',
            'comment' => 'undefined',
            'tabs' => '0',
            'lid' => '1', 
            'kind' => '2',
            'link' => '6002',
            'highscoremode' => '1',
            'sectname' => 'testname',
            'visibility' => '2',
            'moment' => 'null',
            'comments' => 'null',
            'grptype' => 'Le',
            'deadline' => '2020-05-02 00:00',
            'relativedeadline' => '1:1:0:0',
            'pos' => '5',
            'hash' => 'UNK'
            
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'entries' => array(
                'entryname',
                'lid',
                'pos',
                'kind',
                'moment',
                'link',
                'visible',
                'highscoremode',
                'gradesys',
                'code_id',
                'deadline',
                'relativedeadline',
                'qrelease',
                'comments',
                'qstart',
                'grptype',
                'tabs',
                'feedbackenabled',
                'feedbackquestion',
                //'ts'
            ),
            'debug',
            'writeaccess',
            'studentteacher',
            'readaccess',
            'coursename',
            'coursevers',
            'coursecode',
            'courseid',
            'links',
            'duggor',
            'results',
            'versions',
            'unmarked',
            'startdate',
            'enddate',
            'groups',
            'grpmembershp',
            'grplst',
            'userfeedback',
            'feedbackquestion',
            'avgfeedbackscore'
        )),
    ),          
    //------------------------------------------------------------------------------------------ 
    // This test the microservice updateQuizDeadline and the part of the monalith called "UPDATEDEADLINE" 
    //------------------------------------------------------------------------------------------

    'updateQuizDeadline' => array(
        'expected-output'   => ' {"entries":[{"entryname":"Bitr\u00e4kningsduggor 1HP","lid":"2001","pos":"0","kind":"4","moment":"2001","link":"","visible":"1","highscoremode":"0","gradesys":"2","code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":"2","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Bitr\u00e4kningsdugga 1","lid":"2002","pos":"1","kind":"3","moment":"2001","link":"1","visible":"1","highscoremode":"1","gradesys":"0","code_id":null,"deadline":"2015-01-30 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":"0","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Bitr\u00e4kningsdugga 2","lid":"2003","pos":"2","kind":"3","moment":"2001","link":"2","visible":"1","highscoremode":"1","gradesys":"0","code_id":null,"deadline":"2015-01-31 16:30:00","relativedeadline":"2:1:0:0","qrelease":"2015-01-08 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":"0","feedbackenabled":"0","feedbackquestion":null},{"entryname":"F\u00e4rgduggor 1HP","lid":"2004","pos":"3","kind":"4","moment":"2004","link":"","visible":"1","highscoremode":"0","gradesys":"2","code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":"2","feedbackenabled":"0","feedbackquestion":null},{"entryname":"F\u00e4rgdugga 1","lid":"2005","pos":"4","kind":"3","moment":"2004","link":"3","visible":"1","highscoremode":"1","gradesys":"0","code_id":null,"deadline":"2015-01-20 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":"0","feedbackenabled":"0","feedbackquestion":null},{"entryname":"F\u00e4rgdugga 2","lid":"2006","pos":"5","kind":"3","moment":"2004","link":"4","visible":"1","highscoremode":"1","gradesys":"0","code_id":null,"deadline":"2015-01-18 15:30:00","relativedeadline":null,"qrelease":"2015-01-08 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":"0","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Geometri 2HP","lid":"2007","pos":"6","kind":"4","moment":"2007","link":"","visible":"1","highscoremode":"0","gradesys":"2","code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":"2","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Linjedugga 1","lid":"2008","pos":"7","kind":"3","moment":"2007","link":"5","visible":"1","highscoremode":"2","gradesys":"0","code_id":null,"deadline":"2015-02-10 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":"0","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Linjedugga 2","lid":"2009","pos":"8","kind":"3","moment":"2007","link":"6","visible":"1","highscoremode":"2","gradesys":"0","code_id":null,"deadline":"2015-02-15 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":"0","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Transformationer 3,5HP","lid":"2010","pos":"9","kind":"4","moment":"2010","link":"","visible":"1","highscoremode":"0","gradesys":"2","code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":"2","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Transformationsdugga 1","lid":"2011","pos":"10","kind":"3","moment":"2010","link":"7","visible":"1","highscoremode":"2","gradesys":"0","code_id":null,"deadline":"2015-02-05 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":"0","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Transformationsdugga 2","lid":"2012","pos":"11","kind":"3","moment":"2010","link":"8","visible":"1","highscoremode":"2","gradesys":"0","code_id":null,"deadline":"2015-02-20 15:30:00","relativedeadline":null,"qrelease":"2015-02-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":"0","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Fr\u00e5geduggor 1HP","lid":"2013","pos":"12","kind":"4","moment":"2013","link":"","visible":"1","highscoremode":"0","gradesys":"2","code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":"2","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Fr\u00e5gedugga 1","lid":"2014","pos":"13","kind":"3","moment":"2013","link":"9","visible":"1","highscoremode":"1","gradesys":"0","code_id":null,"deadline":"2015-02-19 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":"0","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Rapport 1HP","lid":"2015","pos":"14","kind":"4","moment":"2015","link":"","visible":"1","highscoremode":"1","gradesys":"2","code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":"2","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Rapport inl\u00e4mning","lid":"2016","pos":"15","kind":"3","moment":"2015","link":"10","visible":"1","highscoremode":"1","gradesys":"0","code_id":null,"deadline":"2015-02-19 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":"0","feedbackenabled":"0","feedbackquestion":null},{"entryname":"HTML and CSS 1HP","lid":"2033","pos":"16","kind":"4","moment":"2033","link":"","visible":"1","highscoremode":"1","gradesys":"2","code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":"2","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Random css dugga","lid":"2034","pos":"17","kind":"3","moment":"2033","link":"11","visible":"1","highscoremode":"1","gradesys":"0","code_id":null,"deadline":"2015-02-19 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":"0","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Clipping","lid":"2035","pos":"18","kind":"4","moment":"2035","link":"","visible":"1","highscoremode":"1","gradesys":"2","code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":"2","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Random clipping dugga","lid":"2036","pos":"19","kind":"3","moment":"2035","link":"12","visible":"1","highscoremode":"1","gradesys":"0","code_id":null,"deadline":"2015-02-19 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":"0","feedbackenabled":"0","feedbackquestion":null}],"duggor":[{"id":"1","qname":"Bitdugga1","release":"2015-01-01 00:00:00","deadline":"2015-01-30 15:30:00","relativedeadline":null},{"id":"2","qname":"Bitdugga2","release":"2015-01-08 00:00:00","deadline":"2015-01-31 16:30:00","relativedeadline":"2:1:0:0"},{"id":"12","qname":"Clipping masking testdugga","release":"2015-01-01 00:00:00","deadline":"2015-02-19 15:30:00","relativedeadline":null},{"id":"3","qname":"colordugga1","release":"2015-01-01 00:00:00","deadline":"2015-01-20 15:30:00","relativedeadline":null},{"id":"4","qname":"colordugga2","release":"2015-01-08 00:00:00","deadline":"2015-01-18 15:30:00","relativedeadline":null},{"id":"7","qname":"dugga1","release":"2015-01-01 00:00:00","deadline":"2015-02-05 15:30:00","relativedeadline":null},{"id":"8","qname":"dugga2","release":"2015-02-01 00:00:00","deadline":"2015-02-20 15:30:00","relativedeadline":null},{"id":"11","qname":"HTML CSS Testdugga","release":"2015-01-01 00:00:00","deadline":"2015-02-19 15:30:00","relativedeadline":null},{"id":"5","qname":"linjedugga1","release":"2015-01-01 00:00:00","deadline":"2015-02-10 15:30:00","relativedeadline":null},{"id":"6","qname":"linjedugga2","release":"2015-01-01 00:00:00","deadline":"2015-02-15 15:30:00","relativedeadline":null},{"id":"9","qname":"Quiz","release":"2015-01-01 00:00:00","deadline":"2015-02-19 15:30:00","relativedeadline":null},{"id":"10","qname":"Rapport","release":"2015-01-01 00:00:00","deadline":"2015-02-19 15:30:00","relativedeadline":null}],"groups":{"No":["1","2","3","4","5","6","7","8"],"Le":["A","B","C","D","E","F","G","H"],"Vi":["I","II","III","IV","V","VI","VII","VIII"]},"debug":"NONE!","writeaccess":true,"studentteacher":false,"readaccess":true,"coursename":"Webbutveckling - datorgrafik","coursevers":"97732","coursecode":"IT118G","courseid":"2","links":[{"fileid":-1,"filename":"---===######===---"},{"fileid":"45","filename":"diagram.json"},{"fileid":"47","filename":"helloWorld.html"},{"fileid":"4","filename":"HTML_Ex1.txt"},{"fileid":"6","filename":"HTML_Ex2.txt"},{"fileid":"8","filename":"HTML_Ex3.txt"},{"fileid":"10","filename":"HTML_Ex4.txt"},{"fileid":"12","filename":"HTML_Ex5.txt"},{"fileid":"14","filename":"HTML_Ex6.txt"},{"fileid":"16","filename":"HTML_Ex7.txt"},{"fileid":"20","filename":"HTML_Ex8.txt"},{"fileid":"23","filename":"JavaScript_Ex1.txt"},{"fileid":"26","filename":"JavaScript_Ex2.txt"},{"fileid":"29","filename":"JavaScript_Ex3.txt"},{"fileid":"50","filename":"mdTest.md"},{"fileid":"31","filename":"PHP_Ex1.txt"},{"fileid":"33","filename":"PHP_Ex2.txt"},{"fileid":"35","filename":"PHP_Ex3.txt"},{"fileid":"38","filename":"Shader_Ex1.txt"},{"fileid":"41","filename":"Shader_Ex2.txt"},{"fileid":-1,"filename":"---===######===---"},{"fileid":"44","filename":"cssdugga-site-1.png"},{"fileid":"48","filename":"HelloPhp.php"},{"fileid":"46","filename":"helloWorld.html"},{"fileid":"42","filename":"minimikrav_m2.md"},{"fileid":"43","filename":"test.png"},{"fileid":-1,"filename":"---===######===---"},{"fileid":"49","filename":"testJS.js"}],"results":[],"versions":[{"cid":"1","coursecode":"DV12G","vers":"45656","versname":"HT15","coursename":"Webbprogrammering","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Webbprogrammering - HT15"},{"cid":"1","coursecode":"DV12G","vers":"45657","versname":"HT16","coursename":"Webbprogrammering","coursenamealt":"UNK","startdate":"2015-12-29 00:00:00","enddate":"2016-03-08 00:00:00","motd":"Webbprogrammering - HT16"},{"cid":"2","coursecode":"IT118G","vers":"97731","versname":"HT14","coursename":"Webbutveckling - datorgrafik","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Webbutveckling - datorgrafik - HT14"},{"cid":"2","coursecode":"IT118G","vers":"97732","versname":"HT15","coursename":"Webbutveckling - datorgrafik","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Webbutveckling - datorgrafik - HT15"},{"cid":"3","coursecode":"IT500G","vers":"1337","versname":"HT15","coursename":"Datorns grunder","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Datorns grunder - HT15"},{"cid":"4","coursecode":"IT301G","vers":"1338","versname":"HT15","coursename":"Software Engineering","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Software Engineering - HT15"},{"cid":"305","coursecode":"IT308G","vers":"12305","versname":"HT15","coursename":"Objektorienterad programmering","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"307","coursecode":"IT115G","vers":"12307","versname":"HT15","coursename":"Datorns grunder","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"308","coursecode":"MA161G","vers":"12308","versname":"HT15","coursename":"Diskret matematik","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"309","coursecode":"DA322G","vers":"12309","versname":"HT15","coursename":"Operativsystem","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"312","coursecode":"IT326G","vers":"12312","versname":"HT15","coursename":"Distribuerade system","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"319","coursecode":"DV736A","vers":"12319","versname":"HT15","coursename":"Examensarbete i datavetenskap","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"324","coursecode":"IT108G","vers":"12324","versname":"HT15","coursename":"Webbutveckling - webbplatsdesign","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"1885","coursecode":"G1337","vers":"1337","versname":"","coursename":"Testing-Course","coursenamealt":"Course for testing codeviewer","startdate":"2020-05-01 00:00:00","enddate":"2020-06-30 00:00:00","motd":"Code examples shows both templateid and boxid!"},{"cid":"1894","coursecode":"G420","vers":"52432","versname":"ST20","coursename":"Demo-Course","coursenamealt":"Chaos Theory - Conspiracy 64k Demo","startdate":"2020-05-01 00:00:00","enddate":"2020-06-30 00:00:00","motd":"Demo Course 2020 - All current duggas"}],"codeexamples":[{"exampleid":"-1","cid":"","examplename":"","sectionname":"New Example","runlink":"","cversion":""}],"unmarked":"33","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","grpmembershp":"UNK","grplst":[],"userfeedback":[],"feedbackquestion":"UNK","avgfeedbackscore":0}',

        'query-after-test-1' => "UPDATE quiz SET deadline='2015-01-25 15:30:00', relativedeadline=null WHERE id=2;",
    
        'service' => 'sectionedservice.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'opt' => 'UPDATEDEADLINE',
            'username' => 'mestr',
            'password' => 'password',
            'courseid' => '2',
            'coursename' => '2',
            'coursevers' => '97732',
            'comment' => 'undefined',
            'gradesys' => '0',
            'lid' => '2002', 
            'kind' => '3',
            'link' => '2',
            'highscoremode' => '1',
            'sectname' => 'Bitr&auml;kningsdugga 1',
            'visibility' => '1',
            'tabs' => '0',
            'moment' => '2001',
            'comments' => 'null',
            'grptype' => 'UNK',
            'deadline' => '2015-01-31 16:30',
            'relativedeadline' => '2:1:0:0',
            'pos' => '5',
            'hash' => 'UNK'
            
            
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'entries' => array(
                'entryname',
                'lid',
                'pos',
                'kind',
                'moment',
                'link',
                'visible',
                'highscoremode',
                'gradesys',
                'code_id',
                'deadline',
                'relativedeadline',
                'qrelease',
                'comments',
                'qstart',
                'grptype',
                'tabs',
                'feedbackenabled',
                'feedbackquestion',
                //'ts'
            ),
            'debug',
            'writeaccess',
            'studentteacher',
            'readaccess',
            'coursename',
            'coursevers',
            'coursecode',
            'courseid',
            'links',
            'duggor',
            'results',
            'versions',
            'codeexamples',
            'unmarked',
            'startdate',
            'enddate',
            'groups',
            'grpmembershp',
            'grplst',
            'userfeedback',
            'feedbackquestion',
            'avgfeedbackscore'
        )),
    ),
    

          //*******************************************************************************************/
          //       THIS SERVICE DOES NOT FUNCTION AS INTENDED, the test therefore is incompleat.      //
          //*******************************************************************************************/

    //  //-----------------------------------------------------------------------------------------------------------  
    //  // This test the microservice updateCourseVersion_sectioned and the part of the monalith called "UPDATEVRS" 
    //  //-----------------------------------------------------------------------------------------------------------
    //  'updateCourseVersion_sectioned' => array(
    //     'expected-output'   => '',

    //     'query-after-test-1' => "UPDATE listentries SET tabs=null, gradesystem=0 WHERE lid=2008;",
    
    //     'service' => 'https://cms.webug.se/root/G2/students/a21jeaha/LenaSYS/DuggaSys/sectionedservice.php',
    //     'service-data' => serialize(array( // Data that service needs to execute function
    //         'opt' => 'UPDATEVRS',
    //         'username' => 'mestr',
    //         'password' => 'password',
    //         'courseid' => '2',
    //         'coursename' => '2',
    //         'coursevers' => '97731',
    //         'motd' => 'TEST TEXT'
    //         'comment' => 'undefined',
    //         'lid' => '2008', 
    //         'tabs' => '1',
    //         'hash' => 'UNK'
             
    //     )),
    //     'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
    //         'entries' => array(
    //             'entryname',
    //             'lid',
    //             'pos',
    //             'kind',
    //             'moment',
    //             'link',
    //             'visible',
    //             'highscoremode',
    //             'gradesys',
    //             'code_id',
    //             'deadline',
    //             'relativedeadline',
    //             'qrelease',
    //             'comments',
    //             'qstart',
    //             'grptype',
    //             'tabs',
    //             'feedbackenabled',
    //             'feedbackquestion',
    //             //'ts'
    //         ),
    //         'debug',
    //         'writeaccess',
    //         'studentteacher',
    //         'readaccess',
    //         'coursename',
    //         'coursevers',
    //         'coursecode',
    //         'courseid',
    //         'links',
    //         'duggor',
    //         'results',
    //         'versions',
    //         'codeexamples',
    //         'unmarked',
    //         'startdate',
    //         'enddate',
    //         'groups',
    //         'grpmembershp',
    //         'grplst',
    //         'userfeedback',
    //         'feedbackquestion',
    //         'avgfeedbackscore'
    //     )),
    // ),  



        //**********************************************************************************************/
        //           THIS SERVICE DOES NOT FUNCTION AS INTENDED, the test therefore is incompleat.     //
        //**********************************************************************************************/

    // //-------------------------------------------------------------------------------
    // // This test the microservice changeActiveCourseVersion_sectioned and the part of the monalith called "CHGVERS" 
    // //-------------------------------------------------------------------------------
    // 'changeActiveCourseVersion_sectioned' => array(
    //     'expected-output'   => '',

    //     'query-after-test-1' => "UPDATE listentries SET tabs=null, gradesystem=0 WHERE lid=2008;",
    
    //     'service' => 'https://cms.webug.se/root/G2/students/a21jeaha/LenaSYS/DuggaSys/sectionedservice.php',
    //     'service-data' => serialize(array( // Data that service needs to execute function
    //         'opt' => 'UPDATETABS',
    //         'username' => 'mestr',
    //         'password' => 'password',
    //         'courseid' => '2',
    //         'coursename' => '2',
    //         'coursevers' => '97732',
    //         'comment' => 'undefined',
    //         'lid' => '2008', 
    //         'tabs' => '1',
    //         'hash' => 'UNK'
             
    //     )),
    //     'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
    //         'entries' => array(
    //             'entryname',
    //             'lid',
    //             'pos',
    //             'kind',
    //             'moment',
    //             'link',
    //             'visible',
    //             'highscoremode',
    //             'gradesys',
    //             'code_id',
    //             'deadline',
    //             'relativedeadline',
    //             'qrelease',
    //             'comments',
    //             'qstart',
    //             'grptype',
    //             'tabs',
    //             'feedbackenabled',
    //             'feedbackquestion',
    //             //'ts'
    //         ),
    //         'debug',
    //         'writeaccess',
    //         'studentteacher',
    //         'readaccess',
    //         'coursename',
    //         'coursevers',
    //         'coursecode',
    //         'courseid',
    //         'links',
    //         'duggor',
    //         'results',
    //         'versions',
    //         'codeexamples',
    //         'unmarked',
    //         'startdate',
    //         'enddate',
    //         'groups',
    //         'grpmembershp',
    //         'grplst',
    //         'userfeedback',
    //         'feedbackquestion',
    //         'avgfeedbackscore'
    //     )),
    // ),
    
    //--------------------------------------------------------------------------------------------------
    // This test the microservice setVisibleListentrie and the part of the monalith called "HIDDEN" 
    //--------------------------------------------------------------------------------------------------
    'setVisibleListentrieHIDDEN' => array(
        'expected-output'   => '{"entries":[{"entryname":"Bitr\u00e4kningsduggor 1HP","lid":"2001","pos":"0","kind":"4","moment":"2001","link":"","visible":"1","highscoremode":"0","gradesys":"2","code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":"2","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Bitr\u00e4kningsdugga 1","lid":"2002","pos":"1","kind":"3","moment":"2001","link":"1","visible":"1","highscoremode":"1","gradesys":"0","code_id":null,"deadline":"2015-01-30 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":"0","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Bitr\u00e4kningsdugga 2","lid":"2003","pos":"2","kind":"3","moment":"2001","link":"2","visible":"1","highscoremode":"1","gradesys":"0","code_id":null,"deadline":"2015-01-25 15:30:00","relativedeadline":null,"qrelease":"2015-01-08 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":"0","feedbackenabled":"0","feedbackquestion":null},{"entryname":"F\u00e4rgduggor 1HP","lid":"2004","pos":"3","kind":"4","moment":"2004","link":"","visible":"1","highscoremode":"0","gradesys":"2","code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":"2","feedbackenabled":"0","feedbackquestion":null},{"entryname":"F\u00e4rgdugga 1","lid":"2005","pos":"4","kind":"3","moment":"2004","link":"3","visible":"1","highscoremode":"1","gradesys":"0","code_id":null,"deadline":"2015-01-20 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":"0","feedbackenabled":"0","feedbackquestion":null},{"entryname":"F\u00e4rgdugga 2","lid":"2006","pos":"5","kind":"3","moment":"2004","link":"4","visible":"1","highscoremode":"1","gradesys":"0","code_id":null,"deadline":"2015-01-18 15:30:00","relativedeadline":null,"qrelease":"2015-01-08 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":"0","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Geometri 2HP","lid":"2007","pos":"6","kind":"4","moment":"2007","link":"","visible":"1","highscoremode":"0","gradesys":"2","code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":"2","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Linjedugga 1","lid":"2008","pos":"7","kind":"3","moment":"2007","link":"5","visible":"0","highscoremode":"2","gradesys":"0","code_id":null,"deadline":"2015-02-10 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":"0","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Linjedugga 2","lid":"2009","pos":"8","kind":"3","moment":"2007","link":"6","visible":"1","highscoremode":"2","gradesys":"0","code_id":null,"deadline":"2015-02-15 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":"0","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Transformationer 3,5HP","lid":"2010","pos":"9","kind":"4","moment":"2010","link":"","visible":"1","highscoremode":"0","gradesys":"2","code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":"2","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Transformationsdugga 1","lid":"2011","pos":"10","kind":"3","moment":"2010","link":"7","visible":"1","highscoremode":"2","gradesys":"0","code_id":null,"deadline":"2015-02-05 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":"0","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Transformationsdugga 2","lid":"2012","pos":"11","kind":"3","moment":"2010","link":"8","visible":"1","highscoremode":"2","gradesys":"0","code_id":null,"deadline":"2015-02-20 15:30:00","relativedeadline":null,"qrelease":"2015-02-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":"0","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Fr\u00e5geduggor 1HP","lid":"2013","pos":"12","kind":"4","moment":"2013","link":"","visible":"1","highscoremode":"0","gradesys":"2","code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":"2","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Fr\u00e5gedugga 1","lid":"2014","pos":"13","kind":"3","moment":"2013","link":"9","visible":"1","highscoremode":"1","gradesys":"0","code_id":null,"deadline":"2015-02-19 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":"0","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Rapport 1HP","lid":"2015","pos":"14","kind":"4","moment":"2015","link":"","visible":"1","highscoremode":"1","gradesys":"2","code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":"2","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Rapport inl\u00e4mning","lid":"2016","pos":"15","kind":"3","moment":"2015","link":"10","visible":"1","highscoremode":"1","gradesys":"0","code_id":null,"deadline":"2015-02-19 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":"0","feedbackenabled":"0","feedbackquestion":null},{"entryname":"HTML and CSS 1HP","lid":"2033","pos":"16","kind":"4","moment":"2033","link":"","visible":"1","highscoremode":"1","gradesys":"2","code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":"2","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Random css dugga","lid":"2034","pos":"17","kind":"3","moment":"2033","link":"11","visible":"1","highscoremode":"1","gradesys":"0","code_id":null,"deadline":"2015-02-19 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":"0","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Clipping","lid":"2035","pos":"18","kind":"4","moment":"2035","link":"","visible":"1","highscoremode":"1","gradesys":"2","code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":"2","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Random clipping dugga","lid":"2036","pos":"19","kind":"3","moment":"2035","link":"12","visible":"1","highscoremode":"1","gradesys":"0","code_id":null,"deadline":"2015-02-19 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":"0","feedbackenabled":"0","feedbackquestion":null}],"duggor":[{"deadline":"2015-01-30 15:30:00","relativedeadline":null},{"deadline":"2015-01-25 15:30:00","relativedeadline":null},{"deadline":"2015-02-19 15:30:00","relativedeadline":null},{"deadline":"2015-01-20 15:30:00","relativedeadline":null},{"deadline":"2015-01-18 15:30:00","relativedeadline":null},{"deadline":"2015-02-05 15:30:00","relativedeadline":null},{"deadline":"2015-02-20 15:30:00","relativedeadline":null},{"deadline":"2015-02-19 15:30:00","relativedeadline":null},{"deadline":"2015-02-10 15:30:00","relativedeadline":null},{"deadline":"2015-02-15 15:30:00","relativedeadline":null},{"deadline":"2015-02-19 15:30:00","relativedeadline":null},{"deadline":"2015-02-19 15:30:00","relativedeadline":null}],"groups":{"No":["1"],"Le":["A"],"Vi":["I"]},"debug":"NONE!","writeaccess":true,"studentteacher":false,"readaccess":true,"coursename":"Webbutveckling - datorgrafik","coursevers":"97732","coursecode":"IT118G","courseid":"2","links":[{"fileid":-1,"filename":"---===######===---"},{"fileid":"45","filename":"diagram.json"},{"fileid":"47","filename":"helloWorld.html"},{"fileid":"4","filename":"HTML_Ex1.txt"},{"fileid":"6","filename":"HTML_Ex2.txt"},{"fileid":"8","filename":"HTML_Ex3.txt"},{"fileid":"10","filename":"HTML_Ex4.txt"},{"fileid":"12","filename":"HTML_Ex5.txt"},{"fileid":"14","filename":"HTML_Ex6.txt"},{"fileid":"16","filename":"HTML_Ex7.txt"},{"fileid":"20","filename":"HTML_Ex8.txt"},{"fileid":"23","filename":"JavaScript_Ex1.txt"},{"fileid":"26","filename":"JavaScript_Ex2.txt"},{"fileid":"29","filename":"JavaScript_Ex3.txt"},{"fileid":"50","filename":"mdTest.md"},{"fileid":"31","filename":"PHP_Ex1.txt"},{"fileid":"33","filename":"PHP_Ex2.txt"},{"fileid":"35","filename":"PHP_Ex3.txt"},{"fileid":"38","filename":"Shader_Ex1.txt"},{"fileid":"41","filename":"Shader_Ex2.txt"},{"fileid":-1,"filename":"---===######===---"},{"fileid":"44","filename":"cssdugga-site-1.png"},{"fileid":"48","filename":"HelloPhp.php"},{"fileid":"46","filename":"helloWorld.html"},{"fileid":"42","filename":"minimikrav_m2.md"},{"fileid":"43","filename":"test.png"},{"fileid":-1,"filename":"---===######===---"},{"fileid":"49","filename":"testJS.js"}],"results":[],"versions":[{"cid":"1","coursecode":"DV12G","vers":"45656","versname":"HT15","coursename":"Webbprogrammering","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Webbprogrammering - HT15"},{"cid":"1","coursecode":"DV12G","vers":"45657","versname":"HT16","coursename":"Webbprogrammering","coursenamealt":"UNK","startdate":"2015-12-29 00:00:00","enddate":"2016-03-08 00:00:00","motd":"Webbprogrammering - HT16"},{"cid":"2","coursecode":"IT118G","vers":"97731","versname":"HT14","coursename":"Webbutveckling - datorgrafik","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Webbutveckling - datorgrafik - HT14"},{"cid":"2","coursecode":"IT118G","vers":"97732","versname":"HT15","coursename":"Webbutveckling - datorgrafik","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Webbutveckling - datorgrafik - HT15"},{"cid":"3","coursecode":"IT500G","vers":"1337","versname":"HT15","coursename":"Datorns grunder","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Datorns grunder - HT15"},{"cid":"4","coursecode":"IT301G","vers":"1338","versname":"HT15","coursename":"Software Engineering","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Software Engineering - HT15"},{"cid":"305","coursecode":"IT308G","vers":"12305","versname":"HT15","coursename":"Objektorienterad programmering","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"307","coursecode":"IT115G","vers":"12307","versname":"HT15","coursename":"Datorns grunder","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"308","coursecode":"MA161G","vers":"12308","versname":"HT15","coursename":"Diskret matematik","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"309","coursecode":"DA322G","vers":"12309","versname":"HT15","coursename":"Operativsystem","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"312","coursecode":"IT326G","vers":"12312","versname":"HT15","coursename":"Distribuerade system","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"319","coursecode":"DV736A","vers":"12319","versname":"HT15","coursename":"Examensarbete i datavetenskap","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"324","coursecode":"IT108G","vers":"12324","versname":"HT15","coursename":"Webbutveckling - webbplatsdesign","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"1885","coursecode":"G1337","vers":"1337","versname":"","coursename":"Testing-Course","coursenamealt":"Course for testing codeviewer","startdate":"2020-05-01 00:00:00","enddate":"2020-06-30 00:00:00","motd":"Code examples shows both templateid and boxid!"},{"cid":"1894","coursecode":"G420","vers":"52432","versname":"ST20","coursename":"Demo-Course","coursenamealt":"Chaos Theory - Conspiracy 64k Demo","startdate":"2020-05-01 00:00:00","enddate":"2020-06-30 00:00:00","motd":"Demo Course 2020 - All current duggas"}],"codeexamples":[{"exampleid":"-1","cid":"","examplename":"","sectionname":"New Example","runlink":"","cversion":""}],"unmarked":"33","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","grpmembershp":"UNK","grplst":[],"userfeedback":[],"feedbackquestion":"UNK","avgfeedbackscore":0}',

        'query-after-test-1' => "UPDATE listentries SET visible=1 WHERE lid=2008;",
    
        'service' => 'sectionedservice.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'opt' => 'HIDDEN',
            'username' => 'mestr',
            'password' => 'password',
            'courseid' => '2',
            'coursename' => '2',
            'coursevers' => '97732',
            'comment' => 'undefined',
            'lid' => '2008', 
            'hash' => 'UNK'
             
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'entries' => array(
                'entryname',
                'lid',
                'pos',
                'kind',
                'moment',
                'link',
                'visible',
                'highscoremode',
                'gradesys',
                'code_id',
                'deadline',
                'relativedeadline',
                'qrelease',
                'comments',
                'qstart',
                'grptype',
                'tabs',
                'feedbackenabled',
                'feedbackquestion',
                
            ),
            'debug',
            'writeaccess',
            'studentteacher',
            'readaccess',
            'coursename',
            'coursevers',
            'coursecode',
            'courseid',
            'links',
            'results',
            'versions',
            'codeexamples',
            'unmarked',
            'startdate',
            'enddate',
            'grpmembershp',
            'grplst',
            'userfeedback',
            'feedbackquestion',
            'avgfeedbackscore'
        )),
    ),
    //------------------------------------------------------------------------------------------
    // This test the microservice setVisibleListentrie and the part of the monalith called "PUBLIC" 
    //------------------------------------------------------------------------------------------
    'setVisibleListentriePUBLIC' => array(
        'expected-output'   => '{"entries":[{"entryname":"Bitr\u00e4kningsduggor 1HP","lid":"2001","pos":"0","kind":"4","moment":"2001","link":"","visible":"1","highscoremode":"0","gradesys":"2","code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":"2","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Bitr\u00e4kningsdugga 1","lid":"2002","pos":"1","kind":"3","moment":"2001","link":"1","visible":"1","highscoremode":"1","gradesys":"0","code_id":null,"deadline":"2015-01-30 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":"0","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Bitr\u00e4kningsdugga 2","lid":"2003","pos":"2","kind":"3","moment":"2001","link":"2","visible":"1","highscoremode":"1","gradesys":"0","code_id":null,"deadline":"2015-01-25 15:30:00","relativedeadline":null,"qrelease":"2015-01-08 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":"0","feedbackenabled":"0","feedbackquestion":null},{"entryname":"F\u00e4rgduggor 1HP","lid":"2004","pos":"3","kind":"4","moment":"2004","link":"","visible":"1","highscoremode":"0","gradesys":"2","code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":"2","feedbackenabled":"0","feedbackquestion":null},{"entryname":"F\u00e4rgdugga 1","lid":"2005","pos":"4","kind":"3","moment":"2004","link":"3","visible":"1","highscoremode":"1","gradesys":"0","code_id":null,"deadline":"2015-01-20 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":"0","feedbackenabled":"0","feedbackquestion":null},{"entryname":"F\u00e4rgdugga 2","lid":"2006","pos":"5","kind":"3","moment":"2004","link":"4","visible":"1","highscoremode":"1","gradesys":"0","code_id":null,"deadline":"2015-01-18 15:30:00","relativedeadline":null,"qrelease":"2015-01-08 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":"0","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Geometri 2HP","lid":"2007","pos":"6","kind":"4","moment":"2007","link":"","visible":"1","highscoremode":"0","gradesys":"2","code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":"2","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Linjedugga 1","lid":"2008","pos":"7","kind":"3","moment":"2007","link":"5","visible":"1","highscoremode":"2","gradesys":"0","code_id":null,"deadline":"2015-02-10 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":"0","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Linjedugga 2","lid":"2009","pos":"8","kind":"3","moment":"2007","link":"6","visible":"1","highscoremode":"2","gradesys":"0","code_id":null,"deadline":"2015-02-15 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":"0","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Transformationer 3,5HP","lid":"2010","pos":"9","kind":"4","moment":"2010","link":"","visible":"1","highscoremode":"0","gradesys":"2","code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":"2","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Transformationsdugga 1","lid":"2011","pos":"10","kind":"3","moment":"2010","link":"7","visible":"1","highscoremode":"2","gradesys":"0","code_id":null,"deadline":"2015-02-05 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":"0","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Transformationsdugga 2","lid":"2012","pos":"11","kind":"3","moment":"2010","link":"8","visible":"1","highscoremode":"2","gradesys":"0","code_id":null,"deadline":"2015-02-20 15:30:00","relativedeadline":null,"qrelease":"2015-02-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":"0","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Fr\u00e5geduggor 1HP","lid":"2013","pos":"12","kind":"4","moment":"2013","link":"","visible":"1","highscoremode":"0","gradesys":"2","code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":"2","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Fr\u00e5gedugga 1","lid":"2014","pos":"13","kind":"3","moment":"2013","link":"9","visible":"1","highscoremode":"1","gradesys":"0","code_id":null,"deadline":"2015-02-19 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":"0","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Rapport 1HP","lid":"2015","pos":"14","kind":"4","moment":"2015","link":"","visible":"1","highscoremode":"1","gradesys":"2","code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":"2","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Rapport inl\u00e4mning","lid":"2016","pos":"15","kind":"3","moment":"2015","link":"10","visible":"1","highscoremode":"1","gradesys":"0","code_id":null,"deadline":"2015-02-19 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":"0","feedbackenabled":"0","feedbackquestion":null},{"entryname":"HTML and CSS 1HP","lid":"2033","pos":"16","kind":"4","moment":"2033","link":"","visible":"1","highscoremode":"1","gradesys":"2","code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":"2","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Random css dugga","lid":"2034","pos":"17","kind":"3","moment":"2033","link":"11","visible":"1","highscoremode":"1","gradesys":"0","code_id":null,"deadline":"2015-02-19 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":"0","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Clipping","lid":"2035","pos":"18","kind":"4","moment":"2035","link":"","visible":"1","highscoremode":"1","gradesys":"2","code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":"2","feedbackenabled":"0","feedbackquestion":null},{"entryname":"Random clipping dugga","lid":"2036","pos":"19","kind":"3","moment":"2035","link":"12","visible":"1","highscoremode":"1","gradesys":"0","code_id":null,"deadline":"2015-02-19 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":"0","feedbackenabled":"0","feedbackquestion":null}],"duggor":[{"deadline":"2015-01-30 15:30:00","relativedeadline":null},{"deadline":"2015-01-25 15:30:00","relativedeadline":null},{"deadline":"2015-02-19 15:30:00","relativedeadline":null},{"deadline":"2015-01-20 15:30:00","relativedeadline":null},{"deadline":"2015-01-18 15:30:00","relativedeadline":null},{"deadline":"2015-02-05 15:30:00","relativedeadline":null},{"deadline":"2015-02-20 15:30:00","relativedeadline":null},{"deadline":"2015-02-19 15:30:00","relativedeadline":null},{"deadline":"2015-02-10 15:30:00","relativedeadline":null},{"deadline":"2015-02-15 15:30:00","relativedeadline":null},{"deadline":"2015-02-19 15:30:00","relativedeadline":null},{"deadline":"2015-02-19 15:30:00","relativedeadline":null}],"groups":{"No":["1"],"Le":["A"],"Vi":["I"]},"debug":"NONE!","writeaccess":true,"studentteacher":false,"readaccess":true,"coursename":"Webbutveckling - datorgrafik","coursevers":"97732","coursecode":"IT118G","courseid":"2","links":[{"fileid":-1,"filename":"---===######===---"},{"fileid":"45","filename":"diagram.json"},{"fileid":"47","filename":"helloWorld.html"},{"fileid":"4","filename":"HTML_Ex1.txt"},{"fileid":"6","filename":"HTML_Ex2.txt"},{"fileid":"8","filename":"HTML_Ex3.txt"},{"fileid":"10","filename":"HTML_Ex4.txt"},{"fileid":"12","filename":"HTML_Ex5.txt"},{"fileid":"14","filename":"HTML_Ex6.txt"},{"fileid":"16","filename":"HTML_Ex7.txt"},{"fileid":"20","filename":"HTML_Ex8.txt"},{"fileid":"23","filename":"JavaScript_Ex1.txt"},{"fileid":"26","filename":"JavaScript_Ex2.txt"},{"fileid":"29","filename":"JavaScript_Ex3.txt"},{"fileid":"50","filename":"mdTest.md"},{"fileid":"31","filename":"PHP_Ex1.txt"},{"fileid":"33","filename":"PHP_Ex2.txt"},{"fileid":"35","filename":"PHP_Ex3.txt"},{"fileid":"38","filename":"Shader_Ex1.txt"},{"fileid":"41","filename":"Shader_Ex2.txt"},{"fileid":-1,"filename":"---===######===---"},{"fileid":"44","filename":"cssdugga-site-1.png"},{"fileid":"48","filename":"HelloPhp.php"},{"fileid":"46","filename":"helloWorld.html"},{"fileid":"42","filename":"minimikrav_m2.md"},{"fileid":"43","filename":"test.png"},{"fileid":-1,"filename":"---===######===---"},{"fileid":"49","filename":"testJS.js"}],"results":[],"versions":[{"cid":"1","coursecode":"DV12G","vers":"45656","versname":"HT15","coursename":"Webbprogrammering","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Webbprogrammering - HT15"},{"cid":"1","coursecode":"DV12G","vers":"45657","versname":"HT16","coursename":"Webbprogrammering","coursenamealt":"UNK","startdate":"2015-12-29 00:00:00","enddate":"2016-03-08 00:00:00","motd":"Webbprogrammering - HT16"},{"cid":"2","coursecode":"IT118G","vers":"97731","versname":"HT14","coursename":"Webbutveckling - datorgrafik","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Webbutveckling - datorgrafik - HT14"},{"cid":"2","coursecode":"IT118G","vers":"97732","versname":"HT15","coursename":"Webbutveckling - datorgrafik","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Webbutveckling - datorgrafik - HT15"},{"cid":"3","coursecode":"IT500G","vers":"1337","versname":"HT15","coursename":"Datorns grunder","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Datorns grunder - HT15"},{"cid":"4","coursecode":"IT301G","vers":"1338","versname":"HT15","coursename":"Software Engineering","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Software Engineering - HT15"},{"cid":"305","coursecode":"IT308G","vers":"12305","versname":"HT15","coursename":"Objektorienterad programmering","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"307","coursecode":"IT115G","vers":"12307","versname":"HT15","coursename":"Datorns grunder","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"308","coursecode":"MA161G","vers":"12308","versname":"HT15","coursename":"Diskret matematik","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"309","coursecode":"DA322G","vers":"12309","versname":"HT15","coursename":"Operativsystem","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"312","coursecode":"IT326G","vers":"12312","versname":"HT15","coursename":"Distribuerade system","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"319","coursecode":"DV736A","vers":"12319","versname":"HT15","coursename":"Examensarbete i datavetenskap","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"324","coursecode":"IT108G","vers":"12324","versname":"HT15","coursename":"Webbutveckling - webbplatsdesign","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"1885","coursecode":"G1337","vers":"1337","versname":"","coursename":"Testing-Course","coursenamealt":"Course for testing codeviewer","startdate":"2020-05-01 00:00:00","enddate":"2020-06-30 00:00:00","motd":"Code examples shows both templateid and boxid!"},{"cid":"1894","coursecode":"G420","vers":"52432","versname":"ST20","coursename":"Demo-Course","coursenamealt":"Chaos Theory - Conspiracy 64k Demo","startdate":"2020-05-01 00:00:00","enddate":"2020-06-30 00:00:00","motd":"Demo Course 2020 - All current duggas"}],"codeexamples":[{"exampleid":"-1","cid":"","examplename":"","sectionname":"New Example","runlink":"","cversion":""}],"unmarked":"33","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","grpmembershp":"UNK","grplst":[],"userfeedback":[],"feedbackquestion":"UNK","avgfeedbackscore":0}',
        'query-before-test-1' => "UPDATE listentries SET visible=0 WHERE lid=2008;",
        'query-after-test-1' => "UPDATE listentries SET visible=1 WHERE lid=2008;",
    
        'service' => 'sectionedservice.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'opt' => 'PUBLIC',
            'username' => 'mestr',
            'password' => 'password',
            'courseid' => '2',
            'coursename' => '2',
            'coursevers' => '97732',
            'comment' => 'undefined',
            'lid' => '2008', 
            'hash' => 'UNK'
             
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'entries' => array(
                'entryname',
                'lid',
                'pos',
                'kind',
                'moment',
                'link',
                'visible',
                'highscoremode',
                'gradesys',
                'code_id',
                'deadline',
                'relativedeadline',
                'qrelease',
                'comments',
                'qstart',
                'grptype',
                'tabs',
                'feedbackenabled',
                'feedbackquestion',
                
            ),
            'debug',
            'writeaccess',
            'studentteacher',
            'readaccess',
            'coursename',
            'coursevers',
            'coursecode',
            'courseid',
            'links',
            'results',
            'versions',
            'codeexamples',
            'unmarked',
            'startdate',
            'enddate',
            'grpmembershp',
            'grplst',
            'userfeedback',
            'feedbackquestion',
            'avgfeedbackscore'
        )),
    ), 
    

);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON

?>