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
				echo "<td align='right' class='butto' onclick='location=\"loginlogout.php\";'><img src='../CodeViewer/icons/Man.svg' /></td>";
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
						echo "<span class='inv'>LenaSYS</span>";
						echo "<table width='100%'><tr><td rowspan='2'><div id='Sectionlist'>";
						echo "<span class='course'>Course Example Organization System</span>";
						
						$querystring="SELECT course.coursename,max(cversion) AS version FROM course LEFT OUTER JOIN section ON course.coursename=section.coursename GROUP BY course.coursename;;";
						$result=mysql_query($querystring);
						if (!$result) err("SQL Query Error: ".mysql_error(),"Database Password Check Error");
						while ($row = mysql_fetch_assoc($result)){
								echo "<span class='bigg'><a href='Sectioned.php?courseid=".$row['coursename']."&vers=".$row['version']."'>".$row['coursename']."</a></span>";
						}	

						echo "</div></td>";
						
						echo "<td align='right' class='butto' onclick='loginbox();'><img src='icons/Man.svg' /></td>";
						echo "</tr><tr><td></td></tr></table>";
						
						echo "<div id='login-box'><div id='login-box-header'><span style='color:fff;font-family:arial;font-weight:bold;font-size:14pt;'>LenaSYS Login</span><div id='login-box-header-closeb' onclick='closeloginbox();'>x</div></div><div id='login-box-content'>";
						echo "<form id='loginform' action='login.php' onsubmit='ajaxlogin(this);' method='post'>";
						echo "<table><tr><td class='td-login'><span class='login-text'>Login name</span></td></tr>";
						echo "<tr><td class='td-login'><input class='input-login' type='text' name='username'></td></tr>";
						echo "<tr><td class='td-login'><span class='login-text'>Password</span></td></tr>";
						echo "<tr><td class='td-login'><input class='input-login' type='password' name='password'></td></tr>";
						echo "<tr><td class='td-login'><input id='login-checkbox' type='checkbox' name='saveuserlogin'><span class='login-text'>Remember me</span></td></tr>";
						echo "<tr><td class='td-login'><input type='submit' id='submit-button' value='Login'>";
						echo "<a id='login-fg-pw' href='#' style='padding-left:10px;'>Forgot password</a></td></tr>";
						echo "</table></form>";
						echo "</div></div>";			
		}
?>
