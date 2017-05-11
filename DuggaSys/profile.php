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
<body onload="checkConnection();">

	<?php
		$noup="PROFILE";
		include '../Shared/navheader.php';
		include '../Shared/loginbox.php';
	?>
	
	<?php
	if(checklogin()){
	?>
		<div id="content" style="display:flex">
			<div style="display:inline-flex;flex-wrap:wrap;margin:0 auto 0 auto;">
				<div style='width:100%;height:50px;'>
					<h1 style='text-align:center;color:#614875;'>Profile</h1>
				</div>
				<div id="changeChallengeQuestion" style="margin-right:60px">
					<h3>Change challenge question</h3>
					<form method="post">
						<label for="currentPassword">Current password</label><br/>
						<input type="password" id="currentPassword" class="form-control textinput" placeholder="Current password" /><br/><br/>
						<label for="challengeQuestion">Challenge question</label><br/>
						<label id="securityQuestionError"></label>
						<form action="/action_page.php">
						  <select id="securityQuestion" class="form-control textinput"name="securityQuestions">
							<option value="What's your mother's name?" selected>What is your mother's name?</option>
							<option value="In what year was your father born?">In what year was your father born?</option>
							<option value="What is your pet’s name?">What is your pet’s name?</option>
							<option value="Who was your childhood hero?">Who was your childhood hero?</option>
						  </select>
						  <br><br>
						</form>
						<!--<?php echo "<textarea id='challengeQuestion' value='' onkeyup='checkScroll(this)' style='height:1.25em; max-height:110px; width:16em; overflow:auto; font-family:sans-serif;'></textarea><br/>" ?>
						<script>addSecurityQuestionProfile('<?php echo $_SESSION['loginname'] ?>')</script>-->
						<label for="challengeAnswer">Challenge answer</label><br/>
						<input type="password" id="challengeAnswer" class="form-control textinput" placeholder="Answer to question" /><br/><br/>
						<button type="button" onClick="saveChallenge()" id="saveChallenge">Save Challenge</button><br/><br/>
					</form>
                    <div id="challengeMessage"></div>
				</div>
			
				<div id="changePassword" style="margin-right:60px;">
					<h3>Change password</h3>
                    <div id="passForm">
                        <form method="post" name="passwordForm">
                            <label for="currentPassword2">Current password</label><br/>
                            <input type="password" class="form-control textinput" id="currentPassword2" placeholder="Current password" maxlength="72"     onkeydown="formEventHandler(event)"/><br/><br/>
                            <label for="newPassword">New password (8 Characters minimum. Must contain a number,<br/> an uppercase and a lowercase letter.)</label><br/>
                            <input type="password" class="form-control textinput" id="newPassword" placeholder="Max 72 characters" maxlength="72"         onkeydown="formEventHandler(event)"/><br/>
                            <label for="newPassword2">Confirm new password</label><br/>
                            <input type="password" class="form-control textinput" id="newPassword2" placeholder="New password again" maxlength="72"       onkeydown="formEventHandler(event)"/><br/><br/>
                            <button type="button" id="passwordButton" onclick="validatePassword();">Update password</button><br/><br/>
                        </form>
                    </div>
                    <div id="passwordMessage"></div>
				</div>
			
				<div id="notificationsOnOff">
					<h3>Push notifications</h3>
					<?php
					if (defined('PUSH_NOTIFICATIONS_VAPID_PUBLIC_KEY')) {
					?>
					<p id="notificationsText">Checking for push notification subscription...</p>
					<button type="button" class="profile-element" id="notificationsToggle" disabled>Please wait...</button>
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
