<?php
session_start();
include_once dirname(__FILE__) . "/../../../../coursesyspw.php";
include_once dirname(__FILE__) . "/../../../shared/sessions.php";
include_once dirname(__FILE__) . "/../../../Shared/database.php";
include_once dirname(__FILE__) . "/../../../Shared/external/password.php";
include_once dirname(__FILE__) . "/../../../Shared/constants.php";

pdoConnect();

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
		$pdo->beginTransaction();

		// Update the password for the user.
		$query = $pdo->prepare("UPDATE user SET `password`=:password, `newpassword`=0 WHERE uid=:uid LIMIT 1");
		$query->bindValue(':password', password_hash($_POST['password'], PASSWORD_BCRYPT, array("cost" => 12)));
		$query->bindParam(':uid', $_SESSION['uid']);

		if(!$query->execute()) {
			echo json_encode(array("success" => false, "errormsg" => "Failed to update user password"));
			$pdo->rollBack();
			die();
		} else {
			if(strlen($_POST['question']) < 1 && strlen($_POST['answer']) < 1) {
				echo json_encode(array("success" => false, "errormsg" => "Question or answer may not be empty"));
				$pdo->rollBack();
				die();
			}

			$delq = $pdo->prepare("DELETE FROM user_question WHERE owner=:id");
			$delq->bindParam(':id', $_SESSION['uid']);

			$insq = $pdo->prepare("INSERT INTO user_question (question, answer, owner) VALUES(:question, :answer, :uid)");
			$insq->bindParam(':question', $_POST['question']);
			$insq->bindParam(':answer', $_POST['answer']);
			$insq->bindParam(':uid', $_SESSION['uid']);

			if($insq->execute()) {
				echo json_encode(array("success" => true));
			} else {
				echo json_encode(array("success" => false, "errormsg" => "Failed to save recovery question"));
				$pdo->rollBack();
				die();
			}
		}
		$pdo->commit();
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
