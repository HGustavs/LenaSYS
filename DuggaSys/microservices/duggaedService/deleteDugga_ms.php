<?php

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";

date_default_timezone_set("Europe/Stockholm");

// Connect to database and start session
pdoConnect();
session_start();

$opt=getOP('opt');
$qid=getOP('qid');

if(strcmp($opt,"DELDU")===0){
	$query = $pdo->prepare("DELETE FROM userAnswer WHERE quiz=:qid;");
	$query->bindParam(':qid', $qid);
	if(!$query->execute()) {
		$debug = "Useranswer could not be deleted.";
	}

	$query = $pdo->prepare("DELETE FROM quiz WHERE id=:qid;");
	$query->bindParam(':qid', $qid);

	if(!$query->execute()) {
		$debug = "Quiz could not be deleted.";
	}
}

?>
