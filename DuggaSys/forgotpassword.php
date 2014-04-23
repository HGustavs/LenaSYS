<?php
include_once "../Shared/database.php";
include_once "../../coursesyspw.php";
include_once "../Shared/external/password.php";
include_once "../Shared/constants.php";
session_start();
dbConnect();

// If a username and a password is provided, verify the answer.
if(array_key_exists('user', $_POST) && array_key_exists('answer', $_POST) && array_key_exists('newpassword', $_POST)) {
	$answerres = array();

	// Look up the question set by the user
	$query = sprintf("SELECT answer FROM user_question,user WHERE user_question.owner=user.uid AND user.username='%s'",
		mysql_real_escape_string($_POST['user'])
	);
	$result = mysql_query($query);

	// If there's results for the current user then fetch the information
	if(mysql_num_rows($result) > 0) {
		// Fetch question & answer information and compare the given answer to the
		// stored answer.
		$res = mysql_fetch_assoc($result);
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
				$updquery = sprintf("UPDATE user SET password='%s' WHERE username='%s'",
					mysql_real_escape_string(
						password_hash($_POST['newpassword'], PASSWORD_BCRYPT, array("cost" => 12))
					),
					mysql_real_escape_string($_POST['user'])
				);

				// Run the query and report whether or not is succeeded.
				$r = mysql_query($updquery);
				if($r) {
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
	$query = sprintf("SELECT username,question FROM user_question,user WHERE user_question.owner=user.uid AND user.username='%s'",
		mysql_real_escape_string($_GET["user"])
	);

	// Fetch the information from the database and update the result variable.
	$result = mysql_query($query);
	if(mysql_num_rows($result) > 0) {
		$data = mysql_fetch_assoc($result);
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
