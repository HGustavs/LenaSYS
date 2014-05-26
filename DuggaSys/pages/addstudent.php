<?php
include_once(dirname(__FILE__) . "/../../Shared/sessions.php");
session_start();
if(checklogin() 
	&& array_key_exists('courseid', $_POST) 
	&& hasAccess($_SESSION['uid'], $_POST['courseid'], 'w') 
	|| isSuperUser($_SESSION['uid'])) {
?>
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
		<script type="text/javascript" src="js/duggasys.js"></script>
		<script>		
		qs = getUrlVars();
		page.title(qs.name + " - Add students");
		</script>
	</head>
<body>
	<script type="text/javascript">
	var qs = getUrlVars();
	</script>
		<form action="" method="post">
			<h3>Add students</h3>
			<p>Paste the student information into the text area below to add them to 
				the current course.</p> 
<p style="tab-size: 9; white-space: pre-wrap">
The format required for the student information is the following:
<strong>SSN&lt;TAB&gt;NAME&lt;TAB&gt;EMAIL</strong>
e.g.:
<strong>000000-0000	LastName, FirstName	a12firla@student.his.se</strong>
</p>
				
			<textarea placeholder="SSN		Name		email" name="string" id="string" class="addstudent"></textarea>
			<br>
			<input type="button" value="Add students" class="submit-button" onclick="passPopUp();"/>
			<button onclick="changeURL('students?courseid=' + qs.courseid + '&name=' + qs.name)">Back</button>
		</form>
	<div id="light" class="white_content">
	</div>
	<div id="fade" class="black_overlay" onclick="javascript:showPopUp('hide');" >
	</div>
</body>
</html>
<?php
}
?>
