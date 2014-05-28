<?php 
header("Content-type: application/json");
session_start(); 
include_once(dirname(__file__)."/../../Shared/sessions.php");

if (checklogin()) {
	if (hasAccess($_SESSION["uid"], $_POST["cid"], "w")) {

		$stmt = $pdo -> prepare('SELECT `id`, `cid`, `autograde`, `gradesystem`, `name`, `release`, `deadline`, `quizFile`, `parameter` FROM quiz WHERE cid=:cid AND id=:qid');
		$stmt -> bindParam(':qid', $_POST["qid"]);
		$stmt -> bindParam(':cid', $_POST["cid"]);
		$stmt -> execute();	
		$data = $stmt->fetch();

		echo json_encode($data);
	} else {
		echo json_encode("no write access");
	}
} else {
	echo json_encode("no access");
}

?>
