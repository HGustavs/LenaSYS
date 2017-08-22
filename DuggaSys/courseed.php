<?php
session_start();
include_once "../../coursesyspw.php";
include_once "../Shared/sessions.php";
pdoConnect();

if (file_exists("../.git/refs/heads/master")) {
	$versionFile = fopen("../.git/refs/heads/master", "r");
	$version = fgets($versionFile);
	fclose($versionFile);
} else {
	$version = "v0.7+";
}
$noup="NONE";
$loginvar="COURSE";
setcookie("loginvar", $loginvar);

?>
<!DOCTYPE html>
<html>
<head>
	<link rel="icon" type="image/ico" href="../Shared/icons/favicon.ico"/>
	<meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>Course Editor</title>

	<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
	<link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">

	<script src="../Shared/js/jquery-1.11.0.min.js"></script>
	<script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
	<script src="../Shared/dugga.js"></script>
	<script src="courseed.js"></script>
</head>
<body>

	<?php
	include '../Shared/navheader.php';
	?>

	<!-- content START -->
	<div id="content">
		<!-- Section List -->
		<div id='Courselist'>
		</div>
    <div id="servermsgcontainer" style="display:flex;position:fixed;bottom:0;left:0;right:0;height:100px;background-color:rgba(0,0,0,0.3);color:#FFF;font-size:42px;text-align:center; justify-content:center; align-items:center;"><div id="servermsg" style="padding-left:100px;">Server Maintenance 2017-08-22 -- 2017-08-24</div><div style='cursor:pointer;background-color:#c75050;height:100px;width:100px;display:flex;align-items:center;justify-content:center;margin-left:auto;' onclick='document.getElementById("servermsgcontainer").style.display="none";'>x</div></div>
	</div>
	<!-- version identification -->
	<div id="version" class='version'>Master hash <br /><?php echo $version ?></div>
	<!-- content END -->
	<?php
	include '../Shared/loginbox.php';
	?>
	<!-- New Course Section Dialog START -->
	<div id='newCourse' class='loginBox' style='width:464px;display:none;'>
		<div class='loginBoxheader'>
			<h3>New Course</h3>
			<div onclick='closeWindows();'>x</div>
		</div>
		<div style='padding:5px;'>
			<input type='hidden' id='cid' value='Toddler' />
			<div class='inputwrapper'><span>Course Name:</span><input class='textinput' type='text' id='ncoursename' placeholder='Course Name' /></div>
			<div class='inputwrapper'><span>Course code:</span><input class='textinput' type='text' id='ncoursecode' placeholder='Course Code' /></div>
		</div>
		<div style='padding:5px;'>
			<input class='submit-button' type='button' value='Create' title='Create course' onclick='createNewCourse();' />
		</div>
	</div>
	<!-- New Course Section Dialog END -->

	<!-- Edit Section Dialog START -->
	<div id='editCourse' class='loginBox' style='width:464px;display:none;'>
		<div class='loginBoxheader'>
			<h3>Edit Course</h3>
			<div onclick='closeWindows();'>x</div>
		</div>
		<div style='padding:5px;'>
			<input type='hidden' id='cid' value='Toddler' />
			<div class='inputwrapper'><span>Course Name:</span><input class='textinput' type='text' id='coursename' placeholder='Course Name' /></div>
			<div class='inputwrapper'><span>Course code:</span><input class='textinput' type='text' id='coursecode' placeholder='Course Code' /></div>
			<div class='inputwrapper'><span>Visibility:</span><select class='selectinput' id='visib'></select></div>
		</div>
		<div style='padding:5px;'>
			<input class='submit-button' type='button' value='Save' title='Save changes' onclick='updateCourse();' />
		</div>
	</div>
	<!-- Edit Section Dialog END -->

	<!-- New Verison Dialog START -->
	<div id='newCourseVersion' class='loginBox' style='width:464px;display:none;'>
		<div class='loginBoxheader'>
			<h3>New Course Verison</h3>
			<div onclick='closeWindows();'>x</div>
		</div>
		<div style='padding:5px;'>
			<input type='hidden' id='cid' value='Toddler' />
			<div class='inputwrapper'><span>Course Name:</span><input class='textinput' type='text' readonly id='coursename1' placeholder='Course Name' /></div>
			<div class='inputwrapper'><span>Course Code:</span><input class='textinput' type='text' readonly id='coursecode1' placeholder='Course Code' /></div>
			<div class='inputwrapper'><span>Version Name:</span><input class='textinput' type='text' id='versname' placeholder='Version Name' /></div>
			<div class='inputwrapper'><span>Version ID:</span><input class='textinput' type='text' id='versid' placeholder='Version ID' /></div>
			<div class='inputwrapper'><span>Change this to default version</span><input type="checkbox" name="makeactive" id="makeactive" value="yes"></div>
			<div class='inputwrapper'><span>Copy content from:</span><select id='copyvers'></select></div>
		</div>
		<div style='padding:5px;'>
			<input class='submit-button' type='button' value='Create' title='Create new version' onclick='createVersion();' />
		</div>
	</div>
	<!-- New Verison Dialog END -->

</body>
</html>
