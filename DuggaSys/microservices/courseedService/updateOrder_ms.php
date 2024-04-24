<?php
// Set the default timezone
date_default_timezone_set("Europe/Stockholm");

// Include necessary files
include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";
include_once "../../../../coursesyspw.php";

// Connect to the database and start the session
pdoConnect();
session_start();