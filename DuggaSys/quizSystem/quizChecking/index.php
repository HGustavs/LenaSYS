<?php
//Quiz checking

if(isset($_POST['checkSelectedQuiz']) || isset($_POST['displayQuizAnswerDetails'])){
/*
 QuizVariant(
    qVarNr INTEGER,
    quizNr INTEGER,
    quizCourseName VARCHAR(200),
    correctAnswer VARCHAR(255),
    quizObjectIDs TEXT,
    PRIMARY KEY(qVarNr, quizNr, quizCourseName),
	
	AssignedQuizzes(
    ssn CHAR(11), 
    quizNr INTEGER,
    qVarNr INTEGER,
    quizCourseName VARCHAR(200),
	courseOccasion VARCHAR(25),
    answerHash VARCHAR(255), 
    answer TEXT,
	grade VARCHAR(10),
	gradeComment TEXT,
	answeredDateTime TIMESTAMP,
    userAgent VARCHAR(1024),
    userIP VARCHAR(20), 
    PRIMARY KEY(ssn, qVarNr, quizNr, quizCourseName, courseOccasion),
*/
	
	if(isset($_POST['clearAnswerHash'])){
		//Clear the answer hash (allows resubmitting of the quiz)
		$updateString = "UPDATE AssignedQuizzes 
						 SET AssignedQuizzes.answerHash=:AHASH
						 WHERE AssignedQuizzes.qVarNr=:QVNR
							AND AssignedQuizzes.quizNr=:QNR 
							AND AssignedQuizzes.quizCourseName=:CNAME
							AND AssignedQuizzes.courseOccasion=:COCCASION
							AND AssignedQuizzes.ssn=:SSN;";
		$updateStmt = $pdo->prepare($updateString);
		$hash=null;
		$updateStmt->bindParam(':AHASH', $hash);
		$updateStmt->bindParam(':QNR', $_POST['quizNr']);
		$updateStmt->bindParam(':QVNR', $_POST['qVarNr']);
		$updateStmt->bindParam(':CNAME', $_POST['courseName']);
		$updateStmt->bindParam(':COCCASION', $_POST['courseOccasion']);
		$updateStmt->bindParam(':SSN', $_POST['ssn']);
		$updateStmt->execute();
		if($updateStmt->execute()){
			$userMsg.="Hash cleared";
		} else {
			$errorMsg.="Error: Hash NOT cleared";
		}
		$updateStmt->closeCursor();
	}
	
	if(isset($_POST['checkAnswerHash'])){
		//Check if the answer hash matches login+answer md5-hash
		$generatedHash=md5($_POST['loginName'].$_POST['answer']);
		if(strcmp($generatedHash,$_POST['answerHash'])==0){
			$hashCompareMsg="Hash check OK";
		} else {
			$hashCompareMsg="Hash check FAILED";
		}
	}
	
	if(isset($_POST['saveGrade'])){
		//Store new grade
		$updateString = "UPDATE AssignedQuizzes 
						 SET AssignedQuizzes.grade=:GRADE
						 WHERE AssignedQuizzes.qVarNr=:QVNR
							AND AssignedQuizzes.quizNr=:QNR 
							AND AssignedQuizzes.quizCourseName=:CNAME
							AND AssignedQuizzes.courseOccasion=:COCCASION
							AND AssignedQuizzes.ssn=:SSN;";
		$updateStmt = $pdo->prepare($updateString);
		$updateStmt->bindParam(':GRADE', $_POST['grade']);
		$updateStmt->bindParam(':QNR', $_POST['quizNr']);
		$updateStmt->bindParam(':QVNR', $_POST['qVarNr']);
		$updateStmt->bindParam(':CNAME', $_POST['courseName']);
		$updateStmt->bindParam(':COCCASION', $_POST['courseOccasion']);
		$updateStmt->bindParam(':SSN', $_POST['ssn']);
		$updateStmt->execute();
		if($updateStmt->execute()){
			$userMsg.="Grade saved";
			$gradeSavedMsg="Saved";
			$gradeSavedForSSN=$_POST['ssn'];
		} else {
			$errorMsg.="ERROR: Failed to save new grade";
			$gradeSavedMsg="Error: Not saved";
		}
		$updateStmt->closeCursor();
	}
	
	if(isset($_POST['saveGradeComment'])){
		//Store new grade comment
		$updateString = "UPDATE AssignedQuizzes 
						 SET AssignedQuizzes.gradeComment=:GRADECOMMENT
						 WHERE AssignedQuizzes.qVarNr=:QVNR
							AND AssignedQuizzes.quizNr=:QNR 
							AND AssignedQuizzes.quizCourseName=:CNAME
							AND AssignedQuizzes.courseOccasion=:COCCASION
							AND AssignedQuizzes.ssn=:SSN;";
		$updateStmt = $pdo->prepare($updateString);
		$updateStmt->bindParam(':GRADECOMMENT', $_POST['gradeComment']);
		$updateStmt->bindParam(':QNR', $_POST['quizNr']);
		$updateStmt->bindParam(':QVNR', $_POST['qVarNr']);
		$updateStmt->bindParam(':CNAME', $_POST['courseName']);
		$updateStmt->bindParam(':COCCASION', $_POST['courseOccasion']);
		$updateStmt->bindParam(':SSN', $_POST['ssn']);
		$updateStmt->execute();
		if($updateStmt->execute()){
			$userMsg.="Grade comment saved";
			$gradeCommentSavedMsg="Saved";
		} else {
			$errorMsg.="ERROR: Failed to save new grade comment";
			$gradeCommentSavedMsg="Error: Not saved";
		}
		$updateStmt->closeCursor();
	}
	
	if(isset($_POST['displayQuizAnswerDetails'])){
		//Fetch data for specific quiz answer
		$queryString = "SELECT  Student.ssn, Student.loginName, Student.name, QuizVariant.correctAnswer, AssignedQuizzes.* 
						FROM QuizVariant, AssignedQuizzes, Student
						WHERE AssignedQuizzes.quizCourseName=QuizVariant.quizCourseName
							AND AssignedQuizzes.qVarNr=QuizVariant.qVarNr
							AND AssignedQuizzes.quizNr=QuizVariant.quizNr
							AND AssignedQuizzes.ssn=Student.ssn
							AND Student.ssn=:SSN
							AND AssignedQuizzes.quizCourseName=:CNAME
							AND AssignedQuizzes.quizNr=:QNR
							AND AssignedQuizzes.qVarNr=:QVNR
							AND AssignedQuizzes.courseOccasion=:COCCASION
						;";
						
		$stmt = $pdo->prepare($queryString);
		$stmt->bindParam(':SSN', $_POST['ssn']);
		$stmt->bindParam(':CNAME', $_POST['courseName']);
		$stmt->bindParam(':QNR', $_POST['quizNr']);
		$stmt->bindParam(':QVNR', $_POST['qVarNr']);
		$stmt->bindParam(':COCCASION', $_POST['courseOccasion']);
		$stmt->execute();
		$quizAnswerData=$stmt->fetch(PDO::FETCH_ASSOC);
		$content="quizChecking/quizAnswerDetails.html.php";
	} else {

		//Fetch all quiz assignments for selected quiz
		$queryString = "SELECT  Student.ssn, Student.loginName, Student.name, AssignedQuizzes.quizNr, AssignedQuizzes.qVarNr, QuizVariant.correctAnswer, AssignedQuizzes.answer, AssignedQuizzes.answerHash, AssignedQuizzes.grade, AssignedQuizzes.gradeComment, AssignedQuizzes.answeredDateTime, Quiz.quizURI 
						FROM QuizVariant, AssignedQuizzes, Student, Quiz
						WHERE AssignedQuizzes.quizCourseName=QuizVariant.quizCourseName
							AND AssignedQuizzes.qVarNr=QuizVariant.qVarNr
							AND AssignedQuizzes.quizNr=QuizVariant.quizNr
							AND AssignedQuizzes.ssn=Student.ssn
							AND AssignedQuizzes.quizCourseName=:CNAME
							AND AssignedQuizzes.quizNr=:QNR
							AND AssignedQuizzes.courseOccasion=:COCCASION
							AND AssignedQuizzes.quizNr=Quiz.nr
						ORDER BY Student.name COLLATE utf8_swedish_ci ASC
						;";
						
		$stmt = $pdo->prepare($queryString);
		$stmt->bindParam(':CNAME', $_POST['courseName']);
		$stmt->bindParam(':QNR', $_POST['quizNr']);
		$stmt->bindParam(':COCCASION', $_POST['courseOccasion']);
		$stmt->execute();
		$quizAssignmentsList=$stmt->fetchAll(PDO::FETCH_ASSOC);
		
		$content="quizChecking/listQuizAnswers.html.php";
	}
} else if(isset($_POST['listQuizzesForCourseOccasionSubmit'])){ //Course and course occasion selected
	//Fetch all quizzes for selected course
	$queryString = "SELECT Quiz.nr, Quiz.courseName, Quiz.opening, Quiz.closing, Quiz.autoCorrected
					FROM Quiz
					WHERE Quiz.courseName=:CNAME;";
	$stmt = $pdo->prepare($queryString);
	$stmt->bindParam(':CNAME', $_POST['courseName']);
	$stmt->execute();
	$quizList=$stmt->fetchAll(PDO::FETCH_ASSOC);

	$content="quizChecking/selectQuiz.html.php";
}else{ //Display list of courses

	//Fetch all courses from Course-table to populate course list
	$queryString = "SELECT * FROM Course";
	$stmt = $pdo->prepare($queryString);
	$stmt->execute();
	$courseList=$stmt->fetchAll(PDO::FETCH_ASSOC);

	$content="quizChecking/selectCourse.html.php";

}
?>