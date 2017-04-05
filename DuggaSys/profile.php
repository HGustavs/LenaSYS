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
	<title>Profile</title>

	<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
	<link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">

	<script src="../Shared/js/jquery-1.11.0.min.js"></script>
	<script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
	<script src="../Shared/dugga.js"></script>

    <script src="pushnotifications.js"></script>
</head>
<body>

	<?php
		$noup="PROFILE";
		include '../Shared/navheader.php';
		include '../Shared/loginbox.php';
	?>

	<div id="content">
		<form class="profile-element" method="POST" action="">
 			Challenge question: <input onclick="saveSettings()" type="text" name="challengeQuestion" id="challengeQuestion" value="" />
		 	<input type="button" name="Save" id="Save" value="Save" />
		</form>
    
		<button class="profile-element" type="button" id="NotificationButton">Click here to activate notifications</button>
		
		<form class="profile-element" method="POST" action="">
 			Change password: 
 			<br>
 			New password: <input type="text" id="newPassword" value="" />
 			<br>
 			Old password: <input type="text" id="oldPassword" value="" />
 			<br>
		 	<input type="button" name="Save" id="Save" value="Save" />
		</form>
		
		<button class="profile-element" type="button" id="saveProfile">Save changes</button>
	</div>
    

</body>
</html>
