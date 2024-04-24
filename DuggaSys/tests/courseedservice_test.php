<?php

include_once "DuggaSys/microservices/courseedService/courseseedService_test.php";

$testsData = array(
    'login credentials test' => array(
        'expected-output' => '{"login":"successful"}',
        'service' => 'path_to_loginService.php', // Make sure this path is correct
        'service-data' => serialize(array(
            'username' => 'testUser',
            'password' => 'testPass'
        )),
        'filter-output' => serialize(array('login')),
    ),
    'create new course' => array(
        'expected-output' => '{"success":true,"message":"Course created successfully"}',
        'service' => 'http://localhost/LenaSYS/DuggaSys/courseedservice.php', // Make sure this path is correct
        'service-data' => serialize(array(
            'opt' => 'NEWCOURSE',
            'coursecode' => '10',
            'coursename' => 'SoftwareEngineering',
            'visibility' => '1',
            'activevers' => '202401',
            'activeedvers' => 'V1',
            'courseGitURL' => 'http://example.com/repo.git' // Ensure this is the intended URL or leave it empty if not used
        )),
        'filter-output' => serialize(array('success', 'message')),
    ),
    
    
    
    'Update-course-version' => array( 
        'expected-output' => '{"success":true, "message":"Course version updated"}',
        'service' => 'http://localhost/LenaSYS/DuggaSys/courseService.php', 
        'service-data' => serialize(array(
            'opt' => 'UPDATE',
            'cid' => '1001',
            'activevers' => '202302', 
            'coursename' => 'Updated Course for New Semester'
        )),
        'filter-output' => serialize(array('success', 'message'))
    )
);


'delete course' => array(
    'expected-output' => '{"success":true,"message":"Course deleted successfully"}',
    'service' => 'http://localhost/LenaSYS/DuggaSys/courseedservice.php',
    'service-data' => serialize(array(
        'opt' => 'DELETE',
        'cid' => '1002',  
        
    'filter-output' => serialize(array('success', 'message'))
),


?>
