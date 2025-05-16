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

// get the id of the searched microservice
if (isset($_GET['ms_name'])) {
    $ms_name = $_GET['ms_name'];

    $stmt = $db->prepare("SELECT id FROM microservices WHERE ms_name LIKE ?");
    $stmt->execute([$ms_name]);

    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result) {
        $id = $result['id'];
    } 
}

} catch (PDOException $e) {
    $dbError = "Database is not installed.";
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Dependencies Directory</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>    
    <div class='line'>
        <h1>Microservice Directory</h1>
    </div>
    <a href="microserviceUI.php" class="a-button">Back to microserviceUI</a>
    <?php    
    if (isset($dbError)) {
        echo "<p class='error_message'>" . $dbError . "</p>";
    } else { ?>
        <form method="GET" action="">
            <label for="ms_name">Enter microservice name</label>
            <input type="text" id="ms_name" name="ms_name">
            <input type="submit" value="Submit">
        </form>
        <?php
        if ($id) { 
            echo $id;
        } else {
            echo "No results found";
        }
    }
    ?>
</body>
</html>