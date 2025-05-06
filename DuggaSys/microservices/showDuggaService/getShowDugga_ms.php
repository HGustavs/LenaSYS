<?php
date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "../curlService.php";

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

// cURL request to the microservice
$response = callMicroservicePOST(
	"showDuggaService/retrieveShowDuggaService_ms.php",
	[
		'moment' => $moment,
		'courseid' => $courseid,
		'hash' => $hash,
		'password' => $hashpwd,
		'coursevers' => $coursevers,
		'duggaid' => $duggaid,
		'opt' => $opt
	],
	true // Get response back
);

echo $response;
