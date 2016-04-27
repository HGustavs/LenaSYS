<?php
session_start();
include_once "../../coursesyspw.php";
include_once "../Shared/sessions.php";
pdoConnect();
?>

<!DOCTYPE html>
<html>
<head>
	<link rel="icon" type="image/ico" href="../Shared/icons/favicon.ico"/>
	<meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>Options</title>

	<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
	<link type="text/css" href="../Shared/css/responsive.css" rel="stylesheet">
	<link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">
	
	<script src="../Shared/js/jquery-1.11.0.min.js"></script>
	<script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
	<script src="../Shared/dugga.js"></script>
	<script src="options.js"></script>
</head>
<body>

<?php

	$noup="NONE";
	$loginvar="OPTIONS";
	include '../Shared/navheader.php';
	setcookie("loginvar", $loginvar);
	
	// Show analytics if user is superuser.
	if(isset($_SESSION["superuser"]) && $_SESSION["superuser"] == 1){
?>
	<!-- content START -->
	<div id="content">
		<button id="mouseLoggingON">On</button>
		<button id="mouseLoggingOFF">Off</button>
	</div>
	<!-- content END -->
	
<?php
	}	
	else{
		header('Location: courseed.php');
	}
?>