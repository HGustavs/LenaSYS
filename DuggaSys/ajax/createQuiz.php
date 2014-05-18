<?php 
session_start(); 
include_once(dirname(__file__)."/../../Shared/sessions.php");

if (checklogin()) {

	if (hasAccess($_SESSION["uid"], $_POST["cid"], "w")) {
		
		$varCheck = "";

		if (isset($_POST["cid"]) && $_POST["cid"] !="") {
			$cid = $_POST["cid"];
		} else {
			$varCheck .= "cid/";
		}
		if (isset($_POST["access"]) && $_POST["access"] !="") {
			$access = $_POST["access"];
		} else {
			$varCheck .= "access/";
		}
		if (isset($_POST["quizname"]) && $_POST["quizname"] !="") {
			$quizname = $_POST["quizname"];
		} else {
			$varCheck .= "quizname/";
		}
		if (isset($_POST["parameters"]) && $_POST["parameters"] !="") {
			$parameters = $_POST["parameters"];
		} else {
			$varCheck .= "parameters/";
		}
		if (isset($_POST["answer"]) && $_POST["answer"] !="") {
			$answer = $_POST["answer"];
		} else {
			$varCheck .= "answer/";
		}
		if (isset($_POST["autograde"]) && $_POST["autograde"] !="") {
			$autograde = $_POST["autograde"];
		} else {
			$varCheck .= "autograde/";
		}
		if (isset($_POST["gradesys"]) && $_POST["gradesys"] !="") {
			$gradesys = $_POST["gradesys"];
		} else {
			$varCheck .= "gradesys/";
		}
		if (isset($_POST["releasedate"]) && $_POST["releasedate"] !="") {
			$releasedate = $_POST["releasedate"];
		} else {
			$varCheck .= "releasedate/";
		}
		if (isset($_POST["deadline"]) && $_POST["deadline"] !="") {
			$deadline = $_POST["deadline"];
		} else {
			$varCheck .= "deadline/";
		}
		if (isset($_POST["activateonsubmit"]) && $_POST["activateonsubmit"] !="") {
			$activateonsubmit = $_POST["activateonsubmit"];
		} else {
			$varCheck .= "activateonsubmit/";
		}

		if ($varCheck!="") {
			//echo json_encode($varCheck);	
		} else {
			//echo json_encode("all data present");		
		}
		
		
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