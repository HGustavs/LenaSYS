<?php
//---------------------------------------------------------------------------------------------------------------
// The microservice createCourseVersion_ms.php creates a new version of an existing course
// by inserting a new row into the vers table
//---------------------------------------------------------------------------------------------------------------

date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";
include_once "../sharedMicroservices/getUid_ms.php";
include_once "../sharedMicroservices/retrieveUsername_ms.php";
include_once "./retrieveCourseedService_ms.php";

// Connect to database and start session.
pdoConnect();
session_start();

$opt=getOP('opt');
$cid=getOP('cid');
$coursecode=getOP('coursecode');
$coursename=getOP('coursename');
$coursenamealt=getOP('coursenamealt');
$versname=getOP('versname');
$versid=getOP('versid');
$motd=getOP('motd');
$startdate = getOP('startdate');
$enddate = getOP('enddate');
$makeactive = getOP('makeactive');
$debug = "NONE!";
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

if($ha) {
  $query = $pdo->prepare("INSERT INTO vers(cid,coursecode,vers,versname,coursename,coursenamealt,startdate,enddate,motd) values(:cid,:coursecode,:vers,:versname,:coursename,:coursenamealt,:startdate,:enddate,:motd);");

	$query->bindParam(':cid', $cid);
	$query->bindParam(':coursecode', $coursecode);
	$query->bindParam(':vers', $versid);
	$query->bindParam(':versname', $versname);
	$query->bindParam(':coursename', $coursename);
	$query->bindParam(':coursenamealt', $coursenamealt);
  $query->bindParam(':motd', $motd);

  // if start and end dates are null, insert mysql null value into database
	if($startdate=="null") {
		$query->bindValue(':startdate', null,PDO::PARAM_INT);
	} else {
		$query->bindParam(':startdate', $startdate);
	}
	
	if($enddate=="null") {
		$query->bindValue(':enddate', null,PDO::PARAM_INT);
	} else {
		$query->bindParam(':enddate', $enddate);
	}

	if(!$query->execute()) {
		$error=$query->errorInfo();
		$debug="Error inserting entries\n".$error[2];
	} 

	// if specified, sets the course as active
	if($makeactive==3){
		$query = $pdo->prepare("UPDATE course SET activeversion=:vers WHERE cid=:cid");
		$query->bindParam(':cid', $cid);
		$query->bindParam(':vers', $versid);
		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error updating entries\n".$error[2];
		}	
	}

	// Logging for create a fresh course version
	$description=$cid." ".$versid;
	logUserEvent($userid, retrieveUsername($pdo), EventTypes::AddCourseVers, $description);
}

echo json_encode(retrieveCourseedService($pdo, $ha, $debug, null, $isSuperUserVar));

