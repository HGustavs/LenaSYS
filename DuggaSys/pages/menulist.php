<?php
session_start();
include_once(dirname(__file__)."/../../Shared/sessions.php");

pdoConnect();
?>
<head>
	<script type="text/javascript" src="js/verificationFunctions.js"></script>
</head>

<?php
if (checklogin()) {
	if (isSuperUser($_SESSION["uid"])) {
		echo "<div style='margin-bottom:7px; float:right;'><input style='cursor:pointer;' onclick='changeURL(\"newCourseForm\")' class='submit-button' type='button' value='Add course'></div>";
	}
}
?>
<table class="course-table" cellspacing="0">
	<tr>
		<th colspan="2">Course Example Organization System</th>
	</tr>	
	<?php
		//$counter is used with the styling mechanism
		$counter = 0;
		$query=$pdo->query("SELECT course.coursename,cid AS id,visibility FROM course ORDER BY coursename");
		$result=$query->execute();
		if (!$result) {
			$errorinfo = $query->errorInfo();
			$errormsg = $errorinfo[2];
			$error_sqlcode = $errorinfo[0];
			$error_myerr = $errorinfo[1];
			// Should this really be here? This is information leakage.
			err("SQL Query Error: ". $error_sqlcode . " :" . $error_myerr . " " . $errormsg);
		}
		while ($row = $query->fetch(PDO::FETCH_ASSOC)){
			//Sets $color to either true or false (different colors) depending on row counter.
			$color=($counter % 2 == 0) ? '#f0f0f0' : '#e3e3e3';
			if ($row['visibility'] == 0) {
				if (checklogin()) {
					if (hasAccess($_SESSION["uid"], $row['id'], 'r') && !hasAccess($_SESSION["uid"], $row['id'], 'w')) {
						//Checks the visibility, changes the opacity for hidden.
						if($row['visibility'] != 0){
							echo "<tr style='background-color:".$color.";'><td style='width:98%;' onclick='changeURL(\"sectioned?courseid=". $row['id']. "&coursename=" . $row['coursename'] . "\")'>".$row['coursename']."</td>";
							echo "</td></tr>";
						} else {
							echo "<tr style='background-color:".$color.";opacity:0.5;'><td style='width:98%;' onclick='changeURL(\"sectioned?courseid=". $row['id']. "&coursename=" . $row['coursename'] . "\")'>".$row['coursename']."</td>";
							echo "</td></tr>";
						}
						$counter++;
					} else if (hasAccess($_SESSION["uid"], $row['id'], 'w') || isSuperUser($_SESSION["uid"])) {
						//Checks the visibility, changes the opacity for hidden.
						if($row['visibility'] != 0){
							echo "<tr style='background-color:".$color.";'><td style='width:98%;' onclick='changeURL(\"sectioned?courseid=". $row['id']. "&coursename=" . $row['coursename'] . "\")'>".$row['coursename']."</td>";
							echo "<td style='width:2%;' onclick='showSettingRow(".$row['id'].")' ><img id='table-img-coggwheel' src='css/images/general_settings_button_darkgrey.svg' />";
							echo "</td></tr>";
						}else {
							echo "<tr style='background-color:".$color.";opacity:0.5;'><td style='width:98%;' onclick='changeURL(\"sectioned?courseid=". $row['id']. "&coursename=" . $row['coursename'] . "\")'>".$row['coursename']."</td>";
							echo "<td style='width:2%;' onclick='showSettingRow(".$row['id'].")' ><img id='table-img-coggwheel' src='css/images/general_settings_button_darkgrey.svg' />";
							echo "</td></tr>";
						}
						$counter++;
					}
				}
			} else {
				echo "<tr style='background-color:".$color.";'><td style='width:98%;' onclick='changeURL(\"sectioned?courseid=". $row['id']. "&coursename=" . $row['coursename'] . "\")'>".$row['coursename']."</td>";
				if (checklogin())  {
					if (hasAccess($_SESSION["uid"], $row['id'], 'w') || isSuperUser($_SESSION["uid"])) {
						echo "<td style='width:2%;' onclick='showSettingRow(".$row['id'].")' ><img id='table-img-coggwheel' src='css/images/general_settings_button_darkgrey.svg' />";
					}
				}
				echo "</td></tr>";
				$counter++;
			}
			if (checklogin()) {
				if (hasAccess($_SESSION["uid"], $row['id'], 'w') || isSuperUser($_SESSION["uid"])) {
					echo "<tr class='settings-tr' id='settings_".$row['id']."'>";
					echo "<td class='settings-td' style='float:left;'>Edit name:<input type='text' name='coursename' value='".$row['coursename']."' />";
					echo "Visibility:<select name='visibility'><option value='".$row['visibility']."'>";
					if($row['visibility'] != 0){
						echo "Public</option>";
						echo "<option value='0'>Hidden</option>";
					}else{
						echo "Hidden</option>";
						echo "<option value='1'>Public</option>";
					}
					echo "</select>";
					echo "<td class='settings-td-buttons'><input class='submit-button' type='button' value='Access' style='margin-left:10px;margin-right:10px;'/><input class='submit-button' onclick='courseSettingsService(".$row['id'].")' type='button' value='Save' />";
					echo "</td></td></tr>";
				}
			}
		}	
	?>
</table>