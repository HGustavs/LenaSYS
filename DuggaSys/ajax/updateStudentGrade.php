<?php 
session_start(); 

include_once(dirname(__file__)."/../../Shared/sessions.php");
include_once(dirname(__file__)."/../../Shared/courses.php");

if (checklogin()) {
	if (isSuperUser($_SESSION["uid"]) || hasAccess($_SESSION["uid"], $_POST["courseid"], 'w')) {
		include_once(dirname(__file__)."/../../../coursesyspw.php");
		include_once(dirname(__file__)."/../../Shared/database.php");
		pdoConnect();
		$success = true;
		$stmt = $pdo -> prepare('UPDATE `useranswer` SET `gradeID` = :3 WHERE `quizID` = :1 AND `uid` = :2  ');
		$stmt -> bindParam(':1', $_POST["quizid"]);
		$stmt -> bindParam(':2', $_POST["uid"]);
		$stmt -> bindParam(':3', $_POST["grade"]);
		
		if (!$stmt -> execute()) {
			$success = FALSE;
		}

		echo json_encode("Successfully updated student grade!");
		
	} else {
		echo json_encode("No write access");
	}
} else {
	echo json_encode("No access");
}

?>