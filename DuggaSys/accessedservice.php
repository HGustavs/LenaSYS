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
	$userid="1";		
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
$val = getOP('val');
$newusers = getOP('newusers');
$coursevers = getOP('coursevers');
$teacher = getOP('teacher');

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
	}else if(strcmp($opt,"CHPWD")==0){
		$query = $pdo->prepare("UPDATE user set password=password(:pwd) where uid=:uid;");
		$query->bindParam(':uid', $uid);
		$query->bindParam(':pwd', $pw);

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
							$querystring='INSERT INTO user (username, email, firstname, lastname, ssn, password,addedtime, class) VALUES(:username,:email,:firstname,:lastname,:ssn,password(:password),now(),:className);';	
							$stmt = $pdo->prepare($querystring);
							$stmt->bindParam(':username', $username);
							$stmt->bindParam(':email', $saveemail);
							$stmt->bindParam(':firstname', $firstname);
							$stmt->bindParam(':lastname', $lastname);
							$stmt->bindParam(':ssn', $ssn);
							$stmt->bindParam(':password', $rnd);
							$stmt->bindParam(':className', $className);
							
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
		}
		
	}
}

//------------------------------------------------------------------------------------------------
// Retrieve Information			
//------------------------------------------------------------------------------------------------

$entries=array();
if(checklogin() && (hasAccess($userid, $cid, 'w') || isSuperUser($userid))) {
	$query = $pdo->prepare("SELECT user.uid as uid,username,access,firstname,lastname,ssn,class,modified,teacher, TIME_TO_SEC(TIMEDIFF(now(),addedtime))/60 AS newly FROM user, user_course WHERE cid=:cid AND user.uid=user_course.uid");
	$query->bindParam(':cid', $cid);
	if(!$query->execute()){
		$error=$query->errorInfo();
		$debug="Error reading user entries".$error[2];
	}

	foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
			$entry = array(
				'uid' => $row['uid'],
				'username' => $row['username'],
				'access' => $row['access'],
				'firstname' => $row['firstname'],
				'lastname' => $row['lastname'],
				'ssn' => $row['ssn'],	
				'class' => $row['class'],	
				'modified' => $row['modified'],
				'newly' => $row['newly'],
				'teacher' => $row['teacher']
			);
			array_push($entries, $entry);
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

$array = array(
	'entries' => $entries,
	"debug" => $debug,
	'teachers' => $teachers
);

echo json_encode($array);

logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "accessedservice.php",$userid,$info);
?>
