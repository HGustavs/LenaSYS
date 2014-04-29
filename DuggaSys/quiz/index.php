<?php
include_once(dirname(__FILE__) . "/../../../coursesyspw.php");
include_once(dirname(__FILE__) . "/../basic.php");

session_start();
dbConnect();
?>
<!DOCTYPE html>
<html>
<head>
	<title>titel</title>
	<link type="text/css" href="css/style.css" rel="stylesheet">
	<link type="text/css" href="css/jquery-ui-1.10.4.min.css" rel="stylesheet">
	<script src="js/jquery-1.11.0.min.js"></script>
	<script src="js/jquery-ui-1.10.4.min.js"></script>
	<script src="js/function.js"></script>
</head>
<body>
	<header>
		<nav id="navigate">
			<img src="css/svg/Up.svg">
			<img onclick="historyBack()" src="css/svg/SkipB.svg">
		</nav>
		<div id="title">
			<h1></h1>
		</div>
		<nav id="user">
			2xErik
			<img src="css/svg/Man.svg">
		</nav>
	</header>
	<div id="content">
	</div>
</body>
</html>
