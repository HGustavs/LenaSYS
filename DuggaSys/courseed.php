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
			
	<!--- Section List --->
	<div id='Courselist'></div>

	</div>
	
	<!-- content END -->

	<?php
		include '../Shared/loginbox.php';
	?>

	<!--- Edit Section Dialog START --->
	<div id='editCourse' class='loginBox' style='width:464px;display:none;'>

	<div class='loginBoxheader'>
	<h3>Edit Course</h3>
	<div onclick='closeSelect();'>x</div>
	</div>
				
	<table width="100%">
		<tr>
			<input type='hidden' id='cid' value='Toddler' /></td>
			<td>Course Name: <input class='form-control textinput' type='text' id='coursename' value='Course Name' /></td>
			<!--TODO: add correct course code structure -->
			<td>Code: <input class='form-control textinput' type='text' id='coursecode' value='Course Code' /></td>	
		</tr>
		<tr>
			<td>Vers ID: <input size='8' class='form-control textinput' type='text' id='versid' value='Version ID' /></td>		
			<td>Vers Name: <input size='8' class='form-control textinput' type='text' id='versname' value='Version Name' /></td>		
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
			<td id='accessbutt' align='left'><input class='submit-button' type='button' value='Access' onclick='accessCourse();' /></td>
			<td align='center'><input class='submit-button' type='button' value='New Version' onclick='createVersion();' /></td>
			<td align='center'><input class='submit-button' type='button' value='Copy' onclick='copyVersion();' /></td>
			<td align='right'><input class='submit-button' type='button' value='Save' onclick='updateCourse();' /></td>
		</tr>
	</table>

	</div>
	<!--- Edit Section Dialog END --->
	
</body>
</html>
