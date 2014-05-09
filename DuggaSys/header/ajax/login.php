<?php
session_start();
include_once dirname(__FILE__) . "/../../../../coursesyspw.php";
include_once dirname(__FILE__) . "/../../../shared/sessions.php";

if(array_key_exists('username', $_POST) && array_key_exists('password', $_POST)) {
	$username = $_POST['username'];
	$password = $_POST['password'];
}

$savelogin = array_key_exists('saveuserlogin', $_POST) && $_POST['saveuserlogin'] == 'on';

pdoConnect();

// Default values
$res = array("login" => "failed");

if(login($username, $password, $savelogin)) {
	// Successfully logged in, return this.
	$res["login"] = "success";
	$res["username"] = $username;

	// If the user hasn't set a new password after getting a randomly generated
	// one, notify the login script of this.
	if($_SESSION['newpw'] === true)
		$res["newpw"] = true;
}

// Return the data as JSON
echo json_encode($res);
?>
