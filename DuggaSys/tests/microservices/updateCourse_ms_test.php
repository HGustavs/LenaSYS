<?php

include "../../../Shared/test.php";
ini_set('display_errors', 1);
error_reporting(E_ALL);

$testsData = array(
    //------------------------------------------------------------------------------------------
    // Test for updateCourse_ms.php
    //------------------------------------------------------------------------------------------
    'update_course' => array(
        'expected-output' => '1', 
       // 'query-after-test-1' => "UPDATE course SET coursename='Testing-Course', coursecode='G1337', visibility=0, courseGitURL='http://localhost/LenaSYS/DuggaSys/sectioned.php?courseid=1885&coursename=Testing-Course&coursevers=1337' WHERE cid=1885;",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/courseedService/updateCourse_ms.php',
        'service-data' => serialize(
            array( 
                'opt' => 'UPDATE',
                'username' => 'brom',
                'password' => 'password',
                'cid' => 1885,
                'coursename' => 'Updated-Course',
                'visibility' => 1,
                'coursecode' => 'G1337',
                'courseGitURL' => 'http://localhost/LenaSYS/DuggaSys/sectioned.php?courseid=1885&coursename=Updated-Course&coursevers=1337',
            )
        ),
        'filter-output' => serialize(
            array('none')
        ),
    ),
);
testHandler($testsData, true); // true = prettyprint (HTML), false = raw JSON
