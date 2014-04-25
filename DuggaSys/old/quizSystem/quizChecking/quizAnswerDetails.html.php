<?php
//quizAnswerDetails.html.php
addBackLink(array("checkQuizzesLink"=>"", "checkSelectedQuiz"=>"","courseName"=>$_POST['courseName'], "courseOccasion"=>$_POST['courseOccasion'], "quizNr"=>$_POST['quizNr']));

echo "<h2>Details view</h2>";
// echo "<pre>";
// print_r($quizAnswerData);
// echo "</pre>";
echo "<table class='dataTable' style=''>";
echo "<caption style='white-space:nowrap;'>Quiz ".$_POST['quizNr']." ".$_POST['courseName']." ".$_POST['courseOccasion']."</caption>";

echo "<tr><th>SSN:</th><td style='width:100%;'>".$quizAnswerData['ssn']."</td></tr>";
echo "<tr><th>Name:</th><td>".$quizAnswerData['name']."</td></tr>";
echo "<tr><th>Login name:</th><td>".$quizAnswerData['loginName']."</td></tr>";
echo "<tr><th>Answer submitted:</th><td>".$quizAnswerData['answeredDateTime']."</td></tr>";
echo "<tr><th>Quiz variation nr:</th><td>".$quizAnswerData['qVarNr']."</td></tr>";
echo "<tr><th>Correct answer:</th><td>".$quizAnswerData['correctAnswer']."</td></tr>";
echo "<tr><th>Submitted answer:</th><td>".$quizAnswerData['answer'];
echo "<form name='displayQuizAnswerForm' action='.' method='post'>
		<input type='submit' name='displayQuizAnswer' value='Display answer' disabled='disabled'/>
		<input type='hidden' name='courseOccasion' value='".$_POST['courseOccasion']."' />
		<input type='hidden' name='courseName' value='".$_POST['courseName']."' />
		<input type='hidden' name='quizNr' value='".$quizAnswerData['quizNr']."' />
		<input type='hidden' name='qVarNr' value='".$quizAnswerData['qVarNr']."' />
		<input type='hidden' name='answer' value='".$quizAnswerData['answer']."' />
		<input type='hidden' name='checkQuizzesLink' />
		<input type='hidden' name='displayQuizAnswerDetails' />
	    <input type='hidden' name='scrolly' id='scrolly' value='0' />
	 </form>";
echo "</td></tr>";
echo "<tr><th>Answer hash:</th><td>".$quizAnswerData['answerHash'];
echo "<form name='clearHashAnswerForm' action='.' method='post'>
			<input type='submit' name='checkAnswerHash' value='Check' />";
	if(isset($hashCompareMsg)) echo "<label>".$hashCompareMsg."</label>";
	echo"	<input type='submit' name='clearAnswerHash' value='Clear hash' class='confirm' />
			<label>Clearing the hash allows the student to answer the quiz again</label>
			<input type='hidden' name='courseOccasion' value='".$_POST['courseOccasion']."' />
			<input type='hidden' name='courseName' value='".$_POST['courseName']."' />
			<input type='hidden' name='quizNr' value='".$quizAnswerData['quizNr']."' />
			<input type='hidden' name='qVarNr' value='".$quizAnswerData['qVarNr']."' />
			<input type='hidden' name='ssn' value='".$quizAnswerData['ssn']."' />
			<input type='hidden' name='loginName' value='".$quizAnswerData['loginName']."' />
			<input type='hidden' name='answer' value='".$quizAnswerData['answer']."' />
			<input type='hidden' name='answerHash' value='".$quizAnswerData['answerHash']."' />
			<input type='hidden' name='checkQuizzesLink' />
			<input type='hidden' name='displayQuizAnswerDetails' /> 
			<input type='hidden' name='scrolly' id='scrolly' value='0' />";
echo "</form>";
echo "</td></tr>";
echo "<tr><th>Grade:</th><td>";
echo "<form name='saveGradeCommentForm' action='.' method='post'>
			<input type='text' name='grade' ";
	echo "value='".$quizAnswerData['grade']."' ";
	echo "/>
			<input type='submit' name='saveGrade' value='Save' />
			<input type='hidden' name='courseOccasion' value='".$_POST['courseOccasion']."' />
			<input type='hidden' name='courseName' value='".$_POST['courseName']."' />
			<input type='hidden' name='quizNr' value='".$quizAnswerData['quizNr']."' />
			<input type='hidden' name='qVarNr' value='".$quizAnswerData['qVarNr']."' />
			<input type='hidden' name='ssn' value='".$quizAnswerData['ssn']."' />
			<input type='hidden' name='checkQuizzesLink' />
			<input type='hidden' name='displayQuizAnswerDetails' /> 
			<input type='hidden' name='scrolly' id='scrolly' value='0' />";
	if(isset($gradeSavedMsg)) echo "<label>".$gradeSavedMsg."</label>";	
echo "</form>";
echo "</td></tr>";
echo "<tr><th>Grade comment:</th><td>";
echo "<form name='saveGradeForm' action='.' method='post'>
		    <textarea name='gradeComment' cols='70' rows='10'>";
	echo    $quizAnswerData['gradeComment'];
	echo "  </textarea>
			<input type='submit' name='saveGradeComment' value='Save' />
			<input type='hidden' name='courseOccasion' value='".$_POST['courseOccasion']."' />
			<input type='hidden' name='courseName' value='".$_POST['courseName']."' />
			<input type='hidden' name='quizNr' value='".$quizAnswerData['quizNr']."' />
			<input type='hidden' name='qVarNr' value='".$quizAnswerData['qVarNr']."' />
			<input type='hidden' name='ssn' value='".$quizAnswerData['ssn']."' />
			<input type='hidden' name='checkQuizzesLink' />
			<input type='hidden' name='displayQuizAnswerDetails' /> 
			<input type='hidden' name='scrolly' id='scrolly' value='0' />";
	if(isset($gradeCommentSavedMsg)) echo "<label>".$gradeCommentSavedMsg."</label>";	
echo "</form>";
echo "</td></tr>";
echo "<tr><th>IP of submitter:</th><td>".$quizAnswerData['userIP']."</td></tr>";
echo "<tr><th>Recorded user agent:</th><td>".$quizAnswerData['userAgent']."</td></tr>";
// echo "<th>SSN</th><th>Name</th><th>Login name</th><th>
// echo "</tr>";
echo "</table>";
// echo "<form name='detailedViewQuizAnswerForm' action='.' method='.'>";
// echo "</form>";
?>