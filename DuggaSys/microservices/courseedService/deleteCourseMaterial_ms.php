<?php


date_default_timezone_set("Europe/Stockholm");

 // Include basic application services
 include_once ("../../../../coursesyspw.php");
 include_once ("../../../Shared/sessions.php");
 include_once ("../../../Shared/basic.php");

// Connect to database and start session
pdoConnect();
session_start();

$debug="NONE!";


//Delete course matterial from courses that have been marked as deleted.
$deleted = 3;
$query = $pdo->prepare("DELETE codeexample FROM course,codeexample WHERE course.visibility=:deleted AND codeexample.cid = course.cid;");
$query->bindParam(':deleted', $deleted);
 if(!$query->execute()) {
	$error=$query->errorInfo();
	$debug="Error reading courses\n".$error[2];
} 

$query = $pdo->prepare("DELETE listentries FROM course,listentries WHERE course.visibility=:deleted AND listentries.cid = course.cid;");
$query->bindParam(':deleted', $deleted);
 if(!$query->execute()) {
	$error=$query->errorInfo();
	$debug="Error reading courses\n".$error[2];
} 

$query = $pdo->prepare("DELETE quiz FROM course,quiz WHERE course.visibility=:deleted AND quiz.cid = course.cid;");
$query->bindParam(':deleted', $deleted);
 if(!$query->execute()) {
	$error=$query->errorInfo();
	$debug="Error reading courses\n".$error[2];
} 

$query = $pdo->prepare("DELETE vers FROM course,vers WHERE course.visibility=:deleted AND vers.cid = course.cid;");
$query->bindParam(':deleted', $deleted);
 if(!$query->execute()) {
	$error=$query->errorInfo();
	$debug="Error reading courses\n".$error[2];
} 

//Delete Courses that have been marked as deleted.
$query = $pdo->prepare("DELETE course FROM course WHERE visibility=:deleted;");
$query->bindParam(':deleted', $deleted);
if(!$query->execute()) {
	$error=$query->errorInfo();
	$debug="Error reading courses\n".$error[2];
}


?>