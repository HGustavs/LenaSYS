<?php 
//---------------------------------------------------------------------------------------------------------------
// showDuggaservice - Retrieve duggor, services save and update duggor
//---------------------------------------------------------------------------------------------------------------

date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
//---------------------------------------
include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";


pdoConnect(); // Connect to database and start session
session_start();

if(isset($_SESSION['uid'])){
	$userid=$_SESSION['uid'];
	$loginname=$_SESSION['loginname'];
	$lastname=$_SESSION['lastname'];
	$firstname=$_SESSION['firstname'];
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

if($courseid != "UNK" && $coursevers != "UNK" && $duggaid != "UNK"){
	$hash=$_SESSION["submission-$courseid-$coursevers-$duggaid"];
	$hashpwd=$_SESSION["submission-password-$courseid-$coursevers-$duggaid"];
	$variant=$_SESSION["submission-variant-$courseid-$coursevers-$duggaid"];	
}else{
	$debug="Could not find the requested dugga!";
}

$log_uuid = getOP('log_uuid');
$info=$opt." ".$courseid." ".$coursevers." ".$duggaid." ".$moment." ".$segment." ".$answer;
logServiceEvent($log_uuid, EventTypes::ServiceServerStart, "showDuggaservice.php",$userid,$info);

if(strcmp($opt,"UPDATEAU")==0){
	$query = $pdo->prepare("SELECT active_users FROM groupdugga WHERE hash=:hash");
	$query->bindParam(':hash', $hash);
	$query->execute();
	$result = $query->fetch();
	$active = $result['active_users'];
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
}


//------------------------------------------------------------------------------------------------
// Retrieve Information			
//------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------
// Services
//------------------------------------------------------------------------------------------------

        if(strcmp($opt,"SAVDU")==0){
            // Log the dugga write
            makeLogEntry($userid,2,$pdo,$courseid." ".$coursevers." ".$duggaid." ".$moment." ".$answer);
            $discription = $courseid." ".$duggaid." ".$moment." ".$answer;
            //logUserEvent($userid, $username, EventTypes::DuggaFileupload,$discription);

			if(	isset($_SESSION["submission-$courseid-$coursevers-$duggaid"]) && 
				isset($_SESSION["submission-password-$courseid-$coursevers-$duggaid"])){
				$hash=$_SESSION["submission-$courseid-$coursevers-$duggaid"];
				$hashpwd=$_SESSION["submission-password-$courseid-$coursevers-$duggaid"];
				$variant=$_SESSION["submission-variant-$courseid-$coursevers-$duggaid"];	
				$link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "https") . "://$_SERVER[HTTP_HOST]/sh/?s=$hash";

				$query = $pdo->prepare("SELECT password,timesSubmitted,timesAccessed,grade from userAnswer WHERE hash=:hash;");
				$query->bindParam(':hash', $hash);			
				$query->execute();
				foreach($query->fetchAll() as $row){
					$grade = $row['grade'];
					$dbpwd = $row['password'];
					// $timesSubmitted = $row['timesSubmitted'];
					// $timesAccessed = $row['timesAccessed'];
				}

				if(isset($grade)&&($grade > 1)){
					//if grade equal G, VG, 3, 4, 5, or 6
					$debug="You have already passed this dugga. You are not required/allowed to submit anything new to this dugga.";
				}else{
					if(isset($dbpwd) && strcmp($hashpwd,$dbpwd) === 0){
						//$query = $pdo->prepare("UPDATE userAnswer SET submitted=NOW(), useranswer=:useranswer, timeUsed=:timeUsed, totalTimeUsed=totalTimeUsed + :timeUsed, stepsUsed=:stepsUsed, totalStepsUsed=totalStepsUsed+:stepsUsed, score=:score, timesSubmitted=timesSubmitted+1 WHERE hash=:hash;");
						$query = $pdo->prepare("UPDATE userAnswer SET submitted=NOW(), useranswer=:useranswer, timesSubmitted=timesSubmitted+1 WHERE hash=:hash AND password=:hashpwd;");
						$query->bindParam(':hash', $hash);
						$query->bindParam(':hashpwd', $hashpwd);
						$query->bindParam(':useranswer', $answer);
//						$query->bindParam(':timeUsed', $timeUsed);
//						$query->bindParam(':stepsUsed', $stepsUsed);
//						$query->bindParam(':score', $score);
						if(!$query->execute()) {
							$error=$query->errorInfo();
							$debug="Error updating variant (row ".__LINE__.") Error code: ".$error[2];
						}else{
							
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
        } 

		unset($variant);
		unset($answer);
		unset($variantanswer);
		unset($param);
		if (isSuperUser($userid)){
			if($hash!="UNK"){
				$sql="SELECT vid,variant.variantanswer AS variantanswer,useranswer,param,cid,vers,quiz FROM userAnswer LEFT JOIN variant ON userAnswer.variant=variant.vid WHERE hash=:hash";
				$query = $pdo->prepare($sql);
				$query->bindParam(':hash', $hash);
				$query->execute();
				foreach($query->fetchAll() as $row){
					$variant=$row['vid'];
					$answer=$row['useranswer'];
					$variantanswer=$row['variantanswer'];
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
				}else{
					$debug="[Superuser] Could not load dugga! Incorrect hash/password! $hash/$hashpwd";
					$variant="UNK";
					$answer="UNK";
					$variantanswer="UNK";
					$param=html_entity_decode('{}');
					// unset($_SESSION["submission-$cid-$vers-$duggaid"]);
					// unset($_SESSION["submission-password-$cid-$vers-$duggaid"]);
					// unset($_SESSION["submission-variant-$cid-$vers-$duggaid"]);
				}
			} else {
				$debug="[Superuser] Could not load dugga! Incorrect hash/password! $hash";
				$variant="UNK";
				$answer="UNK";
				$variantanswer="UNK";
				$param=html_entity_decode('{}');
			}
		}else{
			//getOP('hash');
			//getOP('password');
			if(getOP('hash')!="UNK" && getOP('password')!="UNK"){
				$sql="SELECT vid,variant.variantanswer AS variantanswer,useranswer,param,cid,vers,quiz FROM userAnswer LEFT JOIN variant ON userAnswer.variant=variant.vid WHERE hash=:hash AND password=:hashpwd";
				$query = $pdo->prepare($sql);
				$query->bindParam(':hash', $hash);
				$query->bindParam(':hashpwd', $hashpwd);
				$query->execute();
				foreach($query->fetchAll() as $row){
					$variant=$row['vid'];
					$answer=$row['useranswer'];
					$variantanswer=$row['variantanswer'];
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
				}else{
					$debug="[Guest] Could not load dugga! Incorrect hash/password submitted! $hash/$hashpwd";
					$variant="UNK";
					$answer="UNK";
					$variantanswer="UNK";
					$param=html_entity_decode('{}');
					// unset($_SESSION["submission-$cid-$vers-$duggaid"]);
					// unset($_SESSION["submission-password-$cid-$vers-$duggaid"]);
					// unset($_SESSION["submission-variant-$cid-$vers-$duggaid"]);
				}
			}else{
				if(	isset($_SESSION["submission-$courseid-$coursevers-$duggaid"]) && 
					isset($_SESSION["submission-password-$courseid-$coursevers-$duggaid"]) && 
					isset($_SESSION["submission-variant-$courseid-$coursevers-$duggaid"])){
			
					$tmphash=$_SESSION["submission-$courseid-$coursevers-$duggaid"];
					$tmphashpwd=$_SESSION["submission-password-$courseid-$coursevers-$duggaid"];
					$tmpvariant=$_SESSION["submission-variant-$courseid-$coursevers-$duggaid"];
				
					//$sql="SELECT variant.vid AS vid,IF(useranswer is NULL,'UNK',useranswer) AS useranswer,variantanswer,param FROM variant LEFT JOIN userAnswer ON userAnswer.variant=variant.vid AND hash=:hash AND password=:hashpwd WHERE vid=:variant LIMIT 1;";
					$sql="SELECT quiz.*, variant.vid AS vid,IF(useranswer is NULL,'UNK',useranswer) AS useranswer,variantanswer,param FROM quiz LEFT JOIN variant ON quiz.id=variant.quizID LEFT JOIN userAnswer ON userAnswer.variant=variant.vid AND hash=:hash AND password=:hashpwd WHERE quiz.id=:did AND vid=:variant LIMIT 1;";
					$query = $pdo->prepare($sql);
					$query->bindParam(':did', $duggaid);
					$query->bindParam(':variant', $tmpvariant);
					$query->bindParam(':hash', $tmphash);
					$query->bindParam(':hashpwd', $tmphashpwd);	
					$query->execute();
					foreach($query->fetchAll() as $row){
						$variant=$row['vid'];
						$answer=$row['useranswer'];
						$variantanswer=$row['variantanswer'];
						$param=html_entity_decode($row['param']);
					}
			
					if(isset($param)){
			
			
					}else{
						$debug="[Guest] Missing hash/password/variant! Not found in db.";
						$variant="UNK";
						$answer="UNK";
						$variantanswer="UNK";
						$param=html_entity_decode('{}');
						unset($_SESSION["submission-$courseid-$coursevers-$duggaid"]);
						unset($_SESSION["submission-password-$courseid-$coursevers-$duggaid"]);
						unset($_SESSION["submission-variant-$courseid-$coursevers-$duggaid"]);	
					}
				}else{
					$debug="[Guest] Missing hash/password/variant!";
					$variant="UNK";
					$answer="UNK";
					$variantanswer="UNK";
					$param=html_entity_decode('{}');
					unset($_SESSION["submission-$courseid-$coursevers-$duggaid"]);
					unset($_SESSION["submission-password-$courseid-$coursevers-$duggaid"]);
					unset($_SESSION["submission-variant-$courseid-$coursevers-$duggaid"]);
				}
			}
		}		
	

$array = array(
		"debug" => $debug,
		"param" => $param,
		"answer" => $answer,
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