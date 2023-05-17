<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TestLogin</title>
</head>

<?php 
echo '<script> testLogin_showLoginPopup(); </script>'; 
?>

<body>
    <button onclick="showLoginPopUp();">
        <h3>Login</h3>
    </button>

    <button onload="checkUserStatusTest();">Call checkUserStatusTest</button>
</body>
</html>

<?php
pdoConnect();
session_start();

require __DIR__ . '../Misc/checkUserStatus.php';

echo checkUserStatusTest();



?>