<?php
include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "../curlService.php";

pdoConnect();
session_start();


$query = $pdo->prepare("SELECT active_users FROM groupdugga WHERE hash=:hash");
$query->bindParam(':hash', $hash);
$query->execute();
$result = $query->fetch();
$active = $result['active_users'];
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

if($active == null){
    $query = $pdo->prepare("INSERT INTO groupdugga(hash,active_users) VALUES(:hash,:AUtoken);");
    $query->bindParam(':hash', $hash);
    $query->bindParam(':AUtoken', $AUtoken);
    $query->execute();
}else{
    $newToken = (int)$active + (int)$AUtoken;
    $query = $pdo->prepare("UPDATE groupdugga SET active_users=:AUtoken WHERE hash=:hash;");
    $query->bindParam(':hash', $hash);
    $query->bindParam(':AUtoken', $newToken);
    $query->execute();
}

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

header("Content-Type: application/json");
echo $response;