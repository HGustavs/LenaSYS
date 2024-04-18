<?php
date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";


if (strcmp($opt, "UPDATEVRS") === 0) {
    if ($makeactive == 3) {
        $query = $pdo->prepare("UPDATE course SET activeversion=:vers WHERE cid=:cid");
        $query->bindParam(':cid', $courseid);
        $query->bindParam(':vers', $versid);

        if (!$query->execute()) {
            $error = $query->errorInfo();
            $debug = "Error updating entries\n" . $error[2];
        }
    }
}