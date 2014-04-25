<?php
//listQuizAnswers.html.php

/*
echo "<pre>";
print_r($quizAssignmentsList);
echo "</pre>";
*/

addBackLink(array("checkQuizzesLink"=>"", "listQuizzesForCourseOccasionSubmit"=>"","courseName"=>$_POST['courseName'], "courseOccasion"=>$_POST['courseOccasion']));
if(isset($quizAssignmentsList)){
		$counter=0;
		echo "<table class='dataTable'>";
		echo "<caption>Check quizzes for ".$_POST['courseName']." ".$_POST['courseOccasion']."</caption>";
		if(count($quizAssignmentsList)>0){
			echo "<tr><th>&nbsp;</th>";
			foreach($quizAssignmentsList[0] as $columnName=>$data){
				echo "<th>".$columnName."</th>";
			}
			echo "</tr>";
			foreach($quizAssignmentsList as $row){
				$counter++;
				echo "<tr><td>".$counter."</td>";
				foreach($row as $key=>$data){
					
					switch ($key)
					{
					case 'answer':
						echo "<td>".$data."";
						echo "

						<form name='displayQuizAnswerForm' action='quiz/quizLoader.php' method='post'  target='_blank' >
							<input type='hidden' name='withAnswer' id='withAnswer' value='on' />
							<input type='hidden' name='courseName' value='".$_POST['courseName']."' />
							<input type='hidden' name='quizNr' value='".$row['quizNr']."' />
							<input type='hidden' name='answerString' value='".$row['answer']."' />
							<input type='hidden' name='qVarNr' value='".$row['qVarNr']."' />
							<input type='hidden' name='quizURI' value='".$row['quizURI']."' />
								<input type='submit' name='displayQuizAnswer' value='Display answer' />
						</form>

							<!--<form name='displayQuizAnswerForm' action='.' method='post' style=''>
								<input type='submit' name='displayQuizAnswer' value='Display answer' disabled='disabled'/>
								<input type='hidden' name='courseOccasion' value='".$_POST['courseOccasion']."' />
								<input type='hidden' name='courseName' value='".$_POST['courseName']."' />
								<input type='hidden' name='quizNr' value='".$row['quizNr']."' />
								<input type='hidden' name='qVarNr' value='".$row['qVarNr']."' />
								<input type='hidden' name='answer' value='".$row['answer']."' />
								<input type='hidden' name='checkQuizzesLink' />
								<input type='hidden' name='checkSelectedQuiz' />
							</form>-->
						</td>";
						break;
					case 'answerHash':
						echo "<td>".substr($data,0,8)."</td>";
						break;
					case 'grade':
					  	echo "<td>
							<form name='saveGradeForm' action='.' method='post'>
								<input type='text' name='grade' ";
						echo "value='".$row['grade']."' ";
						echo "/>
								<input type='submit' name='saveGrade' value='Save' />
								<input type='hidden' name='courseOccasion' value='".$_POST['courseOccasion']."' />
								<input type='hidden' name='courseName' value='".$_POST['courseName']."' />
								<input type='hidden' name='quizNr' value='".$row['quizNr']."' />
								<input type='hidden' name='qVarNr' value='".$row['qVarNr']."' />
								<input type='hidden' name='ssn' value='".$row['ssn']."' />
								<input type='hidden' name='checkQuizzesLink' />
								<input type='hidden' name='checkSelectedQuiz' /> 
								<input type='hidden' name='scrolly' id='scrolly' value='0' />
							</form>";
						if(isset($gradeSavedMsg) && isset($gradeSavedMsg) && $gradeSavedForSSN==$row['ssn']) echo "<p style='margin:-17px 3px 0 0;font-size:0.7em;float:right'>".$gradeSavedMsg."</p>";	
						echo "</td>";
						break;
					case 'gradeComment':
					  	echo "<td>
							<form name='saveGradeCommentForm' action='.' method='post'>
								<textarea cols='16' rows='1' name='gradeComment' style='height:18px;padding-left:5px;padding-right:5px;' >";
						echo $row['gradeComment'];
						echo "</textarea>
								<input type='submit' name='saveGradeComment' value='Save' />
								<input type='hidden' name='courseOccasion' value='".$_POST['courseOccasion']."' />
								<input type='hidden' name='courseName' value='".$_POST['courseName']."' />
								<input type='hidden' name='quizNr' value='".$row['quizNr']."' />
								<input type='hidden' name='qVarNr' value='".$row['qVarNr']."' />
								<input type='hidden' name='ssn' value='".$row['ssn']."' />
								<input type='hidden' name='checkQuizzesLink' />
								<input type='hidden' name='checkSelectedQuiz' />
								<input type='hidden' name='scrolly' id='scrolly' value='0' />							
							</form>";
						if(isset($gradeCommentSavedMsg)) echo "<p style='margin:-17px 3px 0 0;font-size:0.7em;float:right'>".$gradeCommentSavedMsg."</p>";	
						echo "</td>";
						break;
					case 'quizURI':
						break;
					default:
						echo "<td>".$data."</td>";
					}
				}

					
					echo "<td>
							<form name='displayQuizAnswerDetailsForm' action='.' method='post'>
								<input type='submit' name='displayQuizAnswerDetails' value='Detailed view' />
								<input type='hidden' name='courseOccasion' value='".$_POST['courseOccasion']."' />
								<input type='hidden' name='courseName' value='".$_POST['courseName']."' />
								<input type='hidden' name='quizNr' value='".$row['quizNr']."' />
								<input type='hidden' name='qVarNr' value='".$row['qVarNr']."' />
								<input type='hidden' name='ssn' value='".$row['ssn']."' />
								<input type='hidden' name='checkQuizzesLink' />
								<input type='hidden' name='checkSelectedQuiz' />
							</form>
						</td>";
					/*echo "<td>
							<form name='editSelectedQuizForm' action='.' method='post'>
								<input type='text' name='gradeComment' />
								<input type='submit' name='saveGradeComment' value='Save' />
								<input type='hidden' name='courseOccasion' value='".$_POST['courseOccasion']."' />
								<input type='hidden' name='courseName' value='".$_POST['courseName']."' />
								<input type='hidden' name='quizNr' value='".$_POST['quizNr']."' />
								<input type='hidden' name='qVarNr' value='".$_POST['qVarNr']."' />
								<input type='hidden' name='ssn' value='".$_POST['ssn']."' />
								<input type='hidden' name='checkQuizzesLink' />
								<input type='hidden' name='checkSelectedQuiz' /> 
							</form>
						</td>";
					echo "<td>
							<form name='editSelectedQuizForm' action='.' method='post'>
								<input type='text' name='gradeComment' />
								<input type='submit' name='saveGradeComment' value='Save' />
								<input type='hidden' name='courseOccasion' value='".$_POST['courseOccasion']."' />
								<input type='hidden' name='courseName' value='".$_POST['courseName']."' />
								<input type='hidden' name='quizNr' value='".$_POST['quizNr']."' />
								<input type='hidden' name='qVarNr' value='".$_POST['qVarNr']."' />
								<input type='hidden' name='ssn' value='".$_POST['ssn']."' />
								<input type='hidden' name='checkQuizzesLink' />
								<input type='hidden' name='checkSelectedQuiz' /> 
							</form>
						</td>";*/
				
				echo "</tr>";
			}
		} else {
			echo "<tr><td>This quiz has not been assigned to any student</td></tr>";
		}
		echo "</table>";
	}
?>