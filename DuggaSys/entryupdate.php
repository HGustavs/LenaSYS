<?php
include_once("../Shared/database.php");
include_once("../Shared/sessions.php");
include_once("../../coursesyspw.php");

dbConnect();
session_start();

if (checklogin()) {
	$courseID = $_POST['courseid'];
	if (hasAccess($_SESSION['uid'], $courseID, "w")) {
		$sectionArray = $_POST['Entry'];

		$counter = 0;
		foreach ($sectionArray as $entryID) {
			$result = mysql_query("UPDATE listentries SET pos = '$counter' WHERE lid = '$entryID';");
			if(!$result) {
				echo "Error updating entries";
			} else {
				$counter = $counter + 1;
			}
		}
		
		echo "Listelementen har uppdaterats!";
	}
}
?>