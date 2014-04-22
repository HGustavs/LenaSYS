<?php
include_once("../Shared/database.php");

$action = mysql_real_escape_string($_POST['action']);
$recordsArray = $_POST['recordsArray'];

if ($action == "updateEntries"){
	$counter = 0;
	foreach ($recordsArray as $entryID) {
		makequery("UPDATE entries SET pos = '$counter' WHERE lid = '$entryID';", "Error updating entries");
		$counter = $counter + 1;
	}
}
?>