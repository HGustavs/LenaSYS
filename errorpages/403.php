<?php
//session_start();
//include_once "../../coursesyspw.php";
//include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";
//pdoConnect();
/*
$noup="NONE";
*/

// Get the sites current URL
$actual_link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
$startURL = str_replace("errorpages/403.php","", $actual_link) . "DuggaSys/courseed.php";
?>
<!DOCTYPE html>
<html>
<head>
	<link rel="icon" type="image/ico" href="../Shared/icons/favicon.ico"/>
	<meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>403 Error</title>

	<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
	<link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">

	<script src="../Shared/js/jquery-1.11.0.min.js"></script>
	<script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
	<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  	<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  	<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
	<script src="../Shared/dugga.js"></script>
</head>
<body>
    You may not view this page
    <br>
    <a href="<?php echo $startURL; ?>">Go to start</a>
</body>
</html>
