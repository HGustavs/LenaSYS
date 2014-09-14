<?php
session_start();
include_once "../Shared/sessions.php";
include_once "basic.php";
include_once "../../coursesyspw.php";

$opt=getOP('opt');

// If not login we assume logout
if($opt=="LOGIN"){
	
		$username=getOP('username');
		$password=getOP('password');
		
		$savelogin = array_key_exists('saveuserlogin', $_POST) && $_POST['saveuserlogin'] == 'on';
		
		pdoConnect();
		
		// Default values
		$res = array("login" => "failed");
		
		if(failedLoginCount($_SERVER['REMOTE_ADDR'])>=10){
			$res["login"] = "failed";
			$res["reason"] = "Too many failed attempts, try again later";
		}else if(login($username, $password, $savelogin)){
			// Successfully logged in, return user name
			$res["login"] = "success";
			$res["username"] = $_SESSION['loginname'];
			
		}else{
			// There's no user logged in so there's no user to associate this event with.
			// log_message( NULL, EVENT_LOGINERR, "Failed login attempt for username".htmlentities($username));
		}
		
		// Return the data as JSON
		echo json_encode($res);

}else{
		// Parts of Logout copied from http://stackoverflow.com/a/3948312 and slightly modified, licensed under cc by-sa
		// Unset all of the session variables.
		$_SESSION = array();
		
		// If it's desired to kill the session, also delete the session cookie.
		// Note: This will destroy the session, and not just the session data!
		if (ini_get("session.use_cookies")) {
			$params = session_get_cookie_params();
			setcookie(session_name(), '', time() - 42000,
				$params["path"], $params["domain"],
				$params["secure"], $params["httponly"]
			);
		}
		
		// Finally, destroy the session.
		session_destroy();
		
		// Remove the cookies.
		setcookie('username', '', 0, '/');
		setcookie('password', '', 0, '/');
}
	
?>
 
