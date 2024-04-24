<?php
// Set the default timezone
date_default_timezone_set("Europe/Stockholm");

// Include necessary files
include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";
include_once "../../../../coursesyspw.php";

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
$username = getUsername($userid);

// Update course information
$updateSuccessful = updateCourse($cid, $coursename, $visibility, $coursecode, $courseGitURL);

// Handle errors if update fails
if (!$updateSuccessful) {
    $error = "Error updating course information.";
    // Log the error
    logError($error);
} else {
    // Log the successful course update
    logCourseEditEvent($userid, $username, $coursename, $coursecode, $visibility);
}

// Function to get the username based on userid
function getUsername($userid) {
    global $pdo;
    $query = $pdo->prepare("SELECT username FROM user WHERE uid = :uid");
    $query->bindParam(':uid', $userid);
    $query->execute();
    $row = $query->fetch(PDO::FETCH_ASSOC);
    return ($row) ? $row['username'] : "Guest";
}

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

// Function to log successful course edit event
function logCourseEditEvent($userid, $username, $coursename, $coursecode, $visibility) {
    $visibilityName = getVisibilityName($visibility);
    $description = "$coursename $coursecode $visibilityName";
    logUserEvent($userid, $username, "EditCourse", $description);
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

// log errors
function logError($error) {
    // Log the error message
    error_log($error);
    // Additional logging actions can be added if required
}
?>
