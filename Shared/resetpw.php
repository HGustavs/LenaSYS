<?php

// Set cookie life length and start session
ini_set('session.gc_maxlifetime', 1800);
session_set_cookie_params('1800');

// Start session using parameters above
session_start();

include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";

include_once "../../coursesyspw.php";

$opt=getOP('opt');

if($opt=="GETQUESTION"){
	$username=getOP('username');

	pdoConnect(); // Made sure if actually connects to a database

	// Default values
	$res = array("getname" => "failed");

	if(getQuestion($username)){
		$res["getname"] = "success";
		$res["username"] = $username;

		//maybe log this action?
	}else{
		//should maybe use tries here so that you cant guess all usernames or maybe just return an error if user does not exist.

		//maybe log this action?
	}
	echo json_encode($res);
}else if($opt=="CHECKANSWER"){
	//everybody placehold now!
}

	
?>
 
