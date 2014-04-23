<?php
session_start();
include_once "../../coursesyspw.php";
include_once "../Shared/sessions.php";
include_once "../Shared/database.php";
include_once "../Shared/external/password.php";

dbConnect();

if(checklogin()) { 
	if(array_key_exists('password', $_POST) && array_key_exists('password2', $_POST) &&
		array_key_exists('question', $_POST) && array_key_exists('answer', $_POST)) {

		if($_POST['password'] !== $_POST['password2']) {
			echo json_encode(array("success" => false, "errormsg" => "Passwords do not match"));
			die();
		}

		if(strlen($_POST['password']) > 8) {
			echo json_encode(array("success" => false, "errormsg" => "Password too short"));
			die();
		}

		$querystring = sprintf("UPDATE user SET `password`='%s', `newpassword`=0 WHERE uid='%s' LIMIT 1",
			mysql_real_escape_string(
				password_hash($_POST['password'], PASSWORD_BCRYPT, array("cost" => 12))
			),
			mysql_real_escape_string($_SESSION['uid'])
		);

		$result = mysql_query($querystring);
		if(!$result) {
			echo json_encode(array("success" => false, "errormsg" => "Failed to update user password"));
			die();
		} else {
			if(strlen($_POST['question']) > 0 && strlen($_POST['answer']) > 0) {
				echo json_encode(array("success" => false, "errormsg" => "Question or answer may not be empty"));
				die();
			}

			mysql_query(sprintf("DELETE FROM user_question WHERE owner='%d'", 
				mysql_real_escape_string($_SESSION['uid'])
			));

			// Insert new question and update it on duplicate
			$qs = sprintf("INSERT INTO user_question (question, answer, owner) VALUES('%s', '%s', %d)",
				mysql_real_escape_string($_POST['question']),
				mysql_real_escape_string($_POST['answer']),
				mysql_real_escape_string($_SESSION['uid'])
			);

			$r = mysql_query($qs);
			if($r) {
				echo json_encode(array("success" => true));
			} else {
				echo json_encode(array("success" => false, "errormsg" => "Failed to save recovery question"));
				die();
			}
		}

	}
	else {
		echo json_encode(
			array(
				"success" => false,
				"errormsg" => "Missing required fields"
			)
		);
	}
}
?>
