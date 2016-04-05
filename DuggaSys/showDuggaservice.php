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
$quizfile = "UNK";

$hr=false;
$insertparam = false;
$score = 0;
$timeUsed;
$stepsUsed;

//------------------------------------------------------------------------------------------------
// Retrieve Information			
//------------------------------------------------------------------------------------------------

if($userid!="UNK"){
		// See if we already have a result i.e. a chosen variant.
	$query = $pdo->prepare("SELECT score,aid,cid,quiz,useranswer,variant,moment,vers,uid,marked FROM userAnswer WHERE uid=:uid AND cid=:cid AND moment=:moment AND vers=:coursevers;");
	$query->bindParam(':cid', $courseid);
	$query->bindParam(':coursevers', $coursevers);
	$query->bindParam(':uid', $userid);
	$query->bindParam(':moment', $moment);
	$result = $query->execute();

	$savedvariant="UNK";
	$newvariant="";
	$variants=array();
	$safe_variants=array();
	$savedanswer="UNK";

	if ($row = $query->fetch(PDO::FETCH_ASSOC)) {
		$savedvariant=$row['variant'];
		$savedanswer=$row['useranswer'];
		$score = $row['score'];
	}
	
	// Get type of dugga
	$query = $pdo->prepare("SELECT quizFile FROM quiz WHERE id=:duggaid;");
	$query->bindParam(':duggaid', $duggaid);
	$result=$query->execute();
	if (!$result) err("SQL Query Error: ".$pdo->errorInfo(),"quizfile Querying Error!");
	foreach($query->fetchAll() as $row) {
		$quizfile = $row['quizFile'];
	}
	
	// Retrieve variant list
	$firstvariant=-1;
	$query = $pdo->prepare("SELECT vid,param,disabled FROM variant WHERE quizID=:duggaid;");
	$query->bindParam(':duggaid', $duggaid);
	$result=$query->execute();
	if (!$result) err("SQL Query Error: ".$pdo->errorInfo(),"variant Querying Error!");
	$i=0;
	foreach($query->fetchAll() as $row) {
		if($row['disabled']==0) $firstvariant=$i;
		$variants[$i]=array(
			'vid' => $row['vid'],
			'param' => $row['param'],
			'disabled' => $row['disabled']
		);
		$i++;
		$insertparam = true;
	}

	// If selected variant is not found - pick another from working list.
	// Should we connect this to answer or not e.g. if we have an answer should we still give a working variant??
	$foundvar=-1;
	foreach ($variants as $key => $value){
			if($savedvariant==$value['vid']&&$value['disabled']==0) $foundvar=$key;
	}
	if($foundvar==-1){
			$savedvariant="";
	}

	// If there are any variants, randomize
	if($savedvariant==""||$savedvariant=="UNK"){
		// Randomize at most 8 times
		$cnt=0;
		do{
				$randomno=rand(0,sizeof($safe_variants)-1);
				
				// If there is a variant choose one at random
				if(sizeof($variants)>0){
						if($variants[$randomno]['disabled']===0){
								$newvariant=$variants[$randomno]['vid'];						
						}
				} 
				$cnt++;
		}while($cnt<8&&$newvariant=="");
		
		// if none has been chosen and there is a first one take that one.
		if($newvariant=="" && $firstvariant!=-1) $newvariant=$firstvariant;
	}else{
		// There is a variant already -- do nothing!	
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
			$debug="Error updating entries (128)".$error[2];
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
			$debug="Error updating entries (142)".$error[2];
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
			$debug="Error updating entries (157)".$error[2];
		}
	}

	// Retrieve variant
	if($insertparam == false){
	$param="NONE!";
	}
	foreach ($variants as $variant) {
		if($variant["vid"] == $savedvariant || $quizfile == "kryss"){
			$param.=html_entity_decode($variant['param']);
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
		if($hr&&$userid!="UNK" || isSuperUser($userid)){ // The code for modification using sessions			
			if(strcmp($opt,"SAVDU")==0){				
				// Log the dugga write
				makeLogEntry($userid,2,$pdo,$courseid." ".$coursevers." ".$duggaid." ".$moment." ".$answer);

				//Seperate timeUsed, stepsUsed and score from $answer
				$temp = explode("##!!##", $answer);
				$answer = $temp[0];
				$timeUsed = $temp[1];
				$stepsUsed = $temp[2];
				$score = $temp[3];
				
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
					$query = $pdo->prepare("UPDATE userAnswer SET submitted=NOW(), useranswer=:useranswer, timeUsed=:timeUsed, totalTimeUsed=totalTimeUsed + :timeUsed, stepsUsed=:stepsUsed, totalStepsUsed=totalStepsUsed+:stepsUsed, score=:score WHERE uid=:uid AND cid=:cid AND moment=:moment AND vers=:coursevers;");
					$query->bindParam(':cid', $courseid);
					$query->bindParam(':coursevers', $coursevers);
					$query->bindParam(':uid', $userid);
					$query->bindParam(':moment', $moment);
					$query->bindParam(':useranswer', $answer);
					$query->bindParam(':timeUsed', $timeUsed);
					$query->bindParam(':stepsUsed', $stepsUsed);
					$query->bindParam(':score', $score);
				}
				
				if(!$query->execute()) {
					$debug="Error updating answer";
					print_r($pdo->errorInfo());
				} else {
					$savedanswer = $answer;
				}
			}
		}
	}
}

//------------------------------------------------------------------------------------------------
// Retrieve Information			
//------------------------------------------------------------------------------------------------

if(strcmp($opt,"GETVARIANTANSWER")==0){
	$temp = explode(" ", $setanswer);
	$first = $temp[0];
	$second = $temp[1];
	$thrid = $temp[2];

	$query = $pdo->prepare("SELECT variant.variantanswer,useranswer FROM variant,userAnswer WHERE userAnswer.quiz = variant.quizID and userAnswer.uid = :uid and userAnswer.cid = :cid and userAnswer.vers = :vers");
	
	$query->bindParam(':uid', $userid);
	$query->bindParam(':cid', $first);
	$query->bindParam(':vers', $second);
	$result = $query->execute();
	
	$setanswer="";
	
	foreach($query->fetchAll() as $row) {
		$setanswer.=$row['variantanswer'].",";
		$savedanswer.=$row['useranswer'].",";
	}

	makeLogEntry($userid,2,$pdo,$first);
	$insertparam = true;
	$param = $setanswer;
}

$param = str_replace("*##*", '"', $param);
$savedanswer = str_replace("*##*", '"', $savedanswer);
$param = str_replace("*###*", '&cap;', $param);
$savedanswer = str_replace("*###*", '&cap;', $savedanswer);
$param = str_replace("*####*", '&cup;', $param);
$savedanswer = str_replace("*####*", '&cup;', $savedanswer);
if(strcmp($savedanswer,"") == 0){$savedanswer = "UNK";} // Return UNK if we have not submitted any answer

$files= array();
$query = $pdo->prepare("select subid,uid,vers,did,fieldnme,filename,extension,mime,updtime,kind,filepath,seq from submission where uid=:uid and vers=:vers and cid=:cid and did=:did order by fieldnme,updtime desc;");
$query->bindParam(':uid', $userid);
$query->bindParam(':cid', $courseid);
$query->bindParam(':vers', $coursevers);
$query->bindParam(':did', $duggaid);
	
$result = $query->execute();
foreach($query->fetchAll() as $row) {
		
		if($row['kind']=="3"){
				// Read file contents

				$currcvd=getcwd();

				$userdir = $lastname."_".$firstname."_".$loginname;
			  $movname=$currcvd."/submissions/".$courseid."/".$coursevers."/".$duggaid."/".$userdir."/".$row['filename'].$row['seq'].".".$row['extension'];	

			  if (file_exists ($movname)){
						$content=file_get_contents($movname);
			  }else{
						$content="Empty";			  
			  }
		
		}else{
				$content="Empty";						
		}
	
		$entry = array(
			'uid' => $row['uid'],
			'subid' => $row['subid'],
			'vers' => $row['vers'],
			'did' => $row['did'],
			'fieldnme' => $row['fieldnme'],
			'filename' => $row['filename'],	
			'filepath' => $row['filepath'],	
			'extension' => $row['extension'],
			'mime' => $row['mime'],
			'updtime' => $row['updtime'],
			'kind' => $row['kind'],	
			'seq' => $row['seq'],	
			'content' => $content
		);
		array_push($files, $entry);		
}

$array = array(
		"debug" => $debug,
		"param" => $param,
		"answer" => $savedanswer,
		"score" => $score,
		"highscoremode" => $highscoremode,
		"files" => $files,
	);

echo json_encode($array);
?>