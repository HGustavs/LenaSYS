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
	<meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome = 1">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>Section Editor</title>

	<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
	<link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">

	<script src="../Shared/js/jquery-1.11.0.min.js"></script>
	<script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
	<script src="../Shared/dugga.js"></script>
	<script src="diagram.js"></script>
	<script src="diagram_symbol.js"></script>
	<script src="diagram_figure.js"></script>
    <script src="diagram_example.js"></script>

   <style>

   </style>

</head>
<!-- Reads the content from the js-files -->
<!-- updategfx() must be last -->
<body onload="initcanvas(); Symbol(); canvassize(); updategfx();">

	<?php
		$noup="COURSE";
		include '../Shared/navheader.php';
	?>

	<!-- content START -->
	<div id="content">



	</div>

	<!-- The Appearance menu. Default state is display: none; -->
	<div id="appearance" class='loginBox' style='display:none;'>
		<div class='loginBoxheader'>
			<h3>Apperance</h3>
			<div onclick='closeAppearanceDialogMenu()'>x</div>
		</div>
		<div class='table-wrap'>
			<div id="f01">
            </div>
		</div>
	</div>

	<!-- content END -->

	<?php
		include '../Shared/loginbox.php';
	?>

</body>
</html>
