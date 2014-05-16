<?php 
session_start(); 
include_once(dirname(__file__)."/../../Shared/sessions.php");

if (checklogin()) {

	if (hasAccess($_SESSION["uid"], $_POST["cid"], "w")) {
		echo json_encode("yes");	
	} else {
		echo json_encode("no");
	}
	if (isSuperUser($_SESSION["uid"])==true) {

	} else {
		echo json_encode("no write access");
	}
} else {
	echo json_encode("no access");
}

?>