<?php
session_start();
include_once "../../coursesyspw.php";
include_once "../Shared/sessions.php";
pdoConnect();
?>
<!DOCTYPE html>
<html><head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
 	<title>LenaSYS User Editor</title>

	<!-- My Bootstrap override -->
		<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
	<link href="usermanagementview.css" rel="stylesheet">
    <script src="../Shared/js/jquery-1.11.0.min.js"></script>
	<script src="usermanagementview.js"></script>

  </head>
  <body>
  
	<?php 
		$noup="NONE";
		$loginvar="COURSE"; 
		include '../Shared/navheader.php';
	?>
	
	<?php
		include '../Shared/loginbox.php';
		include 'usermanagementviewservice.php';
		
		foreach($data as $arr ){
			echo $arr['coursecode'] . " - " . $arr['coursename'] . ": " . $arr['hp'];
			echo "</br>";
		}
		
	?>
		
	<!-- content START -->
	<div id="content">
		
		<!-- Program name and name of the student-->
		<div id="studentTitle">
		</div>
		
		<!-- Progressbar for every year of the program -->
		<div id="MainProgress">
			
			<div id="ProgressbarG1N">
			</div>
			
			<div id="ProgressbarG1F">
			</div>
			
			<div id="ProgressbarG2F">
			</div>
			
		</div>
		
		<!-- Container for each year for the student-->
		<div id="Year1">

		</div>
		
		<div id="Year2">

		</div>
	
		<div id="Year3">

		</div>
	
	
  

	
	</div>
	<!-- content END -->

  </body>
</html>
