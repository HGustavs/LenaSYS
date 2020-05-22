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
$showall=getOP('showall');
$contactable=getOP('contactable');
$rating=getOP('score');
$entryname=getOP('entryname');
$showall="true";

$param = "UNK";
$savedanswer = "";
$highscoremode = "";
$quizfile = "UNK";
$grade = "UNK";
$submitted = "";
$marked ="";

$hr=false;
$insertparam = false;
$score = 0;
$timeUsed;
$stepsUsed;
$duggafeedback="UNK";
$variants=array();

// Create empty array for dugga info!
$duggainfo=array();

$debug="NONE!";	

$log_uuid = getOP('log_uuid');
$info=$opt." ".$courseid." ".$coursevers." ".$duggaid." ".$moment." ".$segment." ".$answer;
logServiceEvent($log_uuid, EventTypes::ServiceServerStart, "showDuggaservice.php",$userid,$info);

//------------------------------------------------------------------------------------------------
// Retrieve Information			
//------------------------------------------------------------------------------------------------

// Read visibility of course
$query = $pdo->prepare("SELECT visibility FROM course WHERE cid=:cid");
$query->bindParam(':cid', $courseid);
$result = $query->execute();
if($row = $query->fetch(PDO::FETCH_ASSOC)){
		$cvisibility=$row['visibility'];
}else{
		$debug="Error reading course visibility";
}
// Read visibility of dugga (listentry)
$query = $pdo->prepare("SELECT visible FROM listentries WHERE cid=:cid and lid=:moment");
$query->bindParam(':cid', $courseid);
$query->bindParam(':moment', $moment);
$result = $query->execute();
if($row = $query->fetch(PDO::FETCH_ASSOC)){
		$dvisibility=$row['visible'];
}else{
		$debug="Error reading dugga visibility";
}

// Get type of dugga
$query = $pdo->prepare("SELECT * FROM quiz WHERE id=:duggaid;");
$query->bindParam(':duggaid', $duggaid);
$result=$query->execute();
if (!$result) err("SQL Query Error: ".$pdo->errorInfo(),"quizfile Querying Error!");
foreach($query->fetchAll() as $row) {
	$duggainfo=$row;
	$quizfile = $row['quizFile'];
}

// Retrieve all dugga variants
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

$hr = false;
if(checklogin()){
	if((hasAccess($userid, $courseid, 'r')&&($dvisibility == 1 || $dvisibility == 2))||isSuperUser($userid)) $hr=true;
}

// Case 1: If course is public and dugga is public and we are not part of the course we should see a preview
// Case 2: If dugga req login and we are logged and have read access
$demo=false;
if ($cvisibility == 1 && $dvisibility == 1 && !$hr) $demo=true;

if($demo){
	// We are not logged in - provide the first variant as demo.
	$param=html_entity_decode($variants[0]['param']);	
} else if ($hr){
	// We are part of the course - assign variant
	// See if we already have a result i.e. a chosen variant.
	$query = $pdo->prepare("SELECT score,aid,cid,quiz,useranswer,variant,moment,vers,uid,marked,feedback,grade,submitted FROM userAnswer WHERE uid=:uid AND cid=:cid AND moment=:moment AND vers=:coursevers;");
	$query->bindParam(':cid', $courseid);
	$query->bindParam(':coursevers', $coursevers);
	$query->bindParam(':uid', $userid);
	$query->bindParam(':moment', $moment);
	$result = $query->execute();

	$savedvariant="UNK";
	$newvariant="UNK";
	$savedanswer="UNK";
	$isIndb=false;

	if ($row = $query->fetch(PDO::FETCH_ASSOC)) {
		$savedvariant=$row['variant'];
		$savedanswer=$row['useranswer'];
		$score = $row['score'];
		$isIndb=true;
		if ($row['feedback'] != null){
				$duggafeedback = $row['feedback'];
		} else {
				$duggafeedback = "UNK";
		}
		$grade = $row['grade'];
		$submitted = $row['submitted'];
		$marked = $row['marked'];
	}
	
	// If selected variant is not found - pick another from working list.
	// Should we connect this to answer or not e.g. if we have an answer should we still give a working variant??
	$foundvar=-1;
	foreach ($variants as $key => $value){
			if($savedvariant==$value['vid']&&$value['disabled']==0) $foundvar=$key;
	}
	if($foundvar==-1){
			$savedvariant="UNK";
	}

	// If there are many variants, randomize
	if($savedvariant==""||$savedvariant=="UNK"){
		// Randomize at most 8 times
		$cnt=0;
		do{
				$randomno=rand(0,sizeof($variants)-1);
				
				// If there is a variant choose one at random
				if(sizeof($variants)>0){
						if($variants[$randomno]['disabled']==0){
								$newvariant=$variants[$randomno]['vid'];						
						}
				} 
				$cnt++;
		}while($cnt<8&&$newvariant=="UNK");
		
		// if none has been chosen and there is a first one take that one.
		if($newvariant=="UNK" && $firstvariant!=-1) $newvariant=$firstvariant;
	}else{
		// There is a variant already -- do nothing!	
	}
	
	// Savedvariant now contains variant (from previous visit) "" (null) or UNK (no variant inserted)
	if ($newvariant=="UNK"){

	} else if ($newvariant!="UNK") {
		
		if($isIndb){
			$query = $pdo->prepare("UPDATE userAnswer SET variant=:variant WHERE uid=:uid AND cid=:cid AND moment=:moment AND vers=:coursevers;");
			$query->bindParam(':cid', $courseid);
			$query->bindParam(':coursevers', $coursevers);
			$query->bindParam(':uid', $userid);
			$query->bindParam(':moment', $moment);
			$query->bindParam(':variant', $newvariant);
			if(!$query->execute() || $query->rowCount()==0) {
				$error=$query->errorInfo();
				$debug="Error updating variant (row ".__LINE__.") ".$query->rowCount()." row(s) were updated. Error code: ".$error[2];
			}
			$savedvariant=$newvariant;

		}else if(!$isIndb){
			$query = $pdo->prepare("INSERT INTO userAnswer(uid,cid,quiz,moment,vers,variant) VALUES(:uid,:cid,:did,:moment,:coursevers,:variant);");
			$query->bindParam(':cid', $courseid);
			$query->bindParam(':coursevers', $coursevers);
			$query->bindParam(':uid', $userid);
			$query->bindParam(':did', $duggaid);
			$query->bindParam(':moment', $moment);
			$query->bindParam(':variant', $newvariant);
			if(!$query->execute()) {
				$error=$query->errorInfo();
				$debug="Error inserting variant (row ".__LINE__.") ".$query->rowCount()." row(s) were inserted. Error code: ".$error[2];
			}
						
			$savedvariant=$newvariant;
			//------------------------------
			//mark segment as started on
      //------------------------------
      /*
			$query = $pdo->prepare("INSERT INTO userAnswer(uid,cid,quiz,moment,vers,variant) VALUES(:uid,:cid,:did,:moment,:coursevers,:variant);");
			$query->bindParam(':cid', $courseid);
			$query->bindParam(':coursevers', $coursevers);
			$query->bindParam(':uid', $userid);
			$query->bindParam(':did', $duggaid);
			$query->bindParam(':moment', $segment);
			$query->bindParam(':variant', $newvariant);
			if(!$query->execute()) {
				$error=$query->errorInfo();
				$debug="Error inserting variant (row ".__LINE__.") ".$query->rowCount()." row(s) were inserted. Error code: ".$error[2];
      }
      */
		}
	}
	// Retrieve variant
	if($insertparam == false){
			$param="NONE!";
	}
	foreach ($variants as $variant) {
		if($variant["vid"] == $savedvariant){
				$param=html_entity_decode($variant['param']);
		}
	}

}else{

}
//------------------------------------------------------------------------------------------------
// Services
//------------------------------------------------------------------------------------------------

if(checklogin()){
		if($hr&&$userid!="UNK" || isSuperUser($userid)){ // The code for modification using sessions			
        if(strcmp($opt,"SAVDU")==0){				
            // Log the dugga write
            makeLogEntry($userid,2,$pdo,$courseid." ".$coursevers." ".$duggaid." ".$moment." ".$answer);
            $discription = $couseid." ".$duggaid." ".$moment." ".$answer;
            logUserEvent($userid, $username, EventTypes::DuggaFileupload,$discription);

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
            $grade = null;

            if ($row = $query->fetch(PDO::FETCH_ASSOC)) {
                $grade=$row['grade'];
            }

            if(($grade == 2) || ($grade == 3)||($grade == 4) || ($grade == 5)||($grade == 6)){
                //if grade equal G, VG, 3, 4, 5, or 6
                $debug="You have already passed this dugga. You are not required/allowed to submit anything new to this dugga.";
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
                if(!$query->execute()) {
                	$error=$query->errorInfo();
                	$debug="Error updating answer. (row ".__LINE__.") ".$query->rowCount()." row(s) were updated. Error code: ".$error[2];
                } else if ($query->rowCount() == 0) {
                	$debug="You probably do not have any variants done";
                }	else {
                	$savedanswer = $answer;
                }
                // Make sure that current version is set to active for this student
                $vuery = $pdo->prepare("SELECT vers FROM user_course WHERE uid=:uid AND cid=:cid");
              	$vuery->bindParam(':cid', $courseid);
              	$vuery->bindParam(':uid', $userid);
              	if(!$vuery->execute()) {
                		$error=$vuery->errorInfo();
                		$debug="Error inserting active version (row ".__LINE__.") ".$vuery->rowCount()." row(s) were inserted. Error code: ".$error[2];
              	}else{
                    // Since we now have submitted a dugga to this course version it should be our active course version
                    // Check if this is the case
                    if ($row = $vuery->fetch(PDO::FETCH_ASSOC)) {
                      	$cvers=$row['vers'];
                        if($coursevers!=$cvers){
                            $vuery = $pdo->prepare("UPDATE user_course set vers=:vers, vershistory=CONCAT(vershistory, CONCAT(:vers,',')) WHERE uid=:uid AND cid=:cid");
                          	$vuery->bindParam(':cid', $courseid);
                          	$vuery->bindParam(':vers', $coursevers);
                          	$vuery->bindParam(':uid', $userid);
                          	if(!$vuery->execute()) {
                          		$error=$vuery->errorInfo();
                          		$debug="Error inserting active version (row ".__LINE__.") ".$vuery->rowCount()." row(s) were inserted. Error code: ".$error[2];
                          	}                                            
                        }
                    }
                }
                
            }
            
            // Get submission date
            $query = $pdo->prepare("SELECT submitted from userAnswer WHERE uid=:uid AND cid=:cid AND moment=:moment AND vers=:coursevers;");
            $query->bindParam(':cid', $courseid);
            $query->bindParam(':coursevers', $coursevers);
            $query->bindParam(':uid', $userid);
            $query->bindParam(':moment', $moment);
            if(!$query->execute()) {
            	$error=$query->errorInfo();
            	$debug="Error fetching submit date. (row ".__LINE__.") ".$error[2];
            }				
            if ($row = $query->fetch(PDO::FETCH_ASSOC)) {
            	$submitted=$row['submitted'];
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
	$variant = $temp[3];

	
	$query = $pdo->prepare("SELECT variant.variantanswer,useranswer,feedback FROM variant,userAnswer WHERE userAnswer.quiz = variant.quizID and userAnswer.cid = :cid and userAnswer.vers = :vers and variant.vid = :vid");
	$query->bindParam(':cid', $first);
	$query->bindParam(':vers', $second);
	$query->bindParam(':vid', $variant);
	$query->execute();
	$result = $query->fetch();
	
	$setanswer="";
	
	$setanswer=$result['variantanswer'];
	
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
if(strcmp($grade,"") == 0){$grade = "UNK";} // Return UNK if we have no grade
if(strcmp($submitted,"") == 0){$submitted = "UNK";} // Return UNK if we have not submitted 
if(strcmp($marked,"") == 0){$marked = "UNK";} // Return UNK if we have not been marked

$userCount = 1;
if(strcmp($opt,"GRPDUGGA")==0){
	$query = $pdo->prepare("SELECT groups FROM user_course WHERE uid=:uid AND cid=:cid AND vers=:vers;");
	$query->bindParam(':uid', $userid);
	$query->bindParam(':cid', $courseid);
	$query->bindParam(':vers', $coursevers);
	$query->execute();
	$result = $query->fetch();
	$group = $result['groups'];

	$query = $pdo->prepare("SELECT uid FROM user_course WHERE cid=:cid AND vers=:vers AND groups=:group;");
	$query->bindParam(':cid', $courseid);
	$query->bindParam(':vers', $coursevers);
	$query->bindParam(':group', $group, PDO::PARAM_STR);
	
	$result = $query->execute();
	$usersInGroup = array();
	foreach($query->fetchAll() as $row) {
		$user = $row['uid'];
		if ($user != $userid) {
			array_push($usersInGroup, $user);
		}
	}
	$userCount += count($usersInGroup);
}

$files= array();
for ($i = 0; $i < $userCount; $i++) {
	if ($showall==="true"){
		$query = $pdo->prepare("select subid,uid,vers,did,fieldnme,filename,extension,mime,updtime,kind,filepath,seq,segment from submission where uid=:uid and vers=:vers and cid=:cid order by subid,fieldnme,updtime asc;");  
	} else {
		$query = $pdo->prepare("select subid,uid,vers,did,fieldnme,filename,extension,mime,updtime,kind,filepath,seq,segment from submission where uid=:uid and vers=:vers and cid=:cid and did=:did order by subid,fieldnme,updtime asc;");  
		$query->bindParam(':did', $duggaid);
	}
	if ($i == 0) {
		$query->bindParam(':uid', $userid);
	} else {
		$query->bindParam(':uid', $usersInGroup[$i-1]);
	}
	$query->bindParam(':cid', $courseid);
	$query->bindParam(':vers', $coursevers);
		
	$result = $query->execute();
	
	// Store current day in string
	$today = date("Y-m-d H:i:s");
	
	foreach($query->fetchAll() as $row) {
			
			$content = "UNK";
			$feedback = "UNK";
	
			$currcvd=getcwd();
			
			$fedbname=$currcvd."/".$row['filepath'].$row['filename'].$row['seq']."_FB.txt";				
			if(!file_exists($fedbname)) {
					$feedback="UNK";
			} else {
				if($today > $duggainfo['qrelease']  || is_null($duggainfo['qrelease'])){
					$feedback=file_get_contents($fedbname);				
				}
			}			
			
			if($row['kind']=="3"){
					// Read file contents
					$movname=$currcvd."/".$row['filepath']."/".$row['filename'].$row['seq'].".".$row['extension'];
	
					if(!file_exists($movname)) {
							$content="UNK!";
					} else {
							$content=file_get_contents($movname);
					}
			}	else if($row['kind']=="2"){
					// File content is an URL
					$movname=$currcvd."/".$row['filepath']."/".$row['filename'].$row['seq'];
	
					if(!file_exists($movname)) {
							$content="UNK URL!";
					} else {
							$content=file_get_contents($movname);
					}
			}else{
					$content="Not a text-submit or URL";
			}
		
 			$uQuery = $pdo->prepare("SELECT username FROM user WHERE uid=:uid;");
			$uQuery->bindParam(':uid', $row['uid'], PDO::PARAM_INT);
			$uQuery->execute();
			$uRow = $uQuery->fetch();
			$username = $uRow['username'];

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
				'segment' => $row['segment'],	
				'content' => $content,
				'feedback' => $feedback,
				'username' => $username
			);
	
			// If the filednme key isn't set, create it now
			 if (!isset($files[$row['segment']])) $files[$row['segment']] = array();
	
			array_push($files[$row['segment']], $entry);	
	}
}


if (sizeof($files) === 0) {$files = (object)array();} // Force data type to be object

// Use string compare to clear grade if not released yet!
if($today < $duggainfo['qrelease']  && !(is_null($duggainfo['qrelease']))){
		$grade="UNK";
		$duggafeedback="UNK";
}
//Fetches Data From listentries Table
if(strcmp($opt,"CHECKFDBCK")==0){	
	$query = $pdo->prepare("SELECT feedbackenabled, feedbackquestion FROM listentries WHERE lid=:moment AND cid=:cid;");
	$query->bindParam(':cid', $courseid);
	$query->bindParam(':moment', $moment);
	$query->execute();
	$result = $query->fetch();
	$userfeedback = $result['feedbackenabled'];
	$feedbackquestion = $result['feedbackquestion'];		
}
//inserts Data to Feedback Table, with and without username
if(strcmp($opt,"SENDFDBCK")==0){
	if($contactable == 1){
		$query = $pdo->prepare("INSERT INTO userduggafeedback(username,cid,lid,score,entryname) VALUES (:username,:cid,:lid,:score,:entryname);");
		$query->bindParam(':username', $loginname);
		$query->bindParam(':cid', $courseid);
		$query->bindParam(':lid', $moment);
		$query->bindParam(':score', $rating);
		$query->bindParam(':entryname', $entryname);
		$query->execute();
	}else{
		$query = $pdo->prepare("INSERT INTO userduggafeedback(cid,lid,score,entryname) VALUES (:cid,:lid,:score,:entryname);");
		$query->bindParam(':cid', $courseid);
		$query->bindParam(':lid', $moment);
		$query->bindParam(':score', $rating);
		$query->bindParam(':entryname', $entryname);
		$query->execute();
	}	
}

$array = array(
		"debug" => $debug,
		"param" => $param,
		"answer" => $savedanswer,
		"score" => $score,
		"highscoremode" => $highscoremode,
		"feedback" => $duggafeedback,
		"grade" => $grade,
		"submitted" => $submitted,
		"marked" => $marked,
		"deadline" => $duggainfo['deadline'],
		"release" => $duggainfo['qrelease'],
		"files" => $files,
		"userfeedback" => $userfeedback,
		"feedbackquestion" => $feedbackquestion,
		"variant" => $savedvariant,
	);
if (strcmp($opt, "GRPDUGGA")==0) $array["group"] = $group;

echo json_encode($array);

logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "showDuggaservice.php",$userid,$info);

?>
