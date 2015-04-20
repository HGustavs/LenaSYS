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
	<title>Result Editor</title>

	<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
  <link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">  
  <link type="text/css" href="templates/dugga.css" rel="stylesheet">  

	<script src="../Shared/js/jquery-1.11.0.min.js"></script>
	<script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>

	<script src="../Shared/dugga.js"></script>
	<script src="resulted.js"></script>

</head>
<body>
	
	<?php 
		$noup="SECTION";
		$loginvar="RESULT";
		include '../Shared/navheader.php';
		setcookie("loginvar", $loginvar);
	?>
		
	<!-- content START -->
	<div id="content">
					
	</div>

	<!-- Edit Dugga Dialog END -->
	
	<?php 
		include '../Shared/loginbox.php';
	?>
	
	<!-- Result Popover START -->

	<div id='resultpopover' class='resultPopover' style='display:none' onmousemove='moveDist(event);'>

		<div class='loginBoxheader'>
				<h3 id='Nameof'>Show Results</h3>
		</div>

		<div id="MarkCont" style="position:absolute; left:4px; right:4px; top:34px; bottom:4px; border:2px inset #aaa;background:#bbb"> </div>
	
	</div>
	
	<!-- Result Popover END -->

	<!-- Edit Variant Dialog START -->
	
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
			<td colspan='2' style='line-height:40px;'>Answer: <input style='float:right;width:390px;' class='form-control textinput' type='text' id='answer' value='Variant Answer' /></td>		
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
	<!-- Edit Variant Dialog END -->
		
</body>
</html>
