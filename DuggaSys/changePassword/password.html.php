<!DOCTYPE html>
<html>
    <head>
		<meta charset="utf-8" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <link href="css/base.css" rel="stylesheet" type="text/css" />
        <link href="css/login.css" rel="stylesheet" type="text/css" />
        <title><?php $pagetitle ?></title>
    </head>
    <body>
        <form action="." method="post">
            <h3>Change password</h3>
            <label for="loginName" >Login:</label>
            <input type="text" name="loginName" placeholder="Your login" /><br />
            <label for="password">Password:</label>
            <input type="password" name="password" placeholder="Your current password"/>
			<label for="newPassword">New password:</label>
            <input type="password" name="newPassword" placeholder="Your new password"/>
            <input type="submit" name="changePasswordSubmit" value="OK" />
        </form>
        <?php
        if (isset($errorMsg) && $errorMsg!="") {
            echo "<h3>" . $errorMsg . "</h3>";
        }
        ?>
    </body>
</html>