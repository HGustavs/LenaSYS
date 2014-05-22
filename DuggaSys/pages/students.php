<?php
include_once(dirname(__FILE__). "/../../../coursesyspw.php");	
include_once(dirname(__FILE__) . "/../../Shared/basic.php");
pdoConnect();
session_start();
if(checklogin()) {
?>
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
		<script type="text/javascript" src="js/duggasys.js"></script>
		<script>
		qs = getUrlVars();
		page.title(qs.name + " - Student list");
		</script>
	</head>
<body>
	<script type="text/javascript">
		var qs = getUrlVars();
		
		function appendStudents(data){
		   var output = "";
		   // Loopar igenom all data vi från tillbaka ifrån getstudent_ajax.php.
		   $.each(data['entries'], function(){
			   if (this.access == 'R') {
			   		access='Student';
			   }
			   else {
			   		access='Teacher';
			   }
			 var sessName = <?php echo json_encode($_SESSION['loginname']) ?>;
			 if (sessName!=this.username) {

		      output += "<tr><td>"+this.username+"</td>";
			  output += "<td>"+this.uid+"</td>";
			  output += "<td>"+access+"</td>";
			  output += "<td>";
			  output += "<form id='accesschange'>";
			  output += "<input type='hidden' name='username' value='" + this.username + "'>";
			  output += "<input type='hidden' name='uid' value='" + this.uid + "'>";
			  output += "<select id='access' name='access' onChange='updateDb(this);'>";
			  output += "<option " + ((this.access == 'W') ? 'selected' : '') + " value='W'>Teacher</option>";
			  output += "<option " + ((this.access == 'R') ? 'selected' : '') + " value='R'>Student</option>";
			  output += "</select>";
			  output += "</form>";
			  output += "</td>";
		      output += "<td id='deletebox1'><input type='checkbox' name='checkbox[]' value='"+this.uid+"'/></td>";
		      output += "<td id='resetbox1'><input type='button' class='submit-button' id='reset_pw_btn' onclick='warningBox(\"Confirm removal\", \"Are you sure you want to reset the password for this user?\", 0, resetPassword," + this.uid + ")' value='Reset'></inut></td></tr>";
			 };
		   });
		   $("table.list tbody").empty();
		   $("table.list tbody").append(output);
		   
		}
	    getStudents();
		function getStudents(){
		  
		  $.ajax({
            type: "POST",
            url: "./ajax/getstudent_ajax.php",
            data: "courseid="+qs.courseid,
			dataType: "JSON",
            success: function(data){
                appendStudents(data);
            },
			error: function() {
                alert("Could not retrieve students");			
			}
          });
		}

		function updateDb(o) {
			$.ajax({
            type: "POST",
            url: "./ajax/updateAccess.php", 
            data: $(o).parent().serialize(),
			dataType: "JSON",
			success: function(data){
				if(data.success == true) {
					successBox('Updated user successfully', 'The user has been updated with the selected access');
					getStudents();
				} else {
					dangerBox('Failed to update user', 'Failed to update the user to the permission you selected');
				}
            },
			error: function() {
	            alert("Could not retrieve students");	
			}
          });
		}
     
	</script>
	<button onclick="changeURL('addstudent?courseid=' + qs.courseid + '&name=' + qs.name)">
		Add students 
	</button>
	<form action="" method="post">
	<div id='students'>
		<table class='list'>
			<thead>
				<tr>
					<th>Name</th>
					<th>UserID</th>
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
