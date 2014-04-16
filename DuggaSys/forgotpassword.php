<?php
include_once "../Shared/database.php";
include_once "../../coursesyspw.php";
include_once "../Shared/external/password.php";
session_start();
dbConnect();

// If a username and a password is provided, verify the answer.
if(array_key_exists('user', $_POST) && array_key_exists('answer', $_POST) && array_key_exists('newpassword', $_POST)) {
	$answerres = array();
	$query = sprintf("SELECT answer FROM user_question,user WHERE user_question.owner=user.uid AND user.username='%s'",
		mysql_real_escape_string($_POST['user'])
	);
	$result = mysql_query($query);

	if(mysql_num_rows($result) > 0) {
		$res = mysql_fetch_assoc($result);
		if($res["answer"] == $_POST['answer']) {
			$updquery = sprintf("UPDATE user SET password='%s' WHERE username='%s'",
				mysql_real_escape_string(
					password_hash($_POST['newpassword'], PASSWORD_BCRYPT, array("cost" => 12))
				),
				mysql_real_escape_string($_POST['user'])
			);

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

	echo json_encode($answerres);
} else if(array_key_exists('user', $_GET)) {
	// If a username has been provided, look it up and retrieve the question.
	$res = array();
	$query = sprintf("SELECT username,question FROM user_question,user WHERE user_question.owner=user.uid AND user.username='%s'",
		mysql_real_escape_string($_GET["user"])
	);

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
