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
    if (!isset($_POST['token']) || $_POST['token'] !== $_SESSION['token']) {
        http_response_code(403);
        exit('Invalid CSRF token');
    }
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

// add functionality
if (isset($_POST['addMicroservice'])) {
    if (!isset($_POST['token']) || $_POST['token'] !== $_SESSION['token']) {
        http_response_code(403);
        exit('Invalid CSRF token');
    }

    $name = $_POST['ms_name'];
    $description = $_POST['description'];
    $methods = $_POST['calling_methods'];
    $used = $_POST['microservices_used'];

    $stmt = $db->prepare("INSERT INTO microservices (ms_name, description, calling_methods, microservices_used) VALUES (?, ?, ?, ?)");
    $stmt->execute([$name, $description, $methods, $used]);
    header("Location: ?");
    exit();
}

if (isset($_GET['add'])) {
    $addingNew = true;
} elseif (isset($_GET['edit']) && isset($_GET['id'])) {
    $stmt = $db->prepare("SELECT * FROM microservices WHERE id = ?");
    $stmt->execute([$_GET['id']]);
    $editMicroservice = $stmt->fetch();
}

// search functionality safe from injections, filter functionality for POST and GET
if (isset($_GET['search'])) {
    $searchTerm = "%".$_GET['search']."%";
    $stmt = $db->prepare("SELECT * FROM microservices WHERE ms_name LIKE ? OR description LIKE ?");
    $stmt->execute([$searchTerm, $searchTerm]);
    $services = $stmt->fetchAll();
} elseif (isset($_GET['filter_method']) && in_array($_GET['filter_method'], ['GET', 'POST'])) {
    $method = $_GET['filter_method'];
    $stmt = $db->prepare("SELECT * FROM microservices WHERE calling_methods = ?");
    $stmt->execute([$method]);
    $services = $stmt->fetchAll();
} elseif (isset($_GET['param-search'])) {
    $searchTerm = "%".$_GET['param-search']."%";
    $stmt = $db->prepare("
        SELECT DISTINCT m.* 
        FROM microservices m
        JOIN parameters p ON m.id = p.microservice_id
        WHERE p.parameter_name LIKE ?
    ");
    $stmt->execute([$searchTerm]);
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

    if ($microservice) {
        $stmt = $db->prepare("SELECT * FROM dependencies WHERE microservice_id = ?");
        $stmt->execute([$_GET['id']]);
        $dependencies = $stmt->fetchAll();
    }

    if ($microservice) {
        $stmt = $db->prepare("SELECT * FROM dependencies WHERE depends_on_id = ?");
        $stmt->execute([$_GET['id']]);
        $depending_on = $stmt->fetchAll();
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

    <?php if (isset($editMicroservice)) { ?>
        <div class="edit_modal">
            <div class="edit_modal_content">
                <div class="line">
                    <h1>Edit Microservice</h1>
                </div>
                <form method="post">
                    <input type="hidden" name="token" value="<?php echo $_SESSION['token']; ?>">
                    <input type="hidden" name="updateID" value="<?php echo $editMicroservice['id']; ?>">
                    <p><b><label>Microservice name:<br><input type="text" name="ms_name" value="<?php echo htmlspecialchars($editMicroservice['ms_name']); ?>" required></label></p>
                    <p><label>Description:<br><textarea name="description" rows="5" cols="40"><?php echo htmlspecialchars($editMicroservice['description']); ?></textarea></label></p>
                    <p><label>Calling Methods:<br><input type="text" name="calling_methods" required value="<?php echo htmlspecialchars($editMicroservice['calling_methods']); ?>"></label></p>
                    <p><label>Microservices Used:<br></b><input type="text" name="microservices_used" value="<?php echo htmlspecialchars($editMicroservice['microservices_used']); ?>" required></label></p>
                    <button type="submit">Save Changes</button>
                    <a href="?id=<?php echo $editMicroservice['id']; ?>" class="a-button">Cancel</a>
                </form>
            </div>
        </div>
    <?php } ?>

    <?php if (isset($addingNew)) { ?>
        <div class="add_modal">
            <div class="add_modal_content">
                <div class="line">
                    <h1>Add New Microservice</h1>
                </div>
                <form method="post">
                    <input type="hidden" name="token" value="<?php echo $_SESSION['token']; ?>">
                    <input type="hidden" name="addMicroservice" value="1">
                    <p><b><label>Microservice name:<br><input type="text" name="ms_name" required placeholder="Enter name" ></label></p>
                    <p><label>Description:<br><textarea name="description" rows="5" cols="40" placeholder="Enter description..."></textarea></label></p>
                    <p><label>Calling Methods:<br><input type="text" name="calling_methods" required placeholder="Enter method"></label></p>
                    <p><label>Microservices Used:<br></b><input type="text" name="microservices_used" required placeholder="Enter microservices"></label></p>
                    <button type="submit">Add Microservice</button>
                    <a href="?">Cancel</a>
                </form>
            </div>
        </div>
    <?php } ?>
    
    <?php    
    if (isset($dbError)) {
        echo "<p class='error_message'>" . $dbError . "</p>";
    } else {
        if (!isset($microservice)) { ?>

        <div class="line">
            <h1>Microservice Directory</h1>
        </div>
        <div class="search-container">
            <div>
                <form method="GET">
                    <input type="text" name="search" placeholder="Search name/description">
                        <button type="submit">Search</button>
                    <?php if (isset($_GET['search'])): ?>
                        <a href="?" class="a-button">Reset</a>
                    <?php endif; ?>
                </form>
                <form method="GET">
                    <input type="text" name="param-search" placeholder="Search parameter">
                    <button type="submit">Search</button>
                    <?php if (isset($_GET['param-search'])): ?>
                        <a href="?" class="a-button">Reset</a>
                    <?php endif; ?>
                </form>
                <form method="GET">
                    <select name="filter_method">
                        <option value="">-Select Method-</option>
                        <option value="GET" <?php if (isset($_GET['filter_method']) && $_GET['filter_method'] == 'GET') echo 'selected'; ?>>GET</option>
                        <option value="POST" <?php if (isset($_GET['filter_method']) && $_GET['filter_method'] == 'POST') echo 'selected'; ?>>POST</option>
                    </select>
                    <button type="submit">Filter</button>
                    <?php if (isset($_GET['filter_method'])): ?>
                        <a href="?" class="a-button">Reset</a>
                    <?php endif; ?>
                </form>
            </div>
            <div class="button-container">
                <form method="get">
                    <input type="hidden" name="add" value="1">
                    <button type="submit">Add Microservice</button>
                </form>
                <button style="margin: 20px 0;" onclick="document.location='downloadDb.php'">Download Database</button>
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
        <?php 
        echo "<h3>Dependencies</h3>";
        echo "Inverse dependencies - A list of microservices that depends on '<b>" . $microservice['ms_name'] . "</b>'";
        if (!empty($dependencies)) {
            echo "<table>";
            echo "<tr><th>Microservice</th><th>Path</th></tr>";
            foreach ($dependencies as $dependency) {
                echo '<tr>';
                echo '<td>' . "<a href=?id=" . $dependency['depends_on_id'] . ">" . $dependency['depends_on'] . '</td>';
                echo '<td>' . $dependency['path'] . '</td>';
                echo '</tr>';
            }
            echo "</table>";
        } else {
            echo "<p>No inverse dependencies</p>";
        }

        echo "Dependencies - A list of microservices that <b>'"  . $microservice['ms_name'] . "</b>' depends on";
        if (!empty($depending_on)) {
            echo "<table>";
            echo "<tr><th>Microservice</th><th>Path</th></tr>";
            foreach ($depending_on as $depends) {
                echo '<tr>';
                echo '<td>' . "<a href=?id=" . $depends['microservice_id'] . ">" . $depends['ms_name'] . '</td>';
                echo '<td>' . $depends['path'] . '</td>';
                echo '</tr>';
            }
            echo "</table>";
        } else {
            echo "<p>No dependencies</p>";
        }
        ?>
        </table>
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

        <p><a href="?" class="a-button">Back to list</a></p>
        
    <?php } else { ?>

    <?php 
    if (isset($_GET['search'])) {
        echo "Showing results for (name/description): " . $_GET['search'];
    } else if (isset($_GET['param-search'])) {
        echo "Showing results for (parameter): " . $_GET['param-search'];
    } else if (isset($_GET['filter_method'])) {
        echo "Showing results with Calling Method: " . $_GET['filter_method'];
    }
    if (empty($services)) {
        echo "<p style='color: red;'>No results found.</p>";
    } else {
            echo "<table>";
            echo "<tr><th>ID</th><th>Name</th><th>Description</th><th>View</th></tr>";
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
            echo '<td><a href="?id=' . $service['id'] . '" class="a-button">View</a></td>';
            echo '</tr>';
        }
    }
    ?>
</table>
    <?php } 
    }   ?>
</body>
</html>