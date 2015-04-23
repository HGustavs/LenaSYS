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

        <script type="text/javascript" src="usermanagementviewjquery.js"></script>
        <script type="text/javascript" src="../Shared/dugga.js"></script>
        <script src="teachermanagementview.js"></script>
    </head>

<body>

  	<?php 
		$noup="NONE";
		$loginvar="UMVTEACHER"; 
		include '../Shared/navheader.php';
	?>

	<?php
		include '../Shared/loginbox.php';
	?>
		
       
	<div id="contentUMV">
	
            
        <!-- Dropdownmenu -->
        <nav class="rightDropdownMenu" id="DropdownMenu">
        	
        </nav>      
       		        
        <!-- Searchfield -->
        <div class="searchfieldTV clearfix">
             	<input type="text" class="my-pull-left " placeholder=" Sök..." name="studyprogram/Pnr" id="studyprogram/Pnr">
             	<div class="button my-pull-left " onclick="loadData(studyprogram.value,pnr.value);">Sök</span></div>
        </div>
    
        <!-- ProgramName -->
        <div id="title" class="programName">
        </div> 
        
        
        <!-- Linegraph -->
        <div class="lineGraph">
        </div>
        
        
        <!-- Large progressbar -->
        <div class="largeProgressbarTV">
        </div> 
        
        <div id="totalInfo">
        
			<!-- View over the students how are going that program/course -->
			<div class="studentCourseViewTV">
				<div id="radio_buttonToolbar">
				</div>
				<div id="studentslist">
				</div>
		
			</div> 
		
		
			<!-- Individual course progressbars -->
			<div class="indivCourseProgressbarsTV">
		
				<div id="radio_buttonCourse">
				</div>
			
				<div id="small_progressbar">
				</div>
			
			</div> 
        
        </div>
        
        
        <!-- Change pages -->
        <div class="changePages">
        	<p>Sida</p>
            <div>1</div>
            <div>2</div>
            <div>3</div>
            <div id="nextPage"> >> </div> 
        </div> 

	</div>



</body>

</html>
