<?php

/*
----------------------------------------------------------
    Example on how to run this test from another file:
----------------------------------------------------------

<?php
 
include "../../Shared/test.php";
 
$testsData = array(
    'create course test' => array(
        'expected-output' => '{"debug":"NONE!","motd":"UNK"}',
        'query-before-test-1' => "SELECT coursename FROM course WHERE coursecode = 'DV12G' ORDER BY coursecode DESC LIMIT 1",
        'variables-query-before-test-2' => "blop",
        'query-before-test-2' => "INSERT INTO course (coursecode,coursename,visibility,creator, hp) VALUES('IT401G','MyAPICourse',0,101, 7.5)",
        'query-after-test-1' => "DELETE FROM course WHERE coursecode = 'IT478G' AND coursename = 'APICreateCourseTestQuery'",
        'query-after-test-2' => "DELETE FROM course WHERE coursecode = 'IT478G' AND coursename = 'APICreateCourseTestQuery'",
        'service' => 'https://cms.webug.se/root/G2/students/c21alest/LenaSYS/DuggaSys/courseedservice.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'opt' => 'NEW',
            'username' => 'usr',
            'password' => 'pass',
            'coursecode' => 'IT466G',
            'coursename' => 'TestCourseFromAPI4',
            'uid' => '101',
        'blop' => '!query-before-test-1! [0][coursename]'
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

function doDBQuery($query, $data, $testsData, $testname){
    $queryString = $query;
    if(!$testname == "UNK"){
        echo $testsData['variables-' . $testname];
        $variables = $testsData['variables-' . $testname];
        $variablesArray = explode(", ", $variables);
    }
    $result = "Error executing query";
    // DB credentials
    include_once("../../../coursesyspw.php");

    $pdo = null;
    if ($pdo == null) {
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
    }

    // DB query to execute
    if ($query != null) {
        $query = $pdo->prepare($query);
        if (strpos($queryString, '?') !== false) {
            for ($i = 0; $i < count($variablesArray); $i++) {
                $variableToUse = $data[$variablesArray[$i]];
                $query->bindParam($i+1, $variableToUse);
            }
        }

        if(!$query->execute()) {
            $error=$query->errorInfo();
            $result = "Error updating entries".$error[2];
        }
        else{
            $error=$query->errorInfo();
            $result = "Succesfully executed query but no return data".$error[2];
            $resultQuery = $query->fetchAll();
            if ($resultQuery != null) {
                $result = $resultQuery;
            }
        }
    }

    return $result;
   
}

function testHandler($testsData, $prettyPrint){

    $i = 0;

    foreach($testsData as $testData){

        $data = unserialize($testData['service-data']);

        // Name of test
        $name = key($testsData);

        if ($prettyPrint) {
            if ($i > 0) {
                echo "<hr>";
            }
            echo "<h2>{$name} </h2>";
        }

        // If query to execute before start
        foreach ($testData as $option => $value) {
            // if query-before-start
            if (strpos($option, 'query-before-test') === 0) {

                $QueryReturnJSONbefore = array();
                $QueryReturnJSONbefore[$option] = doDBQuery($value, $data, $testData, $option);
                // If service data !query-test! replace with actual query output
                foreach($data as $sInput => $sValue){
                    foreach($QueryReturnJSONbefore as $oneQuery => $queryValue){
                        // Check if service data uses query output (!*******!)
                        $queryName = substr(strstr($sValue, "<!"), 2);
                        $queryName = substr($queryName, 0, strpos($queryName, "!>"));
                        $queryPath = substr(strstr($sValue, "<*"), 2);
                        $queryPath = substr($queryPath, 0, strpos($queryPath, "*>"));
                        if ($queryName == $oneQuery) {
                            if ($queryPath != null) {
                                eval('$queryValue = $queryValue' . $queryPath . ';');
                                $data[$sInput] = $queryValue;
                            }
                            else{
                                $data[$sInput] = $queryValue;
                            }
                        }
                    }
                }
           }
        }

        $TestsReturnJSON['querys-before-test'] = $QueryReturnJSONbefore;
        
        // Output filter
        $filter = unserialize($testData['filter-output']);

        if (!(strpos($testData['service'], "/"))) {
            echo $testData['service'];
            $dirname = dirname(dirname(__FILE__));
            $urlpath = strstr($dirname, '/root');
            $serviceURL = $dirname.$urlpath."/DuggaSys/".$testData['service'];
        }
        else{
            $serviceURL = $testData['service'];
        }

        // Test 1 login
        $serviceData = unserialize($testData['service-data']);
        $test1Response = json_encode(loginTest($serviceData['username'], $serviceData['password'], $prettyPrint));
        $TestsReturnJSON['Test 1 (Login)'] = json_decode($test1Response, true);

        // Test 2 callService
        $test2Response = json_encode(callServiceTest($serviceURL, $testData['service-data'], $filter, $QueryReturnJSONbefore, $prettyPrint));
        $TestsReturnJSON['Test 2 (callService)'] = json_decode($test2Response, true);
        $serviceRespone = $TestsReturnJSON['Test 2 (callService)']['respons'];

        // Test 3 assertEqual
        $test3Response = json_encode(assertEqualTest($testData['expected-output'], $serviceRespone, $prettyPrint));
        $TestsReturnJSON['Test 3 (assertEqual)'] = json_decode($test3Response, true);

        // If query to execute after test
        foreach ($testData as $option => $value) {
            // if query-before-start-
            if (strpos($option, 'query-after-test') === 0) {
               $QueryReturnJSON[$option] = doDBQuery($value, "UNK", "UNK", "UNK");
            }
        }

        $TestsReturnJSON['querys-after-test'] = $QueryReturnJSON;

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
    include_once "../../Shared/sessions.php";

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
function callServiceTest($service, $data, $filter, $QueryReturnJSON, $prettyPrint){

    $data = unserialize($data);

    $queryReturnPathAndDataJSON = array();
    // If service data !query-test! replace with actual query output
    if ((is_array($data))) {
        foreach($data as $sInput => $sValue){
            if ((is_array($QueryReturnJSON))) {
                foreach($QueryReturnJSON as $oneQuery => $queryValue){
                    // Check if service data uses query output (!*******!)
                    $queryName = substr(strstr($sValue, "<!"), 2);
                    $queryName = substr($queryName, 0, strpos($queryName, "!>"));
                    $queryPath = substr(strstr($sValue, "<*"), 2);
                    $queryPath = substr($queryPath, 0, strpos($queryPath, "*>"));
                    if ($queryName == $oneQuery) {
                        if ($queryPath != null) {
                            eval('$queryValue = $queryValue' . $queryPath . ';');
                            $queryReturnPathAndDataJSON[$queryName . $queryPath] = $queryValue;
                            $data[$sInput] = $queryValue;
                        }
                        else{
                            $data[$sInput] = $queryValue;
                        }
                    }
                }
            }
        }
    }

    // Make POST request to service
    $curl = curl_init($service);
    curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

    $curlResponse = curl_exec($curl);

    if(curl_errno($curl)) {
        $error_message = curl_error($curl);
        echo $error_message;
    }

    curl_close($curl);

    $curlResponseJSON = json_decode($curlResponse, true);

    // Only include JSON same as filter
    foreach($filter as $option => $optionArray){
        // If none do not filter
        if ($optionArray === "none") {
            $curlResponseJSONFiltered = $curlResponseJSON;
        }
        else{
            foreach($curlResponseJSON as $key => $value){
                // Check if respons key exists in filter
                if (in_array($key, $filter)) {
                    // Not to store if array, handled further down
                    if (!(is_array($optionArray))) {
                        $curlResponseJSONFiltered[$key] = $value; 
                    }
                }
                // Check what to save in array
                if (is_array($curlResponseJSON[$key])){
                    foreach($curlResponseJSON[$key] as $inside => $insideValue){
                        if ((is_array($insideValue))) {
                            foreach($insideValue as $inside2 => $insideValue2){
                                if (is_array($optionArray)){
                                    foreach($optionArray as $insideFilter){
                                        if ($inside2 == $insideFilter) {
                                            $curlResponseJSONFiltered[$key][$inside][$inside2] = $insideValue2;
                                        }
                                        if (is_array($insideValue2)){
                                            foreach($insideValue2 as $inside3 => $insideValue3){
                                                if ((is_array($insideFilter))) {
                                                    foreach($insideFilter as $insideFilter2){
                                                        if ($inside3 == $insideFilter2) {
                                                            $curlResponseJSONFiltered[$key][$inside][$inside2][$inside3] = $insideValue3;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
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
        echo "<strong>sent data: </strong>".json_encode($data,true);
        echo "<br>";
        echo "<strong>respons (no filter): </strong>".json_encode($curlResponseJSON, true);
        echo "<br>";
        echo "<strong>respons (filtered): </strong>".json_encode($curlResponseJSONFiltered, true);
        echo "<br>";
        echo "<br>";
    }
    return array(
        'result' => $callServiceTestResult,
        'respons' => $curlResponseJSONFiltered,
        'service' => $service,
        'sent-data' => $data,
        'query-return' => $queryReturnPathAndDataJSON
    );
}

// Test 3: assert equal test
function assertEqualTest($valueExpected, $valueOuput, $prettyPrint){

    // Expected value is JSON
    $valueExpected = json_decode($valueExpected, true);

    // Handle bad unicode in service files
    //$valueOuput = json_encode($valueExpected, true, JSON_UNESCAPED_UNICODE);
    //$valueOuput = json_decode($valueOuput, true);

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


// Version 1.5 (Increment when new change in code)
?>
