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
<div id='loginBox' class='loginBoxContainer' style="display:none;">
        <div id='login' class='loginBox' style="display:"> <!-- Initial login screen display -->
            <div class="loginBoxheader">
                <h3>Login</h3>
                <div class="cursorPointer" onclick="history.back();">x</div>
            </div>
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
                                        <label class='text forgotPw' onclick='contribution_toggleloginnewpass();' title='Retrieve a new password'>Forgot Password?</label>
                                    </td>
                                </tr>
                                <tr class="loginboxTr">
                                    <td>
                                        <input id="loginBox_button" type='button' class='buttonLoginBox' onclick="contribution_loginGitOrUser_Check();" value='Login' title='Login'>
                                    </td>
                                </tr>
                                <tr class="loginboxTr">
                                    <!-- Message displayed when using wrong password or username -->
                                    <td id="message";></td>
                                </tr>
                        </table>
                </div>
        </div> 


	<!-- Login Box End! -->

    <!-- I forgor password Box Start! -->

    <div id='newpassword' class='newpassword' style="display:none"> <!-- forgor pass screen display -->
			<div class='loginBoxheader'>
				<h3> Reset Password</h3>
				<div class="cursorPointer" onclick="history.back();" title="Close window">x</div>
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
                                <input id="newpassword_button" type='button' class='buttonLoginBox' onclick="console.log('reset pass not implemented');" value='Continue' style='margin-top: 10px;' title='Continue'>
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
					<label class='forgotPw' onclick='contribution_resetLoginStatus();' style='margin-left: 18px; font-size: 13px;'>Back to login</label>
				</td>
			</tr>
	</div>

    <!-- I forgor password Box End! -->

    <!-- User exists login start -->

    <div id='UserExistslogin' class='loginBox' style="display:none"> <!-- Initial login screen display -->
            <div class="loginBoxheader">
                <h3>Login</h3>
                <div class="cursorPointer" onclick="history.back();">x</div>
            </div>
                <div > 
                        <table class="loginBoxTable">
                            
                                <tr class="loginboxTr">
                                    <td>
                                        <label id="UserExistslogin_loginBoxTitle">Sign in</label>
                                    </td>
                                </tr>
                                <tr  class="loginboxTr">
                                    <td>
                                        <input id="UserExistslogin_username" placeholder="Github Username" class='form-control textinput' type='text' autofocus disabled style=' opacity:0.6; width: 260px; height: 35px; margin: 8px 0; border: 1px solid #a3a3a3;'>
                                    </td>
                                </tr>
                                <tr class="loginboxTr">
                                    <td>
                                        <input id="UserExistslogin_password" placeholder="Password" class='form-control textinput' type='password' style='width: 260px; height: 35px; margin: 8px 0; border: 1px solid #a3a3a3;'>
                                    </td>
                                </tr>
                                <tr class="loginboxTr">
                                    <td class="nowrap">
                                        <label class='text forgotPw' onclick='contribution_toggleloginnewpass();' title='Retrieve a new password'>Forgot Password?</label>
                                    </td>
                                </tr>
                                <tr class="loginboxTr">
                                    <td>
                                        <input id="UserExistslogin_button" type='button' class='buttonLoginBox' onclick="contribution_git_processLogin();" value='Login' title='Login'>
                                    </td>
                                </tr>
                                <tr class="loginboxTr">
                                    <!-- Message displayed when using wrong password or username -->
                                    <td id="UserExistslogin_message";></td>
                                </tr>
                        </table>
                </div>
            <tr>
				<td>
					<label class='forgotPw' onclick='contribution_resetLoginStatus();' style='margin-left: 18px; font-size: 13px;'>Back to login</label>
				</td>
			</tr>
        </div>

    <!-- User exists login end -->

    <!-- New git-user creation start -->

    <div id='newGit-UserCreation' class='loginBox' style="display:none"> <!-- Initial login screen display -->
            <div class="loginBoxheader">
                <h3>Login</h3>
                <div class="cursorPointer" onclick="history.back();">x</div>
            </div>
                <div > 
                        <table class="loginBoxTable">
                                <tr class="loginboxTr">
                                    <td>
                                        <label id="newGit-UserCreation_loginBoxTitle">Create user</label>
                                    </td>
                                </tr>
                                <tr  class="loginboxTr">
                                    <td>
                                        <input id="newGit-UserCreation_username" placeholder="Github Username" class='form-control textinput' type='text' autofocus disabled style='opacity:0.6; width: 260px; height: 35px; margin: 8px 0; border: 1px solid #a3a3a3;'>
                                    </td>
                                </tr>

                                <tr class="loginboxTr">
                                    <td>
                                        <input id="newGit-UserCreation_password1" placeholder="Create new password" class='form-control textinput' type='password' style='width: 260px; height: 35px; margin: 8px 0; border: 1px solid #a3a3a3;'>
                                    </td>
                                </tr>
                                <tr class="loginboxTr">
                                    <td>
                                        <input id="newGit-UserCreation_password2" placeholder="Repeat new password" class='form-control textinput' type='password' style='width: 260px; height: 35px; margin: 8px 0; border: 1px solid #a3a3a3;'>
                                    </td>
                                </tr>

                                <tr class="loginboxTr">
                                    <td class="nowrap">
                                        <label class='text forgotPw' onclick='contribution_toggleloginnewpass();' title='Retrieve a new password'>Forgot Password?</label>
                                    </td>
                                </tr>
                                <tr class="loginboxTr">
                                    <td>
                                        <input id="newGit-UserCreation_button" type='button' class='buttonLoginBox' onclick="contribution_requestGitUserCreation();" value='Create' title='Login'>
                                    </td>
                                </tr>
                                <tr class="loginboxTr">
                                    <!-- Message displayed when using wrong password or username -->
                                    <td id="newGit-UserCreation_message";></td>
                                </tr>
                        </table>
                </div>

            <tr>
				<td>
					<label class='forgotPw' onclick='contribution_resetLoginStatus();' style='margin-left: 18px; font-size: 13px;'>Back to login</label>
				</td>
			</tr>
        </div> 

    <!-- New git-user creation end -->


        

</div>

