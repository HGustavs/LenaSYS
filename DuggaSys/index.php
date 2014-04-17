<!DOCTYPE html>
<html>
	<head>
			<link type="text/css" href="../CodeViewer/css/codeviewer.css" rel="stylesheet" />	
			<link type="text/css" href="../DuggaSys/css/duggasys.css" rel="stylesheet" />	
			<script type="text/javascript" src="../Shared/js/jquery-1.11.0.min.js"></script>
			<script type="text/javascript" src="startpage.js"></script>

<script>
setupLogin();
</script>
	</head>
	<body>
<?php
include_once("../../coursesyspw.php");	
include_once("basic.php");

session_start();
dbConnect();

courselist();
?>			
				<div id="bg" style="display:none; width:100%; height:100%"></div>
					<div id='login-box'>
						<div id='login-box-header' class='box-header'>
							<span style='color:fff;font-family:arial;font-weight:bold;font-size:14pt;'>LenaSYS Login</span>
								<div id='login-box-header-closeb' class='box-header-cbutton' onclick='closeloginbox();'>x</div>
						</div>
						<div id='login-box-content'>
							<form id='loginform' action='login.php' method='post'>
								<table><tr><td class='td-login'><span class='login-text'>Login name</span></td></tr>
									<tr><td class='td-login'><input class='input-login' type='text' name='username'></td></tr>
									<tr><td class='td-login'><span class='login-text'>Password</span></td></tr>
									<tr><td class='td-login'><input class='input-login' type='password' name='password'></td></tr>
									<tr><td class='td-login'><input id='login-checkbox' type='checkbox' name='saveuserlogin'>
										<span class='login-text'>Remember me</span></td></tr>
									<tr><td class='td-login'><input type='submit' class='submit-button' value='Login'>
									<span id='login-fg-pw' onclick='showForgotPasswBox();' style='padding-left:10px;'>Forgot password</span></td></tr>
								</table>
							</form>
						</div>
					 </div>

					 <div id='forgot-passw-box'>
						<div id='forgot-passw-box-header' class='box-header'>
							<span style='color:fff;font-family:arial;font-weight:bold;font-size:14pt;'>Forgot Password</span>
							<div id='forgot-passw-box-header-closeb' class='box-header-cbutton' onclick='closeforgotpwbox()'>x</div>
							<div id='forgot-password-box-content'>
								<form method='post' id="recoverform">
									<table>
										<tr><td class='td-login'><span class='login-text'>Login name</span></td></tr>
										<tr><td class='td-login'><input class='input-login' type='text' name='username'></td></tr>
										<tr><td class='td-login'><input type='submit' class='submit-button' value='Next'></td></tr>
									</table>
								</form>
							</div>
						</div>
					 </div>

					<div id='answer-box'>
						<div id='answer-box-header' class='box-header'>
							<span style='color:fff;font-family:arial;font-weight:bold;font-size:14pt;'>Forgot Password</span>
							<div id='answer-box-header-closeb' class='box-header-cbutton' onclick='closeanswerbox()'>x</div>
							<div id='answer-box-content'>
								<form method='post' id="answerform">
									<input type="hidden" name="user" value="">
									<table>
										<tr><td class='td-login'><span class='login-text' id="recoverquestion"></span></td></tr>
										<tr><td class='td-login'><input class='input-login' type='text' name='answer' placeholder='Answer'></td></tr>
										<tr><td class='td-login'><span class='login-text'>New password</span></td></tr>
										<tr><td class='td-login'><input class='input-login' type='password' name='newpassword'></td></tr>
										<tr><td class='td-login'><input type='submit' class='submit-button' value='Next'></td></tr>
									</table>
								</form>
							</div>
						</div>
					</div>
			</body>
</html>
