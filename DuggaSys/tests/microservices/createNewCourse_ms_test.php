<?php

include "../../../Shared/test.php";

$testsData = array(
    //------------------------------------------------------------------------------------------
    // Test for createNewCourse_ms.php
    //------------------------------------------------------------------------------------------
    'insert_new_course' => array(
        'expected-output' => '1', // need to figure this one out.
        'query-before-test-1' => "DELETE FROM course WHERE coursecode = 'TEST001';",
        'query-after-test-1' => "DELETE FROM course WHERE coursecode = 'TEST001';",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/courseedService/createNewCourse_ms.php',
        'service-data' => serialize(
            array( 
               // 'opt' => 'NEW',Is needed?
                'coursename' => 'Test Course',
                'coursecode' => 'TEST001',
                'courseGitURL' => 'http://localhost/LenaSYS/DuggaSys/sectioned.php?courseid=9999&coursename=Test%20Course&coursevers=8888'
                'AUtoken' => 1 // Need to figure this one out.
            )
        ),
        'filter-output' => serialize(
            array(
                'none' 
            )
        ),
    ),
);
testHandler($testsData, true); // true = prettyprint (HTML), false = raw JSON
