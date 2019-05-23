<?php
//xd
	session_start();
	include_once "../../coursesyspw.php";
	include_once "../Shared/sessions.php";
	pdoConnect();
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

		<div id='TopMenuStatic' style="display:none;">

			<table class='navheader' style='overflow: hidden; table-layout: fixed;'>
				<tr class='trsize nowrap'>
					<td style='display: inline-block;'>
						<div class='course-dropdown-div'>
							<select id="courseDropdownTop" class='course-dropdown' onchange='goToVersion(this)' ></select>
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
								<a id='resultsBtnBurger' href='' onclick='bigMac(); navigatePage(this.id, "resulted.php");' oncontextmenu='javascript:navigatePage(this.id, "resulted.php");'><input type='button' value='Results' class='submit-button' title='Edit student results' /></a>
								</li>
								<li class='tests'>
										<a id='testsBtnBurger' href='' onclick='bigMac(); navigatePage(this.id, "duggaed.php");' oncontextmenu='javascript:navigatePage(this.id, "duggaed.php");'><input type='button' value='Tests' class='submit-button' title='Show tests' /></a>
									</li>
								<li class='files'>
									<a id='filesBtnBurger' href='' onclick='bigMac(); navigatePage(this.id, "fileed.php");' oncontextmenu='javascript:navigatePage(this.id, "fileed.php");'><input type='button' value='Files' class='submit-button' title='Show files'/></a>
								</li>
								<li class='access'>
									<a id='accessBtnBurger' href='' onclick='bigMac(); navigatePage(this.id, "accessed.php");' oncontextmenu='javascript:navigatePage(this.id, "accessed.php");'><input type='button' value='Access' class='submit-button' title='Give students access to the selected version'/></a>
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
							<a id='testsBTN' href='' onclick='navigatePage(this.id, "duggaed.php");' oncontextmenu='javascript:navigatePage(this.id, "duggaed.php");'><input type='button' value='Tests' class='submit-button' title='Show tests' /></a>
						</div>
					</td>
					<td class='files menuButton' style='display: inline-block;'>
						<div class='files menuButton'>
						<a id='filesBTN' href='' onclick='navigatePage(this.id, "fileed.php");' oncontextmenu='javascript:navigatePage(this.id, "fileed.php");'><input type='button' value='Files' class='submit-button' title='Show files'/></a>
						</div>
					</td>
					<td class='access menuButton' style='display: inline-block;'>
						<div class='access menuButton'>
						<a id='accessBTN' title='Give students access to the selected version' value='Access' href='' onclick='navigatePage(this.id, "accessed.php");' oncontextmenu='javascript:navigatePage(this.id, "accessed.php");'>
								<img class="navButt" src='../Shared/icons/lock_symbol.svg'>
							</a>
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
						<span id='course-coursename' class='nowrap ellipsis' style='margin-left: 90px;margin-right:10px;'>UNK</span>
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
								<svg id="swimlaneSVG" width='300px' style='margin: 10px;' viewBox="0 0 300 255" xmlns="http://www.w3.org/2000/svg"></svg>
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
					<div id='inputwrapper-deadline' class='inputwrapper'><span>Set Deadline:</span><span style='float:right'><input class='textinput' type='date' id='setDeadlineValue' value='' /><select style='width:55px;' id='deadlineminutes'></select><select style='width:55px;' id='deadlinehours'></select></span></div>
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
