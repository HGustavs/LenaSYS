<?php

include "../../Shared/test.php";   // Include the test file where this is sent to
include_once "../../../coursesyspw.php";

$testsData = array(   // Test-data is saved on this array that is then tested in test.php file

    'create data' => array(  
        'expected-output' => '{"debug":"NONE!","writeaccess":true,"coursecode":"IT118G","coursename":"Webbutveckling - datorgrafik","entries":[{"qname":"Bitdugga1"},{"qname":"Bitdugga2"},{"qname":"colordugga1"},{"qname":"colordugga2"},{"qname":"linjedugga1"},{"qname":"linjedugga2"},{"qname":"dugga1"},{"qname":"dugga2"},{"qname":"Quiz"},{"qname":"Rapport"},{"qname":"HTML CSS Testdugga"},{"qname":"Clipping masking testdugga"},{"qname":"test"}]}',
        //'query-after-test-1' => "DELETE FROM quiz ORDER BY id DESC LIMIT 1",
        'service' => 'C:\xampp\htdocs\LenaSYS\DuggaSys\accessedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'pw' => 'testpwd',
                'cid' => 'IT119G',
                'opt' => 'ADDCLASS',
                'uid' => 'testuser1',

                'className' => 'webug',
                'username' => 'c123korv',
                'addedtime',  // Ska denna vara med?
                'val' => '3d-dugga',
                'newusers' => '{&quot;deadline1&quot;:&quot;2023-05-02 0:0&quot;,&quot;comment1&quot;:&quot;&quot;,&quot;deadline2&quot;:&quot;2023-05-02 0:0&quot;,&quot;comment2&quot;:&quot;&quot;,&quot;deadline3&quot;:&quot;2023-05-03 0:0&quot;,&quot;comment3&quot;:&quot;&quot;}',
                'newclass' => 'webug',
                'coursevers' => 'A1',
                'teacher' => 'brom',
                'vers' => '1',
                'requestedpasswordchange' => '0',
                'groups' => array(
                    'groupval',
                    'groupkind',
                    'groupint',
                ), // ARRAY???
                'gid' => '1',
                'prop' => 'password',
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



);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON
?>