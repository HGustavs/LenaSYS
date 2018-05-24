<?php
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
<body>

	<?php
		$noup="COURSE";
		include '../Shared/navheader.php';
	?>

	<!-- content START -->
	<div id="content">
		<!-- Section List -->
		<div id='Sectionlist'></div>
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
					<input type='text' class='textinput' id='sectionname' value='sectionname' onkeyup="validateName();" onchange="validateName();" />
				</div>
				<div id='inputwrapper-type' class='inputwrapper'>
					<span>Type:</span>
					<div class="tooltipDuggaType">
						<span id="tooltipType" style="display: none;" class="tooltipDuggaTypeTxt"></span>
					</div> <!-- If you want to change the names of the spans, make sure that they fit with the dropdown box.
						If they don't, change the width of loginbox select in the CSS file -->
						<select id='type' value='type' onchange='changedType(document.getElementById("type").value);validateType();'></select>
					</div>
					<div id='inputwrapper-link' class='inputwrapper'><span>Link:</span><select id='link' ></select></div>
					<div id='inputwrapper-gradesystem' class='inputwrapper'><span>Grade system:</span><select id='gradesys' ></select></div>
					<div id='inputwrapper-tabs' class='inputwrapper'><span>Tabs:</span><select id='tabs' ></select></div>
					<div id='inputwrapper-highscore' class='inputwrapper'><span>High score:</span><select id='highscoremode' ></select></div>
					<div id='inputwrapper-moment' class='inputwrapper'><span>Moment:</span><select id='moment' disabled></select></div>
					<div id='inputwrapper-visibility' class='inputwrapper'><span>Visibility:</span><select style='align:right;' id='visib'></select></div>
					<div id='inputwrapper-group' class='inputwrapper'><span>Group:</span><select style='align:right;' id='group'></select></div>
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
				<div class='inputwrapper'><span>Start Date:</span><input class='textinput datepicker' type='text' id='startdate' value='' /></div>
				<div class='inputwrapperSmall'><select id='minutePickerStartNewVersion'></select><span>Min:</span><select id='hourPickerStartNewVersion'></select><span>Hr:</span></div>
				<div class='inputwrapper'><span>End Date:</span><input class='textinput datepicker' type='text' id='enddate' value='' /></div>
				<div class='inputwrapperSmall'><select id='minutePickerEndNewVersion'></select><span>Min:</span><select id='hourPickerEndNewVersion'></select><span>Hr:</span></div>
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
				<div class='inputwrapper'><span>Version Name:</span><input class='textinput' type='text' id='eversname' placeholder='Version Name'/></div>
				<div class='inputwrapper'><span>Version ID:</span><input class='textinput' type='text' id='eversid' placeholder='Version ID' disabled /></div>
				<div class='inputwrapper'><span>Start Date:</span><input class='textinput datepicker' type='text' id='estartdate' value='' /></div>
				<div class='inputwrapperSmall'><select id='minutePickerStartEditVersion'></select><span>Min:</span><select id='hourPickerStartEditVersion'></select><span>Hr:</span></div>
				<div class='inputwrapper'><span>End Date:</span><input class='textinput datepicker' type='text' id='eenddate' value='' /></div>
				<div class='inputwrapperSmall'><select id='minutePickerEndEditVersion'></select><span>Min:</span><select id='hourPickerEndEditVersion'></select><span>Hr:</span></div>
				<div class='inputwrapper'><span>Change this to default version</span><input type="checkbox" name="emakeactive" id="emakeactive" value="yes"></div>
			</div>
			<div style='padding:5px;'>
				<input class='submit-button' type='button' value='Save' title='Save changes' onclick='updateVersion();' />
			</div>
		</div>
	</div>
	<!-- Edit Version Dialog END -->

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
