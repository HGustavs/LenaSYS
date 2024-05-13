<?php

// This microservice can be called to simply get the contents return by retrieveCourseedService_ms.php

date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../Shared/basic.php";
include_once "../Shared/sessions.php";
include_once "./retrieveCourseedService_ms.php";
include_once "../sharedMicroservices/getUid_ms.php";


// Connect to database and start session
pdoConnect();
session_start();
 
$opt = getOP('opt');
$cid = getOP('cid');
$coursename = getOP('coursename');
$visibility = getOP('visib');
$activevers = getOP('activevers');
$activeedvers = getOP('activeedvers');
$versid = getOP('versid');
$versname = getOP('versname');
$coursenamealt = getOP('coursenamealt');
$coursecode = getOP('coursecode');
$copycourse = getOP('copycourse');
$startdate = getOP('startdate');
$enddate = getOP('enddate');
$makeactive = getOP('makeactive');
$motd = getOP('motd');
$readonly = getOP('readonly');
$courseGitURL = getOP('courseGitURL'); // for github url 
$LastCourseCreated = array();

$userid=getUid();
$ha = null;
$isSuperUserVar=false;
$debug = "NONE!";
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

echo json_encode(retrieveCourseedService($pdo, $ha, $debug, $LastCourseCreated, $isSuperUserVar));

