<?php

include_once $_SERVER['DOCUMENT_ROOT'] . '/LenaSys/Shared/basic.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/LenaSys/Shared/sessions.php';


// Connect to database and start session.
pdoConnect();
session_start();

$url = 'http://localhost/LenaSYS/DuggaSys/microservices/courseedService/createNewCourse_ms.php';

$opt = 'NEW';
$username = 'brom';
$password = 'password';
$coursename = 'Test Course';
$coursecode = 'TE002S';
$courseGitURL = 'https://github.com/LenaSYS/Webbprogrammering-Examples';
$AUtoken = 1;

$data = array(
    'opt' => $opt,
    'username' => $username,
    'password' => $password,
    'coursename' => $coursename,
    'coursecode' => $coursecode,
    'courseGitURL' => $courseGitURL,
    'AUtoken' => $AUtoken
);

//initialize cURL
$ch = curl_init($url);

//set cURL options
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);

//execute request
$response = curl_exec($ch);

//error handling
if (curl_errno($ch)) {
    echo 'Error: ' . curl_error($ch);
}

// Close cURL
curl_close($ch);

//decode response
$response = json_decode($response, true);

//check if course is found in course list
$courseFound = false;
$testPassed = false;
$connectedURL = null;
foreach ($response['entries'] as $entry) {
    if ($entry['coursename'] === $coursename && $entry['coursecode'] === $coursecode) {
        $courseFound = true;
        break;
    }
}

if( $courseFound ) {
    $query_1 = $pdo->prepare("SELECT courseGitURL FROM course where coursecode = :coursecode");
    $query_1->bindParam(':coursecode', $coursecode);
    if (!$query_1->execute()) {
        $error = $query_1->errorInfo();
        $debug = "Error reading courses\n" . $error[2];
    }
    else{
        $result = $query_1->fetchAll(PDO::FETCH_ASSOC);
        // Check if the result matches the expected course name
        foreach ($result as $entry) {
            if (isset($entry['courseGitURL']) && $entry['courseGitURL'] === $courseGitURL) {
                $testPassed = true;
                $connectedURL = $entry['courseGitURL'];
                break; // Exit the loop early if a match is found
            }
        }
    }
}

if( $courseFound ){
    echo "Course found in response." . "<br/>";
}
else{
    echo "Course not found in response or already exists in database." . "<br/>";
}

//output if test passed or failed
if ($testPassed) {
    echo "Test passed: Course has correct giturl: " . $connectedURL  . "<br/>";
} else {
    echo "Test not passed: Course does not have correct giturl: " . "<br/>";
}

//delete test case from database
$query_2 = $pdo->prepare("DELETE FROM course WHERE coursecode = :coursecode");

//binds the parameters
$query_2->bindParam(':coursecode', $coursecode);

//execute the query and handle errors
if(!$query_2->execute()) {
    $error=$query_2->errorInfo();
    $debug="Error updating entries\n".$error[2];
}

?>
