<?php 
session_start(); 

include_once(dirname(__file__)."/../../Shared/sessions.php");


if (checklogin()) {

	include_once(dirname(__file__)."/../../../coursesyspw.php");
	include_once(dirname(__file__)."/../../Shared/database.php");
	pdoConnect();

	//check if course name exists, returns number
	$stmt = $pdo -> prepare('SELECT count(cid) as count FROM course WHERE coursename=:1');
	$stmt -> bindParam(':1', $_POST["coursename"]);
	$stmt -> execute();	
	$coursenameCheck = $stmt->fetch();

	//check if course code exists, returns number 
	$stmt = $pdo -> prepare('SELECT count(cid) as count FROM course WHERE coursecode=:1');
	$stmt -> bindParam(':1', $_POST["coursecode"]);
	$stmt -> execute();	
	$coursecodeCheck = $stmt->fetch();

	// returnes strings based on existence of course name and code
	if ($coursenameCheck["count"]>0 && $coursecodeCheck["count"]>0) {
		echo ("Course name and course code already exist");
	} elseif ($coursenameCheck["count"]>0) {
		echo ("Course name already exist");
	} elseif ($coursecodeCheck["count"]>0) {
		echo ("Course code already exist");
	
	// if course name or code does not exist, creates and retunes cid with coursecode
	} else {


		$stmt = $pdo -> prepare('INSERT INTO `course`(`coursecode`, `coursename`, `created`, `creator`, `visibility`, `updated`) VALUES (:2, :1, now(), :3, :4, now())');
		$stmt -> bindParam(':1', $_POST["coursename"]);
		$stmt -> bindParam(':2', $_POST["coursecode"]);
		$stmt -> bindParam(':3', $_SESSION["uid"]);
		$stmt -> bindParam(':4', $_POST["visib"]);
		$stmt -> execute();

		$stmt = $pdo -> prepare('SELECT cid FROM course WHERE coursecode=:1');
		$stmt -> bindParam(':1', $_POST["coursecode"]);
		$stmt -> execute();
		$data = $stmt->fetch();

		echo json_encode($data);

	}
} else {
	echo ("no access");
}

?>