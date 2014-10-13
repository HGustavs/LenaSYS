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
	<title>Result List Editor</title>

	<link type="text/css" href="css/style.css" rel="stylesheet">
  <link type="text/css" href="css/jquery-ui-1.10.4.min.css" rel="stylesheet">  
  <link type="text/css" href="templates/dugga.css" rel="stylesheet">  

	<script src="js/jquery-1.11.0.min.js"></script>
	<script src="js/jquery-ui-1.10.4.min.js"></script>

	<script src="dugga.js"></script>
	<script src="resultlisted.js"></script>

</head>
<body>
	
	<?php 
		$noup="SECTION";
		$loginvar="RESULT";
		include 'navheader.php';
	?>
		
	<!-- content START -->
	<div id="content" style="overflow:hidden;">
					
	</div>

	<!--- Edit Dugga Dialog END --->
	
	<?php 
		include 'loginbox.php';
	?>
	
		
</body>
</html>