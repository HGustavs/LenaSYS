<?php
include_once ("../Shared/database.php");
pdoConnect();

$updateannouncementid = intval($_GET['updateannouncementid']);

foreach ($pdo->query('SELECT * FROM announcement WHERE announcementid="'.$updateannouncementid.'"') as $announcement){
  $title = $announcement['title'];
  $message = $announcement['message'];

  echo "<xml><div id='responseTitle'>".$title."</div>";
  echo "<div id='responseMessage'>".$message."</div></xml>";

}

?>
