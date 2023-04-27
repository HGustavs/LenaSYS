<?php

/*
----------------------------------------------------------
    Example on how to run this test from another file:
----------------------------------------------------------

include_once "../Shared/test.php";

$testData = array(
    'value1' => 'test',
    'value2' => 'test',
    'service' => 'https://cms.webug.se/root/G2/students/c21alest/LenaSYS/DuggaSys/courseedservice.php',
    'serviceData' => serialize(array( // Data that service needs to execute function
        'opt' => 'NEW',
        'username' => 'usr',
        'password' => 'pass',
    )),
    'test1Debug' => false, // If true more information of test will be displayed
    'test2Debug' => true,
    'test3Debug' => true,
);

testHandler($testData, false); // 2nd argument true = prettyprint (HTML) false = raw JSON, no debug mode is avalible when using prettyprint

*/

function testHandler($testData, $prettyPrint){

    // Test 1 assertEqual
    echo json_encode(assertEqualTest($testData['value1'], $testData['value2'], $testData['test1Debug'], $prettyPrint));

    // Test 2 login
    $serviceData = unserialize($testData['serviceData']);
    echo json_encode(loginTest($serviceData['username'], $serviceData['password'], $testData['test2Debug'], $prettyPrint));

    // Test 3 callService
    echo json_encode(callServiceTest($testData['service'], $testData['serviceData'], $testData['test3Debug'], $prettyPrint));

}

// Test 1: assert equal test
function assertEqualTest($value1, $value2, $debug, $prettyPrint){

    if (($value1 != null) && ($value2 != null)){
        $equalTest = assert($value1, $value2);
        if ($equalTest){
            $equalTestResult = "passed";
        }
        else{
            $equalTestResult = "failed";
        }
    }
    else{
        $equalTestResult = "failed with error: no valid values to compare";
    }

    if ($prettyPrint) {
        echo "<h4> Test 1 (assertEqual): {$equalTestResult} </h4>";
        echo "<strong>value1: </strong>{$value1}";
        echo "<br>";
        echo "<strong>value2: </strong>{$value2}";
        echo "<br>";
        echo "<br>";
    }
    else{
        // If debug true send back detailed info
        if ($debug == true) {
            return array(
                'Test 1 (assertEqual):' => $equalTestResult,
                'value1' => $value1,
                'value2' => $value2
            );
        }
        else{
            return array(
                'Test 1 (assertEqual):' => $equalTestResult,
            );
        }
    }

}

// Test 2: login test
function loginTest($user, $pwd, $debug, $prettyPrint){

    // Session includes login functionality
    include_once "../Shared/sessions.php";

    if (login($user, $pwd, true)) {
        $loginTestResult = "passed";
    }
    else{
        $loginTestResult = "failed";
    }

    if ($prettyPrint) {
        echo "<h4> Test 2 (login): {$loginTestResult} </h4>";
        echo "<strong>username: </strong>{$user}";
        echo "<br>";
        echo "<strong>password: </strong>{$pwd}";
        echo "<br>";
        echo "<br>";
    }
    else{
        // If debug true send back detailed info
        if ($debug == true) {
            return array(
                'Test 2 (login):' => $loginTestResult,
                'username' => $user,
                'password' => $pwd
            );
        }
        else{
            return array(
                'Test 2 (login):' => $loginTestResult,
            );
        }
    }
}

// Test 3: call service test
function callServiceTest($service, $data, $debug, $prettyPrint){

    // Make POST request to service
    $curl = curl_init($service);
    curl_setopt($curl, CURLOPT_POSTFIELDS, unserialize($data));
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

    $curlResponse = curl_exec($curl);

    curl_close($curl);

    if ($curl) {
        $callServiceTestResult = "passed";
    }
    else{
        $callServiceTestResult = "failed";
    }

    $curlResponseJSON = json_decode($curlResponse, true);


    if ($prettyPrint) {
        echo "<h4> Test 3 (callService): {$callServiceTestResult} </h4>";
        echo "<strong>service: </strong>{$service}";
        echo "<br>";
        echo "<strong>data: </strong>{$sendServiceData}";
        echo "<br>";
        echo "<strong>debug: </strong>{$curlResponseJSON['debug']}";
        echo "<br>";
        echo "<br>";
    }
    else{
        // If debug true send back detailed info
        if ($debug == true) {
            return array(
                'Test 3 (callService):' => $curlResponse,
                'service' => $service,
                'data' => $sendServiceData,
            );
        }
        else{
            return array(
                'Test 3 (callService):' => $callServiceTestResult,
                'debug' => $curlResponseJSON['debug']
            );
        }
    }
}

?>