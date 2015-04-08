	<!-- Overlay -->

  <div id="overlay" style="display:none"></div>
  
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
							<input id="username" class='form-control textinput' placeholder="Bamsebjorn" type='text' autofocus >
						</td>
					</tr>
					<tr>
						<td>
							<label class="text">Password:</label>
						</td>
					</tr>
					<tr>
						<td>
							<input id="password" class='form-control textinput' placeholder="goran123" type='password' >
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
							<input type='button' class='submit-button' onclick="processLogin('<?PHP echo $loginvar; ?>')" value='Login'>
							<label class='forgotPw' onclick='toggleloginnewpass();'>Forgot password?</label>
						</td>
					</tr>
				</table>
			  </div>
		</div>
		<div id='newpassword' style="display:none">
			<div class='loginBoxheader' id="passwordid">
				<h3>New Password</h3>
				<div onclick="hideLoginPopup()">x</div>
			</div>
			  <div class="table-wrap">
				<table>
					<tr>
						<td>
							<label class="text">email:</label>
						</td>
					</tr>
					<tr>
						<td>
							<input id="email" class='form-control textinput' type='text' placeholder="kalrson@hotmail.com" autofocus >
						</td>
					</tr>
	
					<tr>
						<td id="message"></td>
					</tr>
					<tr>
						<td>
							<input type='button' class='submit-button' onclick="processLogin('<?PHP echo $loginvar; ?>')" value='Send'>
							<label class='forgotPw' onclick='toggleloginnewpass();'>Log in</label>
						</td>
					</tr>
				</table>
			  </div>
		</div>
	</div>
	
	<!-- Login Box End! -->
