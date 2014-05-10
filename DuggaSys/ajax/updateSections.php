<?php 
session_start(); 

include_once(dirname(__file__)."/../../Shared/sessions.php");

if (checklogin()) {
	if (isSuperUser($_SESSION["uid"]) || hasAccess($_SESSION["uid"], $_POST["courseid"], 'w')) {
		include_once(dirname(__file__)."/../../../coursesyspw.php");
		include_once(dirname(__file__)."/../../Shared/database.php");
		pdoConnect();
		$success = true;
		$stmt = $pdo -> prepare('UPDATE `listentries` SET `entryname` = :2, `kind` = :3, `visible` = :4 WHERE `lid` = :1');
		$stmt -> bindParam(':1', $_POST["sectionid"]);
		$stmt -> bindParam(':2', $_POST["sectionname"]);
		$stmt -> bindParam(':3', $_POST["type"]);
		$stmt -> bindParam(':4', $_POST["visibility"]);
		
		if (!$stmt -> execute()) {
			$success = FALSE;
		}

		echo json_encode("Successfully updated section!");
	} else {
		echo json_encode("No write access");
	}
} else {
	echo json_encode("No access");
}

?>