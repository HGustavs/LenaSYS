<?php
session_start();
?>
<!DOCTYPE html>
<html>
	<head>
			<link type="text/css" href="../CodeViewer/css/codeviewer.css" rel="stylesheet" />	
			<link type="text/css" href="../DuggaSys/css/duggasys.css" rel="stylesheet" />	
			<script type="text/javascript" src="../Shared/js/jquery-1.11.0.min.js"></script>
			<script type="text/javascript" src="startpage.js"></script>

<script>
setupLogin();
</script>
	</head>
	<body>
<?php
include_once("../../coursesyspw.php");	
include_once("basic.php");

dbConnect();

courselist();
loginwins();
?>			
			</body>
</html>
