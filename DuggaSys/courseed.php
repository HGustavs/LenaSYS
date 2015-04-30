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
	<title>Course Editor</title>
		
	<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
	<link type="text/css" href="../Shared/css/responsive.css" rel="stylesheet">
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
		setcookie("loginvar", $loginvar);
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
	<div onclick='closeWindows();'>x</div>
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
	<div onclick='closeWindows();'>x</div>
	</div>
				
	<table width="100%">
		<tr>
			<input type='hidden' id='cid' value='Toddler' /></td>
			<td>Course Name: <div id='couresnamewrapper'><input class='form-control textinput' type='text' id='coursename' value='Course Name' /></div></td>
			<td>Course Code: <div id='courseidwrapper'><input class='form-control textinput' type='text' id='coursecode' value='Course Code' /></div></td>	
		</tr>
		<tr>
			<td>Visibility: <select style='float:right;' id='visib'></select></td>
		</tr>
	</table>
	<table width="100%">
		<tr>
			<td align='right'><input class='submit-button' type='button' value='Save' title='Save changes' onclick='updateCourse();' /></td>
		</tr>
	</table>

	</div>
	<!-- Edit Section Dialog END -->
	
</body>
</html>
