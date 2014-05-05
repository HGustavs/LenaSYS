<!-- Login START -->
<head>
<style>



</style>
</head>
<div id='login'>
	<div class='header'>
		<h3>Login</h3>
		<div onclick="createDeleteLogin()">x</div>
	</div>
	  <div class="table-wrap">
		<table>
			<tr>
				<td>
					<lable class="text">Login name</lable>
				</td>
			</tr>
			<tr>
				<td>
					<input class='form-control textinput' type='text' onchange="checkIfEmpty(this)" name='username'>
				</td>
			</tr>
			<tr>
				<td>
					<lable class="text">Password</lable>
				</td>
			</tr>
			<tr>
				<td>
					<input class='form-control textinput' type='password' onchange="checkIfEmpty(this)" name='password'>
				</td>
			</tr>
			<tr>
				<td>
					<input id='login-checkbox' type='checkbox' name='saveuserlogin'>
					<lable class="text">Remember me</lable>
				</td>
			</tr>
			
			<tr>
				<td>
					<input type='button' class='btn btn-login' onclick="makeLogin()" value='Login'>
					<lable class='forgotPw' onclick='showForgontPw();'>Forgot password?</lable>
				</td>
			</tr>
			<!--
			<tr>
				<td>
					<input type='button' class='btn btn-success btn-forgot' onclick="makeLogin()" value='Forgot password?'>
				</td>
			</tr>
			-->
		</table>
	  </div>
</div>
<!-- Login END -->

<!-- Forgot Password START -->
<div id='forgotPw' class="hide">
	<div class='header'>
		<h3>Forgot password</h3>
		<div onclick="createDeleteLogin()">x</div>
	</div>
	  <div class="table-wrap">
		<table>
			<tr>
				<td>
					<lable class='text'>Login name</lable>
				</td>
			</tr>
			<tr>
				<td>
					<input class='form-control textinput' type='text' onchange="checkIfEmpty(this)" name='username'>
				</td>
			</tr>
			<tr>
				<td>
					<input type='button' onclick='showForgotPwAnswer(validate("forgotPw"));' class='btn btn-login btn-next' value='Next'>
					<input type='button' onclick='showLogin();' class='btn btn-forgot btn-cancel' value='back'>
				</td>
			</tr>
		</table>
	  </div>
</div>
<!-- Forgot Password END -->

<!-- Forgot Password Question START -->
<div id='forgotPwAnswer' class="hide">
	<div class='header'>
		<h3>Forgot password</h3>
		<div onclick="createDeleteLogin()">x</div>
	</div>
	 <div class="table-wrap">
		<table>
			<tr>
				<td>
					<lable class='text'>Answer</lable>
				</td>
			</tr>
			<tr>
				<td>
					<input class='form-control textinput' type='text' name='answer'>
				</td>
			</tr>
			<tr>
				<td>
					<lable class='text'>New password</lable>
				</td>
			</tr>
			<tr>
				<td>
					<input class='form-control textinput' type='password' name='newpassword'>
				</td>
			</tr>
			<tr>
				<td>
					<input type='button' class='btn btn-login btn-next' value='Submit'>
					<input type='button' onclick='showForgontPw();' class='btn btn-login btn-cancel' value='Back'>
				</td>
			</tr>
		</table>
	  </div>
</div>
<!-- Forgot Password Question END -->