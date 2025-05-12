<?php

session_start();

if (!isset($_SESSION['token'])) {
    $_SESSION['token'] = bin2hex(random_bytes(32));
}

try {
    // database connection
    $db = new PDO('sqlite:endpointDirectory_db.sqlite');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $services = $db->query("SELECT * FROM microservices")->fetchAll();

} catch (PDOException $e) {
    $dbError = "Database is not installed.";
}
?>

<!DOCTYPE html>
<html>

<head>
    <title>Admin Microservice Directory</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <h1>Microservice Documentation Database Admin</h1>
    <?php
    if (isset($dbError)) {
        echo $dbError;
    }
    ?>
</body>

</html>