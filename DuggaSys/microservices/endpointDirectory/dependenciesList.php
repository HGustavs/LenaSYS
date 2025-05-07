<?php
$dbFile = __DIR__ . '/endpointDirectory_db.sqlite';
$db = new PDO('sqlite:' . $dbFile);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$query = $db->query("SELECT * FROM dependencies");
$dependencies = $query->fetchAll(PDO::FETCH_ASSOC);

echo "<h2>Dependencies in database</h2>";
echo "<table border='1''>";
echo "<tr><th>ID</th><th>Microservice</th><th>MS ID</th><th>Depends on</th><th>Depends on ID</th><th>Path</th></tr>";

foreach ($dependencies as $dependency) {
    echo "<tr>";
    echo "<td>" . $dependency['dependency_id'] . "</td>";
    echo "<td>" . $dependency['ms_name'] . "</td>";
    echo "<td>" . $dependency['microservice_id'] . "</td>";
    echo "<td>" . $dependency['depends_on'] . "</td>";
    echo "<td>" . $dependency['depends_on_id'] . "</td>";
    echo "<td>" . $dependency['path'] . "</td>";
    echo "</tr>";
}

echo "</table>";


?>