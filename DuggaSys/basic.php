<?php
include_once "../Shared/basic.php";
	//---------------------------------------------------------------------------------------------------------------
	// editsectionmenu - Displays an editable or un-editable section menu
	//---------------------------------------------------------------------------------------------------------------

		function editsectionmenu($kind)
		{
				echo "<body onload='AJAXServiceSection(\"\",\"\");'>";
	
				// Course Content List - If course exists!
				echo "<table width='100%'><tr><td rowspan='2'><div id='Sectionlist'>";
				echo "<div style='left:20px' class='warning'>";
				echo "Please wait while content loads<br/>";
				echo "<img src='../CodeViewer/icons/Starspinner3.gif' /><br/>";
				echo "Do not forget to enable Javascript<br/>";
				echo "</div>";
				echo "</div></td>";

				// Login log out button

				echo "<td align='right' valign='top'>";
				echo "<table cellspacing='2'><tr>";
				if($kind){
						echo "<td class='buttos' onclick='newSection(\"1\");'><img src='../CodeViewer/icons/Plus.svg' /></td>";
						echo "<td class='buttos' onclick='newSection(\"2\");'><img src='../CodeViewer/icons/Bold.svg' /></td>";
				}
				if(checklogin()) {
					echo "<td align='right' class='butto' onclick='location=\"logout.php\"'><img src='../CodeViewer/icons/Man.svg' /></td>";
				} else {
					echo "<td align='right' class='butto' onclick='loginbox()'><img src='../CodeViewer/icons/Man.svg' /></td>";
				}
				echo "</tr></table>";

				echo "</tr><tr><td></td></tr></table>";

				echo "</body>";
				echo "</html>";		

		}

	//---------------------------------------------------------------------------------------------------------------
	// courselist - Displays a list of the current courses
	//---------------------------------------------------------------------------------------------------------------
		
		function courselist()
		{		
					?>
						<span class='inv'>LenaSYS</span>
						<table width='100%'>
							<tr>
								<td rowspan='2'>
									<div id='Sectionlist'>
										<span class='course'>Course Example Organization System</span>
										<?php
											$querystring="SELECT course.coursename,max(cversion) AS version FROM course LEFT OUTER JOIN section ON course.coursename=section.coursename GROUP BY course.coursename";
											$result=mysql_query($querystring);
											if (!$result) err("SQL Query Error: ".mysql_error(),"Database Password Check Error");
											while ($row = mysql_fetch_assoc($result)){
													echo "<span class='bigg'><a href='Sectioned.php?courseid=".$row['coursename']."&vers=".$row['version']."'>".$row['coursename']."</a></span>";
											}	
										?>

									</div>
								</td>
								<?php if(checklogin()) { ?>
								<td align='right' class='butto' onclick='location="logout.php"'>
								<?php } else { ?>
								<td align='right' class='butto' onclick='loginbox();'>
								<?php } ?>
									<img src='../CodeViewer/icons/Man.svg' />
								</td>
							</tr>
							<tr>
								<td></td>
							</tr>
						</table>
					<?php
		}

		function loginwins()
		{
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
<?php
			}
?>
