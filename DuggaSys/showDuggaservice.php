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
}else{
	$userid="1";		
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
$debug="NONE!";	

$param = "";
$savedanswer = "";
$highscoremode = "";
$questionanswer = "";

$hr=false;
$insertparam = false;

//------------------------------------------------------------------------------------------------
// Retrieve Information			
//------------------------------------------------------------------------------------------------

if($userid!="UNK"){
		// See if we already have a result i.e. a chosen variant.
	$query = $pdo->prepare("SELECT aid,cid,quiz,useranswer,variant,moment,vers,uid,marked FROM userAnswer WHERE uid=:uid AND cid=:cid AND moment=:moment AND vers=:coursevers;");
	$query->bindParam(':cid', $courseid);
	$query->bindParam(':coursevers', $coursevers);
	$query->bindParam(':uid', $userid);
	$query->bindParam(':moment', $moment);
	$result = $query->execute();

	$savedvariant="UNK";
	$newvariant="";
	$variants=array();
	$savedanswer="UNK";

	if ($row = $query->fetch(PDO::FETCH_ASSOC)) {
		$savedvariant=$row['variant'];
		$savedanswer=$row['useranswer'];
	}
	
	// Retrieve variant list
	$query = $pdo->prepare("SELECT vid,param,variantanswer FROM variant WHERE quizID=:duggaid;");
	$query->bindParam(':duggaid', $duggaid);
	$result=$query->execute();
	if (!$result) err("SQL Query Error: ".$pdo->errorInfo(),"Field Querying Error!");
	$i=0;
	foreach($query->fetchAll() as $row) {
		$variants[$i]=array(
			'vid' => $row['vid'],
			'param' => $row['param'],
			'questionanswer' => $row['variantanswer']
		);
		$i++;
		$insertparam = true;
	}

	// If there are any variants, randomize
	if($savedvariant==""||$savedvariant=="UNK"){
		$randomno=rand(0,sizeof($variants)-1);
		if(sizeof($variants)>0) $newvariant=$variants[$randomno]['vid'];
	}else{
			
	}

	// Savedvariant now contains variant (from previous visit) "" (null) or UNK (no variant inserted)
	if(($savedvariant=="")&&($newvariant!="")){
		$query = $pdo->prepare("UPDATE userAnswer SET variant=:variant WHERE uid=:uid AND cid=:cid AND moment=:moment AND vers=:coursevers;");
		$query->bindParam(':cid', $courseid);
		$query->bindParam(':coursevers', $coursevers);
		$query->bindParam(':uid', $userid);
		$query->bindParam(':moment', $moment);
		$query->bindParam(':variant', $newvariant);
		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error updating entries".$error[2];
		}
		$savedvariant=$newvariant;

	}else if(($savedvariant=="UNK")&&($newvariant!="")){
		$query = $pdo->prepare("INSERT INTO userAnswer(uid,cid,quiz,moment,vers,variant) VALUES(:uid,:cid,:did,:moment,:coursevers,:variant);");
		$query->bindParam(':cid', $courseid);
		$query->bindParam(':coursevers', $coursevers);
		$query->bindParam(':uid', $userid);
		$query->bindParam(':did', $duggaid);
		$query->bindParam(':moment', $moment);
		$query->bindParam(':variant', $newvariant);
		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error updating entries".$error[2];
		}
		$savedvariant=$newvariant;
		//------------------------------
		//mark segment as started on
		//------------------------------
		$query = $pdo->prepare("INSERT INTO userAnswer(uid,cid,quiz,moment,vers,variant) VALUES(:uid,:cid,:did,:moment,:coursevers,:variant);");
		$query->bindParam(':cid', $courseid);
		$query->bindParam(':coursevers', $coursevers);
		$query->bindParam(':uid', $userid);
		$query->bindParam(':did', $duggaid);
		$query->bindParam(':moment', $segment);
		$query->bindParam(':variant', $newvariant);
		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error updating entries".$error[2];
		}
	}

	// Retrieve variant
	if($insertparam == false){
	$param="NONE!";
	}
	foreach ($variants as $variant) {
		if($variant["vid"] === $savedvariant){
			$param.=$variant['param'];
			$questionanswer.=$variant['questionanswer'];
		}
	}
}else{
	$param="FORBIDDEN!!";
}
//------------------------------------------------------------------------------------------------
// Services
//------------------------------------------------------------------------------------------------

if(checklogin()){
	$query = $pdo->prepare("SELECT visibility FROM course WHERE cid=:cid");
	$query->bindParam(':cid', $courseid);
	$result = $query->execute();

	if($row = $query->fetch(PDO::FETCH_ASSOC)){
		$hr = ((checklogin() && hasAccess($userid, $courseid, 'r')) || $row['visibility'] != 0);
		if($hr&&$userid!="UNK"){ // The code for modification using sessions
			if(strcmp($opt,"SAVDU")===0){
				// Log the dugga write
				makeLogEntry($userid,2,$pdo,$courseid." ".$coursevers." ".$duggaid." ".$moment." ".$answer);

				//Seperate timeSpent from $answer
				$temp = explode("-", $answer);
				$timeSpent = $temp[1];
				$answer = $temp[0];
				
				// check if the user already has a grade on the assignment
				$query = $pdo->prepare("SELECT grade from userAnswer WHERE uid=:uid AND cid=:cid AND moment=:moment AND vers=:coursevers;");
				$query->bindParam(':cid', $courseid);
				$query->bindParam(':coursevers', $coursevers);
				$query->bindParam(':uid', $userid);
				$query->bindParam(':moment', $moment);
				
				
				$query->execute();

				if ($row = $query->fetch(PDO::FETCH_ASSOC)) {
					$grade=$row['grade'];
				}
				if(($grade == 2) || ($grade == 3)||($grade == 4) || ($grade == 5)||($grade == 6)){
					//if grade equal G, VG, 3, 4, 5, or 6
					$debug="You have already been graded on this assignment";
				}else{
					// Update Dugga!
					$query = $pdo->prepare("UPDATE userAnswer SET useranswer=:useranswer, score=:timeSpent WHERE uid=:uid AND cid=:cid AND moment=:moment AND vers=:coursevers;");
					$query->bindParam(':cid', $courseid);
					$query->bindParam(':coursevers', $coursevers);
					$query->bindParam(':uid', $userid);
					$query->bindParam(':moment', $moment);
					$query->bindParam(':useranswer', $answer);
					$query->bindParam(':timeSpent', $timeSpent);
				}
				
				if(!$query->execute()) {
					$debug="Error updating answer";
				}
			}
		}
	}
}

//------------------------------------------------------------------------------------------------
// Retrieve Information			
//------------------------------------------------------------------------------------------------

if(strcmp($opt,"GETVARIANTANSWER")===0){
	$temp = explode(" ", $setanswer);
	$first = $temp[0];
	$second = $temp[1];
	$thrid = $temp[2];
			
	$query = $pdo->prepare("SELECT variant.variantanswer FROM variant,userAnswer WHERE userAnswer.quiz = variant.quizID and userAnswer.uid = :uid and userAnswer.cid = :cid and userAnswer.vers = :vers");
	
	$query->bindParam(':uid', $userid);
	$query->bindParam(':cid', $first);
	$query->bindParam(':vers', $second);
	$result = $query->execute();
	
	$setanswer="";
	
	foreach($query->fetchAll() as $row) {
		$setanswer.=$row['variantanswer'].",";
	}

	makeLogEntry($userid,2,$pdo,$first);
	$insertparam = true;
	$param = $setanswer;
}

$array = array(
		"debug" => $debug,
		"param" => $param,
		"answer" => $savedanswer,
		"highscoremode" => $highscoremode,
		"questionanswer" => $questionanswer
	);

echo json_encode($array);
?>
