<?php
include_once "../Shared/database.php";
include_once "../../coursesyspw.php";
include_once "../Shared/external/password.php";
include_once "../Shared/constants.php";
session_start();
pdoConnect();

// If a username and a password is provided, verify the answer.
if(array_key_exists('user', $_POST) && array_key_exists('answer', $_POST) && array_key_exists('newpassword', $_POST)) {
	$answerres = array();

	// Look up the question set by the user
	$query = $pdo->prepare("
		SELECT answer FROM 
			user_question,user 
		WHERE   user_question.owner=user.uid 
				AND user.username=:username");
	$query->bindParam(':username', $_GET['user']);
	$query->execute();

	// If there's results for the current user then fetch the information
	if($query->rowCount() > 0) {
		// Fetch question & answer information and compare the given answer to the
		// stored answer.
		$res = $query->fetch(PDO::FETCH_ASSOC);
		if($res["answer"] == $_POST['answer']) {
			if(strlen($_POST['newpassword']) < MIN_PASSWORD_LENGTH) {
				// Ensure that the newly provided password meets our requirements on
				// passwords (i.e. it must be at least MIN_PASSWORD_LENGTH characters long).
				$answerres["success"] = false;
				$answerres["error"] = "Password is not long enough";
			} else if($_POST['newpassword'] !== $_POST['newpassword2']) {
				// Make sure that the password provided by the user matches, since
				// resetting it again because they mistyped isn't really what we
				// want them to do.
				$answerres["success"] = false;
				$answerres["error"] = "Passwords do not match";
			} else {
				// If the password matches our requirements then update the password for
				// the user.
				$updquery = $pdo->prepare("UPDATE user SET password=:password WHERE username=:username");
				$updquery->bindParam(':username', $_GET['user']);
				$updquery->bindValue(
					':password',
					password_hash($_POST['newpassword'], PASSWORD_BCRYPT, array("cost" => 12))
				);

				// Run the query and report whether or not is succeeded.
				if($updquery->execute()) {
					$answerres["success"] = true;
				} else {
					$answerres["success"] = false;
				}
			}
		} else {
			$answerres["success"] = false;
			$answerres["error"]= "Incorrect answer";
		}
	} else {
		$answerres["success"] = false;
		$answerres["error"]= "Incorrect answer";
	}

	echo json_encode($answerres);
} else if(array_key_exists('user', $_GET)) {
	// If a username has been provided, look it up and retrieve the question.
	// We'll only reach this block if none of the other information was provided.
	$res = array();
	$query = $pdo->prepare(
		"SELECT username,question 
		 FROM 
			user_question,user 
		WHERE 
			user_question.owner=user.uid AND user.username=:username");
	$query->bindParam(':username', $_GET['user']);

	// Fetch the information from the database and update the result variable.
	if($query->execute() && $query->rowCount() > 0) {
		$data = $query->fetch(PDO::FETCH_ASSOC);
		$res = array(
			"username" => $data["username"],
			"question" => $data["question"]
		);
	} else {
		$res["error"] = "No such user or no secret question set.";
	}

	echo json_encode($res);

} else {
	echo json_encode(array("error" => "No username provided"));
}
?>
