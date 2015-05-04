<?php
	if(session_status() == PHP_SESSION_NONE){
		header("Location: ../Shared/loginprompt.php");
	}
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
        
        
        <div class="totalInfo">
			
            	<!-- Filter (Radiobuttons) -->
				<div id="radio_buttonToolbar">
                    <form>
                    	<input type="radio" id="allStudents" name="filterList" value="allStudents" checked>
                        	<label for="allStudents"><span></span>Alla studenter</label>
						<input type="radio" id="activeStudents" name="filterList" value="activeStudents">
                        	<label for="activeStudents"><span></span>Aktiva studenter</label>
                    </form>
				</div>
                
                <!-- View over the students how are going that program/course -->
                <div class="studentInfoWrapper">
                    <div id="studentslist">
                    </div>
				</div>
		
            
            <!-- Change pages buttons-->
            <div class="changePages">
                <p>Sida</p>
                <div>1</div>
                <div>2</div>
                <div>3</div>
                <div id="nextPage"> >> </div> 
            </div> 
        
        </div>
       
	</div>


    <script src="js/teacherView.js"></script>
    <script type="text/javascript" src="js/umvjquery.js"></script>

</body>

</html>
