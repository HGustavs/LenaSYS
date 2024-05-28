<?php
include "../../Shared/test.php";
include_once "../../../coursesyspw.php";
$testsData = array(                                             //testfile
    'login credentials test' => array(
        'expected-output' => '{"login":"successful"}',
        'service' => 'http://localhost/LenaSYS/DuggaSys/courseedservice.php', 
        'service-data' => serialize(array(
            'username' => 'testUser',
            'password' => 'testPass',
            'username' => 'brom',
            'password' => 'password'
        )),
        'filter-output' => serialize(array('login')),
    ),
    'create new course' => array(
        'expected-output' => '{"success":true,"message":"Course created successfully"}',
        'service' => 'http://localhost/LenaSYS/DuggaSys/courseedservice.php',
        'service-data' => serialize(array(
            'opt' => 'NEWCOURSE',
            'coursecode' => '10',
            'coursename' => 'SoftwareEngineering',
            'visibility' => '1',
            'activevers' => '202401',
            'activeedvers' => 'V1',    
            'courseGitURL' => 'http://example.com/repo.git'
        )),
        'filter-output' => serialize(array('success', 'message')),
    ),
    'Update-course-version' => array( 
        'expected-output' => '{"success":true, "message":"Course version updated"}',
        'service' => 'http://localhost/LenaSYS/DuggaSys/courseService.php',
        'service-data' => serialize(array(
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
            'opt' => 'DELETE',
            'cid' => '1002'
        )),
        'filter-output' => serialize(array('success', 'message'))
    )
);
?>