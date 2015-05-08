<?php
	include_once "../../coursesyspw.php";
	include_once "../Shared/sessions.php";
	// continue if logged in, else redirect to loginprompt
	session_start();
	if(!checklogin()){
		header("Location: ../Shared/loginprompt.php");
	}
	pdoConnect();
?>

<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>LenaSYS User Editor</title>
		
        <link rel="stylesheet" type="text/css" href="css/progressbar2.css">
		
        <link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
		<link href="css/umv.css" rel="stylesheet">
        <link href="css/studentView.css" rel="stylesheet">
		
		<script src="../Shared/js/jquery-1.11.0.min.js"></script>
        <script src="../Shared/dugga.js"></script>
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
		
	<!-- content START -->
	<div id="contentUMV">
		<!-- Student name and clas Title --> 
		<div id="studentTitle">

		</div>
		<!-- Students progressbar, completed credits in percent out of total -->
		<div class="mainProgressBarcontainer">
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
		</div>
		
		<!-- View over the student courses/ school year  -->
		<div id="YearContainer">
		
			
			<div id="Year1" class="Year">
				
			</div>
            
            <div id="Year3" class="Year">

			</div>
		
			<div id="Year2" class="Year">

			</div>
	
		
		</div>
	
	</div>

    <script src="js/studentView.js"></script>
    <script type="text/javascript" src="js/umvjquery.js"></script>
    
  </body>
</html>
