<h2>Register students</h2>
<form name="students" action="." method="post" >
	<label>Course:</label><br />
	<select name="course">
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
	<label>Paste student list from Webladok:</label><br />
	<textarea name="studentList" rows="30" cols="100"></textarea><br />
	<input type="submit" name="parseSubmit" value="Register" />
</form>
<a href=".">Back</a>