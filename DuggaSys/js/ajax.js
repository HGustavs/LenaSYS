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

  function submitNewQuiz(cid, access) 
 {
 	if (validateNewQuizSubmit()) {
 		$.ajax({
 			dataType: "json",
			type: "POST",
			url: "ajax/createQuiz.php",
			data: {
				cid: 1,
				access: "w",
				quizname: document.newQuizForm.quizname.value,
				parameters: document.newQuizForm.parameterinput.value,
				answer: document.newQuizForm.answerinput.value,
				autograde: document.newQuizForm.autogradebox.checked,
				gradesys: document.newQuizForm.gradesysselect.value,
				releasedate: document.newQuizForm.releasedateinput.value,
				deadline: document.newQuizForm.deadlineinput.value,
				activateonsubmit: document.newQuizForm.acivateonsubmitbox.checked
			},
			success:function(data) {
				console.log(data);
				if (data.cid>0) {
					console.log("Edit successfull");
					changeURL("quiz/menu");
					//changeURL("sectioned?courseid="+data.cid);	
				} else if(data==="no access") {
					alert("ap ap ap!");	
				} else if(data==="no write access") {
					alert("You dont have rights to edit quiz.");	
					changeURL("quiz/menu");
				}
			},
			error:function() {
				console.log("Something went wrong");
			}
		});
 	} else {
 		console.log("not valid input")
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