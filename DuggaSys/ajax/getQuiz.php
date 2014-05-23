<?php
session_start(); 
include_once(dirname(__file__)."/../../Shared/sessions.php");

if (checklogin()) {
	if (isSuperUser($_SESSION["uid"])==true) {
		include_once(dirname(__file__)."/../../../coursesyspw.php");
		include_once(dirname(__file__)."/../../Shared/database.php");
		pdoConnect();
		$error = false;
		$template = "kryss";

		$quiz = array(
		    "name" => "Ett quiznamn?",
		    "parameters" => "6,5,4,3,2,1",
		    "question" => "Hur bra är Zlatan?",
		    "template" => "false"
		);
		$templatePath = '../templates/'.$template.'.js';

		if (file_exists($templatePath)) {
			$quiz["template"] = $template;
		}

		foreach ($quiz as $value) {
			if($value == "false") {
				$error = true;
			}
		}

		if(!$error) {
			print (json_encode($quiz));
		}
		else {
			print (json_encode(array("error")));
		}
	}
}
?>
