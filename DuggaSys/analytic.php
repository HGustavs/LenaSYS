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
<div class="header">
  <h1 id="pageTitle"></h1>
</div>

<!-- content START -->
<div id="content">
	<div id="analytic-info"></div>
	<div id="canvas-area"></div>
</div>
<!-- content END -->