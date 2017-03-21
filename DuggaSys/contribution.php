<?php
session_start();
include_once "../../coursesyspw.php";
include_once "../Shared/sessions.php";
pdoConnect();
?>

<!DOCTYPE html>
<html>
<head>
	<link rel="icon" type="image/ico" href="../Shared/icons/favicon.ico"/>
	<meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>Section Editor</title>

	<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
	<!--<link type="text/css" href="../Shared/css/responsive.css" rel="stylesheet">-->
	<link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">

	<script src="../Shared/js/jquery-1.11.0.min.js"></script>
	<script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
	<script src="../Shared/dugga.js"></script>
	<script src="contribution.js"></script>
	
   <style>
 
   		.fumho th{
   				background:#620;
   				color:#fff;
   				font-family:Arial;
   				font-weight: bold;
   		}
   	
			.contribheading{
					background:#FFF8A5;
					box-shadow:1px 1px 6px rgba(0,0,0,0.6);
					border-radius: 4px 6px 0px 0px;
					max-width:400px;
					overflow:hidden;
					margin-top:8px;
			}

			.contribcontent{
					position:relative;
					background:#FFF8A5;
					margin-bottom:10px;
					margin-top:4px;
					z-index:3000;
					box-shadow:1px 1px 6px rgba(0,0,0,0.6);					
					padding-left:8px;
					width:400px;
			}
			
			.contrib{
					font-family: Arial Narrow,Arial,sans-serif;
					font-size:14px;

					padding-bottom:10px;
					padding-top:10px;
					padding-left:8px;
					padding-right:8px;
					width:400px;
			}
			
			.contribfile{
					color:#521;
			}

			.contribpath{
					color:#252;
			}
			
			.createissue{
					color:#247;
			}

			.contentissue{
					color:#472;
					padding-left:20px;
					padding-right:10px;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
			}
						
			table {
			    border-collapse: collapse;
			    font-family: Arial Narrow;
			}

			.fumho td{
					padding-left:8px;
					padding-right:8px;
					border-right:2px dotted rgba(0,0,0,0.2);'			
			}

			.fumho tr:nth-child(even) {
					background-color:#e8e8e8;
			}

			.fumho tr:nth-child(odd) {
					background-color:#fff;
			}
												
   </style>

</head>
<body>

	<?php
		$noup="COURSE";
		include '../Shared/navheader.php';
	?>

	<!-- content START -->
	<div id="content">
	
	</div>
	<!-- content END -->

	<?php
		include '../Shared/loginbox.php';
	?>

</body>
</html>
