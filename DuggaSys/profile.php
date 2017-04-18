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
		<button class="profile-element" type="button" id="NotificationButton">Click here to activate notifications</button>
	
		<form class="profile-element" method="POST" action="">
 			Challenge question
 			<br>
 			<?php
 				/*change loginname to security question when we are able to get that from session*/
				echo "<textarea id='challengeQuestion' value='' onkeyup='checkScroll(this)' style='height:1.25em; width:16em; overflow:auto; font-family:sans-serif;'>".$_SESSION['loginname']."</textarea>"
			?>
		 	<br>
		 	<input type="button" name="Save" id="Save" value="Save" />

		</form>
		
		<form class="profile-element" method="POST" action="">
 			New password 
 			<br>
 			<input type="text" id="newPassword" value="" style="width:16em;" placeholder="Enter new password" />
 			<br>
		 	<input type="button" name="Save" id="Save" value="Save" />
		</form>
		
		<form class="profile-element" method="POST" action="">
			Enter password to make changes 
			<br>
			<input type="text" id="passwordConfirmation" value="" style="width:16em;" placeholder="Enter password" /> 
			<br>
			<button type="button" id="saveProfile">Save changes</button>
		</form>
	</div>


</body>
</html>
