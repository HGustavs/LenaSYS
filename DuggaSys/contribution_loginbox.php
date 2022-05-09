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

    .loginPass {
		animation: loginPass 2s;
		animation-iteration-count:2;
	}
	@keyframes loginPass {
		0% {
			background-color: rgba(255,255,255,1);
		}
		25% {
			background-color: rgba(77, 163, 62, 0.2);
		}
		50% {
			background-color: rgba(255,255,255,1);
		}
		75% {
			background-color: rgba(77, 163, 62, 0.2);
		}
		100% {
			background-color: rgba(255,255,255,1);
		}
	}

</style>

<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">

<div id="overlay" style="display:none"></div>

	<!-- Login Box Start! -->
<div id='loginBox' class='loginBoxContainer' style="display:flex;">
        <div id='login' class='loginBox' style="display:"> <!-- Initial login screen display -->
            <div class="loginBoxheader">
                <h3>Login</h3>
                <div class="cursorPointer" onclick="history.back();">x</div>
            </div>
            <form action="" id="loginForm">
                <div > 
                    <table class="loginBoxTable">
                        
                            <tr class="loginboxTr">
                                <td>
                                    <label id="loginBoxTitle">Sign in</label>
                                </td>
                            </tr>
                            <tr  class="loginboxTr">
                                <td>
                                    <input id="username" placeholder="Github Username" class='form-control textinput' type='text' autofocus  style='width: 260px; height: 35px; margin: 8px 0; border: 1px solid #a3a3a3;'>
                                </td>
                            </tr>
                            <tr class="loginboxTr">
                                <td class="nowrap">
                                    <label class='text forgotPw' onclick='git_toggleloginnewpass();' title='Retrieve a new password'>Forgot Password?</label>
                                </td>
                            </tr>
                            <tr class="loginboxTr">
                                <td>
                                    <input type='button' class='buttonLoginBox' onclick="loginGitOrUser_Check();" value='Login' title='Login'>
                                </td>
                            </tr>
                            <tr class="loginboxTr">
                                <!-- Message displayed when using wrong password or username -->
                                <td id="message";></td>
                            </tr>
                       
                    </table>
                </div>
            </form>

        </div> 


	<!-- Login Box End! -->

    <!-- I forgor password Box Start! -->

    <div id='newpassword' class='newpassword' style="display:"> <!-- forgor pass screen display -->
			<div class='loginBoxheader'>
				<h3> Reset Password</h3>
				<div class="cursorPointer" onclick="closeWindows(); resetLoginStatus();" title="Close window">x</div>
			</div>
			<div style='padding: 20px;'>
				<table class="loginBoxTable">
					<tr>
						<td>
							<label id="loginBoxTitle">Enter your username to request </br> password reset from teacher</label>
						</td>
					</tr>
					<tr class="loginboxTr">
						<td>
							<input id="usernamereset" placeholder="Github Username" class='form-control textinput' type='text' autofocus  style='width: 260px; height: 35px; margin: 8px 0; border: 1px solid #a3a3a3;'>
						</td>
					</tr>
					<tr class="loginboxTr">
						<td>
							<input type='button' class='buttonLoginBox' onclick="processResetPasswordCheckUsername();" value='Continue' style='margin-top: 10px;' title='Continue'>
						</td>
					</tr>
					<tr class="loginboxTr">
						<!-- Message displayed when using wrong password or username -->
						<td id="message2";></td>
					</tr>
				</table>
			</div>
			<tr>
				<td>
					<label class='forgotPw' onclick='resetLoginStatus();' style='margin-left: 18px; font-size: 13px;'>Back to login</label>
				</td>
			</tr>
	</div>

    <!-- I forgor password Box End! -->

    <!-- User exists login start -->

    <div id='login' class='loginBox' style="display:"> <!-- Initial login screen display -->
            <div class="loginBoxheader">
                <h3>Login</h3>
                <div class="cursorPointer" onclick="history.back();">x</div>
            </div>
            <form action="" id="loginForm">
                <div > 
                    <table class="loginBoxTable">
                        
                            <tr class="loginboxTr">
                                <td>
                                    <label id="loginBoxTitle">Sign in</label>
                                </td>
                            </tr>
                            <tr  class="loginboxTr">
                                <td>
                                    <input id="username" placeholder="Github Username" class='form-control textinput' type='text' autofocus  style='width: 260px; height: 35px; margin: 8px 0; border: 1px solid #a3a3a3;'>
                                </td>
                            </tr>
                            <tr class="loginboxTr">
                                <td>
                                    <input id="password" placeholder="Password" class='form-control textinput' type='password' style='width: 260px; height: 35px; margin: 8px 0; border: 1px solid #a3a3a3;'>
                                </td>
                            </tr>
                            <tr class="loginboxTr">
                                <td class="nowrap">
                                    <label class='text forgotPw' onclick='git_toggleloginnewpass();' title='Retrieve a new password'>Forgot Password?</label>
                                </td>
                            </tr>
                            <tr class="loginboxTr">
                                <td>
                                    <input type='button' class='buttonLoginBox' onclick="loginGitOrUser_Check();" value='Login' title='Login'>
                                </td>
                            </tr>
                            <tr class="loginboxTr">
                                <!-- Message displayed when using wrong password or username -->
                                <td id="message";></td>
                            </tr>
                       
                    </table>
                </div>
            </form>
            <tr>
				<td>
					<label class='forgotPw' onclick='resetLoginStatus();' style='margin-left: 18px; font-size: 13px;'>Back to login</label>
				</td>
			</tr>
        </div>

    <!-- User exists login end -->

    <!-- New git-user creation start -->

    <div id='login' class='loginBox' style="display:"> <!-- Initial login screen display -->
            <div class="loginBoxheader">
                <h3>Login</h3>
                <div class="cursorPointer" onclick="history.back();">x</div>
            </div>
            <form action="" id="loginForm">
                <div > 
                    <table class="loginBoxTable">
                        
                            <tr class="loginboxTr">
                                <td>
                                    <label id="loginBoxTitle">Sign in</label>
                                </td>
                            </tr>
                            <tr  class="loginboxTr">
                                <td>
                                    <input id="username" placeholder="Github Username" class='form-control textinput' type='text' autofocus  style='width: 260px; height: 35px; margin: 8px 0; border: 1px solid #a3a3a3;'>
                                </td>
                            </tr>

                            <tr class="loginboxTr">
                                <td>
                                    <input id="password" placeholder="Create new password" class='form-control textinput' type='password' style='width: 260px; height: 35px; margin: 8px 0; border: 1px solid #a3a3a3;'>
                                </td>
                            </tr>
                            <tr class="loginboxTr">
                                <td>
                                    <input id="password" placeholder="Repeat new password" class='form-control textinput' type='password' style='width: 260px; height: 35px; margin: 8px 0; border: 1px solid #a3a3a3;'>
                                </td>
                            </tr>

                            <tr class="loginboxTr">
                                <td class="nowrap">
                                    <label class='text forgotPw' onclick='git_toggleloginnewpass();' title='Retrieve a new password'>Forgot Password?</label>
                                </td>
                            </tr>
                            <tr class="loginboxTr">
                                <td>
                                    <input type='button' class='buttonLoginBox' onclick="loginGitOrUser_Check();" value='Login' title='Login'>
                                </td>
                            </tr>
                            <tr class="loginboxTr">
                                <!-- Message displayed when using wrong password or username -->
                                <td id="message";></td>
                            </tr>
                       
                    </table>
                </div>
            </form>

            <tr>
				<td>
					<label class='forgotPw' onclick='resetLoginStatus();' style='margin-left: 18px; font-size: 13px;'>Back to login</label>
				</td>
			</tr>
        </div> 

    <!-- New git-user creation end -->


        

</div>

