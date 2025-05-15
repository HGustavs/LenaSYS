<?php

//
// Microservice for saveDugga that has update userAnswer, insert userAnswer and selecting data from userAnswer
//

date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "retrieveShowDuggaService_ms.php";

pdoConnect(); // Connect to database and start session
session_start();

if(isset($_SESSION['uid'])){
	$userid=$_SESSION['uid'];
	$loginname=$_SESSION['loginname'];
	$lastname=$_SESSION['lastname'];
	$firstname=$_SESSION['firstname'];
}else{
	$userid="guest";		
} 	

$opt=getOP('opt');
$courseid=getOP('courseid');
$coursevers=getOP('coursevers');
$duggaid=getOP('did');
$moment=getOP('moment');
$segment=getOP('segment');
$answer=getOP('answer');
$highscoremode=getOP('highscoremode');
$setanswer=postOPValue('setanswer');
$showall=getOP('showall');
$contactable=getOP('contactable');
$rating=getOP('score');
$entryname=getOP('entryname');
$hash=getOP('hash');
$hashpwd=getOP('password');
$password=getOP('password');
$AUtoken=getOP('AUtoken');
$variantvalue= getOP('variant');
$hashvariant="UNK";
$duggatitle="UNK";
$duggatitle=getOP('qname');
$link="UNK";

$showall="true";
$param = "UNK";
$savedanswer = "";
$highscoremode = "";
$quizfile = "UNK";
$grade = "UNK";
$submitted = "";
$marked ="";

$insertparam = false;
$score = 0;
$timeUsed;
$stepsUsed;
$duggafeedback = "UNK";
$variants=array();
$variantsize;
$ishashindb = false;
$timesSubmitted = 0;
$timesAccessed = 0;

$savedvariant="UNK";
$newvariant="UNK";
$savedanswer="UNK";
$isIndb=false;
$variantsize="UNK";
$variantvalue="UNK";
$files= array();
$isTeacher=false;
// Create empty array for dugga info!
$duggainfo=array();
$duggainfo['deadline']="UNK";
$duggainfo['qrelease']="UNK";
$hr=false;
$userfeedback="UNK";
$feedbackquestion="UNK";
$isFileSubmitted="UNK";

$debug="NONE!";	

if($courseid != "UNK" && $coursevers != "UNK" && $duggaid != "UNK" && $moment != "UNK"){
	if((isset($_POST["submission-$courseid-$coursevers-$duggaid-$moment"]) && 
		isset($_POST["submission-password-$courseid-$coursevers-$duggaid-$moment"]) && 
		isset($_POST["submission-variant-$courseid-$coursevers-$duggaid-$moment"]))) {
		$hash=$_POST["submission-$courseid-$coursevers-$duggaid-$moment"];
		$hashpwd=$_POST["submission-password-$courseid-$coursevers-$duggaid-$moment"];
		$variant=$_POST["submission-variant-$courseid-$coursevers-$duggaid-$moment"];
	}
	else{
		$hash=$_SESSION["submission-$courseid-$coursevers-$duggaid-$moment"];
		$hashpwd=$_SESSION["submission-password-$courseid-$coursevers-$duggaid-$moment"];
		$variant=$_SESSION["submission-variant-$courseid-$coursevers-$duggaid-$moment"];
	}
}else{
	$debug="Could not find the requested dugga!";
}

$log_uuid = getOP('log_uuid');
$info="opt: ".$opt." courseid: ".$courseid." coursevers: ".$coursevers." duggaid: ".$duggaid." moment: ".$moment." segment: ".$segment." answer: ".$answer;
logServiceEvent($log_uuid, EventTypes::ServiceServerStart, "showDuggaservice.php",$userid,$info);


if(strcmp($opt,"SAVDU")==0){
    makeLogEntry($userid,2,$pdo,$courseid." ".$coursevers." ".$duggaid." ".$moment." ".$answer);
    $description = $courseid." ".$duggaid." ".$moment." ".$answer;

	if(	!isSuperUser($userid)/*Teachers cant submit*/ && isset($_SESSION["submission-$courseid-$coursevers-$duggaid-$moment"]) && isset($_SESSION["submission-password-$courseid-$coursevers-$duggaid-$moment"])){
		$hash=$_SESSION["submission-$courseid-$coursevers-$duggaid-$moment"];
		$hashpwd=$_SESSION["submission-password-$courseid-$coursevers-$duggaid-$moment"];
		$variant=$_SESSION["submission-variant-$courseid-$coursevers-$duggaid-$moment"];	
		$link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "https") . "://$_SERVER[HTTP_HOST]/sh/?s=$hash";
		unset($grade);

		$query = $pdo->prepare("SELECT password,timesSubmitted,timesAccessed,grade from userAnswer WHERE hash=:hash;");
		$query->bindParam(':hash', $hash);			
		$query->execute();
		foreach($query->fetchAll() as $row){
			$grade = $row['grade'];
			$dbpwd = $row['password'];
		}

		if(isset($grade)&&($grade > 1)){
			//if grade equal G, VG, 3, 4, 5, or 6
			$debug="You have already passed this dugga. You are not required/allowed to submit anything new to this dugga.";
		}else{
			if(isset($dbpwd) && strcmp($hashpwd,$dbpwd) === 0){
				$query = $pdo->prepare("UPDATE userAnswer SET submitted=NOW(), useranswer=:useranswer, timesSubmitted=timesSubmitted+1 WHERE hash=:hash AND password=:hashpwd;");
				$query->bindParam(':hash', $hash);
				$query->bindParam(':hashpwd', $hashpwd);
				$query->bindParam(':useranswer', $answer);
				if(!$query->execute()) {
					$error=$query->errorInfo();
					$debug="Error updating variant (row ".__LINE__.") Error code: ".$error[2];
				}
			} else if(isset($dbpwd) && strcmp($hashpwd,$dbpwd) !== 0){
				$debug="The hash/hascode combination is not valid.";
			} else{
				$query = $pdo->prepare("INSERT INTO userAnswer(cid,quiz,moment,vers,variant,hash,password,timesSubmitted,timesAccessed,useranswer,submitted) VALUES(:cid,:did,:moment,:coursevers,:variant,:hash,:password,1,1,:useranswer,now());");
				$query->bindParam(':cid', $courseid);
				$query->bindParam(':coursevers', $coursevers);
				$query->bindParam(':did', $duggaid);
				$query->bindParam(':moment', $moment);
				$query->bindParam(':variant', $variant);
				$query->bindParam(':hash', $hash);
				$query->bindParam(':password', $hashpwd);
				$query->bindParam(':useranswer', $answer);
				if(!$query->execute()) {
					$error=$query->errorInfo();
					$debug="Error inserting variant (row ".__LINE__.") ".$query->rowCount()." row(s) were inserted. Error code: ".$error[2];
				}	
			}
		}
	}else{
		$debug="Unable to save dugga!";
	}
};

header("Content-Type: application/json");
//set url for setAsActiveCourse.php path
$baseURL = "https://" . $_SERVER['HTTP_HOST'];
$url = $baseURL . "/LenaSYS/DuggaSys/microservices/sharedMicroservices/setAsActiveCourse_ms.php";
$ch = curl_init($url);
    //options for curl
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
    'moment' => $moment, 
    'courseid' => $courseid, 
    'hash' => $hash, 
    'hashpwd' => $hashpwd, 
    'coursevers' => $coursevers,
    'duggaid' =>  $duggaid,
    'opt' =>  $opt,
    'group' =>  $group,
    'score' => $score,
	'highscoremode' => $highscoremode,
	'grade' => $grade,
	'submitted' => $submitted,
	'duggainfo' => $duggainfo,
	'marked' => $marked,
	'userfeedback' => $userfeedback,
	'feedbackquestion' => $feedbackquestion,
	'files' => $files,
	'savedvariant' => $savedvariant,
	'ishashindb' => $ishashindb,
	'variantsize' => $variantsize,
	'variantvalue' => $variantvalue,
	'password' => $password,
	'hashvariant' => $hashvariant,
	'isFileSubmitted' => $isFileSubmitted,
	'variants' => $variants,
	'active' => $active,
	'debug' => $debug
]));

$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);
echo json_encode($result);
exit;

/*echo json_encode(
	retrieveShowDuggaService(
		$moment, 
		$pdo, 
		$courseid, 
		$hash, 
		$hashpwd, 
		$coursevers, 
		$duggaid, 
		$opt, 
		$group, 
		$score, 
		$highscoremode, 
		$grade, 
		$submitted,
		$duggainfo,
		$marked,
		$userfeedback,
		$feedbackquestion,
		$files,
		$savedvariant,
		$ishashindb,
		$variantsize,
		$variantvalue,
		$password,
		$hashvariant,
		$isFileSubmitted,
		$variants,
		$active,
		$debug
	));*/
