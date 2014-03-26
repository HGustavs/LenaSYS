<h2>Database dump</h2>
<?php
    $querystring="SHOW TABLES;";
	$stmt = $pdo->prepare($querystring);
	$stmt->execute();
	foreach($stmt->fetchAll() as $row){
		displayTable($row[0],$pdo);
	}
	/*
	displayTable("Student",$pdo);
	displayTable("Course",$pdo);
	displayTable("StudentCourseRegistration",$pdo);
	displayTable("Quiz",$pdo);
	displayTable("QuizVariant",$pdo);
	displayTable("CompletedQuizzes",$pdo);*/
?>