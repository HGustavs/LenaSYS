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
        
        <link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
        <link href="css/umv.css" rel="stylesheet">
        
        <script src="../Shared/js/jquery-1.11.0.min.js"></script>
        <script type="text/javascript" src="../Shared/dugga.js"></script>
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
		
    <!-- content START -->   
	<div id="contentUMV">
            
        <!-- Dropdownmenu -->
        <nav class="rightDropdownMenu" id="DropdownMenu">
        	
        </nav>      
       		        
        <!-- Searchfield -->
        <div class="searchfieldTV clearfix">
             	<input type="text" class="my-pull-left " placeholder=" Search..." name="studyprogram/Pnr" id="studyprogram/Pnr">
             	<div class="button my-pull-left " onclick="loadData(studyprogram.value,pnr.value);">Search</span></div>
        </div>
    
        <!-- ProgramName -->
        <div id="title" class="programName">
        </div> 
        
        
        <!-- Linegraph -->
        <div id="graphContainer" class="lineGraph">
            <canvas id="graph" width="900" height="150">
            </canvas>
        </div>
        
        
        <!-- Large progressbar -->
        <div class="largeProgressbarTV">
        </div> 
        
        
        <div class="totalInfo">
			
            	<!-- Filter (Radiobuttons) -->
				<div id="radio_buttonToolbar">
                    <form>
                    	<input type="radio" id="allStudents" name="filterList" value="allStudents" checked>
                        	<label for="allStudents"><span>All students</span></label>
						<input type="radio" id="activeStudents" name="filterList" value="activeStudents">
                        	<label for="activeStudents"><span>Active students</span></label>
                    </form>
				</div>
                
                <!-- View over the students how are going that program/course -->
                <div class="studentInfoWrapper">
                    <div id="studentslist">
                    </div>
				</div>
		
            
            <!-- Change pages buttons-->
            <div id="teacher_pages"> 
            </div> 
        
        </div>
       
	</div>


    <script src="js/teacherView.js"></script>
    <script type="text/javascript" src="js/umvjquery.js"></script>

</body>

</html>
