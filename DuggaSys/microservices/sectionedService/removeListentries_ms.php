<?php

date_default_timezone_set("Europe/Stockholm");

include ('../../../Shared/sessions.php');
include_once "../../../Shared/basic.php";
include('../shared_microservices/getUid_ms.php');

pdoConnect();
session_start();

if (checklogin()) { //This entire checklogin should be working by using the getUid instead, but for the time being it doesn't.
	if (isset($_SESSION['uid'])) {
		$userid = $_SESSION['uid'];
	} else {
		$userid = "UNK";
	}

	if(isSuperUser(getUid())) {
        $sectid=getOP('lid');


        $query = $pdo->prepare("UPDATE listentries SET visible = '3' WHERE lid=:lid");
        $query->bindParam(':lid', $sectid);

        if(!$query->execute()) {
            if($query->errorInfo()[0] == 23000) {
                $debug = "foreign key constraint.";
            } else {
                $debug = "Error.";
            }
        }
    }
}

?>