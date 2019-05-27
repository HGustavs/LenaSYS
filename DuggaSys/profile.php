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
	<script src="profile.js"></script>

	<script src="pushnotifications.js"></script>
</head>
<body>

	<?php
		$noup="PROFILE";
		include '../Shared/navheader.php';
		include '../Shared/loginbox.php';
	?>

	<?php
	if(checklogin()){
	?>
		<div id="content">
			<div style="width:100%;height:50px;">
				<h1 style="text-align:center;color:#614875;">Profile</h1>
			</div>
			<div style="flex-wrap:wrap;">
				<div id="changeChallengeQuestion" class="material-box" style="flex-grow: 1;">
					<h3>Change challenge question</h3>
					<form method="post" id="challengeForm">
						<label for="currentPassword">Current password</label><br>
						<input type="password" id="currentPassword" class="form-control textinput" placeholder="Current password"><br><br>
						<label for="challengeQuestion">Challenge question</label><br>
						<label id="securityQuestionError"></label>
						<select id="securityQuestion" class="form-control textinput" name="securityQuestions">
							<option value="What was the name of your first pet?">What was the name of your first pet?</option>
							<option value="What is your favourite sports/e-sports team?">What is your favourite sports/e-sports team?</option>
							<option value="What was the best birthday present you ever got?">What was the best birthday present you ever got?</option>
							<option value="What is the first name of your favorite childhood friend?">What is the first name of your favorite childhood friend?</option>
							<option value="What is the first name of the person you had your second kiss with?">What is the first name of the person you had your second kiss with?</option>
							<option value="What was your favorite place to visit as a child?">What was your favorite place to visit as a child?</option>
							<option value="Where did you go on your first vacation?">Where did you go on your first vacation?</option>
						</select>
						<br><br>
						<label for="challengeAnswer">Challenge answer</label><br>
						<input type="text" id="challengeAnswer" class="form-control textinput" placeholder="Answer to question"><br><br>
						<button type="submit" class="submit-button" style="float: none; margin-left: 0; width: 150px;">Save Challenge</button>
					</form>
					<div id="challengeMessage"></div>
				</div>

				<div id="changePassword" class="material-box" style="flex-grow: 1;">
					<h3>Change password</h3>
					<div id="passForm">
						<form method="post" id="passwordForm">
							<label for="currentPassword2">Current password</label><br>
							<input type="password" class="form-control textinput" id="currentPassword2" placeholder="Current password" maxlength="72"><br><br>
							<label for="newPassword">New password</label><br>
							<input type="password" class="form-control textinput" id="newPassword" placeholder="Max 72 characters" maxlength="72"><br>
							Password must be 8 Characters minimum.<br>
							Password must contain a number, an uppercase and a lowercase letter.<br><br>
							<label for="newPassword2">Confirm new password</label><br>
							<input type="password" class="form-control textinput" id="newPassword2" placeholder="New password again" maxlength="72"><br><br>
							<button type="submit" class="submit-button" style="float: none; margin-left: 0; width: 150px;">Update password</button><br><br>
						</form>
					</div>
					<div id="passwordMessage"></div>
				</div>

				<div id="notificationsOnOff" class="material-box" style="flex-grow: 1;">
					<h3>Push notifications</h3>
					<?php
					if (defined('PUSH_NOTIFICATIONS_VAPID_PUBLIC_KEY')) {
					?>
					<p id="notificationsText">Checking for push notification subscription...</p>
					<button type="button" id="notificationsToggle" disabled class="submit-button" style="float: none; margin-left: 0; width: 230px;">Please wait...</button>
					<script>
						var push_notifications_vapid_public_key = "<?php echo PUSH_NOTIFICATIONS_VAPID_PUBLIC_KEY; ?>";
					</script>
					<?php
					} else {
						echo "<p>Notifications subsystems not installed, notifications unavailable.</p>";
					}
					?>

				</div>
			</div>
		</div>
	<?php
	} else {
		showLoginPopup();
	}
	?>

</body>
</html>
