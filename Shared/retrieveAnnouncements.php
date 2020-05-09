
<?php
include_once ("../Shared/database.php");
pdoConnect();

$cid = intval($_GET['cid']);
$versid = intval($_GET['versid']);

foreach ($pdo->query('SELECT * FROM announcement WHERE cid="'.$cid.'" AND versid="'.$versid.'" ORDER BY announceTime DESC') AS $announcement){
	$announcementid = $announcement['announcementid'];
	$uid = $announcement['uid'];
	$cid = $announcement['cid'];
	$versid = $announcement['versid'];
	$title = $announcement['title'];
	$message = $announcement['message'];
	$announceTime = $announcement['announceTime'];
	echo "<div class='announcementCard'><div class='actionBtns'><span>Edit</span><span>&times;</span></div>";
	echo "<div><h3>".ucfirst(strtolower($title))."</h3></div>";

	foreach ($pdo->query('SELECT * FROM vers WHERE cid="'.$cid.'" AND vers="'.$versid.'"') AS $vers){
		$versid = $vers['vers'];
		$versname = $vers['versname'];
		echo "<div><b>".strtoupper($versname)." - ".$versid."</b></div>";
	}

	echo "<div><p>".ucfirst(strtolower($message))."</p></div>";

	foreach ($pdo->query('SELECT * FROM user WHERE uid="'.$uid.'"') AS $author){
		$firstname = $author['firstname'];
		$lastname = $author['lastname'];
		echo "<div><span>&#9716;".$announceTime."</span><span> by ".ucfirst(strtolower($firstname))." ".ucfirst(strtolower($lastname))."</span></div></div>";

	}


}

?>