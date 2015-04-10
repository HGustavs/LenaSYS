<?php
session_start();
include_once "../../coursesyspw.php";
include_once "../Shared/sessions.php";
pdoConnect();
?>
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>Dugga editor</title>

	<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
  <link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">  

	<script src="../Shared/js/jquery-1.11.0.min.js"></script>
	<script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>

	<script src="../Shared/dugga.js"></script>
	<script src="duggaed.js"></script>

</head>
<body>
	
	<?php 
		$noup="SECTION";
		$loginvar="DUGGA";
		include '../Shared/navheader.php';
	?>
		
	<!-- content START -->
	<div id="content">
					
	</div>

	<!--- Edit Dugga Dialog END --->
	
	<?php 
		include 'loginbox.php';
	?>

	<!--- Edit Dugga Dialog START --->
	<div id='editDugga' class='loginBox' style='width:464px;display:none;'>

	<div class='loginBoxheader'>
	<h3>Edit Dugga</h3>
	<div onclick='closeEditDugga();'>x</div>
	</div>
				
	<table width="100%">
		<tr>
			<input type='hidden' id='did' value='Toddler' /></td>
			<td colspan='2' style='line-height:40px;'>Name: <input style='float:right;width:390px;' class='form-control textinput' type='text' id='name' value='Name' /></td>		
		</tr>
		<tr>
			<td>Auto-grade: <select style='float:right;' id='autograde'></select></td>
			<td>Grade System: <select style='float:right;' id='gradesys'></select></td>
		</tr>
		<tr>
			<td colspan="2">Template: <select id='template'></select></td>
		</tr>
		<tr>
			<td>Release Date: <input class='form-control textinput datepicker' type='text' id='release' value='None' /></td>		
			<td>Deadline Date: <input class='form-control textinput datepicker' type='text' id='deadline' value='None' /></td>
		</tr>


	</table>

	<table width="100%"><tr>
			<td align='right'><input class='submit-button' type='button' value='Save' onclick='updateDugga();' /></td>
		</tr>
	</table>

	</div>
	<!--- Edit Dugga Dialog END --->
	
	<!--- Edit Variant Dialog START --->
	<div id='editVariant' class='loginBox' style='width:464px;display:none;'>

	<div class='loginBoxheader'>
	<h3>Edit Variant</h3>
	<div onclick='closeEditVariant();'>x</div>
	</div>
				
	<table width="100%">
		<tr>
			<input type='hidden' id='vid' value='Toddler' /></td>
			<td colspan='2' style='line-height:40px;'>Param: <input style='float:right;width:390px;' class='form-control textinput' type='text' id='parameter' value='Variant Param' /></td>		
		</tr>	
		<tr>
			<td colspan='2' style='line-height:40px;'>Answer: <input style='float:right;width:390px;' class='form-control textinput' type='text' id='variantanswer' value='Variant Answer' /></td>		
		</tr>
	</table>

	<table width="100%">
		<tr>
			<td align='left'><input class='submit-button' type='button' value='Delete' onclick='deleteVariant();' /></td>
			<td align='center'></td>
			<td align='right'><input class='submit-button' type='button' value='Save' onclick='updateVariant();' /></td>
		</tr>
		
	</table>

	</div>
	<!--- Edit Variant Dialog END --->
		
</body>
</html>
