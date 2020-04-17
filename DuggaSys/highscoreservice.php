<?php 

//---------------------------------------------------------------------------------------------------------------
// Highscoreservice - Used by highscore system to communicate with the database
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
$coursename=getOP('coursename');
$coursevers=getOP('coursevers');
$duggaid=getOP('did');
$variant=getOP('lid');
$moment=getOP('moment');

$debug="NONE!";	

$log_uuid = getOP('log_uuid');
$info=$opt." ".$courseid." ".$coursename;
logServiceEvent($log_uuid, EventTypes::ServiceServerStart, "highscoreservice.php",$userid,$info);

//------------------------------------------------------------------------------------------------
// Services
//------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------
// Retrieve Information			
//------------------------------------------------------------------------------------------------

// The query specified below selects only scores associated with users that have returned a dugga with a passing grade
$query = $pdo->prepare("SELECT username, score FROM userAnswer, user where userAnswer.grade > 1 AND user.uid = userAnswer.uid AND userAnswer.quiz = :did AND userAnswer.moment = :lid GROUP BY userAnswer.uid ORDER BY score ASC LIMIT 10;");
$query->bindParam(':did', $duggaid);
$query->bindParam(':lid', $variant);

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
			'score' => $row['score']
		)
	);
}

$user = array();

if(checklogin()){
	$nrOfRows = count($rows);
	for($i = 0; $i < $nrOfRows; $i++){
		if($rows[$i]["username"] === $_SESSION["loginname"]){
			$user[] = $i;
			break;
		}
	}

	if(count($user) === 0){
		// This must be tested
		$query = $pdo->prepare("SELECT username, score FROM userAnswer, user where user.username = :user AND user.uid = userAnswer.uid AND userAnswer.quiz = :did AND userAnswer.moment = :lid LIMIT 1;");
		$query->bindParam(':did', $duggaid);
		$query->bindParam(':lid', $variant);
		$query->bindParam(':user', $_SESSION["loginname"]);
	
		if(!$query->execute()){
			$error=$query->errorInfo();
			$debug="Error fetching entries".$error[2];
		}
				
		foreach($query->fetchAll() as $row){
			$user = array(
				"username" => $row["username"],
				"score" => $row["score"]
			);
		}
	}
}

$array = array(
	"debug" => $debug,
	"highscores" => $rows,
	"user" => $user
);

echo json_encode($array);

logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "highscoreservice.php",$userid,$info);
?>
 
