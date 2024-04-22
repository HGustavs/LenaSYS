<?php

include "../Shared/test.php";
include "path_to_your_editorService.php";  // mockup path

$testsData = array(
    'login credentials test' => array(
        'expected-output' => '{"login":"successful"}',
        'service' => 'path_to_loginService.php', // mockup path to login 
        'service-data' => serialize(array(
            'username' => 'testUser',  //mockup data
            'password' => 'testPass'
        )),
        'filter-output' => serialize(array('login')),
    ),
    'create new course' => array(
        'expected-output' => '{"success":true,"message":"Course created successfully"}',
        'service' => 'path_to_your_editorService.php',
        'service-data' => serialize(array(
            'opt' => 'NEW',
            'coursecode' => '10',
            'coursename' => 'SoftwareEngineering',
            'visibility' => '1',  // '1' true visibility
            'activevers' => '202401',
            'activeedvers' => 'V1',
            'courseGitURL' => 'http://example.com/repo.git' //mockup
        )),
        'filter-output' => serialize(array('success', 'message')),
    )
);

testHandler($testsData, false);  // Using false for raw JSON output
?>
