<?php

date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";
include_once "../DuggaSys/gitfetchService.php";

// Connect to database and start session
pdoConnect();
session_start();

$opt=getOP('opt');
$courseid=getOP('courseid');
$coursevers=getOP('coursevers');


if (strcmp($coursevers, "null")!==0) {
	// Get every coursevers of courses so we seed groups to every courseversion
	$stmt = $pdo->prepare("SELECT vers FROM vers WHERE cid=:cid");
	$stmt->bindParam(":cid", $courseid);
	$stmt->execute();
	$courseversions = $stmt->fetchAll(PDO::FETCH_COLUMN);
	$totalGroups = 24 * count($courseversions);
}
