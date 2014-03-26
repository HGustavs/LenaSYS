<?php
////Returns "loginSuccess=>true" if student login name and password is correct and list of course registrations the student is registered for, else "loginSuccess=>false";
////Parameters: loginName, password
////Returns loginSucces: true/false, array(courseName, courseOccasion)

//Prevents browsers (IE) from caching the response
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json; charset=utf-8'); 

include "dbconnect.php";
 
$queryString="SELECT Student.ssn
			  FROM Student
			  WHERE Student.loginName=:LOGINNAME
				AND Student.passw=:PASSW;";
$stmt = $pdo->prepare($queryString);
$stmt->bindParam(':LOGINNAME', $_POST['loginName']);
$stmt->bindParam(':PASSW', $_POST['password']);
$stmt->execute();
$count=$stmt->rowCount();
if($count==1){ //login successfull
	$studentData=$stmt->fetch(PDO::FETCH_ASSOC);
	$queryString="SELECT StudentCourseRegistration.courseName, StudentCourseRegistration.courseOccasion
				  FROM StudentCourseRegistration
				  WHERE studentSsn=:SSN;";
	$stmt = $pdo->prepare($queryString);
	$stmt->bindParam(':SSN', $studentData['ssn']);
	$stmt->execute();
	$listOfCourseRegistrations=array();
	$courseRegistrations=$stmt->fetchAll(PDO::FETCH_ASSOC);
	foreach($courseRegistrations as $row){
		array_push($listOfCourseRegistrations, array('courseName'=>$row['courseName'],'courseOccasion'=>$row['courseOccasion']));
	}
	echo json_encode(array('loginSuccess' => 'true','courseRegistrations'=>$listOfCourseRegistrations));
} else {
	echo json_encode(array('loginSuccess' => 'false'));
}

?>