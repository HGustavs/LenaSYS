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
				<?php
					if(isSuperUser($userid)){
						echo '<div id="threadOptions">';
							echo '<input class="new-item-button" type="button" value="Delete">';
							echo '<input class="new-item-button" type="button" value="Edit">';
							echo '<input class="new-item-button" type="button" value="Lock">';
						echo '</div>';
					}else{

					}
				 ?>
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

		<div id="threadComments">
			<div id="threadCommentsHeader">
				Comment (2)
			</div>

			<div class="threadComment">
				<div class="commentDetails">
					<span id="commentUser">d13berli</span>
				</div>
				<div class="commentContent">
						<p> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. </p>
				</div>
				<div class="commentFooter">
					<input class="submit-button" type="button" value="Reply" onclick="replyUI();">
					<input class="submit-button" type="button" value="Edit" onclick="editUI();">
					<input class="submit-button" type="button" value="Delete" onclick="deleteComment();">
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
