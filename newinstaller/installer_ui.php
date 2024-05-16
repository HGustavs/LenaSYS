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
			<?php
				breadcrumb(6, 1);
			?>
			<div class="content">
				<?php 
					header2("Select your OS installer");
				?>
				<div class="inner-wrapper">
					<?php
						$buttons = [
							'windows' => 'Windows',
							'linux' => 'Linux',
							'mac' => 'Mac OS'
						];
						
						radioButtons("os-installer", $buttons, "windows");
					?>
				</div>
			</div>
			<?php
				singleNavigationButton("next", 2); 
			?>
		</div>
	</div>

	<div id="page2" class="page">
		<div class="banner">
			<h1 class="header-1">Welcome to <b>LenaSYS</b></h1>
		</div>
		<div class="wrapper">
			<?php
				breadcrumb(6, 2);
			?>
			<div class="content">
				<?php
					header2("Select installation options");
					bodyText("If this is your first time installing LenaSYS, you <u><b>must</b></u> select both options.");
				?>
				<div class="inner-wrapper">
					<?php
						$buttons = [
							'create-db' => 'Create new MySQL DB',
							'create-user' => 'Create new MySQL user'
						];
						$active = ['create-db', 'create-user'];

						checkBoxes("creation-settings", $buttons, $active);
					?>
				</div>
			</div>
			<?php
				navigationButtons(1, 3);
			?>
		</div>
	</div>

	<div id="page3" class="page">
		<div class="banner">
			<h1 class="header-1">Welcome to <b>LenaSYS</b></h1>
		</div>
		<div class="wrapper">
			<?php
				breadcrumb(6, 3);
			?>
			<div class="content">
				<?php
					header2("Create new database & user");
					bodyText("Provide the following data for the database and user");
				?>
				<div class="inner-wrapper">
					<div class="input-grid">
						<?php
							inputField("db-name", "Database name:");
							inputField("db-user", "MySQL user:");
							inputFieldWithTip('db-host', 'Hostname:', 'Tip: Usually set to "localhost"');
							inputField("db-password", "MySQL user password:");

							checkbox("distEnvironment", "Use Distributed Environment");
							checkbox("iniDatabaseTransfer", "Initialize database as transaction");
							checkboxWithWarning("overwriteDatabase", "Overwrite existing database and user names", "WARNING! Overwriting databases and users cannot be undone!");
						?>
					</div>
				</div>
			</div>
			<?php
				navigationButtons(2, 4);
			?>
		</div>
	</div>

	<div id="page4" class="page">
		<div class="banner">
			<h1 class="header-1">Welcome to <b>LenaSYS</b></h1>
		</div>
		<div class="wrapper">
			<?php
				breadcrumb(6, 4);
			?>
			<div class="content">
				<?php
					header2("Enter root user credentials");
					bodyText("Provide the credentials for the database root user");
				?>
				<div class="inner-wrapper">
					<div class="input-flex">
						<?php
							inputField("root-user", "Root username:");
							inputField("root-password", "Root password:");
						?>
					</div>
				</div>
			</div>
			<?php
				navigationButtons(3, 5);
			?>
		</div>
	</div>

	<div id="page5" class="page">
		<div class="banner">
			<h1 class="header-1">Welcome to <b>LenaSYS</b></h1>
		</div>
		<div class="wrapper">
			<?php
				breadcrumb(6, 5);
			?>
			<div class="content">
				<?php
					header2("Prepopulate with sample data");
					bodyText("Select the sample data you want to prepopulate LenaSYS with.");
				?>
				<div class="inner-wrapper">
					<div class="input-flex">
						<?php
							$buttons = [
								'test-course' => 'Include test-course',
								'demo-course' => 'Include demo-course',
								'test-files' => 'Include test-files',
								'language-support' => 'Include language-support'
							];
							$active = ['test-course', 'demo-course', 'test-files', 'language-support'];

							checkBoxes("creation-settings", $buttons, $active);

							$buttons = [
								'lang-html' => 'HTML',
								'lang-php' => 'PHP',
								'lang-js' => 'JAVASCRIPT',
								'lang-plain' => 'PLAIN TEXT',
								'lang-sql' => 'SQL',
								'lang-sr' => 'SR'
							];
							$active = ['lang-html', 'lang-php', 'lang-js', 'lang-plain', 'lang-sql', 'lang-sr'];

							checkBoxesWithColumns("creation-settings", $buttons, $active);
						?>
					</div>
				</div>
			</div>
			<?php
				navigationButtons(4, 6);
			?>
		</div>
	</div>

	<div id="page6" class="page">
		<div class="banner">
			<h1 class="header-1">Welcome to <b>LenaSYS</b></h1>
		</div>
		<div class="wrapper">
			<?php
				breadcrumb(6, 6);
			?>
			<div class="content">
				<?php
					header2("Complete installation");
					bodyText("LenaSYS is ready to be installed.");
				?>
				<div class="inner-wrapper">
					<div class="input-flex">
						<?php
							defaultButton("Install LenaSYS", "", "start_installer()");
							
							// Example usage
							$statusMessages = [
								"Error in file /var/www/html/index.php on line 23",
								"Undefined variable: foo",
								"Stack trace:",
								"#0 /var/www/html/index.php(23): someFunction()",
								"#1 {main}"
							];

							displayStackTrace($statusMessages);
						?>
					</div>
				</div>
			</div>
			<?php
				singleNavigationButton("previous", 5);
			?>
		</div>
	</div>
  
</body>
</html>