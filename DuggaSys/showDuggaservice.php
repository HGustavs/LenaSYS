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

function processDuggaFiles()
{
	global $courseid;
	global $coursevers;
	global $duggaid;
	global $duggainfo;
	global $files;
	global $moment;
	global $pdo;
	$files= array();

	if(	isset($_SESSION["submission-$courseid-$coursevers-$duggaid-$moment"]) && 
	isset($_SESSION["submission-password-$courseid-$coursevers-$duggaid-$moment"]) && 
	isset($_SESSION["submission-variant-$courseid-$coursevers-$duggaid-$moment"])){

	$tmphash=$_SESSION["submission-$courseid-$coursevers-$duggaid-$moment"];
	$tmphashpwd=$_SESSION["submission-password-$courseid-$coursevers-$duggaid-$moment"];
	$tmpvariant=$_SESSION["submission-variant-$courseid-$coursevers-$duggaid-$moment"];
	
	$query = $pdo->prepare("SELECT subid,vers,did,fieldnme,filename,extension,mime,updtime,kind,filepath,seq,segment,hash from submission WHERE hash=:hash ORDER BY subid,fieldnme,updtime asc;");  
	$query->bindParam(':hash', $tmphash);
	$result = $query->execute();
	$rows = $query->fetchAll();
	
	//if the hash didn't work and the user is a superuser then retrive all submissions
	if(isSuperUser($_SESSION['uid']) && $rows == NULL){
		$query = $pdo->prepare("SELECT subid,vers,did,fieldnme,filename,extension,mime,updtime,kind,filepath,seq,segment,hash from submission WHERE segment=:moment ORDER BY subid,fieldnme,updtime asc;");  
		$query->bindParam(':moment', $moment);
		$result = $query->execute();
		$rows = $query->fetchAll();
	}
	//if the hash worked or the user was not a superuser then retrive the submission
	
	// Store current day in string
	$today = date("Y-m-d H:i:s");
	
	foreach($rows as $row) {
			
			$content = "UNK";
			$feedback = "UNK";
			$zipdir = "";
			$zip = new ZipArchive;
			$currcvd=getcwd();
			

			$ziptemp = $row['filepath'].$row['filename'].$row['seq'].".".$row['extension'];
			
			if(!file_exists($ziptemp)) {
				$isFileSubmitted = false;
				$zipdir="UNK";
			}else{	
				$isFileSubmitted = true; 		
				if ($zip->open($ziptemp) == TRUE) {
					for ($i = 0; $i < $zip->numFiles; $i++) {
						$zipdir .= $zip->getNameIndex($i).'<br />';
					}
				}
			}
						
			$fedbname=$row['filepath'].$row['filename'].$row['seq']."_FB.txt";				
			if(!file_exists($fedbname)) {
					$feedback="UNK";
			} else {
				if($today > $duggainfo['qrelease']  || is_null($duggainfo['qrelease'])){
					$feedback=file_get_contents($fedbname);				
				}
			}			
			
			if($row['kind']=="3"){
					// Read file contents
					$movname=$row['filepath']."/".$row['filename'].$row['seq'].".".$row['extension'];

					if(!file_exists($movname)) {
							$content="UNK!";
					} else {
							$content=file_get_contents($movname);
					}
			}	else if($row['kind']=="2"){
					// File content is an URL
					$movname=$row['filepath']."/".$row['filename'].$row['seq'];
	
					if(!file_exists($movname)) {
							$content="UNK URL!";
					} else {
							$content=file_get_contents($movname);
					}
			}else{
					$content="Not a text-submit or URL";
			}
			
			$entry = array(
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
				'segment' => $row['segment'],	
				'content' => $content,
				'feedback' => $feedback,
				'username' => $$tmphash,
				'zipdir' => $zipdir
			);
			
			// If the filednme key isn't set, create it now
			 if (!isset($files[$row['segment']])) $files[$row['segment']] = array();
	
			array_push($files[$row['segment']], $entry);	
		}

	}
	if (sizeof($files) === 0) {$files = (object)array();} // Force data type to be object

}


//------------------------------------------------------------------------------------------------
// Retrieve Information			
//------------------------------------------------------------------------------------------------
if(checklogin()){
	if(isset($_SESSION['uid'])){
		$userid=$_SESSION['uid'];
		$loginname=$_SESSION['loginname'];
		$lastname=$_SESSION['lastname'];
		$firstname=$_SESSION['firstname'];
	}else{
		$userid="student";		
	} 	
}

if(isSuperUser($userid)){
	$isTeacher=1;
}else{
	$isTeacher=0;
}

//------------------------------------------------------------------------------------------------
// Services
//------------------------------------------------------------------------------------------------

        if(strcmp($opt,"SAVDU")==0){
            // Log the dugga write
            makeLogEntry($userid,2,$pdo,$courseid." ".$coursevers." ".$duggaid." ".$moment." ".$answer);
            $discription = $courseid." ".$duggaid." ".$moment." ".$answer;

			if(	!isSuperUser($userid) && // Teachers cannot submit
				isset($_SESSION["submission-$courseid-$coursevers-$duggaid-$moment"]) && 
				isset($_SESSION["submission-password-$courseid-$coursevers-$duggaid-$moment"])){
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
					processDuggaFiles();
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
					processDuggaFiles();
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
						processDuggaFiles();
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
							processDuggaFiles();
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
					$hash = "UNK";
					$opt = "UNK";
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