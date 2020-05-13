<?php
include_once ("../Shared/database.php");
pdoConnect();

$announcementid = $_POST['announcementid'];
$cid = $_POST['cid'];
$versid = $_POST['versid'];
$read_status = 0;

$update = 'UPDATE announcement SET read_status=:read_status WHERE announcementid=:announcementid AND cid=:cid AND versid=:versid';

$stmt = $pdo->prepare($update);
$stmt->bindParam(':announcementid', $announcementid);
$stmt->bindParam(':cid', $cid);
$stmt->bindParam(':versid', $versid);
$stmt->bindParam(':read_status', $read_status);

$stmt->execute();


?>