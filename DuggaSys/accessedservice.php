<?php
date_default_timezone_set("Europe/Stockholm");
// Include basic application services!
include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";

// Connect to database and start session
pdoConnect();
session_start();

$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

checklogin();
if (isset($_SESSION['uid'])) {
    $userid = $_SESSION['uid'];
} else {
    $userid = "guest";
}

$pw = getOP('pw');
$cid = getOP('courseid');
$opt = getOP('opt');
$uid = getOP('uid');
$ssn = getOP('ssn');
$className = getOP('className');
//$firstname = getOP('firstname');
//$lastname = getOP('lastname');
$username = getOP('username');
$addedtime = getOP('addedtime');
$val = getOP('val');
$action = getOP('action');
$term = getOP('term');
$newusers = getOP('newusers');
$newclass = getOP('newclass');
$coursevers = getOP('coursevers');
$teacher = getOP('teacher');
$vers = getOP('vers');
$requestedpasswordchange = getOP('requestedpasswordchange');
$groups = array();
$gid = getOP('gid');
$queryResult = 'NONE!';
$prop=getOP('prop');
$val=getOP('val');
$access = false;

$debug="NONE!";

$log_uuid = getOP('log_uuid');
$info="opt: ".$opt." cid: ".$cid." uid: ".$uid." username: ".$username." newusers: ".$newusers;
logServiceEvent($log_uuid, EventTypes::ServiceServerStart, "accessedservice.php",$userid,$info);

if (hasAccess($userid, $cid, 'w') || isSuperUser($userid)) {
	$hasAccess = true;
} else {
	$hasAccess = false;
} 

//------------------------------------------------------------------------------------------------
// Services
//------------------------------------------------------------------------------------------------
if(checklogin() && $hasAccess) {

	if(strcmp($opt,"UPDATE")==0){

		// User Table Updates
		if($prop=="firstname"){
				$query = $pdo->prepare("UPDATE user SET firstname=:firstname WHERE uid=:uid;");
				$query->bindParam(':firstname', $val);
		}else if($prop=="lastname"){
				$query = $pdo->prepare("UPDATE user SET lastname=:lastname WHERE uid=:uid;");
				$query->bindParam(':lastname', $val);
		}else if($prop=="ssn"){
				$query = $pdo->prepare("UPDATE user SET ssn=:ssn WHERE uid=:uid;");
				$query->bindParam(':ssn', $val);
		}else if($prop=="username"){
				$query = $pdo->prepare("UPDATE user SET username=:username WHERE uid=:uid;");
				$query->bindParam(':username', $val);
		}else if($prop=="class"){
				$query = $pdo->prepare("UPDATE user SET class=:class WHERE uid=:uid;");
				$query->bindParam(':class', $val);
		}

		// User_Course Table Updates
		if($prop=="examiner"){
				$query = $pdo->prepare("UPDATE user_course SET examiner=:examiner WHERE uid=:uid AND cid=:cid;");
				//Saves if the user changes examiner to none.
				if($val == "None"){
					$val = NULL;
				}
				$query->bindParam(':examiner', $val);
		}else if($prop=="vers"){
				$query = $pdo->prepare("UPDATE user_course SET vers=:vers WHERE uid=:uid AND cid=:cid;");
				$query->bindParam(':vers', $val);
		}else if($prop=="access"){
				$query = $pdo->prepare("UPDATE user_course SET access=:access WHERE uid=:uid AND cid=:cid;");
				$query->bindParam(':access', $val);
		}else if($prop=="group"){
				$query = $pdo->prepare("UPDATE user_course SET `groups`=:groups WHERE uid=:uid AND cid=:cid;");
				$query->bindParam(':groups', $val);
		}

		if($prop=="examiner"||$prop=="vers"||$prop=="access"||$prop=="group"){
				$query->bindParam(':cid', $cid);
		}

		if($prop=="firstname"||$prop=="lastname"||$prop=="ssn"||$prop=="username"||$prop=="class"||$prop=="examiner"||$prop=="vers"||$prop=="access"||$prop=="group"){
				$query->bindParam(':uid', $uid);
				if(!$query->execute()) {
						$error=$query->errorInfo();
						$debug="Error updating user\n".$error[2];
				}
		}else{
				$debug="Failed to update property ".$prop." with value ".$val;
		}
	}else if(strcmp($opt,"ADDCLASS")==0){
		$newClassData = json_decode(htmlspecialchars_decode($newclass));

		foreach ($newClassData as $newClass) {
			$class = $newClass[0];
			$responsible = $newClass[1];
			$classname = $newClass[2];
			$regcode = $newClass[3];
			$classcode = $newClass[4];
			$hp = $newClass[5];
			$tempo = $newClass[6];
			$hpProgress = $newClass[7];
		}

		$querystring='INSERT INTO class (class, responsible, classname, regcode, classcode, hp, tempo, hpProgress) VALUES(:class, :responsible, :classname, :regcode, :classcode, :hp, :tempo, :hpProgress);';
		$stmt = $pdo->prepare($querystring);
		$stmt->bindParam(':class', $class);
		$stmt->bindParam(':responsible', $responsible);
		$stmt->bindParam(':classname', $classname);
		$stmt->bindParam(':regcode', $regcode);
		$stmt->bindParam(':classcode', $classcode);
		$stmt->bindParam(':hp', $hp);
		$stmt->bindParam(':tempo', $tempo);
		$stmt->bindParam(':hpProgress', $hpProgress);

		// Insert the user into the database.
		if(!$stmt->execute()) {
			$debug = "Not able to create the specified class.";
		}
	}else if(strcmp($opt,"CHPWD")==0){
		$query = $pdo->prepare("UPDATE user set password=:pwd, requestedpasswordchange=0 where uid=:uid;");
		$query->bindParam(':uid', $uid);
		$query->bindParam(':pwd', standardPasswordHash($pw));

		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error updating user\n".$error[2];
		}
    //log for reset password.
    logUserEvent($userid, $username, EventTypes::ResetPW, "");
	} else if(strcmp($opt,"ADDUSR")==0){
        $newUserData = json_decode(htmlspecialchars_decode($newusers));
        foreach ($newUserData as $user) {
			$uid="UNK";
			$regstatus="UNK";
			
			//if 1 user was sent and they have set a username
            if (count($user) == 1&&strcmp($user[0],"")!==0) {

				//extracts username from email
				if($saveemail){
					$username = explode('@', $saveemail)[0];
				}

                // See if user exists in database with username
                $userquery = $pdo->prepare("SELECT uid FROM user WHERE username=:username");
                $userquery->bindParam(':username', $username);

                if(!$userquery->execute()) {
                  	$error=$userquery->errorInfo();
                  	$debug.="Error adding user by ssn or username: ".$error[2];
                }else {
                  	foreach($userquery->fetchAll(PDO::FETCH_ASSOC) as $row){ $uid = $row["uid"];}
                }

                if(strcmp($uid,"UNK")===0){
                    if(strcmp($debug,"NONE!")===0){$debug="";}
                    $debug.=$user[0]." was not found as a user in the system!\n";
                }
            }else if (count($user) > 1){
            	$ssn = $user[0]; //ssn is not sent with newusers in the current implementation of lenasys

				$saveemail = $user[3];
				if(isset($saveemail)){
					$username = explode('@', $saveemail)[0];
				}else{
					$username=makeRandomString(6);
				}

              	// Check if user has an account with username (ssn is not sent in the current implementation of lenasys)
              	$userquery = $pdo->prepare("SELECT uid FROM user WHERE username=:username");
              	$userquery->bindParam(':username', $username);
              	if ($userquery->execute() && $userquery->rowCount() <= 0) {
                  	$firstname = $user[1];
                  	$lastname = $user[2];
	                $term = $user[5];
					if (isset($user[4])){
						$className = $user[4];
					}
					else{
						$className = "UNK"; // no class is sent with newusers in the current implementation of lenasys
					}

					//If a className has been set. (this is not implemented in lenasys right now)
                  	if(strcmp($className,"UNK")!==0){
                     	$cstmt = $pdo->prepare("SELECT class FROM class WHERE class=:clsnme;");
                      	$cstmt->bindParam(':clsnme', $className);

                      	if(!$cstmt->execute()) {
                        	$error=$cstmt->errorInfo();
                        	$debug.="Could not read class\n".$error[2];
                      	}

                      	// If class does not exist
                      	if($cstmt->rowCount() === 0){
                          	$querystring='INSERT INTO class (class, responsible) VALUES(:className,1);';
                          	$stmt = $pdo->prepare($querystring);
                          	$stmt->bindParam(':className', $className);
                          	if(!$stmt->execute()) {
                              	$error=$stmt->errorInfo();
                              	$debug.="Error inserting into class\n".$error[2];
                          	}
                      	}
                  	}

					//creates a new user if one didn't exist in the database
					if($uid=="UNK"){
						$rnd=standardPasswordHash(makeRandomString(9));
						$querystring='INSERT INTO user (username, email, firstname, lastname, ssn, password,addedtime, class) VALUES(:username,:email,:firstname,:lastname,:ssn,:password,now(),:className);';
						$stmt = $pdo->prepare($querystring);
						$stmt->bindParam(':username', $username);
						$stmt->bindParam(':email', $saveemail);
						$stmt->bindParam(':firstname', $firstname);
						$stmt->bindParam(':lastname', $lastname);
						$stmt->bindParam(':ssn', $ssn);
						$stmt->bindParam(':password', $rnd);
						$stmt->bindParam(':className', $className);

						try {
							if(!$stmt->execute()) {
								$error=$stmt->errorInfo();
								$debug.="Error updating entries\n".$error[2];
								$debug.="   ".$username."Does not Exist \n";
								$debug.=" ".$uid;
							}
							$uid=$pdo->lastInsertId();
						} catch (PDOException $e) {
							if ($e->errorInfo[1] == 1062) {
								$debug="Duplicate SSN or Username";
							} else {
								$debug="Error updating entries\n".$error[2];
							}
						}
					}

				}else if($userquery->rowCount() > 0){
                	$usr = $userquery->fetch(PDO::FETCH_ASSOC);
                    $uid = $usr['uid'];
                }

			}
					
          	// We have a user, connect to current course
          	if($uid!="UNK"){
				if($regstatus=="Registrerad"||$regstatus=="UNK"){
					$stmt = $pdo->prepare("INSERT INTO user_course (uid, cid, access,term,creator,vers,vershistory) VALUES(:uid, :cid,'R',:term,:creator,:vers,'') ON DUPLICATE KEY UPDATE vers=:avers, vershistory=CONCAT(vershistory, CONCAT(:bvers,','))");
					$stmt->bindParam(':uid', $uid);
					$stmt->bindParam(':cid', $cid);
					$stmt->bindParam(':term', $term);
					$stmt->bindParam(':creator', $userid);
					$stmt->bindParam(':vers', $coursevers);
					$stmt->bindParam(':avers', $coursevers);
					$stmt->bindParam(':bvers', $coursevers);
					// Insert the user into the database.
					try {
						if(!$stmt->execute()) {
							$error=$stmt->errorInfo();
							$debug.="Error connecting user to course: ".$error[2];
						}
					}catch(Exception $e) {
						$debug.="Error connecting user to course: ".$e->getMessage();
					}
				}
			}// End of foreach user
		} //End of ADDUSR	
	} else if (strcmp($opt,"RETRIEVE") == 0) {
		if ($action === "USERS") {
			$query = $pdo->prepare("SELECT uid, username FROM user");
			if ($query->execute()) {
				$users = $query->fetchAll(PDO::FETCH_ASSOC);
				$response = array("success" => true, "users" => $users);
				echo json_encode($response);
			} else {
				$response = array("success" => false, "message" => "Failed to fetch users.");
				echo json_encode($response);
			}
		}
		if ($action === "USER") {
			$query = $pdo->prepare("SELECT * FROM user WHERE username=:username;");
			$query->bindParam(':username', $username);
			if ($query->execute()) {
				$user = $query->fetchAll(PDO::FETCH_ASSOC);
				$response = array("success" => true, "user" => $user);
				echo json_encode($response);
			} else {
				$response = array("success" => false, "message" => "Failed to fetch user.");
				echo json_encode($response);
			}
		}
	} else if (strcmp($opt, "USERTOTABLE") == 0) {
		if ($action === "COURSE") {
			$stmt = $pdo->prepare("INSERT INTO user_course (uid, cid, access,term,creator,vers,vershistory) VALUES(:uid, :cid,'R',:term,:creator,:vers,'') ON DUPLICATE KEY UPDATE vers=:avers, vershistory=CONCAT(vershistory, CONCAT(:bvers,','))");
			$stmt->bindParam(':uid', $uid);
			$stmt->bindParam(':cid', $cid);
			$stmt->bindParam(':term', $term);
			$stmt->bindParam(':creator', $userid);
			$stmt->bindParam(':vers', $coursevers);
			$stmt->bindParam(':avers', $coursevers);
			$stmt->bindParam(':bvers', $coursevers);
			try {
				if(!$stmt->execute()) {
					$error=$stmt->errorInfo();
					$debug.="Error connecting user to course: ".$error[2];
				}
			}catch(Exception $e) {
				$debug.="Error connecting user to course: ".$e->getMessage();

			}
		}
	} else if (strcmp($opt, "DELETE") == 0) {
		if ($action === "COURSE") {
			$query = $pdo->prepare("DELETE FROM user_course WHERE uid=:uid AND cid=:cid;");
			$query->bindParam(':uid', $uid);
			$query->bindParam(':cid', $cid);
			try {
				if(!$query->execute()) {
					$error=$stmt->errorInfo();
					$debug.="Error deleting user from course: ".$error[2];
				}
			}catch(Exception $e) {
				$debug.="Error deleting user from course: ".$e->getMessage();

			}
		}
	}
}



//------------------------------------------------------------------------------------------------
// Retrieve Information
//------------------------------------------------------------------------------------------------

/*firstname,lastname,ssn,*/

$entries=array();
$teachers=array();
$classes=array();
$groups=array();
$courses=array();
$submissions=array();

if(checklogin() && $hasAccess) {
	
	$query = $pdo->prepare("SELECT user.uid as uid,username,firstname,lastname,ssn,access,class,modified,vers,requestedpasswordchange,examiner,groups, TIME_TO_SEC(TIMEDIFF(now(),addedtime))/60 AS newly FROM user, user_course WHERE cid=:cid AND user.uid=user_course.uid;");
	$query->bindParam(':cid', $cid);
	if(!$query->execute()){
		$error=$query->errorInfo();
		$debug="Error reading user entries\n".$error[2];
	}
	$result = $query->fetchAll(PDO::FETCH_ASSOC);
	// Adds all teachers for course to array
	$examiners = array();
	foreach($result as $row){
		if($row['access'] == 'W') {
			array_push($examiners, $row);
		}
	}

	foreach($result as $row){
		$entry = array(
			'username' => json_encode(['username' => $row['username']]),
			'ssn' => json_encode(['ssn' => $row['ssn']]),
			'firstname' => json_encode(['firstname' => $row['firstname']]),
			'lastname' => json_encode(['lastname' => $row['lastname']]),
			'class' => json_encode(['class' => $row['class']]),
			'modified' => $row['modified'],
			'examiner' => json_encode(['examiner' => $row['examiner']]),
			'vers' => json_encode(['vers' => $row['vers']]),
			'access' => json_encode(['access' => $row['access']]),
			'groups' => json_encode(['groups' => $row['groups']]),
			'requestedpasswordchange' => json_encode(['username' => $row['username'] ,'recent' => $row['newly'],'requested' => $row['requestedpasswordchange']])
		);
		array_push($entries, $entry);
	}
  
	$query = $pdo->prepare("SELECT user_course.uid FROM user_course WHERE user_course.access = 'W' GROUP by user_course.uid;");
	if(!$query->execute()){
		$error=$query->errorInfo();
		$debug="Error reading user entries\n".$error[2];
	}
	foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
		$teacher = array(
			'name' => $row['firstname']." ".$row['lastname'],
			'uid' => $row['uid']
		);
		array_push($teachers, $teacher);
	}

	$query = $pdo->prepare("SELECT class FROM class;");
	if(!$query->execute()){
		$error=$query->errorInfo();
		$debug="Error reading user entries\n".$error[2];
	}
	foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
		$classe = array(
			'class' => $row['class'],
		);
		array_push($classes, $classe);
	}

	
	$query = $pdo->prepare("SELECT groupval,groupkind,groupint FROM `groups` ORDER BY groupkind,groupint;");
	if(!$query->execute()){
		$error=$query->errorInfo();
		$debug="Error reading group entries\n".$error[2];
	}
	foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
		$group = array(
			'groupval' => $row['groupval'],
			'groupkind' => $row['groupkind'],
			'groupint' => $row['groupint'],
		);
		array_push($groups, $group);
	}

	$query=$pdo->prepare("SELECT cid,coursecode,vers,versname,coursename,coursenamealt,startdate,enddate FROM vers WHERE cid=:cid;");
	
	$query->bindParam(':cid', $cid);
	if(!$query->execute()) {
		$error=$query->errorInfo();
		$debug="Error reading courses\n".$error[2];
	}else{
		foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
			array_push(
				$courses,
				array(
					'cid' => $row['cid'],
					'coursecode' => $row['coursecode'],
					'vers' => $row['vers'],
					'versname' => $row['versname'],
					'coursename' => $row['coursename'],
					'coursenamealt' => $row['coursenamealt'],
					'startdate' => $row['startdate'],
					'enddate' => $row['enddate']
				)
			);
		}
	}

// 	// Find user submissions in old versions
	$query=$pdo->prepare("SELECT course.cid, uid, vers.vers, versname FROM course, userAnswer, vers WHERE course.cid=:cid AND course.cid=userAnswer.cid AND vers.vers=userAnswer.vers AND userAnswer.vers!=activeversion;");
	$query->bindParam(':cid', $cid);
	if(!$query->execute()) {
		$error=$query->errorInfo();
		$debug="Error reading submissions\n".$error[2];
	}else{
		foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
			array_push(
				$submissions,
				array(
					'cid' => $row['cid'],
					'uid' => $row['uid'],
					'vers' => $row['vers'],
					'versname' => $row['versname']
				)
			);
		}
	}

	$access = true;
}

$array = array(
	'entries' => $entries,
	'debug' => $debug,
	'teachers' => $teachers,
	'classes' => $classes,
	'courses' => $courses,
	'groups' => $groups,
	'queryResult' => $queryResult,
	'examiners' => $examiners,
	'submissions' => $submissions,
	'access' => $access
);

echo json_encode($array);

logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "accessedservice.php",$userid,$info);


?>
