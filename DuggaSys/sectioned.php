<?php
session_start();
include_once "../../coursesyspw.php";
include_once "../Shared/sessions.php";
pdoConnect();
?>
<!DOCTYPE html>
<html>
<head>
	<meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1">
	<meta http-equiv="X-UA-Compatible" content="IE=edge"> 
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>Section Editor</title>

	<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
	<link type="text/css" href="../Shared/css/responsive.css" rel="stylesheet">
  <link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">  

	<script src="../Shared/js/jquery-1.11.0.min.js"></script>
	<script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>

	<script src="../Shared/dugga.js"></script>
	<script src="sectioned.js"></script>
</head>
<body>

	<?php
		$noup="COURSE";
		$loginvar="SECTION"; 
		include '../Shared/navheader.php';
		setcookie("loginvar", $loginvar);
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
	<div onclick='closeWindows();'>x</div>
	</div>
			
	<table style="width:100%;margin-bottom:20px;float:left">
		<tr>
			<td colspan='2'><input type='hidden' id='lid' value='Toddler' />Name: <div id='sectionnamewrapper'><br/><input type='text' class='form-control textinput' id='sectionname' value='sectionname' style='width:448px;' /></div></td>
		</tr>
		<tr>
			<td colspan='2'><span id='linklabel'>Link:&nbsp;<select id='link' ></select></span></td>
		</tr>
		<tr>
			<td>Type:&nbsp;<select id='type' onchange='changedType();'></select></td>
			<td align='right'>Visibility:&nbsp;<select style='align:right;' id='visib'></select></td>
		</tr>
		<tr>
			<td>Moment:&nbsp;<select id='moment' disabled></select></td>
			<td>GradeSystem:&nbsp;<select id='gradesys' ></select></td>
		</tr>
		<tr>
			<td>High score:&nbsp;<select id='highscoremode' ></select></td>
		</tr>
	</table>
	<table>
		<tr>
			<div class='messagebox' style='display:none;color:red;font-weight:italic;text-align:center'>Create a Dugga before you can use it for a test. </div>
		</tr>
	</table>
	
	<!-- Error message, no duggas present-->
	
	<table style='width:460px;float:left'>
		<tr>
			<td align='left'><input class='submit-button' type='button' value='Delete' onclick='deleteItem();' /></td>
			<td align='center'><input class='submit-button' type='button' value='Create' onclick='createItem();' id='createbutton' /></td>
			<td align='right'><input class='submit-button' type='button' value='Save' onclick='updateItem();' /></td>
		</tr>
	</table>

	</div>
	<!-- Edit Section Dialog END -->
	
	<!-- New Verison Dialog START -->
	<div id='newCourseVersion' class='loginBox' style='width:464px;display:none;'>
	<div class='loginBoxheader'>
	<h3>New Course Verison</h3>
	<div onclick='closeWindows();'>x</div>
	</div>		
	<table width="100%">
		<tr>
			<td>Version Name: <div id='versnamewrapper'><input size='8' class='form-control textinput' type='text' id='versname' placeholder='Version Name' /></div></td>	
			<td>Version ID: <div id='versidwrapper'><input size='8' class='form-control textinput' type='text' id='versid' placeholder='Version ID' /></div></td>			
			<input type='hidden' id='cid' value='Toddler' /></td>
		</tr>
		<tr>
			<td>Copy content from:</td>		
		</tr>
		<tr>
			<td><select style='float:left;' id='copyvers'></select></td>
		</tr>
		<tr>	
			<td><br><div id='makeactivewrapper'><input type="checkbox" name="makeactive" id="makeactive" value="yes">Change this to default version</div></td>
		</tr>
	</table>
	<table width="100%">
		<tr>
			<td align='right'><input class='submit-button' type='button' value='Create' onclick='createVersion();' /></td>
		</tr>
	</table>

	</div>
	<!-- New Verison Dialog END -->
	
	<!-- Edit Verison Dialog START -->
	<div id='editCourseVersion' class='loginBox' style='width:464px;display:none;'>
	<div class='loginBoxheader'>
	<h3>Edit Course Verison</h3>
	<div onclick='closeWindows();'>x</div>
	</div>		
	<table width="100%">
		<tr>
			<td>Version Name: <div id='versnamewrapper'><input size='8' class='form-control textinput' type='text' id='eversname' placeholder='Version Name' /></div></td>	
			<td>Version ID: <div id='versidwrapper'><input size='8' class='form-control textinput' type='text' id='eversid' placeholder='Version ID' disabled/></div></td>			
			<input type='hidden' id='cid' value='Toddler' /></td>
		</tr>
		<tr>	
			<td><br><div id='makeactivewrapper'><input type="checkbox" name="emakeactive" id="emakeactive" value="yes">Change this to default version</div></td>
		</tr>
	</table>
	<table width="100%">
		<tr>
			<td align='right'><input class='submit-button' type='button' value='Save' onclick='updateVersion();' /></td>
		</tr>
	</table>

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
