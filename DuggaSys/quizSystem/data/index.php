<?php
	function displayTable($tableName, $pdo){
			$querystring = "SELECT * FROM ".$tableName;
			$stmt = $pdo->prepare($querystring);
			$stmt->execute();
			$result=$stmt->fetchAll(PDO::FETCH_ASSOC);
			echo "<table class='dataTable'>";
			echo "<caption>".$tableName."</caption>";
			if(count($result)>0){
				echo "<tr>";
				foreach($result[0] as $key=>$data){
					echo "<th>".$key."</th>";
				}
				echo "</tr>";
				foreach($result as $row){
					echo "<tr>";
					foreach($row as $data){
						echo "<td>".htmlspecialchars($data,ENT_QUOTES,'UTF-8')."</td>";
					}
					echo "</tr>";
				}
			} else {
				echo "<tr>";
				echo "<td> Table empty </td>";
				echo "</tr>";
			}
			echo "</table>";
	}
	
	$content="data/displayData.html.php";
?>