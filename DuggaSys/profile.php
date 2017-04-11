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

	<div id="content" style="display:flex">
		<div style="display:inline-flex;margin:0 auto 0 auto;">
			<div id="changeChallengeQuestion" style="margin-right:30px">
				<h3>Change challenge question</h3>
				<form method="post">
					<label for="currentPassword">Current password</label><br/>
					<input type="password" id="currentPassword" placeholder="Current password" /><br/><br/>
					<label for="challengeQuestion">Challenge question</label><br/>
					<?php
						/*change loginname to security question when we are able to get that from session*/
						echo "<textarea id='challengeQuestion' value='' onkeyup='checkScroll(this)' style='height:1.25em; max-height:110px; width:16em; overflow:auto; font-family:sans-serif;'>".$_SESSION['loginname']."</textarea><br/>"
					?>
					<label for="challengeAnswer">Challenge question</label><br/>
					<input type="password" id="challengeAnswer" placeholder="Answer to question" /><br/><br/>
				 	<button type="button" id="saveChallenge">Save</button>
				</form>
			</div>
		
			<div id="changePassword" style="margin:0 30px 0 30px;">
				<h3>Change password</h3>
				<form method="post">
					<label for="currentPassword2">Current password</label><br/>
					<input type="password" id="currentPassword2" placeholder="Current password" /><br/><br/>
					<label for="newPassword">New password</label><br/>
					<input type="password" id="newPassword" placeholder="New password" /><br/>
					<label for="newPassword2">New password again</label><br/>
					<input type="password" id="newPassword2" placeholder="New password again" /><br/><br/>
					<button type="button" id="savePassword">Save</button>
				</form>
			</div>
		
			<div id="notificationsOnOff" style="margin-left:30px">
				<h3>Activate notifications</h3>
				<button type="button" class="profile-element" id="activate_notifications">Activate notifications</button>
				<script>
					var push_notifications_vapid_public_key = "<?php echo PUSH_NOTIFICATIONS_VAPID_PUBLIC_KEY; ?>";
				</script>
			</div>
		</div>
	</div>


</body>
</html>
