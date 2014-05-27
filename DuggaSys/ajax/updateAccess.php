<?php
include_once(dirname(__FILE__) . "/../../Shared/basic.php");
pdoConnect();
session_start();
if(!array_key_exists('courseid', $_POST)) {
	die('No course set');
}
	if(checklogin() && (hasAccess($_SESSION['uid'], $_POST['courseid'], 'w') || isSuperUser($_SESSION['uid']))) {
		$success = false;
		$entries = array();
		$access = $_POST['access'];
		$uid = $_POST['uid'];
		$stmt = $pdo->prepare('UPDATE `user_course` SET `access`=:access WHERE uid=:uid');
		$stmt->bindParam(':access', $access);
		$stmt->bindParam(':uid', $uid);
		if($stmt->execute() && $stmt->rowCount() > 0) {
			$success = true;
		}
		
		$query = $pdo->prepare("SELECT user.uid as uid,username,access,firstname,lastname FROM user, user_course WHERE cid=:cid AND user.uid=user_course.uid");
		$query->bindParam(':cid', $_POST['courseid']);
		$query->execute();

		foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
			$entry = array(
				'uid' => $row['uid'],
				'username' => $row['username'],
				'access' => $row['access'],
				'firstname' => $row['firstname'],
				'lastname' => $row['lastname']
			);

			array_push($entries, $entry);
		}
		$array = array(
			'entries' => $entries,
			'success' => $success
		);

		echo json_encode($array);
	} else {
	
		$array = array(
			'entries' => "",
			'success' => false
		);

		echo json_encode($array);
	}
?>
