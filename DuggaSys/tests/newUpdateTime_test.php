<?php
include "../../Shared/test.php";   // Include the test file where this is sent to


function getCurrentTime() {
    return date('Y-m-d H:i:s');
}

$currentTime = getCurrentTime();
$currentTimestamp = strtotime($currentTime);

$testsData = array(
    //TEST #1
    //Update course update time
    'Update-course-update-time' => array(  
        'expected-output'   => json_encode(array("entries" => array(array("cid" => "1885", "updated" => $currentTime)))),
        //Pre-values
        'query-before-test-1' => "UPDATE course SET updated = '2000-01-01 00:00:00' WHERE cid = 1885;",
        'query-after-test-1' => "SELECT updated FROM course WHERE cid = 1885;",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/gitCommitService/newUpdateTime_ms.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',
                'courseid' => '1885',
                'currentTime' => $currentTimestamp,
            )),
        'filter-output' => serialize(array(
                // Filter what output to use in assert test
                'entries' => array(
                    'cid',
                    'updated'
                ),
            )),
        ),
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON

// Function to verify the database update
function verifyDatabaseUpdate($pdo, $cid, $expectedTime) {
    $query = $pdo->prepare('SELECT updated FROM course WHERE cid = :cid');
    $query->bindParam(':cid', $cid);
    $query->execute();
    $result = $query->fetch(PDO::FETCH_ASSOC);
    $actualTime = $result['updated'];
    if ($actualTime == $expectedTime) {
        return true;
    } else {
        throw new Exception("Expected updated time to be $expectedTime, but got $actualTime");
    }
}

try {
    // Initialize PDO connection (adjust with your database credentials)
    $pdo = new PDO('mysql:host=localhost;dbname=yourdbname', 'brom', 'password');
    
    // Run the service call
    $curlhandle = curl_init('http://localhost/LenaSYS/DuggaSys/microservices/gitCommitService/newUpdateTime_ms.php');
    curl_setopt($curlhandle, CURLOPT_POST, 1);
    curl_setopt($curlhandle, CURLOPT_POSTFIELDS, json_encode(array(
        'username' => 'brom',
        'password' => 'password',
        'courseid' => '1885',
        'currentTime' => $currentTimestamp
    )));
    curl_setopt($curlhandle, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($curlhandle);
    curl_close($curlhandle);
    
    // Verify the database update
    verifyDatabaseUpdate($pdo, 1885, $currentTime);
    echo "Database update verified successfully.";
} catch (Exception $e) {
    echo "Test failed: " . $e->getMessage();
}
?>