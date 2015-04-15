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
		

	<div id="contentUMV">
    
    
        <!-- Dropdownmenu -->
        <nav class="rightDropdownMenu">
        	<ul>
        		<li><a href="#" >Nuvarande år</a></li>
        		<li><a href="#" >Tidigare år</a></li>
        	</ul> 
        </nav>  
			
        <!-- Section List -->
        <div class="my-container-fluid clearfix"> <!--Whole div that hold the text inside, the green-div-->
        
            <div class="my-col-xs-4"> <!--Div for the Year 1-->
                <div class="panel panel-default">
                  <div class="panel-heading">
                    <h3 class="panel-title">Year 1 <span class="my-pull-right small">Fall2013/Spring2014</span></h3>
                  </div>
                  <div id="year1-body" class="panel-body">
                  </div>
                </div>
            </div> <!--end of Year 1-->
            
            
            <div class="my-col-xs-4"><!--Div for the Year 2-->
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h3 class="panel-title">Year 2 <span class="my-pull-right small">Fall2014/Spring2015</span></h3>
                    </div>
                    <div id="year2-body" class="panel-body">
                    </div>		
                </div>
            </div><!--end of Year 2-->
            
            
            <div class="my-col-xs-4"><!--Div for the Year 3-->
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h3 class="panel-title">Year 3 <span class="my-pull-right small">Fall2015/Spring2016</span></h3>
                    </div>
                    <div id="year3-body" class="panel-body">
                    </div>		
                </div>
            </div> <!--end of Year 3-->
                    
            </div> <!--The green-div ends here-->
 	
    </div>

  </body>
</html>
