<?php
	session_start();  // Start or resume the session

	if ($_SERVER['REQUEST_METHOD'] === 'POST' ) {
		$input = json_decode(file_get_contents('php://input'), true);
		$_SESSION['installation_settings'] = $input;
		exit;
	}

	if (isset($_GET['stream']) && isset($_SESSION['installation_settings'])) {
		include_once("tools/install_engine.php");
		InstallEngine::run(json_encode($_SESSION['installation_settings']));
	} else {
		include_once("installer_ui.php");
	}