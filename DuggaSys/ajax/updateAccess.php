<?php
		include_once(dirname(__file__)."/../../Shared/database.php");
		pdoConnect();
		$access = $_POST['access'];
		$uid = $_POST['uid'];
		$stmt = $pdo->prepare('UPDATE `user_course` SET `access`=:access WHERE uid=:uid');
		$stmt->bindParam(':access', $access);
		$stmt->bindParam(':uid', $uid);
		if($stmt->execute() && $stmt->rowCount() > 0) {
			$array = array("success" => true);
		} else {
			$array = array("success" => false);
		}

		echo json_encode($array);
?>
