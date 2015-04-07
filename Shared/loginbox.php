	<!-- Overlay -->

  <div id="overlay" onclick="hideLoginPopup()" style="display:none"></div>
  
	<!-- Login Box Start! -->

  <div id='loginBox' class="loginBox" style="display:none">
		<div id='login'>
			<div class='loginBoxheader'>
				<h3>Login</h3>
				<div onclick="hideLoginPopup()">x</div>
			</div>
			  <div class="table-wrap">
				<table>
					<tr>
						<td>
							<label class="text">Login name:</label>
						</td>
					</tr>
					<tr>
						<td>
							<input id="username" placeholder="Toddler" class='form-control textinput' type='text' autofocus >
						</td>
					</tr>
					<tr>
						<td>
							<label class="text">Password:</label>
						</td>
					</tr>
					<tr>
						<td>
							<input id="password" placeholder="kalleDgreat2" class='form-control textinput' type='password' >
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
							<input type='button' class='submit-button' onclick="processLogin('<?PHP echo $loginvar; ?>');window.location.reload();return false;" value='Login'>
							<label class='forgotPw' onclick='showForgontPw();'>Forgot password?</label>
						</td>
					</tr>
				</table>
			  </div>
		</div>
		<!-- -->
		<div id='login2' style="display:none">
			<div class='loginBoxheader'>
				<h3>Send mail</h3>
				<div onclick="hideLoginPopup()">x</div>
			</div>
			  <div class="table-wrap">
				<table>
					<tr>
						<td>
							<label class="text">Email:</label>
						</td>
					</tr>
					<tr>
						<td>
							<input id="emaaail1" placeholder="kalle@hotmail.com" class='form-control textinput' type='text' autofocus >
						</td>
					</tr>
					<tr>
						<td id="message2"></td>
					</tr>
					<tr>
						<td>
							<input type='button' class='submit-button' onclick="processemailsend()" value='Send'>
							<label class='forgotPw' onclick='showForgontPw();'>Back to login page!</label>
						</td>
					</tr>
				</table>
			  </div>
		</div>
	</div>
	
	<!-- Login Box End! -->
