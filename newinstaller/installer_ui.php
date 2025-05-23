<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<title>Installer Progress</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
	<link rel="stylesheet" type="text/css" href="style.css">
	<?php include 'tools/components.php'; ?>
	<?php include 'tools/modal.php'; ?>
	<?php include 'tools/configuration_manager.php'; ?>
	<?php include 'tools/permissions.php'; ?>
	<script defer src="tools/modal.js"></script>
	<script defer src="tools/components.js"></script>
	<script defer src="tools/sse_receiver.js"></script>
	<script defer src="installer_ui.js"></script>
</head>

<body>

	<form id="installer_form">
		<div id="page1" class="page">
			<div class="banner">
				<h1 class="header-1">Welcome to <b>LenaSYS</b></h1>
			</div>
			<div class="wrapper">
				<?php
				breadcrumb(7, 1);
				?>
				<div class="content">
					<?php
					header2("Select your OS installer");
					?>
					<div class="inner-wrapper">
						<?php
						$buttons = [
							'os_windows' => 'Windows',
							'os_linux' => 'Linux',
							'os_mac' => 'Mac OS'
						];

						radioButtons("operating_system", $buttons, "os_windows");
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
				breadcrumb(7, 2);
				?>
				<div class="content">
					<?php
					header2("Select installation options");
					bodyText(
						"If this is your first time installing LenaSYS, you <u><b>must</b></u> select both options.",
						"https://github.com/HGustavs/LenaSYS/blob/8be873ef4ccb3cdb2fc28e72b2a30a79aa52c2f9/Shared/Documentation/newinstaller/documentation.md#step-2"
					);
					?>
					<div class="inner-wrapper">
						<?php
						$buttons = [
							'create_db' => 'Create new MySQL DB',
							'create_db_user' => 'Create new MySQL user'
						];
						$active = ['create_db', 'create_db_user'];

						checkBoxes("database_creation", $buttons, $active);
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
				breadcrumb(7, 3)
				?>
				<div class"content">
					<?php
					header2("Create new database & user");
					bodyText(
						"Provide the following data for the database and user",
						"https://github.com/HGustavs/LenaSYS/blob/8be873ef4ccb3cdb2fc28e72b2a30a79aa52c2f9/Shared/Documentation/newinstaller/documentation.md#step-3"
					);
					?>
					<div class="inner-wrapper">
						<div class="input-grid">
							<?php
								$ConfigurationManager = new ConfigurationManager("../../coursesyspw.php");
								$parameters = $ConfigurationManager->read_parameters();

								inputField("db_name", "Database name:", "text", $parameters["DB_NAME"]);
								inputField("username", "MySQL user:", "text", $parameters["DB_USER"]);
								inputFieldWithTip('hostname', 'Hostname:', 'Tip: Usually set to "localhost"', $parameters["DB_HOST"]);
								inputField("password", "MySQL user password:", "password", $parameters["DB_PASSWORD"]);
								
								if (!empty($parameters["DB_USING_DOCKER"])) {
									checkbox("distributed_environment", "Use Distributed Environment", "https://github.com/HGustavs/LenaSYS/blob/8be873ef4ccb3cdb2fc28e72b2a30a79aa52c2f9/Shared/Documentation/newinstaller/documentation.md#use-distributed-environment", $parameters["DB_USING_DOCKER"]);
								} else {
									checkbox("distributed_environment", "Use Distributed Environment", "https://github.com/HGustavs/LenaSYS/blob/8be873ef4ccb3cdb2fc28e72b2a30a79aa52c2f9/Shared/Documentation/newinstaller/documentation.md#use-distributed-environment");
								}

								checkbox("Verbose", "Verbose", "https://github.com/HGustavs/LenaSYS/blob/8be873ef4ccb3cdb2fc28e72b2a30a79aa52c2f9/Shared/Documentation/newinstaller/documentation.md#verbose");
								checkboxWithWarning("overwrite_db", "Overwrite existing database", "WARNING! Overwriting databases and users cannot be undone!", "https://github.com/HGustavs/LenaSYS/blob/8be873ef4ccb3cdb2fc28e72b2a30a79aa52c2f9/Shared/Documentation/newinstaller/documentation.md#overwrite-existing-database-and-user-names");
								checkbox("overwrite_user", "Overwrite existing user");
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
				breadcrumb(7, 4);
				?>
				<div class="content">
					<?php
					header2("Enter root user credentials");
					bodyText("Provide the credentials for the database root user", "https://github.com/HGustavs/LenaSYS/blob/8be873ef4ccb3cdb2fc28e72b2a30a79aa52c2f9/Shared/Documentation/newinstaller/documentation.md#step-4");
					?>
					<div class="inner-wrapper">
						<div class="input-flex">
							<?php
							inputField("root_username", "Root username:", "text", "root");
							inputField("root_password", "Root password:", "password");
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
				breadcrumb(7, 5);
				?>
				<div class="content">
					<?php
					header2("Prepopulate with sample data");
					bodyText("Select the sample data you want to prepopulate LenaSYS with.", "https://github.com/HGustavs/LenaSYS/blob/8be873ef4ccb3cdb2fc28e72b2a30a79aa52c2f9/Shared/Documentation/newinstaller/documentation.md#step-5");
					?>
					<div class="inner-wrapper">
						<div class="input-flex">
							<?php
							$buttons = [
								'add_test_data' => 'Include test-data',
								'add_demo_course' => 'Include demo-course',
								'add_test_course_data' => 'Include test-course-data',
								'add_test_files' => 'Include test-files',
								'language_support' => 'Include language-support'
							];
							$active = ['add_test_data', 'add_demo_course', 'add_test_course_data', 'add_test_files', 'language_support'];
							$helpLinks = [
								'test-course' => "https://github.com/HGustavs/LenaSYS/blob/8be873ef4ccb3cdb2fc28e72b2a30a79aa52c2f9/Shared/Documentation/newinstaller/documentation.md#include-test-course",
								'demo-course' => "https://github.com/HGustavs/LenaSYS/blob/8be873ef4ccb3cdb2fc28e72b2a30a79aa52c2f9/Shared/Documentation/newinstaller/documentation.md#include-demo-course",
								'test-files' => "https://github.com/HGustavs/LenaSYS/blob/8be873ef4ccb3cdb2fc28e72b2a30a79aa52c2f9/Shared/Documentation/newinstaller/documentation.md#include-test-files",
								'language-support' => "https://github.com/HGustavs/LenaSYS/blob/8be873ef4ccb3cdb2fc28e72b2a30a79aa52c2f9/Shared/Documentation/newinstaller/documentation.md#include-test-files"
							];

							checkBoxes("creation_settings", $buttons, $active, $helpLinks);

							$buttons = [
								'html' => 'HTML',
								'php' => 'PHP',
								'javascript' => 'JAVASCRIPT',
								'plain' => 'PLAIN TEXT',
								'sql' => 'SQL',
								'sr' => 'SR'
							];
							$active = ['html', 'php', 'javascript', 'plain', 'sql', 'sr'];

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
				breadcrumb(7, 6);
				?>
				<div class="content">
					<?php
					header2("SSL (HTTPS)");
					bodyText("To allow for push notifications, you have to enable SSL on your webserver");
					?>
					<div class="inner-wrapper">
						<div class="input-flex">
							<?php
							checkbox("generate_SSL", "Generate local SSL certificate");
							?>
						</div>
					</div>
				</div>
				<?php
				navigationButtons(5, 7);
				?>
			</div>
		</div>

		<div id="page7" class="page">
			<div class="banner">
				<h1 class="header-1">Welcome to <b>LenaSYS</b></h1>
			</div>
			<div class="wrapper">
				<?php
				breadcrumb(7, 7);
				?>
				<div class="content">
					<?php
					header2("Complete installation");
					bodyText("LenaSYS is ready to be installed.");
					?>
					<div class="inner-wrapper">
						<div class="input-flex">
							<?php defaultButton('Install LenaSYS', '', "\"navigateTo('installationPage'); start_installer(null);\""); ?>
						</div>
					</div>
				</div>
				<?php
				singleNavigationButton("previous", 6);
				?>
			</div>
		</div>

		<div id="installationPage" class="page">
			<div class="banner">
				<h1 class="header-1">Welcome to <b>LenaSYS</b></h1>
			</div>
			<div class="wrapper">
				<?php
				breadcrumb(7, 7);
				?>
				<div class="content">
					<?php
					header2("Complete installation");
					bodyText("LenaSYS is being installed...");
					?>
					<div class="inner-wrapper">
						<?php
						progressBar();
						$modal = new Modal();
						$modal->setDbConnectionErrorModal("dbConnectionError");
						$modal->showFilePermissionErrorModal("permissionError");
						$modal->showDbCreationErrorModal("dbCreationError");
						$modal->showSqlExecutionErrorModal("SqlError");
						$modal->showOperationErrorModal("operationError");
						?>
						<div id="pageButtonContainer">
							<button class="defaultButton pageButton" id="openModal" type="button" style="display: none;">View Problem</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</form>

</body>

</html>
