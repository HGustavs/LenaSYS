<?php

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "../sharedMicroservices/getUid_ms.php";

pdoConnect();
session_start();

$userid = getUid();

$opt=getOP('opt');
$templateNumber=getOP('templateno');

