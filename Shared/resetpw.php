<?php

// Set cookie life length and start session

// Start session using parameters above

include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";

include_once "../../coursesyspw.php";

$opt=getOP('opt');

if($opt=="GETQUESTION"){
	$username=getOP('username');
	$securityquestion=getOP('securityquestion');

	pdoConnect(); // Made sure if actually connects to a database

	// Default values
	$res = array("getname" => "failed");
	$res = array("securityquestion" => "undefined");

	if(getQuestion($username)){
		$res["getname"] = "success";
		$res["username"] = $username;
		$res["securityquestion"] = $_SESSION["securityquestion"];

		//maybe log this action?
	}else{
		//should maybe use tries here so that you cant guess all usernames or maybe just return an error if user does not exist.

		//maybe log this action?

		$res["getname"] = "failure";
	}
	
	echo json_encode($res);

}else if($opt=="CHECKANSWER"){
	//everybody placehold now!
	
	$username=getOP('username');
	$securityquestionanswer=getOP('securityquestionanswer');

	pdoConnect(); // Made sure if actually connects to a database

	// Default values
	$res = array("checkanswer" => "failed");

	if(checkAnswer($username, $securityquestionanswer)){
		$res["checkanswer"] = "success";
		$res["username"] = $username;

		//maybe log this action?
	}else{
		//should maybe use tries here so that you cant guess all usernames or maybe just return an error if user does not exist.

		//maybe log this action?

		$res["checkanswer"] = "failure";
	}
	
	echo json_encode($res);

}
	
?>