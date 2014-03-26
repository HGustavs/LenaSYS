<html>
<html>
	<head>
			<link type="text/css" href="css/codeviewer.css" rel="stylesheet" />	
			<script type="text/javascript" src="js/jquery-1.5.1.min.js"></script>
			<script type="text/javascript" src="js/codeviewer.js"></script>

			<script>
			</script>
			<body>
					<?php
						include_once("../coursesyspw.php");	
						include_once("basic.php");

						session_start();
						dbConnect();

						courselist();
					?>			

			</body>
</html>