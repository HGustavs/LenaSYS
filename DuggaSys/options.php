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
		$options = getAllOptions();
?>
	<!-- content START -->
	<div id="content">
		<div id="settingsToast"></div>
			<div class="allSettings">
			<h2>Logging</h2>
				<div class="setting">
					<p>Mouse movement logging</p>
					<label data-label="mouseMoveLogging" class="switch<?= $options['mouseMoveLogging'] == '1' ? ' checked' : ''?>">
						<i class="icon-ok"></i>
						<i class="icon-remove"></i>
						<input type="checkbox"<?= $options['mouseMoveLogging'] == '1' ? ' checked' : ''?>>
					</label>
				</div>
				
				<div class="setting">
					<p>Fourth round trip logging</p>
					<label data-label="fourthRound" class="switch<?= $options['fourthRound'] == '1' ? ' checked' : ''?>">
						<i class="icon-ok"></i>
						<i class="icon-remove"></i>
						<input type="checkbox"<?= $options['fourthRound'] == '1' ? ' checked' : ''?>>
					</label>
				</div>
				<p>.</p>
			</div>
	</div>
	<!-- content END -->
	
<?php
	}	
	else{
		header('Location: courseed.php');
	}
?>