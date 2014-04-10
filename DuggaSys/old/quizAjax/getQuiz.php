<?php
//// Returns a quiz variant including quiz data (If the student is registered for the course and the quiz is open)
//// If no quiz variant already assigned to the student a variant will be randomly selected and assigned
//// Parameters: (POST) login, courseName, courseOccasion, quizNr
//// Returns:  quizNr 
////           quizCourseName 
////		   quizData 
////		   quizObjectIDs 

session_start();
//Check if the sent login name is the same as the one stored in the session
if($_POST['loginName']==$_SESSION['loginName'] && $_POST['courseName']==$_SESSION['courseName'] && $_POST['quizNr']==$_SESSION['quizNr']){ 

//Prevents browsers (IE) from caching the response
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
//header('Content-type: application/json');
header('Content-type: application/json; charset=utf-8'); 

/* Function used to fetch quiz variant data */
function fetchQuizVariant($courseName, $quizNr, $quizVariantNr, $pdo){					
	$queryString=" SELECT QuizVariant.quizNr, QuizVariant.quizCourseName, QuizVariant.quizObjectIDs, Quiz.quizData 
					FROM QuizVariant, Quiz
					WHERE QuizVariant.quizNr=Quiz.nr 
					AND QuizVariant.qVarNr=:VARNR 
					AND QuizVariant.quizCourseName=:CNAME 
					AND QuizVariant.quizNr=:QNR;)";
	$stmt = $pdo->prepare($queryString);
	$stmt->bindParam(':CNAME', $courseName);
	$stmt->bindParam(':QNR', $quizNr);
	$stmt->bindParam(':VARNR', $quizVariantNr);
	$stmt->execute();

	$quizVariantData=$stmt->fetch(PDO::FETCH_ASSOC);
	$quizVariantData['quizData']=htmlspecialchars_decode($quizVariantData['quizData']);
	return $quizVariantData;
}

include "dbconnect.php";
 
//Check if the student is a praticipant of the course
$queryString="SELECT COUNT(*) 
               FROM Student, StudentCourseRegistration 
			   WHERE Student.ssn=StudentCourseRegistration.studentSsn
			   AND Student.loginName=:LOGINN
			   AND Student.passw=:PASSW
			   AND courseName=:CNAME 
			   AND courseOccasion=:COCCASION;";
$stmt = $pdo->prepare($queryString);
$stmt->bindParam(':LOGINN', $_SESSION['loginName']);
$stmt->bindParam(':PASSW', $_SESSION['password']);
$stmt->bindParam(':CNAME', $_POST['courseName']);
$stmt->bindParam(':COCCASION', $_POST['courseOccasion']);
$stmt->execute();

if($stmt->fetchColumn()==1){ //Student is registered for the course - COUNT result read from the first column of the next unread row (i.e. the first row) 
	
	//Check if quiz is open
	$queryString="SELECT Quiz.opening, Quiz.closing, Quiz.allowMultipleReplies
				   FROM Quiz
				   WHERE Quiz.nr=:QNR
				   AND Quiz.courseName=:CNAME;";
	$stmt = $pdo->prepare($queryString);
	$stmt->bindParam(':QNR', $_POST['quizNr']);
	$stmt->bindParam(':CNAME', $_POST['courseName']);
	$stmt->execute();
	$quizData=$stmt->fetch(PDO::FETCH_ASSOC); 
	if($quizData){
		$now = new DateTime();
		$opening = new DateTime($quizData['opening']);
		$closing = new DateTime($quizData['closing']);

		if($now<$opening) { //Quiz is not open yet
			echo json_encode(array('Error' => 'Requested quiz is not open yet'));
			exit();
		} else if($now>$closing) { //Quiz is closed
			echo json_encode(array('Error' => 'Requested quiz is closed'));
			exit();
		} // else continue (Not the best coding practice...)
		
	} else { //Quiz does not exist
		echo json_encode(array('Error' => 'Requested quiz does not exist'));
		exit();
	}
	
	//Check if student already has been assigned a quiz variant
	$queryString="SELECT AssignedQuizzes.qVarNr, AssignedQuizzes.answerHash, AssignedQuizzes.answer 
				  FROM AssignedQuizzes, Student
				  WHERE Student.ssn=AssignedQuizzes.ssn
				  AND Student.loginName=:LOGIN
				  AND AssignedQuizzes.quizNr=:QNR
				  AND AssignedQuizzes.quizCourseName=:CNAME
				  AND AssignedQuizzes.courseOccasion=:COCCASION;";
	$stmt = $pdo->prepare($queryString);
	$stmt->bindParam(':LOGIN', $_POST['loginName']);
	$stmt->bindParam(':QNR', $_POST['quizNr']);
	$stmt->bindParam(':CNAME', $_POST['courseName']);
	$stmt->bindParam(':COCCASION', $_POST['courseOccasion']);
	$stmt->execute();
	$result=$stmt->fetch(PDO::FETCH_ASSOC);
	if($result){ //If this quiz is assigned to the student
	//if($stmt->rowCount() >= 1){ //If this quiz is assigned to the student
			
			if($result['answerHash']!=NULL && $quizData['allowMultipleReplies']!='1'){ //Student has already answered the quiz
				echo json_encode(array('Error' => 'This student has already answered this quiz', 'answerHash'=>$result['answerHash']));
				exit();
			} else { //Return quiz variant data assigned to student
				$quizVariant=$result['qVarNr'];
				$quizVariantData=fetchQuizVariant($_POST['courseName'], $_POST['quizNr'], $quizVariant, $pdo);
				$quizVariantData['storedAnswer']=$result['answer'];
				echo json_encode($quizVariantData);
				exit();
			}
	} else { //This quiz has not been assigned to the student
		//Select random variant for requested quiz nr (for a particular course)
		//$queryString="SELECT COUNT(QuizVariant.quizNr) 
		//              FROM QuizVariant 
		//			  WHERE QuizVariant.quizNr=:QNR AND QuizVariant.quizCourseName=:CNAME;";
		//SELECT COUNT(QuizVariant.quizNr) FROM QuizVariant WHERE QuizVariant.quizNr=1 AND QuizVariant.quizCourseName='DA133G Webbutveckling - datorgrafik G1N, 7,5hp (IKI)';
		
		$queryString="SELECT QuizVariant.qVarNr 
					  FROM QuizVariant
					  WHERE QuizVariant.quizNr=:QNR 
						AND QuizVariant.quizCourseName=:CNAME;";
		
		$stmt = $pdo->prepare($queryString);
		
		$stmt->bindParam(':QNR', $_POST['quizNr']);
		$stmt->bindParam(':CNAME', $_POST['courseName']);
		$stmt->execute();
		$quizVariants=$stmt->fetchAll(PDO::FETCH_NUM);
		if(count($quizVariants)>0){
			$randomIndex=rand(0,count($quizVariants)-1);
			$quizVariant=$quizVariants[$randomIndex][0];
			$quizVariantData=fetchQuizVariant($_POST['courseName'], $_POST['quizNr'], $quizVariant, $pdo);
			
			//Store selected variant
			$insertString="INSERT INTO AssignedQuizzes(ssn, quizNr, qVarNr, quizCourseName, courseOccasion) 
						   VALUES((SELECT Student.ssn FROM Student WHERE Student.loginName=:LOGIN), :QNR, :QVARNR, :CNAME, :COCCASION);";
			$insertStmt = $pdo->prepare($insertString);
			$insertStmt->bindParam(':LOGIN', $_SESSION['loginName']);
			$insertStmt->bindParam(':CNAME', $quizVariantData['quizCourseName']);
			$insertStmt->bindParam(':QNR', $quizVariantData['quizNr']);
			$insertStmt->bindParam(':QVARNR', $quizVariant);  
			$insertStmt->bindParam(':COCCASION', $_SESSION['courseOccasion']);
			$insertStmt->execute();
			
			echo json_encode($quizVariantData);	
			exit();
		} else {
			echo json_encode(array('Error' => 'No quiz variants found'));
			exit();
		}
	}

} else {
	//TODO: Store login attempt in log-table
	echo json_encode(array('Error' => 'Student not registered for this course'));
	exit();
}
} else { //Sent login name does not match the login name stored in the session
	echo json_encode(array('Error' => 'Sent login name does not match stored login name'));
}
?>