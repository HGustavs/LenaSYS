<?php
include_once ("../Shared/database.php");
pdoConnect();

$updateannouncementid = $_GET['updateannouncementid'];

foreach ($pdo->query('SELECT * FROM announcement WHERE secondannouncementid="'.$updateannouncementid.'"') as $announcement){
  $title = $announcement['title'];
  $message = $announcement['message'];

}
echo json_encode(["title"=> $title, "message" => $message]);

?>
