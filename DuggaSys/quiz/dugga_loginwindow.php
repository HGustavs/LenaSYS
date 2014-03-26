<?php 
if(session_id() != '') { //If there is a session started destroy it to make sure nothing is stored in the session
    session_destroy();
}
?>
<!DOCTYPE html>
<html>
    <head>
		<meta charset="utf-8" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<script type="text/javascript" src="../js/md5.js"></script>
        <link href="../css/base.css" rel="stylesheet" type="text/css" />
        <link href="../css/login.css" rel="stylesheet" type="text/css" />
        <title><?php $pagetitle ?></title>
		<script lang="Javascript">
			function hashPassword(){
				// alert("pre " + document.forms["loginForm"]["password"].value + "!");
				document.forms["loginForm"]["password"].value=hex_md5(document.forms["loginForm"]["password"].value);
				// alert("post " + document.forms["loginForm"]["password"].value + "!");
			}
		</script>
    </head>
    <body>
        <form name="loginForm" action="<?$_SERVER["REQUEST_URI"]?>" method="post" onsubmit="hashPassword();">
            <h3>Dugga login</h3>
            <label for="loginName" >Login name:</label>
            <input type="text" name="loginName" placeholder="Your login name (eg. a02leifo)" /><br />
            <label for="password">Password:</label>
            <input type="password" name="password" placeholder="Your password"/>
            <input type="submit" name="loginSubmit" value="Logga in" />
        </form>
        <?php
        if (isset($errorMsg) && $errorMsg!="") {
			echo "<h3>" . $errorMsg . "</h3>";
        }
//        echo $_SERVER["REQUEST_URI"];
        ?>
    </body>
</html>