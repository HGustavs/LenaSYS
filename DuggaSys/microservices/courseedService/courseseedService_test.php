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



        $testPassed = ($filteredResponse == $expectedOutput);          // Assert and gather results
        $results[$name] = [
            'expected' => $expectedOutput,
            'received' => $filteredResponse,
            'passed' => $testPassed
        ];

        if ($prettyPrint) {
            echo "<pre>" . print_r($results[$name], true) . "</pre>";
        }
    }

    if (!$prettyPrint) {
        echo json_encode($results);
    }
}

function prepareDataForTest($data, $testData) {
    foreach ($testData as $key => $value) {
        if (strpos($key, 'query-before-test') === 0) {
            // Simulate a database query and manipulate data accordingly
            $queryResult = doDBQuery($value);
            // Replace placeholders in $data with $queryResult
            foreach ($data as $dataKey => $dataValue) {
                if (strpos($dataValue, '<!') !== false) {
                    $data[$dataKey] = $queryResult;  
                }
            }
        }
    }
    return $data;
}

function callService($servicePath, $serviceData) {
    // Simulated service call
    // Replace this with actual HTTP request logic or service call
    return json_encode(array("login" => "successful", "message" => "Course created successfully"));
}

function doDBQuery($sql) {
    // database query
    return "result";  // Simplified return
}

?>
