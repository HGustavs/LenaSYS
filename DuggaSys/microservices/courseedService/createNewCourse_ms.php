<?php

//---------------------------------------------------------------------------------------------------------------
// editorService - Saves and Reads content for Code Editor
//---------------------------------------------------------------------------------------------------------------

// Missing Functionality
//		New Code Example + New Dugga
//		Graying link accordingly

date_default_timezone_set("Europe/Stockholm");

include('../shared_microservices/getUid_ms.php');

getUid();

// Connect to database and start session
pdoConnect();
session_start();

$opt = getOP('opt');
$coursename = getOP('coursename');
$coursecode = getOP('coursecode');
$courseGitURL = getOP('courseGitURL'); // for github url

$ha = null;

$query = $pdo->prepare("SELECT username FROM user WHERE uid = :uid");
$query->bindParam(':uid', $userid);
$query->execute();

while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
	$username = $row['username'];
}

$isSuperUserVar = false;

if (checklogin()) {
	if (isset($_SESSION['uid'])) {
		$userid = $_SESSION['uid'];
	} else {
		$userid = "UNK";
	}
	$isSuperUserVar = isSuperUser($userid);

	$ha = $isSuperUserVar;

	if ($ha) {

		$query = $pdo->prepare("INSERT INTO course (coursecode,coursename,visibility,creator, hp, courseGitURL) VALUES(:coursecode,:coursename,0,:usrid, 7.5, :courseGitURL)");

		$query->bindParam(':usrid', $userid);
		$query->bindParam(':coursecode', $coursecode);
		$query->bindParam(':coursename', $coursename);
		$query->bindParam(':courseGitURL', $courseGitURL); // for github url

		if (!$query->execute()) {
			$error = $query->errorInfo();
			$debug = "Error updating entries\n" . $error[2];
		}

		echo json_encode(array('code' => $coursecode, 'name' => $coursename, 'debug' => $debug));
		return;


	}
}
?>