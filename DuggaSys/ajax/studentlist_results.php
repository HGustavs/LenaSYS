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
				
				$link = null;
				foreach($query->fetchAll() as $row) {
					$quizQuery = $pdo->prepare("SELECT * FROM userAnswer WHERE testID = :1");
					$quizQuery -> bindParam(':1', $row['id']);
					$answers=$quizQuery->execute();
					foreach($quizQuery->fetchAll() as $quizRow) {
						if (!in_array($quizRow['testID'], $completed)) {
							array_push($completed, $quizRow['testID']);
						}
						
						$userQuery = $pdo->prepare("SELECT * FROM user WHERE uid = :1");
						$userQuery -> bindParam(':1', $quizRow['uid']);
						$users=$userQuery->execute();
						foreach($userQuery->fetchAll() as $userRow) {
							array_push(
								$entries,
								array(
									'username' => $userRow['username'],
									'name' => $row['name'],
									'start' => $row['release'],
									'deadline' => $row['deadline'],
									'submitted' => $quizRow['submitted'],
									'grade' => $quizRow['grade'],
									'answer' => $quizRow['answer'],
									'correctAnswer' => $row['answer'],
									'link' => $link,
									'expired' => false
								)
							);
						}
					}
					
				}
				
				$query = $pdo->prepare("SELECT * FROM quiz WHERE id = :1");
				$query -> bindParam(':1', $_POST['quizid']);
				$result=$query->execute();
				if (!$result) err("SQL Query Error: ".$pdo->errorInfo(),"Field Querying Error!");
				
				$link = null;
				foreach($query->fetchAll() as $row) {
					if (!in_array($row['id'], $completed)) {
						$expired = false;
						$date = new DateTime("now");
						$deadline = new DateTime($row['deadline']);
						if ($date >= $deadline) {
							$expired = true;
						}
						
						$userQuery = $pdo->prepare("SELECT * FROM user WHERE uid = :1");
						$userQuery -> bindParam(':1', $quizRow['uid']);
						$users=$userQuery->execute();
						foreach($userQuery->fetchAll() as $userRow) {
							array_push(
								$entries,
								array(
									'username' => $userRow['username'],
									'name' => $row['name'],
									'start' => $row['release'],
									'deadline' => $row['deadline'],
									'submitted' => "",
									'grade' => "",
									'answer' => "",
									'correctAnswer' => $row['answer'],
									'link' => $link,
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
