<?php
//---------------------------------------------------------------------------------------------------------------
// checklogin - Checks Login Credentials and initiates the kind session variable that holds the credentials
//---------------------------------------------------------------------------------------------------------------
function checklogin()
{
	// If neither session nor post return not logged in
	if(array_key_exists('loginname', $_SESSION) && array_key_exists('passwd', $_SESSION)){
		return true;
	} else if(array_key_exists('loginname', $_POST) && array_key_exists('passwd', $_POST)){
		$username=$_POST["loginname"];
		$passwd=$_POST["passwd"];				

		// Protect against SQL injection.
		$querystring=sprintf("SELECT * FROM user WHERE username='%s' AND password='%s' LIMIT 1",
			mysql_real_escape_string($username),
			mysql_real_escape_string($passwd)
		);

		$result=mysql_query($querystring);
		if (!$result) err("SQL Query Error: ".mysql_error(),"Database Password Check Error");
		
		// Fetch the result
		$row = mysql_fetch_assoc($result);

		$_SESSION['uid'] = $row['uid'];
		$_SESSION["loginname"]=$row['username'];
		$_SESSION["passwd"]=$row['password'];
		$_SESSION["superuser"]=$row['superuser'];

		return true;
	} else {		
		return false;
	}
}	

function hasAccess($userId, $courseId, $access_type)
{
	require_once "../Shared/courses.php";
	if(is_string($courseId)) {
		$courseId = getCourseId($courseId);
	}

	$querystring = sprintf("SELECT access FROM user_course WHERE uid='%d' AND cid='%d' LIMIT 1",
		mysql_real_escape_string($userId),
		mysql_real_escape_string($courseId)
	);

	$result = mysql_query($querystring);
	if(!$result) {
		return false;
	} else {
		// Fetch data from the database
		$access = mysql_fetch_assoc($result);
		if(count($access) > 0) {
			// Check access if it was returned
			if($access_type == 'w') {
				return strtolower($access['access']) == 'w';
			} else if ($access_type == 'r') {
				// w implies access r
				return strtolower($access['access']) == 'r' || strtolower($access['access']) == 'w'; 
			} else {
				return false;
			}
		} else {
			// Otherwise default to no.
			return false;
		}
	}

	return false;
}

//---------------------------------------------------------------------------------------------------------------
// logout
//---------------------------------------------------------------------------------------------------------------

function logout()
{
	// Copied from http://stackoverflow.com/a/3948312 and slightly modified, licensed under cc by-sa
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
}
?>
