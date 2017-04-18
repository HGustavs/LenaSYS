<?php
	session_start(); // Needed for the user must be logged in. 

	include_once "../../coursesyspw.php"; // Passwords to the database etc. 
	include_once "../Shared/sessions.php"; // Session methods or something
	pdoConnect();
?>
<!DOCTYPE html>
<html>
<head>
	<link rel="icon" type="image/ico" href="../Shared/icons/favicon.ico"/>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>Group editor for duggas</title>

	<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
  	<link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">

	<script src="../Shared/js/jquery-1.11.0.min.js"></script>
	<script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>

	<script src="../Shared/dugga.js"></script>
	<script src="grouped.js"></script>
</head>
<body onload="setup();">

	<!-- Navigation Header START -->
	<?php
		$noup="SECTION"; // This makes the back-button available. 
		include '../Shared/navheader.php';
	?>
	<!-- Navigation Header END -->

	<!-- Content START -->
	<div id="content">

	</div>
	<!-- Content END -->

	<!-- Login Dialog START -->
	<?php
		include '../Shared/loginbox.php';
	?>
	<!-- Login Dialog END -->

</body>
</html>
