<?php
session_start();
include_once "../../coursesyspw.php";
include_once "../Shared/sessions.php";
pdoConnect();

if (file_exists("../.git/refs/heads/master")) {
	$versionFile = fopen("../.git/refs/heads/master", "r");
	$version = fgets($versionFile);
	fclose($versionFile);
} else {
	$version = "v0.7+";
}
?>
<!DOCTYPE html>
<html>
<head>
	<link rel="icon" type="image/ico" href="../Shared/icons/favicon.ico"/>
	<meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>Course Editor</title>

	<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
	<link type="text/css" href="../Shared/css/responsive.css" rel="stylesheet">
	<link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">

	<script src="../Shared/js/jquery-1.11.0.min.js"></script>
	<script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
	<script src="../Shared/dugga.js"></script>
	<script src="courseed.js"></script>
</head>
<body>

	<?php
	$noup="NONE";
	$loginvar="COURSE";
	include '../Shared/navheader.php';
	setcookie("loginvar", $loginvar);
	?>

	<!-- content START -->
	<div id="content">
		<!-- Section List -->
		<div id='threadHeader'>
			<div id="threadTopic">
					DV12G HT15: PHP Example 1

					<div id="threadOptions">
						<input class="new-item-button" type="button" value="Delete">
						<input class="new-item-button" type="button" value="Edit">
						<input class="new-item-button" type="button" value="Lock">
					</div>
			</div>


			<div id="threadDescr">
				<p> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. </p>
				<p> Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. </p>
			</div>
			<div id="threadDetails">
				Skapad <span id="threadDate">3 mar 2016</span> av <span id="threadCreator">John Doe</span>
			</div>
		</div>

		<div id="threadComments">
			<div id="threadCommentsTitle">
				Kommentarer (2)
			</div>

			<div class="threadComment">
				<div class="commentDetails">
					<span id="commentUser">d13berli</span>
				</div>
				<div class="commentContent">
						<p> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. </p>
				</div>
				<div class="commentDate"> 07:30 4 mar 2016 </div>
			</div>

			<div class="threadComment replyComment">
				<div class="commentDetails">
					<span id="commentUser">a13josaf</span>
				</div>
				<div class="commentContent">
						<p> Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident. </p>
				</div>
				<div class="commentDate"> 14:10 4 mar 2016 </div>
			</div>
		</div>
	</div>





	<!-- version identification -->
	<div id="version" class='version'>Master hash <br /><?php echo $version ?></div>
	<!-- content END -->
	<?php
	include '../Shared/loginbox.php';
	?>

</body>
</html>
