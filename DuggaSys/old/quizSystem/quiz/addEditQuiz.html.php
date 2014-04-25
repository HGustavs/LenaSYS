<?php
//Add/Edit quiz
addBackLink(array("courseName"=>$_POST['courseName'],"listQuizzesLink"=>"","listQuizzesSubmit"=>""));

if(isset($_POST['editSelectedQuiz'])){
	/*echo "<pre>";
	print_r($quiz);
	echo "</pre>";*/
	echo "<h2>Edit quiz nr ".$quiz['nr']." for course ".$quiz['courseName']."</h2>";
} else {
	echo "<h2>Add quiz to ".$_POST['courseName']."</h2>";
}
//Form to add/edit quizzes to the selected course
echo "<form name='addEditQuizForm' action='.' method='post'>";
echo "<label for='quizNr'>Quiz Nr:</label>";
echo "<input type='text' name='newQuizNr' ";
if(isset($quiz['nr'])) echo "value='".$quiz['nr']."' ";
echo " />";

echo "<br />";
echo "<label for='quizOpeningDateTime'>Opening date and time (YYYY-MM-DD hh:mm:ss):</label>";
echo "<input type='text' name='quizOpeningDateTime' ";
if(isset($quiz['opening'])) echo "value='".$quiz['opening']."' ";
echo " />";

echo "<br />";
echo "<label for='quizClosingDateTime'>Closing date and time (YYYY-MM-DD hh:mm:ss):</label>";
echo "<input type='text' name='quizClosingDateTime' ";
if(isset($quiz['closing'])) echo "value='".$quiz['closing']."' ";
echo " />";

echo "<br />";
echo "<label for='quizAutoCorrected'>Is corrected automatically:</label>";
echo "<input type='checkbox' name='quizAutoCorrected'";
if(isset($quiz['autoCorrected']) && $quiz['autoCorrected']=='1') echo "checked='checked' ";
echo " />";

echo "<label for='allowMultipleReplies'>Multiple replies is allowed:</label>";
echo "<input type='checkbox' name='allowMultipleReplies' ";
if(isset($quiz['allowMultipleReplies']) && $quiz['allowMultipleReplies']=='1') echo "checked='checked' ";
echo " />";

echo "<br />";
echo "<label for='quizURI'>Quiz URI:</label><br />";
echo "<input type='text' name='quizURI' value='";
if(isset($quiz['quizURI'])) echo $quiz['quizURI'];
echo "' size='134' />";

echo "<br />";
echo "<label>Quiz data:</label><br />";
echo "<textarea name='quizData' rows='30' cols='100'>";
if(isset($quiz['quizData'])) echo $quiz['quizData'];
echo "</textarea>";

echo "<br />";
echo "<input type='hidden' name='listQuizzesLink' />";
echo "<input type='hidden' name='listQuizzesSubmit' />";
echo "<input type='hidden' name='courseName' value='".$_POST['courseName']."' />";
if(isset($_POST['editSelectedQuiz'])){
	echo "<input type='hidden' name='quizNr' value='".$quiz['nr']."' />";
	echo "<input type='submit' name='submitChangesToQuizSubmit' value='Submit changes' />";
} else {
	echo "<input type='submit' name='addQuizToCourseSubmit' value='Add' />";
}
echo "</form>";
?>