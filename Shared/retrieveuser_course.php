<?php
include_once ("../Shared/database.php");
pdoConnect();

$cid = $_POST['cid'];
$versid = $_POST['versid'];

$users_course = array();

if (isset($cid)) {
	foreach ($pdo->query('SELECT * FROM user_course WHERE cid="'.$cid.'" AND vers="'.$versid.'"') AS $user_course) {
		$uid = $user_course['uid'];
		foreach ($pdo->query('SELECT * FROM user WHERE uid="'.$uid.'" ORDER BY firstname ASC') AS $user) {
			$username = $user['username'];
			$firstname = $user['firstname'];
			$lastname = $user['lastname'];
			$users_course[] = array("uid" => $uid, "username" => $username, "firstname"=>$firstname, "lastname" => $lastname);
		}
		
	}
	echo json_encode(["users_course" => $users_course]);
}

?>