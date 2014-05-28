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

function editQuiz(dataArray) 
{
 	console.log(dataArray);
 	var cid = dataArray[0];
 	var action = dataArray[1];
 	var qid = dataArray[2];

 	if (validateNewQuizSubmit()) {
 		$.ajax({
 			dataType: "json",
			type: "POST",
			url: "ajax/createQuiz.php",
			data: {
				cid: cid,
				action: action, // edit/create
				qid: qid,
				quizname: document.newQuizForm.quizname.value,
				parameter: document.newQuizForm.parameterinput.value,
				answer: document.newQuizForm.answerinput.value,
				autograde: document.newQuizForm.autogradebox.checked,
				quizfile: document.newQuizForm.quizfile.value,
				gradesys: document.newQuizForm.gradesysselect.value,
				releasedate: document.newQuizForm.releasedateinput.value,
				deadline: document.newQuizForm.deadlineinput.value,
				activateonsubmit: document.newQuizForm.acivateonsubmitbox.checked
			},
			success:function(data) {
				console.log(data);
				if (data == "success") {
					console.log("Edit successfull");					
					//changeURL("quiz/menu?courseid=" + cid + "&quizid=" + qid);
					//changeURL("sectioned?courseid="+data.cid);	
					
					// SUPER-HAX-WORKAROUND-DELUX-ULTRA
					setTimeout(function() {
						successBox("Dugga egit", "Edit success!!!");
					}, 500);
					
				} else if(data==="no access") {
					alert("ap ap ap!");	
					$(".xdsoft_noselect").remove();
					//changeURL("quiz/menu");
				} else if(data==="no write access") {
					alert("You dont have rights to edit quiz.");	
					$(".xdsoft_noselect").remove();
					//changeURL("quiz/menu");
				} else if(data==="false_deadline") {
					$("#deadlineinput").css("background-color", "#ff7c6a");
					console.log(data);
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

 function createDefaultQuiz(cid) 
 {
 	
	$.ajax({
		dataType: "json",
		type: "POST",
		url: "ajax/createQuiz.php",
		data: {
			cid: 1,
			action: "create" // edit/create
		},
		success:function(data) {
			//console.log(data);
			changeURL("quiz/edit");
			$("#")
		},
		error:function() {
			changeURL("quiz/menu");
		}
	});
 }

 function getQuizNameForMenu(quizid, cid) {
 	$.ajax({
		dataType: "json",
		type: "POST",
		url: "ajax/getQuizData.php",
		data: {
			qid: quizid,
			cid: cid
		},
		success:function(data) {
			//console.log(data);
			console.log(data);
			$("#admin_title").html(data.name);
		},
		error:function() {
			console.log("Something went wrong");
		}
	});
 }

 function getQuizData(quizid, cid) {
 	addRemoveLoad(true);
 	$.ajax({
		dataType: "json",
		type: "POST",
		url: "ajax/getQuizData.php",
		data: {
			qid: quizid,
			cid: cid
		},
		success:function(data) {
			//console.log(data);
			console.log("A OK");
			$("#quizname").val(data.name);
			$("#parameterinput").val(data.parameter);
			$("#quizAnswerInput").val(data.answer);
			//$("#autogradecheck").prop('checked', !!data.autograde);
			console.log(data.autograde);
			if (data.autograde==1) {
				console.log("autograde checked");
				$("#autogradecheck").attr('checked', true);
			};
			$("#releasedateinput").val(data.release);
			$("#deadlineinput").val(data.deadline);

			$.each($("#gradeSysSelect option"), function( index, value ) {
			  if (value.value==data.gradesystem) {
			  	value.setAttribute('selected', true);	
			  };
			  
			});
			$.each($("#quizfile option"), function( index, value ) {
			  if (value.value==data.quizFile) {
			  	value.setAttribute('selected', true);	
			  	getTemplateInfo(data.quizFile);
			  };
			});



			if ($('#autogradecheck').prop('checked')) {
				$("#quizAnswerInputLabel").html("Answer, saves as string (max 2000 characters) *");
			} else {
				$("#quizAnswerInputLabel").html("Answer, saves as string (max 2000 characters)");
			};
			addRemoveLoad(false);
		},
		error:function() {
			console.log("Something went wrong");
			addRemoveLoad(false);
		}
	});
 }

  function getQuizFiles(cid) 
 {
	$.ajax({
		dataType: "json",
		type: "POST",
		url: "ajax/getQuizFiles.php",
		data: {
			cid: cid
		},
		success:function(data) {
			//console.log(data);

			$.each( data, function( key, value ) {
			  if (value!="." && value!="..") {
			  	$("#quizfile").append("<option value='"+value+"'>"+value+"</option>")
			  };
			});
		},
		error:function() {
			console.log("Something went wrong");
		}
	});
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
