<?php
include "../../Shared/test.php";


$testsData = array(
    'create course test' => array(
        'expected-output' => '"debug":"NONE!","writeaccess":true,"studentteacher":false,"readaccess":true,"coursename":"Webbprogrammering","coursevers":"45656","coursecode":"DV12G","courseid":"1","links":[{"fileid":-1,"filename":"---===######===---"},{"fileid":"45","filename":"diagram.json"},{"fileid":"47","filename":"helloWorld.html"},{"fileid":"4","filename":"HTML_Ex1.txt"},{"fileid":"6","filename":"HTML_Ex2.txt"},{"fileid":"8","filename":"HTML_Ex3.txt"},{"fileid":"10","filename":"HTML_Ex4.txt"},{"fileid":"12","filename":"HTML_Ex5.txt"},{"fileid":"14","filename":"HTML_Ex6.txt"},{"fileid":"16","filename":"HTML_Ex7.txt"},{"fileid":"20","filename":"HTML_Ex8.txt"},{"fileid":"23","filename":"JavaScript_Ex1.txt"},{"fileid":"26","filename":"JavaScript_Ex2.txt"},{"fileid":"29","filename":"JavaScript_Ex3.txt"},{"fileid":"50","filename":"mdTest.md"},{"fileid":"31","filename":"PHP_Ex1.txt"},{"fileid":"33","filename":"PHP_Ex2.txt"},{"fileid":"35","filename":"PHP_Ex3.txt"},{"fileid":"38","filename":"Shader_Ex1.txt"},{"fileid":"41","filename":"Shader_Ex2.txt"},{"fileid":-1,"filename":"---===######===---"},{"fileid":"1","filename":"HTML_Ex1.css"},{"fileid":"2","filename":"HTML_Ex1.html"},{"fileid":"3","filename":"HTML_Ex1.js"},{"fileid":"5","filename":"HTML_Ex2.html"},{"fileid":"7","filename":"HTML_Ex3.html"},{"fileid":"9","filename":"HTML_Ex4.html"},{"fileid":"11","filename":"HTML_Ex5.html"},{"fileid":"13","filename":"HTML_Ex6.html"},{"fileid":"15","filename":"HTML_Ex7.html"},{"fileid":"17","filename":"HTML_Ex8.css"},{"fileid":"18","filename":"HTML_Ex8.html"},{"fileid":"19","filename":"HTML_Ex8.js"},{"fileid":"21","filename":"JavaScript_Ex1.html"},{"fileid":"22","filename":"JavaScript_Ex1.js"},{"fileid":"24","filename":"JavaScript_Ex2.html"},{"fileid":"25","filename":"JavaScript_Ex2.js"},{"fileid":"27","filename":"JavaScript_Ex3.html"},{"fileid":"28","filename":"JavaScript_Ex3.js"},{"fileid":"30","filename":"PHP_Ex1.php"},{"fileid":"32","filename":"PHP_Ex2.php"},{"fileid":"34","filename":"PHP_Ex3.php"},{"fileid":"36","filename":"Shader_Ex1.html"},{"fileid":"37","filename":"Shader_Ex1.js"},{"fileid":"39","filename":"Shader_Ex2.html"},{"fileid":"40","filename":"Shader_Ex2.js"}],"duggor":[],"results":[],"versions":[{"cid":"1","coursecode":"DV12G","vers":"45656","versname":"HT15","coursename":"Webbprogrammering","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Webbprogrammering - HT15"},{"cid":"1","coursecode":"DV12G","vers":"45657","versname":"HT16","coursename":"Webbprogrammering","coursenamealt":"UNK","startdate":"2015-12-29 00:00:00","enddate":"2016-03-08 00:00:00","motd":"Webbprogrammering - HT16"},{"cid":"2","coursecode":"IT118G","vers":"97731","versname":"HT14","coursename":"Webbutveckling - datorgrafik","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Webbutveckling - datorgrafik - HT14"},{"cid":"2","coursecode":"IT118G","vers":"97732","versname":"HT15","coursename":"Webbutveckling - datorgrafik","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Webbutveckling - datorgrafik - HT15"},{"cid":"3","coursecode":"IT500G","vers":"1337","versname":"HT15","coursename":"Datorns grunder","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Datorns grunder - HT15"},{"cid":"4","coursecode":"IT301G","vers":"1338","versname":"HT15","coursename":"Software Engineering","coursenamealt":"UNK","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","motd":"Software Engineering - HT15"},{"cid":"305","coursecode":"IT308G","vers":"12305","versname":"HT15","coursename":"Objektorienterad programmering","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"307","coursecode":"IT115G","vers":"12307","versname":"HT15","coursename":"Datorns grunder","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"308","coursecode":"MA161G","vers":"12308","versname":"HT15","coursename":"Diskret matematik","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"309","coursecode":"DA322G","vers":"12309","versname":"HT15","coursename":"Operativsystem","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"312","coursecode":"IT326G","vers":"12312","versname":"HT15","coursename":"Distribuerade system","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"319","coursecode":"DV736A","vers":"12319","versname":"HT15","coursename":"Examensarbete i datavetenskap","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"324","coursecode":"IT108G","vers":"12324","versname":"HT15","coursename":"Webbutveckling - webbplatsdesign","coursenamealt":"UNK","startdate":null,"enddate":null,"motd":null},{"cid":"1885","coursecode":"G1337","vers":"1337","versname":"","coursename":"Testing-Course","coursenamealt":"Course for testing codeviewer","startdate":"2020-05-01 00:00:00","enddate":"2020-06-30 00:00:00","motd":"Code examples shows both templateid and boxid!"},{"cid":"1894","coursecode":"G420","vers":"52432","versname":"ST20","coursename":"Demo-Course","coursenamealt":"Chaos Theory - Conspiracy 64k Demo","startdate":"2020-05-01 00:00:00","enddate":"2020-06-30 00:00:00","motd":"Demo Course 2020 - All current duggas"}],"codeexamples":[{"exampleid":"-1","cid":"","examplename":"","sectionname":"&laquo;New Example&raquo;","runlink":"","cversion":""},{"exampleid":"12","cid":"1","examplename":"2D Tile Map and Mouse Coordinates","sectionname":"HTML5 Example 6","runlink":"HTML_Ex6.html","cversion":"45656"},{"exampleid":"5","cid":"1","examplename":"Adding and removing elements in the DOM","sectionname":"JavaScript Example 2","runlink":"JavaScript_Ex2.html","cversion":"45656"},{"exampleid":"9","cid":"1","examplename":"Animation and drawing images","sectionname":"HTML5 Example 3","runlink":"HTML_Ex3.html","cversion":"45656"},{"exampleid":"7","cid":"1","examplename":"Basic canvas graphics","sectionname":"HTML5 Example 1","runlink":"HTML_Ex1.html","cversion":"45656"},{"exampleid":"8","cid":"1","examplename":"Canvas Gradients and Transformations","sectionname":"HTML5 Example 2","runlink":"HTML_Ex2.html","cversion":"45656"},{"exampleid":"14","cid":"1","examplename":"Cookies","sectionname":"HTML5 Example 8","runlink":"HTML_Ex8.html","cversion":"45656"},{"exampleid":"4","cid":"1","examplename":"Events, DOM access and console.log","sectionname":"JavaScript Example 1","runlink":"JavaScript_Ex1.html","cversion":"45656"},{"exampleid":"13","cid":"1","examplename":"Isometric Tile Map and Mouse Coordinates","sectionname":"HTML5 Example 7","runlink":"HTML_Ex7.html","cversion":"45656"},{"exampleid":"9027","cid":"1","examplename":"New Group","sectionname":"New Group9010","runlink":null,"cversion":"45656"},{"exampleid":"15","cid":"1","examplename":"Per Pixel Diffuse Lighting","sectionname":"Shaderprogrammering","runlink":"Shader_Ex1.html","cversion":"45656"},{"exampleid":"2","cid":"1","examplename":"PHP Startup","sectionname":"PHP Example 2","runlink":"PHP_Ex2.php","cversion":"45656"},{"exampleid":"1","cid":"1","examplename":"PHP Startup","sectionname":"PHP Example 1","runlink":"PHP_Ex1.php","cversion":"45656"},{"exampleid":"3","cid":"1","examplename":"PHP Variables","sectionname":"PHP Example 3","runlink":"PHP_Ex3.php","cversion":"45656"},{"exampleid":"11","cid":"1","examplename":"Reading mouse coordinates","sectionname":"HTML5 Example 5","runlink":"HTML_Ex5.html","cversion":"45656"},{"exampleid":"16","cid":"1","examplename":"Rim Lighting","sectionname":"Shaderprogrammering","runlink":"Shader_Ex2.html","cversion":"45656"},{"exampleid":"10","cid":"1","examplename":"Shadows","sectionname":"HTML5 Example 4","runlink":"HTML_Ex4.html","cversion":"45656"},{"exampleid":"6","cid":"1","examplename":"Validating form data","sectionname":"JavaScript Example 3","runlink":"JavaScript_Ex3.html","cversion":"45656"}],"unmarked":"0","startdate":"2014-12-29 00:00:00","enddate":"2015-03-08 00:00:00","groups":{"No":["1","2","3","4","5","6","7","8"],"Le":["A","B","C","D","E","F","G","H"],"Vi":["I","II","III","IV","V","VI","VII","VIII"]},"grpmembershp":"UNK","grplst":[],"userfeedback":[],"feedbackquestion":"UNK","avgfeedbackscore":0}',
        
        'query-before-test-1' => "INSERT INTO listentries (cid,vers, entryname, link, kind, pos, visible,creator,comments, gradesystem, highscoremode, groupKind) VALUES(1,45656,'New Group',9021,6,5,0,22,'TOP', 0, 0, null)",
        'query-before-test-2' => "INSERT INTO codeexample (exampleid, cid, examplename, sectionname, beforeid, afterid, runlink, cversion, public, uid, templateid) VALUE (9021, 1, 'New Code', 'New Code9021', NULL, NULL, NULL, 45656, 0, 1, 0);",
        'query-after-test-1' => "DELETE FROM listentries WHERE lid > 5009;",
        'query-after-test-2' => "DELETE FROM codeexample WHERE exampleid > 9009;",
        'service' => 'https://cms.webug.se/root/G2/students/a21jeaha/LenaSYS/DuggaSys/sectionedservice.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'opt' => 'GRP',
            'username' => 'mestr',
            'password' => 'password',
            'courseid' => '1',
            'coursevers' => '45656',
            'blop' => '!query-before-test-1! [0][coursename]',
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            //'entries',
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
    // 'create course test 2' => array(
    //     'expected-output' => '{"debug":"NONE!","motd":"UNK"}',
    //     'service' => 'https://cms.webug.se/root/G2/students/a21jeaha/LenaSYS/DuggaSys/courseedservice.php',
    //     'service-data' => serialize(array( // Data that service needs to execute function
    //         'opt' => 'NEW',
    //         'username' => 'mestr',
    //         'password' => 'password',
    //         'coursecode' => 'IT466G',
    //         'coursename' => 'TestCourseFromAPI5',
    //         'uid' => '101'
    //     )),
    //     'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
    //         'none'
    //     )),
    // ),
);
 
// $testsData = array(
//     'create course test' => array(
//         'expected-output' => '{"debug":"NONE!","motd":"UNK"}',
//         'query-before-test-1' => "SELECT coursename FROM course WHERE coursecode = 'DV12G' ORDER BY coursecode DESC LIMIT 1",
//         'variables-query-before-test-2' => "blop",
//         'query-before-test-2' => "INSERT INTO course (coursecode,coursename,visibility,creator, hp) VALUES('IT401G','MyAPICourse',0,101, 7.5)",
//         'query-after-test-1' => "DELETE FROM course WHERE coursecode = 'IT478G' AND coursename = 'APICreateCourseTestQuery'",
//         'query-after-test-2' => "DELETE FROM course WHERE coursecode = 'IT478G' AND coursename = 'APICreateCourseTestQuery'",
//         'service' => 'https://cms.webug.se/root/G2/students/c21alest/LenaSYS/DuggaSys/courseedservice.php',
//         'service-data' => serialize(array( // Data that service needs to execute function
//             'opt' => 'NEW',
//             'username' => 'usr',
//             'password' => 'pass',
//             'coursecode' => 'IT466G',
//             'coursename' => 'TestCourseFromAPI4',
//             'uid' => '101',
//         'blop' => '!query-before-test-1! [0][coursename]'
//         )),
//         'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
//             'debug',
//             'readonly'
//         )),
//     ),
//     'create course test 2' => array(
//         'expected-output' => '{"debug":"NONE!","motd":"UNK"}',
//         'service' => 'https://cms.webug.se/root/G2/students/c21alest/LenaSYS/DuggaSys/courseedservice.php',
//         'service-data' => serialize(array( // Data that service needs to execute function
//             'opt' => 'NEW',
//             'username' => 'usr',
//             'password' => 'pass',
//             'coursecode' => 'IT466G',
//             'coursename' => 'TestCourseFromAPI5',
//             'uid' => '101'
//         )),
//         'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
//             'none'
//         )),
//     ),
// );

// foreach($testsData as $i => $value){
//     echo $i;
//     echo $value;
//     foreach($i as $i2 => $value2){
//         echo $i2;
//         echo $value2;
//     }

// }

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON
echo $testsData['create course test']['service-data'];


?>