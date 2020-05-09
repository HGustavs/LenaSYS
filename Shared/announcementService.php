<?php
include_once ("../Shared/database.php");
pdoConnect();

session_start();






	
if(isset($_POST['uid']) && isset($_POST['cid']) && isset($_POST['versid']))	{
	$uid = $_POST['uid'];
	$cid = $_POST['cid'];
	$versid = $_POST['versid'];
	$title = $_POST['announcementTitle'];
	$message = $_POST['announcementMsg'];
	$query = $pdo->prepare("INSERT INTO announcement(uid, cid, versid, title, message) VALUES (:uid, :cid, :versid, :title, :message);");

	$query->bindParam(':uid', $uid);
	$query->bindParam(':cid', $cid);
	$query->bindParam(':versid', $versid);
	$query->bindParam(':title', $title);
	$query->bindParam(':message', $message);

	$query->execute(); 

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
}/*elseif (isset($_POST['modAnnouncementid']) && isset($_POST['modAuthor'])) {
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
}*/
header("Location: ../DuggaSys/sectioned.php?courseid=".$_SESSION['courseid']."&coursename=".$_SESSION['coursename']."&coursevers=".$_SESSION['coursevers']."");


?>