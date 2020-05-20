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
		if ($passed >= 100) {
			foreach ($pdo->query('SELECT * FROM user WHERE uid="'.$uid.'" ORDER BY firstname ASC') AS $user) {
				$username = $user['username'];
				$firstname = $user['firstname'];
				$lastname = $user['lastname'];
				$finished_students[] = array("uid" => $uid, "username" => $username, "firstname"=>$firstname, "lastname" => $lastname);
			}
		}elseif ($passed < 100) {
			foreach ($pdo->query('SELECT * FROM user WHERE uid="'.$uid.'" ORDER BY firstname ASC') AS $user) {
				$username = $user['username'];
				$firstname = $user['firstname'];
				$lastname = $user['lastname'];
				$non_finished_students[] = array("uid" => $uid, "username" => $username, "firstname"=>$firstname, "lastname" => $lastname);
			}
		}
		
	}
	foreach ($finished_students as $key => $value) {
		$student_teacher = $value['uid'];
		if ($student_teacher == $remove_student) {
			unset($finished_students[$key]);
		}
	}
	foreach ($non_finished_students as $key => $value) {
		$student_teacher = $value['uid'];
		if ($student_teacher == $remove_student) {
			unset($non_finished_students[$key]);
		}
	}
	echo json_encode(["finished_students" => $finished_students, "non_finished_students" => $non_finished_students]);
}
if (isset($_POST['uid']) && isset($_POST['cid']) && isset($_POST['vers']) && isset($_POST['passed']) && isset($_POST['failed']) && isset($_POST['pending'])) {
	$uid = $_POST['uid'];
	$cid = $_POST['cid'];
	$vers = $_POST['vers'];
	$passed = $_POST['passed'];
	$failed = $_POST['failed'];
	$pending = $_POST['pending'];

	$query = $pdo->prepare("UPDATE user_course SET passed=:passed, failed=:failed, pending=:pending WHERE uid=:uid AND cid=:cid AND vers=:vers");

	$query->bindParam(':uid', $uid);
	$query->bindParam(':cid', $cid);
	$query->bindParam(':vers', $vers);
	$query->bindParam(':passed', $passed);
	$query->bindParam(':failed', $failed);
	$query->bindParam(':pending', $pending);

	$query->execute(); 

}
?>