<?php
date_default_timezone_set("Europe/Stockholm");
// Include basic application services!
include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";

// Connect to database and start session
pdoConnect();
session_start();

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
$queryResult = 'NONE!';

$debug="NONE!";

$log_uuid = getOP('log_uuid');
$info=$opt." ".$cid." ".$uid." ".$username." ".$newusers;
logServiceEvent($log_uuid, EventTypes::ServiceServerStart, "accessedservice.php",$userid,$info);

//------------------------------------------------------------------------------------------------
// Services
//------------------------------------------------------------------------------------------------
if(checklogin() && (hasAccess($_SESSION['uid'], $cid, 'w') || isSuperUser($_SESSION['uid']))) {

		if(strcmp($opt,"UPDATE")==0){
				$query = $pdo->prepare("UPDATE user set firstname=:firstname,lastname=:lastname,ssn=:ssn,username=:username,class=:className WHERE uid=:uid;");
				$query->bindParam(':firstname', $firstname);
				$query->bindParam(':lastname', $lastname);
				$query->bindParam(':ssn', $ssn);
				$query->bindParam(':username', $username);
				$query->bindParam(':uid', $uid);
				$query->bindParam(':className', $className);
				$query->bindParam(':addedtime', $addedtime);

				if(!$query->execute()) {
						$error=$query->errorInfo();
						$debug="Error updating user".$error[2];
				}

				$query = $pdo->prepare("UPDATE user_course set teacher=:teacher WHERE uid=:uid;");
				$query->bindParam(':uid', $uid);
				$query->bindParam(':teacher', $teacher);

				if(!$query->execute()) {
						$error=$query->errorInfo();
						$debug="Error updating user".$error[2];
				}
	}else if(strcmp($opt,"ACCESS")==0){
				$query = $pdo->prepare("UPDATE user_course set access=:val WHERE uid=:uid AND cid=:cid;");
				$query->bindParam(':uid', $uid);
				$query->bindParam(':cid', $cid);
				$query->bindParam(':val', $val);

				if(!$query->execute()) {
					$error=$query->errorInfo();
					$debug="Error updating user".$error[2];
				}
	}else if(strcmp($opt,"VERSION")==0){
				$query = $pdo->prepare("UPDATE user_course set vers=:val WHERE uid=:uid AND cid=:cid;");
				$query->bindParam(':uid', $uid);
				$query->bindParam(':cid', $cid);
				$query->bindParam(':val', $val);

				if(!$query->execute()) {
					$error=$query->errorInfo();
					$debug="Error updating user".$error[2];
				}
	}else if(strcmp($opt,"EXAMINER")==0){
				$query = $pdo->prepare("UPDATE user_course set teacher=:val WHERE uid=:uid AND cid=:cid;");
				$query->bindParam(':uid', $uid);
				$query->bindParam(':cid', $cid);
				$query->bindParam(':val', $val);

				if(!$query->execute()) {
					$error=$query->errorInfo();
					$debug="Error updating user".$error[2];
				}
	}else if(strcmp($opt,"USERNAME")==0){
				$query = $pdo->prepare("UPDATE user set username=:val WHERE uid=:uid");
				$query->bindParam(':uid', $uid);
				$query->bindParam(':val', $val);

				if(!$query->execute()) {
					$error=$query->errorInfo();
					$debug="Error updating user".$error[2];
				}
	}else if(strcmp($opt,"SSN")==0){
				$query = $pdo->prepare("UPDATE user set ssn=:val WHERE uid=:uid");
				$query->bindParam(':uid', $uid);
				$query->bindParam(':val', $val);

				if(!$query->execute()) {
					$error=$query->errorInfo();
					$debug="Error updating user".$error[2];
				}
	}else if(strcmp($opt,"FIRSTNAME")==0){
				$query = $pdo->prepare("UPDATE user set firstname=:val WHERE uid=:uid");
				$query->bindParam(':uid', $uid);
				$query->bindParam(':val', $val);

				if(!$query->execute()) {
					$error=$query->errorInfo();
					$debug="Error updating user".$error[2];
				}
	}else if(strcmp($opt,"LASTNAME")==0){
				$query = $pdo->prepare("UPDATE user set lastname=:val WHERE uid=:uid");
				$query->bindParam(':uid', $uid);
				$query->bindParam(':val', $val);

				if(!$query->execute()) {
					$error=$query->errorInfo();
					$debug="Error updating user".$error[2];
				}
        }else if(strcmp($opt,"CLASS")==0){
				$query = $pdo->prepare("UPDATE user set class=:val WHERE uid=:uid");
				$query->bindParam(':uid', $uid);
				$query->bindParam(':val', $val);

				if(!$query->execute()) {
					$error=$query->errorInfo();
					$debug="Error updating user".$error[2];
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
                $debug = "Not able to create the specified class. Please give the parameters proper values.";
            }
        }else if(strcmp($opt,"CHPWD")==0){
				$query = $pdo->prepare("UPDATE user set password=:pwd, requestedpasswordchange=0 where uid=:uid;");
				$query->bindParam(':uid', $uid);
				$query->bindParam(':pwd', standardPasswordHash($pw));

				if(!$query->execute()) {
					$error=$query->errorInfo();
					$debug="Error updating user".$error[2];
				}
        }else if(strcmp($opt,"ADDUSR")==0){
			$newUserData = json_decode(htmlspecialchars_decode($newusers));

			foreach ($newUserData as $user) {
					$uid="UNK";
					if (count($user) == 1) {
							// See if we have added with username or SSN
							$userquery = $pdo->prepare("SELECT uid FROM user WHERE username=:usernameorssn or ssn=:usernameorssn");
							$userquery->bindParam(':usernameorssn', $user[0]);

							if(!$userquery->execute()) {
									$error=$userquery->errorInfo();
									$debug.="Error adding user by ssn or username: ".$error[2];
							}	else {
									foreach($userquery->fetchAll(PDO::FETCH_ASSOC) as $row){
											$uid = $row["uid"];
									}
							}
					} else if (count($user) > 1 && count($user) <= 6){
							$ssn = $user[0];
							$tmp = explode(',', $user[1]);
							$firstname = trim($tmp[1]);
							$lastname = trim($tmp[0]);
							if(isset($user[4])){
									$className = trim($user[4]);
							}
							$tmp2 = explode('@', $user[count($user)-1]);
							$username = $tmp2[0];
							//$debug.=$ssn." ".$username."#".$firstname."#".$lastname."\n";
							$userquery = $pdo->prepare("SELECT uid,username FROM user WHERE username=:username or ssn=:ssn");
							$userquery->bindParam(':username', $username);
							$userquery->bindParam(':ssn', $ssn);

							// If there isn't we'll register a new user and give them a randomly
							// assigned password which can be printed later.
							if ($userquery->execute() && $userquery->rowCount() <= 0 && !empty($username)) {
									$rnd=makeRandomString(9);
									$querystring='INSERT INTO user (username, email, firstname, lastname, ssn, password,addedtime, class) VALUES(:username,:email,:firstname,:lastname,:ssn,:password,now(),:className);';
									$stmt = $pdo->prepare($querystring);
									$stmt->bindParam(':username', $username);
									$stmt->bindParam(':email', $saveemail);
									$stmt->bindParam(':firstname', $firstname);
									$stmt->bindParam(':lastname', $lastname);
									$stmt->bindParam(':ssn', $ssn);
									$stmt->bindParam(':password', standardPasswordHash($rnd));
									$stmt->bindParam(':className', $className);
									$stmt->bindParam(':addedtime', $addedtime);

									if(!$stmt->execute()) {
											$error=$stmt->errorInfo();
											$debug.="Error updating entries".$error[2];
											$debug.="   ".$username."Does not Exist \n";
											$debug.=" ".$uid;
									}
									$uid=$pdo->lastInsertId();
							}else if($userquery->rowCount() > 0){
									$usr = $userquery->fetch(PDO::FETCH_ASSOC);
									$uid = $usr['uid'];
							}
					}

					// We have a user, connect to current course
					if($uid!="UNK"){
							$stmt = $pdo->prepare("INSERT INTO user_course (uid, cid, access,vers,vershistory) VALUES(:uid, :cid,'R',:vers,'') ON DUPLICATE KEY UPDATE vers=:vers, vershistory=CONCAT(vershistory, CONCAT(:vers,','))");
							$stmt->bindParam(':uid', $uid);
							$stmt->bindParam(':cid', $cid);
							$stmt->bindParam(':vers', $coursevers);

							// Insert the user into the database.
							if(!$stmt->execute()) {
								$error=$stmt->errorInfo();
								$debug.="Error connecting user to course: ".$error[2];
							}
					}

				// End of foreach user
			}

	}
}

if(strcmp($opt,"REQNEWPWD")==0) {
	$log_db = new PDO('sqlite:../../log/loglena4.db');
	$IP = getIP();
	$currentTime = round(microtime(true) * 1000);
	$timeInterval = 300000; // five minutes

	$query = $GLOBALS['log_db']->prepare("SELECT COUNT(*) FROM serviceLogEntries
											WHERE info LIKE 'REQNEWPWD%'
											AND IP = :IP
											AND eventType = '6'
											AND timestamp > :currentTime - :timeInterval");
	$query->bindParam(':IP', $IP);
	$query->bindParam(':currentTime', $currentTime);
	$query->bindParam(':timeInterval', $timeInterval);

	if(!$query->execute()) {
		$error=$query->errorInfo();
		$debug="Error counting rows".$error[2];
	} else {
		$result = $query->fetch(PDO::FETCH_ASSOC);
		$queryResult = $result['COUNT(*)'];
	}
}

if(strcmp($opt,"CHECKSECURITYANSWER")==0) {
	$log_db = new PDO('sqlite:../../log/loglena4.db');
	$IP = getIP();
	$currentTime = round(microtime(true) * 1000);
	$timeInterval = 300000; // five minutes

	$query = $GLOBALS['log_db']->prepare("SELECT COUNT(*) FROM serviceLogEntries
											WHERE info LIKE 'CHECKSECURITYANSWER%'
											AND info LIKE '%{$username}%'
											AND IP = :IP
											AND eventType = '6'
											AND timestamp > :currentTime - :timeInterval");
	$query->bindParam(':IP', $IP);
	$query->bindParam(':currentTime', $currentTime);
	$query->bindParam(':timeInterval', $timeInterval);

	if(!$query->execute()) {
		$error=$query->errorInfo();
		$debug="Error counting rows".$error[2];
	} else {
		$result = $query->fetch(PDO::FETCH_ASSOC);
		$queryResult = $result['COUNT(*)'];
	}
}

if(strcmp($opt,"LOGINATTEMPT")==0) {
	$log_db = new PDO('sqlite:../../log/loglena4.db');
	$IP = getIP();
	$currentTime = round(microtime(true) * 1000);
	$timeInterval = 300000; // five minutes

	$query = $GLOBALS['log_db']->prepare("SELECT COUNT(*) FROM serviceLogEntries
											WHERE info LIKE 'LOGINATTEMPT%'
											AND info LIKE '%{$username}%'
											AND IP = :IP
											AND eventType = '6'
											AND timestamp > :currentTime - :timeInterval");
	$query->bindParam(':IP', $IP);
	$query->bindParam(':currentTime', $currentTime);
	$query->bindParam(':timeInterval', $timeInterval);

	if(!$query->execute()) {
		$error=$query->errorInfo();
		$debug="Error counting rows".$error[2];
	} else {
		$result = $query->fetch(PDO::FETCH_ASSOC);
		$queryResult = $result['COUNT(*)'];
	}
}

//------------------------------------------------------------------------------------------------
// Retrieve Information
//------------------------------------------------------------------------------------------------

$entries=array();
if(checklogin() && (hasAccess($userid, $cid, 'w') || isSuperUser($userid))) {
	$query = $pdo->prepare("SELECT user.uid as uid,username,access,firstname,lastname,ssn,class,modified,teacher,vers,requestedpasswordchange, TIME_TO_SEC(TIMEDIFF(now(),addedtime))/60 AS newly FROM user, user_course WHERE cid=:cid AND user.uid=user_course.uid");
	$query->bindParam(':cid', $cid);
	if(!$query->execute()){
		$error=$query->errorInfo();
		$debug="Error reading user entries".$error[2];
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
      // Adds current student to array
      array_push($examiners, $row);
			$entry = array(
				'username' => json_encode(['username' => $row['username'], 'uid' => $row['uid']]),
				'ssn' => json_encode(['ssn' => $row['ssn'], 'uid' => $row['uid']]),
				'firstname' => json_encode(['firstname' => $row['firstname'], 'uid' => $row['uid']]),
				'lastname' => json_encode(['lastname' => $row['lastname'], 'uid' => $row['uid']]),
				'class' => json_encode(['class' => $row['class'], 'uid' => $row['uid']]),
				'modified' => $row['modified'],
				'teacher' => $row['teacher'],
        'examiner' => json_encode(['examiners' => $examiners]),
				'vers' => json_encode(['vers' => $row['vers'], 'uid' => $row['uid']]),
				'access' => json_encode(['access' => $row['access'], 'uid' => $row['uid']]),
				'groups' => 'PLACEHOLDER',
				'requestedpasswordchange' => json_encode(['username' => $row['username'], 'uid' => $row['uid']])
			);
			array_push($entries, $entry);
      array_pop($examiners);
	}
}

// Array to fetch the username of all users with access "W" as these are all the teachers.
$teachers=array();
if(checklogin() && (hasAccess($userid, $cid, 'w') || isSuperUser($userid))) {
	$query = $pdo->prepare("SELECT user.firstname, user.lastname FROM user, user_course WHERE user_course.access = 'W' AND user.uid=user_course.uid GROUP BY user.firstname, user.lastname;");
	$query->bindParam(':cid', $cid);
	if(!$query->execute()){
		$error=$query->errorInfo();
		$debug="Error reading user entries".$error[2];
	}
	foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
			$teacher = array(
				'firstname' => $row['firstname'],
				'lastname' => $row['lastname']
			);
			array_push($teachers, $teacher);
		}
}

$classes=array();
if(checklogin() && (hasAccess($userid, $cid, 'w') || isSuperUser($userid))) {
		$query = $pdo->prepare("SELECT class FROM class;");
		$query->bindParam(':cid', $cid);
		if(!$query->execute()){
				$error=$query->errorInfo();
				$debug="Error reading user entries".$error[2];
		}
		foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
				$classe = array(
					'class' => $row['class'],
				);
				array_push($classes, $classe);
		}
}

if(checklogin() && (hasAccess($userid, $cid, 'w') || isSuperUser($userid))) {
	// get all groups
	$query = $pdo->prepare("SELECT * FROM groups WHERE courseID=:cid");
	$query->bindParam(':cid', $cid);

	if (!$query->execute()) {
		$error = $query->errorInfo();
		$debug="Error while getting groups " . $error[2];
	} else {
		$groups = $query->fetchAll(PDO::FETCH_ASSOC);
	}
}

$courses=array();
if(checklogin() && (hasAccess($userid, $cid, 'w') || isSuperUser($userid))) {

  $query=$pdo->prepare("SELECT cid,coursecode,vers,versname,coursename,coursenamealt,startdate,enddate FROM vers WHERE cid=:cid;");
  $query->bindParam(':cid', $cid);
  if(!$query->execute()) {
    $error=$query->errorInfo();
    $debug="Error reading courses".$error[2];
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


}

$array = array(
	'entries' => $entries,
	"debug" => $debug,
	'teachers' => $teachers,
	'classes' => $classes,
	'courses' => $courses,
	'groups' => $groups,
	'queryResult' => $queryResult
);

echo json_encode($array);

logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "accessedservice.php",$userid,$info);
?>
