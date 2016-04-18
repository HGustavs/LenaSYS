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
	<meta http-equiv="X-UA-Compatible" content="IE=edge"> 
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>Section Editor</title>

	<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
	<!--<link type="text/css" href="../Shared/css/responsive.css" rel="stylesheet">-->
	<link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">  

	<script src="../Shared/js/jquery-1.11.0.min.js"></script>
	<script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
	<script src="../Shared/dugga.js"></script>
	<script src="forum.js"></script>
</head>
<body>

	<?php
		$noup="COURSE";
		$loginvar="SECTION"; 
		include '../Shared/navheader.php';
		setcookie("loginvar", $loginvar);
	?>
	
	<!-- content START -->
	<div id="content">
		<!-- Section List -->
		<div id='Sectionlist'>
			<div class="course">
				<div id="course-coursename" style="display: inline-block; margin-right:10px;">Forum</div>
			</div>
			<div class="coursesForForum"><?php include 'forumCourses.php';?></div>
			<button id="awesomethreadbutton" onclick="createThread();" style="width: 50px; height: 35px;"></button>
		</div>
	</div>
	<!-- content END -->

	<?php 
		include '../Shared/loginbox.php';
	?>		
</body>
</html>
