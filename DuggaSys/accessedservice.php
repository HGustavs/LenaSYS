<?php 
date_default_timezone_set("Europe/Stockholm");
// Include basic application services!
include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";
// Connect to database and start session
pdoConnect();
session_start();

$log_uuid = getOP('log_uuid');
$log_timestamp = getOP('log_timestamp');

logServiceEvent($log_uuid, EventTypes::ServiceClientStart, "accessedservice.php", $log_timestamp);
logServiceEvent($log_uuid, EventTypes::ServiceServerStart, "accessedservice.php");

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
$firstname = getOP('firstname');
$lastname = getOP('lastname');
$username = getOP('username');
$val = getOP('val');
$newusers = getOP('newusers');
$debug="NONE!";	

//------------------------------------------------------------------------------------------------
// Services
//------------------------------------------------------------------------------------------------
if(checklogin() && (hasAccess($_SESSION['uid'], $cid, 'w') || isSuperUser($_SESSION['uid']))) {
	if(strcmp($opt,"UPDATE")==0){
		$query = $pdo->prepare("UPDATE user set firstname=:firstname,lastname=:lastname,ssn=:ssn,username=:username WHERE uid=:uid;");
		$query->bindParam(':firstname', $firstname);
		$query->bindParam(':lastname', $lastname);
		$query->bindParam(':ssn', $ssn);
		$query->bindParam(':username', $username);
		$query->bindParam(':uid', $uid);

		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error updating user".$error[2];
		}
	}else if(strcmp($opt,"ACCESS")==0){
		$query = $pdo->prepare("UPDATE user_course set access=:val WHERE uid=:uid and cid=:cid;");
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
		// Import users, create if user does not previously exist.
		//$users=explode("\n", $newusers);
		$newusers = str_ireplace("&quot;", "\"", $newusers);
		$obj = json_decode($newusers, true);
		//$debug = $obj;
		//echo json_encode(array( "debug" => $debug));
		foreach($obj as $entry)
		{
			
			$username = explode("@",$entry['email']);
			$username = $username[0];
			
			
			
			//$debug.=$ssn." ".$username."#".$firstname."#".$lastname."\n";
			$uid="UNK";
			$userquery = $pdo->prepare("SELECT uid,username FROM user WHERE username=:username or ssn=:ssn");
			$userquery->bindParam(':username', $username);
			$userquery->bindParam(':ssn', $entry['ssn']);
			
			// If there isn't we'll register a new user and give them a randomly
			// assigned password which can be printed later.
			if ($userquery->execute() && $userquery->rowCount() <= 0 && !empty($username)) 
			{
				
				$date = $entry['date']." 00:00:00";
				$date = str_ireplace("&#47;", "-", $date);
				
				echo json_encode(array("Date" => $date));
				$rnd=makeRandomString(9);
				$querystring="INSERT INTO user (username, email, firstname, lastname, ssn, password, addedtime, admittanceyear) VALUES(:username,:email,:firstname,:lastname,:ssn,password(:password), NOW(), :date)";	
				$stmt = $pdo->prepare($querystring);
				$stmt->bindParam(':username', $username);
				$stmt->bindParam(':email', $entry['email']);
				$stmt->bindParam(':firstname', $entry['firstname']);
				$stmt->bindParam(':lastname', $entry['lastname']);
				$stmt->bindParam(':ssn', $entry['ssn']);
				$stmt->bindParam(':password', $rnd);
				$stmt->bindparam(':date', $date);
				if(!$stmt->execute()) {
					$error=$stmt->errorInfo();
					$debug.="Error updating entries".$error[2];
					$debug.="   ".$username."Does not Exist \n";
					$debug.=" ".$uid;
				}
				$uid=$pdo->lastInsertId();
			}
			else if($userquery->rowCount() > 0){
				$usr = $userquery->fetch(PDO::FETCH_ASSOC);
				$uid = $usr['uid'];
			}
			
			
			if($uid!="UNK")
			{
				// Foo!
				$stmt = $pdo->prepare("INSERT INTO user_course (uid, cid, access) VALUES(:uid, :cid,:access)");
				$stmt->bindParam(':uid', $uid);
				$stmt->bindParam(':cid', $cid);
				$stmt->bindParam(':access', $entry['access']);
				// Insert the user into the database.
				try {
					$stmt->execute();
				} catch (PDOException $e) {
					if ($e->getCode()=="23000") {
						// User Already Exists i.e. primary key
					}
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
	$query = $pdo->prepare("SELECT user.uid as uid,username,access,firstname,lastname,ssn,modified FROM user, user_course WHERE cid=:cid AND user.uid=user_course.uid");
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
			'modified' => $row['modified']				
		);
		array_push($entries, $entry);
	}
}
$array = array(
	'entries' => $entries,
	"debug" => $debug,
);
echo json_encode($array);
logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "accessedservice.php");
?>
