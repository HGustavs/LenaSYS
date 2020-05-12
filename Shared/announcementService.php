<?php
include_once ("../Shared/database.php");
pdoConnect();

session_start();





if(isset($_SESSION["courseid"]) && isset($_SESSION["coursevers"]) && isset($_SESSION["coursename"])){
	$courseid = $_SESSION["courseid"];
	$coursevers = $_SESSION["coursevers"];
	$coursename = $_SESSION["coursename"];
	
	if(isset($_POST['title']) && isset($_POST['announcementMsg']) && isset($_POST['author']))	{
		$title = $_POST['title'];
		$message = $_POST['announcementMsg'];
		$author = $_POST['author'];
		$query = $pdo->prepare("INSERT INTO announcement(courseid, courseversion, coursename, title, message, author) VALUES (:courseid,:courseversion, :coursename, :title, :message, :author);");

		$query->bindParam(':courseid', $courseid);
		$query->bindParam(':courseversion', $coursevers);
		$query->bindParam(':coursename', $coursename);
		$query->bindParam(':title', $title);
		$query->bindParam(':message', $message);
		$query->bindParam(':author', $author);

		$query->execute(); 

	}else if(isset($_GET['deleteannouncementid'])){
		$deleteannouncementid = $_GET['deleteannouncementid'];

		$delete = "DELETE FROM announcement WHERE courseid=:courseid AND courseversion=:courseversion AND id=:id";
		
		$stmt = $pdo->prepare($delete);
		$stmt->bindParam(':courseid', $courseid, PDO::PARAM_INT);   
		$stmt->bindParam(':courseversion', $coursevers, PDO::PARAM_STR);   
		$stmt->bindParam(':id', $deleteannouncementid, PDO::PARAM_INT);

		$stmt->execute();
	}elseif (isset($_POST['modAnnouncementid']) && isset($_POST['modAuthor'])) {
		$modAnnouncementid = $_POST['modAnnouncementid'];
		$modAuthor = $_POST['modAuthor'];
		$modTitle = $_POST['modTitle'];
		$modMessage = $_POST['modAnnouncementMsg'];

		$update = 'UPDATE announcement SET title=:title, message=:message WHERE id=:id AND author=:author';
		$stmt = $pdo->prepare($update);
		$stmt->bindParam(':id', $modAnnouncementid);   
		$stmt->bindParam(':author', $modAuthor);
		$stmt->bindParam(':title', $modTitle);   
		$stmt->bindParam(':message', $modMessage);   

		$stmt->execute();
	}
	header("Location: ../DuggaSys/sectioned.php?courseid=".$_SESSION['courseid']."&coursename=".$_SESSION['coursename']."&coursevers=".$_SESSION['coursevers']."");
}

?>