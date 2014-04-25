<?php
session_start();
?>
<!DOCTYPE html>
<html>
<head>	
		<link type="text/css" href="../DuggaSys/css/duggasys.css" rel="stylesheet" />	
		<link type="text/css" href="../DuggaSys/css/style.css" rel="stylesheet" />
		<script type="text/javascript" src="../Shared/js/jquery-1.11.0.min.js"></script>
		<script type="text/javascript" src="startpage.js"></script>

		<script>
			setupLogin();
		</script>
</head>
<body>
    <header>
    	<nav id="navigate">
        	<!--<img src="css/svg/Up.svg">-->
        </nav>
        <div id="title">
        	<h1>LenaSYS</h1>
        </div>
        <nav id="user">
        	<span>Inloggad: Test</span>
        	<img src="../CodeViewer/icons/Man.svg" onclick="loginbox();">
        </nav>
    </header>
    <div id="content">
    	<div style="width:50px; height:50px; background-color:red; float:right; cursor:pointer;">add</div>
<?php
	include_once("../../coursesyspw.php");	
	include_once("basic.php");
	dbConnect();

	courselist();
	
?>
	</div>
<?php
	loginwins();
?>			
</body>
</html>