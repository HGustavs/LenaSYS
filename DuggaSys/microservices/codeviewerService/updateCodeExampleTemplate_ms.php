<?php

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";

pdoConnect();
session_start();

$opt=getOP('opt');
$templateNumber=getOP('templateno');

