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
			
			$query = $pdo->prepare("SELECT * FROM userAnswer WHERE uid = :1");
			$query -> bindParam(':1', $_SESSION['uid']);
			$result=$query->execute();
			if (!$result) err("SQL Query Error: ".$pdo->errorInfo(),"Field Querying Error!");
			
			$cachedQuiz = null;
			$courseName = null;
			$courseCode = null;
			$quizName = null;
			foreach($query->fetchAll() as $row) {
				if ($cachedQuiz == null || $cachedQuiz != $row['testID']) {
					$cachedQuiz = $row['testID'];
					$quizQuery = $pdo->prepare("SELECT * FROM quiz WHERE id = :1");
					$quizQuery -> bindParam(':1', $cachedQuiz);
					$tests=$quizQuery->execute();
					foreach($quizQuery->fetchAll() as $quizRow) {
						$quizName = $quizRow['name'];
						$courseQuery = $pdo->prepare("SELECT * FROM course WHERE cid = :1");
						$courseQuery -> bindParam(':1', $quizRow['courseID']);
						$courses=$courseQuery->execute();
						$courses=$courseQuery->fetch();
						$courseName = $courses['coursename'];
						$courseCode = $courses['coursecode'];
					}
				}
				
			
				array_push(
					$entries,
					array(
						'coursename' => $courseName,
						'coursecode' => $courseCode,
						'name' => $quizName,
						'submitted' => $row['submitted'],
						'grade' => $row['grade']
					)
				);
			}
			$array = array(
				'entries' => $entries,
			);
			
			echo json_encode($array);
		} else {
			echo json_encode("No access");
		}
?>
