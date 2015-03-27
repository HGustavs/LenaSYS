<?php

?>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
 	<title>WEBUG - Program outline</title>

    <!-- Bootstrap -->

	<!-- My Bootstrap override -->
	<link href="studentfollowup.css" rel="stylesheet">
    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="jquery-1.11.0.min.js"></script>
    <script src="js/connectorLib.js"></script>
	<script src="studentfollowup.js"></script>

  </head>
  <body>
  	<nav class="my-nav">
      <a href="index.html">WEBUG</a>
      <div class="my-input-group">
         <input type="text" class="form-control" placeholder="Program" name="studyprogram" id="studyprogram">
         <button type="button" onclick="loadData(studyprogram.value, null);">Sök</span></button>            
         <input type="text" class="form-control" placeholder="Pnr" name="pnr" id="pnr">
         <button type="button" onclick="loadData(null,pnr.value);">Sök</span></button>            
      </div>
</nav>
<!--<div><button type="button" onclick="loadXMLDoc()">Change Content</button></div>-->
<div class="my-container-fluid">
	<div class="my-col-xs-4">
		<div class="panel panel-default">
		  <div class="panel-heading">
		    <h3 class="panel-title">Year 1 (Fall2013/Spring2014)</h3>
		  </div>
		  <div id="year1-body" class="panel-body">
		  </div>
		</div>
	</div>
	<div class="my-col-xs-4">
		<div class="panel panel-default">
			<div class="panel-heading">
		    	<h3 class="panel-title">Year 2 (Fall2014/Spring2015)</h3>
			</div>
			<div id="year2-body" class="panel-body">
			</div>		
		</div>
	</div>
	<div class="my-col-xs-4">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h3 class="panel-title">Year 3 (Fall2015/Spring2016)</h3>
			</div>
			<div id="year3-body" class="panel-body">
			</div>		
		</div>
	</div>
			
	</div>

  </body>
</html>
