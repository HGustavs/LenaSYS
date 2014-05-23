<?php
session_start();
include_once dirname(__FILE__) . "/../../../../coursesyspw.php";
include_once dirname(__FILE__) . "/../../../Shared/sessions.php";
include_once dirname(__FILE__) . "/../../../Shared/functions.php";

if(array_key_exists('username', $_POST) && array_key_exists('password', $_POST)) {
	$username = $_POST['username'];
	$password = $_POST['password'];
}

$savelogin = array_key_exists('saveuserlogin', $_POST) && $_POST['saveuserlogin'] == 'on';

pdoConnect();

// Default values
$res = array("login" => "failed");

if(failedLoginCount($_SERVER['REMOTE_ADDR']) >= 10) {
	$res["login"] = "failed";
	$res["reason"] = "Too many failed attempts, try again later";
} else if(login($username, $password, $savelogin)) {
	// Successfully logged in, return this.
	$res["login"] = "success";
	$res["username"] = $_SESSION['loginname'];

	// If the user hasn't set a new password after getting a randomly generated
	// one, notify the login script of this.
	if($_SESSION['newpw'] === true)
		$res["newpw"] = true;
} else {
	// There's no user logged in so there's no user to associate this event with.
	log_message(
		NULL,
		'loginerr',
		sprintf("Failed login attempt for user %s",
			htmlentities($username)
		)
	);
}

// Return the data as JSON
echo json_encode($res);
?>
