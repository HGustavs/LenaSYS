<?php
session_start();
include_once "../../coursesyspw.php";
include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";
pdoConnect();
$cid=getOPG('cid');
$vers=getOPG('coursevers');
?>

<!DOCTYPE html>
<html>
<head>
	<link rel="icon" type="image/ico" href="../Shared/icons/favicon.ico"/>
	<meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>Contribution</title>


	<!--<link type="text/css" href="../Shared/css/responsive.css" rel="stylesheet">-->
	<link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">

	<script src="../Shared/js/jquery-1.11.0.min.js"></script>
	<script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
	<script src="../Shared/dugga.js"></script>
	<script src="contribution.js"></script>
	<script src="../Shared/SortableTableLibrary/sortableTable.js"></script>
	<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">

<!--the inline CSS was moved to the file shared/css/style.css-->

</head>
<body onload="loadContribFormLocalStorage()">
	<div id="infoText" style="background-color:#ffffff; border:1px solid black; top:100px; display:none;position:absolute;"></div>

	<!-- content START -->
	<div id="content"></div>
	
	<div id='commitDiv' style=' position: absolute; background: #f5e7ff;box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.6); border-radius: 5px; width:500px; height: 500px; white-space: nowrap; display:none; margin-top: 15px; margin-left: 50px; z-index: 100; overflow-y:scroll;'></div>

	<div id='commitDiagram' style='margin-left: 12px; width:70%;'></div>

	<div class='group3 group1' id='personalRankTable' style='margin-left: 12px; width:50%; white-space: nowrap;'></div>

	<div class='group2 group1' id='barchart' style='margin-left: 12px; white-space: nowrap;'></div>

	<div class='group2' id='lineDiagram+select' style='margin-left: 12px; white-space: nowrap;'></div>

	<div class='group2' id='hourlyGraph' style='margin-left: 12px; white-space: nowrap;'></div>

	<div class='group3' id='contribGithHubContribTable'style='margin-left: 12px; width:50%; white-space: nowrap;'></div>

	<div class='group3' id='allRankTable' style='margin-left: 12px; width:50%; white-space: nowrap;'></div>

	<div class='group3' id='contribTsTable' style='margin-left: 12px; width:50%; white-space: nowrap;'></div>


	
	<!-- content END -->

	<?php
		include '../Shared/loginbox.php';

		if(!checklogin()) // If not logged in, force a log in
		{
			echo '<script> forceUserLogin(); </script>';
		}
	?>

</body>
</html>
