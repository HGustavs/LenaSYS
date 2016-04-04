<?php
	include_once "../../coursesyspw.php";
	include_once "../Shared/sessions.php";
	// continue if logged in, else redirect to loginprompt
	session_start();
	if(!checklogin()){
		header("Location: ../Shared/loginprompt.php");
	}
	pdoConnect();


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

	// Fetch logged in users ID
	$uid = $_SESSION['uid'];

	// Fetch data from the form
	$curPass = $_POST['curPass'];
	$password = $_POST['newPass'];
	$checkPass = $_POST['checkPass'];

	// Fetch the logged in users password
	$query = $pdo->prepare('SELECT password FROM user WHERE uid=:uid');
	$query->bindParam(':uid', $uid);
	$query->execute();
	$resultPass = $query->fetch();

	// Fetch the hashed version of the form password data
	$query = $pdo->prepare('SELECT password FROM user WHERE password=password(:pwd)');
	$query->bindParam(':pwd', $curPass);
	$query->execute();
	$resultPassCheck = $query->fetch();

	// Put the results in variables
	$currentPW = $resultPass['password'];
	$PWCheck = $resultPassCheck['password'];
	
	// Check if the "Current Password" data matches with the logged in users password
	if($currentPW == $PWCheck)
	{
			// Check if the user submitted identical passwords in the "New Password" fields
			if($password == $checkPass) 
		{
			// Change the current password
			$query = $pdo->prepare("UPDATE user SET password=password(:pwd) where uid=:uid");

			$query->bindParam(':uid', $uid);
			$query->bindParam(':pwd', $password);

			$query->execute();

			// Send feedback
			$errmsg = "Your password has been changed!";
			 header("Location:teacherView.php?errmsg=".$errmsg);
		}

		else
		{
			// If the user submitted different data in the "New Password" fields
			// Send feedback
			$errmsg = "Your passwords do not match!";
			 header("Location:teacherView.php?errmsg=".$errmsg);
		}
	}

	else
	{	
		// If the user submitted incorrect data in the "Current Password" field
		// Send feedback
		$errmsg = "Incorrect current password!";
			 header("Location:teacherView.php?errmsg=".$errmsg);
	}

	die();
?>