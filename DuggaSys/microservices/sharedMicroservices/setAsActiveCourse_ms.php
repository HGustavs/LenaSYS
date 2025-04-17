<?php
date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/basic.php";
include_once "../Shared/sessions.php";

pdoConnect();
session_start();

header("Content-Type: application/json");

//get values from post
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	if (isset($_POST['cid'], $_POST['versid'])) {
		$cid = $_POST['cid'];
		$versid = $_POST['versid'];
	}
}

//set active course in database
$query = $pdo->prepare("UPDATE course SET activeversion=:vers WHERE cid=:cid");
$query->bindParam(':cid', $cid);
$query->bindParam(':vers', $versid);

//error handling
if (!$query->execute()) {
	$error = $query->errorInfo();
	$debug = "Error updating entries\n" . $error[2];
	echo json_encode($debug);
}

