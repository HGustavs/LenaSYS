<?php
include_once("../Shared/sessions.php");

$OC_db = mysql_connect(localhost,root,kaka) or err("Could not connect to database ".mysql_errno(),$hdr);
	mysql_set_charset('utf8',$OC_db);
	// Select DB
	mysql_select_db(imperious) or err("Could not select database \"".imperious."\" error code".mysql_errno(),$hdr);


{
	global $pdo;
	try {
		$pdo = new PDO(
			'mysql:host=' . localhost . ';dbname=' . imperious . ';charset=utf8',
			root,
			kaka
		);
	} catch (PDOException $e) {
		echo "Failed to get DB handle: " . $e->getMessage() . "</br>";
		exit;
	}
}


	$uid = $_POST['uid'];
	$curPass = $_POST['curPass'];
	$password = $_POST['newPass'];
	$checkPass = $_POST['checkPass'];

	$query = $pdo->prepare('SELECT password FROM user WHERE uid=:uid');
	$query->bindParam(':uid', $uid);
	$query->execute();
	$resultPass = $query->fetch();

	$query = $pdo->prepare('SELECT password FROM user WHERE password=password(:pwd)');
	$query->bindParam(':pwd', $curPass);
	$query->execute();
	$resultPassCheck = $query->fetch();

	echo $resultPass['password'] . " : Current Password<br \>";
	echo $resultPassCheck['password'] . " : Pass Check <br \>";
	echo $_SESSION['uid']. "Session UID <br \>";

	$currentPW = $resultPass['password'];
	$PWCheck = $resultPassCheck['password'];
	
	if($currentPW == $PWCheck)
	{
			if($password == $checkPass) 
		{
			// Passwords Match

			$query = $pdo->prepare("UPDATE user SET password=password(:pwd) WHERE uid=:uid");

			$query->bindParam(':uid', $uid);
			$query->bindParam(':pwd', $password);

			$query->execute();


			echo "Your password has been changed!";
		}

		else
		{
			echo "Your passwords do not match!";
		}
	}

	else
	{
		echo "Incorrect login password";
	}


	/*
	$query = $pdo->prepare("UPDATE user SET password=password(:pwd) where uid=:uid");

	$query->bindParam(':uid', $uid);
	$query->bindParam(':pwd', $password);

	$query->execute();


	*/

?>