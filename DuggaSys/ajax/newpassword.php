<?php
session_start();
include_once "../../coursesyspw.php";
include_once "../Shared/sessions.php";
include_once "../Shared/database.php";
include_once "../Shared/external/password.php";
include_once "../Shared/constants.php";

dbConnect();

// Make sure the user is logged in before proceeding since this is only
// supposed to work on logged in users.
if(checklogin()) { 
	// Make sure all required fields are there, if they aren't we return an error.
	if(array_key_exists('password', $_POST) && array_key_exists('password2', $_POST) &&
	array_key_exists('question', $_POST) && array_key_exists('answer', $_POST)) {
		// Make sure the two password fields match.
		if($_POST['password'] !== $_POST['password2']) {
			echo json_encode(array("success" => false, "errormsg" => "Passwords do not match"));
			die();
		}

		if(strlen($_POST['password']) < MIN_PASSWORD_LENGTH) {
			echo json_encode(array("success" => false, "errormsg" => "Password too short"));
			die();
		}

		// We should probably migrate to PDO as soon as possible.
		mysql_query("START TRANSACTION");

		// Update the password for the user.
		$querystring = sprintf("UPDATE user SET `password`='%s', `newpassword`=0 WHERE uid='%s' LIMIT 1",
			mysql_real_escape_string(
				password_hash($_POST['password'], PASSWORD_BCRYPT, array("cost" => 12))
			),
			mysql_real_escape_string($_SESSION['uid'])
		);

		$result = mysql_query($querystring);
		if(!$result) {
			echo json_encode(array("success" => false, "errormsg" => "Failed to update user password"));
			mysql_query("ROLLBACK");
			die();
		} else {
			if(strlen($_POST['question']) < 1 && strlen($_POST['answer']) < 1) {
				echo json_encode(array("success" => false, "errormsg" => "Question or answer may not be empty"));
				mysql_query("ROLLBACK");
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
				mysql_query("ROLLBACK");
				die();
			}
		}
		mysql_query("COMMIT");
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
