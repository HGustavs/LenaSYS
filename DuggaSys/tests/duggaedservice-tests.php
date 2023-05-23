<?php

include "../../Shared/test.php";
include_once "../../../coursesyspw.php";

$testsData = array(

    'create an assignment' => array(
        'expected-output' => '{"debug":"NONE!","writeaccess":true,"coursecode":"IT118G","coursename":"Webbutveckling - datorgrafik","entries":[{"qname":"Bitdugga1"},{"qname":"Bitdugga2"},{"qname":"colordugga1"},{"qname":"colordugga2"},{"qname":"linjedugga1"},{"qname":"linjedugga2"},{"qname":"dugga1"},{"qname":"dugga2"},{"qname":"Quiz"},{"qname":"Rapport"},{"qname":"HTML CSS Testdugga"},{"qname":"Clipping masking testdugga"},{"qname":"test"}]}',
        //'query-after-test-1' => "DELETE FROM quiz ORDER BY id DESC LIMIT 1",
        'service' => 'https://cms.webug.se/root/G2/students/c21axepe/LenaSYS/DuggaSys/duggaedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'SAVDUGGA',
                'qid' => 'UNK',
                'cid' => '2',
                'nme' => 'test',

                // this is automatically added depending on what session is active (if any), we want the value to be 2
                'coursevers' => '97732',
                //'qname' => 'TestQuiz',
                'autograde' => '0',
                'gradesys' => '1',
                'template' => '3d-dugga',
                'jsondeadline' => '{&quot;deadline1&quot;:&quot;2023-05-02 0:0&quot;,&quot;comment1&quot;:&quot;&quot;,&quot;deadline2&quot;:&quot;2023-05-02 0:0&quot;,&quot;comment2&quot;:&quot;&quot;,&quot;deadline3&quot;:&quot;2023-05-03 0:0&quot;,&quot;comment3&quot;:&quot;&quot;}',
                'release' => '2023-05-04 0:0',
                'deadline' => '2023-05-02 0:0',
                'qstart' => '2023-05-01 0:0',
                'username' => 'brom',
                'password' => 'password'
            )
        ),
        'filter-output' => serialize(array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'debug',
                'writeaccess',
                'coursename',
                'coursecode',
                'entries' => array(
                    'qname'
                ),
            )
        ),
    ),
    
    
    'update an assignment' => array(
        'expected-output' => '{"debug":"NONE!","writeaccess":true,"coursecode":"IT118G","coursename":"Webbutveckling - datorgrafik","entries":[{"qname":"Bitdugga1"},{"qname":"Bitdugga2"},{"qname":"colordugga1"},{"qname":"colordugga2"},{"qname":"linjedugga1"},{"qname":"linjedugga2"},{"qname":"dugga1"},{"qname":"dugga2"},{"qname":"Quiz"},{"qname":"Rapport"},{"qname":"HTML CSS Testdugga"},{"qname":"Clipping masking testdugga"},{"qname":"TestDugga1337"}]}',
        //'query-before-test-1' => "INSERT INTO quiz(cid,qid,qname,autograde,gradesystem,quizFile,qstart,deadline,jsondeadline,qrelease,vers) 
        // VALUES (2, 'UNK', 'TestDugga5', 1, 1, '3d-dugga', '2023-05-01 0:0', '2023-05-02 0:0', '{&quot;deadline1&quot;:&quot;2023-05-02 0:0&quot;,&quot;comment1&quot;:&quot;&quot;,&quot;deadline2&quot;:&quot;2023-05-03 0:0&quot;,&quot;comment2&quot;:&quot;&quot;,&quot;deadline3&quot;:&quot;2023-05-04 0:0&quot;,&quot;comment3&quot;:&quot;&quot;}', '2023-05-06 0:0', 97732);",
        'query-before-test-1' => "SELECT id FROM quiz WHERE qname = 'test'",
        //'query-after-test-1' => "DELETE FROM quiz ORDER BY id DESC LIMIT 1",
        'service' => 'https://cms.webug.se/root/G2/students/c21axepe/LenaSYS/DuggaSys/duggaedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'SAVDUGGA',
                'qid' => '<!query-before-test-1!> <*[0][id]*>',
                'cid' => '2',
                'nme' => 'TestDugga1337',

                // this is automatically added depending on what session is active (if any), we want the value to be 2
                'coursevers' => '97732',
                //'qname' => 'TestQuiz',
                'autograde' => '1',
                'gradesys' => '1',
                'template' => '3d-dugga',
                'jsondeadline' => '{&quot;deadline1&quot;:&quot;2023-05-03 0:0&quot;,&quot;comment1&quot;:&quot;&quot;,&quot;deadline2&quot;:&quot;2023-05-03 0:0&quot;,&quot;comment2&quot;:&quot;&quot;,&quot;deadline3&quot;:&quot;2023-05-04 0:0&quot;,&quot;comment3&quot;:&quot;&quot;}',
                'release' => '2023-05-05 0:0',
                'deadline' => '2023-05-03 0:0',
                'qstart' => '2023-05-02 0:0',
                'username' => 'brom',
                'password' => 'password'
            )
        ),
        'filter-output' => serialize(
            array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'debug',
                'writeaccess',
                'coursename',
                'coursecode',
                'entries' => array(
                    'qname'
                ),
            )
        ),
    ),

    
    'delete an assignment' => array(
        'expected-output' => '{"debug":"NONE!","writeaccess":true,"coursecode":"IT118G","coursename":"Webbutveckling - datorgrafik","entries":[{"qname":"Bitdugga1"},{"qname":"Bitdugga2"},{"qname":"colordugga1"},{"qname":"colordugga2"},{"qname":"linjedugga1"},{"qname":"linjedugga2"},{"qname":"dugga1"},{"qname":"dugga2"},{"qname":"Quiz"},{"qname":"Rapport"},{"qname":"HTML CSS Testdugga"},{"qname":"Clipping masking testdugga"}]}',
        'query-before-test-1' => "SELECT id FROM quiz WHERE qname = 'TestDugga1337'",
        'service' => 'https://cms.webug.se/root/G2/students/c21axepe/LenaSYS/DuggaSys/duggaedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'DELDU',
                'cid' => '2',
                'qid' => '<!query-before-test-1!> <*[0][id]*>',
                'coursevers' => '97732',
                'username' => 'brom',
                'password' => 'password'
            )
        ),
        'filter-output' => serialize(
            array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'debug',
                'writeaccess',
                'coursename',
                'coursecode',
                'entries' => array(
                    'qname'
                ),
            )
        ),
    ),

    //Test works, but it is not possible to gather the correct expected output since the array is within an array, and the api is currently unable to handle it properly. (,"entries":[{"variantanswer":"Test text"}])
    //Test works meaning that a variant is added correctly when checked without following deletes.
    'add variant' => array(
    'expected-output' => '{"debug":"NONE!","writeaccess":true,"coursecode":"IT118G","coursename":"Webbutveckling - datorgrafik","entries":[{"variant":[{"variantanswer":"Test text"}]}]}',
        'service' => 'https://cms.webug.se/root/G2/students/c21axepe/LenaSYS/DuggaSys/duggaedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'ADDVARI',
                'username' => 'brom',
                'password' => 'password',
                'qid' => '12',
                'cid' => '2',
                'disabled' => '1',
                'coursevers' => '97732',
                'parameter' => '{&quot;type&quot;:&quot;md&quot;,&quot;filelink&quot;:&quot;&quot;,&quot;gType&quot;:&quot;md&quot;,&quot;gFilelink&quot;:&quot;&quot;,&quot;diagram_File&quot;:&quot;&quot;,&quot;diagram_type&quot;:{&quot;ER&quot;:true,&quot;UML&quot;:false,&quot;IE&quot;:false},&quot;extraparam&quot;:&quot;&quot;,&quot;notes&quot;:&quot;Test&quot;,&quot;submissions&quot;:[{&quot;type&quot;:&quot;pdf&quot;,&quot;fieldname&quot;:&quot;&quot;,&quot;instruction&quot;:&quot;&quot;}],&quot;errorActive&quot;:false}',
                'variantanswer' => 'Test text'
            )
        ),
        'filter-output' => serialize(
            array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'debug',
                'writeaccess',
                'coursename',
                'coursecode',
                'entries' => array(
                    
                        'variantanswer'
                    
                ),
            )
        ),
    ),

    //Test works, but it is not possible to gather the correct expected output since the array is within an array, and the api is currently unable to handle it properly.
    //Test works meaning that a variant is updated correctly when checked without following deletes.
    'update a variant' => array(
        'expected-output' => '{"debug":"NONE!","writeaccess":true,"coursecode":"IT118G","coursename":"Webbutveckling - datorgrafik"}',
        'query-before-test-1' => "SELECT vid FROM variant WHERE variantanswer = 'Test text'",
        'service' => 'https://cms.webug.se/root/G2/students/c21axepe/LenaSYS/DuggaSys/duggaedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'SAVVARI',
                'cid' => '2',
                'vid' => '<!query-before-test-1!> <*[0][vid]*>',
                'disabled' => '0',
                'parameter' => '{&quot;type&quot;:&quot;md&quot;,&quot;filelink&quot;:&quot;&quot;,&quot;gType&quot;:&quot;md&quot;,&quot;gFilelink&quot;:&quot;&quot;,&quot;diagram_File&quot;:&quot;&quot;,&quot;diagram_type&quot;:{&quot;ER&quot;:true,&quot;UML&quot;:false,&quot;IE&quot;:false},&quot;extraparam&quot;:&quot;&quot;,&quot;notes&quot;:&quot;Test&quot;,&quot;submissions&quot;:[{&quot;type&quot;:&quot;pdf&quot;,&quot;fieldname&quot;:&quot;&quot;,&quot;instruction&quot;:&quot;&quot;}],&quot;errorActive&quot;:false}',
                'variantanswer' => 'Test text updated',
                'coursevers' => '97732',
                'username' => 'toddler',
                'password' => 'Kong'
            )
        ),
        'filter-output' => serialize(
            array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'debug',
                'writeaccess',
                'coursename',
                'coursecode'
            )
        ),
    ),

    //Test works, but it is not possible to gather the correct expected output since the array is within an array, and the api is currently unable to handle it properly.
    //Test works meaning that a variant is deleted correctly when checked. All previous tests have been tested thoroughly so we now that they were added to begin with.
    'delete variant' => array(
        'expected-output' => '{"debug":"NONE!","writeaccess":true,"coursecode":"IT118G","coursename":"Webbutveckling - datorgrafik"}',
        'query-before-test-1' => "SELECT vid FROM variant WHERE variantanswer = 'Test text updated'",
        'service' => 'https://cms.webug.se/root/G2/students/c21axepe/LenaSYS/DuggaSys/duggaedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'DELVARI',
                'username' => 'toddler',
                'password' => 'Kong',
                'cid' => '2',
                'vid' => '<!query-before-test-1!> <*[0][vid]*>',
                'coursevers' => '97732'
            )
        ),
        'filter-output' => serialize(
            array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'debug',
                'writeaccess',
                'coursename',
                'coursecode'
            )
        ),
    ),


);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON