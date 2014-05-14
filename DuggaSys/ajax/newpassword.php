<?php
session_start();
include_once(dirname(__FILE__) . "/../../Shared/sessions.php");
pdoConnect();

$array = array();

if(checklogin()) {
	if(array_key_exists('currentpassword', $_POST) && array_key_exists('password', $_POST) && array_key_exists('password2', $_POST)) {
		$query = $pdo->prepare("SELECT uid,username,password FROM user WHERE uid=:uid");
		$query->bindParam(':uid', $_SESSION['uid']);
		if($query->execute() && $query->rowCount() > 0) {
			$res = $query->fetch(PDO::FETCH_ASSOC);
			if(password_verify($_POST['currentpassword'], $res["password"])) {
				$updquery = $pdo->prepare("UPDATE user SET `password`=:newpass WHERE uid=:uid AND password=:password");

				$updquery->bindParam(':newpass', password_hash($_POST['password'], PASSWORD_BCRYPT, array("cost" => 12)));
				$updquery->bindParam(':password', $res["password"]);
				$updquery->bindParam(':uid', $_SESSION['uid']);

				if($updquery->execute() && $updquery->rowCount()) {
					$array = array('success' => true);
				} else {
					$array = array('success' => 'false', 'reason' => 'Error');
				}
			} else {
				$array = array('success' => 'false', 'reason' => 'Incorrect current password');
			}
		}
	} else {
		$array = array('success' => false, 'reason' => 'Missing parameters');
	}
} else {
	$array = array('success' => false, 'reason' => 'Not logged in');
}

echo json_encode($array);
