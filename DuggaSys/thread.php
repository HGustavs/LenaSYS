 <?php
session_start();
include_once "forumservice.php";

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
	<script src="forum.js"></script>
  <script type="text/javascript">
    $(document).ready(function(){
      initThread();
    });
  </script>

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
			<div id="threadTopicWrapper">
				<div class="threadTopic"></div>
				<div id="threadOptions"></div>
			</div>


			<div id="threadDescr"></div>
			<div id="threadDetails">
				Created <span id="threadDate">3 mar 2016</span> by <span id="threadCreator">a97marbr</span>
			</div>
		</div>

		<div class="threadMakeComment">
			<div class="makeCommentHeader">
				Comment
			</div>
			<div class="makeCommentInputWrapper">
				<textarea class="commentInput" name="commentInput" placeholder="Leave a comment"></textarea>
				<input class="submit-button commentSubmitButton" type="button" value="Submit" onclick="makeComment();">
			</div>
		</div>

		<div id="threadComments"></div>
	</div>

	<!-- version identification -->
	<div id="version" class='version'>Master hash <br /><?php echo $version ?></div>
	<!-- content END -->
	<?php
	include '../Shared/loginbox.php';
	?>

</body>
</html>
