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
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/courseedService/createNewCourse_ms.php',
        'service-data' => serialize(
            array( 
                'opt' => 'UPDATE',
                'username' => 'brom',
                'password' => 'password',
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
