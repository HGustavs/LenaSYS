<?php
////Checks if student is registered for a course occasion
////Parameters: loginName, password, courseName, semester (e.g. HT), year (e.g. 12), period (e.g. 1,2,3,4 or 5)
////Returns true if student login name is registered for selected course and correct password was given

//Prevents browsers (IE) from caching the response
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json; charset=utf-8'); 

include "dbconnect.php";
 
$queryString="SELECT COUNT(*) 
			  FROM Student, StudentCourseRegistration
			  WHERE Student.loginName=:SLOGINNAME 
				AND Student.passw=:PASSW
			    AND Student.ssn=StudentCourseRegistration.studentSsn 
				AND StudentCourseRegistration.courseName=:CNAME 
				AND StudentCourseRegistration.courseOccasion=:COCCASION;";
$stmt = $pdo->prepare($queryString);
$stmt->bindParam(':SLOGINNAME', $_POST['loginName']);
$stmt->bindParam(':PASSW', $_POST['password']);
$stmt->bindParam(':CNAME', $_POST['courseName']);
$occation=$_POST['semester']."-".$_POST['year']." LP".$_POST['period'];
$stmt->bindParam(':COCCASION', $occation);
$stmt->execute();

$count=$stmt->fetchColumn();

if($count==1){
	echo json_encode(array('loginSuccess' => 'true'));
} else {
	echo json_encode(array('loginSuccess' => 'false'));
}

?>