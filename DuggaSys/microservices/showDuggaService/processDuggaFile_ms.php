<?php 
//---------------------------------------------------------------------------------------------------------------
// retrieveDuggaFiles - processDuggaFile
// loaddugga: userAnswer
// processDuggaFile: submission
// Search with hash Uses service selectFromTableSubmission to get information it requires from submission.
// If no match on hash, retreive all submissions Uses service selectFromTableSubmission to get information it requires from submission.
//---------------------------------------------------------------------------------------------------------------

date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
//---------------------------------------
include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "retrieveSubmissionFiles.php";

pdoConnect(); // Connect to database and start session
session_start();

if(isset($_SESSION['uid'])){
	$userid=$_SESSION['uid'];
}else{
	$userid="student";		
} 	

$opt=getOP('opt');
$courseid=getOP('courseid');
$coursevers=getOP('coursevers');
$duggaid=getOP('did');
$moment=getOP('moment');
$segment=getOP('segment');
$answer=getOP('answer');
$highscoremode=getOP('highscoremode');
$setanswer=gettheOP('setanswer');
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

// if($courseid != "UNK" && $coursevers != "UNK" && $duggaid != "UNK" && $moment != "UNK"){
// 	if((isset($_POST["submission-$courseid-$coursevers-$duggaid-$moment"]) && 
// 		isset($_POST["submission-password-$courseid-$coursevers-$duggaid-$moment"]) && 
// 		isset($_POST["submission-variant-$courseid-$coursevers-$duggaid-$moment"]))) {
// 		$hash=$_POST["submission-$courseid-$coursevers-$duggaid-$moment"];
// 		$hashpwd=$_POST["submission-password-$courseid-$coursevers-$duggaid-$moment"];
// 		$variant=$_POST["submission-variant-$courseid-$coursevers-$duggaid-$moment"];
// 	}
// 	else{
// 		$hash=$_SESSION["submission-$courseid-$coursevers-$duggaid-$moment"];
// 		$hashpwd=$_SESSION["submission-password-$courseid-$coursevers-$duggaid-$moment"];
// 		$variant=$_SESSION["submission-variant-$courseid-$coursevers-$duggaid-$moment"];
// 	}
// }else{
// 	$debug="Could not find the requested dugga!";
// }

$log_uuid = getOP('log_uuid');
$info="opt: ".$opt." courseid: ".$courseid." coursevers: ".$coursevers." duggaid: ".$duggaid." moment: ".$moment." segment: ".$segment." answer: ".$answer;
logServiceEvent($log_uuid, EventTypes::ServiceServerStart, "retrieveDuggaFiles_ms.php",$userid,$info);


//------------------------------------------------------------------------------------------------
// Retrieve Information			
//------------------------------------------------------------------------------------------------
if(checklogin()){
	if(isset($_SESSION['uid'])){
		$userid=$_SESSION['uid'];
	}else{
		$userid="student";		
	} 	
}

if(isSuperUser($userid)){
	$isTeacher=1;
}else{
	$isTeacher=0;
}

if (isSuperUser($userid)){
	if($hash!="UNK"){
		$sql="SELECT vid,variant.variantanswer AS variantanswer,useranswer,param,cid,vers,quiz FROM userAnswer LEFT JOIN variant ON userAnswer.variant=variant.vid WHERE hash=:hash";
		$query = $pdo->prepare($sql);
		$query->bindParam(':hash', $hash);
		$result = $query->execute();
		$rows = $query->fetchAll();

		//if the hash didn't work then retrive all answers for that moment
		if($rows == NULL){
			//changed WHERE key to moment instead of hash since hash isn't working correctly. It appears to work so long as their is an entry for that moment in userAnswer
			$sql="SELECT vid,variant.variantanswer AS variantanswer,useranswer,param,cid,vers,quiz FROM userAnswer LEFT JOIN variant ON userAnswer.variant=variant.vid WHERE moment=:moment";
			$query = $pdo->prepare($sql);
			$query->bindParam(':moment', $moment);
			$query->execute();
			$rows = $query->fetchAll();
		}
		foreach($rows as $row){
			$variant=$row['vid'];
			$answer=$row['useranswer'];
			$variantanswer=html_entity_decode($row['variantanswer']);
			$param=html_entity_decode($row['param']);
			$newcourseid=$row['cid'];
			$newcoursevers=$row['vers'];
			$newduggaid=$row['quiz'];
		}

		$sql="SELECT entryname FROM listentries WHERE lid=:moment";
		$query = $pdo->prepare($sql);
		$query->bindParam(':moment', $moment);
		$query->execute();
		foreach($query->fetchAll() as $row){
			$duggatitle=$row['entryname'];
		}

		if(isset($variant)){
			$_SESSION["submission-$courseid-$newcoursevers-$newduggaid"]=$hash;
			$_SESSION["submission-password-$courseid-$newcoursevers-$newduggaid"]=$hashpwd;
			$_SESSION["submission-variant-$courseid-$newcoursevers-$newduggaid"]=$variant;
			$link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "https") . "://$_SERVER[HTTP_HOST]/sh/?s=$hash";
			$submittedFiles = processDuggaFiles($pdo, $courseid,$coursevers,$duggaid,$duggainfo, $moment);
		}else{
			$debug="[Superuser] Could not load dugga! no userAnswer entries with moment: $moment \nline 338 showDuggaservice.php";
			$variant="UNK";
			$answer="UNK";
			$variantanswer="UNK";
			$param=html_entity_decode('{}');
		}
	} else {
		$debug="[Superuser] Could not load dugga! Incorrect hash/password! $hash";
		$variant="UNK";
		$answer="UNK";
		$variantanswer="UNK";
		$param=html_entity_decode('{}');
	}
}else{
	if(getOP('hash')!="UNK" && getOP('password')!="UNK"){
		$sql="SELECT vid,variant.variantanswer AS variantanswer,useranswer,param,cid,vers,quiz FROM userAnswer LEFT JOIN variant ON userAnswer.variant=variant.vid WHERE hash=:hash AND password=:hashpwd";
		$query = $pdo->prepare($sql);
		$query->bindParam(':hash', $hash);
		$query->bindParam(':hashpwd', $hashpwd);
		$query->execute();
		foreach($query->fetchAll() as $row){
			$variant=$row['vid'];
			$answer=$row['useranswer'];
			$variantanswer="UNK";
			$param=html_entity_decode($row['param']);
			$newcourseid=$row['cid'];
			$newcoursevers=$row['vers'];
			$newduggaid=$row['quiz'];
		}
		if(isset($variant)){
			$_SESSION["submission-$courseid-$newcoursevers-$newduggaid"]=$hash;
			$_SESSION["submission-password-$courseid-$newcoursevers-$newduggaid"]=$hashpwd;
			$_SESSION["submission-variant-$courseid-$newcoursevers-$newduggaid"]=$variant;
			$link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "https") . "://$_SERVER[HTTP_HOST]/sh/?s=$hash";
			$submittedFiles = processDuggaFiles($pdo, $courseid,$coursevers,$duggaid,$duggainfo, $moment);
		}else{
			$debug="[Guest] Could not load dugga! Incorrect hash/password submitted! $hash/$hashpwd";
			$variant="UNK";
			$answer="UNK";
			$variantanswer="UNK";
			$param=html_entity_decode('{}');
		}
	}else{
		if(	(isset($_SESSION["submission-$courseid-$coursevers-$duggaid-$moment"]) && 
			isset($_SESSION["submission-password-$courseid-$coursevers-$duggaid-$moment"]) && 
			isset($_SESSION["submission-variant-$courseid-$coursevers-$duggaid-$moment"]))){
	
			$tmphash=$_SESSION["submission-$courseid-$coursevers-$duggaid-$moment"];
			$tmphashpwd=$_SESSION["submission-password-$courseid-$coursevers-$duggaid-$moment"];
			$tmpvariant=$_SESSION["submission-variant-$courseid-$coursevers-$duggaid-$moment"];

			$sql="SELECT quiz.*, variant.vid AS vid,IF(useranswer is NULL,'UNK',useranswer) AS useranswer,variantanswer,param,l.entryname AS dugga_title FROM quiz LEFT JOIN variant ON quiz.id=variant.quizID LEFT JOIN userAnswer ON userAnswer.variant=variant.vid AND hash=:hash AND password=:hashpwd LEFT JOIN (select cid,link,entryname from listentries) as l ON l.cid=l.cid AND l.link=quiz.id WHERE quiz.id=:did AND vid=:variant AND l.cid=:cid LIMIT 1;";
			$query = $pdo->prepare($sql);
			$query->bindParam(':cid', $courseid);
			$query->bindParam(':did', $duggaid);
			$query->bindParam(':variant', $tmpvariant);
			$query->bindParam(':hash', $tmphash);
			$query->bindParam(':hashpwd', $tmphashpwd);	
			$query->execute();
			foreach($query->fetchAll() as $row){
				$duggatitle=$row['dugga_title'];
				$variant=$row['vid'];
				$answer=$row['useranswer'];
				$variantanswer="UNK";
				$param=html_entity_decode($row['param']);
			}
	
			if(isset($param)){
				$submittedFiles = processDuggaFiles($pdo, $courseid,$coursevers,$duggaid,$duggainfo, $moment);
			}else{
				$debug="[Guest] Missing hash/password/variant! Not found in db.";
				$variant="UNK";
				$answer="UNK";
				$variantanswer="UNK";
				$param=html_entity_decode('{}');
				unset($_SESSION["submission-$courseid-$coursevers-$duggaid-$moment"]);
				unset($_SESSION["submission-password-$courseid-$coursevers-$duggaid-$moment"]);
				unset($_SESSION["submission-variant-$courseid-$coursevers-$duggaid-$moment"]);	
			}
		}else if (isset($_POST["submission-$courseid-$coursevers-$duggaid-$moment"]) && 
				isset($_POST["submission-password-$courseid-$coursevers-$duggaid-$moment"]) && 
				isset($_POST["submission-variant-$courseid-$coursevers-$duggaid-$moment"])){
			
				$tmphash=$_POST["submission-$courseid-$coursevers-$duggaid-$moment"];
				$tmphashpwd=$_POST["submission-password-$courseid-$coursevers-$duggaid-$moment"];
				$tmpvariant=$_POST["submission-variant-$courseid-$coursevers-$duggaid-$moment"];

				$sql="SELECT quiz.*, variant.variantanswer, variant.vid AS vid,IF(useranswer is NULL,'UNK',useranswer) AS useranswer,variantanswer,param,l.entryname AS dugga_title FROM quiz LEFT JOIN variant ON quiz.id=variant.quizID LEFT JOIN userAnswer ON userAnswer.variant=variant.vid AND hash=:hash AND password=:hashpwd LEFT JOIN (select cid,link,entryname from listentries) as l ON l.cid=l.cid AND l.link=quiz.id WHERE quiz.id=:did AND vid=:variant AND l.cid=:cid LIMIT 1;";
				$query = $pdo->prepare($sql);
				$query->bindParam(':cid', $courseid);
				$query->bindParam(':did', $duggaid);
				$query->bindParam(':variant', $tmpvariant);
				$query->bindParam(':hash', $tmphash);
				$query->bindParam(':hashpwd', $tmphashpwd);	
				$query->execute();
				foreach($query->fetchAll() as $row){
					$duggatitle=$row['dugga_title'];
					$variant=$row['vid'];
					$answer=$row['useranswer'];
					$variantanswer=html_entity_decode($row['variantanswer']);
					$param=html_entity_decode($row['param']);
				}
		
				if(isset($param)){
					$submittedFiles = processDuggaFiles($pdo, $courseid,$coursevers,$duggaid,$duggainfo, $moment);
				}else{
					$debug="[Guest] Missing hash/password/variant! Not found in db.";
					$variant="UNK";
					$answer="UNK";
					$variantanswer="UNK";
					$param=html_entity_decode('{}');
					unset($_SESSION["submission-$courseid-$coursevers-$duggaid-$moment"]);
					unset($_SESSION["submission-password-$courseid-$coursevers-$duggaid-$moment"]);
					unset($_SESSION["submission-variant-$courseid-$coursevers-$duggaid-$moment"]);	
				}
		}
		else{
			$debug="[Guest] Missing hash/password/variant!";
			$variant="UNK";
			$answer="UNK";
			$variantanswer="UNK";
			$param=html_entity_decode('{}');
			unset($_SESSION["submission-$courseid-$coursevers-$duggaid-$moment"]);
			unset($_SESSION["submission-password-$courseid-$coursevers-$duggaid-$moment"]);
			unset($_SESSION["submission-variant-$courseid-$coursevers-$duggaid-$moment"]);
		}
	}
}		
	
if(!empty($submittedFiles)) {
	$files = $submittedFiles;
}

$array = array(
		"debug" => $debug,
		"param" => $param,
		"answer" => $answer,
		"danswer" => $variantanswer,
		"score" => $score,
		"highscoremode" => $highscoremode,
		"grade" => $grade,
		"submitted" => $submitted,
		"marked" => $marked,
		"deadline" => $duggainfo['deadline'],
		"release" => $duggainfo['qrelease'],
		"files" => $files,
		"userfeedback" => $userfeedback,
		"feedbackquestion" => $feedbackquestion,
		"variant" => $savedvariant,
		"ishashindb" => $ishashindb,
		"variantsize" => $variantsize,
		"variantvalue" => $variantvalue,
		"password" => $password,
		"hashvariant" => $hashvariant,
		"isFileSubmitted" => $isFileSubmitted,
		"isTeacher" => $isTeacher, // isTeacher is true for both teachers and superusers
		"variants" => $variants,
		"duggaTitle" => $duggatitle,
		"hash" => $hash,
		"hashpwd" => $hashpwd,
		"opt" => $opt,
		"link" => $link

	);
if (strcmp($opt, "GRPDUGGA")==0) $array["group"] = $group;
header('Content-Type: application/json');
echo json_encode($array);
?>