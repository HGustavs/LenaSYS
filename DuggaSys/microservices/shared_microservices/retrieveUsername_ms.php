<?php
// Gets username based on uid, USED FOR LOGGING
$query = $pdo->prepare("SELECT username FROM user WHERE uid = :uid");
$query->bindParam(':uid', $userid);
$query->execute();



?>