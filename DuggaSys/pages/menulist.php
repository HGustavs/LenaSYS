<?php
session_start();
include_once(dirname(__file__)."/../../../coursesyspw.php");	
include_once(dirname(__file__)."/../../shared/database.php");

dbConnect();
?>
<div style="margin-bottom:7px; float:right;"><input style="cursor:pointer;" onclick="changeURL('newCourseForm')" class='submit-button' type='button' value='Add course'></div>
<table class="course-table" cellspacing="0">
	<tr>
		<th colspan="2">Course Example Organization System</th>
	</tr>	
	<?php
		//$counter is used with the styling mechanism
		$counter = 0;
		$querystring="SELECT course.coursename,max(cversion) AS version, cid AS id, visibility FROM course LEFT OUTER JOIN section ON course.coursename=section.coursename GROUP BY course.coursename";
		$result=mysql_query($querystring);
		if (!$result) err("SQL Query Error: ".mysql_error(),"Database Password Check Error");
		while ($row = mysql_fetch_assoc($result)){
			//Sets $color to either true or false (different colors) depending on row counter.
			$color=($counter % 2 == 0) ? '#f0f0f0' : '#e3e3e3';
			$counter++;
				echo "<tr style='background-color:".$color.";'><td style='width:98%;' onclick='changeURL(\"sectioned?courseid=". $row['id']. "&coursename=" . $row['coursename'] . "\")'>".$row['coursename']."</td>";
				echo "<td style='width:2%;' onclick='showSettingRow(".$row['id'].")' ><img id='table-img-coggwheel' src='css/images/general_settings_button_darkgrey.svg' />";
				echo "</td></tr>";
				echo "<tr class='settings-tr' id='settings_".$row['id']."'>";
				echo "<td class='settings-td'>Edit name:<input type='text' value='".$row['coursename']."' />";
				echo "Visibility:<select><option value='".$row['visibility']."'>";
				if($row['visibility'] != 0){
					echo "Public</option>";
					echo "<option value='0'>Hidden</option>";
				}else{
					echo "Hidden</option>";
					echo "<option value='1'>Public</option>";
				}
				echo "</select>";
				echo "<input class='submit-button' type='button' value='Access' style='margin-left:10px;margin-right:10px;'/><input class='submit-button' onclick='courseSettingsService(".$row['id'].")' type='button' value='Save' />";
				echo "</td></tr>";
		}	
	?>
</table>
