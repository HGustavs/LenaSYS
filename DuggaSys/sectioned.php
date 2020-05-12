<?php
//xd
	session_start();
	include_once "../../coursesyspw.php";
	include_once "../Shared/sessions.php";
	pdoConnect();


	if(isset($_SESSION['uid'])){
		$userid=$_SESSION['uid'];
	}else{
		$userid="00";
	}

	if($userid == "00"){
		if (!isset($_COOKIE["cookie_guest"])) {
			// Cookie for guest username is not present, send a guest cookie to user.
			$username = "Guest" . $userid . rand(0,50000);  // Guests have a random number between 0 and 50k added, this means there's a very small chance some guests have the same ID. These are only used for logging at the moment so this should not be an issue
			setcookie("cookie_guest", $username, time() + 3600, "/");
		}
	}
	else{
		// refreshes session cookies, thereby extending the time before users sees the alert or get logged out
		// refreshes takes place when navigating to codeviewer.php, courseed.php, and sectioned.php
		setcookie("sessionEndTime", "expireC", time() + 2700, "/"); // Alerts user in 45min
		setcookie("sessionEndTimeLogOut", "expireC", time() + 3600, "/"); // Ends session in 60min, user gets logged out
	}
?>

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

	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
	<script src="../Shared/js/jquery-1.11.0.min.js"></script>
	<script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
	<script src="../Shared/dugga.js"></script>
	<script src="sectioned.js"></script>
</head>
<body onload="setup();">

	<?php
		$noup="COURSE";
		include '../Shared/navheader.php';
	?>

	<!-- content START -->
	<div id="content">

		<!-- FAB Start -->
		<!-- Big FAB Button in the bottom of the page -->
		<div class='fixed-action-button sectioned' id="FABStatic" style="display:none">
				<a class='btn-floating fab-btn-lg noselect' id='fabBtn'>+</a>
				<ol class='fab-btn-list' style='margin: 0; padding: 0; display: none;' reversed id='fabBtnList'>
					 <li><a class='btn-floating fab-btn-sm scale-transition scale-out' data-tooltip='Heading' onclick='createFABItem("0","New Heading","undefined");'><img class='fab-icon' src='../Shared/icons/heading-icon.svg'></a></li>
						<li><a class='btn-floating fab-btn-sm scale-transition scale-out' data-tooltip='Section' onclick='createFABItem("1","New Section","undefined");'><img class='fab-icon' src='../Shared/icons/section-icon.svg'></a></li>
						<li><a class='btn-floating fab-btn-sm scale-transition scale-out' data-tooltip='Moment' onclick='createFABItem("4","New Moment","undefined");'><img class='fab-icon' src='../Shared/icons/moment-icon.svg'></a></li>
						<li><a class='btn-floating fab-btn-sm scale-transition scale-out' data-tooltip='Test' onclick='createFABItem("3","New Test","undefined");'><img class='fab-icon' src='../Shared/icons/test-icon.svg'></a></li>
						<li><a class='btn-floating fab-btn-sm scale-transition scale-out noselect' data-tooltip='Link' onclick='createFABItem("5","New Link","undefined");'><i class='material-icons'>link</i></a></li>
						<li><a class='btn-floating fab-btn-sm scale-transition scale-out' data-tooltip='Code' onclick='createFABItem("2","New Code","undefined");'><img class='fab-icon' src='../Shared/icons/code-icon.svg'></a></li>
						<li><a class='btn-floating fab-btn-sm scale-transition scale-out' data-tooltip='Group activity' onclick='createFABItem("6","New Group","undefined");'><img class='fab-icon' src='../Shared/icons/group-icon.svg'></a></li>
						<li><a class='btn-floating fab-btn-sm scale-transition scale-out noselect' data-tooltip='Message' onclick='createFABItem("7","New Quote","undefined");'><i class='material-icons'>format_quote</i></a></li>
				</ol>
		</div>
		

		<!-- FAB END -->

		<!-- MOTD dropdown -->
		<div id='motdArea' style='display: none;'>
			<?php
				echo "<tr>";
				echo "		<div class='motdBoxheader' >";
				echo "			<h3>Message of the day</h3>";
				echo "				<div class='cursorPointerMOTD' onclick='closeMOTD()'  >x</div>";
				echo "	</div>";
				echo "  <div id='motdContent' style='text-align:center'>";
				echo "		<p style='text-align:center' id='motd'></p>";
				echo" 	</div>";
				echo "</tr>";
			?>
		</div>
		<!-- MOTD dropdown END -->

		<!-- Mobile view Start(course-dropdown, editVers, newVers) -->
		<div class='mobile-view'>
					<?php

						echo "<td style='display: inline-block;'>";
						echo "    <div class='course-dropdown-div'>";
						echo "      <select id='courseDropdownTop-mobile' class='course-dropdown' onchange='goToVersion(this)' ></select>";
						echo "    </div>";
						echo "</td>";

						echo "<td class='editVers' style='display: inline-block;margin-left:8px;'>";
						echo "    <div class='editVers menuButton'>";
            echo "      <img id='versionCog' class='navButt' title='Edit the selected version' onclick=showEditVersion(); src='../Shared/icons/CogwheelWhite.svg'>";
						echo "    </div>";
						echo "</td>";

						echo "<td class='newVers' style='display: inline-block;margin-right:2px;'>";
						echo "    <div class='newVers menuButton'>";
            echo "      <img id='versionPlus' value='New version' class='navButt' title='Create a new version of this course' onclick='showCreateVersion();' src='../Shared/icons/PlusS.svg'>";
						echo "    </div>";
						echo "</td>";
					?>
		</div>

		<!-- Mobile view END -->
		<!-- Announcement box -->
		<div id="announcementBoxOverlay">
			<div id="announcementBox">
				<h3>To Do</h3>
				<hr>
				<table>
					<?php

					$courseid = $_GET['courseid'];
					$coursevers = $_GET['coursevers'];

					foreach ($pdo->query('SELECT * FROM announcement WHERE courseid="'.$courseid.'" AND courseversion="'.$coursevers.'" ORDER BY announceTime DESC') AS $headline){
						$headlines = $headline['title'];
						$message = $headline['message'];
						$announcementid = $headline['id'];
						$announceTime = $headline['announceTime'];
						$author = $headline['author'];
						echo "<tr><td class='authorProfile' title='Author'><i class='fa fa-user'></i>".$author."</td></tr><tr><th title='Title'><a href='../DuggaSys/sectioned.php?courseid=".$_SESSION['courseid']."&coursename=".$_SESSION['coursename']."&coursevers=".$_SESSION['coursevers']."&announcementid=".$announcementid."'>".ucfirst(strtolower($headlines))."</a></th><td><button class='actionBtn'><a href='../Shared/announcementService.php?courseid=".$_SESSION['courseid']."&coursename=".$_SESSION['coursename']."&coursevers=".$_SESSION['coursevers']."&deleteannouncementid=".$announcementid."'>Delete</a></button><button class='actionBtn'><a href='../DuggaSys/sectioned.php?courseid=".$_SESSION['courseid']."&coursename=".$_SESSION['coursename']."&coursevers=".$_SESSION['coursevers']."&updateannouncementid=".$announcementid."&title=".$headlines."&message=".$message."&author=".$author."'>Update</a></button></td></tr><tr><td class='columnA' title='Message'><a href='../DuggaSys/sectioned.php?courseid=".$_SESSION['courseid']."&coursename=".$_SESSION['coursename']."&coursevers=".$_SESSION['coursevers']."&announcementid=".$announcementid."'>".ucfirst($message)."</a></td><td class='columnB'><b>Posted on:</b><br>".$announceTime."</td></tr>";


					}


					?>

				</table>

				<button class="showAllAnnouncement">
					<a href="#" class="hvr-icon-forward"><span class="showmore">Show more</span><i class="fa fa-chevron-circle-right hvr-icon"></i>
					</a>
				</button>
			</div>

		</div>
		<?php
    
		include '../Shared/announcementBox.php';
		if (isset($_GET['announcementid'])) {
			include '../Shared/fullAnnouncement.php';

		}if (isset($_GET['updateannouncementid'])) {
			include '../Shared/updateAnnouncement.php';
		}

		?>

		<!-- + button --->


		<div id='Sectionlist'>

		<div class='course' style='display:flex; align-items:center; justify-content:flex-end; '>

		<!-- Small FAB Button in top in the header of sectioned -->
		
			<div class='fixed-action-button2 sectioned2'  id="FABStatic2" style="display:none">
				<input id='addElement'  type='button' value='+' style="top:-493px" class='submit-button-newitem' title='New Item' >
				<ol class='fab-btn-list2' style='margin: 0; padding: 0; display: none;'  reversed id='fabBtnList2'>
							<li><a class='btn-floating fab-btn-sm2 scale-transition scale-out' data-tooltip='Heading' onclick='createFABItem("0","New Heading","TOP");'><img class='fab-icon' src='../Shared/icons/heading-icon.svg'></a></li>
							<li><a class='btn-floating fab-btn-sm2 scale-transition scale-out' data-tooltip='Section' onclick='createFABItem("1","New Section","TOP");'><img class='fab-icon' src='../Shared/icons/section-icon.svg'></a></li>
							<li><a class='btn-floating fab-btn-sm2 scale-transition scale-out' data-tooltip='Moment' onclick='createFABItem("4","New Moment","TOP");'><img class='fab-icon' src='../Shared/icons/moment-icon.svg'></a></li>
							<li><a class='btn-floating fab-btn-sm2 scale-transition scale-out' data-tooltip='Test' onclick='createFABItem("3","New Test","TOP");'><img class='fab-icon' src='../Shared/icons/test-icon.svg'></a></li>
							<li><a class='btn-floating fab-btn-sm2 scale-transition scale-out noselect' data-tooltip='Link' onclick='createFABItem("5","New Link","TOP");'><i class='material-icons'>link</i></a></li>
							<li><a class='btn-floating fab-btn-sm2 scale-transition scale-out' data-tooltip='Code' onclick='createFABItem("2","New Code","TOP");'><img class='fab-icon' src='../Shared/icons/code-icon.svg'></a></li>
							<li><a class='btn-floating fab-btn-sm2 scale-transition scale-out' data-tooltip='Group activity' onclick='createFABItem("6","New Group","TOP");'><img class='fab-icon' src='../Shared/icons/group-icon.svg'></a></li>
							<li><a class='btn-floating fab-btn-sm2 scale-transition scale-out noselect' data-tooltip='Message' onclick='createFABItem("7","New Quote","TOP");'><i class='material-icons'>format_quote</i></a></li>
					</ol>
			</div>
				<div style='flex-grow:1'>
						<span id='course-coursename' class='nowrap ellipsis' style='margin-left: 90px;margin-right:10px;'>UNK</span>
						<span id='course-coursecode' style='margin-right:10px;'>UNK</span>
						<span id='course-versname' class='courseVersionField'>UNK</span>
				</div>


				<div id='course-newitem' style='display: flex;'>

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
								<svg id="swimlaneSVG" width='300px' style='margin: 10px;' viewBox="0 0 300 255" xmlns="http://www.w3.org/2000/svg"></svg>
						</div>
				</div>
		</div>
		<!-- Statistics List END-->

		<!-- Section List -->
		<div id='Sectionlisti'>

		</div>
	</div>
	<div class="course">
		<span style="text-align: center;">
			<a href="../Shared/calendar.php?courseid=<?php echo $_GET['courseid']; ?>&coursevers=<?php echo $_GET['coursevers']; ?>" style="color:#fff">Subscribe for deadlines in your personal calendar</a>
		</span>
	</div>
	<!-- content END -->

	<?php
		include '../Shared/loginbox.php';
	?>

		<!-- Edit Section Dialog START -->
		<div id='editSection' class='loginBoxContainer' style='display:none;'>
		<div class='loginBox' style='width:460px;'>
			<div class='loginBoxheader'>
				<h3 id='editSectionDialogTitle'>Edit Item</h3>
				<div class='cursorPointer' onclick='closeWindows(); closeSelect();showSaveButton();'>x</div>
			</div>
			<div style='padding:5px;'>
				<input type='hidden' id='lid' value='Toddler' />
				<input type='hidden' id='comments'  />
				<div id='inputwrapper-name' class='inputwrapper'>
					<span>Name:</span>
					<input type='text' class='textinput' id='sectionname' value='sectionname' maxlength="64"/>
				</div>
				<div id='inputwrapper-type' class='inputwrapper'>
					<span>Type:</span>
					 <!-- If you want to change the names of the spans, make sure that they fit with the dropdown box.
						If they don't, change the width of loginbox select in the CSS file -->
					<select id='type' value='type' onchange='changedType(document.getElementById("type").value);'></select>
					</div>
					<div id='inputwrapper-link' class='inputwrapper'><span>Link:</span><select id='link' ></select></div>
					<div id='inputwrapper-gradesystem' class='inputwrapper'><span>Grade system:</span><select id='gradesys' ></select></div>
					<div id='inputwrapper-deadline' class='inputwrapper'><span>Set Deadline:</span><span style='float:right'><input onchange="validateDate2('setDeadlineValue','dialog8')" class='textinput' type='date' id='setDeadlineValue' value='' /><select style='width:55px;' id='deadlineminutes'></select><select style='width:55px;' id='deadlinehours'></select></span></div>
			        <p id="dialog8" style="font-size:11px; border:0px; margin-left: 10px; display:none;">Deadline has to be between start date and end date</p>
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
					<input id="saveBtn" style='float:right;' class='submit-button updateDugga' type='button' value='Save' onclick='updateItem(); updateDeadline();' />
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
				<input style='margin-right: 5%;' class='submit-button' id="delete-item-button" type='button' value='Yes' title='Yes' onclick='confirmBox("deleteItem");' />
				<input style='margin-left: 5%;' class='submit-button' id="close-item-button" type='button' value='No' title='No' onclick='confirmBox("closeConfirmBox");' />
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
				<div class='inputwrapper'><span>Version ID:</span><input oninput="validateCourseID('versid', 'dialog2')" class='textinput' type='text' id='versid' placeholder='Version ID' maxlength='8'/></div>
				<p id="dialog2" style="font-size:11px; border:0px; margin-left: 10px; display:none;">Only numbers(between 3-6 numbers)</p>
				<div class='inputwrapper'><span>Version Name:</span><input oninput="validateVersionName('versname', 'dialog')" class='textinput' type='text' id='versname' placeholder='Version Name' /></div>
				<p id="dialog" style="font-size:11px; border:0px; margin-left: 10px; display:none;">Must be in of the form HTNN or VTNN</p>
				<div class='inputwrapper'><span>Start Date:</span><input onchange="validateDate('startdate','enddate','dialog3')" class='textinput' type='date' id='startdate' value='' /></div>
				<div class='inputwrapper'><span>End Date:</span><input onchange="validateDate('startdate','enddate','dialog3')" class='textinput' type='date' id='enddate' value='' /></div>
				<p id="dialog3" style="font-size:11px; border:0px; margin-left: 10px; display:none;">Start date has to be before end date</p>
				<div class='inputwrapper'><span>MOTD:</span><input onchange="validateMOTD('vmotd','dialog4')" class='textinput' type='text' id='vmotd' placeholder='MOTD' value='' /></div>
				<p id="dialog4" style="font-size:11px; border:0px; margin-left: 10px; display:none;">Message can only contain a maximum of 50 non-nordic symbols</p>
				<div class='inputwrapper'><span>Change this to default version</span><input type="checkbox" name="makeactive" id="makeactive" value="yes"></div>
				<div class='inputwrapper'><span>Copy content from:</span><select id='copyvers'></select></div>
			</div>
			<div style='padding:5px;'>
				<input class='submit-button' type='button' value='Create' title='Create new version' onclick="validateForm('newCourseVersion')" />
			</div>
		</div>
	</div>
	<!-- New Verison Dialog END -->

<!-- Edit Version Dialog START -->
<div id='editCourseVersion' onmouseover="validateVersionName('eversname', 'dialog5'); validateDate('estartdate','eenddate','dialog6'); validateMOTD('eMOTD', 'dialog9');" class='loginBoxContainer' style='display:none;'>
		<div class='loginBox' style='width:464px;'>
			<div class='loginBoxheader'>
				<h3>Edit Course Version</h3>
				<div class='cursorPointer' onclick='closeWindows();'>x</div>
			</div>
			<div style='padding:5px;'>
				<input type='hidden' id='cid' value='Toddler' />
				<div class='inputwrapper'><span>Version ID:</span><input class="greyedout-textinput" disabled type='text' id='eversid' placeholder='Version ID' /></div>
				<div class='inputwrapper'><span>Version Name:</span><input oninput="validateVersionName('eversname', 'dialog5')" class='textinput' type='text' id='eversname' placeholder='Version Name'/></div>
				<p id="dialog5" style="font-size:11px; border:0px; margin-left: 10px; display:none;">Must be in of the form HTNN or VTNN</p>
				<div class='inputwrapper'><span>Start Date:</span><input onchange="validateDate('estartdate','eenddate','dialog6')" class='textinput' type='date' id='estartdate' value='' /></div>
				<div class='inputwrapper'><span>End Date:</span><input onchange="validateVersionName('eversname', 'dialog5')" class='textinput' type='date' id='eenddate' value='' /></div>
				<p id="dialog6" style="font-size:11px; border:0px; margin-left: 10px; display:none;">Start date has to be before end date</p>
				<div class='inputwrapper'><span>MOTD:</span><input onchange="validateMOTD('eMOTD', 'dialog9')" class='textinput' type='text' id='eMOTD' placeholder='MOTD'/></div>
				<p id="dialog9" style="font-size:11px; border:0px; margin-left: 10px; display:none;">Message can only contain a maximum of 50 non-nordic symbols</p>
				<div class='inputwrapper'><span>Change this to default version</span><input type="checkbox" name="emakeactive" id="emakeactive" value="yes"></div>
			</div>
			<div style='padding:5px;'>
				<input class='submit-button' type='button' value='Save' title='Save changes' onclick="validateForm('editCourseVersion')" />
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
