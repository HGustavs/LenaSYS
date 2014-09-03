











/*

AJAXServiceSection("get","all");

//----------------------------------------
// Service:
//----------------------------------------

function AJAXServiceSection(opt,para)
{
	$.ajax({
		url: "ajax/SectionedService.php",
		type: "POST",
		data: "courseid="+querystring['courseid']+"&coursename="+querystring['courseid']+"&coursevers="+querystring['coursevers']+"&opt="+opt+para,
		dataType: "json",
		success: returnedSection
	});
}

function processLogin() {
		var username = $("#login #username").val();
		var saveuserlogin = $("#login #saveuserlogin").val();
		var password = $("#login #password").val();
		$.ajax({
			type:"POST",
			url: "login.php",
			data: {
				username: username,
				saveuserlogin: saveuserlogin == 1 ? 'on' : 'off',
				password: password
			},
			success:function(data) {
				var result = JSON.parse(data);
				if(result['login'] == "success") {
					$("#user label").html(result['username']);
					$("#user img").addClass("loggedin");
					hideLoginPopup();
					$("#loginbutton").click(function(){processLogout();});
					AJAXServiceSection("get","all");
				}else{
					console.log("Failed to log in.");
					if(typeof result.reason != "undefined") {
						$("#login #message").html("<div class='alert danger'>" + result.reason + "</div>");
					} else {
						$("#login #message").html("<div class='alert danger'>Wrong username or password!</div>");
					}
					$("input#username").css("background-color", "#ff7c6a");
					$("input#password").css("background-color", "#ff7c6a");
				}
			},
			error:function() {
				console.log("error");
			}
		});
}

function processLogout() {
	$.ajax({
		type:"POST",
		url: "logout.php",
		success:function(data) {
			$("#user label").html("Guest");
			$("#user img").removeClass("loggedin");
			$("#loginbutton").click(function(){showLoginPopup();});
			AJAXServiceSection("get","all");			
		},
		error:function() {
			console.log("error");
		}
	});
}

//----------------------------------------
// Commands:
//----------------------------------------

function selectItem(lid,entryname,kind,evisible,elink)
{
		// Display Select Marker
		$(".item").css("border","none");
		$(".item").css("box-shadow","none");
		$("#I"+lid).css("border","2px dashed #FC5");
		$("#I"+lid).css("box-shadow","1px 1px 3px #000 inset");
		
		// Set Name		
		$("#sectionname").val(entryname);

		// Set Lid	
		$("#lid").val(lid);

		// Set Kind
		str="";
		if(kind==0) str+="<option selected='selected' value='0'>Header</option>"
		else str+="<option value='0'>Header</option>";
		if(kind==1) str+="<option selected='selected' value='1'>Section</option>"
		else str+="<option value='1'>Section</option>";
		if(kind==2) str+="<option selected='selected' value='2'>Code</option>"
		else str+="<option value='2'>Code</option>";
		if(kind==3) str+="<option selected='selected' value='3'>Test</option>"
		else str+="<option value='3'>Test</option>";
		if(kind==4) str+="<option selected='selected' value='4'>Link</option>"
		else str+="<option value='4'>Link</option>";
		$("#type").html(str);
						
		// Set Visibiliy
		str="";
		if(evisible==0) str+="<option selected='selected' value='0'>Hidden</option>"
		else str+="<option value='0'>Hidden</option>";
		if(evisible==1) str+="<option selected='selected' value='1'>Public</option>"
		else str+="<option value='1'>Public</option>";
		$("#visib").html(str);

		// Set Link
		$("#link").val(elink);
		
		// Graying of Link
		if(kind<2){
				$("#link").css("opacity","0.3");		
				$("#linklabel").css("opacity","0.3");	
				$("#link").prop('disabled', true);					
				$("#createbutton").css('visibility', 'hidden');					
		}else{
				$("#link").css("opacity","1.0");		
				$("#linklabel").css("opacity","1.0");				
				$("#link").prop('disabled', false);					

				if(elink==""){
						$("#createbutton").css('visibility', 'visible');					
				}else{
						$("#createbutton").css('visibility', 'hidden');					
				}

		}
		
		// Show dialog
		$("#editSection").css("display","block");
		
}

function deleteItem()
{
		lid=$("#lid").val();
		AJAXServiceSection("DEL","&lid="+lid);
}

function updateItem()
{
		lid=$("#lid").val();
		kind=$("#type").val();
		link=$("#link").val();
		sectionname=$("#sectionname").val();
		visibility=$("#visib").val();

		AJAXServiceSection("UPDATE","&lid="+lid+"&kind="+kind+"&link="+link+"&sectname="+sectionname+"&visibility="+visibility);

}

// Create New Dugga/Example

function createLink()
{
		alert("CREATE!");
}
		
function newItem()
{
		lid=$("#lid").val();
		AJAXServiceSection("NEW","&lid="+lid);
}

//----------------------------------------
// Renderer
//----------------------------------------

function returnedSection(data)
{
		retdata=data;
		
		sessionkind=true;
		
		// Fill section list with information
		str="";

		if(sessionkind) {
			str+="<div style='float:right;'>";
			str+="<input class='submit-button' type='button' value='New' onclick='newItem();'/>";
			str+="</div>";
		}
		
		// Course Name
		str+="<div class='course'>"+data.coursename+" "+data.coursevers+"</div>";

		str+="<div id='Sectionlistc' >";
  
		// For now we only have two kinds of sections
		if (data['entries'].length > 0) {
			for(i=0;i<data['entries'].length;i++){
				var item=data['entries'][i];

				// If visible or we are a teacher/superuser
				if (parseInt(item['visible']) === 1 || sessionkind === true) {
								
						if(parseInt(item['kind']) === 0 ){
								// Styling for header row
								str+="<span class='bigg item' id='I"+item['lid']+"' ";
						} else if(parseInt(item['kind']) === 1 ){
								//Styling for section row
								str+="<span class='butt item' id='I"+item['lid']+"' ";
						} else if(parseInt(item['kind']) === 2 ){
								// Styling for example row
								str+="<span class='example item' id='I"+item['lid']+"' ";
						} else if(parseInt(item['kind']) === 3 ){
								// Styling for test row
								str+="<span class='test item' id='I"+item['lid']+"' ";
						}else {
								// Styling for 'others' row
								str+="<span class='norm item' id='I"+item['lid']+"' ";
						}

						if (parseInt(item['visible']) === 0) str+=" style='opacity: 0.4;' ";

						if(sessionkind===true) str+=" onclick='selectItem(\""+item['lid']+"\",\""+item['entryname']+"\",\""+item['kind']+"\",\""+item['visible']+"\",\""+item['link']+"\");' ";
						
						str+=">";
						
						if (parseInt(item['kind']) < 2) {
							str+="<span style='padding-left:5px;'>"+item['entryname']+"</span>";
						} else if (parseInt(item['kind']) == 2 || parseInt(item['kind']) >= 4) {
							str+="<span><a style='margin-left:15px;' id='section-list' href="+item['link']+">"+item['entryname']+"</a></span>";
						} else {
							str+="<a id='section-list' style='cursor:pointer;margin-left:15px;' onClick='changeURL(\""+item['link']+"\")'>"+item['entryname']+"</a>";
						}	
											
						str+="</span>";
				}
			}	
		} else {
				// No items were returned! 
				
				str+="<div class='bigg'>";
				str+="<span>There is currently no content in this course</span>";
				str+="</div>";
		}
			
		str+="</div>";

		var slist=document.getElementById('Sectionlist');
		slist.innerHTML=str;

		if(sessionkind) {				
			// Enable sorting always if we are superuser as we refresh list on update 
			$("#Sectionlistc").sortable({
					helper: 'clone',
	      	update:  function (event, ui) {
	            str="";
	            $("#Sectionlist").find(".item").each(function(i) { 
	  						if(i>0) str+=",";
	  						ido=$(this).attr('id');
	  						str+=i+"XX"+ido.substr(1);
							});
							
							AJAXServiceSection("REORDER","&order="+str);
	        		
	        		return false;
	        }										
			});
	
		}
		
	  if(data['debug']!="NONE!") alert(data['debug']);

}


*/
















		
/*

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
		$visiblecourses = 0;
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
						$visiblecourses++;
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
						$visiblecourses++;
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
				$visiblecourses++;
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
					echo "<td class='settings-td-buttons'><input class='submit-button' type='button' value='Access' style='margin-left:10px;margin-right:10px;' onclick=\"changeURL('students?courseid=" . $row['id'] . "&name=" .  $row['coursename'] . "')\" /><input class='submit-button' onclick='courseSettingsService(".$row['id'].")' type='button' value='Save' />";
					echo "</td></td></tr>";
				}
			}
		}


*/










/*

function courseexists($coursename)
{
	global $pdo;

	if($pdo == null) {
		pdoConnect();
	}

	if(!is_numeric($coursename)) {
		$coursename = getCourseId($coursename);
	}

	$query = $pdo->prepare('SELECT COUNT(cid) FROM course WHERE cid=:course');
	$query->bindParam(':course', $coursename);
	if($query->execute() && $query->rowCount() > 0) {
		$res = $query->fetch(PDO::FETCH_NUM);
		return $res[0] > 0;
	} else {
		return false;
	}
}

function getCourseId($coursename)
{
	global $pdo;

	if($pdo == null) {
		pdoConnect();
	}

	$query = $pdo->prepare('SELECT cid FROM course WHERE coursename=:course LIMIT 1');
	$query->bindParam(':course', $coursename);

	if($query->execute() && $query->rowCount() > 0) {
		$course = $query->fetch();
		return $course['cid'];
	} else {
		return false;
	}
}

function getCourseName($courseid)
{
	global $pdo;

	if($pdo == null) {
		pdoConnect();
	}

	$query = $pdo->prepare("SELECT coursename FROM course WHERE cid=:cid LIMIT 1");
	$query->bindParam(':cid', $courseid);

	if($query->execute() && $query->rowCount() > 0) {
		$course = $query->fetch();
		return $course["coursename"];
	} else {
		return false;
	}
}


pdoConnect();

<head>
	<script type="text/javascript" src="js/verificationFunctions.js"></script>
    <!--This is for adding the correct title to this page-->
    <script>page.title("Course List");</script>
</head>

if (checklogin()) {
	if (isSuperUser($_SESSION["uid"])) {
		echo "<div style='margin-bottom:7px; float:right;'><input style='cursor:pointer;' onclick='changeURL(\"newCourseForm\")' class='submit-button' type='button' value='Add course'></div>";
	}
}

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
		$visiblecourses = 0;
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
						$visiblecourses++;
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
						$visiblecourses++;
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
				$visiblecourses++;
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
					echo "<td class='settings-td-buttons'><input class='submit-button' type='button' value='Access' style='margin-left:10px;margin-right:10px;' onclick=\"changeURL('students?courseid=" . $row['id'] . "&name=" .  $row['coursename'] . "')\" /><input class='submit-button' onclick='courseSettingsService(".$row['id'].")' type='button' value='Save' />";
					echo "</td></td></tr>";
				}
			}
		}
		
		if ($visiblecourses == 0) {
			echo "<tr>";
			echo "<th colspan='2'>There are currently no courses available</th>";
			echo "</tr>";
		}

</table>


include_once(dirname(__file__)."/../../../coursesyspw.php");
include_once(dirname(__file__)."/../../Shared/database.php");
pdoConnect();

// Command is update course
if (checklogin()) {
	if (isSuperUser($_SESSION["uid"]) || hasAccess($_SESSION['uid'], $_POST['courseid'], 'w')) {
		include_once(dirname(__file__)."/../../../coursesyspw.php");
		include_once(dirname(__file__)."/../../Shared/database.php");
		pdoConnect();
		$success = true;
		$stmt = $pdo -> prepare('UPDATE `course` SET `coursename` = :2, `visibility` = :3 WHERE `cid` = :1');
		$stmt -> bindParam(':1', $_POST["courseid"]);
		$stmt -> bindParam(':2', $_POST["coursename"]);
		$stmt -> bindParam(':3', $_POST["visibility"]);
		
		if (!$stmt -> execute()) {
			$success = FALSE;
		}

		echo json_encode("Successfully updated course!");
	} else {
		echo json_encode("No write access");
	}
} else {
	echo json_encode("No access");
}

// Command is create course
if (checklogin()) {
	if (isSuperUser($_SESSION["uid"])==true) {

		//check if course name exists, returns number
		$stmt = $pdo -> prepare('SELECT count(cid) as count FROM course WHERE coursename=:1');
		$stmt -> bindParam(':1', $_POST["coursename"]);
		$stmt -> execute();	
		$coursenameCheck = $stmt->fetch();

		//check if course code exists, returns number 
		$stmt = $pdo -> prepare('SELECT count(cid) as count FROM course WHERE coursecode=:1');
		$stmt -> bindParam(':1', $_POST["coursecode"]);
		$stmt -> execute();	
		$coursecodeCheck = $stmt->fetch();

		// returnes strings based on existence of course name and code
		if ($coursenameCheck["count"]>0 && $coursecodeCheck["count"]>0) {
			echo ("Course name and course code already exist");
		} elseif ($coursenameCheck["count"]>0) {
			echo ("Course name already exist");
		} elseif ($coursecodeCheck["count"]>0) {
			echo ("Course code already exist");
		
		// if course name or code does not exist, creates and retunes cid with coursecode
		} else {
			//create course on DB
			$stmt = $pdo -> prepare('INSERT INTO `course`(`coursecode`, `coursename`, `created`, `creator`, `visibility`, `updated`) VALUES (:2, :1, now(), :3, :4, now())');
			$stmt -> bindParam(':1', $_POST["coursename"]);
			$stmt -> bindParam(':2', $_POST["coursecode"]);
			$stmt -> bindParam(':3', $_SESSION["uid"]);
			$stmt -> bindParam(':4', $_POST["visib"]);
			$stmt -> execute();

			// get created row data to return
			$stmt = $pdo -> prepare('SELECT cid FROM course WHERE coursecode=:1');
			$stmt -> bindParam(':1', $_POST["coursecode"]);
			$stmt -> execute();
			$data = $stmt->fetch();

			echo json_encode($data);
		}
	} else {
		echo json_encode("no write access");
	}
} else {
	echo json_encode("no access");
}

*/