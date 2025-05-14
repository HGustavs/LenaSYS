<?php

session_start();

if (!isset($_SESSION['token'])) {
    $_SESSION['token'] = bin2hex(random_bytes(32));
}

try {
    // database connection
    $db = new PDO('sqlite:endpointDirectory_db.sqlite');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // get microservices
    $services = $db->query("SELECT * FROM microservices")->fetchAll();
    // get dependencies
    $dependencies = $db->query("SELECT * FROM microservices")->fetchAll();

    // check if the tables are empty
    if (empty($services) && empty($dependencies)) {
        $dbEmpty = "Database is installed, but empty.";
    }

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
    <div class="line">
        <h1>Microservice Directory Admin</h1>
    </div>
    <?php
    if (empty($dbEmpty) && empty($dbError)) {
        echo "<p style='color: green;'>Database is installed and filled with data</p>";
    }
    if (isset($dbEmpty)) {
        echo "<p>$dbEmpty</p>";
        echo "<a href='#' id='fillLink'>Fill database with data</a><br>";
    }
    if (isset($dbError)) {
        echo "<p style='color: red;'>$dbError</p>";
        echo "<a href='#' id='installLink'>Install database</a> (without data)<br>";
        echo "<a href='#' id='setupLink'>Setup database</a> (with data)<br>";
    } else {
        echo "<a href='#' id='deleteLink'>Delete database</a><br>";
    }
    ?>
    <a href="microserviceUI.php" class="a-button" style="margin-top: 20px;">Go to microserviceUI</a>
</body>
<script>
    // use optional chaining in case the element doesn't exist 
    document.getElementById('installLink')?.addEventListener('click', function (e) {
        // prevent the links standard behaviour (so it wont navigate to new page)
        e.preventDefault();
        // send AJAX request to run the install script
        fetch('installEndpointDb.php')
            // parse response as plain text
            .then(res => res.text())
            .then(data => {
                alert('Database installed!');
                // reload the page
                location.reload();
            })
            .catch(error => {
                alert('Something went wrong: ' + error);
            });
    });

    document.getElementById('setupLink')?.addEventListener('click', function (e) {
        e.preventDefault();
        fetch('setupEndpointDirectory.php')
            .then(res => res.text())
            .then(data => {
                alert('Database installed and filled with data!');
                location.reload();
            })
            .catch(error => {
                alert('Something went wrong: ' + error);
            });
    });

    document.getElementById('fillLink')?.addEventListener('click', function (e) {
        e.preventDefault();
        // send AJAX request to both fill scripts
        fetch('fillEndpointDb.php')
            .then(res => res.text())
            .then(data1 => {
                return fetch('fillDependenciesDb.php');
            })
            .then(res => res.text())
            .then(data2 => {
                alert('Database has been filled!');
                location.reload();
            })
            .catch(error => {
                alert('Something went wrong: ' + error);
            });
    });

    document.getElementById('deleteLink')?.addEventListener('click', function (e) {
        e.preventDefault();
        // the user must confirm before deleting the database
        if (confirm('Are you sure you want to delete the database? This action cannot be undone.')) {
            fetch('deleteEndpointDb.php')
                .then(res => res.text())
                .then(data => {
                    alert(data);
                    location.reload();
                })
                .catch(error => {
                    alert('Something went wrong: ' + error);
                });
        }
    });
</script>

</html>