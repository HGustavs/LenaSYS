<?php 
    if (isset($_GET['stream'])) {
        // Script that runs the installer
        // Sends installation progress messages at: installer.php?stream=true
        include_once("tools/install_engine.php");
    } else {
        // Displays installer UI
        include_once("installer_ui.php");
    }