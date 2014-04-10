<?php
//List courses
if(isset($courseList)){
	echo "<table class='dataTable'>";
	echo "<caption>Select course and course occasion</caption>";
	if(count($courseList)>0){
		/*foreach($courseList[0] as $columnName=>$data){
			echo "<th>".$columnName."</th>";
		}*/
		echo "<th>Course name</th>";
		echo "<th>Course occasion</th>";
		foreach($courseList as $course){
			echo "<tr>";
			echo "<td>".$course['name']."</td>";
			echo "	<td>";
			//Gather all courseOccasions for this course //StudentCourseRegistration studentSsn	courseName	courseOccasion
			$queryString = "SELECT DISTINCT StudentCourseRegistration.courseOccasion
							FROM StudentCourseRegistration
							WHERE StudentCourseRegistration.courseName=:CNAME;";
			$stmt = $pdo->prepare($queryString);
			$stmt->bindParam(':CNAME', $course['name']);
			$stmt->execute();
			$courseOccasionList=$stmt->fetchAll(PDO::FETCH_ASSOC);
			if(count($courseOccasionList)>0){
				echo "	<form name='courseOccasionForm' action='.' method='post'>";
				echo "		<select name='courseOccasion'>";
				foreach($courseOccasionList as $courseOccasion){
					echo "		<option value='".$courseOccasion['courseOccasion']."'>".$courseOccasion['courseOccasion']."</option>";
				}
				echo "		</select>";
				echo "		<input type='hidden' name='checkQuizzesLink' />";
				echo "		<input type='hidden' name='courseName' value='".$course['name']."' />";
				echo "		<input type='submit' name='listQuizzesForCourseOccasionSubmit' value='List quizzes' />";
				echo "	</form>";
			} else {
				echo "No occasions found";
			}
			echo "	</td>";
			echo "</tr>";
		}
	} else {
		echo "<tr><td>No courses found in the database</td></tr>";
	}
	echo "</table>";
}
?>