<!DOCTYPE html>
<html>
    <head>
		<meta charset="utf-8" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <link href="css/base.css" rel="stylesheet" type="text/css" />
        <link href="css/login.css" rel="stylesheet" type="text/css" />
		<script type="text/javascript" src="js/md5.js"></script>
		<script lang="Javascript">
			function hashPassword(){
				//alert("pre " + document.forms["loginForm"]["passwordInput"].value + "!");
				document.forms["loginForm"]["passwordInput"].value=hex_md5(document.forms["loginForm"]["passwordInput"].value);
				//alert("post " + document.forms["loginForm"]["passwordInput"].value + "!");
			}
		</script>
        <title><?php $pagetitle ?></title>
    </head>
    <body>
        <form name="loginForm" action="." method="post" onsubmit="hashPassword();">
            <h3>User credentials</h3>
            <label for="userNameInput" >Username:</label>
            <input type="text" name="userNameInput" placeholder="Your username" /><br />
            <label for="passwordInput">Password:</label>
            <input type="password" name="passwordInput" placeholder="Your password"/>
            <input type="submit" name="loginSubmit" value="Logga in" />
        </form>
        <?php
        /*if (isset($errorMsg) && $errorMsg!="") {
            echo "<h3>" . $errorMsg . "</h3>";
        }*/
        ?>
    </body>
</html>