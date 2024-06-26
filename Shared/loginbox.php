<style>	
	.loginFail {
		animation: loginFail 2s;
		animation-iteration-count:2;
	}
	@keyframes loginFail {
		0% {
			background-color: rgba(255,255,255,1);
		}
		25% {
			background-color: rgba(255, 0, 6, 0.2);
		}
		50% {
			background-color: rgba(255,255,255,1);
		}
		75% {
			background-color: rgba(255, 0, 6, 0.2);
		}
		100% {
			background-color: rgba(255,255,255,1);
		}
	}
</style>
		<!-- Overlay -->

  <div id="overlay" style="display:none"></div>

	<!-- Login Box Start! -->
  <!--  <div id='loginBox' class="formBox" style="display:none;display:flex;justify-content:center;align-items:center;">-->
    <div id='formBox' class="loginBoxContainer" style="display:none;">
		<div id='login' class="formBox DarkModeBackgrounds DarkModeText">
			<div class='formBoxHeader'>
				<h3>Login</h3>
				<div class="cursorPointer" onclick="closeWindows()" title="Close window">x</div>
			</div>
			<form action="" id="loginForm" method="post">
				<div class="loginBoxTable">
					<div class="loginboxTr">
						<div>
							<input id="username" placeholder="Username" class='form-control textinput' type='text' autofocus style='width: 260px; height: 35px; margin: 8px 0; border: 1px solid #a3a3a3;'>
						</div>
					</div>
					<div class="loginboxTr">
						<div>
							<input id="password" placeholder="Password" class='form-control textinput' type='password' style='width: 260px; height: 35px; margin: 8px 0; border: 1px solid #a3a3a3;'>
						</div>
					</div>
					<div class="loginboxTr">
						<div class="nowrap">
							<label class='text forgotPw' onclick='toggleloginnewpass();' title='Retrieve a new password'>Forgot Password?</label>
						</div>
					</div>
					<div class="loginboxTr">
						<div>
							<input type='button' class='buttonLoginBox' onclick="processLogin();" value='Login' title='Login'>
						</div>
					</div>
					<div class="loginboxTr">
						<!-- Message displayed when using wrong password or username -->
						<div id="message"></div>
					</div>
				</div>
			</form>
		</div>
		<div id='newpassword' class='newpassword DarkModeBackgrounds DarkModeText' style="display:none">
			<div class='formBoxHeader'>
				<h3> Reset Password</h3>
				<div class="cursorPointer" onclick="closeWindows(); resetLoginStatus();" title="Close window">x</div>
			</div>
			<div style='padding: 20px;'>
				<div class="loginBoxTable">
					<div>
						<label id="loginBoxTitle">Enter your username to reset the password</label>
					</div>
					<div class="loginboxTr">
						<div>
							<input id="usernamereset" placeholder="Username" class='form-control textinput' type='text' autofocus style='width: 260px; height: 35px; margin: 8px 0; border: 1px solid #a3a3a3;'>
						</div>
					</div>
					<div class="loginboxTr">
						<div>
							<input type='button' class='buttonLoginBox' onclick="processResetPasswordCheckUsername();" value='Continue' style='margin-top: 10px;' title='Continue'>
						</div>
					</div>
					<div class="loginboxTr">
						<!-- Message displayed when using wrong password or username -->
						<div id="message2"></div>
					</div>
				</div>
			</div>
			<div>
            	<label class='forgotPw' onclick='resetLoginStatus();' style='margin-left: 18px; font-size: 13px;'>Back to login</label>
        	</div>
		</div>
		<div id='showsecurityquestion' class='showsecurityquestion' style="display:none">
			<div class='formBoxHeader'>
				<h3> Reset Password</h3>
				<div class="cursorPointer" onclick="closeWindows();resetLoginStatus()" title="Close window">x</div>
			</div>
			<div style='padding: 20px;'>
				<div class="loginBoxTable">
					<div>
						<label id="loginBoxTitle">Please answer your security question</label>
					</div>
					<div class="loginboxTr" style='padding-top: 14px;'>
						<div>
							<label style='font-size: 14px;'> Question: </label>
							<label id="displaysecurityquestion" class="text">Placeholder question</label>
						</div>
					</div>
					<div>
						<input id="answer" class='form-control textinput' type='password' placeholder="Answer" autofocus style='width: 260px; height: 35px; margin: 8px 0; border: 1px solid #a3a3a3;'>
					</div>
					<div class="loginboxTr">
						<div>
							<input type='button' class='buttonLoginBox' onclick="processResetPasswordCheckSecurityAnswer();" value='Check answer' style='margin-top: 10px;' title='Check answer'>
						</div>
					</div>
					<div>
						<!-- Message displayed when using wrong password or username -->
						<div id="message3"></div>
					</div>
				</div>
			</div>
			<div>
				<label class='forgotPw' onclick='resetLoginStatus();' style='margin-left: 18px; font-size: 13px;'>Back to login</label>
			</div>
		</div>
		<div id='resetcomplete' class='resetcomplete' style="display:none">
			<div class='formBoxHeader' id="completeid">
				<h3>Request complete</h3>
				<div class='cursorPointer' onclick="closeWindows()" title="Close window">x</div>
			</div>
			<div style='padding: 20px;'>
				<div class="loginBoxTable">
					<div>
						<p style='font-size: 0.8em;'>Your teachers have been notified, a new password will be sent to your school email as soon as possible.</p>
						<p style='font-size: 0.8em;'>You can change your password later in the profile page.</p>
					</div>
					<div>
						<input type='button' class='buttonLoginBox' onclick="location.reload();" value='Ok!' style='margin-top: 10px;' title='Ok!'>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- Login Box End! -->

  <!-- Security question notifaction -->
    <div class="formBox" id="securitynotification" style="display:none;">
         <div class='formBoxHeader'>
          <h3>Choose a challenge question</h3>
          <div class='cursorPointer' onclick="closeWindows(); setSecurityNotifaction('off');" title="Close window">x</div>
        </div>
        <p id="securitynotificationmessage">You need to choose a challenge question. You can do this by visiting your profile page (clicking your username) or by clicking <a onclick="closeWindows(); setSecurityNotifaction('off');" href='profile.php'>here</a> </p>
    </div>
  <!-- Security question notification END -->

  <!-- Session expire message -->
  <div class="expiremessagebox" style="display:none">
    <div class='formBoxHeader'>
      <h3>Alert</h3>
      <div class='cursorPointer' onclick="closeWindows()" title="Close window">x</div>
    </div>
    <p id="expiremessage">Your session will expire in about 15 minutes. Refresh session ?</p>
    <input type="button" id="expiremessagebutton" class="submit-button" onclick="closeWindows(); refreshUserSession()" value="Refresh">
  </div>

  <div class="endsessionmessagebox" style="display:none">
    <div class='formBoxHeader'>
      <h3>Alert</h3>
      <div onclick="closeWindows(); reloadPage(); processLogout()">x</div>
    </div>
    <p id="endsessionmessage">Your session has timed out.</p>
    <input type="button" id="endsessionmessagebutton" onclick="closeWindows(); processLogout()" value="OK">
  </div>
  <!-- Session expire message END -->
