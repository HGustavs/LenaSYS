<?php
 	session_start();
?>
<!DOCTYPE html>
<html>
<head>
	<link rel="icon" type="image/ico" href="../Shared/icons/favicon.ico"/>
	<meta http-equiv="X-UA-Compatible" content="IE=edge"> 
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>Seminar Registration</title>

	<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
	<link type="text/css" href="../Shared/css/markdown.css" rel="stylesheet">
	<link type="text/css" href="../Shared/css/dugga.css" rel="stylesheet">

	
	<script src="../Shared/js/jquery-1.11.0.min.js"></script>
	<script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
    
    <?php
        date_default_timezone_set("Europe/Stockholm");

        // Include basic application services
        include_once "../Shared/basic.php";
        include_once "../Shared/sessions.php";
    
        // Navigation Header
		$noup="SECTION"; // This makes the back-button available. 
		include '../Shared/navheader.php';
    
        //Login dialog
        include '../Shared/loginbox.php';
    ?>
    </head>
    <body>
        <div id="seminarContent">
            <label>Välj grupp för seminarietillfälle</label>
            <form id="seminarReg">
                <select>
                    <!--These values will be changed to be more dynamic as seminars might have different amounts of groups-->
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                </select>
                <button type="submit">OK</button>
            </form>
        </div>
    </body>
</html>