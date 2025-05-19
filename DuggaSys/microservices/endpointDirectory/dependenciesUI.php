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

// add dependency if POST
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add_dependency'])) {
    $depends_on_id = $_POST['microservice_id'];
    $microservice_id = $_POST['depends_on_id'];
    $path = $_POST['path'];

    if ($microservice_id !== $depends_on_id) {
        // get names
        $stmt = $db->prepare("SELECT ms_name FROM microservices WHERE id = ?");
        $stmt->execute([$microservice_id]);
        $ms_name = $stmt->fetchColumn();

        $stmt = $db->prepare("SELECT ms_name FROM microservices WHERE id = ?");
        $stmt->execute([$depends_on_id]);
        $depends_on = $stmt->fetchColumn();

        // check if entry already exists
        $check = $db->prepare("SELECT COUNT(*) FROM dependencies WHERE microservice_id = ? AND depends_on_id = ?");
        $check->execute([$microservice_id, $depends_on_id]);
        $alreadyExists = $check->fetchColumn();

        if ($alreadyExists > 0) {
            // redirect to the same page to avoid repost on refresh
            header("Location: " . $_SERVER['PHP_SELF'] . "?exists=1");
            exit();
        } else {
            // insert into database
            $stmt = $db->prepare("INSERT INTO dependencies (microservice_id, depends_on_id, ms_name, depends_on, path)
                                  VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$microservice_id, $depends_on_id, $ms_name, $depends_on, $path]);
            // success – redirect to same page to avoid repost on refresh
            header("Location: " . $_SERVER['PHP_SELF'] . "?success=1");
            exit();
        }

    } else {
        echo "<p style='color:red;'>A microservice cannot depend on itself!</p>";
    }
}

// get the id of the searched microservice
if (isset($_GET['ms_name'])) {
    $ms_name = $_GET['ms_name'];

    $stmt = $db->prepare("SELECT id FROM microservices WHERE ms_name LIKE ?");
    $stmt->execute([$ms_name]);

    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result) {
        $id = $result['id'];

        $dependingServices = [];
        $dependentServices = [];
    
        // query to get dependencies towards the searched microservice
        $stmt1 = $db->prepare("SELECT depends_on, depends_on_id, path FROM dependencies WHERE microservice_id = ?");
        $stmt1->execute([$id]);
        $dependingServices = $stmt1->fetchAll(PDO::FETCH_ASSOC);
    
        // query to get what microservices the searched microservice is depending on
        $stmt2 = $db->prepare("SELECT ms_name, microservice_id, path FROM dependencies WHERE depends_on_id = ?");
        $stmt2->execute([$id]);
        $dependentServices = $stmt2->fetchAll(PDO::FETCH_ASSOC);
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
    <div id="add_container">
        <h3>Add dependency</h3>
        <form method="POST" action="">
            <label for="microservice_id">Microservice:</label>
            <select name="microservice_id" required>
                <?php foreach ($services as $service): ?>
                    <option value="<?= $service['id'] ?>"><?= htmlspecialchars($service['ms_name']) ?></option>
                <?php endforeach; ?>
            </select><br><br>

            <label for="depends_on_id">Depends on:</label>
            <select name="depends_on_id" required>
                <?php foreach ($services as $service): ?>
                    <option value="<?= $service['id'] ?>"><?= htmlspecialchars($service['ms_name']) ?></option>
                <?php endforeach; ?>
            </select><br><br>
            <label for="path">Path:</label>
            <input type="text" name="path"><br><br>
            <input type="submit" name="add_dependency" value="Add Dependency">
        </form>
    </div>
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
        if (isset($id)) { 
            if (!empty($dependentServices)) { 
                echo "<h3>" . $ms_name . " is depending on:</h3>";
                echo "<table>";
                    echo "<tr><th>ID</th><th>Microservice</th><th>Path</th></tr>";
                    foreach ($dependentServices as $row) {
                        echo "<tr>";
                            echo "<td>" . htmlspecialchars($row['microservice_id']) . "</td>";
                            echo "<td>" . htmlspecialchars($row['ms_name']) . "</td>";
                            echo "<td>" . htmlspecialchars($row['path']) . "</td>";
                        echo "</tr>";
                    }
                echo "</table>";
            } 
            if (!empty($dependingServices)) { 
                echo "<h3>Microservices that are depending on " . $ms_name . ":</h3>";
                echo "<table>";
                    echo "<tr><th>ID</th><th>Microservice</th><th>Path</th></tr>";
                    foreach ($dependingServices as $row) {
                        echo "<tr>";
                            echo "<td>" . htmlspecialchars($row['depends_on_id']) . "</td>";
                            echo "<td>" . htmlspecialchars($row['depends_on']) . "</td>";
                            echo "<td>" . htmlspecialchars($row['path']) . "</td>";
                        echo "</tr>";
                    }
                echo "</table>";
            } 
        } else if (isset($_GET['ms_name'])) {
            echo "No results found";
        }
    }
    ?>
</body>
</html>