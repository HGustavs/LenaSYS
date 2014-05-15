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
			<link type="text/css" href="css/style.css" rel="stylesheet">
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
		<script type="text/javascript" src="js/duggasys.js"></script>
		<script>
		qs = getUrlVars();
		page.title(qs.name);
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
		      output += "<tr><td>"+this.username+"</td>";
			  output += "<td>"+this.uid+"</td>";
			  output += "<td>"+access+"</td>";
			  output += "<td>";
			  output += "<form id='accesschange'>";
			  output += "<select id='access' name='access' onChange='updateDb();'>";
			  output += "<option value='0'>Access</option>";
			  output += "<option value='W'>Teacher</option>";
			  output += "<option value='R'>Student</option>";
			  output += "</select>";
			  output += "</form>";
				output += "</td>";
		      output += "<td id='deletebox1' style='display:none'><input type='checkbox' name='checkbox[]' value='"+this.uid+"'/></td></tr>";
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

		function updateDb() {
			$.ajax({
            type: "POST",
            url: "./ajax/updateAccess.php", 
            data: $("#accesschange").serialize(),
			dataType: "JSON",
            success: function(data){
                appendStudents(data);
            },
			error: function() {
	            alert("Could not retrieve students");	
			}
          });
		}

	</script>
	<div id="student-box">
		<div id="student-header">Studentview</div>
		<button onclick="changeURL('addstudent?courseid=' + qs.courseid + '&name=' + qs.name)">
			Add students 
		</button>
	<form action="" method="post">
	<div id='students'>
	<table class='list'>
	<thead>
	<tr><th>Name</th>
	<th>UserID</th>
	<th>Access</th>
	<th>Change Access</th>
	<th id='deletebox' style='visibility: hidden'>Delete</th></tr>
	</thead>
    <tbody>
		<tr>
			<td>Loading...</td>
		</tr>
	</tbody>
	</table>

		<input id="hide" type="button" value="Back" class="submit-button" onclick="javascript:studentDelete('hide');"/>
		<input id="show" type="button" value="Edit" class="submit-button" onclick="javascript:studentDelete('show');"/>
		<input id="deletebutton" type="submit" class="submit-button" style='visibility: hidden' value="Delete" name="delete"/>


		<?php

 	
		if (isset($_POST['delete'])) {

			if(!empty($_POST['checkbox'])) {
   				foreach($_POST['checkbox'] as $check) {
	    			$pdo->query( "DELETE FROM user_course WHERE uid='$check'" );
	    			header("Location: students.php");
   				}
			}
		}

		?>
		</form>
		</div>
	</div>
</body>
</html>
<?php
}
?>
