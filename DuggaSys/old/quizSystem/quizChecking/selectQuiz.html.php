<?php
//selectQuiz.html.php
addBackLink(array("checkQuizzesLink"=>""));
	if(isset($quizList)){
		echo "<table class='dataTable'>";
		echo "<caption>Check quizzes for ".$_POST['courseName']." ".$_POST['courseOccasion']."</caption>";
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
							<input type='submit' name='checkSelectedQuiz' value='Check quiz answers' />
							<input type='hidden' name='courseOccasion' value='".$_POST['courseOccasion']."' />
							<input type='hidden' name='courseName' value='".$row['courseName']."' />
							<input type='hidden' name='quizNr' value='".$row['nr']."' />
							<input type='hidden' name='checkQuizzesLink' />
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