<?php

date_default_timezone_set("Europe/Stockholm");

include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";
include('../shared_microservices/getUid_ms.php');

pdoConnect();
session_start();

echo json_encode(array('courseid' => $courseid, 'coursevers' => $coursevers, 'sectname' => $sectname, 'kind' => $kind, 'link' => $link, 'visibility' => $visibility, 'gradesys' => $gradesys, 'highscoremode' => $highscoremode, 'comments' => $comments, 'grptype' => $grptype, 'pos' => $pos, 'tabs' => $tabs, 'debug' => $debug));

return;

?>