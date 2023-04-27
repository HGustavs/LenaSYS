<?php

function testHandler($testData){

    // Test 1 assertEqual
    echo json_encode(assertEqualTest($testData['value1'], $testData['value2'], $testData['test1Debug']));

    // Test 2 login
    echo json_encode(loginTest($testData['user'], $testData['pwd'], $testData['test2Debug']));

    // Test 3 callService
    echo json_encode(callServiceTest($testData['service'], $testData['serviceData'], $testData['test3Debug']));

}

// Test 1: assert equal test
function assertEqualTest($value1, $value2, $debug){

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
        $equalTestResult = "failed no valid values";
    }

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

// Test 2: login test
function loginTest($user, $pwd, $debug){

    // Session includes login functionality
    include_once "../Shared/sessions.php";

    if (login($user, $pwd, true)) {
        $loginTestResult = "passed";
    }
    else{
        $loginTestResult = "failed";
    }

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

// Test 3: call service test
function callServiceTest($service, $data, $debug){

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

    // If debug true send back detailed info
    if ($debug == true) {
        return array(
            'Test 3 (callService):' => $curlResponse,
            'service' => $service,
            'data' => $sendServiceData
        );
    }
    else{
        return array(
            'Test 3 (callService):' => $callServiceTestResult,
        );
    }
}

?>