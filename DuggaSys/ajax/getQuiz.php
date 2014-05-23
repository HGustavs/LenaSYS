<?php


session_start(); 
include_once(dirname(__file__)."/../../Shared/sessions.php");
include_once(dirname(__file__)."/../../../coursesyspw.php");
include_once(dirname(__file__)."/../../Shared/database.php");
pdoConnect();

if (checklogin()) {
	if (isSuperUser($_SESSION["uid"])==true) {
		
		if(isset($_POST['quizid'])){
			getQuiz($_POST['quizid']);
		}else {
			echo "No quizid";
		}

	}
}
function getQuiz($quizid){
    global $pdo;
    $query = "SELECT * FROM quiz WHERE id = :id";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':id', $quizid);
      $stmt->execute();
    $result = $stmt->fetch();
    returnQuiz($result);

}
function returnQuiz($quiz){
    
	$error = false;
	$template = $quiz['template'];

	$quizArray = array(
	    "name" => $quiz['name'],
	    "parameters" => $quiz['parameters'],
	    "question" => $quiz['question'],
	    "template" => "false"
	);
	$templatePath = '../templates/'.$template.'.js';

	if (file_exists($templatePath)) {
		$quizArray["template"] = $template;
	}

	foreach ($quizArray as $value) {
		if($value == "false") {
			$error = true;
		}
	}

	if(!$error) {
		print (json_encode($quizArray));
	}
	else {
		print (json_encode(array("error")));
	}
}
?>
