<?php

session_start();

if (!isset($_SESSION['token'])) {
    $_SESSION['token'] = bin2hex(random_bytes(32));
}

try {
// database
$db = new PDO('sqlite:endpointDirectory_db.sqlite');
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$services = $db->query("SELECT * FROM microservices")->fetchAll();



} catch (PDOException $e) {
    $dbError = "Database is not installed. Press the button below to create a database. ";
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Microservice Directory</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>    
    <div class='line'>
        <h1>Microservice Directory</h1>
    </div>
    <a href="microserviceUI.php" class="a-button">Back to microserviceUI</button>
    <?php    
    if (isset($dbError)) {
        echo "<p class='error_message'>" . $dbError . "</p>";
    } else {
        if (!isset($microservice)) { 

        }
    }
    ?>
</body>
</html>