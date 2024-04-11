<?php

date_default_timezone_set("Europe/Stockholm");
include_once "../Shared/basic.php";
include_once "../Shared/sessions.php";

// Connect to database and start session.
pdoConnect();
session_start();

$cid=getOP('cid');
$vers=getOP('vers');

if(strcmp($opt,"CHGVERS")===0) {
					$query = $pdo->prepare("UPDATE course SET activeversion=:vers WHERE cid=:cid");
					$query->bindParam(':cid', $courseid);
					$query->bindParam(':vers', $versid);

					if(!$query->execute()) {
						$error=$query->errorInfo();
						$debug="Error updating entries".$error[2];
					}
                }


?>