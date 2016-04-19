<?php 
	session_start();
?>
<!DOCTYPE html>
<html>
<head>
	<link rel="icon" type="image/ico" href="../Shared/icons/favicon.ico"/>
	<meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>Course Editor</title>

	<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
	<link type="text/css" href="../Shared/css/responsive.css" rel="stylesheet">
	<link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
	<script src="../Shared/js/jquery-1.11.0.min.js"></script>
	<script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
</head>
<body>
	<header>

	</header>
	<!-- content START -->
	<div id="content">
		<div id="Courselist">
			<div id='lena' class='head'><a href='https://github.com/HGustavs/LenaSYS_2014'><span class='sys'><span class='lena'>LENA</span>Sys</span></a> Course Organization System</div>
		</div>
		
		<div class="errorBlock">
			<h1>Woops!</h1>
			<h2>There seems to be a problem with the database</h2>
			<p>Our computer servant can't seem to find the configuration for the database.<br/>Please configure the config file or contact an administrator for help.</p>
			<?php echo '<a href="' . $_SESSION['url'] . '">Reload previous page</a>'; ?>
		</div>
	</div>
</body>
</html>
