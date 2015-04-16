<?php
	session_start();
	include_once "../../coursesyspw.php";
	include_once "../Shared/sessions.php";
	pdoConnect();
?>

<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>LenaSYS User Editor</title>

		<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
		<link href="usermanagementview.css" rel="stylesheet">
		
		<script src="../Shared/js/jquery-1.11.0.min.js"></script>
		<script src="../Shared/dugga.js"></script>
		<script src="usermanagementview.js"></script>

  </head>
  
  <body>
  
	<?php 
		$noup="NONE";
		$loginvar="UMVSTUDENT"; 
		include '../Shared/navheader.php';
	?>
	
	<?php
		include '../Shared/loginbox.php';
	?>
		

	<div id="content">
		
		<div id="studentTitle">

		</div>
	
		<div id="MainProgress">
		
			<div id="completedMainProgress">
			
				<div id="ProgressbarG1N">
					<div id="completedProgressbarG1N"></div>
				</div>
			
				<div id="ProgressbarG1F">
					<div id="completedProgressbarG1F"></div>
				</div>
			
				<div id="ProgressbarG2F">
					<div id="completedProgressbarG2F"></div>
				</div>
			
			</div>
			
		</div>
		

		<div id="YearContainer">
		
			
			<div id="Year1" class="Year">
				
			</div>
		
			<div id="Year2" class="Year">

			</div>
	
			<div id="Year3" class="Year">

			</div>
		
		</div>
	
	</div>


  </body>
</html>
