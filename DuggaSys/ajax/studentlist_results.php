<?php 
	
		date_default_timezone_set("Europe/Stockholm");
	
		// Include basic application services!
		include_once("../../Shared/sessions.php");
		include_once("../../Shared/courses.php");
	
		// Connect to database and start session
		pdoConnect();
		session_start();
		
		if(checklogin()){
			if(isSuperUser($_SESSION['uid']) || hasAccess($_SESSION['uid'], $_POST['courseid'], 'w')){
				$entries=array();
				$completed=array();
				
				$query = $pdo->prepare("SELECT * FROM quiz WHERE id = :1");
				$query -> bindParam(':1', $_POST['quizid']);
				$result=$query->execute();
				if (!$result) err("SQL Query Error: ".$pdo->errorInfo(),"Field Querying Error!");
				
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
									'quizid' => $row['id'],
									'name' => $row['name'],
									'start' => $row['release'],
									'deadline' => $row['deadline'],
									'submitted' => $quizRow['submitted'],
									'grade' => $quizRow['grade'],
									'gradesystem' => $row['gradesystem'],
									'answer' => $quizRow['answer'],
									'correctAnswer' => $row['answer'],
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
									'expired' => $expired
								)
							);
						}
					}
					
				}
				$array = array(
					'entries' => $entries,
				);
				
				echo json_encode($array);
			}
		} else {
			echo json_encode("No access");
		}
?>
