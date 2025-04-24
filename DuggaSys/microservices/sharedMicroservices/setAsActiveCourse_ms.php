<?php
date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/basic.php";

function setAsActiveCourse($pdo, $cid, $versid)
{
	$query = $pdo->prepare("UPDATE course SET activeversion=:vers WHERE cid=:cid");
	$query->bindParam(':cid', $cid);
	$query->bindParam(':vers', $versid);

	if (!$query->execute()) {
		$error = $query->errorInfo();
		$debug = "Error updating entries\n" . $error[2];
		echo json_encode($debug);
	}
}