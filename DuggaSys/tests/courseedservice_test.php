<?php

include "../../Shared/test.php";
include_once "../../../coursesyspw.php";

$testsData = array(
    'login credentials test' => array(
        'expected-output' => '{"login":"successful"}',
        'service' => 'http://localhost/LenaSYS/DuggaSys/courseedservice.php', 
        'service-data' => serialize(array(
            'username' => 'brom',
            'password' => 'password'
        )),
        'filter-output' => serialize(array('login')),
    ),
    'create new course' => array(
        'expected-output' => '{"success":true,"message":"Course created successfully"}',
        'service' => 'http://localhost/LenaSYS/DuggaSys/courseedservice.php',
        'service-data' => serialize(array(
            'username' => 'brom',
            'password' => 'password',
            'opt' => 'NEWCOURSE',
            'coursecode' => '10',
            'coursename' => 'SoftwareEngineering',
            'visibility' => '1',
            'activevers' => '202401',
            'activeedvers' => 'V1',
        )),
        'filter-output' => serialize(array('success', 'message')),
    ),
    'Update-course-version' => array( 
        'expected-output' => '{"success":true, "message":"Course version updated"}',
        'service' => 'http://localhost/LenaSYS/DuggaSys/courseService.php',
        'service-data' => serialize(array(
            'username' => 'brom',
            'password' => 'password',
            'opt' => 'UPDATE',
            'cid' => '1001',
            'activevers' => '202402',
            'coursename' => 'Updated Course for New Semester'
        )),
        'filter-output' => serialize(array('success', 'message'))
    ),
    'delete course' => array(
        'expected-output' => '{"success":true,"message":"Course deleted successfully"}',
        'service' => 'http://localhost/LenaSYS/DuggaSys/courseedservice.php',
        'service-data' => serialize(array(
            'username' => 'brom',
            'password' => 'password',
            'opt' => 'DELETE',
            'cid' => '1002'
        )),
        'filter-output' => serialize(array('success', 'message'))
    )
);

testHandler($testsData, true); // (prettyPrint): true = prettyprint (HTML), false = raw JSON
//


?>
