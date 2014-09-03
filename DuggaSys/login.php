<?php
session_start();
include_once "../../coursesyspw.php";
include_once "../Shared/sessions.php";
//include_once "../Shared/functions.php";

function getOP($name)
{
		if(isset($_POST[$name]))	return htmlEntities($_POST[$name]);
		else return "UNK";			
}

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
?>
