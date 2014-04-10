<h2>List quizzes by course</h2>
<form name="listQuizzesForCourseSelectForm" action="." method="post">
	<label>Course:</label><br />
	<select name="courseName">
	<?php
		//All courses in the database
		//$courseList
		foreach ($courseList as $course) {
			echo "<option value='".$course['name']."'>".$course['name']."</option>";
		}
	?>
	</select>
	<br />

	<input type="hidden" name="listQuizzesLink" />
	<input type="submit" name="listQuizzesSubmit" value="Display quizzes" />
	<input type="submit" name="addQuizSubmit" value="Add new quiz" />
</form>


<?php 
	if(isset($quizList)){
		echo "<table class='dataTable'>";
		echo "<caption>".$_POST['courseName']."</caption>";
		if(count($quizList)>0){
			foreach($quizList[0] as $columnName=>$data){
				echo "<th>".$columnName."</th>";
			}
			echo "</tr>";
			foreach($quizList as $row){
				echo "<tr>";
				foreach($row as $data){
					echo "<td>".$data."</td>";
				}
				echo "<td>
						<form name='editSelectedQuizForm' action='.' method='post'>
							<input type='submit' name='editSelectedQuiz' value='Edit' />
							<input type='hidden' name='courseName' value='".$row['courseName']."' />
							<input type='hidden' name='quizNr' value='".$row['nr']."' />
							<input type='hidden' name='listQuizzesLink' />
						</form>
					</td>";
				echo "<td>
						<form name='listVariantsForSelectedQuizForm' action='.' method='post'>
							<input type='submit' name='listVariantsForSelectedQuiz' value='Variants' />
							<input type='hidden' name='courseName' value='".$row['courseName']."' />
							<input type='hidden' name='quizNr' value='".$row['nr']."' />
							<input type='hidden' name='listQuizzesLink' />
						</form>
					</td>";
				echo "<td>
						<form name='deleteSelectedQuizForm' action='.' method='post'>
							<input type='submit' name='deleteSelectedQuiz' value='Delete' class='confirm' />
							<input type='hidden' name='courseName' value='".$row['courseName']."' />
							<input type='hidden' name='quizNr' value='".$row['nr']."' />
							<input type='hidden' name='listQuizzesLink' />
							<input type='hidden' name='listQuizzesSubmit' />
							<input type='hidden' name='scrolly' id='scrolly' value='0' />
						</form>
					</td>";
				echo "</tr>";
			}
		} else {
			echo "<tr><td>No quizzes found for this course.</td></tr>";
		}
		echo "</table>";
	}
?>

<a href=".">Back</a>