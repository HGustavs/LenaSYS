<?php
include_once ("../Shared/database.php");
pdoConnect();

session_start();



	
if(isset($_POST['uid']) && isset($_POST['cid']) && isset($_POST['versid']) && isset($_POST['createBtn'])){
	$uid = $_POST['uid'];
	$cid = $_POST['cid'];
	$versid = $_POST['versid'];
	$title = $_POST['announcementTitle'];
	$message = $_POST['announcementMsg'];
	$read_status = 1;

	$query = $pdo->prepare("INSERT INTO announcement(uid, cid, versid, title, message, read_status) VALUES (:uid, :cid, :versid, :title, :message, :read_status);");

	$query->bindParam(':uid', $uid);
	$query->bindParam(':cid', $cid);
	$query->bindParam(':versid', $versid);
	$query->bindParam(':title', $title);
	$query->bindParam(':message', $message);
	$query->bindParam(':read_status', $read_status);

	$query->execute(); 

	$_SESSION["announcementcreated"] = "New announcement is created!";

}else if(isset($_GET['deleteannouncementid'])){
	$deleteannouncementid = $_GET['deleteannouncementid'];
	$uid = $_GET['uid'];
	$cid = $_GET['courseid'];
	$versid = $_GET['coursevers'];

	$delete = "DELETE FROM announcement WHERE announcementid=:announcementid AND uid=:uid AND cid=:cid AND versid=:versid";
	
	$stmt = $pdo->prepare($delete);
	$stmt->bindParam(':announcementid', $deleteannouncementid);
	$stmt->bindParam(':uid', $uid);   
	$stmt->bindParam(':cid', $cid);   
	$stmt->bindParam(':versid', $versid);   

	$stmt->execute();
	$_SESSION["announcementdeleted"] = "Announcement is deleted!";
}elseif (isset($_POST['updateannouncementid']) && isset($_POST['updateBtn'])) {
	$updateannouncementid = $_POST['updateannouncementid'];
	$uid = $_POST['uid'];
	$cid = $_POST['cid'];
	$versid = $_POST['versid'];
	$updateTitle = $_POST['announcementTitle'];
	$updateMessage = $_POST['announcementMsg'];
	$read_status = 1;

	$update = 'UPDATE announcement SET title=:title, message=:message, read_status=:read_status WHERE announcementid=:announcementid AND uid=:uid AND cid=:cid AND versid=:versid';
	$stmt = $pdo->prepare($update);
	$stmt->bindParam(':announcementid', $updateannouncementid);   
	$stmt->bindParam(':uid', $uid);
	$stmt->bindParam(':cid', $cid);
	$stmt->bindParam(':versid', $versid);
	$stmt->bindParam(':title', $updateTitle);   
	$stmt->bindParam(':message', $updateMessage);
	$stmt->bindParam(':read_status', $read_status);    

	$stmt->execute();
	$_SESSION["announcementupdated"] = "Announcement is updated!";
}
header("Location: ../DuggaSys/sectioned.php?courseid=".$_SESSION['courseid']."&coursename=".$_SESSION['coursename']."&coursevers=".$_SESSION['coursevers']."");


?>