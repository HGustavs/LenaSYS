<?php
//List/Add/Remove courses
	// Course(
	// name VARCHAR(200),
	// description TEXT,
	// courseData TEXT,
	
//Add course
if(isset($_POST['addCourse'])){
	$insertString = "INSERT INTO Course(name, description, courseData) VALUES(:CNAME,:DESC,:CDATA);";
	$insertStmt = $pdo->prepare($insertString);
	$insertStmt->bindParam(':NEWCNAME', $_POST['newCourseName']);
	$insertStmt->bindParam(':DESC', $_POST['courseDesc']);
	$insertStmt->bindParam(':CDATA', $_POST['courseData']);
	if($insertStmt->execute()){
		$userMsg.="Course ".$_POST['newCourseName']." successfully added"; 
	} else {
		$errorMsg.="ERROR: Course ".$_POST['newCourseName']." NOT added"; 
	}
	
	$insertQuery="INSERT IGNORE INTO StudentCourseRegistration(studentSsn,courseName,courseOccasion) VALUES(:SSN,:CNAME,:COCCASION);";
		$insert_stmt = $pdo->prepare($insertQuery);
		$insert_stmt->bindParam(':SSN', "123");
        $insert_stmt->bindParam(':CNAME', $_POST['newCourseName']);
		$insert_stmt->bindParam(':COCCASION', "TEST");
		$insert_stmt->execute();
}

//Fetch data for course to edit
if(isset($_POST['editCourse'])){
	$queryString = "SELECT * 
					FROM Course
					WHERE Course.name=:CNAME;";
	$stmt = $pdo->prepare($queryString);
	$stmt->bindParam(':CNAME', $_POST['courseName']);
	$stmt->execute();
	$courseData=$stmt->fetch(PDO::FETCH_ASSOC);
}

//Update edited course
if(isset($_POST['updateCourse'])){
	$updateQuery="UPDATE Course 
				  SET Course.name=:NEWCNAME, Course.description=:DESC, Course.courseData=:CDATA
				  WHERE Course.name=:CNAME;";
	$updateStmt = $pdo->prepare($updateQuery);
	$updateStmt->bindParam(':NEWCNAME', $_POST['newCourseName']);
	$updateStmt->bindParam(':CNAME', $_POST['courseName']);
	$updateStmt->bindParam(':DESC', $_POST['courseDesc']);
	$updateStmt->bindParam(':CDATA', $_POST['courseData']);
	if($updateStmt->execute()){
		$userMsg.="Course ".$_POST['courseName']." successfully updated"; 
	} else {
		$errorMsg.="ERROR: Course ".$_POST['courseName']." NOT updated"; 
	}
}


//Remove course
if(isset($_POST['removeCourse'])){
	// $deleteQuery = "DELETE FROM Course 
					// WHERE Course.name=:CNAME";
	// $deleteStmt = $pdo->prepare($deleteQuery);
	// $deleteStmt->bindParam(':CNAME', $_POST['courseName']);
	// if($deleteStmt->execute()){
		// $userMsg.="Successfully deleted ".$_POST['courseName']; 
	// } else {
		// $errorMsg.="ERROR: Could not delete ".$_POST['courseName']; 
	// }
	$errorMsg.="ERROR: Could not delete ".$_POST['courseName']." FUNCTION DISABLED"; 
}

//Fetch all courses from db
$queryString = "SELECT * FROM Course";
$stmt = $pdo->prepare($queryString);
$stmt->execute();
$courseList=$stmt->fetchAll(PDO::FETCH_ASSOC);


$content="course/courses.html.php";
?>