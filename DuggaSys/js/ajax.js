 function submitNewCourse() 
 {
 	if (validateNewCourseSubmit()) {
 		$.ajax({
 			dataType: "json",
			type: "POST",
			url: "ajax/createNewCourse.php",
			data: {
				coursename: document.newCourse.coursename.value,
				coursecode: document.newCourse.coursecode.value,
				visib: document.newCourse.visib.value
			},
			success:function(data) {
				if (data.cid>0) {
					changeURL("sectioned?courseid="+data.cid);	
				} else if(data==="no access") {
					alert("ap ap ap!");	
				} else if(data==="no write access") {
					alert("You dont have rights to create course.");	
					changeURL("menulist");
				}
				
			},
			error:function() {
				console.log("Something went wrong");
			}
		});
 	};
 }

function submitNewPassword()
{
	if(validateNewPasswordSubmit()) {
		$.ajax({
			dataType: 'json',
			type: 'post',
			url: 'ajax/newpassword.php',
			data: $("form[name=newPassword]").serialize(),
			success: function(data) {
				if(data.success == true) {
					successBox('Password changed!', 'Successfully changed password');
					setTimeout(function() { historyBack(); }, 1500);
				} else {
					warningBox('Password change failed', 'Failed to change password');
				}
			},
			error: function() {
				console.log('Something went horribly wrong');
			}
		});
	}
}
