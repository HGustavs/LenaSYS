<?php

// Set cookie life length and start session
ini_set('session.gc_maxlifetime', 18000);
session_set_cookie_params('18000');

// Start session using parameters above
session_start();

// Includes
include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";
include_once "../../coursesyspw.php";

$opt = getOP('opt');

if($opt=="REFRESH"){	
	ini_set('session.gc_maxlifetime', 18000);
	session_regenerate_id(true);
	session_set_cookie_params('18000');
}else if($opt=="LOGIN"){
	// If not login we assume logout	
	$username=getOP('username');
	$password=getOP('password');
  
    // Login barrier
    $maxLoginTries = 3;
    $IP = getIP();
    $timeInterval = 10; // in minutes

    $query = $GLOBALS['log_db']->prepare("SELECT COUNT(*) FROM userLogEntries
      WHERE eventType = 4
      AND uid = :user
      AND remoteAddress = :IP
      AND timestamp > DATETIME(DATETIME('NOW'), :timeInterval)");
    $query->bindParam(':IP', $IP);
    $query->bindValue(':timeInterval', '-' . $timeInterval . ' minute');
    $query->bindParam(':user', $username);

    if(!$query->execute()) {
		$error=$query->errorInfo();
		$debug="Error counting rows".$error[2];
    } else {
		$result = $query->fetch(PDO::FETCH_ASSOC);
		$queryResult = $result['COUNT(*)'];
    }
		
	$savelogin = array_key_exists('saveuserlogin', $_POST) && $_POST['saveuserlogin'] == 'on';
	
	pdoConnect(); // Makes sure it actually connects to a database
	
	// Default values
	$res = array("login" => "failed");
	if($maxLoginTries > $queryResult){
		if(login($username, $password, $savelogin)){
			// Successfully logged in, return user name
			$res["login"] = "success";
			$res["username"] = $username;
			if(isset($_SESSION["securityquestion"])) {
				$res["securityquestion"] = "set";
			}

			//LOGGING STARTS HERE ->
			// Gets uid based on username
			$query = $pdo->prepare( "SELECT uid FROM user WHERE username = :username");
			$query->bindParam(':username', $username);
			$query-> execute();

			// This while is only performed if userid was set through _SESSION['uid'] check above, a guest will not have it's username set
			while ($row = $query->fetch(PDO::FETCH_ASSOC)){
				$userid = $row['uid'];
			}

			// Log USERID for Dugga Access
			logUserEvent($userid, $username, EventTypes::LoginSuccess,"");

		  }else{
			addlogintry(); // If to many attempts has been commited, it will jump to this
			// As login has failed we log the attempt

			// Logging for failed login
			logUserEvent($username, $username, EventTypes::LoginFail,"");
		}
    }else{
		$res = array("login" => "limit");
    }

	// Return the data as JSON
	echo json_encode($res);
}else{
	//Adds a row to the logging table for the userlogout.
	logUserEvent($_SESSION['uid'], $_SESSION['loginname'], EventTypes::Logout,"");

	// Parts of Logout copied from http://stackoverflow.com/a/3948312 and slightly modified, licensed under cc by-sa
	// unset all of the session variables.
	$_SESSION = array();
	
	// If it's desired to kill the session, also delete the session cookie.
	// Note: This will destroy the session, and not just the session data!
	
	if (ini_get("session.use_cookies")) {
		$params = session_get_cookie_params();
		setcookie(session_name(), '', time() - 42000,$params["path"], $params["domain"],$params["secure"], $params["httponly"]);
	}
	
	// Finally, destroy the session.
	session_unset();
	session_destroy();
	clearstatcache(); 
	
	// Remove the cookies.
	setcookie('username', '', 0, '/');
	setcookie('password', '', 0, '/');
}
	
?>