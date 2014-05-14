<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
		<script type="text/javascript" src="js/duggasys.js"></script>
		<script>page.title("Add student");</script>
	</head>
<body>
	<script type="text/javascript">
		var qs = getUrlVars();
		</script>
		<div id="student-box">
	<form action="" method="post">
		<div id="student-header">Lägg till student!</div>
		<br>
		<br>
		<textarea placeholder="SSN, Name, email" name="string" id="string" cols="30"></textarea>
		<br>
		<input type="button" value="Lägg till student" class="btn btn-login" onclick="passPopUp();"/>
		<input type="button" class="btn btn-cancel"  onclick="changeURL('students?courseid=' + qs.courseid)" value="Cancel"/>
	</form>


		<div id="light" class="white_content">
		</div>
</div>
		<div id="fade" class="black_overlay" onclick="javascript:showPopUp('hide');"></div>

</body>
</html>
