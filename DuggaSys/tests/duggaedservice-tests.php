<?php

include "../../Shared/test.php";
include_once "../../../coursesyspw.php";

$testsData = array(

    'create an assignment' => array(
        'expected-output' => '{"debug":"NONE!","writeaccess":true,"coursecode":"IT118G","coursename":"Webbutveckling - datorgrafik","entries":[{"qname":"Bitdugga1"},{"qname":"Bitdugga2"},{"qname":"colordugga1"},{"qname":"colordugga2"},{"qname":"linjedugga1"},{"qname":"linjedugga2"},{"qname":"dugga1"},{"qname":"dugga2"},{"qname":"Quiz"},{"qname":"Rapport"},{"qname":"HTML CSS Testdugga"},{"qname":"Clipping masking testdugga"},{"qname":"test"}]}',
        'service' => 'http://localhost/LenaSYS/DuggaSys/duggaedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'SAVDUGGA',
                'qid' => 'UNK',
                'cid' => '2',
                'nme' => 'test',

                // this is automatically added depending on what session is active (if any), we want the value to be 2
                'coursevers' => '97732',
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
        'expected-output' => '{"debug":"NONE!","writeaccess":true,"coursecode":"IT118G","coursename":"Webbutveckling - datorgrafik","entries":[{"qname":"Bitdugga1"},{"qname":"Bitdugga2"},{"qname":"colordugga1"},{"qname":"colordugga2"},{"qname":"linjedugga1"},{"qname":"linjedugga2"},{"qname":"dugga1"},{"qname":"dugga2"},{"qname":"Quiz"},{"qname":"Rapport"},{"qname":"HTML CSS Testdugga"},{"qname":"Clipping masking testdugga"},{"qname":"test"}]}',
        'query-before-test-1' => "SELECT id FROM quiz WHERE qname = 'test'",
        'service' => 'http://localhost/LenaSYS/DuggaSys/duggaedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'SAVDUGGA',
                'qid' => '<!query-before-test-1!><*[0]["id"]*>',
                'cid' => '2',
                'nme' => 'test',

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
        'query-before-test-1' => "SELECT id FROM quiz WHERE qname = 'test'",
        'service' => 'http://localhost/LenaSYS/DuggaSys/duggaedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'DELDU',
                'cid' => '2',
                'qid' => '<!query-before-test-1!><*[0]["id"]*>',
                'coursevers' => '97732',
                'username' => 'brom',
                'password' => 'password'
            )
        ),
        'filter-output'=> serialize(
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

    'add variant' => array(
    'expected-output' => '{"debug":"NONE!","writeaccess":true,"coursecode":"IT118G","coursename":"Webbutveckling - datorgrafik","variants":["{\"danswer\":\"00000010 0 2\"}","{\"danswer\":\"00000101 0 5\"}","{\"danswer\":\"00002 0 A\"}","{\"danswer\":\"00011001 1 9\"}","{\"danswer\":\"02111 5 7\"}","{\"danswer\":\"11000000 C 0\"}","{Variant}","{Variant}","{Variant}","{Variant}","{Variant}","{Variant}","{Variant}","{Variant}","{Variant}","{Variant}","B","A","C","A","","","","Test text"]}',
        'service' => 'http://localhost/LenaSYS/DuggaSys/duggaedservice.php',
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
                'variants',
                
            )
        ),
    ),

    'update a variant' => array(
        'expected-output' => '{"debug":"NONE!","writeaccess":true,"coursecode":"IT118G","coursename":"Webbutveckling - datorgrafik","variants":["{\"danswer\":\"00000010 0 2\"}","{\"danswer\":\"00000101 0 5\"}","{\"danswer\":\"00002 0 A\"}","{\"danswer\":\"00011001 1 9\"}","{\"danswer\":\"02111 5 7\"}","{\"danswer\":\"11000000 C 0\"}","{Variant}","{Variant}","{Variant}","{Variant}","{Variant}","{Variant}","{Variant}","{Variant}","{Variant}","{Variant}","B","A","C","A","","","","Test text updated"]}',
        'query-before-test-1' => "SELECT vid FROM variant WHERE variantanswer = 'Test text'",
        'service' => 'http://localhost/LenaSYS/DuggaSys/duggaedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'SAVVARI',
                'cid' => '2',
                'vid' => '<!query-before-test-1!><*[0]["vid"]*>',
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
                'coursecode',
                'variants',
            )
        ),
    ),

    'delete variant' => array(
        'expected-output' => '{"debug":"NONE!","writeaccess":true,"coursecode":"IT118G","coursename":"Webbutveckling - datorgrafik","variants":["{\"danswer\":\"00000010 0 2\"}","{\"danswer\":\"00000101 0 5\"}","{\"danswer\":\"00002 0 A\"}","{\"danswer\":\"00011001 1 9\"}","{\"danswer\":\"02111 5 7\"}","{\"danswer\":\"11000000 C 0\"}","{Variant}","{Variant}","{Variant}","{Variant}","{Variant}","{Variant}","{Variant}","{Variant}","{Variant}","{Variant}","B","A","C","A","","",""]}',
        'query-before-test-1' => "SELECT vid FROM variant WHERE variantanswer = 'Test text updated'",
        'service' => 'http://localhost/LenaSYS/DuggaSys/duggaedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'DELVARI',
                'username' => 'toddler',
                'password' => 'Kong',
                'cid' => '2',
                'vid' => '<!query-before-test-1!><*[0]["vid"]*>',
                'coursevers' => '97732'
            )
        ),
        'filter-output' => serialize(
            array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'debug',
                'writeaccess',
                'coursename',
                'coursecode',
                'variants',
            )
        ),
    ),


);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON