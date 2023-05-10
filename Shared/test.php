<?php

/*
----------------------------------------------------------
    Example on how to run this test from another file:
----------------------------------------------------------

<?php

include "../Shared/test.php";

$testsData = array(
    'create course test' => array(
        'expected-output' => '{"debug":"NONE!","motd":"UNK"}',
        'query-before-test' => "INSERT INTO course (coursecode,coursename,visibility,creator, hp) VALUES('IT401G','MyAPICourse',0,101, 7.5)",
        'query-after-test' => "DELETE FROM course WHERE coursecode = 'IT478G' AND coursename = 'APICreateCourseTestQuery'",
        'service' => 'https://cms.webug.se/root/G2/students/c21alest/LenaSYS/DuggaSys/courseedservice.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'opt' => 'NEW',
            'username' => 'usr',
            'password' => 'pass',
            'coursecode' => 'IT466G',
            'coursename' => 'TestCourseFromAPI4',
            'uid' => '101'
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'debug',
            'readonly'
        )),
    ),
    'create course test 2' => array(
        'expected-output' => '{"debug":"NONE!","motd":"UNK"}',
        'service' => 'https://cms.webug.se/root/G2/students/c21alest/LenaSYS/DuggaSys/courseedservice.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'opt' => 'NEW',
            'username' => 'usr',
            'password' => 'pass',
            'coursecode' => 'IT466G',
            'coursename' => 'TestCourseFromAPI5',
            'uid' => '101'
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'none'
        )),
    ),
);

testHandler($testsData, false); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON

*/

function doDBQuery($query){
    $result = "Error executing query";
    // DB credentials
    include_once("../../coursesyspw.php");

    // Connect to DB
    try {
        $pdo = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME.';charset=utf8',DB_USER,DB_PASSWORD);
        if(!defined("MYSQL_VERSION")) {
            define("MYSQL_VERSION",$pdo->query('select version()')->fetchColumn());
        }
    } catch (PDOException $e) {
        $result = "Failed to get DB handle: " . $e->getMessage() . "</br>";
        exit;
    }

    // DB query to execute
    if ($query != null) {
        $query = $pdo->prepare($query);

        if(!$query->execute()) {
            $error=$query->errorInfo();
            $result = "Error updating entries".$error[2];
        }
        else{
            $result = "Succesfully executed query";
        }
    }
    return $result;
}

function testHandler($testsData, $prettyPrint){

    $i = 0;

    foreach($testsData as $testData){

        // Name of test
        $name = key($testsData);

        if ($prettyPrint) {
            if ($i > 0) {
                echo "<hr>";
            }
            echo "<h2>{$name} </h2>";
        }

        // If query to execute before start
        if ($testData['query-before-test'] != null) {
            $TestsReturnJSON['query-before-test'] = doDBQuery($testData['query-before-test']);
        }
        
        //Output filter
        $filter = unserialize($testData['filter-output']);

        if ($prettyPrint) {
            echo "<h2>{$testData['name']} </h2>";
        }

        // Test 1 login
        $serviceData = unserialize($testData['service-data']);
        $test1Response = json_encode(loginTest($serviceData['username'], $serviceData['password'], $prettyPrint));
        $TestsReturnJSON['Test 1 (Login)'] = json_decode($test1Response, true);

        // Test 2 callService
        $test2Response = json_encode(callServiceTest($testData['service'], $testData['service-data'], $filter, $prettyPrint));
        $TestsReturnJSON['Test 2 (callService)'] = json_decode($test2Response, true);
        $serviceRespone = $TestsReturnJSON['Test 2 (callService)']['respons'];

        // Test 3 assertEqual
        $test3Response = json_encode(assertEqualTest($testData['expected-output'], $serviceRespone, $prettyPrint));
        $TestsReturnJSON['Test 3 (assertEqual)'] = json_decode($test3Response, true);

        // If query to execute after test
        if ($testData['query-after-test'] != null) {
            $TestsReturnJSON['query-after-test'] = doDBQuery($testData['query-after-test']);
        }

        $TestsReturnJSONWithName[$name] = $TestsReturnJSON;

        next($testsData);
        $i++;
    }

    $TestsReturnJSONFinal = $TestsReturnJSONWithName;

    if(!($prettyPrint)){echo json_encode($TestsReturnJSONFinal, true);}

}

// Test 1: login test
function loginTest($user, $pwd, $prettyPrint){

    // Session includes login functionality
    include_once "sessions.php";

    if (login($user, $pwd, true)) {
        $loginTestResult = "passed";
    }
    else{
        $loginTestResult = "failed";
    }

    if ($prettyPrint) {
        echo "<h3> Test 1 (login): {$loginTestResult} </h3>";
        echo "<strong>username: </strong>{$user}";
        echo "<br>";
        echo "<strong>password: </strong>{$pwd}";
        echo "<br>";
        echo "<br>";
    }
    return array(
        'result' => $loginTestResult,
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
        echo "<h3> Test 2 (callService): {$callServiceTestResult} </h3>";
        echo "<strong>service: </strong>{$service}";
        echo "<br>";
        echo "<strong>sent data: </strong>".json_encode(unserialize($data),true);
        echo "<br>";
        echo "<strong>result: </strong>".json_encode($curlResponseJSONFiltered, true);
        echo "<br>";
        echo "<br>";
    }
    return array(
        'result' => $callServiceTestResult,
        'respons' => $curlResponseJSONFiltered,
        'service' => $service,
        'data' => unserialize($data),
    );
}

// Test 3: assert equal test
function assertEqualTest($valueExpected, $valueOuput, $prettyPrint){

    // Expected value is JSON
    $valueExpected = json_decode($valueExpected, true);

    if (($valueExpected != null) && ($valueOuput != null)){
        $equalTest = ($valueExpected == $valueOuput);
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
        echo "<h3> Test 3 (assertEqual): {$equalTestResult} </h3>";
        echo "<strong>value expected: </strong>".json_encode($valueExpected, true);
        echo "<br>";
        echo "<strong>value output: </strong>".json_encode($valueOuput, true);
        echo "<br>";
        echo "<br>";
    }
    return array(
        'result' => $equalTestResult,
        'value-expected' => $valueExpected,
        'value-output' => $valueOuput
    );
}

?>