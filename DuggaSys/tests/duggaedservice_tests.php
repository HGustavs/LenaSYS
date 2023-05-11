<?php
 
 include "../Shared/test.php";

 //NEEDS TO BE DONE:
 //Selecting a value and inputting it in the "send"
 //Multiple inserts
 //Multiple deletes
 //Multiple selects
 //Expected output
 //Check how the database is formed, may have to rewrite some tests now when we have more knowledge about how the tests will work
  
 $testsData = array(
     'create an assignment' => array(
         'expected-output' => '{"debug":"NONE!","motd":"UNK"}',
         //This test has no pre querys since its only an insert
         /*'query-before-test' => "INSERT INTO course (coursecode,coursename,visibility,creator, hp) VALUES('IT401G','MyAPICourse',0,101, 7.5)",*/
         'query-after-test' => "DELETE FROM quiz ORDER BY id DESC LIMIT 1",
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
             'debug',
             'readonly'
         )),
     ),

     'update an assignment' => array(
         'expected-output' => '{"debug":"NONE!","motd":"UNK"}',
         'query-before-test' => "INSERT INTO quiz(cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,creator,vers,qstart,jsondeadline,`group`) 
         VALUES (1885, 0, 1, 'AutomaticTest', 'Quiz', '2023-04-27 00:00:00', '2023-04-29 00:00:00', 2, '1337', '2023-04-17', '{&quot;deadline1&quot;:&quot;2023-04-27 0:0&quot;,&quot;comment1&quot;:&quot;&quot;,&quot;deadline2&quot;:&quot;&quot;,&quot;comment2&quot;:&quot;&quot;,&quot;deadline3&quot;:&quot;&quot;,&quot;comment3&quot;:&quot;&quot;}', 0);",
         'query-after-test' => "DELETE FROM quiz ORDER BY id DESC LIMIT 1",
         'service' => 'https://cms.webug.se/root/G2/students/c21axepe/LenaSYS/DuggaSys/duggaedservice.php',
         'service-data' => serialize(array( // Data that service needs to execute function
            'opt' = 'SAVDUGGA',
            'qid' = 'NULL',
            'name' = 'UpdatedAutomaticTest',
            'autograde' = '1',
            'gradesys' = '2',
            'template' = 'group-assignment',
            'jsondeadline' = '{&quot;deadline1&quot;:&quot;2023-04-30 0:0&quot;;&quot;comment1&quot;:&quot;&quot;;&quot;deadline2&quot;:&quot;&quot;;&quot;comment2&quot;:&quot;&quot;;&quot;deadline3&quot;:&quot;&quot;;&quot;comment3&quot;:&quot;&quot;}',
            'groupAssignment' = '1', 
            'release' = '2023-04-28 00:00:00',
            'deadline' = '2023-04-30 00:00:00',
            'qstart' = '2023-04-18',
            'username' = '2',
            'password' = 'Kong'
         )),
         'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
             'debug',
             'readonly'
         )),
     ),

     'delete an assignment' => array(
        'expected-output' => '{"debug":"NONE!","motd":"UNK"}',
        'query-before-test' => "INSERT INTO quiz(cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,creator,vers,qstart,jsondeadline,`group`) 
        VALUES (1885, 0, 1, 'AutomaticTest', 'Quiz', '2023-04-27 00:00:00', '2023-04-29 00:00:00', 2, '1337', '2023-04-17', '{&quot;deadline1&quot;:&quot;2023-04-27 0:0&quot;,&quot;comment1&quot;:&quot;&quot;,&quot;deadline2&quot;:&quot;&quot;,&quot;comment2&quot;:&quot;&quot;,&quot;deadline3&quot;:&quot;&quot;,&quot;comment3&quot;:&quot;&quot;}', 0);",
        'query-after-test' => "DELETE FROM quiz ORDER BY id DESC LIMIT 1",
        'service' => 'https://cms.webug.se/root/G2/students/c21axepe/LenaSYS/DuggaSys/duggaedservice.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'opt' = 'DELDU',
            'qid' = 'VALUE FROM QUERY', //Needs to be solved with the api (select)
            'username' = 'toddler',
            'password' = 'Kong'
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'debug',
            'readonly'
        )),
    ),

    /* TEST WILL NOT WORK FOR NOW, VALUE HAS TO BE SAVED AND USED IN SEND
'create course test' => array(
        'expected-output' => '{"debug":"NONE!","motd":"UNK"}',
        'query-before-test' => "INSERT INTO quiz (cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,creator,vers,qstart,jsondeadline,group) VALUES(1885, 0, 1, 'AutomaticTest', 'Quiz', '2023-04-27 00:00:00', '2023-04-28 00:00:00', 2, '1337', '2023-04-17', '{&quot,deadline1&quot,:&quot,2023-04-27 0:0&quot,,&quot,comment1&quot,:&quot,&quot,,&quot,deadline2&quot,:&quot,&quot,,&quot,comment2&quot,:&quot,&quot,,&quot,deadline3&quot,:&quot,&quot,,&quot,comment3&quot,:&quot,&quot,}', 0);",
        'query-after-test' => "DELETE FROM quiz ORDER BY id DESC LIMIT 1;",
        'service' => 'https://cms.webug.se/root/G2/students/c21alest/LenaSYS/DuggaSys/courseedservice.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'opt' => 'ADDVARI',
            'username' => 'toddler',
            'password' => 'Kong',
            'qid' => 'SAVED VALUE WHAT WE DO',
            'userid' => '2',
            'disabled' => '1',
        'param' => '{'type':'md','filelink':'md','gType':'','diagram_File':'Empty canvas','diagram_type':{'ER':true,'UML':false,'IE':false},'extraparam':'','notes':'','submissions':[{'type':'pdf','fieldname':'','instruction':''}],'errorActive':false}',
        'answer' = 'Bara Text'
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'debug',
            'readonly'
        )),
    ),
*/
    //Test wont work
    'update a variant' => array(
        'expected-output' => '{"debug":"NONE!","motd":"UNK"}',
        'query-before-test' => "INSERT INTO quiz(cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,creator,vers,qstart,jsondeadline,`group`) 
        VALUES (1885, 0, 1, 'AutomaticTest', 'Quiz', '2023-04-27 00:00:00', '2023-04-28 00:00:00', 2, '1337', '2023-04-17', '{&quot;deadline1&quot;:&quot;2023-04-27 0:0&quot;,&quot;comment1&quot;:&quot;&quot;,&quot;deadline2&quot;:&quot;&quot;,&quot;comment2&quot;:&quot;&quot;,&quot;deadline3&quot;:&quot;&quot;,&quot;comment3&quot;:&quot;&quot;}', 0);",
        //Id will not work
        'query-before-test2' => "INSERT INTO variant(quizID,creator,disabled,param,variantanswer) 
        VALUES (MAX(id), 2, 0, '{&quot;type&quot;:&quot;md&quot;,&quot;filelink&quot;:&quot;md&quot;,&quot;gType&quot;:&quot;&quot;,&quot;diagram_File&quot;:&quot;Empty canvas&quot;,&quot;diagram_type&quot;:{&quot;ER&quot;:true,&quot;UML&quot;:false,&quot;IE&quot;:false},&quot;extraparam&quot;:&quot;&quot;,&quot;notes&quot;:&quot;&quot;,&quot;submissions&quot;:[{&quot;type&quot;:&quot;pdf&quot;,&quot;fieldname&quot;:&quot;&quot;,&quot;instruction&quot;:&quot;&quot;}],&quot;errorActive&quot;:false}', 'some text')",
        'query-after-test' => "DELETE FROM quiz ORDER BY id DESC LIMIT 1",
        'service' => 'https://cms.webug.se/root/G2/students/c21axepe/LenaSYS/DuggaSys/duggaedservice.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'opt' = 'SAVVARI',
            'vid' = '(max quiz id)', //Needs to be solved with the api (select)
            'disabled' = '1',
            'param' = '{"type":"md","filelink":"","gType":"md","gFilelink":"","diagram_File":"","diagram_type":{"ER":true,"UML":false,"IE":false},"extraparam":"","notes":"","submissions":[{"type":"pdf","fieldname":"","instruction":""},{"type":"pdf","fieldname":"","instruction":""}],"errorActive":false}',
            'answer' = 'new text',
            'username' = 'toddler',
            'password' = 'Kong'
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'debug',
            'readonly'
        )),
    ),

    /* TEST WILL NOT WORK FOR NOW, VALUE HAS TO BE SAVED AND USED IN SEND AND QUERIES
    'create course test' => array(
        'expected-output' => '{"debug":"NONE!","motd":"UNK"}',
        'query-before-test' => "INSERT INTO quiz (cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,creator,vers,qstart,jsondeadline,`group`) VALUES(1885, 0, 1, 'AutomaticTest', 'Quiz', '2023-04-27 00:00:00', '2023-04-28 00:00:00', 2, '1337', '2023-04-17', '{&quot,deadline1&quot,:&quot,2023-04-27 0:0&quot,,&quot,comment1&quot,:&quot,&quot,,&quot,deadline2&quot,:&quot,&quot,,&quot,comment2&quot,:&quot,&quot,,&quot,deadline3&quot,:&quot,&quot,,&quot,comment3&quot,:&quot,&quot,}', 0);",
        'query-during-test1' => "select MAX(id) from quiz",
        'query-before-test2' => "INSERT INTO listentries(cid,entryname,link,kind,pos,creator,visible,vers,moment,gradesystem,highscoremode,feedbackenabled,feedbackquestion) VALUES(1885, 'Inserttobedeleted', 'UNK', 4, 12, 2, 1, 1337, 5019, 1, 1, 0, 'UNK');",
        'query-during-test2' => "select MAX(moment) from listentries",
	    'query-before-test3' => "INSERT INTO variant(quizID,creator,disabled,param,variantanswer) VALUES($id, 2, 0, '{&quot,type&quot,:&quot,md&quot,,&quot,filelink&quot,:&quot,md&quot,,&quot,gType&quot,:&quot,&quot,,&quot,diagram_File&quot,:&quot,Empty canvas&quot,,&quot,diagram_type&quot,:{&quot,ER&quot,:true,&quot,UML&quot,:false,&quot,IE&quot,:false},&quot,extraparam&quot,:&quot,&quot,,&quot,notes&quot,:&quot,&quot,,&quot,submissions&quot,:[{&quot,type&quot,:&quot,pdf&quot,,&quot,fieldname&quot,:&quot,&quot,,&quot,instruction&quot,:&quot,&quot,}],&quot,errorActive&quot,:false}', 'some text');",
        'query-during-test3' => "select MAX(vid) from variant",
	    'query-before-test4' => "INSERT INTO userAnswer(cid,moment,quiz,variant) VALUES(1885, $moment, $id, $variant);",
	    'query-after-test' => "DELETE FROM variant ORDER BY quizID DESC LIMIT 1;",
	    'query-after-test2' => "DELETE FROM listentries WHERE cid = 1885;",
	    'query-after-test3' => "DELETE FROM quiz ORDER BY id;",
        'service' => 'https://cms.webug.se/root/G2/students/c21alest/LenaSYS/DuggaSys/courseedservice.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'opt' => 'DELVARI',
            'username' => 'toddler',
            'password' => 'Kong',
	        'vid' => '$variant'
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'debug',
            'readonly'
        )),
    ),
    */

 );
  
 testHandler($testsData, false); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON