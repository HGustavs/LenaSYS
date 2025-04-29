<?php

try {
    // database
    $db = new PDO('sqlite:endpointDirectory_db.sqlite');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $services = $db->query("SELECT * FROM microservices")->fetchAll();

    // search functionality safe from injections
    if (isset($_GET['search'])) {
        $searchTerm = "%" . $_GET['search'] . "%";
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
    }

} catch (PDOException $e) {
    $dbError = "Database is not installed - instal it first!";
}

?>

<!DOCTYPE html>
<html>

<head>
    <title>Microservice Directory</title>
    <style>
        body {
            font-family: Arial;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
        }

        th,
        td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
        }

        form {
            margin: 20px 0;
        }

        input,
        button {
            padding: 5px;
        }

        .line {
            border-bottom: 1px solid #ddd;
            margin-bottom: 20px;
        }
    </style>
</head>

<body>

    <div class="line">
        <h1>Microservice Directory</h1>
    </div>
    <?php if (!isset($dbError)) {
        if (!isset($microservice)) { ?>

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
            <?php
        }
    } else {
        echo "<p style= 'color:red';>" . $dbError;
    }
    ?>

    <?php if (isset($microservice)) { ?>

        <div class="line">
            <h1><?php echo $microservice['ms_name']; ?> details</h1>
        </div>

        <h2><b>ID: </b><?php echo $microservice['id']; ?></h2>
        <p><b>Description:</b> <?php echo $microservice['description']; ?></p>
        <p><b>Calling methods:</b> <?php echo $microservice['calling_methods']; ?>
        <p><b>Output:</b> <?php echo $microservice['output']; ?>
        <p><b>Output description:</b> <?php echo $microservice['output_description']; ?>
        <p><b>Microservices used:</b> <?php echo $microservice['microservices_used']; ?>

        <h3>Parameters</h3>
        <?php if (!empty($parameters)) { ?>
            <table>
                <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Description</th>
                </tr>
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

        <div style="display: flex; gap: 5px;">
            <form method="">
                <button type="submit">Edit</button>
            </form>

            <form method="">
                <button type="submit">Delete</button>
            </form>
        </div>

        <p><a href="?">Back to list</a></p>

    <?php } else { ?>
        <table>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>View</th>
            </tr>
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
    <?php } ?>
</body>

</html>