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
	<title>Section Editor</title>

	<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
	<link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">

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
	<div id='editSection' class='loginBox' style='width:460px;display:none;'>
		<div class='loginBoxheader'>
			<h3>Edit Item</h3>
			<div onclick='closeWindows(); closeSelect();'>x</div>
		</div>
		<div style='padding:5px;'>
			<input type='hidden' id='lid' value='Toddler' />
			<div id='inputwrapper-name' class='inputwrapper'><span>Name:</span><input type='text' class='textinput' id='sectionname' value='sectionname' /></div>
			<div id='inputwrapper-type' class='inputwrapper'><span>Type:</span><select id='type' onchange='changedType();'></select></div>
			<div id='inputwrapper-link' class='inputwrapper'><span>Link:</span><select id='link' ></select></div>
			<div id='inputwrapper-gradesystem' class='inputwrapper'><span>GradeSystem:</span><select id='gradesys' ></select></div>
			<div id='inputwrapper-tabs' class='inputwrapper'><span>Tabs:</span><select id='tabs' ></select></div>
			<div id='inputwrapper-highscore' class='inputwrapper'><span>High score:</span><select id='highscoremode' ></select></div>
			<div id='inputwrapper-moment' class='inputwrapper'><span>Moment:</span><select id='moment' disabled></select></div>
			<div id='inputwrapper-visibility' class='inputwrapper'><span>Visibility:</span><select style='align:right;' id='visib'></select></div>
			<div id='inputwrapper-messagebox' class='messagebox' style='display:none;color:red;font-style:italic;text-align:center'>Create a Dugga before you can use it for a test. </div>
			<div id='inputwrapper-comment' class='inputwrapper'><span>Comment for deadline:</span><input type='text' class='textinput' id='deadlinecomment' value='deadlinecomment' placeholder="Deadline comment" /></div>
		</div>
		<!-- Error message, no duggas present-->
		<div style='padding:5px;'>
			<input style='float:left;' class='submit-button' type='button' value='Delete' onclick='deleteItem();' />
			<input style='float:right;' class='submit-button' type='button' value='Save' onclick='updateItem();' />
		</div>
	</div>
	<!-- Edit Section Dialog END -->


    <!-- Edit participant Dialog START -->
    <div id='editParticipant' class='loginBox' style='width:460px;display:none;'>
        <div class='loginBoxheader'>
            <h3>Edit Participant</h3>
            <div onclick='closeWindows(); closeSelect();'>x</div>
        </div>
        <div style='padding:5px;'>
            <input type='hidden' id='lid' value='Toddler' />
    </div>
    <!-- Edit Participant Dialog END -->


	<!-- New Verison Dialog START -->
	<div id='newCourseVersion' class='loginBox' style='width:464px;display:none;'>
		<div class='loginBoxheader'>
			<h3>New Course Verison</h3>
			<div onclick='closeWindows();'>x</div>
		</div>
		<div style='padding:5px;'>
			<input type='hidden' id='cid' value='Toddler' />
			<div class='inputwrapper'><span>Version Name:</span><input class='textinput' type='text' id='versname' placeholder='Version Name' /></div>
			<div class='inputwrapper'><span>Version ID:</span><input class='textinput' type='text' id='versid' placeholder='Version ID' /></div>
			<div class='inputwrapper'><span>Change this to default version</span><input type="checkbox" name="makeactive" id="makeactive" value="yes"></div>
			<div class='inputwrapper'><span>Copy content from:</span><select id='copyvers'></select></div>
		</div>
		<div style='padding:5px;'>
			<input class='submit-button' type='button' value='Save' title='Save changes' onclick='createVersion();' />
		</div>
	</div>
	<!-- New Verison Dialog END -->

	<!-- Edit Verison Dialog START -->
	<div id='editCourseVersion' class='loginBox' style='width:464px;display:none;'>
		<div class='loginBoxheader'>
			<h3>Edit Course Verison</h3>
			<div onclick='closeWindows();'>x</div>
		</div>
		<div style='padding:5px;'>
			<input type='hidden' id='cid' value='Toddler' />
			<div class='inputwrapper'><span>Version Name:</span><input class='textinput' type='text' id='eversname' placeholder='Version Name' /></div>
			<div class='inputwrapper'><span>Version ID:</span><input class='textinput' type='text' id='eversid' placeholder='Version ID' disabled /></div>
			<div class='inputwrapper'><span>Change this to default version</span><input type="checkbox" name="emakeactive" id="emakeactive" value="yes"></div>
		</div>
		<div style='padding:5px;'>
			<input class='submit-button' type='button' value='Save' title='Save changes' onclick='updateVersion();' />
		</div>
	</div>
	<!-- Edit Verison Dialog END -->

	<!-- HighscoreBox START -->
	<div id='HighscoreBox' class='loginBox' style='width:500px;display:none;'>
		<div class='loginBoxheader'>
			<h3>Highscore</h3>
			<div onclick='closeWindows();'>x</div>
		</div>
		<table id ='HighscoreTable' width='100%'>
			<tr>

			</tr>
		</table>
	</div>
	<!-- HighscoreBox END -->

</body>
</html>
