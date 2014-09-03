<?php
session_start();
include_once "../Shared/sessions.php";

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
	
?>
 
