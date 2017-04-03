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
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>Result List Editor</title>

	<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
	<link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">  

	<script src="../Shared/js/jquery-1.11.0.min.js"></script>
	<script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>

	<script src="../Shared/dugga.js"></script>
	<script src="resultlisted.js"></script>
</head>
<body>
<?php 
		$noup="SECTION";
		$loginvar="RESULT";
		include '../Shared/navheader.php';
		setcookie("loginvar", $loginvar);
	?>
		
	<!-- content START -->
	<div id="content" style="overflow:hidden;">
					
	</div>

	<!--- Edit Dugga Dialog END --->
	
	<?php 
		include '../Shared/loginbox.php';
	?>
	
	
	<!-- Edit list START -->
	<div id='editlist' class='loginBox' style='width:464px;display:none;'>
		<div class='loginBoxheader'>
			<h3>Edit List</h3>
			<div onclick='closeWindows();'>x</div>
		</div>		
		<div style='padding:5px;'>
			<input type='hidden' id='cid' value='Toddler' />
			<div class='inputwrapper'><span>Issuer of the list:</span><input class='textinput' type='text' id='listissuer' placeholder='Pernilla kvist' /></div>
			<div class='inputwrapper'><span>date of issuing list:</span><input class='textinput' type='date' id='dateissue' placeholder='03-12-2015' /></div>
			<div class='inputwrapper'><span>List Number</span><input type="text" class='textinput' id="listnumber" placeholder='34754'/></div>
			<div class='inputwrapper'><span>Examination date:</span><input type='date' class='textinput' id='examdate' placeholder='03-12-2015'/></div>
			<input type='hidden' id='savelistid' value=''/>
		</div>
		<div style='padding:5px;'>
			<input class='submit-button' type='button' value='Save' title='Save changes' onclick='updatelist();' />
		</div>
	</div>
</body>
</html>
