 function submitNewCourse() 
 {
 	if (validateNewCourseSubmit()) {
 		$.ajax({
			type: "POST",
			url:"ajax/createNewCourse.php",
			data: {
				coursename: document.newCourse.coursename.value,
				coursecode: document.newCourse.coursecode.value,
				visib: document.newCourse.visib.value
			},
			success:function(data) {
				
			},
			error:function() {
				console.log("error");
			}
		});
 	};
 }