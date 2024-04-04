<?php

date_default_timezone_set("Europe/Stockholm");

include('../shared_microservices/getUid_ms.php');

// Connect to database and start session
pdoConnect();
session_start();

$coursename = getOP('coursename'); // for course name  
$coursecode = getOP('coursecode'); // for course code  
$courseGitURL = getOP('courseGitURL'); // for github url


	if(isSuperUser(getUid())) {
        
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


?>