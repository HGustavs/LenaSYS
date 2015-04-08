<?php
session_start();
include_once "../../coursesyspw.php";
include_once "../Shared/sessions.php";
pdoConnect();
?>
<!DOCTYPE html>
<html>
<head>
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
		$noup="NONE";
		$loginvar="COURSE"; 
		include '../Shared/navheader.php';
	?>
		
	<!-- content START -->
	<div id="content">
			
	<!-- Section List -->
	<div id='Courselist'></div>

	</div>
	
	<!-- content END -->

	<?php
		include '../Shared/loginbox.php';
	?>
	
	<!-- New Course Section Dialog START -->
	<div id='newCourse' class='loginBox' style='width:464px;display:none;'>
	<div class='loginBoxheader'>
	<h3>New Course</h3>
	<div onclick='closeNewCourse();'>x</div>
	</div>		
	<table width="100%">
		<tr>
			<input type='hidden' id='cid' value='Toddler' /></td>
			<td>Course Name: <input class='form-control textinput' type='text' id='ncoursename' placeholder='Course Name' /></td>
			<td>Course Code: <input class='form-control textinput' type='text' id='ncoursecode' placeholder='Course Code' /></td>	
		</tr>
	</table>
	<table width="100%">
		<tr>
			<td align='right'><input class='submit-button' type='button' value='Create' onclick='createNewCourse();' /></td>
		</tr>
	</table>

	</div>
	<!-- New Course Section Dialog END -->
	
	<!-- Edit Section Dialog START -->
	<div id='editCourse' class='loginBox' style='width:464px;display:none;'>

	<div class='loginBoxheader'>
	<h3>Edit Course</h3>
	<div onclick='closeEditCourse();'>x</div>
	</div>
				
	<table width="100%">
		<tr>
			<input type='hidden' id='cid' value='Toddler' /></td>
			<td>Course Name: <div id='couresnamewrapper'><input class='form-control textinput' type='text' id='coursename' value='Course Name' /></div></td>
			<td>Course Code: <div id='courseidwrapper'><input class='form-control textinput' type='text' id='coursecode' value='Course Code' /></div></td>	
		</tr>
		<tr>
			<td>Vers ID: <div id='versidwrapper'><input size='8' class='form-control textinput' type='text' id='versid' value='Version ID' /></div></td>		
			<td>Vers Name: <div id='versnamewrapper'><input size='8' class='form-control textinput' type='text' id='versname' value='Version Name' /></div></td>		
			<input type='hidden' id='cid' value='Toddler' /></td>
		</tr>
		<tr>
			<td>Student Version: <select style='float:right;' id='activeversion'></select></td>
			<td>Edit Version: <select style='float:right;' id='activeedversion'></select></td>
		</tr>
		<tr>
			<td>Visibility: <select style='float:right;' id='visib'></select></td>
			<td>Copy Version: <select style='float:right;' id='copyversion'></select></td>
		</tr>
	</table>


	<table width="100%"><tr>
			<td id='accessbutt' align='left'><input class='submit-button' type='button' value='Access' title='Give students access to this course' onclick='accessCourse();'/></td>
			<td align='center'><input class='submit-button' type='button' value='New Version' title='Click here to save a new version' onclick='createVersion();' /></td>
			<td align='center'><input class='submit-button' type='button' value='Copy' title='Copy this course' onclick='copyVersion();' /></td>
			<td align='right'><input class='submit-button' type='button' value='Save' title='Save changes' onclick='updateCourse();' /></td>
		</tr>
	</table>

	</div>
	<!-- Edit Section Dialog END -->
	
</body>
</html>
