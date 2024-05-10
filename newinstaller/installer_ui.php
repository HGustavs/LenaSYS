<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Installer Progress</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
	<link rel="stylesheet" type="text/css" href="style.css">
	<?php include 'tools/components.php'; ?>
	<script defer src="installer_ui.js"></script>
	<script defer src="tools/components.js"></script>
	<script defer src="tools/sse_receiver.js"></script>
</head>
<body>
	
	<div id="page1" class="page">
		<div class="banner">
			<h1 class="header-1">Welcome to <b>LenaSYS</b></h1>
		</div>
		<div class="wrapper">
			<?php breadcrumb(5, 1); ?>
			<div class="content">
				<?php header2("Select your OS installer"); ?>
				<div class="inner-wrapper">
					<?php
						$buttons = [
							'windows' => 'Windows',
							'linux' => 'Linux',
							'mac' => 'Mac OS'
						];
						
						radioButtons('os-installer', $buttons, 'windows');
					?>
				</div>
			</div>
			<?php navigationButtons(1, 2); ?>
		</div>
	</div>

	<div id="page2" class="page">
		<div class="banner">
			<h1 class="header-1">Welcome to <b>LenaSYS</b></h1>
		</div>
		<div class="wrapper">
			<?php
				breadcrumb(5, 2);
			?>
			<div class="content">
				<?php
					header2("Select installation options");
				?>
				<div class="inner-wrapper">
					<?php
						$buttons = [
							'create-db' => 'Create new MySQL DB',
							'create-user' => 'Create new MySQL user'
						];
						$active = ['create-db', 'create-user'];

						checkBoxes('creation-settings', $buttons, $active);
					?>
				</div>
			</div>
			<?php
				navigationButtons(1, 3);
			?>
		</div>
	</div>

	<div id="page3" class="page">

	</div>

	<div id="page4" class="page">

	</div>

	<div id="page5" class="page">

	</div>

</body>
</html>