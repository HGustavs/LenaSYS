<?php

include "../Shared/test.php";

$testdata = array(
    'create  test' => array(
            'expected-output' => '{"debug":"NONE!","motd":"UNK"}',
            'service' => 'https://cms.webug.se/root/G2/students/c21axepe/LenaSYS/DuggaSys/duggaedservice.php',
            'service-data' => serialize(array( // Data that service needs to execute function
                    'opt' => 'SAVDUGGA',
                    'qid' => 'null',
                    'cid' => '1885',
                    'userid' => '2',
                    'coursevers' => '1337',
                    'qqname' => 'TestQuiz',
                    'autograde' => '1',
                    'gradesys' => '2',
                    'template' => 'Quiz',
                    'jsondeadline' => '{&quot;deadline1&quot;:&quot;2023-04-27 0:0&quot;,&quot;comment1&quot;:&quot;&quot;,&quot;deadline2&quot;:&quot;&quot;,&quot;comment2&quot;:&quot;&quot;,&quot;deadline3&quot;:&quot;&quot;,&quot;comment3&quot;:&quot;&quot;}',
                    'release' => '2023-04-27 00:00:00',
                    'deadline' => '2023-04-29 00:00:00',
                    'qstart' => '2023-04-17'
            )),
            'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
                    'debug',
                    'readonly'
            )),
    ),

);
 
testHandler($testsData, false); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON

?>