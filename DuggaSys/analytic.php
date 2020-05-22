<?php
session_start();

// Show analytics if user is superuser, otherwise redirect them to courseed.
if(!isset($_SESSION["superuser"]) || $_SESSION["superuser"] != 1) {
	header('Location: courseed.php');
}

include_once "../../coursesyspw.php";
include_once "../Shared/sessions.php";
pdoConnect();

$css = array(
	'style.css',
	'jquery-ui-1.10.4.min.css',
	'analytics.css',
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
	<script src="https://kit.fontawesome.com/5aee74955a.js" crossorigin="anonymous"></script>
</head>
<body>

<?php
	$noup="NONE";
	$loginvar="ANALYTIC";
	setcookie("loginvar", $loginvar);
	include '../Shared/navheader.php';	
?>
<div class='hamburgerDropdown'>
	<ol class='hamburgerList'>
		<li class="navButt analytic-navbutton" id="GeneralStats"><a onclick="loadGeneralStats()"><i class="fas fa-stream"></i></a><span class="navcomment">General Stats</span></li>
		<li class="navButt analytic-navbutton" id="CurrentlyOnline"><a onclick="loadCurrentlyOnline()"><i class="fas fa-users"></i></a><span class="navcomment">Currently Online</span></li>
		<li class="navButt analytic-navbutton" id="PasswordGuessing"><a onclick="loadPasswordGuessing()"><i class="fas fa-key"></i></a><span class="navcomment">Password Guessing</span></li>
		<li class="navButt analytic-navbutton" id="OSPercentage"><a onclick="loadOsPercentage()"><i class="fas fa-laptop"></i></a><span class="navcomment">OS Percentage</span></li>
		<li class="navButt analytic-navbutton" id="Browserpercentage"><a onclick="loadBrowserPercentage()"><i class="fa fa-chrome"></i></a><span class="navcomment">Browser percentage</span></li>
		<li class="navButt analytic-navbutton" id="Serviceusage"><a onclick="loadServiceUsage()"><i class="fas fa-chart-line"></i></a><span class="navcomment">Service usage</span></li>
		<li class="navButt analytic-navbutton" id="Servicespeed"><a onclick="loadServiceAvgDuration()"><i class="fas fa-tachometer-alt"></i></a><span class="navcomment">Service speed</span></li>
		<li class="navButt analytic-navbutton" id="Servicecrashes"><a onclick="loadServiceCrashes()"><i class="fas fa-car-crash"></i></a><span class="navcomment">Service crashes</span></li>
		<li class="navButt analytic-navbutton" id="Fileinformation"><a onclick="loadFileInformation()"><i class="fas fa-file-pdf"></i></a><span class="navcomment">File information</span></li>
		<li class="navButt analytic-navbutton" id="Pageinformation"><a onclick="loadPageInformation()"><i class="fas fa-globe-europe"></i></a><span class="navcomment">Page information</span></li>
		<li class="navButt analytic-navbutton" id="Userinformation"><a onclick="loadUserInformation()"><i class="fas fa-user"></i></a><span class="navcomment">User information</span></li>
		<li class="navButt analytic-navbutton" id="CourseDiskUsage"><a onclick="loadCourseDiskUsage()"><i class="fas fa-hdd"></i></a><span class="navcomment">Course disk usage</span></li>
	</ol>
</div>

<div class="header">
  <h1 id="pageTitle"></h1>
</div>

<!-- content START -->
<div id="content">
	<div id="analytic-info"></div>
	<div id="canvas-area"></div>
</div>
<!-- content END -->