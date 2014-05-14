<?php 
session_start(); 
include_once(dirname(__file__)."/../../Shared/sessions.php");

if (checklogin()) {
	if (isSuperUser($_SESSION["uid"])==true) {

	} else {
		echo json_encode("no write access");
	}
} else {
	echo json_encode("no access");
}

?>