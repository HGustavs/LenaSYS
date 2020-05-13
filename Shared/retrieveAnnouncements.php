
<?php
include_once ("../Shared/database.php");
pdoConnect();

$cid = intval($_GET['cid']);
$versid = intval($_GET['versid']);
$retrievedAnnouncementCard = '';
foreach ($pdo->query('SELECT * FROM announcement WHERE cid="'.$cid.'" AND versid="'.$versid.'" ORDER BY announceTime DESC') AS $announcement){
	$announcementid = $announcement['announcementid'];
	$uid = $announcement['uid'];
	$cid = $announcement['cid'];
	$versid = $announcement['versid'];
	$title = $announcement['title'];
	$message = $announcement['message'];
	$announceTime = $announcement['announceTime'];
	$retrievedAnnouncementCard .="<div class='announcementCard' onclick='updateReadStatus(".$announcementid.", ".$cid.", ".$versid.");'>";

	foreach ($pdo->query('SELECT * FROM course WHERE cid="'.$cid.'"') AS $course){
		$coursename = $course['coursename'];
		$retrievedAnnouncementCard .= "<div class='actionBtns'>";
		$retrievedAnnouncementCard .= "<span class='editBtn' onclick='updateannouncementForm(".$announcementid.", handleResponse);' title='Edit announcement'>Edit</span>";
		$retrievedAnnouncementCard .="<span class='deleteBtn'><a href='../Shared/announcementService.php?courseid=".$cid."&coursename=".$coursename."&coursevers=".$versid."&deleteannouncementid=".$announcementid."&uid=".$uid."' title='Delete announcement'>&times;</a></span>";
		$retrievedAnnouncementCard .="</div>";
	}
	$retrievedAnnouncementCard .= "<div><h3>".ucfirst(strtolower($title))."</h3></div>";

	foreach ($pdo->query('SELECT * FROM vers WHERE cid="'.$cid.'" AND vers="'.$versid.'"') AS $vers){
		$versid = $vers['vers'];
		$versname = $vers['versname'];
		$retrievedAnnouncementCard .= "<div class='courseversion'><b>".strtoupper($versname)." - ".$versid."</b></div>";
	}

	$retrievedAnnouncementCard .= "<div class='displayAnnouncementMsg'><p class='announcementMsgParagraph'>".ucfirst(strtolower($message))."</p></div>";

	foreach ($pdo->query('SELECT * FROM user WHERE uid="'.$uid.'"') AS $author){
		$firstname = $author['firstname'];
		$lastname = $author['lastname'];
		$retrievedAnnouncementCard .= "<div><span class='displayAnnounceTime' title='Announce time'>&#9716; ".$announceTime."</span><span class='displayAuthor' title='Announce author'>By ".ucfirst(strtolower($firstname))." ".ucfirst(strtolower($lastname))."</span></div></div>";

	}


};

//count rows
$nRows = $pdo->query('SELECT COUNT(*) FROM announcement WHERE cid="'.$cid.'" AND versid="'.$versid.'" AND read_status = "1" ORDER BY announceTime DESC')->fetchColumn(); 


echo json_encode(['retrievedAnnouncementCard' => $retrievedAnnouncementCard, 'nRows' => $nRows]);

?>