<?php 
include_once "basic.php";
?>

<!-- Navigation Header! -->
<div class="duggasys-head--placeholder"></div>
<header class="duggasys-head clearfix">
	<nav class="duggasys-head--nav">
		<?php if ($noup == "COURSE"): ?>
		<a href="courseed.php">
			<img src="../Shared/icons/Up.svg" alt="Back icon" class="duggasys-head__backicon">
			<span class="duggasys-head__backtext">Back</span>
		</a>
		<?php elseif($noup == "SECTION"): ?>
		<?php
			$cid = getOPG('cid');
			$coursevers = getOPG('coursevers');
		?>
			<a href="<?php echo 'sectioned.php?courseid=' . $cid .'&coursevers=' . $coursevers ?>">
				<img src="../Shared/icons/Up.svg" alt="Back icon" class="duggasys-head__backicon">
				<span class="duggasys-head__backtext">Back</span>
			</a>
		<?php else: ?>
		<?php echo "Something went wrong with navigation."; ?>
		<?php endif ?>
	</nav>
	<div class="duggasys-head--userinfo">
		<?php if (checklogin()): ?>
			<label id="userName" class="duggasys-head__username">
				<?php echo (isset($_SESSION['loginname']) ? $_SESSION['loginname'] : "No login name set in session"); ?>
			</label>
			<div id="loginbutton" onclick="processLogout('<?php echo $loginvar; ?>')">
				<img src="../Shared/icons/Man.svg" class="loggedin duggasys-head__profileicon" alt="Back button">
			</div>
		<?php else: ?>
			<label id="userName">Guest</label>
			<div id="loginbutton">
				<img src="../Shared/icons/Man.svg" class="duggasys-head__profileicon" alt="Back button" onclick="showLoginPopup()">
			</div>
			
		<?php endif ?>
	</div>
</header>