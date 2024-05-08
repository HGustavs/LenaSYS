<?php
// Set the default timezone
date_default_timezone_set("Europe/Stockholm");

// Include necessary files
include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";
include_once "../../../../coursesyspw.php";
include_once "../sharedMicroservices/retrieveUsername_ms.php";
include_once "./retrieveCourseedService_ms.php";

// Connect to the database and start the session
pdoConnect();
session_start();

// Initialize variables
$opt = getOP('opt');
$cid = getOP('cid');
$coursename = getOP('coursename');
$visibility = getOP('visib');
$coursecode = getOP('coursecode');
$courseGitURL = getOP('courseGitURL');

// Get user identification
$userid = isset($_SESSION['uid']) ? $_SESSION['uid'] : "UNK";
$username = retrieveUsername($pdo);

$debug="NONE!";

$ha = null;
$isSuperUserVar = false;

// Login is checked
if (checklogin()) {
	if (isset($_SESSION['uid'])) {
		$userid = $_SESSION['uid'];
	} else {
		$userid = "UNK";
	}
	$isSuperUserVar = isSuperUser($userid);
	$ha = $isSuperUserVar;
}

if ($ha){
    // Update course information
    $updateSuccessful = updateCourse($cid, $coursename, $visibility, $coursecode, $courseGitURL);
    // Handle errors if update fails
    if (!$updateSuccessful) {
        $debug = "Error updating course information.";
    }     
    $visibilityName = getVisibilityName($visibility);
    $description = "$coursename $coursecode $visibilityName";
    logUserEvent($userid, $username, "EditCourse", $description);
}

echo json_encode(retrieveCourseedService($pdo, $ha, $debug, null, $isSuperUserVar));


// Function to update course information in the database
function updateCourse($cid, $coursename, $visibility, $coursecode, $courseGitURL) {
    global $pdo;
    $query = $pdo->prepare("UPDATE course SET coursename=:coursename, visibility=:visibility, coursecode=:coursecode, courseGitURL=:courseGitURL WHERE cid=:cid");
    $query->bindParam(':cid', $cid);
    $query->bindParam(':coursename', $coursename);
    $query->bindParam(':visibility', $visibility);
    $query->bindParam(':coursecode', $coursecode);
    $query->bindParam(':courseGitURL', $courseGitURL);
    return $query->execute();
}

// Function to get the visibility name
function getVisibilityName($visibility) {
    switch ($visibility) {
        case 0:
            return "Hidden";
        case 1:
            return "Public";
        case 2:
            return "Login";
        case 3:
            return "Deleted";
        default:
            return "Unknown";
    }
}

