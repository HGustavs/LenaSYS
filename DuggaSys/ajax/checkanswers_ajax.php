<?php 
session_start();
include_once(dirname(__FILE__) . "/../../Shared/basic.php");
if(checklogin() && isset($_POST['answers']) && $_POST['answers'] != ""){

	pdoConnect();
	$answers = $_POST['answers'];
	$quiz_id = $_POST['quiz_id'];

	// Get test information
	$query = "SELECT answer, autograde FROM quiz WHERE id = :id";
	$stmt = $pdo->prepare($query);
	$stmt->bindParam(':id', $quiz_id);

	if($stmt->execute() && $stmt->rowCount() > 0){
		$results = $stmt->fetch();
		if($results['answer'] && $results['autograde']) {
			$stmt = $pdo->prepare("INSERT INTO `userAnswer` (quizID, grade, uid, answer) VALUES(:qid, :grade, :uid, :answer)");
			$stmt->bindParam(':qid', $quiz_id);
			$stmt->bindParam(':uid', $_SESSION['uid']);
			$stmt->bindParam(':answer', $answers);
			if($results['answer'] == $answers) {
				$stmt->bindValue(':grade', 1);
			} else {
				$stmt->bindValue(':grade', 0);
			}

			$stmt->execute();
		} else {
			$stmt = $pdo->prepare("INSERT INTO `userAnswer` (quizID, grade, uid, answer) VALUES(:qid, -1, :uid, :answer)");
			$stmt->bindParam(':qid', $quiz_id);
			$stmt->bindParam(':uid', $_SESSION['uid']);
			$stmt->bindParam(':answer', $answers);
			$stmt->execute();
		}

	}
	echo json_encode(array("success" => true));
}
?>
