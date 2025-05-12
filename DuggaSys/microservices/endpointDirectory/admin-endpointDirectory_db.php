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

    // get microservices
    $services = $db->query("SELECT * FROM microservices")->fetchAll();

    // check if the table is empty
    if (empty($services)) {
        $dbEmpty = "Database is installed but empty.";
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
    <h1>Microservice Documentation Database Admin</h1>
    <?php
    if (isset($dbEmpty)) {
        echo $dbEmpty;
    }
    if (isset($dbError)) {
        echo $dbError . "<br>";
        echo "<a href='#' id='installLink'>Install database</a> (doesn't fill)</br>";
        echo "<a href='#' id='setupLink'>Setup database</a> (fill)";
    } else {
        echo "<br><a href='#' id='deleteLink'>Delete database</a>";
    }
    ?>
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
                alert('Database installed and filled!');
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