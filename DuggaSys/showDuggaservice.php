<?php 

//---------------------------------------------------------------------------------------------------------------
// editorService - Saves and Reads content for Code Editor
//---------------------------------------------------------------------------------------------------------------

date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../Shared/sessions.php";
include_once "basic.php";

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

$debug="NONE!";	

$hr=false;

//------------------------------------------------------------------------------------------------
// Services
//------------------------------------------------------------------------------------------------

if(checklogin()){
	$query = $pdo->prepare("SELECT visibility FROM course WHERE cid=:cid");
	$query->bindParam(':cid', $courseid);
	$result = $query->execute();
	if ($row = $query->fetch(PDO::FETCH_ASSOC)) {
			$hr = ((checklogin() && hasAccess($_SESSION['uid'], $courseid, 'r')) || $row['visibility'] != 0);
			if($hr){
		
					// The code for modification using sessions
					if(strcmp($opt,"DEL")===0){
							$query = $pdo->prepare("DELETE FROM listentries WHERE lid=:lid");
							$query->bindParam(':lid', $sectid);
							if(!$query->execute()) {
								$debug="Error updating entries";
							}
					}
			}
	}
	
}

//------------------------------------------------------------------------------------------------
// Retrieve Information			
//------------------------------------------------------------------------------------------------

if($hr){
		$debug="HR";
}else{
		$debug="NO HR";
}

/*
SELECT param,vid FROM variant WHERE quizID=1;

SELECT aid,cid,quiz,variant,moment,vers from userAnswer;
*/

$array = array(
	"debug" => $debug
);

echo json_encode($array);
?>
