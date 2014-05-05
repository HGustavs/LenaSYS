<?php
session_start();
include_once "../../coursesyspw.php";
include_once "../Shared/database.php";
include_once "../Shared/sessions.php";


// Default values
$res = array("login" => "failed");

if(array_key_exists('username', $_COOKIE) && array_key_exists('password', $_COOKIE)) {
	$username = $_COOKIE['username'];
	$password = $_COOKIE['password'];
} else if(array_key_exists('username', $_POST) && array_key_exists('password', $_POST)) {
	$username = $_POST['username'];
	$password = $_POST['password'];
} else {
	die('No username or password provided');
}

$save = array_key_exists('saveuserlogin', $_POST) && $_POST['saveuserlogin'] == 'on';

dbConnect();

if(login($username, $password, $save)) {
	// Successfully logged in, return this.
	$res["login"] = "success";

	// If the user hasn't set a new password after getting a randomly generated
	// one, notify the login script of this.
	if($_SESSION['newpw'] === true)
		$res["newpw"] = true;
}

// Return the data as JSON
echo json_encode($res);
?>
