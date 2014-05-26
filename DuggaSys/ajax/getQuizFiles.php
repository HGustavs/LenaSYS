<?php 
session_start(); 
include_once(dirname(__file__)."/../../Shared/sessions.php");

if (checklogin()) {
	if (hasAccess($_SESSION["uid"], $_POST["cid"], "w")) {
		$dir    = '../templates';
		$files = scandir($dir);

		for ($i=0; $i < count($files); $i++) { 
			$files[$i] = str_replace(".js", "", $files[$i]);	
		}
		echo json_encode($files);
	} else {
		echo json_encode("no write access");
	}
} else {
	echo json_encode("no access");
}

?>