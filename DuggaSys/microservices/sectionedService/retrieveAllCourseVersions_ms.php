<?php

//
// This microservice retrieves all the course version for a particular course and calculates the number of groups
//

date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";
include_once "./retrieveSectionedService_ms.php";

// Connect to database and start session
pdoConnect();
session_start();

$opt=getOP('opt');
$courseid=getOP('courseid');
$coursevers=getOP('coursevers');
$debug = "NONE!";

if (strcmp($coursevers, "null")!==0) {
	// Fetches the course versions for a particular course id
	$stmt = $pdo->prepare("SELECT vers FROM vers WHERE cid=:cid");
	$stmt->bindParam(":cid", $courseid);
	$stmt->execute();
	$courseversions = $stmt->fetchAll(PDO::FETCH_COLUMN);
	$totalGroups = 24 * count($courseversions);

	if(!$query->execute()){
		$error=$query->errorInfo();
		$debug="ERROR: Failed to retrieve course versions. Details: ".$error[2];
	}
}

$data = retrieveSectionedService($debug, $opt, $pdo, null, $courseid, $coursevers, null);
echo json_encode($data);
return;