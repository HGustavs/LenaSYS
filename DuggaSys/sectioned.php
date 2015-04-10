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
		$loginvar="SECTION"; 
		include '../Shared/navheader.php';
	?>
		
	<!-- content START -->
	<div id="content">
			
	<!--- Section List --->
	<div id='Sectionlist'></div>

	</div>
	<!-- content END -->

	<?php 
		include 'loginbox.php';
	?>

	<!--- Edit Section Dialog START --->
	<div id='editSection' class='loginBox' style='width:460px;display:none;'>

	<div class='loginBoxheader'>
	<h3>Edit Item</h3>
	<div onclick='closeWindows();'>x</div>
	</div>
				
	<table style="width:100%">
		<tr>
			<td colspan='2'><input type='hidden' id='lid' value='Toddler' />Name:<br/><input type='text' class='form-control textinput' id='sectionname' value='sectionname' style='width:448px;' /></td>
		</tr>
		<tr>
			<td colspan='2'><span id='linklabel'>Link:&nbsp;<select id='link' ></select></span></td>
		</tr>
		<tr>
			<td>Type:&nbsp;<select id='type' onchange='changedType();'></select></td>
			<td align='right'>Visibility:&nbsp;<select style='align:right;' id='visib'></select></td>
		</tr>
		<tr>
			<td>Moment:&nbsp;<select id='moment' ></select></td>
			<td>GradeSystem:&nbsp;<select id='gradesys' ></select></td>
		</tr>
	</table>
	<table style='width:460px;'>
		<tr>
			<td align='left'><input class='submit-button' type='button' value='Delete' onclick='deleteItem();' /></td>
			<td align='center'><input class='submit-button' type='button' value='Create' onclick='createItem();' id='createbutton' /></td>
			<td align='right'><input class='submit-button' type='button' value='Save' onclick='updateItem();' /></td>
		</tr>
	</table>

	</div>
	<!--- Edit Section Dialog END --->
				
</body>
</html>
