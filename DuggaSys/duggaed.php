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
		setcookie("loginvar", $loginvar);
	?>
		
	<!-- content START -->
	<div id="content">
					
	</div>

	<!--- Edit Dugga Dialog END --->
	
	<?php 
		include '../Shared/loginbox.php';
	?>

	<!--- Edit Dugga Dialog START --->
	<div id='editDugga' class='loginBox' style='width:464px;display:none;'>

		<div class='loginBoxheader'>
			<h3>Edit Dugga</h3>
			<div onclick='closeEditDugga();'>x</div>
		</div>
		<div style='padding:5px;'>
			<input type='hidden' id='did' value='Toddler' /></td>
			<div class='inputwrapper'><span>Name:</span><input class='textinput' type='text' id='name' value='Name' /></div>
			<div class='inputwrapper'><span>Auto-grade:</span><select id='autograde'></select></div>
			<div class='inputwrapper'><span>Grade System:</span><select id='gradesys'></select></div>
			<div class='inputwrapper'><span>Template:</span><select id='template'></select></div>
			<div class='inputwrapper'><span>Release Date:</span><input class='textinput datepicker' type='text' id='release' value='None' /></div>
			<div class='inputwrapper'><span>Deadline Date:</span><input class='textinput datepicker' type='text' id='deadline' value='None' /></div>
		</div>
		<div style='padding:5px;'>
			<input class='submit-button' type='button' value='Save' onclick='updateDugga();' />
		</div>
	</div>
	<!--- Edit Dugga Dialog END --->
	
	<!--- Edit Variant Dialog START --->
	<div id='editVariant' class='loginBox' style='width:464px;display:none;'>
		<div class='loginBoxheader'>
			<h3>Edit Variant</h3>
			<div onclick='closeWindows();'>x</div>
		</div>
		<div style='padding:5px;'>
			<input type='hidden' id='vid' value='Toddler' />
			<div class='inputwrapper'><span>Param:</span><input class='textinput' type='text' id='parameter' value='Variant Param' /></div>	
			<div class='inputwrapper'><span>Answer:</span><input class='textinput' type='text' id='variantanswer' value='Variant Answer' /></div>	
		</div>	
		<div style='padding:5px;'>
			<input style='float:left;' class='submit-button' type='button' value='Delete' onclick='deleteVariant();' />
			<input style='float:right;' class='submit-button' type='button' value='Save' onclick='updateVariant();' />
		</div>	
	</div>
	<!--- Edit Variant Dialog END --->
		
</body>
</html>
