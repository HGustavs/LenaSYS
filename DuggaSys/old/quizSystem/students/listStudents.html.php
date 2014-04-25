<h2>List student by course</h2>
<form name="listStudentsCourseSelectForm" action="." method="post">
	<label>Course:</label><br />
	<select name="courseName">
	<?php
		//All courses in the database
		//$courseList
		foreach ($courseList as $course) {
			echo "<option value='".$course['name']."'>".$course['name']."</option>";
		}
	?>
	</select>
	<select name="semester">
		<option value="HT">HT</option>
		<option value="VT">VT</option>
	</select>
	<select name="year">
		<?php
		for($i=12;$i<25;$i++){
			echo "<option value='".$i."'>".$i."</option>";
		}
		?>
	</select>
	<select name="period">
		<option value="1">LP-1</option>
		<option value="2">LP-2</option>
		<option value="3">LP-3</option>
		<option value="4">LP-4</option>
		<option value="5">LP-5</option>
	</select>
	<br />
	<!--<label>Paste student list from Webladok:</label><br />-->
	<!--<textarea name="studentList" rows="30" cols="100"></textarea>-->
	<br />
	<input type='hidden' name='scrolly' id='scrolly' value='0' />
	<input type="hidden" name="listStudentsLink" />
	<input type="submit" name="listStudentsSubmit" value="Display list" />
</form>

<?php 
    //List all students for selected course
	$printNewPassword=false;
	if(isset($studentList)){
		echo "<table class='dataTable'>";
		echo "<caption>".$_POST['courseName']." ".$occasion."</caption>";
		if(count($studentList)>0){
			foreach($studentList[0] as $columnName=>$data){
				echo "<th>".$columnName."</th>";
			}
			foreach($studentList as $row){
				echo "<tr>";
				foreach($row as $data){
					echo "<td>".$data."</td>";
					if(isset($newPasswordForSSN) && $data==$newPasswordForSSN){
						$printNewPassword=true;
					}
				}
				if($printNewPassword){
					echo "<td>New password:<br/>".$newPassword."</td>";
					$printNewPassword=false;
				} else {
					echo "<td>
							<form name='newPasswForStudentForm' action='.' method='post'>
								<input type='submit' name='generateNewPassWordForStudent' value='Generate new password' class='confirm'/>
								<input type='hidden' name='studentSSN' value='".$row['ssn']."' />
								<input type='hidden' name='studentLoginName' value='".$row['loginName']."' />
								<input type='hidden' name='courseName' value='".$_POST['courseName']."' />
								<input type='hidden' name='courseOccasion' value='".$occasion."' />
								<input type='hidden' name='listStudentsSubmit' />
								<input type='hidden' name='listStudentsLink' />
								<input type='hidden' name='scrolly' id='scrolly' value='0' />
							</form>
						</td>";
				}
				echo "<td>
						<form name='unregisterStudentForm' action='.' method='post'>
							<input type='submit' name='unregisterStudentSubmit' value='Unregister' class='confirm' />
							<input type='hidden' name='studentSSN' value='".$row['ssn']."' />
							<input type='hidden' name='courseName' value='".$_POST['courseName']."' />
							<input type='hidden' name='courseOccasion' value='".$occasion."' />
							<input type='hidden' name='listStudentsLink' />
							<input type='hidden' name='listStudentsSubmit' />
							<input type='hidden' name='scrolly' id='scrolly' value='0' />
						</form>
					</td>";
				echo "</tr>";
			}
		} else {
			echo "<tr><td>No students registered for the selected course occasion</td></tr>";
		}
		echo "</table>";
	}
?>

<a href=".">Back</a>