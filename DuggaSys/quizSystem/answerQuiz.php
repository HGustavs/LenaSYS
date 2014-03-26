<?php
////Handels quiz answers 
////Parameters: loginName, password, courseName, courseOccasion, quizNr, qVarNr, quizAnswer
////If autoCorrection==false the answer is stored without checking
////Else the quiz answer is checked for correctness, 
////	if incorrect the answer is not stored, else stored 

//Store answer and loginName+answer hash
function storeAnswer($loginName,$password,$courseName,$courseOccasion,$quizNr,$qVarNr,$quizAnswer,$grade,$gradeComment,$ip,$userAgent,$pdo){
	$updateQuery="UPDATE AssignedQuizzes 
				  SET AssignedQuizzes.answer=:ANSWER, 
					  AssignedQuizzes.answerHash=:ANSWERHASH, 
					  AssignedQuizzes.grade=:GRADE, 
					  AssignedQuizzes.gradeComment=:GRADECOMMENT, 
					  AssignedQuizzes.answeredDateTime=:DATETIME,
					  AssignedQuizzes.userAgent=:AGENT,
					  AssignedQuizzes.userIP=:IP
				  WHERE AssignedQuizzes.ssn=(SELECT Student.ssn FROM Student WHERE Student.loginName=:LOGIN AND Student.passw=:PASSW)
					AND AssignedQuizzes.quizNr=:QNR
					AND AssignedQuizzes.qVarNr=:QVNR
					AND AssignedQuizzes.quizCourseName=:CNAME
					AND AssignedQuizzes.courseOccasion=:COCCASION;";
	$updateStmt = $pdo->prepare($updateQuery);
	$updateStmt->bindParam(':LOGIN', $loginName);
	$updateStmt->bindParam(':CNAME', $courseName);
	$updateStmt->bindParam(':QNR', $quizNr);
	$updateStmt->bindParam(':QVNR', $qVarNr);
	$updateStmt->bindParam(':COCCASION', $courseOccasion);
	$updateStmt->bindParam(':ANSWER', $quizAnswer);
	$hashedAnswer= md5($loginName.$quizAnswer);
	$updateStmt->bindParam(':ANSWERHASH', $hashedAnswer);
	$updateStmt->bindParam(':GRADE', $grade);
	$updateStmt->bindParam(':GRADECOMMENT', $gradeComment);
	$now=new DateTime();
	$dateString=$now->format('Y-m-d H:i:s');
	//$updateStmt->bindParam(':DATETIME', new DateTime()->format('Y-m-d H:i:s')); // date and time formated to string e.g. "2012-08-23 08:59:00"
	$updateStmt->bindParam(':DATETIME', $dateString); // date and time formated to string e.g. "2012-08-23 08:59:00"
	$updateStmt->bindParam(':PASSW',$password);
	$updateStmt->bindParam(':IP',$ip);
	$updateStmt->bindParam(':AGENT',$userAgent);
	return $updateStmt->execute();
}


//Prevents browsers (IE) from caching the response
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json; charset=utf-8'); 

include "dbconnect.php";

//Check if the student is a praticipant of the course
$queryString="SELECT COUNT(*) 
               FROM Student, StudentCourseRegistration 
			   WHERE Student.ssn=StudentCourseRegistration.studentSsn
			   AND Student.loginName=:LOGIN
			   AND Student.passw=:PASSW
			   AND courseName=:CNAME 
			   AND courseOccasion=:COCCASION;";
$stmt = $pdo->prepare($queryString);
$stmt->bindParam(':LOGIN', $_POST['loginName']);
$stmt->bindParam(':PASSW', $_POST['password']);
$stmt->bindParam(':CNAME', $_POST['courseName']);
$stmt->bindParam(':COCCASION', $_POST['courseOccasion']);
$stmt->execute();

if($stmt->fetchColumn()==1){ //Student is registered for the course - COUNT result read from the first column of the next unread row (i.e. the first row) 
	//Check if quiz is open (and fetch auto correction setting)
	$queryString="SELECT Quiz.opening, Quiz.closing, Quiz.autoCorrected
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
	/*
		AssignedQuizzes(
    ssn CHAR(11), //YYMMDD-XXXX
    quizNr INTEGER,
    qVarNr INTEGER,
    quizCourseName VARCHAR(200),
	courseOccasion VARCHAR(25) NOT NULL,
    answerHash VARCHAR(255), //Hash of Student login name + answer 
    answer TEXT,
	grade VARCHAR(10),
	gradeComment TEXT,
	answeredDateTime TIMESTAMP,
    userAgent VARCHAR(1024),
    userIP VARCHAR(20), //$_SERVER['REMOTE_ADDR']
	PRIMARY KEY(ssn, qVarNr, quizNr, quizCourseName),
	*/
	
	//Check if student already has answered the assigned quiz variant
	$queryString="SELECT AssignedQuizzes.answerHash 
				  FROM AssignedQuizzes, Student
				  WHERE Student.ssn=AssignedQuizzes.ssn
					AND AssignedQuizzes.quizNr=:QNR 
					AND AssignedQuizzes.qVarNr=:QVARNR 
					AND Student.loginName=:LOGIN
					AND AssignedQuizzes.quizCourseName=:CNAME
					AND AssignedQuizzes.courseOccasion=:COCCASION;";
	$stmt = $pdo->prepare($queryString);
	$stmt->bindParam(':QNR', $_POST['quizNr']);
	$stmt->bindParam(':QVARNR', $_POST['qVarNr']);
	$stmt->bindParam(':LOGIN', $_POST['loginName']);
	$stmt->bindParam(':CNAME', $_POST['courseName']);
	$stmt->bindParam(':COCCASION', $_POST['courseOccasion']);
	$stmt->execute();
	$result=$stmt->fetch(PDO::FETCH_ASSOC);
	if($result){ //If there is a quiz variant assigned to the student
			if($result['answerHash']!=NULL){ //Student has already answered the quiz
				echo json_encode(array('Error' => 'This quiz has already been answered', 'answerHash'=>$result['answerHash']));
				exit();
			} else { //check if autoCorrection
			
				if($quizData['autoCorrected']=='0'){ //Not auto corrected
					if(storeAnswer($_POST['loginName'],
								   $_POST['password'],
								   $_POST['courseName'],
								   $_POST['courseOccasion'],
								   $_POST['quizNr'],
								   $_POST['qVarNr'],
								   $_POST['quizAnswer'],
								   "ungraded",
								   "-",
								   $_SERVER['REMOTE_ADDR'],
								   $_SERVER['HTTP_USER_AGENT'],
								   $pdo)){
				        //Stored answer
						echo json_encode(array('Success' => 'true'));
					} else {
						//Failed to store answer
						echo json_encode(array('Success' => 'false'));
					}
					exit();
				} else { //Is auto corrected - Check if the correct answer was given 
					/*QuizVariant(
					 qVarNr INTEGER,
					quizNr INTEGER,
					quizCourseName VARCHAR(200),
					correctAnswer VARCHAR(255),
					quizObjectIDs TEXT,
					PRIMARY KEY(qVarNr, quizNr, quizCourseName),
					*/
					$queryString = "SELECT QuizVariant.correctAnswer
									FROM QuizVariant
									WHERE QuizVariant.qVarNr=:QVNR
										AND QuizVariant.quizNr=:QNR
										AND QuizVariant.quizCourseName=:CNAME";
					$stmt = $pdo->prepare($queryString);
					$stmt->bindParam(':QNR', $_POST['quizNr']);
					$stmt->bindParam(':QVNR', $_POST['qVarNr']);
					$stmt->bindParam(':CNAME', $_POST['courseName']);
					$stmt->execute();
					$qVarData=$stmt->fetch(PDO::FETCH_ASSOC);
					$correctAnswer=$qVarData['correctAnswer'];
					if($_POST['quizAnswer']==$correctAnswer){ //Correct answer was given
						$hashedAnswer= md5($_POST['loginName'].$_POST['quizAnswer']);
						
						if(storeAnswer($_POST['loginName'],
								   $_POST['password'],
								   $_POST['courseName'],
								   $_POST['courseOccasion'],
								   $_POST['quizNr'],
								   $_POST['qVarNr'],
								   $_POST['quizAnswer'],
								   "Correct",
								   "Quiz was corrected automatically",
								   $_SERVER['REMOTE_ADDR'],
								   $_SERVER['HTTP_USER_AGENT'],
								   $pdo)){
							//Stored answer
							echo json_encode(array('Success' => 'true', 'isCorrect' => 'true', 'hashedAnswer' => $hashedAnswer));
						} else {
							//Failed to store answer
							echo json_encode(array('Success' => 'false', 'isCorrect' => 'true', 'hashedAnswer' => $hashedAnswer));
						}
						exit();
					} else { //Answer is incorrect
						echo json_encode(array('isCorrect' => 'false'));
					}
					exit();
				}
			}
	} else {
		echo json_encode(array('Error' => 'This student has not been assigned the quiz'));
		exit();
	}
	
} else {
	echo json_encode(array('Error' => 'Student not registered for this course (or incorrect password was sent)'));
	exit();
}

?>