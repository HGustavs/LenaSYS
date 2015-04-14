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
	?>
		
       
	<div id="content">
			
            
        <!-- Dropdownmenu -->
        <nav class="rightDropdownMenu my-pull-right">
            <ol>
                <li><a href="#" > Program </a> 
                	<ul>
                      <li><a href="#" > År 1 </a> </li>
                      <li><a href="#" > År 2 </a> </li>
                      <li><a href="#" > År 3 </a> </li>
                  </ul>
                </li>
                
                <li><a href="#" > Program </a> </li>
            </ol>
        </nav>     
        
        
        <!-- Searchfield -->
        <div class="my-nav clearfix">
          <div class="my-input-group my-pull-right">
             <button type="button" class="my-pull-right " onclick="loadData(studyprogram.value,pnr.value);">Sök</span></button>            
             <input type="text" class="form-control my-pull-right " placeholder="WEBUG12h/Pnr" name="studyprogram/Pnr" id="studyprogram/Pnr">
          </div>
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
