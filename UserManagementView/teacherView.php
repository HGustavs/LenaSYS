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
        <script src="usermanagementview.js"></script>
        <script type="text/javascript" src="usermanagementviewjquery.js"></script>
        <script type="text/javascript" src="../Shared/dugga.js"></script>
    </head>

<body>

  	<?php 
		$noup="NONE";
		$loginvar="COURSE"; 
		include '../Shared/navheader.php';
	?>

	<?php
		include '../Shared/loginbox.php';
	?>
		
       
	<div id="contentUMV">
	
            
        <!-- Dropdownmenu -->
        <nav class="rightDropdownMenu">
        	<ul>
        		<li><a href="#" >Program 1</a>
        			<ul>
        				<li><a href="#">År 1</a></li>
        				<li><a href="#">År 2</a></li>
        				<li><a href="#">År 3</a></li>
        			</ul>
        		</li>
        		<li><a href="#" >Program 2</a>
        			<ul>
        				<li><a href="#">År 1</a></li>
        				<li><a href="#">År 2</a></li>
        				<li><a href="#">År 3</a></li>
        			</ul>
        		</li> 
        	</ul> 
        </nav>      
       		        
        <!-- Searchfield -->
        <div class="searchfieldTV clearfix">
             	<input type="text" class="my-pull-left " placeholder=" Sök..." name="studyprogram/Pnr" id="studyprogram/Pnr">
             	<div class="button my-pull-left " onclick="loadData(studyprogram.value,pnr.value);">Sök</span></div>
        </div>
    
        <!-- ProgramName -->
        <div class="programName">
        </div> 
        
        
        <!-- Linegraph -->
        <div class="lineGraph">
        </div>
        
        
        <!-- Large progressbar -->
        <div class="largeProgressbarTV">
        </div> 
        
        
        <!-- View over the students how are going that program/course -->
        <div class="studentCourseViewTV">
        </div> 
        
        
        <!-- Individual course progressbars -->
        <div class="indivCourseProgressbarsTV">
        </div> 
        
        
        <!-- Change pages -->
        <div class="changePages">
        </div> 

	</div>



</body>

</html>
