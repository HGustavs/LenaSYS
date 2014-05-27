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
		$stmt = $pdo -> prepare('UPDATE `userAnswer` SET `grade` = :3 WHERE `quizID` = :1 AND `uid` = :2  ');

		$stmt -> bindParam(':1', $_POST["quizid"]);
		$stmt -> bindParam(':2', $_POST["uid"]);
		$stmt -> bindParam(':3', $_POST["grade"]);

		if (!$stmt -> execute()) {
			$success = FALSE;
		} else {
			$stmt = $pdo -> prepare('SELECT * FROM `userAnswer` WHERE `quizID` = :1 AND `uid` = :2 ');
			$stmt -> bindParam(':1', $_POST["quizid"]);
			$stmt -> bindParam(':2', $_POST["uid"]);

			$stmt -> execute();
			if (count($stmt->fetchAll()) <= 0) {
				$insert = $pdo -> prepare('INSERT INTO userAnswer (quizID, grade, uid) VALUES (:1, :3, :2)');
				$insert -> bindParam(':1', $_POST["quizid"]);
				$insert -> bindParam(':2', $_POST["uid"]);
				$insert -> bindParam(':3', $_POST["grade"]);

				if (!$insert -> execute()) {
					$success = FALSE;
				}
			}
		}
		
		$entries=array();
		$completed=array();
		
		$query = $pdo->prepare("SELECT * FROM quiz WHERE id = :1");
		$query -> bindParam(':1', $_POST['quizid']);
		$result=$query->execute();
		if (!$result) err("SQL Query Error: ".$pdo->errorInfo(),"Field Querying Error!");
		
		$link = null;
		$dugganame = null;
		$start = null;
		$deadline = null;
		$gradesystem = null;
		$correctAnswer = null;
		foreach($query->fetchAll() as $row) {
		
			$dugganame = $row['name'];
			$start = $row['release'];
			$deadline = $row['deadline'];
			$gradesystem = $row['gradesystem'];
			$correctAnswer = $row['answer'];
		
			$quizQuery = $pdo->prepare("SELECT * FROM userAnswer WHERE quizID = :1");
			$quizQuery -> bindParam(':1', $row['id']);
			$answers=$quizQuery->execute();
			foreach($quizQuery->fetchAll() as $quizRow) {
				if (!in_array($quizRow['uid'], $completed)) {
					array_push($completed, $quizRow['uid']);
				}
				
				$userQuery = $pdo->prepare("SELECT * FROM user WHERE uid = :1");
				$userQuery -> bindParam(':1', $quizRow['uid']);
				$users=$userQuery->execute();
				foreach($userQuery->fetchAll() as $userRow) {
					array_push(
						$entries,
						array(
							'uid' => $userRow['uid'],
							'username' => $userRow['username'],
							'name' => $row['name'],
							'start' => $row['release'],
							'deadline' => $row['deadline'],
							'submitted' => $quizRow['submitted'],
							'grade' => $quizRow['grade'],
							'gradesystem' => $row['gradesystem'],
							'answer' => $quizRow['answer'],
							'correctAnswer' => $row['answer'],
							'link' => $link,
							'expired' => false
						)
					);
				}
			}
			
		}
		
		$query = $pdo->prepare("SELECT * FROM user_course WHERE cid = :1");
		$query -> bindParam(':1', $_POST['courseid']);
		$result=$query->execute();
		if (!$result) err("SQL Query Error: ".$pdo->errorInfo(),"Field Querying Error!");
		
		foreach($query->fetchAll() as $row) {
			if (!in_array($row['uid'], $completed)) {
				array_push($completed, $row['uid']);
				$expired = false;
				$date = new DateTime("now");
				$parsedDeadline = new DateTime($deadline);
				if ($date >= $parsedDeadline) {
					$expired = true;
				}
				
				$userQuery = $pdo->prepare("SELECT * FROM user WHERE uid = :1");
				$userQuery -> bindParam(':1', $row['uid']);
				$users=$userQuery->execute();
				foreach($userQuery->fetchAll() as $userRow) {
					array_push(
						$entries,
						array(
							'uid' => $userRow['uid'],
							'username' => $userRow['username'],
							'name' => $dugganame,
							'start' => $start,
							'deadline' => $deadline,
							'submitted' => "",
							'grade' => "",
							'gradesystem' => $gradesystem,
							'answer' => "",
							'correctAnswer' => $correctAnswer,
							'link' => $link,
							'expired' => $expired
						)
					);
				}
			}
			
		}
		
		$array = array(
			'entries' => $entries,
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
