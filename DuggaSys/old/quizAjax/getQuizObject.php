<?php
////Returns a quiz object 
////Parameters: (POST) objectID, quizNr, qVarNr, courseName, courseOccasion, login, password
////Returns: objectData

session_start();
//Check if the sent login name is the same as the one stored in the session
if($_POST['loginName']==$_SESSION['loginName'] && $_POST['courseName']==$_SESSION['courseName'] && $_POST['quizNr']==$_SESSION['quizNr']){ 

	//Prevents browsers (IE) from caching the response
	header('Cache-Control: no-cache, must-revalidate');
	header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
	//header('Content-type: application/json');
	header('Content-type: application/json; charset=utf-8'); 

	include "dbconnect.php";

	//Check if the student is a praticipant of the course
	$queryString="SELECT COUNT(*) 
				   FROM Student, StudentCourseRegistration 
				   WHERE Student.ssn=StudentCourseRegistration.studentSsn
				   AND Student.loginName=:LOGIN
				   AND courseName=:CNAME 
				   AND courseOccasion=:COCCASION;";
	$stmt = $pdo->prepare($queryString);
	$stmt->bindParam(':LOGIN', $_POST['loginName']);
	$stmt->bindParam(':CNAME', $_POST['courseName']);
	$stmt->bindParam(':COCCASION', $_POST['courseOccasion']);
	$stmt->execute();

	if($stmt->fetchColumn()==1){ //Student is registered for the course - COUNT result read from the first column of the next unread row (i.e. the first row) 
		
		//Check if quiz is open
		$queryString="SELECT Quiz.opening, Quiz.closing
					   FROM Quiz
					   WHERE Quiz.nr=:QNR
					   AND Quiz.courseName=:CNAME;";
		$stmt = $pdo->prepare($queryString);
		$stmt->bindParam(':QNR', $_POST['quizNr']);
		$stmt->bindParam(':CNAME', $_POST['courseName']);
		$stmt->execute();
		$quizDateTimes=$stmt->fetch(PDO::FETCH_ASSOC);
		if($quizDateTimes){
			$now = new DateTime();
			$opening = new DateTime($quizDateTimes['opening']);
			$closing = new DateTime($quizDateTimes['closing']);

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
	
		//Fetch quiz variant nr
		$queryString="SELECT AssignedQuizzes.qVarNr, AssignedQuizzes.quizNr
					  FROM AssignedQuizzes 
					  WHERE AssignedQuizzes.ssn=(SELECT Student.ssn FROM Student WHERE Student.ssn=AssignedQuizzes.ssn AND Student.loginName=:LOGIN) 
						AND AssignedQuizzes.quizNr=:QNR 
						AND AssignedQuizzes.quizCourseName=:CNAME
						AND AssignedQuizzes.courseOccasion=:COCCASION;";
		$stmt = $pdo->prepare($queryString);
		$stmt->bindParam(':LOGIN', $_POST['loginName']);
		$stmt->bindParam(':QNR', $_POST['quizNr']);
		$stmt->bindParam(':CNAME', $_POST['courseName']);
		$stmt->bindParam(':COCCASION', $_POST['courseOccasion']);
		$stmt->execute();

		$quizAssignmentData=$stmt->fetch(PDO::FETCH_ASSOC);
		$qVarNr=$quizAssignmentData['qVarNr'];
        if (isset($_POST["restDebug"]) && $_POST["restDebug"]) {
            var_dump($quizAssignmentData);
        }

        if (isset($_POST["adminQuizVariant"]) && $_POST["adminQuizVariant"]>0) {
            $qVarNr = $_POST["adminQuizVariant"];
        }
		
		$queryString="SELECT QuizVariantObject.objectData, QuizVariantObject.quizNr, QuizVariantObject.qVarNr, QuizVariantObject.id
					  FROM QuizVariantObject 
					  WHERE QuizVariantObject.id=:OID AND QuizVariantObject.quizNr=:QNR AND QuizVariantObject.qVarNr=:QVNR AND QuizVariantObject.quizCourseName=:CNAME;";
		$stmt = $pdo->prepare($queryString);
		$stmt->bindParam(':OID', $_POST['objectID']);
		$stmt->bindParam(':QNR', $_POST['quizNr']);
		$stmt->bindParam(':QVNR', $qVarNr);
		$stmt->bindParam(':CNAME', $_POST['courseName']);
		$stmt->execute();

		$quizVariantObject=$stmt->fetch(PDO::FETCH_ASSOC);

        $quizVariantObject["varnr"] = $qVarNr;
        $quizVariantObject["objectID"] = $_POST['objectID'];
        if (isset($_POST["restDebug"])) {
            var_dump($quizVariantObject);
        }
		if(count($quizVariantObject)>0){
			$quizVariantObject['objectData']=htmlspecialchars_decode($quizVariantObject['objectData']);
			echo json_encode($quizVariantObject);
			exit();
		} else {
			echo json_encode(array('Error' => 'Object not found'));
			exit();
		}
	} else {
		echo json_encode(array('Error' => 'Student not registered for this course (or incorrect password was sent)'));
		exit();
	}
} else { //Sent login name does not match the login name stored in the session
	echo json_encode(array('Error' => 'Sent login name does not match stored login name'));
    var_dump($_POST);
    var_dump($_SESSION);
}
?>