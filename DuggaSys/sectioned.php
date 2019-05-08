

<!DOCTYPE html>
<html>

<head>
	<link rel="icon" type="image/ico" href="../Shared/icons/favicon.ico"/>
	<meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title id="sectionedPageTitle">Section Editor</title>

	<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
	<link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">
	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

	<script src="../Shared/js/jquery-1.11.0.min.js"></script>
	<script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
	<script src="../Shared/dugga.js"></script>
	<script src="sectioned.js"></script>
</head>
<body onload="setup();">

	    <header>
		<table class='navheader'><tr><td class='navButt' id='home' title='Home'><a class='navButt' href='../DuggaSys/courseed.php'><img src='../Shared/icons/Home.svg'></a></td><td class='navButt' id='back' title='Back'><a class='navButt' href='../DuggaSys/courseed.php'><img src='../Shared/icons/Up.svg'></a></td><td id='select' style='display:none;' class='navButt'><span class='dropdown-container' onmouseover='hoverc();' onmouseleave='leavec();'><img class='navButt' src='../Shared/icons/tratt_white.svg'><div id='dropdownc' class='dropdown-list-container' style='z-index: 1'><div id='filterOptions'></div></div></span></td><td id='sort' style='display:none' class='navButt'><span class='dropdown-contain;er' onmouseover='hovers();' onmouseleave='leaves();'><img class='navButt' src='../Shared/icons/sort_white.svg'><div id='dropdowns' class='dropdown-list-container'></div></span></td></td><td id='menuHook' class='navSpacer'><td class='navName'><a id='userName' href='profile.php' title='Toddler&#39;s profile'>Toddler</a></td><td id='loginbutton' class='loggedin'><img id='loginbuttonIcon' src='../Shared/icons/logout_button.svg' title='Logout'/></td></tr></table><div id='cookiemsg' class='alertmsg'><p>This site uses cookies. By continuing to browse this page you accept the use of cookies.</p><input type='button' value='OK' class='submit-button' onclick='cookieMessage()' style='margin-top: 0px'/></div></header>
<script type="text/javascript">
		if(localStorage.getItem("cookieMessage")=="off"){
			$("#cookiemsg").css("display", "none");
		}else{
			$("#cookiemsg").css("display", "flex");
		}

	setupLoginLogoutButton('true');
	function cookieMessage(){
		hideCookieMessage();
		localStorage.setItem("cookieMessage", "off");
		//$("#cookiemsg").css("display", "none");
	}
	function hoverBack(){
		$(".dropdown-list-container").css("display", "none");
	}
</script>
<script type="text/javascript">
	(function(proxied) {
		window.alert = function() {
			return proxied.apply(this, arguments);
		};
	})(window.alert);
</script>

	<!-- content START -->
	<div id="content">

		<div id='TopMenuStatic' style="display:none;">

			<table class='navheader' style='overflow: hidden; table-layout: fixed;'>
				<tr class='trsize nowrap'>
					<td style='display: inline-block;'>
						<div class='course-dropdown-div'>
								<select id="courseDropdownTop" class='course-dropdown' onchange='goToVersion(this.id)' >
								</select>
						</div>
					</td>
					<td class='editVers' style='display: inline-block;'>
						<div class='editVers menuButton'>
								<button type='button' class='submit-button no-radius' style='width:35px;margin-left:0px' title='Edit the selected version' onclick='showEditVersion();'>
									<img id='versionCog' style='margin-top:6px' src='../Shared/icons/CogwheelWhite.svg'>
								</button>
						</div>
					</td>
					<td class='newVers' style='display: inline-block;'>
						<div class='newVers menuButton'>
							<button type='button' value='New version' style='width:35px; margin-left:0px;border-top-right-radius:3px; border-bottom-right-radius:3px;' class='submit-button no-radius' title='Create a new version of this course' onclick='showCreateVersion();' >
								<img id='versionPlus' style='margin-top:6px' src='../Shared/icons/PlusS.svg'>
							</button>
						</div>
					</td>
					<td class='hamburger hamburgerClickable'>
						<div tabindex='0' class='package'>
							<div id='hamburgerIcon' class='submit-button hamburger' onclick='hamburgerChange();bigMac();' >
								<div class='container'>
									<div class='bar1'></div>
									<div class='bar2'></div>
									<div class='bar3'></div>
								</div>
							</div>
						</div>
						<div class='hamburgerMenu'>
							<ul class='hamburgerList'>
								<li class='results'>
									<button class='submit-button menuButton results' onclick='closeWindows(); navigatePage("resulted.php");' title='Edit student results'>Results</button>
								</li>
								<li class='tests'>
										<button class='submit-button menuButton tests' onclick='closeWindows(); navigatePage("duggaed.php");' title='Show tests'>Tests</button>
								</li>
								<li class='files'>
										<button class='submit-button menuButton files' onclick='closeWindows(); navigatePage("fileed.php");' title='Show files'>Files</button>
								</li>
								<li class='access'>
										<button class='submit-button menuButton access' onclick='closeWindows(); navigatePage("accessed.php");' title='Give students access to the selected version'>Access</button>
								</li>
							</ul>
						</div>
					</td>

					<td class='results menuButton' style='display: inline-block;'>
						<div class='results menuButton'>
							<a id='resultsBTN' href='' onclick='navigatePage(this.id, "resulted.php");' oncontextmenu='javascript:navigatePage(this.id, "resulted.php");'><input type='button' value='Results' class='submit-button' title='Edit student results' /></a>
						</div>
					</td>
					<td class='tests menuButton' style='display: inline-block;'>
						<div class='tests menuButton'>
							<a id='testsBTN' href='' onclick='navigatePage(this.id, "duggaed.php");' oncontextmenu='javascript:navigatePage(this.id, "duggaed.php");'><input type='button' value='Tests' class='submit-button' id='testbutton' title='Show tests' /></a>
						</div>
					</td>
					<td class='files menuButton' style='display: inline-block;'>
						<div class='files menuButton'>
						<a id='filesBTN' href='' onclick='navigatePage(this.id, "fileed.php");' oncontextmenu='javascript:navigatePage(this.id, "fileed.php");'><input type='button' value='Files' class='submit-button' title='Show files'/></a>

						</div>
					</td>
					<td class='access menuButton' style='display: inline-block;'>
						<div class='access menuButton'>
						<a id='accessBTN' href='' onclick='navigatePage(this.id, "accessed.php");' oncontextmenu='javascript:navigatePage(this.id, "accessed.php");'><input type='button' value='Access' class='submit-button' title='Give students access to the selected version'/></a>
						</div>
					</td>
				</tr>

			</table>

		</div>
		<!-- Static Top Menu END -->

		<!-- FAB Start -->
		<div class='fixed-action-button sectioned' id="FABStatic" style="display:none">
				<a class='btn-floating fab-btn-lg noselect' id='fabBtn'>+</a>
				<ol class='fab-btn-list' style='margin: 0; padding: 0; display: none;' reversed>
						<li><a class='btn-floating fab-btn-sm scale-transition scale-out' data-tooltip='Heading' onclick='createFABItem("0","New Heading");'><img class='fab-icon' src='../Shared/icons/heading-icon.svg'></a></li>
						<li><a class='btn-floating fab-btn-sm scale-transition scale-out' data-tooltip='Section' onclick='createFABItem("1","New Section");'><img class='fab-icon' src='../Shared/icons/section-icon.svg'></a></li>
						<li><a class='btn-floating fab-btn-sm scale-transition scale-out' data-tooltip='Moment' onclick='createFABItem("4","New Moment");'><img class='fab-icon' src='../Shared/icons/moment-icon.svg'></a></li>
						<li><a class='btn-floating fab-btn-sm scale-transition scale-out' data-tooltip='Test' onclick='createFABItem("3","New Test");'><img class='fab-icon' src='../Shared/icons/test-icon.svg'></a></li>
						<li><a class='btn-floating fab-btn-sm scale-transition scale-out noselect' data-tooltip='Link' onclick='createFABItem("5","New Link");'><i class='material-icons'>link</i></a></li>
						<li><a class='btn-floating fab-btn-sm scale-transition scale-out' data-tooltip='Code' onclick='createFABItem("2","New Code");'><img class='fab-icon' src='../Shared/icons/code-icon.svg'></a></li>
						<li><a class='btn-floating fab-btn-sm scale-transition scale-out' data-tooltip='Group activity' onclick='createFABItem("6","New Group");'><img class='fab-icon' src='../Shared/icons/group-icon.svg'></a></li>
						<li><a class='btn-floating fab-btn-sm scale-transition scale-out noselect' data-tooltip='Message' onclick='createFABItem("7","New Quote");'><i class='material-icons'>format_quote</i></a></li>
				</ol>
		</div>

		<!-- FAB END -->

		<!-- + button --->

		<div id='Sectionlist'>

		<div class='course' style='display:flex; align-items:center; justify-content:flex-end;'>
				<div style='flex-grow:1'>
						<span id='course-coursename' class='nowrap ellipsis' style='margin-left: 90px;margin-right:10px;' title='"+data.coursename+" "+data.coursecode+" "+versionname+"'>UNK</span>
						<span id='course-coursecode' style='margin-right:10px;'>UNK</span>
						<span id='course-versname' class='courseVersionField'>UNK</span>
				</div>

				<div id='course-newitem' style='display: flex;'>
						<input id='addElement' style="display:none;" type='button' value='+' class='submit-button-newitem' title='New Item' onclick='createQuickItem();'>
				</div>
				<!-- test #1 -->

				<div id='course-coursevers' style='display:none; margin-right:10px;' >UNK</div>
				<div id='course-courseid' style='display:none; margin-right:10px;' >UNK</div>

		</div>

		<!-- + button END -->

		<div id='courseList'>

		<!-- Statistics List -->

		<div id='statisticsList' style="">
				<div id='statistics' class='statistics' style='cursor:pointer;'>
						<div style='margin:10px;'>
								<img src='../Shared/icons/right_complement.svg' id='arrowStatisticsOpen'>
								<img src='../Shared/icons/desc_complement.svg' id='arrowStatisticsClosed'>
						</div>
						<div class='nowrap' style='padding-left:5px' title='statistics'>
								<span class='listentries-span noselect' style='writing-mode:vertical-rl;text-orientation: sideways;'>Deadlines</span>
						</div>
				</div>
				<div class='statisticsContent' style='display:flex;flex-direction:column;'>
						<div id='statisticsPie' class='statisticsInnerBox'>
								<svg id="pieChartSVG" width='300px' height='255px' style='padding: 10px; margin: auto;' viewBox="0 0 300 255" xmlns="http://www.w3.org/2000/svg"></svg>
						</div>
						<div id='deadlineInfoBox' class='statisticsInnerBox' style='padding: 10px;'>
								<h3 id='deadlineInfoTitle'>Recent and Upcoming Deadlines</h3>
								<table id="deadlineList" style="table-layout: fixed;width:300px;">
								</table>
						</div>
						<div id='statisticsSwimlanes' class='statisticsInnerBox' style=''>
								<svg id="swimlaneSVG" width='300px' style='padding: 10px; margin: auto;' viewBox="0 0 300 255" xmlns="http://www.w3.org/2000/svg"></svg>
						</div>
						<!--<div style='display:flex;'>
							<canvas id='swimlanesMoments' style='padding:10px;'></canvas>
						</div>
						<div style='width: 350px; overflow-x: auto; white-space: nowrap; display: inline-block; margin: 10px 10px 10px -10px'>
							<canvas id='swimlanesWeeks'></canvas>
						</div>
            -->
				</div>
		</div>
		<!-- Statistics List END-->

		<!-- Section List -->
		<div id='Sectionlisti'>

		</div>
	</div>
	<!-- content END -->

			<!-- Overlay -->

  <div id="overlay" style="display:none"></div>

	<!-- Login Box Start! -->
  <!--  <div id='loginBox' class="loginBox" style="display:none;display:flex;justify-content:center;align-items:center;">-->
    <div id='loginBox' class="loginBoxContainer" style="display:none;">
		<div id='login' class="loginBox">
			<div class='loginBoxheader'>
				<h3>Login</h3>
				<div class="cursorPointer" onclick="closeWindows()" title="Close window">x</div>
			</div>
			<form action="" id="loginForm" method="post">
				<table class="loginBoxTable">
					<tr class="loginboxTr">
						<td>
							<label id="loginBoxTitle">Sign in</label>
						</td>
					</tr>
					<tr  class="loginboxTr">
						<td>
							<input id="username" placeholder="Username" class='form-control textinput' type='text' autofocus  style='width: 260px; height: 35px; margin: 8px 0; border: 1px solid #a3a3a3;'>
						</td>
					</tr>
					<tr class="loginboxTr">
						<td>
							<input id="password" placeholder="Password" class='form-control textinput' type='password' style='width: 260px; height: 35px; margin: 8px 0; border: 1px solid #a3a3a3;'>
						</td>
					</tr>
					<tr class="loginboxTr">
						<td class="nowrap">
							<label class='text forgotPw' onclick='toggleloginnewpass();' title='Retrieve a new password'>Forgot Password?</label>
						</td>
					</tr>
					<tr class="loginboxTr">
						<td>
							<input type='button' class='buttonLoginBox' onclick="processLogin();" value='Login' title='Login'>
						</td>
					</tr>
					<tr class="loginboxTr">
						<!-- Message displayed when using wrong password or username -->
						<td id="message";></td>
					</tr>
				</table>
			</form>
		</div>
		<div id='newpassword' class='newpassword' style="display:none">
			<div class='loginBoxheader'>
				<h3> Reset Password</h3>
				<div class="cursorPointer" onclick="closeWindows(); resetLoginStatus();" title="Close window">x</div>
			</div>
			<div style='padding: 20px;'>
				<table class="loginBoxTable">
					<tr>
						<td>
							<label id="loginBoxTitle">Enter your username to reset the password</label>
						</td>
					</tr>
					<tr class="loginboxTr">
						<td>
							<input id="usernamereset" placeholder="Username" class='form-control textinput' type='text' autofocus  style='width: 260px; height: 35px; margin: 8px 0; border: 1px solid #a3a3a3;'>
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
		<div id='showsecurityquestion' class='showsecurityquestion' style="display:none">
			<div class='loginBoxheader'>
				<h3> Reset Password</h3>
				<div class="cursorPointer" onclick="closeWindows();resetLoginStatus()" title="Close window">x</div>
			</div>
			<div style='padding: 20px;'>
				<table class="loginBoxTable">
					<tr>
						<td>
							<label id="loginBoxTitle">Please answer your security question</label>
						</td>
					</tr>
					<tr class="loginboxTr">
						<td style='padding-top: 14px;'>
							<label style='font-size: 14px;'> Question: </label>
							<label id="displaysecurityquestion" class="text">Placeholder question</label>
						</td>
					</tr>
					<tr>
						<td>
							<input id="answer" class='form-control textinput' type='password' placeholder="Answer" autofocus  style='width: 260px; height: 35px; margin: 8px 0; border: 1px solid #a3a3a3;'>
						</td>
					</tr>
					<tr class="loginboxTr">
						<td>
							<input type='button' class='buttonLoginBox' onclick="processResetPasswordCheckSecurityAnswer();" value='Check answer' style='margin-top: 10px;' title='Check answer'>
						</td>
					</tr>

					<tr>
						<!-- Message displayed when using wrong password or username -->
						<td id="message3";></td>
					</tr>
				</table>
			</div>
			<tr>
				<td>
					<label class='forgotPw' onclick='resetLoginStatus();' style='margin-left: 18px; font-size: 13px;'>Back to login</label>
				</td>
			</tr>

		</div>
		<div id='resetcomplete' class='resetcomplete' style="display:none">
			<div class='loginBoxheader' id="completeid">
				<h3>Request complete</h3>
				<div class='cursorPointer' onclick="closeWindows()" title="Close window">x</div>
			</div>
			<div style='padding: 20px;'>
				<table class="loginBoxTable">
					<tr>
						<td>
							<p style='font-size: 0.8em;'>Your teachers have been notified, a new password will be sent to your school email as soon as possible.</p>
							<p style='font-size: 0.8em;'>You can change your password later in the profile page.</p>
						</td>
					</tr>
					<tr>
						<td>
							<input type='button' class='buttonLoginBox' onclick="location.reload();" value='Ok!' style='margin-top: 10px;' title='Ok!'>
						</td>
					</tr>
				</table>
			</div>
		</div>
	</div>
	<!-- Login Box End! -->

  <!-- Security question notifaction -->
    <div class="loginBox" id="securitynotification" style="display:none;">
         <div class='loginBoxheader'>
          <h3>Choose a challenge question</h3>
          <div class='cursorPointer' onclick="closeWindows(); setSecurityNotifaction('off');" title="Close window">x</div>
        </div>
        <p id="securitynotificationmessage">You need to choose a challenge question. You can do this by visiting your profile page (clicking your username) or by clicking <a onclick="closeWindows(); setSecurityNotifaction('off');" href='profile.php'>here</a> </p>
    </div>
  <!-- Security question notification END -->

  <!-- Session expire message -->
  <div class="expiremessagebox" style="display:none">
    <div class='loginBoxheader'>
      <h3>Alert</h3>
      <div class='cursorPointer' onclick="closeWindows()" title="Close window">x</div>
    </div>
    <p id="expiremessage">Your session will expire in about 15 minutes. Refresh session ?</p>
    <input type="button" id="expiremessagebutton" class="submit-button" onclick="closeWindows(); refreshUserSession()" value="Refresh">
  </div>

  <div class="endsessionmessagebox" style="display:none">
    <div class='loginBoxheader'>
      <h3>Alert</h3>
      <div onclick="closeWindows(); reloadPage(); processLogout()">x</div>
    </div>
    <p id="endsessionmessage">Your session has timed out.</p>
    <input type="button" id="endsessionmessagebutton" onclick="closeWindows(); processLogout()" value="OK">
  </div>
  <!-- Session expire message END -->

	<!-- Edit Section Dialog START -->
	<div id='editSection' class='loginBoxContainer' style='display:none;'>
		<div class='loginBox' style='width:460px;'>
			<div class='loginBoxheader'>
				<h3 id='editSectionDialogTitle'>Edit Item</h3>
				<div class='cursorPointer' onclick='closeWindows(); closeSelect();showSaveButton();'>x</div>
			</div>
			<div style='padding:5px;'>
				<input type='hidden' id='lid' value='Toddler' />
				<div id='inputwrapper-name' class='inputwrapper'>
					<span>Name:</span>
					<div class="tooltipDugga">
						<span id="tooltipTxt" style="display: none;" class="tooltipDuggatext">Illegal characters found in the title!<br>Valid characters: A-Ö, 0-9, ()</span>
					</div>
					<input type='text' class='textinput' id='sectionname' value='sectionname' maxlength="64"/>
				</div>
				<div id='inputwrapper-type' class='inputwrapper'>
					<span>Type:</span>
					<div class="tooltipDuggaType">
						<span id="tooltipType" style="display: none;" class="tooltipDuggaTypeTxt"></span>
					</div> <!-- If you want to change the names of the spans, make sure that they fit with the dropdown box.
						If they don't, change the width of loginbox select in the CSS file -->
						<select id='type' value='type' onchange='changedType(document.getElementById("type").value);'></select>
					</div>
					<div id='inputwrapper-link' class='inputwrapper'><span>Link:</span><select id='link' ></select></div>
					<div id='inputwrapper-gradesystem' class='inputwrapper'><span>Grade system:</span><select id='gradesys' ></select></div>
					<div id='inputwrapper-tabs' class='inputwrapper'><span>Tabs:</span><select id='tabs' ></select></div>
					<div id='inputwrapper-highscore' class='inputwrapper'><span>High score:</span><select id='highscoremode' ></select></div>
					<div id='inputwrapper-moment' class='inputwrapper'><span>Moment:</span><select id='moment'></select></div>
					<div id='inputwrapper-visibility' class='inputwrapper'><span>Visibility:</span><select style='align:right;' id='visib'></select></div>
					<div id='inputwrapper-group' class='inputwrapper'><span>Group type:</span><select style='align:right;' id='grptype'></select></div>
				</div>

				<!-- Error message, no duggas present-->
				<div style='padding:5px;'>
					<input style='display:none; float:left;' class='submit-button deleteDugga' type='button' value='Delete' onclick='deleteItem();' />
					<input style='display:block; float:left;' class='submit-button closeDugga' type='button' value='Cancel' onclick='closeWindows(); closeSelect();' />
					<input id="submitBtn" style='display:none; float:right;' class='submit-button submitDugga' type='button' value='Submit' onclick='newItem(); showSaveButton();' />
					<input id="saveBtn" style='float:right;' class='submit-button updateDugga' type='button' value='Save' onclick='updateItem();' />
				</div>
			</div>
		</div>
	<!-- Edit Section Dialog END -->

	<!-- Confirm Section Dialog START -->
	<div id='sectionConfirmBox' class='loginBoxContainer' style='display:none;'>
		<div class='loginBox' style='width:460px;'>
			<div class='loginBoxheader'>
					<h3>Confirm deletion</h3>
					<div class="cursorPointer" onclick='confirmBox("closeConfirmBox");' title="Close window">x</div>
			</div>
			<div style='text-align: center;'>
					<h4>Are you sure you want to delete this item?</h4>
			</div>
			<div style='display:flex; align-items:center; justify-content: center;'>
					<input style='margin-right: 5%;' class='submit-button' type='button' value='Yes' title='Yes' onclick='confirmBox("deleteItem");' />
					<input style='margin-left: 5%;' class='submit-button' type='button' value='No' title='No' onclick='confirmBox("closeConfirmBox");' />
			</div>
		</div>
	</div>
	<!-- Confirm Edit Section Dialog END -->

	<!-- Confirm Missing Material Dialog START -->
	<div id='noMaterialConfirmBox' class='loginBoxContainer' style='display:none;'>
		<div class='loginBox' style='width:460px;'>
				<div class='loginBoxheader'>
					<h3>Error: Missing material</h3>
					<div class="cursorPointer" onclick='confirmBox("closeConfirmBox");' title="Close window">x</div>
				</div>
				<div style='text-align: center;'>
					<h4 id="noMaterialText"></h4>
				</div>
				<div style='display:flex; align-items:center; justify-content: center;'>
					<input style='margin-right: 5%;' class='submit-button' type='button' value='OK' title='OK' onclick='confirmBox("closeConfirmBox");'/>
				</div>
		</div>
	</div>
	<!-- Confirm Missing Material Dialog END -->

	<!-- New Version Dialog START -->
	<div id='newCourseVersion' class='loginBoxContainer' style='display:none;'>
    	<div class='loginBox' style='width:464px;'>
			<div class='loginBoxheader'>
				<h3>New Course Version</h3>
				<div class="cursorPointer" onclick='closeWindows();' title="Close window">x</div>
			</div>
			<div style='padding:5px;'>
				<div class='inputwrapper'><span>Version Name:</span><input class='textinput' type='text' id='versname' placeholder='Version Name' /></div>
				<div class='inputwrapper'><span>Version ID:</span><input class='textinput' type='text' id='versid' placeholder='Version ID' maxlength='8'/></div>
				<div class='inputwrapper'><span>Start Date:</span><input class='textinput' type='date' id='startdate' value='' /></div>
				<div class='inputwrapper'><span>End Date:</span><input class='textinput' type='date' id='enddate' value='' /></div>
				<div class='inputwrapper'><span>Change this to default version</span><input type="checkbox" name="makeactive" id="makeactive" value="yes"></div>
				<div class='inputwrapper'><span>Copy content from:</span><select id='copyvers'></select></div>
			</div>
			<div style='padding:5px;'>
				<input class='submit-button' type='button' value='Create' title='Create new version' onclick='createVersion();' />
			</div>
		</div>
	</div>
	<!-- New Verison Dialog END -->

	<!-- Edit Version Dialog START -->
	<div id='editCourseVersion' class='loginBoxContainer' style='display:none;'>
		<div class='loginBox' style='width:464px;'>
			<div class='loginBoxheader'>
				<h3>Edit Course Version</h3>
				<div class='cursorPointer' onclick='closeWindows();'>x</div>
			</div>
			<div style='padding:5px;'>
				<input type='hidden' id='cid' value='Toddler' />
				<div class='inputwrapper'><span>Version ID:</span><input class="greyedout-textinput" disabled type='text' id='eversid' placeholder='Version ID' /></div>
				<div class='inputwrapper'><span>Version Name:</span><input class='textinput' type='text' id='eversname' placeholder='Version Name'/></div>
				<div class='inputwrapper'><span>Start Date:</span><input class='textinput' type='date' id='estartdate' value='' /></div>
				<div class='inputwrapper'><span>End Date:</span><input class='textinput' type='date' id='eenddate' value='' /></div>
				<div class='inputwrapper'><span>Change this to default version</span><input type="checkbox" name="emakeactive" id="emakeactive" value="yes"></div>
			</div>
			<div style='padding:5px;'>
				<input class='submit-button' type='button' value='Save' title='Save changes' onclick='updateVersion();' />
			</div>
		</div>
	</div>
	<!-- Edit Version Dialog END -->

<!-- Group Members Table START -->
<div id='grptblContainer' class='loginBoxContainer' style='display:none;'>
		<div class='loginBox'>
			<div class='loginBoxheader'>
				<h3>Group Members</h3>
				<div class='cursorPointer' onclick='closeWindows();'>x</div>
			</div>
			<div style='padding:5px;'>
				<div id='grptbl'></div>
			</div>
		</div>
	</div>
	<!-- Group Members Table END -->


	<!-- HighscoreBox START -->
	<div id='HighscoreBox' class='loginBoxContainer' style='display:none;'>
		<div class='loginBox' style='width:500px;'>
			<div class='loginBoxheader'>
				<h3>Highscore</h3>
				<div class='cursorPointer' onclick='closeWindows();'>x</div>
			</div>
			<table id ='HighscoreTable' width='100%'>
				<tr></tr>
			</table>
		</div>
	</div>
	<!-- HighscoreBox END -->
</body>

</html>
