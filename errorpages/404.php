<?php

session_start();
//include_once "../../coursesyspw.php";
include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";
pdoConnect();
/*
$noup="NONE";
*/

$opt=getOP('opt');
$cid=getOP('cid');
$coursename=getOP('coursename');
$visibility=getOP('visib');
$versid=getOP('versid');

if(isset($_SESSION['uid'])){
	$userid=$_SESSION['uid'];
}else{
	$userid="UNK";
}

$log_uuid = getOP('log_uuid');
$info=$opt." ".$cid." ".$coursename." ".$versid." ".$visibility;
$service = "404:".$_SERVER['REQUEST_URI'];
logServiceEvent($log_uuid, EventTypes::PageNotFound ,$service ,$userid,$info);

?>
<!DOCTYPE html>
<html>
<head>
        <link rel="icon" type="image/ico" href="../Shared/icons/favicon.ico"/>
        <meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <title> File not found</title>

        <link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
        <link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">

        <script src="../Shared/js/jquery-1.11.0.min.js"></script>
        <script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
        <script src="../Shared/dugga.js"></script>
</head>
<body>
<h1>404 - File not found</h1>
	<a href="/LenaSYS/DuggaSys/courseed.php">Go to start</a>
</body>
</html>
