<?php 

//---------------------------------------------------------------------------------------------------------------
// editorService - Saves and Reads content for Code Editor
//---------------------------------------------------------------------------------------------------------------

date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";

// Connect to database and start session
pdoConnect();
session_start();

if(isset($_SESSION['uid'])){
		$userid=$_SESSION['uid'];
}else{
		$userid="1";		
} 

$opt=getOP('opt');
$courseid=getOP('courseid');
$coursevers=getOP('coursevers');
$duggaid=getOP('did');
$variant=getOP('lid');
$moment=getOP('moment');

$debug="NONE!";	

$hr=false;

//------------------------------------------------------------------------------------------------
// Services
//------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------
// Retrieve Information			
//------------------------------------------------------------------------------------------------

if(checklogin()){
	$query = $pdo->prepare("SELECT username, timeSpent FROM userAnswer, user, variant where user.uid = userAnswer.uid AND userAnswer.quiz = :did GROUP BY userAnswer.uid ORDER BY timeSpent ASC LIMIT 10;");
	$query->bindParam(':did', $duggaid);
	//$query->bindParam(':lid', $variant);

	if(!$query->execute()){
		$error=$query->errorInfo();
		$debug="Error fetching entries".$error[2];
	}

	$rows = array();

	foreach($query->fetchAll() as $row) {
		array_push(
			$rows,
			array(
				'username' => $row['username'],
				'timeSpent' => $row['timeSpent']
				)
			);
	}
}

$array = array(
	"debug" => $debug,
	"highscores" => $rows
);

echo json_encode($array);
?>
