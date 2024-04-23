<?php

include "C:\Users\Youssuf\OneDrive\Documents\GitHub\LenaSYS\DuggaSys\microservices\courseedService\courseseedService_test.php";
include "DuggaSys\microservices\courseedService\courseseedService_test.php"; //path to testfile

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


function testHandler($testsData, $prettyPrint) {
    $results = [];
    foreach ($testsData as $name => $testData) {
        $data = unserialize($testData['service-data']);
        $filteredOutput = prepareDataForTest($data, $testData);

        if ($prettyPrint) {
            echo "<h2>$name</h2>";
            echo "<hr>";
        }

        
        $serviceResponse = callService($testData['service'], $filteredOutput);  // Perform the service call
        $responseDecoded = json_decode($serviceResponse, true);

        $expectedOutput = json_decode($testData['expected-output'], true);  // Filter the response based on given filter

        $filteredResponse = array_intersect_key($responseDecoded, array_flip(unserialize($testData['filter-output'])));




?>
