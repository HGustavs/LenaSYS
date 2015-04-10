<?php
	session_start();
	include_once "../Shared/sessions.php";
	
	$userid = $_SESSION['uid'];

	if(isSuperUser($userid)) {
		//redirect to teacherView.php
		header("Location: ../UserManagementView/teacherView.php");
	}
	else {
		//redirect to studentView.php
		header("Location: ../UserManagementView/studentView.php");
	}
?>