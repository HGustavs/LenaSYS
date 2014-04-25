<html>
		<head>
				<link type="text/css" href="../CodeViewer/css/codeviewer.css" rel="stylesheet" />
                <script type="text/javascript" src="../CodeViewer/js/jquery-1.5.1.min.js"></script>
                <script type="text/javascript" src="../CodeViewer/js/tooltips.js"></script>


		</head>
		<body>

<?php

		// Include basic application services!
		include_once("../../coursesyspw.php");	
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

<script>

    $( document ).ready(function() {

        setTimeout(function() {

            $("*[title]").tooltips();

        }, 800);


    });

</script>
