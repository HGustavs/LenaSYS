<?php
include_once(dirname(__FILE__). "/../../../coursesyspw.php");	
include_once(dirname(__FILE__) . "/../../Shared/basic.php");
pdoConnect();
session_start();
if(!array_key_exists('courseid', $_POST)) {
	die('No course set');
}
if(checklogin() && hasAccess($_SESSION['uid'], $_POST['courseid'], 'w') || isSuperUser($_SESSION['uid'])) {
?>
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
		<script type="text/javascript" src="js/duggasys.js"></script>
		<script type="text/javascript" src="js/paginationAccesslist.js"></script>
		<script>
		qs = getUrlVars();
		page.title(qs.name + " - Student list");
		</script>
	</head>
<body>
	<script type="text/javascript">
		var qs = getUrlVars();
		var sessName = <?php echo json_encode($_SESSION['loginname']) ?>;
		pagination = new pagination();
		getResults(pagination, qs.courseid);
		pagination.showContent();

		$("#searchbox").on("propertychange change keyup paste input", function(){
			pagination.clearRows();
			if ($("#searchbox").val().length > 0) {
				pagination.showContent($("#searchbox").val());
				pagination.renderPages($("#searchbox").val());
				pagination.calculatePages($("#searchbox").val());
			} else {
				pagination.showContent();
				pagination.renderPages();
				pagination.calculatePages();
			}
		});
     
	</script>
	<button onclick="changeURL('addstudent?courseid=' + qs.courseid + '&name=' + qs.name)">
		Add students 
	</button>
	<form action="" method="post">
	<div id='students'>
		<table class='list'>
			<thead>
				<tr>
					<th>Username</th>
					<th>Firstname</th>
					<th>Lastname</th>
					<th>Access</th>
					<th>Change Access</th>
					<th id='deletebox'>Delete</th>
					<th id='resetbox'>Reset password</th>
				</tr>
		</thead>
		<tbody>
			<tr>
				<td>Loading...</td>
			</tr>
		</tbody>
		</table>
		<input id="deletebutton" class="submit-button" value="Delete" name="delete" type="button" />
		<div style="overflow: hidden;">
		<input type="text" id="searchbox" name="search" placeholder="Search by username" style='float:right; width: 10%;'>
		</div>


		</form>
		</div>

	</div>
			<div id="light" class="white_content">
		</div>
		<div id="fade" class="black_overlay" onclick="javascript:showPopUp('hide');"></div>
</body>
</html>
<?php
}
?>
