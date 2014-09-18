<?php 

date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../Shared/sessions.php";
include_once "basic.php";

// Connect to database and start session
pdoConnect();
session_start();

if(isset($_SESSION['uid'])){
		$userid=$_SESSION['uid'];
}else{
		$userid="1";		
} 

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
		if(strcmp($opt,"UPDATE")===0){
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
		}else if(strcmp($opt,"ACCESS")===0){
				$query = $pdo->prepare("UPDATE user_course set access=:val WHERE uid=:uid and cid=:cid;");
				$query->bindParam(':uid', $uid);
				$query->bindParam(':cid', $cid);
				$query->bindParam(':val', $val);
		
				if(!$query->execute()) {
					$error=$query->errorInfo();
					$debug="Error updating user".$error[2];
				}
		}else if(strcmp($opt,"CHPWD")===0){
				$query = $pdo->prepare("UPDATE user set password=password(:pwd) where uid=:uid;");
				$query->bindParam(':uid', $uid);
				$query->bindParam(':pwd', $cid);
		
				if(!$query->execute()) {
					$error=$query->errorInfo();
					$debug="Error updating user".$error[2];
				}
		}else if(strcmp($opt,"ADDUSR")===0){
				$debug="Adding Users\n";

				// Import users, create if user does not previously exist.

				$users=explode("\n", $newusers);
				foreach ($users as $user) {
						$ssn = "";
						$name = "";
						$username1 = "";
			
						// Split on whitespace.
						$components = preg_split('/[\s]+/', $user);
			
						// If there's 3 or more components (it will be 4 in most cases)
						// then continue with extracting data.
						if(count($components) >= 3) {
							$ssn = array_shift($components);
							$username1 = array_pop($components);
							$name = trim(implode(' ', $components));
						} else {
							// If there's not enough data to work with on this row, continue to the
							// next one.
							continue;
						}
			
						// Assemble this into more useful bits.
						list($lastname, $firstname)=(explode(", ",$name));
						list($username, $garbage)=(explode("@",$username1));
						
						//$debug.=$ssn." ".$username."#".$firstname."#".$lastname."\n";
						$uid="UNK";
						
						$userquery = $pdo->prepare("SELECT uid,username FROM user WHERE username=:username or ssn=:ssn");
						$userquery->bindParam(':username', $username);
						$userquery->bindParam(':ssn', $ssn);

						// If there isn't we'll register a new user and give them a randomly
						// assigned password which can be printed later.
						if ($userquery->execute() && $userquery->rowCount() <= 0 && !empty($username)) {
								// User does exist
								$debug.="   ".$username."Does not Exist \n";

								$rnd=makeRandomString(9);
								
								$querystring='INSERT INTO user (username, firstname, lastname, ssn, password,addedtime) VALUES(:username,:firstname,:lastname,:ssn,password(:password),now());';	
								$stmt = $pdo->prepare($querystring);
								$stmt->bindParam(':username', $username);
								$stmt->bindParam(':firstname', $firstname);
								$stmt->bindParam(':lastname', $lastname);
								$stmt->bindParam(':ssn', $ssn);
								$stmt->bindParam(':password', $rnd);
/*				
								try {
									$stmt->execute();
								} catch (PDOException $e) {
								
								}
*/
								if(!$stmt->execute()) {
									$error=$stmt->errorInfo();
									$debug.="Error updating entries".$error[2];
								}

								$uid=$pdo->lastInsertId();
								
								// Save uid and password in array, send to client for delegation!
						}else if($userquery->rowCount() > 0){
								$usr = $userquery->fetch(PDO::FETCH_ASSOC);
								$uid = $usr['uid'];
						}
						
						$debug.=" ".$uid;
						
						// We have a user, connect to current course
						if($uid!="UNK"){
								// Foo!

								$stmt = $pdo->prepare("INSERT INTO user_course (uid, cid, access) VALUES(:uid, :cid,'R')");
								$stmt->bindParam(':uid', $uid);
								$stmt->bindParam(':cid', $cid);
				
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

if(checklogin() && (hasAccess($_SESSION['uid'], $cid, 'w') || isSuperUser($_SESSION['uid']))) {

		$query = $pdo->prepare("SELECT user.uid as uid,username,access,firstname,lastname,ssn,modified FROM user, user_course WHERE cid=:cid AND user.uid=user_course.uid");
		$query->bindParam(':cid', $cid);
		$query->execute();
		
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

?>
