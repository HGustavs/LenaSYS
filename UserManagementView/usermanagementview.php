<?php
// if no session is active prompt for login and redirect to start page
// to prevent access using direct address.
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

	<!-- My Bootstrap override -->
	<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
	<link href="usermanagementview.css" rel="stylesheet">
        <script src="../Shared/js/jquery-1.11.0.min.js"></script>
	<script src="usermanagementview.js"></script>
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
		
	<!-- content START -->
	<div id="content">
			
	<!-- Section List -->
	
  	<nav class="my-nav clearfix">
      <div class="my-input-group my-pull-right">
         <button type="button" class="my-pull-right " onclick="loadData(studyprogram.value, null);">Sök</span></button>            
         <input type="text" class="form-control my-pull-right " placeholder="WEBUG12h" name="studyprogram" id="studyprogram">
         <button type="button" class="my-pull-right " onclick="loadData(null,pnr.value);">Sök</span></button>            
         <input type="text" class="form-control my-pull-right " placeholder="Pnr" name="pnr" id="pnr">
      </div>
	</nav>

<div class="my-container-fluid clearfix">
	<div class="my-col-xs-4">
		<div class="panel panel-default">
		  <div class="panel-heading">
		    <h3 class="panel-title">Year 1 <span class="my-pull-right small">Fall2013/Spring2014</span></h3>
		  </div>
		  <div id="year1-body" class="panel-body">
		  </div>
		</div>
	</div>
	<div class="my-col-xs-4">
		<div class="panel panel-default">
			<div class="panel-heading">
		    	<h3 class="panel-title">Year 2 <span class="my-pull-right small">Fall2014/Spring2015</span></h3>
			</div>
			<div id="year2-body" class="panel-body">
			</div>		
		</div>
	</div>
	<div class="my-col-xs-4">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h3 class="panel-title">Year 3 <span class="my-pull-right small">Fall2015/Spring2016</span></h3>
			</div>
			<div id="year3-body" class="panel-body">
			</div>		
		</div>
	</div>
			
	</div>
	</div>
	
	<!-- content END -->

  </body>
</html>
