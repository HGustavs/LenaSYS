<?php
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

// update functionality
if (isset($_POST['updateID'])) {
    $id = $_POST['updateID'];
    $name = $_POST['ms_name'];
    $description = $_POST['description'];
    $methods = $_POST['calling_methods'];
    $used = $_POST['microservices_used'];

    $stmt = $db->prepare("UPDATE microservices SET ms_name = ?, description = ?, calling_methods = ?, microservices_used = ? WHERE id = ?");
    $stmt->execute([$name, $description, $methods, $used, $id]);
    header("Location: ?id=" . $id);
    exit();
}

if (isset($_GET['edit']) && isset($_GET['id'])) {
    $stmt = $db->prepare("SELECT * FROM microservices WHERE id = ?");
    $stmt->execute([$_GET['id']]);
    $editMicroservice = $stmt->fetch();
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
    $dbError = "Database is not installed. Execute 'setupEndpointDirectory.php' to install it. ";
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Microservice Directory</title>
    <style>
        body { font-family: Arial; max-width: 800px; margin: 0 auto; padding: 20px; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        form { margin: 20px 0; }
        input, button { padding: 5px; }
        .line { border-bottom: 1px solid #ddd; margin-bottom: 20px; }
    </style>
</head>
<body>

    <?php if (isset($editMicroservice)) { ?>
        <div class="line">
            <h1>Edit Microservice</h1>
        </div>
        <form method="post">
            <input type="hidden" name="updateID" value="<?php echo $editMicroservice['id']; ?>">
            <p><b><label>Microservice name:<br><input type="text" name="ms_name" value="<?php echo htmlspecialchars($editMicroservice['ms_name']); ?>" required></label></p>
            <p><label>Description:<br><textarea name="description" rows="5" cols="40"><?php echo htmlspecialchars($editMicroservice['description']); ?></textarea></label></p>
            <p><label>Calling Methods:<br><input type="text" name="calling_methods" required value="<?php echo htmlspecialchars($editMicroservice['calling_methods']); ?>"></label></p>
            <p><label>Microservices Used:<br></b><input type="text" name="microservices_used" value="<?php echo htmlspecialchars($editMicroservice['microservices_used']); ?>" required></label></p>
            <button type="submit">Save Changes</button>
            <a href="?id=<?php echo $editMicroservice['id']; ?>">Cancel</a>
        </form>
    <?php } ?>
    
    <?php    
    if (isset($dbError)) {
        echo "<p style= 'color:red';>" . $dbError;
    } else {
        if (!isset($microservice)) { ?>

        <div class="line">
            <h1>Microservice Directory</h1>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">

            <form method="GET">
                <input type="text" name="search" placeholder="Search name/description">
                    <button type="submit">Search</button>
                <?php if (isset($_GET['search'])): ?>
                    <a href="?">Reset</a>
                <?php endif; ?>
            </form>

            <div style="display: flex; gap: 10px;">
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

        <div style="display: flex; gap: 5px;">
            <form method="get">
                <input type="hidden" name="id" value="<?php echo $microservice['id']; ?>">
                <input type="hidden" name="edit" value="1">
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