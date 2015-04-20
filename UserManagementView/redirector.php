<?php

	/*******************************************************************************************
	
	Documentation - redirector.php
	
	********************************************************************************************
	
	redirector.php - redirects the user to the given usermanagementview.
		* Teachers are directed to teacerView.php
		* Students are directed to studentView.php
		
	Uses function isSuperUser in session.php to see if user is a teacher
	or student
	
	-------------==============######## Documentation End ###########==============-------------
	*/
	
	session_start();
	include_once "../Shared/sessions.php";
	
	$userid = $_SESSION['uid'];

	if(isSuperUser($userid)) {
		header("Location: ../UserManagementView/teacherView.php");
	}
	else {
		header("Location: ../UserManagementView/studentView.php");
	}
?>