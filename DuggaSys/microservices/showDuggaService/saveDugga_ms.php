<?php

//
// Microservice for saveDugga that has update userAnswer, insert userAnswer and selecting data from userAnswer
//

date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";

pdoConnect(); // Connect to database and start session
session_start();

$opt=getOP('opt');
$hash=getOP('hash'); // Oklart om denna ska med då den hämtas från session
$hashpwd=getOP('password'); // Oklart om denna ska vara med då den hämtas från session
$answer=getOP('useranswer');
$dbpwd=getOP('password');
$courseid=getOP('cid');
$coursevers=getOP('coursevers');
$duggaid=getOP('did');
$moment=getOP('moment');
$variant=getOP('variant');



if(strcmp($opt,"SAVDU")==0){
    // Log the dugga write
    makeLogEntry($userid,2,$pdo,$courseid." ".$coursevers." ".$duggaid." ".$moment." ".$answer);
    $discription = $courseid." ".$duggaid." ".$moment." ".$answer;

	if(	!isSuperUser($userid) && // Teachers cannot submit
	isset($_SESSION["submission-$courseid-$coursevers-$duggaid-$moment"]) && isset($_SESSION["submission-password-$courseid-$coursevers-$duggaid-$moment"])){
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
				}else{
					// Why is this empty?
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
?>