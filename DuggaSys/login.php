<?php
session_start();
include_once "../../coursesyspw.php";
include_once "../Shared/database.php";
include_once "../Shared/sessions.php";

dbConnect();

// Default values
$res = array("login" => "failed");

if(login()) {
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
