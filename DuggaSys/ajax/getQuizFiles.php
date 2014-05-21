<?php 
session_start(); 
include_once(dirname(__file__)."/../../Shared/sessions.php");

if (checklogin()) {
	if (hasAccess($_SESSION["uid"], $_POST["cid"], "w")) {
		$dir    = '../templates';
		$files1 = scandir($dir);

		echo json_encode($files1);
	} else {
		echo json_encode("no write access");
	}
} else {
	echo json_encode("no access");
}

?>