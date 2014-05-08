 function submitNewCourse() 
 {
 	if (validateNewCourseSubmit()) {
 		$.ajax({
 			dataType: "json",
			type: "POST",
			url:"ajax/createNewCourse.php",
			data: {
				coursename: document.newCourse.coursename.value,
				coursecode: document.newCourse.coursecode.value,
				visib: document.newCourse.visib.value
			},
			success:function(data) {
				console.log(data.cid);
				if (data.cid>0) {
					changeURL("sectioned?courseid="+data.cid);	
				};
				
			},
			error:function() {
				console.log("error");
			}
		});
 	};
 }