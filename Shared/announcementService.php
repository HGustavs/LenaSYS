<?php
include_once ("../Shared/database.php");
pdoConnect();

session_start();



	
if(isset($_POST['secondannouncementid']) && isset($_POST['uid']) && isset($_POST['cid']) && isset($_POST['versid']) && isset($_POST['recipients']) && isset($_POST['createBtn'])){
	array_push($_POST['recipients'], $_POST['uid']);
	foreach ($_POST['recipients'] as $recipient) {
		$secondannouncementid = $_POST['secondannouncementid'];
		$uid = $_POST['uid'];
		$cid = $_POST['cid'];
		$versid = $_POST['versid'];
		$title = $_POST['announcementTitle'];
		$message = $_POST['announcementMsg'];

		$query = $pdo->prepare("INSERT INTO announcement(secondannouncementid, uid, cid, versid, title, message, recipient) VALUES (:secondannouncementid, :uid, :cid, :versid, :title, :message, :recipient);");

		$query->bindParam(':secondannouncementid', $secondannouncementid);
		$query->bindParam(':uid', $uid);
		$query->bindParam(':cid', $cid);
		$query->bindParam(':versid', $versid);
		$query->bindParam(':title', $title);
		$query->bindParam(':message', $message);
		$query->bindParam(':recipient', $recipient);

		$query->execute(); 

	}
	$_SESSION["announcementcreated"] = "New announcement is created!";
		

}else if(isset($_GET['deleteannouncementid'])){
	$deleteannouncementid = $_GET['deleteannouncementid'];
	$uid = $_GET['uid'];
	$cid = $_GET['courseid'];
	$versid = $_GET['coursevers'];

	$delete = "DELETE FROM announcement WHERE secondannouncementid=:secondannouncementid AND uid=:uid AND cid=:cid AND versid=:versid";
	
	$stmt = $pdo->prepare($delete);
	$stmt->bindParam(':secondannouncementid', $deleteannouncementid);
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
	$edited = "YES";

	$update = 'UPDATE announcement SET title=:title, message=:message, read_status=:read_status, edited=:edited, announceTime=now() WHERE secondannouncementid=:secondannouncementid AND uid=:uid AND cid=:cid AND versid=:versid';
	$stmt = $pdo->prepare($update);
	$stmt->bindParam(':secondannouncementid', $updateannouncementid);   
	$stmt->bindParam(':uid', $uid);
	$stmt->bindParam(':cid', $cid);
	$stmt->bindParam(':versid', $versid);
	$stmt->bindParam(':title', $updateTitle);   
	$stmt->bindParam(':message', $updateMessage);
	$stmt->bindParam(':read_status', $read_status);
	$stmt->bindParam(':edited', $edited);        

	$stmt->execute();
	$_SESSION["announcementupdated"] = "Announcement is updated!";
}
header('Location: ' . $_SERVER['HTTP_REFERER']);

?>