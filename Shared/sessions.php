<?php
require_once(dirname(__FILE__) . '/../Shared/external/password.php');
require_once(dirname(__FILE__) . '/../Shared/database.php');
//---------------------------------------------------------------------------------------------------------------
// checklogin - Checks Login Credentials and initiates the kind session variable that holds the credentials
//---------------------------------------------------------------------------------------------------------------

/**
 * Check whether or not the user is logged in.
 * @return bool Returns true if the user is logged in and false if they aren't
 */
function checklogin()
{
	// If neither session nor post return not logged in
	if(array_key_exists('loginname', $_SESSION)){
		return true;
	} else if(array_key_exists('username', $_COOKIE) && array_key_exists('password', $_COOKIE)) {
		return login($_COOKIE['username'], $_COOKIE['password'], false);
	} else {		
		return false;
	}
}	

/**
 * Log in the user with the specified username and password and
 * optionally set cookies for the user to be remembered until next
 * time they visit the site.
 * @param string $username Username of the user to log in
 * @param string $password Password of the user to log in
 * @param bool $savelogin Whether or not to save the information in a cookie
 * @return bool True on success (the user was logged in), false on failure.
 */ 
function login($username, $password, $savelogin)
{
	global $pdo;

	if($pdo == null) {
		pdoConnect();
	}

	$query = $pdo->prepare('SELECT * FROM user WHERE username=:username LIMIT 1');
	$query->bindParam(':username', $username);
	$query->execute();

	if($query->rowCount() > 0) {
		// Fetch the result
		$row = $query->fetch(PDO::FETCH_ASSOC);
		if(password_verify($password, $row['password']) || sha1($row['password']) === $password) {
			$_SESSION['uid'] = $row['uid'];
			$_SESSION["loginname"]=$row['username'];
			$_SESSION["passwd"]=$row['password'];
			$_SESSION["newpw"]=($row["newpassword"] > 0);
			$_SESSION["superuser"]=$row['superuser'];

			// Save some login details in cookies.
			if($savelogin) {
				setcookie('username', $row['username'], time()+60*60*24*30, '/');
				setcookie('password', sha1($row['password']), time()+60*60*24*30, '/');
			}
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
}

/**
 * Check if a specified user ID has the requested access on a specified course
 * @param int $userId User ID of the user to look up
 * @param int $courseId ID of the course to look up access for
 * @param string $access_type A single letter denoting read or write access 
 * (r and w respectively)
 * @return bool Returns true if the user has the requested access on the course
 * and false if they don't.
 */
function hasAccess($userId, $courseId, $access_type)
{
	$access = getAccessType($userId, $courseId);

	if($access_type === 'w') {
		return strtolower($access) == 'w';
	} else if ($access_type === 'r') {
		// w implies access r
		return strtolower($access) == 'r' || strtolower($access) == 'w'; 
	} else {
		return false;
	}
}

/**
 * Returns the access a specified user has on the specified course
 * @param int $userId User ID of the user to look up
 * @param int $courseId Course ID of the course to look up access on
 * @return string Returns the access for the user on the selected course (r or w)
 */
function getAccessType($userId, $courseId)
{
	global $pdo;

	if($pdo == null) {
		pdoConnect();
	}

	require_once "../Shared/courses.php";
	if(!is_numeric($courseId)) {
		$courseId = getCourseId($courseId);
	}

	$query = $pdo->prepare('SELECT access FROM user_course WHERE uid=:uid AND cid=:cid LIMIT 1');
	$query->bindParam(':uid', $userId);
	$query->bindParam(':cid', $courseId);
	$query->execute();

	// Fetch data from the database
	if($query->rowCount() > 0) {
		$access = $query->fetch(PDO::FETCH_ASSOC);
		return strtolower($access['access']);
	} else {
		return false;
	}
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

	// Remove the cookies.
	setcookie('username', '', 0, '/');
	setcookie('password', '', 0, '/');
}
?>
