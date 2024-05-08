<?php 
    include_once("installer_ui.php");
    foreach (glob("tools/*.php") as $tools) {
        include_once $tools;
    }
?>