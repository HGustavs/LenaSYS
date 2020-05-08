<?php
session_start();
include_once "../../coursesyspw.php";
include_once "../Shared/sessions.php";
pdoConnect();

$css = array(
	'style.css',
	'jquery-ui-1.10.4.min.css'
);

$js = array(
	'jquery-1.11.0.min.js',
	'jquery-ui-1.10.4.min.js'
);

// refreshes session cookies, thereby extending the time before users sees the alert or get logged out
// refreshes takes place when navigating to codeviewer.php, courseed.php, and sectioned.php
setcookie("sessionEndTime", "expireC", time() + 2700, "/"); // Alerts user in 45min
setcookie("sessionEndTimeLogOut", "expireC", time() + 3600, "/"); // Ends session in 60min, user gets logged out

?>

<!DOCTYPE html>
<html>
<head>
	<link rel="icon" type="image/ico" href="../Shared/icons/favicon.ico"/>
	<meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>Analytic Tool</title>
	<?php
		foreach($css as $filename) {
			$filemtime = filemtime('../Shared/css/' . $filename);
			echo "<link rel='stylesheet' type='text/css' href='../Shared/css/$filename?$filemtime'/>";
		}
	
		foreach($js as $filename) {
			$filemtime = filemtime('../Shared/js/' . $filename);
			echo "<script type='text/javascript' src='../Shared/js/$filename?$filemtime'/></script>";
		}

		$filemtime = filemtime('../Shared/dugga.js');
		echo "<script type='text/javascript' src='../Shared/dugga.js?$filemtime'></script>";
				
		$filemtime = filemtime('analytic.js');
		echo "<script type='text/javascript' src='analytic.js?$filemtime'></script>";
	?>
</head>
<body>

<?php

	$noup="NONE";
	$loginvar="ANALYTIC";
	include '../Shared/navheader.php';
	setcookie("loginvar", $loginvar);
	
	// Show analytics if user is superuser.
	if(isset($_SESSION["superuser"]) && $_SESSION["superuser"] == 1){
?>
	<!-- content START -->
	<div id="content">
		<div class="analytic-buttons">
			<input class="submit-button" style="float:left" type="button" value="General stats" onclick="loadGeneralStats()">
			<input class="submit-button" style="float:left" type="button" value="Password guessing" onclick="loadPasswordGuessing()">
			<input class="submit-button" style="float:left" type="button" value="OS Percentage" onclick="loadOsPercentage()">
			<input class="submit-button" style="float:left" type="button" value="Browser percentage" onclick="loadBrowserPercentage()">
			<input class="submit-button" style="float:left" type="button" value="Service usage" onclick="loadServiceUsage()">
			<input class="submit-button" style="float:left" type="button" value="Service speed" onclick="loadServiceAvgDuration()">
			<input class="submit-button" style="float:left" type="button" value="Service crashes" onclick="loadServiceCrashes()">
			<input class="submit-button" style="float:left" type="button" value="File information" onclick="loadFileInformation()">
			<input class="submit-button" style="float:left" type="button" value="Page information" onclick="loadPageInformation()">
			<input class="submit-button" style="float:left" type="button" value="User information" onclick="loadUserInformation()">
		</div>
		<div id="analytic-info" style="clear: both; padding: 15px;"></div>
		<div id="canvas-area" style="height: 300px;">
		</div>
		
	</div>
	<!-- content END -->
	
<?php
	}	
	else{
		header('Location: courseed.php');
	}
?>