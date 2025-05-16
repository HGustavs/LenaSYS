<?php

date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "../curlService.php";
include_once "../sharedMicroservices/getUid_ms.php";


// Connect to database and start session.
pdoConnect();
session_start();

$opt = getOP('opt');
$cid=getOP('cid');
$coursename = getOP('coursename');
$visibility = getOP('visib');
$coursecode = getOP('coursecode');
$courseGitURL = getOP('courseGitURL');
$userid = getUid();

$ha = null;
$isSuperUserVar = false;
$debug = "NONE!";

// Login is checked
if (checklogin()) {
	$isSuperUserVar = isSuperUser($userid);
	$ha = $isSuperUserVar;
}

if ($ha) {

    if (strcmp($opt, "UPDATE") === 0) {
	$query = $pdo->prepare("UPDATE course SET coursename=:coursename, visibility=:visibility, coursecode=:coursecode, courseGitURL=:courseGitURL WHERE cid=:cid;");
	$query->bindParam(':cid', $cid);
	$query->bindParam(':coursename', $coursename);
	$query->bindParam(':visibility', $visibility);
	$query->bindParam(':coursecode', $coursecode);
	$query->bindParam(':courseGitURL', $courseGitURL);

	if (!$query->execute()) {
	    $error = $query->errorInfo();
	    $debug = "Error updating entries\n" . $error[2];
	}

	// Belongs to Logging 
	if ($visibility == 0) {
	    $visibilityName = "Hidden";
	} else if ($visibility == 1) {
	    $visibilityName = "Public";
	} else if ($visibility == 2) {
	    $visibilityName = "Login";
	} else if ($visibility == 3) {
	    $visibilityName = "Deleted";
	}

    }
    // Logging for editing of course
	$description = $coursename . " " . $coursecode . " " . $visibilityName . " " . $courseGitURL;

	$data = callMicroserviceGET("sharedMicroservices/retrieveUsername_ms.php");
	$username = $data['username'] ?? 'unknown';
	
	logUserEvent($userid, $username, EventTypes::EditCourse, $description);
	

}

$dataToSend = [
	'ha' => $ha,
	'debug' => $debug,
	'LastCourseCreated' => null,
	'isSuperUserVar' => $isSuperUserVar
];

echo json_encode(callMicroservicePOST("courseedService/retrieveCourseedService_ms.php", $dataToSend, true));
