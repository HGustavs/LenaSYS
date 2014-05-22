<?php 
	
		date_default_timezone_set("Europe/Stockholm");
	
		// Include basic application services!
		include_once("../../Shared/sessions.php");
		include_once("../../Shared/courses.php");
	
		// Connect to database and start session
		pdoConnect();
		session_start();
		
		if(checklogin()){
			if(isSuperUser($_SESSION['uid']) || hasAccess($_SESSION['uid'], $_SESSION['courseid'], 'w')){
				$entries=array();
				$completed=array();
				
				$query = $pdo->prepare("SELECT * FROM userAnswer");
				$result=$query->execute();
				if (!$result) err("SQL Query Error: ".$pdo->errorInfo(),"Field Querying Error!");
				
				$deadline = null;
				$quizName = null;
				$quizRelease = null;
				$answer = null;
				$link = null;
				foreach($query->fetchAll() as $row) {
					array_push($completed, $row['testID']);
					$quizQuery = $pdo->prepare("SELECT * FROM quiz WHERE id = :1");
					$quizQuery -> bindParam(':1', $row['testID']);
					$tests=$quizQuery->execute();
					foreach($quizQuery->fetchAll() as $quizRow) {
						$quizName = $quizRow['name'];
						$quizRelease = $quizRow['release'];
						$deadline = $quizRow['deadline'];
						$answer = $quizRow['answer'];
					}
					
					array_push(
						$entries,
						array(
							'uid' => $row['uid'],
							'name' => $quizName,
							'start' => $quizRelease,
							'deadline' => $deadline,
							'submitted' => $row['submitted'],
							'grade' => $row['grade'],
							'answer' => $answer,
							'link' => $link,
							'expired' => false
						)
					);
					
				}
				$quizQuery = $pdo->prepare("SELECT * FROM quiz WHERE courseID = :1");
				$quizQuery -> bindParam(':1', $_SESSION['courseid']);
				$tests=$quizQuery->execute();
				foreach($quizQuery->fetchAll() as $quizRow) {
					if (!in_array($quizRow['id'], $completed)) {
						$expired = false;
						$quizName = $quizRow['name'];
						$date = new DateTime("now");
						$deadline = new DateTime($quizRow['deadline']);
						if ($date >= $deadline) {
							$expired = true;
						}
						array_push(
							$entries,
							array(
								'uid' => $row['uid'],
								'name' => $quizName,
								'start' => $quizRow['release'],
								'deadline' => $quizRow['deadline'],
								'submitted' => "",
								'grade' => "",
								'answer' => "",
								'link' => $link,
								'expired' => $expired
							)
						);
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
