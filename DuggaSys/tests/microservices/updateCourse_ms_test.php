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
        'query-before-test-1' => "INSERT INTO course (cid, coursename, coursecode, visibility, courseGitURL) VALUES (9999, 'Test Course', 'TEST001', 0, 'http://localhost/LenaSYS/DuggaSys/sectioned.php?courseid=1885&coursename=Testing-Course&coursevers=1337');",
        'query-after-test-1' => "INSERT INTO course (cid, coursename, coursecode, visibility, courseGitURL) VALUES (1885, 'Test Course', 'TEST001', 0,  'http://localhost/LenaSYS/DuggaSys/sectioned.php?courseid=9999&coursename=Testing-Course&coursevers=1337');",
        'service' => 'http://localhost/PathToYourService/updateCourse_ms.php',
        'service-data' => serialize(
            array( 
                'opt' => 'UPDATE',
                'cid' => 9999,
                'coursename' => 'Updated Course',
                'visibility' => 1,
                'coursecode' => 'UPD001',
                'courseGitURL' => 'http://localhost/LenaSYS/DuggaSys/sectioned.php?courseid=9999&coursename=Test%20Course&coursevers=1337',
            )
        ),
        'filter-output' => serialize(
            array('none')
        ),
    ),
);
testHandler($testsData, true); // true = prettyprint (HTML), false = raw JSON
