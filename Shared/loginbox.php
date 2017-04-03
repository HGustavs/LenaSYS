		<!-- Overlay -->

  <div id="overlay" style="display:none"></div>
  
	<!-- Login Box Start! -->

  <div id='loginBox' class="loginBox" style="display:none">
		<div id='login'>
			<div class='loginBoxheader'>
				<h3>Login</h3>
				<div onclick="closeWindows()">x</div>
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

							<input type='button' class='submit-button' onclick="processLogin();" value='Login'>
						
							<!--<label class='forgotPw' onclick='toggleloginnewpass();'>Forgot password?</label>-->

						</td>
					</tr>
				</table>
			  </div>
		</div>
		<div id='newpassword' style="display:none">
			<div class='loginBoxheader' id="passwordid">
				<h3>New Password</h3>
				<div onclick="closeWindows()">x</div>
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
							<input id="email" class='form-control textinput' type='text' placeholder="c13andfi@student.his.se" autofocus >
						</td>
					</tr>
	
					<tr>
						<td id="message2"></td>
					</tr>
					<tr>
						<td>
							<input type='button' class='submit-button' value='Send'>
							<label class='forgotPw' onclick='toggleloginnewpass();'>Log in</label>
						</td>
					</tr>
				</table>
			  </div>
		</div>
	</div>
	
	<!-- Login Box End! -->
