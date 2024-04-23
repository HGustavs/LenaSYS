<?php
date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "getUid_ms.php";
include_once "retrieveUsername_ms.php";

// Connect to database and start session
pdoConnect();
session_start();

// Global variables
$courseid = getOP('courseid');
$examplename=getOP('examplename');
$sectname = getOP('sectname');
$coursevers = getOP('coursevers');
$userid = getUid();

$query = $pdo->prepare("INSERT INTO codeexample(cid, examplename, sectionname, uid, cversion) values (:cid, :ename, :sname, 1, :cversion);");

$query->bindParam(':cid', $courseid);
$query->bindParam(':ename', $examplename);
$query->bindParam(':sname', $sectname);
$query->bindParam(':cversion', $coursevers);

if (!$query->execute()) {
	$error = $query->errorInfo();
	$debug = "Error updating entries" . $error[2];
}

logUserEvent($userid, $username, EventTypes::SectionItems, $sectname);

echo json_encode($debug);
