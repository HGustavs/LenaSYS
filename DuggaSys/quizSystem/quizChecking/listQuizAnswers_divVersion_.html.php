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
		echo "<div class='dataTable'>";
		echo "<div class='tableCaption'>Check quizzes for ".$_POST['courseName']." ".$_POST['courseOccasion']."</div>";
		if(count($quizAssignmentsList)>0){
			echo "<div class='headerRow'><div class='tableHeader'>&nbsp;</div>";
			foreach($quizAssignmentsList[0] as $columnName=>$data){
				echo "<div class='tableHeader'>".$columnName."</div>";
			}
			echo "</div>";
			foreach($quizAssignmentsList as $row){
				$counter++;
				echo "<div class='dataRow'><div class='tableData'>".$counter."</div>";
				foreach($row as $key=>$data){
					
					switch ($key)
					{
					case 'answer':
						echo "<div class='tableData'>".$data."";
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

						</div>";
						break;
					case 'answerHash':
						echo "<div class='tableData'>".substr($data,0,8)."</div>";
						break;
					case 'grade':
					  	echo "<div class='tableData'>
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
						if(isset($gradeSavedMsg)) echo "<p style='margin:-17px 3px 0 0;font-size:0.7em;float:right'>".$gradeSavedMsg."</p>";	
						echo "</div>";
						break;
					case 'gradeComment':
					  	echo "<div class='tableData'>
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
						echo "</div>";
						break;
					case 'quizURI':
						break;
					default:
						echo "<div class='tableData'>".$data."</div>";
					}
				}

					
					echo "<div class='tableData'>
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
						</div>";
					/*echo "<div class='tableData'>
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
						</div>";
					echo "<div class='tableData'>
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
						</div>";*/
				
				echo "</div>";
			}
		} else {
			echo "<div class='dataRow'><div class='tableData'>This quiz has not been assigned to any student</div></div>";
		}
		echo "</div>";
	}
?>