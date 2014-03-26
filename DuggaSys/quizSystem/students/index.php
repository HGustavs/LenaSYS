<?php
	$PASSWORDLENGTH=8;
	
	/*if(isset($_POST['scrolly'])){
		
	}*/
	
	//Change password for a student
	if(isset($_POST['generateNewPassWordForStudent']) && isset($_POST['studentSSN']) && isset($_POST['studentLoginName'])){
		$newPassword=generatePassword($PASSWORDLENGTH);
		
		$updateQuery="UPDATE Student SET Student.passw=:PASSW WHERE Student.ssn=:SSN;";
		$updateStmt = $pdo->prepare($updateQuery);
		$updateStmt->bindParam(':SSN', $_POST['studentSSN']);
		$hashedPassw= md5($newPassword);
		$updateStmt->bindParam(':PASSW',$hashedPassw);
		$newPasswordForSSN=$_POST['studentSSN'];
		if($updateStmt->execute()){
			$userMsg.="New password for SSN: ".$_POST['studentSSN']." Login:".$_POST['studentLoginName']." Password:".$newPassword; 
		} else {
			$errorMsg.="ERROR: Failed to generate new password for SSN: ".$_POST['studentSSN']." Login:".$_POST['studentLoginName']." Password:".$newPassword; 
		}
	}
	
	//Unregister selected student from a specific course occasion
	if(isset($_POST['unregisterStudentSubmit'])){
		// $deleteQuery = "DELETE FROM StudentCourseRegistration 
		                // WHERE StudentCourseRegistration.studentSsn=:SSN 
							// AND StudentCourseRegistration.courseName=:CNAME 
							// AND StudentCourseRegistration.courseOccasion=:COCCASION;";
		// $deleteStmt = $pdo->prepare($deleteQuery);
		// $deleteStmt->bindParam(':SSN', $_POST['studentSSN']);
		// $deleteStmt->bindParam(':CNAME', $_POST['courseName']);
		// $deleteStmt->bindParam(':COCCASION', $_POST['courseOccasion']);
		
		// if($deleteStmt->execute()){
			// $userMsg.="Student with SSN: ".$_POST['studentSSN']." successfully unregistered from ".$_POST['courseName']." ".$_POST['courseOccasion']; 
		// } else {
			// $errorMsg.="Student with SSN: ".$_POST['studentSSN']." WAS NOT unregistered from ".$_POST['courseName']." ".$_POST['courseOccasion']; 
		// }
		 $errorMsg.="Student with SSN: ".$_POST['studentSSN']." WAS NOT unregistered from ".$_POST['courseName']." ".$_POST['courseOccasion']." - FUNCTION DISABLED"; 
		
	}
	
	//Fetch list of students registered to selected course
	if(isset($_POST['listStudentsSubmit'])){
		$querystring = "SELECT Student.ssn,Student.name,Student.loginName 
		                FROM Student, StudentCourseRegistration
						WHERE Student.ssn=StudentCourseRegistration.StudentSsn 
							AND StudentCourseRegistration.courseName=:CNAME
							AND StudentCourseRegistration.courseOccasion=:COCCASION
						ORDER BY Student.name ASC;";
		$stmt = $pdo->prepare($querystring);
		$stmt->bindParam(':CNAME', $_POST['courseName']);
        if(isset($_POST['courseOccasion'])){
			$occasion=$_POST['courseOccasion'];
		} else {
			$occasion=$_POST['semester']."-".$_POST['year']." LP".$_POST['period'];
		}
		$stmt->bindParam(':COCCASION', $occasion);
		$stmt->execute();
		$studentList=$stmt->fetchAll(PDO::FETCH_ASSOC);
	}
	
	//Fetch all courses from Course-table to populate dropdown-list
	$querystring = "SELECT * FROM Course";
    $stmt = $pdo->prepare($querystring);
    $stmt->execute();
	$courseList=$stmt->fetchAll(PDO::FETCH_ASSOC);
	
	$content="students/listStudents.html.php";
?>