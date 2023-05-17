<?php
 
include "../Shared/test.php";

  
 $testsData = array(

     'create an assignment' => array(
         'expected-output' => '{
            "entries": [],
            "debug": "NONE!Error updating dugga Incorrect integer value: "UNK" for column "cid" at row 1",
            "writeaccess": true,
            "files": [
                "3d-dugga",
                "XMLAPI_report1",
                "bit-dugga",
                "boxmodell",
                "clipping_masking_dugga",
                "color-dugga",
                "contribution",
                "curve-dugga",
                "daily-minutes",
                "diagram_dugga",
                "dugga1",
                "dugga2",
                "dugga3",
                "dugga4",
                "dugga5",
                "dugga6",
                "duggaTest",
                "feedback_dugga",
                "generic_dugga_file_receive",
                "group-assignment",
                "html_css_dugga",
                "html_css_dugga_light",
                "kryss",
                "new-assignment",
                "placeholder_dugga",
                "seminar_dugga",
                "shapes-dugga",
                "svg-dugga",
                "transforms-dugga"
            ],
            "coursecode": "Coursecode not found!",
            "coursename": "Course not Found!"}',
         'query-after-test-1' => "DELETE FROM quiz ORDER BY id DESC LIMIT 1",
         'service' => 'https://cms.webug.se/root/G2/students/c21axepe/LenaSYS/DuggaSys/duggaedservice.php',
         'service-data' => serialize(array( // Data that service needs to execute function
            'opt' => 'SAVDUGGA',
            'qid' => 'UNK',
            'cid' => '1885',
            'userid' => '2',      // this is automatically added depending on what session is active (if any), we want the value to be 2
            'coursevers' => '1337',
            'qname' => 'TestQuiz',
            'autograde' => '1',
            'gradesys' => '2',
            'template' => 'Quiz',
            'jsondeadline' => '{&quot;deadline1&quot;:&quot;2023-04-27 0:0&quot;,&quot;comment1&quot;:&quot;&quot;,&quot;deadline2&quot;:&quot;&quot;,&quot;comment2&quot;:&quot;&quot;,&quot;deadline3&quot;:&quot;&quot;,&quot;comment3&quot;:&quot;&quot;}',
            'release' => '2023-04-27 00:00:00',
            'deadline' => '2023-04-29 00:00:00',
            'qstart' => '2023-04-17',
            'username' => '2',
            'password' => 'Kong'
         )),
         'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
             'LastCourseCreated' => array(

             ),
             'entries' => array(
                'cid',
                'coursename',
                'coursecode',
                'visibility',
                'activeversion',
                'activeedversion',
                'registered'
             ),
             'versions' => array(
                'cid',
                'coursecode',
                'vers',
                'versname',
                'coursename',
                'coursenamealt'
             ),
             'debug',
             'writeaccess',
             'motd',
             'readonly'
         )),
     ),

     'update an assignment' => array(
         'expected-output' => '{"debug":"NONE!","motd":"UNK"}',
         'query-before-test-1' => "INSERT INTO quiz(cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,creator,vers,qstart,jsondeadline,`group`) 
         VALUES (1885, 0, 1, 'AutomaticTest', 'Quiz', '2023-04-27 00:00:00', '2023-04-29 00:00:00', 2, '1337', '2023-04-17', '{&quot;deadline1&quot;:&quot;2023-04-27 0:0&quot;,&quot;comment1&quot;:&quot;&quot;,&quot;deadline2&quot;:&quot;&quot;,&quot;comment2&quot;:&quot;&quot;,&quot;deadline3&quot;:&quot;&quot;,&quot;comment3&quot;:&quot;&quot;}', 0);",
         'query-after-test-1' => "DELETE FROM quiz ORDER BY id DESC LIMIT 1",
         'service' => 'https://cms.webug.se/root/G2/students/c21axepe/LenaSYS/DuggaSys/duggaedservice.php',
         'service-data' => serialize(array( // Data that service needs to execute function
            'opt' => 'SAVDUGGA',
            'qid' => 'NULL',
            'name' => 'UpdatedAutomaticTest',
            'autograde' => '1',
            'gradesys' => '2',
            'template' => 'group-assignment',
            'jsondeadline' => '{&quot;deadline1&quot;:&quot;2023-04-30 0:0&quot;;&quot;comment1&quot;:&quot;&quot;;&quot;deadline2&quot;:&quot;&quot;;&quot;comment2&quot;:&quot;&quot;;&quot;deadline3&quot;:&quot;&quot;;&quot;comment3&quot;:&quot;&quot;}',
            'groupAssignment' => '1', 
            'release' => '2023-04-28 00:00:00',
            'deadline' => '2023-04-30 00:00:00',
            'qstart' => '2023-04-18',
            'username' => '2',
            'password' => 'Kong'
         )),
         'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
             'debug',
             'readonly'
         )),
     ),

     'delete an assignment' => array(
        'expected-output' => '{"debug":"NONE!","motd":"UNK"}',
        'query-before-test-1' => "INSERT INTO quiz(cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,creator,vers,qstart,jsondeadline,`group`) 
        VALUES (1885, 0, 1, 'AutomaticTest', 'Quiz', '2023-04-27 00:00:00', '2023-04-29 00:00:00', 2, '1337', '2023-04-17', '{&quot;deadline1&quot;:&quot;2023-04-27 0:0&quot;,&quot;comment1&quot;:&quot;&quot;,&quot;deadline2&quot;:&quot;&quot;,&quot;comment2&quot;:&quot;&quot;,&quot;deadline3&quot;:&quot;&quot;,&quot;comment3&quot;:&quot;&quot;}', 0);",
        'query-before-test-2' => "SELECT MAX(id) FROM quiz",
        'query-after-test-1' => "DELETE FROM quiz ORDER BY id DESC LIMIT 1",
        'service' => 'https://cms.webug.se/root/G2/students/c21axepe/LenaSYS/DuggaSys/duggaedservice.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'opt' => 'DELDU',
            'qid' => '<!query-before-test-2!> <*[0][quiz]*>',
            'username' => 'toddler',
            'password' => 'Kong'
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'debug',
            'readonly'
        )),
    ),

    'add variant' => array(
        'expected-output' => '{"debug":"NONE!","motd":"UNK"}',
        'query-before-test-1' => "INSERT INTO quiz (cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,creator,vers,qstart,jsondeadline,group) VALUES(1885, 0, 1, 'AutomaticTest', 'Quiz', '2023-04-27 00:00:00', '2023-04-28 00:00:00', 2, '1337', '2023-04-17', '{&quot,deadline1&quot,:&quot,2023-04-27 0:0&quot,,&quot,comment1&quot,:&quot,&quot,,&quot,deadline2&quot,:&quot,&quot,,&quot,comment2&quot,:&quot,&quot,,&quot,deadline3&quot,:&quot,&quot,,&quot,comment3&quot,:&quot,&quot,}', 0);",
        'query-before-test-2' => "SELECT MAX(id) FROM quiz",
        'query-after-test-1' => "DELETE FROM quiz ORDER BY id DESC LIMIT 1;",
        'service' => 'https://cms.webug.se/root/G2/students/c21alest/LenaSYS/DuggaSys/courseedservice.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'opt' => 'ADDVARI',
            'username' => 'toddler',
            'password' => 'Kong',
            'qid' => '<!query-before-test-2!> <*[0][quiz]*>',
            'userid' => '2',
            'disabled' => '1',
            'param' => '{"type":"md","filelink":"md","gType":"","diagram_File":"Empty canvas","diagram_type":{"ER":true,"UML":false,"IE":false},"extraparam":"","notes":"","submissions":[{"type":"pdf","fieldname":"","instruction":""}],"errorActive":false}',
            'answer' => 'Bara Text'
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'debug',
            'readonly'
        )),
    ),

    'update a variant' => array(
        'expected-output' => '{"debug":"NONE!","motd":"UNK"}',
        'query-before-test-1' => "INSERT INTO quiz(cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,creator,vers,qstart,jsondeadline,`group`) 
        VALUES (1885, 0, 1, 'AutomaticTest', 'Quiz', '2023-04-27 00:00:00', '2023-04-28 00:00:00', 2, '1337', '2023-04-17', '{&quot;deadline1&quot;:&quot;2023-04-27 0:0&quot;,&quot;comment1&quot;:&quot;&quot;,&quot;deadline2&quot;:&quot;&quot;,&quot;comment2&quot;:&quot;&quot;,&quot;deadline3&quot;:&quot;&quot;,&quot;comment3&quot;:&quot;&quot;}', 0);",
        'query-before-test-2' => "SELECT MAX(id) FROM quiz",
        'variables-query-before-test-3' => "id",
        'query-before-test-3' => "INSERT INTO variant(?,creator,disabled,param,variantanswer) 
        VALUES ('?', 2, 0, '{&quot;type&quot;:&quot;md&quot;,&quot;filelink&quot;:&quot;md&quot;,&quot;gType&quot;:&quot;&quot;,&quot;diagram_File&quot;:&quot;Empty canvas&quot;,&quot;diagram_type&quot;:{&quot;ER&quot;:true,&quot;UML&quot;:false,&quot;IE&quot;:false},&quot;extraparam&quot;:&quot;&quot;,&quot;notes&quot;:&quot;&quot;,&quot;submissions&quot;:[{&quot;type&quot;:&quot;pdf&quot;,&quot;fieldname&quot;:&quot;&quot;,&quot;instruction&quot;:&quot;&quot;}],&quot;errorActive&quot;:false}', 'some text')",
        'query-before-test-4' => "SELECT MAX(vid) FROM variant",
        'query-after-test-1' => "DELETE FROM quiz ORDER BY id DESC LIMIT 1",
        'service' => 'https://cms.webug.se/root/G2/students/c21axepe/LenaSYS/DuggaSys/duggaedservice.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'opt' => 'SAVVARI',
            'id' => '<!query-before-test-2!> <*[0][quiz]*>',
            'vid' => '<!query-before-test-4!> <*[0][variant]*>',
            'disabled' => '1',
            'param' => '{"type":"md","filelink":"","gType":"md","gFilelink":"","diagram_File":"","diagram_type":{"ER":true,"UML":false,"IE":false},"extraparam":"","notes":"","submissions":[{"type":"pdf","fieldname":"","instruction":""},{"type":"pdf","fieldname":"","instruction":""}],"errorActive":false}',
            'answer' => 'new text',
            'username' => 'toddler',
            'password' => 'Kong'
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'debug',
            'readonly'
        )),
    ),

    'create course test' => array(
        'expected-output' => '{"debug":"NONE!","motd":"UNK"}',
        'query-before-test-1' => "INSERT INTO quiz (cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,creator,vers,qstart,jsondeadline,`group`) VALUES(1885, 0, 1, 'AutomaticTest', 'Quiz', '2023-04-27 00:00:00', '2023-04-28 00:00:00', 2, '1337', '2023-04-17', '{&quot,deadline1&quot,:&quot,2023-04-27 0:0&quot,,&quot,comment1&quot,:&quot,&quot,,&quot,deadline2&quot,:&quot,&quot,,&quot,comment2&quot,:&quot,&quot,,&quot,deadline3&quot,:&quot,&quot,,&quot,comment3&quot,:&quot,&quot,}', 0);",
        'query-before-test-2' => "SELECT MAX(id) from quiz",
        'query-before-test-3' => "INSERT INTO listentries(cid,entryname,link,kind,pos,creator,visible,vers,moment,gradesystem,highscoremode,feedbackenabled,feedbackquestion) VALUES(1885, 'Inserttobedeleted', 'UNK', 4, 12, 2, 1, 1337, 5019, 1, 1, 0, 'UNK');",
        'query-before-test-4' => "SELECT MAX(moment) from listentries",
        'variables-query-before-test-5' => "id",
	    'query-before-test-5' => "INSERT INTO variant(quizID,creator,disabled,param,variantanswer) VALUES(?, 2, 0, '{&quot,type&quot,:&quot,md&quot,,&quot,filelink&quot,:&quot,md&quot,,&quot,gType&quot,:&quot,&quot,,&quot,diagram_File&quot,:&quot,Empty canvas&quot,,&quot,diagram_type&quot,:{&quot,ER&quot,:true,&quot,UML&quot,:false,&quot,IE&quot,:false},&quot,extraparam&quot,:&quot,&quot,,&quot,notes&quot,:&quot,&quot,,&quot,submissions&quot,:[{&quot,type&quot,:&quot,pdf&quot,,&quot,fieldname&quot,:&quot,&quot,,&quot,instruction&quot,:&quot,&quot,}],&quot,errorActive&quot,:false}', 'some text');",
        'query-before-test-6' => "SELECT MAX(vid) from variant",
        'variables-query-before-test-7' => "moment, id, vid",
	    'query-before-test-7' => "INSERT INTO userAnswer(cid,moment,quiz,variant) VALUES(1885, ?, ?, ?);",
	    'query-after-test-1' => "DELETE FROM variant ORDER BY quizID DESC LIMIT 1;",
	    'query-after-test-2' => "DELETE FROM listentries WHERE cid = 1885;",
	    'query-after-test-3' => "DELETE FROM quiz ORDER BY ?;",
        'service' => 'https://cms.webug.se/root/G2/students/c21alest/LenaSYS/DuggaSys/duggaedservice.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'opt' => 'DELVARI',
            'username' => 'toddler',
            'password' => 'Kong',
            'id' => '<!query-before-test-2!> <*[0][quiz]*>',
            'moment' => '<!query-before-test-4!> <*[0][listentries]*>',
	        'vid' => '<!query-before-test-6!> <*[0][variant]*>'
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'debug',
            'readonly'
        )),
    ),
    

 );
  
 testHandler($testsData, false); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON