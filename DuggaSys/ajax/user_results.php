<?php 
	
		date_default_timezone_set("Europe/Stockholm");
	
		// Include basic application services!
		include_once("../../Shared/sessions.php");
		include_once("../../Shared/courses.php");
	
		// Connect to database and start session
		pdoConnect();
		session_start();
		
		if(checklogin()){
			$entries=array();
			$completed=array();
			
			$query = $pdo->prepare("SELECT * FROM userAnswer WHERE uid = :1");
			$query -> bindParam(':1', $_SESSION['uid']);
			$result=$query->execute();
			if (!$result) err("SQL Query Error: ".$pdo->errorInfo(),"Field Querying Error!");
			
			$courseName = null;
			$courseCode = null;
			$deadline = null;
			$quizName = null;
			$gradesystem = null;
			foreach($query->fetchAll() as $row) {
					array_push($completed, $row['quizID']);
					$quizQuery = $pdo->prepare("SELECT * FROM quiz WHERE id = :1");
					$quizQuery -> bindParam(':1', $row['quizID']);
					$tests=$quizQuery->execute();
					foreach($quizQuery->fetchAll() as $quizRow) {
						$quizName = $quizRow['name'];
						$deadline = $quizRow['deadline'];
						$gradesystem = $quizRow['gradesystem'];
						$courseQuery = $pdo->prepare("SELECT * FROM course WHERE cid = :1");
						$courseQuery -> bindParam(':1', $quizRow['cid']);
						$courses=$courseQuery->execute();
						$courses=$courseQuery->fetch();
						$courseName = $courses['coursename'];
						$courseCode = $courses['coursecode'];
					}
				
			
				array_push(
					$entries,
					array(
						'coursename' => $courseName,
						'coursecode' => $courseCode,
						'name' => $quizName,
						'submitted' => $row['submitted'],
						'deadline' => $deadline,
						'grade' => $row['grade'],
						'gradesystem' => $gradesystem,
						'expired' => false
					)
				);
			}
			
			$query = $pdo->prepare("SELECT cid FROM user_course WHERE uid = :1");
			$query -> bindParam(':1', $_SESSION['uid']);
			$result=$query->execute();
			if (!$result) err("SQL Query Error: ".$pdo->errorInfo(),"Field Querying Error!");
			foreach($query->fetchAll() as $row) {
				$quizQuery = $pdo->prepare("SELECT * FROM quiz WHERE cid = :1");
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
						$courseQuery = $pdo->prepare("SELECT * FROM course WHERE cid = :1");
						$courseQuery -> bindParam(':1', $quizRow['cid']);
						$courses=$courseQuery->execute();
						$courses=$courseQuery->fetch();
						$courseName = $courses['coursename'];
						$courseCode = $courses['coursecode'];
						
						array_push(
							$entries,
							array(
								'coursename' => $courseName,
								'coursecode' => $courseCode,
								'name' => $quizName,
								'submitted' => "",
								'deadline' => $quizRow['deadline'],
								'grade' => "",
								'gradesystem' => $quizRow['gradesystem'],
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
		} else {
			echo json_encode("No access");
		}
?>
