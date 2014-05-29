<?php
session_start(); 
include_once(dirname(__file__)."/../../Shared/sessions.php");
include_once(dirname(__file__)."/../../../coursesyspw.php");
include_once(dirname(__file__)."/../../Shared/database.php");
pdoConnect();
$error = false;
$quiz = "";
function getQuiz($quizid){
    global $pdo;
    $query = "SELECT name, parameter as parameters, quizFile as template, `release`, deadline FROM quiz WHERE id = :id";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':id', $quizid);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result;
}

if (checklogin()) {
	if(array_key_exists('quizid', $_POST)) {
		$stmt = $pdo->prepare("SELECT cid FROM quiz WHERE id=:qid");
		$stmt->bindValue(':qid', $_POST['quizid']);
		$stmt->execute();
		$res = $stmt->fetch(PDO::FETCH_ASSOC);
		$courseid = $res['cid'];
	}

	if (isset($courseid) && hasAccess($_SESSION['uid'], $courseid, 'r')) {
		if(isset($_POST['quizid'])){
			$stmt = $pdo->prepare("SELECT count(quizID) as count FROM userAnswer WHERE quizID=:qid and uid=:uid");
			$stmt->bindValue(':qid', $_POST['quizid']);
			$stmt->bindValue(':uid', $_SESSION['uid']);
			$stmt->execute();
			$count = $stmt->fetch();
			if ($count["count"]==0) {
				$quiz = getQuiz($_POST["quizid"]);
				// Is the quiz released?
				if(strtotime($quiz['release']) > time()) 
					$error = "This test has not been released yet";
				if(strtotime($quiz['deadline']) <= time())
					$error = "Deadline has passed.";
			} else {
				$error = "You have already done this test";
			}
			
		} else {
			$error = "No QuizID set";
		}
	} else {
		$error = "Access denied";	
	}
} else {
	$error = "Access denied";
}

if($error === false) {
	print (json_encode($quiz));
} else {
	print (json_encode(array("error" => $error)));
}
?>
