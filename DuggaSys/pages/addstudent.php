<?php
include_once(dirname(__FILE__) . "/../../Shared/sessions.php");
session_start();
if(checklogin()) {
?>
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
		<script type="text/javascript" src="js/duggasys.js"></script>
		<script>page.title("Add student");</script>
	</head>
<body>
		<div id="student-box">
	<form action="" method="post">
		<div id="student-header">Lägg till student!</div>
		<br>
		<br>
		<textarea placeholder="SSN, Name, email" name="string" id="string" cols="30"></textarea>
		<br>
		<input type="button" value="Add student" class="btn btn-login" onclick="passPopUp();"/>
		<a href="students.php"><input type="button" class="btn btn-cancel" value="Cancel"/></a>
	</form>
		<div id="light" class="white_content">
		</div>
</div>
		<div id="fade" class="black_overlay" onclick="javascript:showPopUp('hide');"></div>

</body>
</html>
<?php
}
?>
