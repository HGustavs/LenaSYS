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

if(isset($_SESSION['uid'])){
	$userid=$_SESSION['uid'];
}else{
	$userid="UNK";
}

$pw = getOP('pw');
$cid = getOP('cid');
$opt = getOP('opt');
$uid = getOP('uid');
$ssn = getOP('ssn');
$className = getOP('className');
$firstname = getOP('firstname');
$lastname = getOP('lastname');
$username = getOP('username');
$addedtime = getOP('addedtime');
$val = getOP('val');
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
$info=$opt." ".$cid." ".$uid." ".$username." ".$newusers;
logServiceEvent($log_uuid, EventTypes::ServiceServerStart, "accessedservice.php",$userid,$info);

//------------------------------------------------------------------------------------------------
// Services
//------------------------------------------------------------------------------------------------
if(checklogin() && (hasAccess($_SESSION['uid'], $cid, 'w') || isSuperUser($_SESSION['uid']))) {

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
	} else if(strcmp($opt,"ADDUSR")==0){
        $newUserData = json_decode(htmlspecialchars_decode($newusers));
        foreach ($newUserData as $user) {

						$uid="UNK";
						$regstatus="UNK";

            if (count($user) == 1&&strcmp($user[0],"")!==0) {
                // See if we have added with username or SSN
                $userquery = $pdo->prepare("SELECT uid FROM user WHERE username=:usernameorssn1 or ssn=:usernameorssn2");
                $userquery->bindParam(':usernameorssn1', $user[0]);
                $userquery->bindParam(':usernameorssn2', $user[0]);

                if(!$userquery->execute()) {
                  $error=$userquery->errorInfo();
                  $debug.="Error adding user by ssn or username: ".$error[2];
                }	else {
                  foreach($userquery->fetchAll(PDO::FETCH_ASSOC) as $row){ $uid = $row["uid"];}
                }

                if(strcmp($uid,"UNK")===0){
                    if(strcmp($debug,"NONE!")===0){$debug="";}
                    $debug.=$user[0]." was not found as a user in the system!\n";
                }
            } else if (count($user) > 1){
              $ssn = $user[0];
              // Check if user has an account
              $userquery = $pdo->prepare("SELECT uid FROM user WHERE ssn=:ssn");
              $userquery->bindParam(':ssn', $ssn);

							echo $ssn." ".$userquery->execute() ." ". $userquery->rowCount()." ".$user[3]."<br>";

              if ($userquery->execute() && $userquery->rowCount() <= 0) {

                  $firstname = $user[1];
                  $lastname = $user[2];
                  $className = $user[count($user)-2];
                  $saveemail = $user[3];
                  $regstatus = $user[count($user)-1];

                  if($saveemail){
                      $username = explode('@', $saveemail)[0];
                  }else{
                      $username=makeRandomString(6);
                  }

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
                              $debug.="Error updating klasse malmberg\n".$error[2];
                          }
                      }

                  }

									if($user[0]!="PNR"){
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
													$debug.="Duplicate SSN or Username";
												} else {
													$debug.="Error updating entries\n".$error[2];
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
						if($regstatus=="Registrerad"){
								$stmt = $pdo->prepare("INSERT INTO user_course (uid, cid, access,vers,vershistory) VALUES(:uid, :cid,'R',:vers,'') ON DUPLICATE KEY UPDATE vers=:avers, vershistory=CONCAT(vershistory, CONCAT(:bvers,','))");
								$stmt->bindParam(':uid', $uid);
								$stmt->bindParam(':cid', $cid);
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

								}
						}
          }
      } // End of foreach user
	} // End ADD_USER
}


//------------------------------------------------------------------------------------------------
// Retrieve Information
//------------------------------------------------------------------------------------------------

$entries=array();
$teachers=array();
$classes=array();
$groups=array();
$courses=array();
$submissions=array();

if(checklogin() && (hasAccess($userid, $cid, 'w') || isSuperUser($userid))) {
	$query = $pdo->prepare("SELECT user.uid as uid,username,access,firstname,lastname,ssn,class,modified,vers,requestedpasswordchange,examiner,`groups`, TIME_TO_SEC(TIMEDIFF(now(),addedtime))/60 AS newly FROM user, user_course WHERE cid=:cid AND user.uid=user_course.uid");
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
			'username' => json_encode(['username' => $row['username'], 'uid' => $row['uid']]),
			/*'ssn' => json_encode(['ssn' => $row['ssn'], 'uid' => $row['uid']]),*/
			'firstname' => json_encode(['firstname' => $row['firstname'], 'uid' => $row['uid']]),
			'lastname' => json_encode(['lastname' => $row['lastname'], 'uid' => $row['uid']]),
			'class' => json_encode(['class' => $row['class'], 'uid' => $row['uid']]),
			'modified' => $row['modified'],
			'examiner' => json_encode(['examiner' => $row['examiner'], 'uid' => $row['uid']]),
			'vers' => json_encode(['vers' => $row['vers'], 'uid' => $row['uid']]),
			'access' => json_encode(['access' => $row['access'], 'uid' => $row['uid']]),
			'groups' => json_encode(['groups' => $row['groups'], 'uid' => $row['uid']]),
			'requestedpasswordchange' => json_encode(['username' => $row['username'], 'uid' => $row['uid'] ,'recent' => $row['newly'],'requested' => $row['requestedpasswordchange']])
		);
		array_push($entries, $entry);
	}

	$query = $pdo->prepare("SELECT user.firstname,user.uid, user.lastname FROM user, user_course WHERE user_course.access = 'W' AND user.uid=user_course.uid GROUP by user.firstname,user.lastname, user.uid ORDER BY user.firstname, user.lastname;");
	$query->bindParam(':cid', $cid);
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
	$query->bindParam(':cid', $cid);
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

	// Find user submissions in old versions
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
