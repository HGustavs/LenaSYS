<?php
date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../../../Shared/basic.php";
include_once "getUid_ms.php";

function setAsActiveCourse($pdo) {

$cid = getOP('cid');
$versid = getOP('versid');
$makeactive = getOP('makeactive');

getUid();

if ($makeactive == 3) {
	$query = $pdo->prepare("UPDATE course SET activeversion=:vers WHERE cid=:cid");
	$query->bindParam(':cid', $cid);
	$query->bindParam(':vers', $versid);
	if (!$query->execute()) {
		$error = $query->errorInfo();
		$debug = "Error updating entries\n" . $error[2];
	}
}
}