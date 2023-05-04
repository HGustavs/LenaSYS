<?php

/*
----------------------------------------------------------
    Example on how to run this test from another file:
----------------------------------------------------------

include_once "../Shared/test.php";

$testData = array(
    'expected-output' => 'test',
    'service' => 'https://cms.webug.se/root/G2/students/c21alest/LenaSYS/DuggaSys/courseedservice.php',
    'service-data' => serialize(array( // Data that service needs to execute function
        'opt' => 'NEW',
        'username' => 'usr',
        'password' => 'pass',
    )),
    'test-1-debug' => false, // If true more information of test will be displayed
    'test-2-debug' => true,
    'test-3-debug' => true,
);

testHandler($testData, false); // 2nd argument true = prettyprint (HTML) false = raw JSON, no debug mode is avalible when using prettyprint

*/

function testHandler($testData, $prettyPrint){

    // Test 1 login
    $serviceData = unserialize($testData['service-data']);
    $test1Response = json_encode(loginTest($serviceData['username'], $serviceData['password'], $testData['test-1-debug'], $prettyPrint));
    $TestsReturnJSON['Test 1 (Login)'] = json_decode($test1Response, true);

    // Test 2 callService
    $test2Response = json_encode(callServiceTest($testData['service'], $testData['service-data'], $testData['test-2-debug'], $prettyPrint));
    $TestsReturnJSON['Test 2 (callService)'] = json_decode($test2Response, true);
    $serviceRespone = $TestsReturnJSON['Test 2 (callService)']['result']['motd'];

    // Test 3 assertEqual
    $test3Response = json_encode(assertEqualTest($testData['expected-output'], $serviceRespone, $testData['test-3-debug'], $prettyPrint));
    $TestsReturnJSON['Test 3 (assertEqual)'] = json_decode($test3Response, true);

    echo json_encode($TestsReturnJSON, true);

}

// Test 1: login test
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
                'result:' => $loginTestResult,
                'username' => $user,
                'password' => $pwd
            );
        }
        else{
            return array(
                'result' => $loginTestResult,
            );
        }
    }
}

// Test 2: call service test
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
                'result' => $curlResponseJSON,
                'service' => $service,
                'data' => $sendServiceData,
            );
        }
        else{
            return array(
                'result' => $callServiceTestResult,
                'debug' => $curlResponseJSON['debug']
            );
        }
    }
}

// Test 3: assert equal test
function assertEqualTest($value1, $value2, $debug, $prettyPrint){

    if (($value1 != null) && ($value2 != null)){
        $equalTest = ($value1 == $value2);
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
                'result' => $equalTestResult,
                'value1' => $value1,
                'value2' => $value2
            );
        }
        else{
            return array(
                'result' => $equalTestResult,
            );
        }
    }

}

?>