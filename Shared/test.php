<?php

/*
----------------------------------------------------------
    Example on how to run this test from another file:
----------------------------------------------------------

include_once "../Shared/test.php";

$testData = array(
    'expected-output' => '{"debug":"NONE!","motd":"UNK"}',
    'service' => 'https://cms.webug.se/root/G2/students/c21alest/LenaSYS/DuggaSys/courseedservice.php',
    'service-data' => serialize(array( // Data that service needs to execute function
        'opt' => 'NEW',
        'username' => 'usr',
        'password' => 'pass',
    )),
    'filter-output' => serialize(array( // Filter what output to use in assert test
    'debug',
    'motd'
    )),
);

testHandler($testData, false); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON

*/

function testHandler($testData, $prettyPrint){

    //Output filter
    $filter = unserialize($testData['filter-output']);

    // Test 1 login
    $serviceData = unserialize($testData['service-data']);
    $test1Response = json_encode(loginTest($serviceData['username'], $serviceData['password'], $prettyPrint));
    $TestsReturnJSON['Test 1 (Login)'] = json_decode($test1Response, true);

    // Test 2 callService
    $test2Response = json_encode(callServiceTest($testData['service'], $testData['service-data'], $filter, $prettyPrint));
    $TestsReturnJSON['Test 2 (callService)'] = json_decode($test2Response, true);
    $serviceRespone = $TestsReturnJSON['Test 2 (callService)']['result'];

    // Test 3 assertEqual
    $test3Response = json_encode(assertEqualTest($testData['expected-output'], $serviceRespone, $prettyPrint));
    $TestsReturnJSON['Test 3 (assertEqual)'] = json_decode($test3Response, true);

    if(!($prettyPrint)){echo json_encode($TestsReturnJSON, true);}

}

// Test 1: login test
function loginTest($user, $pwd, $prettyPrint){

    // Session includes login functionality
    include_once "../Shared/sessions.php";

    if (login($user, $pwd, true)) {
        $loginTestResult = "passed";
    }
    else{
        $loginTestResult = "failed";
    }

    if ($prettyPrint) {
        echo "<h4> Test 1 (login): {$loginTestResult} </h4>";
        echo "<strong>username: </strong>{$user}";
        echo "<br>";
        echo "<strong>password: </strong>{$pwd}";
        echo "<br>";
        echo "<br>";
    }
    return array(
        'result:' => $loginTestResult,
        'username' => $user,
        'password' => $pwd
    );
}

// Test 2: call service test
function callServiceTest($service, $data, $filter, $prettyPrint){

    // Make POST request to service
    $curl = curl_init($service);
    curl_setopt($curl, CURLOPT_POSTFIELDS, unserialize($data));
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

    $curlResponse = curl_exec($curl);

    curl_close($curl);

    $curlResponseJSON = json_decode($curlResponse, true);

    // Only include JSON same as filter
    foreach($filter as $option){
        if ($option == "none") {
            $curlResponseJSONFiltered = $curlResponseJSON;
        }
        else{
            foreach($curlResponseJSON as $key => $value){
                if (in_array($key, $filter)) {
                    $curlResponseJSONFiltered[$key] = $value;
                }
            }
        }
    }

    if ($curl) {
        $callServiceTestResult = "passed";
    }
    else{
        $callServiceTestResult = "failed";
    }

    if ($prettyPrint) {
        echo "<h4> Test 2 (callService): {$callServiceTestResult} </h4>";
        echo "<strong>service: </strong>{$service}";
        echo "<br>";
        echo "<strong>sent data: </strong>".json_encode(unserialize($data),true);
        echo "<br>";
        echo "<strong>result: </strong>".json_encode($curlResponseJSONFiltered, true);
        echo "<br>";
        echo "<br>";
    }
    return array(
        'result' => $curlResponseJSONFiltered,
        'service' => $service,
        'data' => unserialize($data),
    );
}

// Test 3: assert equal test
function assertEqualTest($value1, $value2, $prettyPrint){

    // Expected value is JSON
    $value1 = json_decode($value1, true);

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
        echo "<h4> Test 3 (assertEqual): {$equalTestResult} </h4>";
        echo "<strong>value1: </strong>".json_encode($value1, true);
        echo "<br>";
        echo "<strong>value2: </strong>".json_encode($value2, true);
        echo "<br>";
        echo "<br>";
    }
    return array(
        'result' => $equalTestResult,
        'value1' => $value1,
        'value2' => $value2
    );
}

?>