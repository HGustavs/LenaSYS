<?php 
if(isset($_POST['answers']) && $_POST['answers'] != ""){

	include_once dirname(__FILE__) . "/../../Shared/external/password.php";
	include_once(dirname(__FILE__) . "/../../Shared/basic.php");
	pdoConnect();
	$answers = $_POST['answers'];
	$quiz_id = $_POST['quiz_id'];
	if(compareAnswer($answers, $quiz_id)){
	   echo "true";
	}else {
	   echo "false";
	}
	
}
function compareAnswer($answers, $quiz_id){

	global $pdo;
	$query = "SELECT answer FROM quiz WHERE id = :id";
	$stmt = $pdo->prepare($query);
	$stmt->bindParam(':id', $quiz_id);
	if($stmt->execute() && $stmt->rowCount() > 0){
	$results = $stmt->fetch();
		if($results['answer'])
		
	}else {
	
	    return false;
	
	}
	
}
?>