<?php
include_once ("../Shared/database.php");
pdoConnect();

$uname = strval($_GET['uname']);

echo "<table>
<tr>
<th>Firstname</th>
<th>Lastname</th>
</tr>";
foreach ($pdo->query('SELECT * FROM user WHERE username="'.$uname.'"') AS $row){
  echo "<tr>";
  echo "<td>" . $row['firstname'] . "</td>";
  echo "<td>" . $row['lastname'] . "</td>";
  echo "</tr>";
}
echo "</table>";

?>