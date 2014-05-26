<?php
session_start(); 
include_once(dirname(__file__)."/../../Shared/sessions.php");
include_once(dirname(__file__)."/../../../coursesyspw.php");
include_once(dirname(__file__)."/../../Shared/database.php");
pdoConnect();

$error = false;

if (checklogin()) {
	if (isSuperUser($_SESSION["uid"])==true) {
		if(isset($_POST['quizid'])){
			$quiz = getQuiz($_POST['quizid']);
		}else {
			$error = true;
		}
	}
	else {
		$error = true;	
	}
}
if(!$error) {
	print (json_encode($quiz));
}
else {
	print (json_encode(array("error")));
}

function getQuiz($quizid){
    global $pdo;
    $query = "SELECT * FROM quiz WHERE id = :id";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':id', $quizid);
      $stmt->execute();
    $result = $stmt->fetch();
    return(returnQuiz($result));
}

function returnQuiz($quiz){
	$template = $quiz['quizFile'];

	$quizData = array(
	    "name" => $quiz['name'],
	    "parameters" => $quiz['parameter'],
	    "template" => false
	);
	$templatePath = '../templates/'.$template.'.js';

	if (file_exists($templatePath)) {
		$quizData["template"] = $template;
	}
	return $quizData;
}
?>
