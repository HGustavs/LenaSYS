<html>
		<head>
				<link type="text/css" href="../CodeViewer/css/codeviewer.css" rel="stylesheet" />		
		</head>
		<body>

<?php

		// Include basic application services!
		include_once("../Shared/coursesyspw.php");
		include_once("../Shared/database.php");	
		include_once("../Shared/sessions.php");
		include_once("../Shared/basic.php");	
		include_once("basic.php");

		session_start();
		dbConnect();

		// States for login/logout service - Logged in (log out) - Logged Out (show login window) - Reply (show login window or course list)
		if(isset($_POST['reply'])){
				if(checklogin()){
						// Show course list as usual
						courselist();						

						// Print Warning so we know current login state
						bodywarning("You are now logged in!");						
				}else{
						loginwin();		
				}
		}else{
				if(checklogin()){
						// Log out and list courses as per usual
						logout();
						courselist();						

						// Print Warning so we know current login state
						bodywarning("You are now logged out!");
				}else{
						// If we are logged out, show login window
						loginwin();		
				}		
		}				
?>

</body>
</html>