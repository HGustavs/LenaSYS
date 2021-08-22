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

// //See if there's any hash identical to the one generated
// $query = $pdo->prepare("SELECT hash FROM userAnswer WHERE hash=:hash");
// $query->bindParam(':hash', $hash);
// $result=$query->execute();

// if($row = $query->fetch(PDO::FETCH_ASSOC)){
//     $hashTest=$row['hash'];
//     if($hashTest == null) {
//         $ishashindb = false;	//Unique hash.
//     } else {
//         $ishashindb = true;		//Already in database. (1 in 1000000 possibility)
//     }
// }

// // Read visibility of course
// $query = $pdo->prepare("SELECT visibility FROM course WHERE cid=:cid");
// $query->bindParam(':cid', $courseid);
// $result = $query->execute();
// if($row = $query->fetch(PDO::FETCH_ASSOC)){
// 	$cvisibility=$row['visibility'];
// }else{
// 	error_log("Error reading course visibility", 0);
// }
// // Read visibility of dugga (listentry)
// $query = $pdo->prepare("SELECT visible FROM listentries WHERE cid=:cid and lid=:moment");
// $query->bindParam(':cid', $courseid);
// $query->bindParam(':moment', $moment);
// $result = $query->execute();
// if($row = $query->fetch(PDO::FETCH_ASSOC)){
// 	$dvisibility=$row['visible'];
// }else{	
// 	error_log("Error reading course visibility", 0);
// }

// // Get type of dugga
// $query = $pdo->prepare("SELECT * FROM quiz WHERE id=:duggaid;");
// $query->bindParam(':duggaid', $duggaid);
// $result=$query->execute();
// if (!$result) err("SQL Query Error: ".$pdo->errorInfo(),"quizfile Querying Error!");
// foreach($query->fetchAll() as $row) {
// 	$duggainfo=$row;
// 	$quizfile = $row['quizFile'];
// }

// // Retrieve all dugga variants
// $firstvariant=-1;
// $query = $pdo->prepare("SELECT vid,param,disabled FROM variant WHERE quizID=:duggaid;");
// $query->bindParam(':duggaid', $duggaid);
// $result=$query->execute();
// if (!$result) err("SQL Query Error: ".$pdo->errorInfo(),"variant Querying Error!");
// $i=0;
// foreach($query->fetchAll() as $row) {
// 	if($row['disabled']==0) $firstvariant=$i;
// 	$variants[$i]=array(
// 		'vid' => $row['vid'],
// 		'param' => $row['param'],
// 		'disabled' => $row['disabled']
// 	);
// 	$i++;
// 	$insertparam = true;
// }

// $query = $pdo->prepare("SELECT score,aid,cid,quiz,useranswer,variant,moment,vers,marked,feedback,grade,submitted,hash,password,timesSubmitted FROM userAnswer WHERE hash=:hash;");

//     $query->bindParam(':hash', $hash);
//     $result = $query->execute();

	

//     if ($row = $query->fetch(PDO::FETCH_ASSOC)) {
//         $savedvariant=$row['variant'];
//         $savedanswer=$row['useranswer'];
//         $score = $row['score'];
//         $isIndb=true;
//         $grade = $row['grade'];
//         $submitted = $row['submitted'];
//         $marked = $row['marked'];
// 		$password = $row['password'];
//         $timesSubmitted = $row['timesSubmitted'];
// 		$tempmoment = $row['moment'];
//     }
// 	$query = $pdo->prepare("SELECT entryname FROM listentries WHERE lid=:moment;");
// 	$query->bindParam(':moment', $tempmoment);
// 	$result = $query->execute();
// 	if($row = $query->fetch(PDO::FETCH_ASSOC)){
// 		$duggatitle=$row['entryname'];
// 	} 

// -------------------------OLD FUNCTIONALITY WHERE WE CHECK IF USER IS LOGGED IN AND HAS ACESS-------------------


// if(checklogin()){
// 	if((hasAccess($userid, $courseid, 'r')&&($dvisibility == 1 || $dvisibility == 2))||isSuperUser($userid)) $hr=true;
// }

// // Case 1: If course is public and dugga is public and we are not part of the course we should see a preview
// // Case 2: If dugga req login and we are logged and have read access
// $demo=false;
// if ($cvisibility == 1 && $dvisibility == 1 && !$hr) $demo=true;

// if($demo || $hr){
		
// 	// If selected variant is not found - pick another from working list.
// 	// Should we connect this to answer or not e.g. if we have an answer should we still give a working variant??
// 	$foundvar=-1;
// 	foreach ($variants as $key => $value){
// 			if($savedvariant==$value['vid']&&$value['disabled']==0) $foundvar=$key;
// 	}
// 	if($foundvar==-1){
// 			$savedvariant="UNK";
// 	}
// 	// If there are many variants, randomize
// 	if($savedvariant==""||$savedvariant=="UNK"){
// 		// Randomize at most 8 times
// 		$cnt=0;
// 		do{
// 				$randomno=rand(0,sizeof($variants)-1);
				
// 				// If there is a variant choose one at random
// 				if(sizeof($variants)>0){
// 						if($variants[$randomno]['disabled']==0){
// 								$newvariant=$variants[$randomno]['vid'];						
// 						}
// 				} 
// 				$cnt++;
// 		}while($cnt<8&&$newvariant=="UNK");
		
// 		// if none has been chosen and there is a first one take that one.
// 		if($newvariant=="UNK" && $firstvariant!=-1) $newvariant=$firstvariant;

// 		$savedvariant=$newvariant;
// 	}else{
	
// 		// There is a variant already -- do nothing!	
// 	}
	
// 	// Retrieve variant
// 	if($insertparam == false){
// 			$param="NONE!";
// 	}
// 	foreach ($variants as $variant) {
// 		if($variant["vid"] == $savedvariant){
// 			$param=html_entity_decode($variant['param']);
// 		}
// 	}

// 	$query = $pdo->prepare("SELECT MAX(quizID) FROM variant");
// 	$query->execute();
// 	$variantsize = $query->fetchColumn();

// 	//If the variant value is unknown (E.G: UNK) then we retrieve the variant from the variant set in useranswer 
// 	//where there exists a corresponding hash, and set the resulting useranswer.variant into $variantvalue

// 	error_log("!=UNK".$variantvalue);
// 	if($variantvalue == "UNK") {
// 		$query = $pdo->prepare("SELECT useranswer.variant FROM userAnswer WHERE hash=:hash");
// 		$query->bindParam(':hash', $hash);
// 		$query->execute();
// 		$result = $query->fetch();
// 		if($param != null) {
// 			$variantvalue = $result['variant'];
// 			$hashvariant = $result['variant'];
// 		}
// 		//error_log("==UNK".$result['variant']);
// 	}

// 	//Makes sure that the localstorage variant is set before retrieving data from database
// 	if($variantvalue != "undefined") {
// 		$query = $pdo->prepare("SELECT param FROM variant WHERE vid=:vid");
// 		$query->bindParam(':vid', $variantvalue);
// 		$query->execute();
// 		$result = $query->fetch();
// 		$param=html_entity_decode($result['param']);
// 		//error_log("!=UNK".$variantvalue);
// 	}
// } 
// else if ($hr){
// 	//Finds the highest variant.quizID, which is then used to compare against the duggaid to make sure that the dugga is within the scope of listed duggas in the database
// 	$query = $pdo->prepare("SELECT MAX(quizID) FROM variant");
// 	$query->execute();
// 	$variantsize = $query->fetchColumn();

// 	if($isIndb){ // If dugga is in database, get the variant from the database
// 		if($insertparam == false){
// 			$param="NONE!";
// 		}
// 		foreach ($variants as $variant) {
// 			if($variant["vid"] == $variantvalue){
// 					$param=html_entity_decode($variant['param']);
// 			}
// 		}
// 	}else if(!$isIndb){ // If dugga is not in database, get the variant from the localstorage
// 		$query = $pdo->prepare("SELECT param FROM variant WHERE vid=:vid");
// 		$query->bindParam(':vid', $variantvalue);
// 		$query->execute();
// 		$result = $query->fetch();
// 		$param=html_entity_decode($result['param']);
// 	}
// }

//------------------------------------------------------------------------------------------------
// Services
//------------------------------------------------------------------------------------------------

/* -------------------------OLD FUNCTIONALITY WHERE WE CHECK IF USER IS LOGGED IN AND HAS ACESS-------------------
//------------------------------------------------------
if(checklogin()){
		if($hr&&$userid!="UNK" || isSuperUser($userid)){ // The code for modification using sessions			
			*/
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
				$link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]/sh/?s=$hash";

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

			// $timesSubmitted = $timesSubmitted + 1;

            // //Seperate timeUsed, stepsUsed and score from $answer
            // $temp = explode("##!!##", $answer);
            // $answer = $temp[0];
            // $timeUsed = $temp[1];
            // $stepsUsed = $temp[2];
            // $score = $temp[3];

            // // check if the user already has a grade on the assignment
            // $query = $pdo->prepare("SELECT grade from userAnswer WHERE hash=:hash;");
            // $query->bindParam(':hash', $hash);			

            // $query->execute();
            // $grade = null;

            // if ($row = $query->fetch(PDO::FETCH_ASSOC)) {
            //     $grade=$row['grade'];
            // }

            // if(($grade == 2) || ($grade == 3)||($grade == 4) || ($grade == 5)||($grade == 6)){
            //     //if grade equal G, VG, 3, 4, 5, or 6
            //     $debug="You have already passed this dugga. You are not required/allowed to submit anything new to this dugga.";
            // }else{

			// if(!$isIndb){ // If the dugga is not in database, insert into database
			// 	$query = $pdo->prepare("INSERT INTO userAnswer(cid,quiz,moment,vers,variant,hash,password,timesSubmitted,timesAccessed) VALUES(:cid,:did,:moment,:coursevers,:variant,:hash,:password,:timesSubmitted, :timesAccessed);");
			// 	$query->bindParam(':cid', $courseid);
			// 	$query->bindParam(':coursevers', $coursevers);
			// 	$query->bindParam(':did', $duggaid);
			// 	$query->bindParam(':moment', $moment);
			// 	$query->bindParam(':variant', $savedvariant);
			// 	$query->bindParam(':hash', $hash);
			// 	$query->bindParam(':password', $password);
			// 	$query->bindParam(':timesSubmitted', $timesSubmitted);
			// 	$query->bindParam(':timesAccessed', $timesAccessed);
			// 	if(!$query->execute()) {
			// 		$error=$query->errorInfo();
			// 		$debug="Error inserting variant (row ".__LINE__.") ".$query->rowCount()." row(s) were inserted. Error code: ".$error[2];
			// 	}
			// //Resets the hasuploaded variable so we get prompted for password
			// $_SESSION['hasUploaded'] = 0;
			// }

            //   	// Update Dugga!
            //   	$query = $pdo->prepare("UPDATE userAnswer SET submitted=NOW(), useranswer=:useranswer, timeUsed=:timeUsed, totalTimeUsed=totalTimeUsed + :timeUsed, stepsUsed=:stepsUsed, totalStepsUsed=totalStepsUsed+:stepsUsed, score=:score, timesSubmitted=:timesSubmitted WHERE hash=:hash;");
            //   	$query->bindParam(':hash', $hash);
            //   	$query->bindParam(':useranswer', $answer);
            //   	$query->bindParam(':timeUsed', $timeUsed);
            //   	$query->bindParam(':stepsUsed', $stepsUsed);
            //   	$query->bindParam(':score', $score);
			// 	$query->bindParam(':timesSubmitted', $timesSubmitted);
            //     if(!$query->execute()) {
            //     	$error=$query->errorInfo();
            //     	$debug="Error updating answer. (row ".__LINE__.") ".$query->rowCount()." row(s) were updated. Error code: ".$error[2];
            //     } else if ($query->rowCount() == 0) {
            //     	$debug="You probably do not have any variants done";
            //     }	else {
            //     	$savedanswer = $answer;
            //     }

            //     // Make sure that current version is set to active for this student
            //     $vuery = $pdo->prepare("SELECT vers FROM user_course WHERE uid=:uid AND cid=:cid");
            //   	$vuery->bindParam(':cid', $courseid);
            //   	$vuery->bindParam(':uid', $userid);
            //   	if(!$vuery->execute()) {
            //     		$error=$vuery->errorInfo();
            //     		$debug="Error inserting active version (row ".__LINE__.") ".$vuery->rowCount()." row(s) were inserted. Error code: ".$error[2];
            //   	}else{
            //         // Since we now have submitted a dugga to this course version it should be our active course version
            //         // Check if this is the case
            //         if ($row = $vuery->fetch(PDO::FETCH_ASSOC)) {
            //           	$cvers=$row['vers'];
            //             if($coursevers!=$cvers){
            //                 $vuery = $pdo->prepare("UPDATE user_course set vers=:vers, vershistory=CONCAT(vershistory, CONCAT(:vers,',')) WHERE uid=:uid AND cid=:cid");
            //               	$vuery->bindParam(':cid', $courseid);
            //               	$vuery->bindParam(':vers', $coursevers);
            //               	$vuery->bindParam(':uid', $userid);
            //               	if(!$vuery->execute()) {
            //               		$error=$vuery->errorInfo();
            //               		$debug="Error inserting active version (row ".__LINE__.") ".$vuery->rowCount()." row(s) were inserted. Error code: ".$error[2];
            //               	}                                            
            //             }
            //         }
            //     }
                
            // }
            
            // // Get submission date
            // $query = $pdo->prepare("SELECT submitted from userAnswer WHERE hash=:hash;");
            // $query->bindParam(':hash', $hash);
            // if(!$query->execute()) {
            // 	$error=$query->errorInfo();
            // 	$debug="Error fetching submit date. (row ".__LINE__.") ".$error[2];
            // }				
            // if ($row = $query->fetch(PDO::FETCH_ASSOC)) {
            // 	$submitted=$row['submitted'];
            // }
        } else {

			unset($variant);
			unset($answer);
			unset($variantanswer);
			unset($param);
			if($hash!="UNK" && $hashpwd!="UNK"){
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
					$link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]/sh/?s=$hash";
				}else{
					$debug="Could not load dugga! Incorrect hash/password! $hash/$hashpwd";
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
				
					$sql="SELECT variant.vid AS vid,IF(useranswer is NULL,'UNK',useranswer) AS useranswer,variantanswer,param FROM variant LEFT JOIN userAnswer ON userAnswer.variant=variant.vid AND hash=:hash AND password=:hashpwd WHERE vid=:variant LIMIT 1;";
					$query = $pdo->prepare($sql);
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
			
					if(isset($variantanswer)){
			
			
					}else{
						$debug="Missing hash/password/variant!";
						$variant="UNK";
						$answer="UNK";
						$variantanswer="UNK";
						$param=html_entity_decode('{}');
						unset($_SESSION["submission-$courseid-$coursevers-$duggaid"]);
						unset($_SESSION["submission-password-$courseid-$coursevers-$duggaid"]);
						unset($_SESSION["submission-variant-$courseid-$coursevers-$duggaid"]);	
					}
				}else{
					$debug="Missing hash/password/variant!";
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
//		}
//	}

//------------------------------------------------------------------------------------------------
// Retrieve Information			
//------------------------------------------------------------------------------------------------

// if(strcmp($opt,"GETVARIANTANSWER")==0){
// 	$temp = explode(" ", $setanswer);
// 	$first = $temp[0];
// 	$second = $temp[1];
// 	$thrid = $temp[2];
// 	$variant = $temp[3];

	
// 	$query = $pdo->prepare("SELECT variant.variantanswer,useranswer FROM variant,userAnswer WHERE userAnswer.quiz = variant.quizID and userAnswer.cid = :cid and userAnswer.vers = :vers and variant.vid = :vid");
// 	$query->bindParam(':cid', $first);
// 	$query->bindParam(':vers', $second);
// 	$query->bindParam(':vid', $variant);
// 	$query->execute();
// 	$result = $query->fetch();
	
// 	$setanswer="";
	
// 	$setanswer=$result['variantanswer'];
	
// 	// makeLogEntry($userid,2,$pdo,$first);
// 	$insertparam = true;
// 	$param = $setanswer;
// }

// $param = str_replace("*##*", '"', $param);
// $savedanswer = str_replace("*##*", '"', $savedanswer);
// $param = str_replace("*###*", '&cap;', $param);
// $savedanswer = str_replace("*###*", '&cap;', $savedanswer);
// $param = str_replace("*####*", '&cup;', $param);
// $savedanswer = str_replace("*####*", '&cup;', $savedanswer);
// if(strcmp($savedanswer,"") == 0){$savedanswer = "UNK";} // Return UNK if we have not submitted any answer
// if(strcmp($grade,"") == 0){$grade = "UNK";} // Return UNK if we have no grade
// if(strcmp($submitted,"") == 0){$submitted = "UNK";} // Return UNK if we have not submitted 
// if(strcmp($marked,"") == 0){$marked = "UNK";} // Return UNK if we have not been marked

// $userCount = 1;
// if(strcmp($opt,"GRPDUGGA")==0){
// 	$query = $pdo->prepare("SELECT groups FROM user_course WHERE uid=:uid AND cid=:cid AND vers=:vers;");
// 	$query->bindParam(':uid', $userid);
// 	$query->bindParam(':cid', $courseid);
// 	$query->bindParam(':vers', $coursevers);
// 	$query->execute();
// 	$result = $query->fetch();
// 	$group = $result['groups'];

// 	$query = $pdo->prepare("SELECT uid FROM user_course WHERE cid=:cid AND vers=:vers AND groups=:group;");
// 	$query->bindParam(':cid', $courseid);
// 	$query->bindParam(':vers', $coursevers);
// 	$query->bindParam(':group', $group, PDO::PARAM_STR);
	
// 	$result = $query->execute();
// 	$usersInGroup = array();
// 	foreach($query->fetchAll() as $row) {
// 		$user = $row['uid'];
// 		if ($user != $userid) {
// 			array_push($usersInGroup, $user);
// 		}
// 	}
// 	$userCount += count($usersInGroup);
// }

// if(strcmp($opt,"ACCDUGGA")==0){
// 	$query = $pdo->prepare("UPDATE userAnswer SET timesAccessed= timesAccessed + 1 WHERE hash=:hash;");
// 	$query->bindParam(':hash', $hash);
// 	$query->execute();	
// }

// $files= array();
// for ($i = 0; $i < $userCount; $i++) {
// 	if ($showall==="true"){
// 		$query = $pdo->prepare("SELECT subid,vers,did,fieldnme,filename,extension,mime,updtime,kind,filepath,seq,segment,hash from submission WHERE hash=:hash AND vers=:vers AND cid=:cid ORDER BY subid,fieldnme,updtime asc;");  
// 	} else {
// 		$query = $pdo->prepare("SELECT subid,vers,did,fieldnme,filename,extension,mime,updtime,kind,filepath,seq,segment,hash from submission WHERE hash=:hash AND vers=:vers AND cid=:cid AND did=:did ORDER BY subid,fieldnme,updtime asc;");  
// 		$query->bindParam(':did', $duggaid);
// 	}
// 	if ($i == 0) {
// 		$query->bindParam(':hash', $hash);
// 	}
// 	$query->bindParam(':cid', $courseid);
// 	$query->bindParam(':vers', $coursevers);
		
// 	$result = $query->execute();
	
// 	// Store current day in string
// 	$today = date("Y-m-d H:i:s");
	
// 	foreach($query->fetchAll() as $row) {
			
// 			$content = "UNK";
// 			$feedback = "UNK";
// 			$zipdir = "";
// 			$zip = new ZipArchive;
// 			$currcvd=getcwd();
			

// 			$ziptemp = $currcvd."/".$row['filepath'].$row['filename'].$row['seq'].".".$row['extension'];

// 			if(!file_exists($ziptemp)) {
// 				$isFileSubmitted = false;
// 				$zipdir="UNK";
// 			}else{	
// 				$isFileSubmitted = true;			
// 				if ($zip->open($ziptemp) == TRUE) {
// 					for ($i = 0; $i < $zip->numFiles; $i++) {
// 						$zipdir .= $zip->getNameIndex($i).'<br />';
// 					}
// 				}
// 			}
			
// 			$fedbname=$currcvd."/".$row['filepath'].$row['filename'].$row['seq']."_FB.txt";				
// 			if(!file_exists($fedbname)) {
// 					$feedback="UNK";
// 			} else {
// 				if($today > $duggainfo['qrelease']  || is_null($duggainfo['qrelease'])){
// 					$feedback=file_get_contents($fedbname);				
// 				}
// 			}			
			
// 			if($row['kind']=="3"){
// 					// Read file contents
// 					$movname=$currcvd."/".$row['filepath']."/".$row['filename'].$row['seq'].".".$row['extension'];

// 					if(!file_exists($movname)) {
// 							$content="UNK!";
// 					} else {
// 							$content=file_get_contents($movname);
// 					}
// 			}	else if($row['kind']=="2"){
// 					// File content is an URL
// 					$movname=$currcvd."/".$row['filepath']."/".$row['filename'].$row['seq'];
	
// 					if(!file_exists($movname)) {
// 							$content="UNK URL!";
// 					} else {
// 							$content=file_get_contents($movname);
// 					}
// 			}else{
// 					$content="Not a text-submit or URL";
// 			}
// 			$entry = array(
// 				'subid' => $row['subid'],
// 				'vers' => $row['vers'],
// 				'did' => $row['did'],
// 				'fieldnme' => $row['fieldnme'],
// 				'filename' => $row['filename'],	
// 				'filepath' => $row['filepath'],	
// 				'extension' => $row['extension'],
// 				'mime' => $row['mime'],
// 				'updtime' => $row['updtime'],
// 				'kind' => $row['kind'],	
// 				'seq' => $row['seq'],	
// 				'segment' => $row['segment'],	
// 				'content' => $content,
// 				'feedback' => $feedback,
// 				'username' => $username,
// 				'zipdir' => $zipdir
// 			);
	
// 			// If the filednme key isn't set, create it now
// 			 if (!isset($files[$row['segment']])) $files[$row['segment']] = array();
	
// 			array_push($files[$row['segment']], $entry);	
// 	}
// }


// if (sizeof($files) === 0) {$files = (object)array();} // Force data type to be object

// // Use string compare to clear grade if not released yet!
// if($today < $duggainfo['qrelease']  && !(is_null($duggainfo['qrelease']))){
// 		$grade="UNK";
// 		$duggafeedback = "UNK";
// }
// //Fetches Data From listentries Table
// if(strcmp($opt,"CHECKFDBCK")==0){
// 	$query = $pdo->prepare("SELECT feedbackenabled, feedbackquestion FROM listentries WHERE lid=:moment AND cid=:cid;");
// 	$query->bindParam(':cid', $courseid);
// 	$query->bindParam(':moment', $moment);
// 	$query->execute();
// 	$result = $query->fetch();
// 	$userfeedback = $result['feedbackenabled'];
// 	$feedbackquestion = $result['feedbackquestion'];		
// }
// //inserts Data to Feedback Table, with and without username
// if(strcmp($opt,"SENDFDBCK")==0){
// 	if($contactable == 1){
// 		$query = $pdo->prepare("INSERT INTO userduggafeedback(username,cid,lid,score,entryname) VALUES (:username,:cid,:lid,:score,:entryname);");
// 		$query->bindParam(':username', $loginname);
// 		$query->bindParam(':cid', $courseid);
// 		$query->bindParam(':lid', $moment);
// 		$query->bindParam(':score', $rating);
// 		$query->bindParam(':entryname', $entryname);
// 		$query->execute();
// 	}else{
// 		$query = $pdo->prepare("INSERT INTO userduggafeedback(cid,lid,score,entryname) VALUES (:cid,:lid,:score,:entryname);");
// 		$query->bindParam(':cid', $courseid);
// 		$query->bindParam(':lid', $moment);
// 		$query->bindParam(':score', $rating);
// 		$query->bindParam(':entryname', $entryname);
// 		$query->execute();
// 	}	
// }

// $isTeacher = false;
// if(hasAccess($userid, $courseid, 'w') || hasAccess($userid, $courseid, 'st') || isSuperUser($userid)){
// 	$isTeacher = true;
// }



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