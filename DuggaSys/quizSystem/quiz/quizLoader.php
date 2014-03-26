<?php
////////////////////////////////////////////// 
echo "<pre>";
	print_r($_POST);
echo "</pre>";

include "../dbconnect.php";
$answerString="";
if(isset($_POST['withAnswer']) && $_POST['withAnswer']=="on"){
	if(isset($_POST['answerString'])) $answerString=$_POST['answerString'];
}
$accountname="a00nisse";
$courseName=$_POST['courseName'];
$courseOccasion="TEST";
$quizNr=$_POST['quizNr'];
$quizVariant=$_POST['qVarNr'];


$insertString="INSERT IGNORE INTO AssignedQuizzes(ssn, quizNr, qVarNr, quizCourseName, courseOccasion) 
						   VALUES((SELECT Student.ssn FROM Student WHERE Student.loginName=:LOGIN), :QNR, :QVARNR, :CNAME, :COCCASION);";
$insertStmt = $pdo->prepare($insertString);
$insertStmt->bindParam(':LOGIN', $accountname);
$insertStmt->bindParam(':CNAME', $courseName);
$insertStmt->bindParam(':QNR', $quizNr);
$insertStmt->bindParam(':QVARNR', $quizVariant);  
$insertStmt->bindParam(':COCCASION', $courseOccasion);
$insertStmt->execute();
echo "<h2>111</h2>";

$updateString="UPDATE AssignedQuizzes SET qVarNr=:QVARNR, answerHash=:AHASH 
               WHERE (SELECT Student.ssn FROM Student WHERE Student.loginName=:LOGIN)=AssignedQuizzes.ssn 
			      AND AssignedQuizzes.quizNr=:QNR
				  AND AssignedQuizzes.quizCourseName=:CNAME
				  AND AssignedQuizzes.courseOccasion=:COCCASION;";
$updateString = $pdo->prepare($updateString);
$updateString->bindParam(':LOGIN', $accountname);
$updateString->bindParam(':CNAME', $courseName);
$updateString->bindParam(':QNR', $quizNr);
$updateString->bindParam(':QVARNR', $quizVariant);
$ahash="";  
$updateString->bindParam(':AHASH', $ahash);  
$updateString->bindParam(':COCCASION', $courseOccasion);
$updateString->execute();				

$quizURI = $_POST['quizURI'];
if (strpos($quizURI,"?") === false ) {
    $quizURI .= "?";
} else {
    $quizURI .= "&";
}
$quizURI .= "courseOccasion=".$courseOccasion."&answerString=".$answerString;

header("location:".$quizURI);
?>