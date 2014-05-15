<?php
		include_once(dirname(__file__)."/../../../coursesyspw.php");
		include_once(dirname(__file__)."/../../Shared/database.php");
		pdoConnect();
		$access = $_POST['access'];
		$stmt = $pdo -> prepare("UPDATE `user_course` SET `access` = '$access'");
		$stmt -> bindParam(':access', $access);
		$stmt -> execute();
?>