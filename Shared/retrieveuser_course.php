<?php
include_once ("../Shared/database.php");
pdoConnect();

$cid = $_POST['cid'];
$versid = $_POST['versid'];
$remove_student = $_POST['remove_student'];

$finished_students = array();
$non_finished_students = array();

if (isset($cid)) {
	foreach ($pdo->query('SELECT * FROM user_course WHERE cid="'.$cid.'" AND vers="'.$versid.'"') AS $user_course) {
		$uid = $user_course['uid'];
		$passed = intval($user_course['passed']);
		if ($passed >= 8) {
			foreach ($pdo->query('SELECT * FROM user WHERE uid="'.$uid.'" ORDER BY firstname ASC') AS $user) {
				$username = $user['username'];
				$firstname = $user['firstname'];
				$lastname = $user['lastname'];
				$finished_students[] = array("uid" => $uid, "username" => $username, "firstname"=>$firstname, "lastname" => $lastname);
			}
		}elseif ($passed <= 8) {
			foreach ($pdo->query('SELECT * FROM user WHERE uid="'.$uid.'" ORDER BY firstname ASC') AS $user) {
				$username = $user['username'];
				$firstname = $user['firstname'];
				$lastname = $user['lastname'];
				$non_finished_students[] = array("uid" => $uid, "username" => $username, "firstname"=>$firstname, "lastname" => $lastname);
			}
		}
		
	}
	foreach ($users_course as $key => $value) {
		$student_teacher = $value['uid'];
		if ($student_teacher == $remove_student) {
			unset($users_course[$key]);
		}
	}
	echo json_encode(["finished_students" => $finished_students, "non_finished_students" => $non_finished_students]);
}

?>