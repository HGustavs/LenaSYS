<?php
include_once(dirname(__FILE__) . "/../../Shared/sessions.php");
session_start();
if(checklogin()) {
?>

	<div id='create'>
		<form role="form" name='newPassword'>
			<div class='form-group'>
				<label>Current password:
					<input type="password" name="currentpassword" class="form-control">
				</label>
			</div>
			<div class='form-group'>
				<label>New password:
					<input type="password" name="password" class="form-control">
				</label>
				<label>Repeat password:
					<input type="password" name="password2" class="form-control">
				</label>
			</div>
			<button type='button' onclick="noticeBox('Confirm password change', 'Are you sure you want to change password?', 0, submitNewPassword)" class='default'>Save password</button>

		</form>
	</div>
	<script type="text/javascript" src="js/ajax.js"></script>
	<script type="text/javascript" src="js/verificationFunctions.js"></script>
	<script type="text/javascript">page.title("Change password");</script>
<?php
} else {
?>
	<div id="create">
		You are not logged in.
	</div>
<?php
}
