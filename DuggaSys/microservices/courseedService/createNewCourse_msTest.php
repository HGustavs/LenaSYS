<?php
// Include necessary files and set timezone
date_default_timezone_set("Europe/Stockholm");
include('../shared_microservices/getUid_ms.php');
pdoConnect(); // Connect to the database

// Start the session
session_start();

// Retrieve parameters from the request
$opt = getOP('opt');
$coursename = getOP('coursename');
$coursecode = getOP('coursecode');
$courseGitURL = getOP('courseGitURL');

// Check if the user is logged in
if (checklogin()) {
    // Get the user ID
    $userid = isset($_SESSION['uid']) ? $_SESSION['uid'] : "UNK";

    // Check if the user is a superuser
    if (isSuperUser(getUid())) {
        // Prepare the query to insert a new course into the database
        $query = $pdo->prepare("INSERT INTO course (coursecode, coursename, visibility, creator, hp, courseGitURL) 
                                VALUES (:coursecode, :coursename, 0, :userid, 7.5, :courseGitURL)");

        // Bind parameters and execute the query
        $query->bindParam(':userid', $userid);
        $query->bindParam(':coursecode', $coursecode);
        $query->bindParam(':coursename', $coursename);
        $query->bindParam(':courseGitURL', $courseGitURL);

        if (!$query->execute()) {
            // Handle query execution errors
            $error = $query->errorInfo();
            $debug = "Error inserting new course: " . $error[2];
            echo json_encode(array('error' => $debug));
            return;
        }

        // If execution succeeds, return success response
        echo json_encode(array('code' => $coursecode, 'name' => $coursename));
        return;
    } else {
        // If the user is not a superuser, return unauthorized access error
        echo json_encode(array('error' => 'Unauthorized access'));
        return;
    }
} else {
    // If the user is not logged in, return authentication error
    echo json_encode(array('error' => 'Authentication required'));
    return;
}
?>
