<?php
	//parseForm.php
		//Fetch all courses from Course-table to populate dropdown-list
	$querystring = "SELECT * FROM Course";
    $stmt = $pdo->prepare($querystring);
    $stmt->execute();
	$courseList=$stmt->fetchAll(PDO::FETCH_ASSOC);
	
	//Display student registration form
	$content="registerStudents/parseForm.html.php";
?>