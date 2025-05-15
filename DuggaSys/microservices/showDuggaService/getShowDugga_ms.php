<?php
date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
//---------------------------------------
include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
//include_once('./retrieveShowDuggaService_ms.php');


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


header("Content-Type: application/json");
//set url for setAsActiveCourse.php path
$baseURL = "https://" . $_SERVER['HTTP_HOST'];
$url = $baseURL . "/LenaSYS/DuggaSys/microservices/sharedMicroservices/retrieveShowDuggaService_ms.php";
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
	)
)*/


?>
