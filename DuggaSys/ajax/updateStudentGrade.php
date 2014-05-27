<?php 
session_start(); 

include_once(dirname(__file__)."/../../Shared/sessions.php");
include_once(dirname(__file__)."/../../Shared/courses.php");

$success = false;
if (checklogin()) {
	if (isSuperUser($_SESSION["uid"]) || hasAccess($_SESSION["uid"], $_POST["courseid"], 'w')) {
		include_once(dirname(__file__)."/../../../coursesyspw.php");
		include_once(dirname(__file__)."/../../Shared/database.php");
		pdoConnect();
		$success = true;

		$stmt = $pdo -> prepare('UPDATE `useranswer` SET `grade` = :3 WHERE `quizID` = :1 AND `uid` = :2  ');
		$stmt -> bindParam(':1', $_POST["quizid"]);
		$stmt -> bindParam(':2', $_POST["uid"]);
		$stmt -> bindParam(':3', $_POST["grade"]);

		if (!$stmt -> execute()) {
			$success = FALSE;
		}
		$array = array(
			'entries' => "Successfully updated student grade!",
			'success' => $success
		);
		echo json_encode($array);
		
	} else {
		$array = array(
			'entries' => "No write access",
			'success' => $success
		);
		echo json_encode($array);
	}
} else {
	$array = array(
			'entries' => "No access",
			'success' => $success
		);
	echo json_encode($array);
}

?>
