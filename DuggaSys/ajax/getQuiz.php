<?php
session_start(); 
include_once(dirname(__file__)."/../../Shared/sessions.php");
include_once(dirname(__file__)."/../../../coursesyspw.php");
include_once(dirname(__file__)."/../../Shared/database.php");
pdoConnect();
$error = false;
function getQuiz($quizid){
    global $pdo;
    $query = "SELECT name, parameter as parameters, quizFile as template, `release`, deadline FROM quiz WHERE id = :id";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':id', $quizid);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    //print_r($result);
    //var_dump($result);
    return $result;
}

if (checklogin()) {
	if(array_key_exists('quizid', $_POST)) {
		$stmt = $pdo->prepare("SELECT cid FROM quiz WHERE id=:qid");
		$stmt->bindValue(':qid', $_POST['quizid']);
		$stmt->execute();
		$res = $stmt->fetch(PDO::FETCH_ASSOC);
		$courseid = $res['cid'];
	}

	if (isset($courseid) && hasAccess($_SESSION['uid'], $courseid, 'r')) {
		if(isset($_POST['quizid'])){
			$stmt = $pdo->prepare("SELECT count(quizID) as count FROM userAnswer WHERE quizID=:qid and uid=:uid");
			$stmt->bindValue(':qid', $_POST['quizid']);
			$stmt->bindValue(':uid', $_SESSION['uid']);
			$stmt->execute();
			$count = $stmt->fetch();
			//print (json_encode($quiz));
			if ($count["count"]==0) {
				$quiz = getQuiz($_POST["quizid"]);
				//print_r($quiz);
				// Is the quiz released?
				if(strtotime($quiz['release']) > time()) 
					$error = "not released";
			} else {
				$error = "already done";
			}
			
		}else {
			$error = "no quizID set";
		}
	} else {
		$error = "no access";	
	}

if($error!==false) {
	print (json_encode($quiz));
}
else {
	print (json_encode($error));
}


} else {
	echo (json_encode("no access"));
}
?>
