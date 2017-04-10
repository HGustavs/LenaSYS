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
<body>

	<!-- Navigation Header START -->
	<?php
		$noup="GROUP"; // What is this... Something for AJAXService?
		include '../Shared/navheader.php';
	?>
	<!-- Navigation Header END -->

	<!-- Content START -->
	<div id="content">
		<h1>Hello, world!</h1>
		<p>This will be filled to the brim with fun content soon&trade;.</p>
	</div>
	<!-- Content END -->

	<!-- Login Dialog START -->
	<?php
		include '../Shared/loginbox.php';
	?>
	<!-- Login Dialog END -->

</body>
</html>
