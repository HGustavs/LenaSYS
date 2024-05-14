<?php 
    include_once "../Shared/toast.php";
?>

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

<!-- To enable dark mode, these 3 files were added. -->
<link type="text/css" href="../Shared/css/style.css" rel="stylesheet"> 
<link id="themeBlack" type="text/css" href="../Shared/css/blackTheme.css" rel="stylesheet">
<script src="darkmodeToggle.js"></script>

<script src="contribution_loginbox.js"></script> <!-- scripts to implement functions -->


<div id="overlay" style="display:none"></div>

	<!-- Login Box Start! -->
<div id='formBox' class='loginBoxContainer' style="display:none;">
        <div id='login' class='formBox' style="display:"> <!-- Initial login screen display -->
            <div class="formBoxHeader">
                <h3>Login</h3>
                <div class="cursorPointer" onclick="contribution_closeLogin();">x</div>
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

    <!-- I forgor password Box removed by issue#11820 -->

    <!-- User exists login start -->

    <div id='UserExistslogin' class='formBox' style="display:none"> <!-- Initial login screen display -->
            <div class="formBoxHeader">
                <h3>Login</h3>
                <div class="cursorPointer" onclick="contribution_closeLogin();">x</div>
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

    <div id='newGit-UserCreation' class='formBox' style="display:none"> <!-- Initial login screen display -->
            <div class="formBoxHeader">
                <h3>Login</h3>
                <div class="cursorPointer" onclick="contribution_closeLogin();">x</div>
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

<div id='git_logoutBox' class="logoutBoxContainer" style="display: none">
	<div id='git_logout' class="logoutBox DarkModeBackgrounds DarkModeText">
		<div class='logoutBoxheader'>
			<h3>Sign out</h3>
			<div class="cursorPointer" onclick="$('#git_logoutBox').hide();" title="Close window">x</div>
		</div>
		<form action="" id="git_logoutForm" method="post">
			<div>
				<p>Are you sure you want to log out?</p>
			</div>
			<table class="logoutBoxTable">
				<tr class="logoutboxTr">
					<td>
						<input type='button' class='buttonLogoutBox' onclick='git_logout();' value='Log out' title='Log out'>
					</td>
					<td>
						<input type='button' class='buttonLogoutBox buttonLogoutCancelBox' onclick="$('#git_logoutBox').hide();" value='Cancel' title='CancelLogout'>
					</td>						
				</tr>
			</table>
		</form>
	</div>
</div>