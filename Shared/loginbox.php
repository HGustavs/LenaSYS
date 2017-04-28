		<!-- Overlay -->

  <div id="overlay" style="display:none"></div>
  
	<!-- Login Box Start! -->

  <div id='loginBox' class="loginBox" style="display:none">
		<div id='login'>
			<div class='loginBoxheader'>
				<h3>Login</h3>
				<div class="cursorPointer" onclick="closeWindows()">x</div>
			</div>
				<form action="" id="loginForm" method="post">
			  <div class="table-wrap">
				<table>
					<tr>
						<td>
							<label class="text">Username:</label>
						</td>
					</tr>
					<tr>
						<td>

							<input id="username" placeholder="Username" class='form-control textinput' type='text' autofocus >
						</td>
					</tr>
					<tr>
						<td>
							<label class="text">Password:</label>
						</td>
					</tr>
					<tr>
						<td>
							<input id="password" placeholder="Password" class='form-control textinput' type='password' >
						</td>
					</tr>
					<tr>
						<td>
							<input id='saveuserlogin' type='checkbox' value="on">
							<label class="text">Remember me</label>
						</td>
					</tr>
					<tr>
						<td id="message"></td>
					</tr>
					<tr>
						<td>
							<label class='forgotPw' onclick='toggleloginnewpass();'>Forgot password?</label>

						</td>
					</tr>
					<tr>
						<td>
							<input type='button' class='submit-button' onclick="processLogin();" value='Login'>
						</td>
					</tr>
				</table>
			  </div>
				</form>
		</div>
		<div id='newpassword' style="display:none">
			<div class='loginBoxheader' id="passwordid">
				<h3>New Password</h3>
				<div class="cursorPointer" onclick="closeWindows()">x</div>
			</div>
			  <div class="table-wrap">
				<table>
					<tr>
						<td>
							<label class="text">Username:</label>
						</td>
					</tr>
					<tr>
						<td>
							<input id="username" class='form-control textinput' type='text' placeholder="Username" autofocus >
						</td>
					</tr>
	
					<tr>
						<td id="message2"></td>
					</tr>
					<tr>
						<td>
							<input type='button' class='submit-button' onclick="processResetPasswordCheckUsername();" value='Check user'>
							<label class='forgotPw' onclick='toggleloginnewpass();'>Back to login</label>
						</td>
					</tr>
				</table>
			  </div>
		</div>
		<div id='showsecurityquestion' style="display:none">
			<div class='loginBoxheader' id="securityid">
				<h3>New Password</h3>
				<div class="cursorPointer" onclick="closeWindows()">x</div>
			</div>
			  <div class="table-wrap">
				<table>
					<tr>
						<td>
							<label class="text">Your security queston is:</label>
						</td>
					</tr>
					<tr>
						<td>
							<!-- Using a label to show the security question might not be the best idea, the label will be changed using js, but using a label and updating it with js might not be the best approach. -->
							<label id="displaysecurityquestion" class="text">Placeholder question</label>
						</td>
					</tr>
					<tr>
						<td>
							<input id="answer" class='form-control textinput' type='password' placeholder="Answer" autofocus >
						</td>
					</tr>
					<tr>
						<td id="message3"></td>
					</tr>
					<tr>
						<td>
							<input type='button' class='submit-button' onclick="processResetPasswordCheckSecurityAnswer();" value='Check answer'>
							<label class='forgotPw' onclick='toggleloginnewpass();'>Back to login</label>
						</td>
					</tr>
				</table>
			  </div>
		</div>
		<div id='resetcomplete' style="display:none">
			<div class='loginBoxheader' id="completeid">
				<h3>Request complete</h3>
				<div class='cursorPointer' onclick="closeWindows()">x</div>
			</div>
			  <div class="table-wrap">
				<table>
					<tr>
						<td>
							<h4>Your teachers has been notified, your new password should be sent to you soon™.</h4>
						</td>
					</tr>
					<tr>
						<td>
							<h6>You can change your password later in the profile page.</h6>
						</td>
					</tr>
				</table>
			  </div>
		</div>
	</div>
	
	<!-- Login Box End! -->
  <!-- security question notifaction -->

    <div class="loginBox" id="securitynotification" style="display:none;">
         <div class='loginBoxheader'>
          <h3>Choose a challenge question</h3>
          <div class='cursorPointer' onclick="closeWindows(); setSecurityNotifaction('off');">x</div>
        </div>  
        <p id="securitynotificationmessage">You need to choose a challenge question. You can do this by visiting your profile page(clicking your username) or by clicking <a onclick="closeWindows(); setSecurityNotifaction('off');" href='profile.php'>here</a> </p>
    </div>
  <!-- dialogbox -->
  
  <div class="expiremessagebox" style="display:none">
    <div class='loginBoxheader'>
      <h3>Alert</h3>
      <div class='cursorPointer' onclick="closeWindows()">x</div>
    </div>
    <p id="expiremessage">Your session will expire in about 30 minutes.</p>
  </div>
