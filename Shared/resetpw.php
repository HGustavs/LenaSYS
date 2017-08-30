<?php

include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";

include_once "../../coursesyspw.php";

$opt=getOP('opt');

if($opt=="GETQUESTION"){
	$username=getOP('username');
	$securityquestion=getOP('securityquestion');

	pdoConnect(); // Makes sure it actually connects to a database

	// Default values
	$res = array("getname" => "failed");
	$res = array("securityquestion" => "undefined");

	if(getQuestion($username)){
		$res["getname"] = "success";
		$res["username"] = $username;
		$res["securityquestion"] = $_SESSION["securityquestion"];
	}else{
		$res["getname"] = $_SESSION["getname"];
	}
	
	echo json_encode($res);

}else if($opt=="CHECKANSWER"){	
	$username=getOP('username');
	$securityquestionanswer=getOP('securityquestionanswer');

	pdoConnect(); // Makse sure it actually connects to a database

	// Default values
	$res = array("checkanswer" => "failed");

	if(checkAnswer($username, $securityquestionanswer)){
		$res["checkanswer"] = "success";
		$res["username"] = $username;
	}else{
		$res["checkanswer"] = "failure";
	}
	
	echo json_encode($res);

}else if($opt=="REQUESTCHANGE"){
	$username=getOP('username');

	pdoConnect(); // Makes sure it actually connects to a database

	// Default values
	$res = array("requestchange" => "failed");

	if(requestChange($username)){
		$res["requestchange"] = "success";
		$res["username"] = $username;
	}else{
		$res["requestchange"] = "failure";
	}

	echo json_encode($res);
}
	
?>