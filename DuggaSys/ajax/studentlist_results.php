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
				
				$query = $pdo->prepare("SELECT * FROM userAnswer");
				$result=$query->execute();
				if (!$result) err("SQL Query Error: ".$pdo->errorInfo(),"Field Querying Error!");
				
				$cachedQuiz = null;
				$deadline = null;
				$quizName = null;
				$quizRelease = null;
				$answer = null;
				$link = null;
				foreach($query->fetchAll() as $row) {
					if ($cachedQuiz == null || $cachedQuiz != $row['testID']) {
						$cachedQuiz = $row['testID'];
						array_push($completed, $cachedQuiz);
						$quizQuery = $pdo->prepare("SELECT * FROM quiz WHERE id = :1");
						$quizQuery -> bindParam(':1', $cachedQuiz);
						$tests=$quizQuery->execute();
						foreach($quizQuery->fetchAll() as $quizRow) {
							$quizName = $quizRow['name'];
							$quizRelease = $quizRow['release'];
							$deadline = $quizRow['deadline'];
							$answer = $quizRow['answer'];
						}
					}
					array_push(
						$entries,
						array(
							'uid' => $_row['uid'],
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
				$query = $pdo->prepare("SELECT cid FROM user_course");
				$result=$query->execute();
				if (!$result) err("SQL Query Error: ".$pdo->errorInfo(),"Field Querying Error!");
				foreach($query->fetchAll() as $row) {
					$quizQuery = $pdo->prepare("SELECT * FROM quiz WHERE courseID = :1");
					$quizQuery -> bindParam(':1', $row['cid']);
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
									'uid' => $_row['uid'],
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
