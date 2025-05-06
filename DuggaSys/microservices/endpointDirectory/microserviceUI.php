<?php


if (isset($_POST['create_database'])){
    include 'setupEndpointDirectory.php';
    header("Location: " . $_SERVER['PHP_SELF']);
    exit();
}


try {
// database
$db = new PDO('sqlite:endpointDirectory_db.sqlite');
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$services = $db->query("SELECT * FROM microservices")->fetchAll();

// delete functionality
if (isset($_POST['deleteID'])) {
    $id = $_POST['deleteID'];
    $stmt = $db->prepare("DELETE FROM microservices WHERE id = ?");
    $stmt->execute([$id]);
    header("Location: ?");
    exit();
}

// search functionality safe from injections
if (isset($_GET['search'])) {
    $searchTerm = "%".$_GET['search']."%";
    $stmt = $db->prepare("SELECT * FROM microservices WHERE ms_name LIKE ? OR description LIKE ?");
    $stmt->execute([$searchTerm, $searchTerm]);
    $services = $stmt->fetchAll();
} else {
    $services = $db->query("SELECT * FROM microservices")->fetchAll();
}

// show microservices and view details
if (isset($_GET['id'])) {
    $stmt = $db->prepare("SELECT * FROM microservices WHERE id = ?");
    $stmt->execute([$_GET['id']]);
    $microservice = $stmt->fetch();
    
    if ($microservice) {
        $stmt = $db->prepare("SELECT * FROM parameters WHERE microservice_id = ?");
        $stmt->execute([$_GET['id']]);
        $parameters = $stmt->fetchAll();
    }

    if ($microservice) {
        $stmt = $db->prepare("SELECT * FROM outputs WHERE microservice_id = ?");
        $stmt->execute([$_GET['id']]);
        $outputs = $stmt->fetchAll();
    }
}

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
    
    <?php    
    if (isset($dbError)) {
        echo "<p class='error_message'>" . $dbError . "</p>";
    } else {
        if (!isset($microservice)) { ?>

        <div class="line">
            <h1>Microservice Directory</h1>
        </div>
        <div class="search-container">

            <form method="GET">
                <input type="text" name="search" placeholder="Search name/description">
                    <button type="submit">Search</button>
                <?php if (isset($_GET['search'])): ?>
                    <a href="?">Reset</a>
                <?php endif; ?>
            </form>

            <div class="button-container">
                <form method="">
                    <button type="submit">Filter</button>
                </form>

                <form method="">
                    <button type="submit">Add Microservice</button>
                </form>
            </div>
        </div>
    <?php } ?>

    <?php if (isset($microservice)) { ?>

        <div class="line">
            <h1><?php echo $microservice['ms_name']; ?> details</h1>
        </div>

        <h2><b>ID: </b><?php echo $microservice['id']; ?></h2>
        <p><b>Description:</b> <?php echo $microservice['description']; ?></p>
        <p><b>Calling methods:</b> <?php echo $microservice['calling_methods']; ?>
        <p><b>Microservices used:</b> <?php echo $microservice['microservices_used']; ?>

        <h3>Parameters</h3>
        <?php if (!empty($parameters)) { ?>
            <table>
                <tr><th>Name</th><th>Type</th><th>Description</th></tr>
                <?php 
                foreach ($parameters as $param) {
                    echo '<tr>';
                    echo '<td>' . $param['parameter_name'] . '</td>';
                    echo '<td>' . $param['parameter_type'] . '</td>';
                    echo '<td>' . $param['parameter_description'] . '</td>';
                    echo '</tr>';
                }
                ?>
            </table>
        <?php } else { ?>
            <p>No parameters</p>
        <?php } ?>

        <h3>Outputs</h3>
        <?php if (!empty($outputs)) { ?>
            <table>
                <tr><th>Name</th><th>Type</th><th>Description</th></tr>
                <?php 
                foreach ($outputs as $output) {
                    echo '<tr>';
                    echo '<td>' . $output['output_name'] . '</td>';
                    echo '<td>' . $output['output_type'] . '</td>';
                    echo '<td>' . $output['output_description'] . '</td>';
                    echo '</tr>';
                }
                ?>
            </table>
        <?php } else { ?>
            <p>No outputs</p>
        <?php } ?>

        <div class="button-container">
            <form method="">
                <button type="submit">Edit</button>
            </form>

            <form method="post" onsubmit="return confirm('Are you sure you want to delete this microservice?')">
                <input type="hidden" name="deleteID" value="<?php echo $microservice['id']; ?>">
                <button type="submit">Delete</button>
            </form>
        </div>

        <p><a href="?">Back to list</a></p>
        
    <?php } else { ?>
        <table>
    <tr><th>ID</th><th>Name</th><th>Description</th><th>View</th></tr>
    <?php 
    foreach ($services as $service) {
        echo '<tr>';
        echo '<td>' . $service['id'] . '</td>';
        echo '<td>' . $service['ms_name'] . '</td>';
        echo '<td>';
        if (strlen($service['description']) > 50) {
            echo substr($service['description'], 0, 50) . '...';
        } else {
            echo $service['description'];
        }
        echo '</td>';
        echo '<td><a href="?id=' . $service['id'] . '">View</a></td>';
        echo '</tr>';
    }
    ?>
</table>
    <?php } 
    }   ?>
</body>
</html>