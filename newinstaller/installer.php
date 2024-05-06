<?php
session_start();  // Start or resume the session

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['installation_settings'])) {
	// Save installation settings into session
	$_SESSION['installation_settings'] = $_POST['installation_settings'];
	exit;
}

if (isset($_GET['stream']) && isset($_SESSION['installation_settings'])) {
	include_once("tools/install_engine.php");
	InstallEngine::run($_SESSION['installation_settings']);
} else {
	include_once("installer_ui.php");
}